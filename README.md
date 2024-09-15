# Optimal Ship Routing Algorithm

## Project Overview

The Optimal Ship Routing Algorithm project is a static web application that calculates efficient ship routes within the Indian Ocean region. It focuses on optimizing routes based on factors such as fuel consumption, travel time, and safety considerations.

### Key Features

- Interactive map interface for route planning
- Client-side route optimization algorithm
- Visualization of optimized routes
- Consideration of environmental factors (winds, currents, waves)

## Technologies Used

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Map Integration**: Leaflet with react-leaflet
- **Optimization**: Custom client-side algorithm
- **Deployment**: Firebase Hosting

## Live Demo

Visit the live application at [https://ship-routing-app.web.app/](https://ship-routing-app.web.app/)

## Setup and Installation

### Prerequisites

- Node.js (v18 or later)
- npm

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/codewithmirza/ship-routing-app.git
   cd ship-routing-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

1. Create a production build:
   ```bash
   npm run build
   ```

2. The static files will be generated in the `out` directory.

## Project Structure

- `pages/`: Next.js pages and routing
- `components/`: React components, including LeafletMap
- `utils/`: Utility functions, including route optimization logic
- `styles/`: CSS and Tailwind configurations
- `public/`: Static assets

## Data Sources

- Surface currents and waves data: [INCOIS Forecasts](https://incois.gov.in/portal/osf/osf.jsp)
- Surface winds data: Available upon request from INCOIS

## Limitations and Future Improvements

- The client-side optimization may be less efficient for complex routes
- Consider implementing a backend service for more intensive computations
- Explore integration with real-time weather APIs for more accurate routing

## Contact

For any questions or further information, please visit the [GitHub repository](https://github.com/codewithmirza/ship-routing-app).

---

Remember to replace placeholder links, email addresses, and other project-specific details as needed.
