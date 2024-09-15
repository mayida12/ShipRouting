# functions/main.py
import firebase_functions as functions
import requests
from datetime import datetime
from typing import List, Dict, Any

def search(request: functions.Request) -> functions.Response:
    query = request.json.get('query')
    if not query:
        return functions.Response("No query provided", status=400)

    try:
        response = requests.get(f"https://nominatim.openstreetmap.org/search?format=json&q={query}")
        data = response.json()
        if data:
            coordinates = [float(data[0]['lon']), float(data[0]['lat'])]
            return functions.Response({"coordinates": coordinates})
        else:
            return functions.Response({"coordinates": None, "error": "Location not found"}, status=404)
    except Exception as e:
        return functions.Response({"coordinates": None, "error": str(e)}, status=500)

def optimize_route(request: functions.Request) -> functions.Response:
    data = request.json
    if not data:
        return functions.Response("No data provided", status=400)

    ship_type = data.get('shipType')
    ship_dimensions = data.get('shipDimensions')
    start_port = data.get('startPort')
    end_port = data.get('endPort')
    departure_date_time = data.get('departureDateTime')

    if not all([ship_type, ship_dimensions, start_port, end_port, departure_date_time]):
        return functions.Response("Missing required fields", status=400)

    try:
        # Here you would typically call your route optimization logic
        # For now, we'll just return a dummy route
        dummy_route = [
            start_port,
            [(start_port[0] + end_port[0]) / 2, (start_port[1] + end_port[1]) / 2],
            end_port
        ]

        return functions.Response({"optimal_path": dummy_route})
    except Exception as e:
        return functions.Response({"optimal_path": None, "error": str(e)}, status=500)

search_function = functions.https_fn.on_request(search)
optimize_route_function = functions.https_fn.on_request(optimize_route)
