# Ship Routing Optimizer

## Project Overview

A web application that optimizes ship routes within the Indian Ocean region, considering factors such as fuel efficiency, travel time, and safety. The system integrates environmental data to provide efficient and secure routes for various types of ships.

## Key Features

- Interactive map interface centered on the Indian Ocean region
- Route optimization algorithm considering environmental factors
- Integration of environmental data (significant wave height, wind speed, sea surface temperature, surface currents, salinity)
- Support for different ship types (Passenger ship, Cargo ship, Tanker)
- Animated route visualization
- Location search functionality
- Weather overlay option

## Technologies Used

### Frontend
- Next.js, React, TypeScript
- Map Integration: Leaflet, React-Leaflet
- 3D Rendering: Three.js
- Styling: Tailwind CSS
- Animation: Framer Motion
- Icons: Lucide React
- Date Handling: date-fns

### Backend
- Python
- Flask
- NumPy, SciPy
- netCDF4 for environmental data processing
- Numba for performance optimization

## Project Structure

### Frontend
- `components/`:
  - `LeafletMap.tsx`: Main map component with route visualization
  - `MapComponent.tsx`: Wrapper for LeafletMap with 3D ship models
  - `RouteForm.tsx`: Form for inputting route parameters
  - `SearchBar.tsx`: Search functionality for locations
  - `ShipRoutingApp.tsx`: Main application component
  - `Sidebar.tsx`: Collapsible sidebar for route input

### Backend
- `app.py`: Flask application with route optimization logic

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ship-routing-optimizer.git
   cd ship-routing-optimizer
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   pip install flask flask-cors netCDF4 numpy scipy numba
   ```

4. Run the frontend development server:
   ```bash
   npm run dev
   ```

5. Run the backend server:
   ```bash
   python backend/app.py
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Open the sidebar and select the ship type.
2. Choose start and end ports by clicking on the map or using the search function.
3. Set the departure date.
4. Click "Calculate Optimal Route" to generate the route.
5. Use the "Start Animation" button to visualize the ship's journey.
6. Toggle the weather overlay for additional environmental information.

## Route Optimization

The backend uses the Dijkstra algorithm to calculate the optimal route, considering:
- Ship type and speed
- Significant wave height
- Wind speed
- Sea surface temperature
- Surface currents
- Salinity

Environmental data is processed from netCDF files and interpolated to a common grid for route calculations.

## Future Improvements

- Implement more sophisticated routing algorithms
- Add support for more ship types and environmental factors
- Enhance the user interface for better data visualization
- Implement real-time data updates
- Develop a mobile app version

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or collaborations, please open an issue on our GitHub repository.

---

Remember to replace placeholder links, usernames, and other project-specific details as needed.
