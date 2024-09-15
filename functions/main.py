# functions/main.py
import firebase_functions as functions
from firebase_admin import initialize_app
import json
import requests

initialize_app()

@functions.https_fn.on_request()
def search(request: functions.https_fn.Request) -> functions.https_fn.Response:
    if request.method != 'POST':
        return functions.https_fn.Response('Method not allowed', status=405)
    
    try:
        data = json.loads(request.data)
        query = data['query']
        response = requests.get(f"https://nominatim.openstreetmap.org/search?format=json&q={query}")
        results = response.json()
        if results:
            coordinates = [float(results[0]['lon']), float(results[0]['lat'])]
            return functions.https_fn.Response(json.dumps({'coordinates': coordinates}), status=200, mimetype='application/json')
        else:
            return functions.https_fn.Response(json.dumps({'coordinates': None}), status=404, mimetype='application/json')
    except Exception as e:
        return functions.https_fn.Response(f'Error: {str(e)}', status=500)
