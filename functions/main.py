# functions/main.py
from firebase_functions import https_fn
from firebase_admin import initialize_app
import requests
from typing import Any, Dict

initialize_app()

@https_fn.on_request()
def search(req: https_fn.Request) -> https_fn.Response:
    query = req.json.get('query')
    if not query:
        return https_fn.Response("No query provided", status=400)

    try:
        response = requests.get(f"https://nominatim.openstreetmap.org/search?format=json&q={query}")
        data = response.json()
        if data:
            coordinates = [float(data[0]['lon']), float(data[0]['lat'])]
            return https_fn.Response(json={"coordinates": coordinates})
        else:
            return https_fn.Response(json={"coordinates": None, "error": "Location not found"}, status=404)
    except Exception as e:
        return https_fn.Response(json={"coordinates": None, "error": str(e)}, status=500)

@https_fn.on_request()
def optimize_route(req: https_fn.Request) -> https_fn.Response:
    data = req.json
    if not data:
        return https_fn.Response("No data provided", status=400)

    ship_type = data.get('shipType')
    ship_dimensions = data.get('shipDimensions')
    start_port = data.get('startPort')
    end_port = data.get('endPort')
    departure_date_time = data.get('departureDateTime')

    if not all([ship_type, ship_dimensions, start_port, end_port, departure_date_time]):
        return https_fn.Response("Missing required fields", status=400)

    try:
        # Here you would typically call your route optimization logic
        # For now, we'll just return a dummy route
        dummy_route = [
            start_port,
            [(start_port[0] + end_port[0]) / 2, (start_port[1] + end_port[1]) / 2],
            end_port
        ]

        return https_fn.Response(json={"optimal_path": dummy_route})
    except Exception as e:
        return https_fn.Response(json={"optimal_path": None, "error": str(e)}, status=500)
