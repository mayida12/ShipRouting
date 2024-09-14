# functions/main.py
import firebase_admin
from firebase_admin import credentials, storage
import xarray as xr
import numpy as np
from flask import Flask, request, jsonify
from scipy.sparse import csr_matrix
from scipy.sparse.csgraph import dijkstra

app = Flask(__name__)

# Initialize Firebase
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {'storageBucket': 'gs://ship-routing-app.appspot.com'})

def download_and_open_dataset(filename):
    bucket = storage.bucket()
    blob = bucket.blob(f'path_to_your_files/{filename}')
    blob.download_to_filename(f'/tmp/{filename}')
    return xr.open_dataset(f'/tmp/{filename}')

def calculate_edge_weight(start, end, datasets, optimization_preference):
    # Extract relevant data from datasets
    currents = datasets['ROMS'].sel(LON=slice(min(start[0], end[0]), max(start[0], end[0])),
                                    LAT=slice(min(start[1], end[1]), max(start[1], end[1])))
    waves = datasets['Wavewatch'].sel(LON=slice(min(start[0], end[0]), max(start[0], end[0])),
                                      LAT=slice(min(start[1], end[1]), max(start[1], end[1])))
    
    # Calculate distance
    distance = np.sqrt((end[0] - start[0])**2 + (end[1] - start[1])**2)
    
    # Calculate average current speed and direction
    u_current = currents.USURF.mean().values
    v_current = currents.VSURF.mean().values
    current_speed = np.sqrt(u_current**2 + v_current**2)
    current_direction = np.arctan2(v_current, u_current)
    
    # Calculate average wave height and wind speed
    wave_height = waves.SWH.mean().values
    wind_speed = waves.WS.mean().values
    
    # Calculate weight based on optimization preference
    if optimization_preference == 'fuel':
        weight = distance * (1 + current_speed + 0.1 * wave_height)
    elif optimization_preference == 'time':
        weight = distance / (1 + 0.1 * current_speed - 0.05 * wave_height)
    elif optimization_preference == 'safety':
        weight = distance * (1 + 0.2 * wave_height + 0.1 * wind_speed)
    else:
        weight = distance
    
    return weight

@app.route('/optimize_route', methods=['POST'])
def optimize_route():
    data = request.get_json()
    start_port = data['startPort']
    end_port = data['endPort']
    optimization_preference = data['optimizationPreference']
    
    # Download and open datasets
    datasets = {
        'ROMS': download_and_open_dataset('ROMS_25_08_2024_to_03_09_2024.nc'),
        'salt': download_and_open_dataset('salt_25_08_to_03_09_2024.nc'),
        'Wavewatch': download_and_open_dataset('Wavewatch_III_25_28_2024_to_03_09_2024.nc')
    }
    
    # Create graph
    lon_range = np.linspace(datasets['ROMS'].LON.min(), datasets['ROMS'].LON.max(), 100)
    lat_range = np.linspace(datasets['ROMS'].LAT.min(), datasets['ROMS'].LAT.max(), 100)
    nodes = [(lon, lat) for lon in lon_range for lat in lat_range]
    n_nodes = len(nodes)
    
    # Create adjacency matrix
    adj_matrix = np.zeros((n_nodes, n_nodes))
    for i in range(n_nodes):
        for j in range(i+1, n_nodes):
            weight = calculate_edge_weight(nodes[i], nodes[j], datasets, optimization_preference)
            adj_matrix[i, j] = weight
            adj_matrix[j, i] = weight
    
    # Convert to sparse matrix
    graph = csr_matrix(adj_matrix)
    
    # Find start and end node indices
    start_index = np.argmin([(node[0] - start_port[0])**2 + (node[1] - start_port[1])**2 for node in nodes])
    end_index = np.argmin([(node[0] - end_port[0])**2 + (node[1] - end_port[1])**2 for node in nodes])
    
    # Run Dijkstra's algorithm
    distances, predecessors = dijkstra(graph, indices=start_index, return_predecessors=True)
    
    # Reconstruct path
    path = []
    current_node = end_index
    while current_node != start_index:
        path.append(nodes[current_node])
        current_node = predecessors[current_node]
    path.append(nodes[start_index])
    path.reverse()
    
    return jsonify({
        'optimal_path': path,
        'optimal_path_length': distances[end_index]
    })

if __name__ == '__main__':
    app.run(debug=True)