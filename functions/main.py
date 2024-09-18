from firebase_functions import https_fn
from firebase_admin import initialize_app, firestore, storage
import tempfile
import os
import netCDF4 as nc
import numpy as np
import math
import heapq
from numba import njit
from scipy.interpolate import NearestNDInterpolator
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

initialize_app()

app = Flask(__name__)
CORS(app)

# Constants (scaling factors for ship speeds)
SPEED_SCALING = {
    "passenger": 20,  # Knots
    "cargo": 15,
    "tanker": 10
}

@njit
def haversine(lon1, lat1, lon2, lat2):
    R = 6371  # Earth radius in kilometers
    dlon = math.radians(lon2 - lon1)
    dlat = math.radians(lat2 - lat1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c  # Distance in kilometers

def load_data(file_path):
    return nc.Dataset(file_path)

def interpolate_to_grid(src_data, src_lon, src_lat, dst_lon, dst_lat):
    src_lon, src_lat = np.meshgrid(src_lon, src_lat)
    src_points = np.column_stack((src_lon.ravel(), src_lat.ravel()))
    
    dst_lonv, dst_latv = np.meshgrid(dst_lon, dst_lat)
    dst_points = np.column_stack((dst_lonv.ravel(), dst_latv.ravel()))
    
    interpolator = NearestNDInterpolator(src_points, src_data.ravel())
    return interpolator(dst_points).reshape(len(dst_lat), len(dst_lon))

def interpolate_data(wave_file, roms_file, salt_file):
    wave_data = load_data(wave_file)
    roms_data = load_data(roms_file)
    salt_data = load_data(salt_file)

    lon = wave_data.variables['LON'][:].data
    lat = wave_data.variables['LAT'][:].data

    swh = wave_data.variables['SWH'][0].data
    ws = wave_data.variables['WS'][0].data
    
    roms_lon = roms_data.variables['LON'][:].data
    roms_lat = roms_data.variables['LAT'][:].data
    sst = interpolate_to_grid(roms_data.variables['SST'][0, 0].data, roms_lon, roms_lat, lon, lat)
    usurf = interpolate_to_grid(roms_data.variables['USURF'][0, 0].data, roms_lon, roms_lat, lon, lat)
    vsurf = interpolate_to_grid(roms_data.variables['VSURF'][0, 0].data, roms_lon, roms_lat, lon, lat)
    
    salt_lon = salt_data.variables['LON_RHO'][:].data
    salt_lat = salt_data.variables['LAT_RHO'][:].data
    salt = interpolate_to_grid(salt_data.variables['SALT'][0, 0].data, salt_lon, salt_lat, lon, lat)

    wave_data.close()
    roms_data.close()
    salt_data.close()

    return lon, lat, swh, ws, sst, usurf, vsurf, salt

@njit
def create_graph(lon, lat):
    num_lon, num_lat = len(lon), len(lat)
    edges = []
    for i in range(num_lon):
        for j in range(num_lat):
            if i > 0:
                edges.append((i*num_lat+j, (i-1)*num_lat+j, haversine(lon[i], lat[j], lon[i-1], lat[j])))
            if i < num_lon - 1:
                edges.append((i*num_lat+j, (i+1)*num_lat+j, haversine(lon[i], lat[j], lon[i+1], lat[j])))
            if j > 0:
                edges.append((i*num_lat+j, i*num_lat+(j-1), haversine(lon[i], lat[j], lon[i], lat[j-1])))
            if j < num_lat - 1:
                edges.append((i*num_lat+j, i*num_lat+(j+1), haversine(lon[i], lat[j], lon[i], lat[j+1])))
    return edges

@njit
def dijkstra(start, end, edges, num_nodes, speed):
    distances = np.full(num_nodes, np.inf)
    distances[start] = 0
    predecessors = np.full(num_nodes, -1, dtype=np.int32)
    queue = [(0.0, start)]

    while queue:
        current_distance, current_node = heapq.heappop(queue)
        
        if current_node == end:
            break
        
        for edge in edges:
            if edge[0] == current_node:
                neighbor, weight = edge[1], edge[2]
                dist = current_distance + weight / speed
                if dist < distances[neighbor]:
                    distances[neighbor] = dist
                    predecessors[neighbor] = current_node
                    heapq.heappush(queue, (float(dist), neighbor))
    
    path = []
    current = end
    while current != -1:
        path.append(current)
        current = predecessors[current]
    path.reverse()
    
    return distances[end], path

@njit
def find_nearest_index(lon_array, lat_array, lon_val, lat_val):
    lon_idx = np.abs(lon_array - lon_val).argmin()
    lat_idx = np.abs(lat_array - lat_val).argmin()
    return lon_idx, lat_idx

@https_fn.on_request()
def api(req: https_fn.Request) -> https_fn.Response:
    with app.request_context(req.environ):
        return app.full_dispatch_request()

@app.route('/search', methods=['POST', 'OPTIONS'])
def search():
    if request.method == 'OPTIONS':
        return '', 204
    
    query = request.json.get('query')
    if not query:
        return jsonify({"error": "No query provided"}), 400

    try:
        response = requests.get(f"https://nominatim.openstreetmap.org/search?format=json&q={query}")
        data = response.json()
        if data:
            coordinates = [float(data[0]['lon']), float(data[0]['lat'])]
            return jsonify({"coordinates": coordinates})
        else:
            return jsonify({"coordinates": None, "error": "Location not found"}), 404
    except Exception as e:
        return jsonify({"coordinates": None, "error": str(e)}), 500

@app.route('/optimize_route', methods=['POST', 'OPTIONS'])
def optimize_route():
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {'Access-Control-Allow-Origin': '*'}

    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    ship_type = data.get('shipType')
    start_port = data.get('startPort')
    end_port = data.get('endPort')
    departure_date = data.get('departureDate')

    if not all([ship_type, start_port, end_port, departure_date]):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Download necessary files from Cloud Storage
        bucket = storage.bucket()
        wave_blob = bucket.blob('Wavewatch_III_25_28_2024_to_03_09_2024.nc')
        roms_blob = bucket.blob('ROMS_25_08_2024_to_03_09_2024.nc')
        salt_blob = bucket.blob('salt_25_08_to_03_09_2024.nc')

        with tempfile.TemporaryDirectory() as tmpdir:
            wave_file = os.path.join(tmpdir, 'wave.nc')
            roms_file = os.path.join(tmpdir, 'roms.nc')
            salt_file = os.path.join(tmpdir, 'salt.nc')

            wave_blob.download_to_filename(wave_file)
            roms_blob.download_to_filename(roms_file)
            salt_blob.download_to_filename(salt_file)

            lon, lat, swh, ws, sst, usurf, vsurf, salt = interpolate_data(wave_file, roms_file, salt_file)

        # Convert any remaining masked arrays to regular arrays
        lon = np.array(lon)
        lat = np.array(lat)
        swh = np.array(swh)
        ws = np.array(ws)
        sst = np.array(sst)
        usurf = np.array(usurf)
        vsurf = np.array(vsurf)
        salt = np.array(salt)

        edges = create_graph(lon, lat)

        start_lon, start_lat = start_port
        end_lon, end_lat = end_port

        start_i, start_j = find_nearest_index(lon, lat, start_lon, start_lat)
        end_i, end_j = find_nearest_index(lon, lat, end_lon, end_lat)

        start_idx = start_i * len(lat) + start_j
        end_idx = end_i * len(lat) + end_j

        speed = SPEED_SCALING[ship_type]

        num_nodes = len(lon) * len(lat)
        distance, path = dijkstra(start_idx, end_idx, edges, num_nodes, speed)

        optimized_route = []
        for node in path:
            i, j = divmod(node, len(lat))
            optimized_route.append([float(lon[i]), float(lat[j])])

        # Save the data to Firestore
        db = firestore.client()
        doc_ref = db.collection('optimized_routes').document()
        doc_ref.set({
            'shipType': ship_type,
            'startPort': start_port,
            'endPort': end_port,
            'departureDate': departure_date,
            'optimizedRoute': optimized_route,
            'distance': distance,
            'numSteps': len(path),
            'avgStepDistance': distance / (len(path) - 1)
        })

        return jsonify({
            "distance": float(distance),
            "optimized_route": optimized_route,
            "num_steps": len(path),
            "avg_step_distance": float(distance / (len(path) - 1))
        }), 200, headers
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)