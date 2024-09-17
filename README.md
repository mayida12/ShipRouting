# Optimal Ship Routing Algorithm

## Project Overview

A web application that calculates efficient ship routes within the Indian Ocean region, optimizing for fuel consumption, travel time, and safety.

### Key Features

- Interactive map interface for route planning
- Server-side route optimization algorithm
- Visualization of optimized routes
- Consideration of environmental factors (winds, currents, waves)

## Technologies Used

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Google Cloud Functions (Python)
- **Map Integration**: Leaflet with react-leaflet
- **Storage**: Google Cloud Storage
- **Deployment**: Firebase Hosting

## Live Demo

[https://ship-routing-app.web.app/](https://ship-routing-app.web.app/)

## Setup and Installation

### Prerequisites

- Node.js (v18 or later)
- npm
- Google Cloud SDK
- Firebase CLI

### Local Development

1. Clone and setup:
   ```bash
   git clone https://github.com/codewithmirza/ship-routing-app.git
   cd ship-routing-app
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

### Cloud Functions Development

1. Navigate to functions directory:
   ```bash
   cd functions
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Deploy functions:
   ```bash
   gcloud functions deploy optimize_route --runtime python39 --trigger-http --allow-unauthenticated
   ```

## Building for Production

1. Build frontend:
   ```bash
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Project Structure

- `pages/`: Next.js pages
- `components/`: React components
- `utils/`: Utility functions
- `styles/`: CSS and Tailwind configs
- `public/`: Static assets
- `functions/`: Cloud Functions code

## Data Sources

- Surface currents and waves: [INCOIS Forecasts](https://incois.gov.in/portal/osf/osf.jsp)
- Surface winds: Available upon request from INCOIS

## Limitations and Future Improvements

- Implement caching for optimization results
- Add user authentication for personalized routes
- Integrate real-time weather data

## Contact

For questions or information, visit the [GitHub repository](https://github.com/codewithmirza/ship-routing-app).

---

Remember to replace placeholder links, email addresses, and other project-specific details as needed.
