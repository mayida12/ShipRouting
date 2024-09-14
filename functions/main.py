# functions/main.py
import firebase_admin
from firebase_admin import credentials, storage
import xarray as xr
import numpy as np
from flask import Flask, request, jsonify
from scipy.sparse import csr_matrix
from scipy.sparse.csgraph import dijkstra
from datetime import datetime, timedelta

app = Flask(__name__)

# Initialize Firebase
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {'storageBucket': 'gs://ship-routing-app.appspot.com'})

def download_and_open_dataset(filename):
    bucket = storage.bucket()
    blob = bucket.blob(f'path_to_your_files/{filename}')
    blob.download_to_filename(f'/tmp/{filename}')
    return xr.open_dataset(f'/tmp/{filename}')

def calculate_edge_weight(start, end, datasets, ship_type, ship_dimensions, departure_time):
    # Extract relevant data from datasets
    roms = datasets['ROMS']
    salt = datasets['salt']
    wavewatch = datasets['Wavewatch']
    
    # Calculate distance
    distance = np.sqrt((end[0] - start[0])**2 + (end[1] - start[1])**2)
    
    # Extract data for the specific location and time
    lon_slice = slice(min(start[0], end[0]), max(start[0], end[0]))
    lat_slice = slice(min(start[1], end[1]), max(start[1], end[1]))
    time_slice = slice(departure_time, departure_time + timedelta(hours=1))
    
    # ROMS data
    usurf = roms.USURF.sel(LON=lon_slice, LAT=lat_slice, TAXIS=time_slice).mean().values
    vsurf = roms.VSURF.sel(LON=lon_slice, LAT=lat_slice, TAXIS=time_slice).mean().values
    sst = roms.SST.sel(LON=lon_slice, LAT=lat_slice, TAXIS=time_slice).mean().values
    
    # Salt data
    salt_value = salt.SALT.sel(LON_RHO=lon_slice, LAT_RHO=lat_slice, TAXIS=time_slice).mean().values
    
    # Wavewatch data
    swh = wavewatch.SWH.sel(LON=lon_slice, LAT=lat_slice, TIME=time_slice).mean().values
    ws = wavewatch.WS.sel(LON=lon_slice, LAT=lat_slice, TIME=time_slice).mean().values
    
    # Calculate base weight considering all factors
    weight = distance * (1 + 0.1 * np.sqrt(usurf**2 + vsurf**2) + 0.05 * swh + 0.01 * ws)
    
    # Adjust weight based on ship type and dimensions
    draft = ship_dimensions['draft']
    if ship_type == 'cargo':
        weight *= 1 + 0.1 * draft
    elif ship_type == 'tanker':
        weight *= 1 + 0.15 * draft
    elif ship_type == 'passenger':
        weight *= 1 + 0.05 * draft
    
    # Consider salt concentration for corrosion risk
    weight *= 1 + 0.01 * salt_value
    
    # Consider sea surface temperature for fuel efficiency
    weight *= 1 + 0.005 * abs(sst - 15)  # Assuming optimal temperature is 15°C
    
    return weight

@app.route('/api/optimize_route', methods=['POST'])
def optimize_route():
    data = request.get_json()
    start_port = tuple(data['startPort'])
    end_port = tuple(data['endPort'])
    ship_type = data['shipType']
    ship_dimensions = data['shipDimensions']
    departure_date = datetime.fromisoformat(data['departureDate'])
    
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
            weight = calculate_edge_weight(nodes[i], nodes[j], datasets, ship_type, ship_dimensions, departure_date)
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