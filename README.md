# Optimal Ship Routing Algorithm

## Project Overview

The Optimal Ship Routing Algorithm project aims to develop a versatile and efficient algorithm for optimizing ship routes, focusing on fuel consumption, travel time, passenger comfort, and route safety. This application will be particularly beneficial for the Indian shipping industry, enabling better route planning within the Indian Ocean region.

### Problem Statement

Given the importance of fuel efficiency and safety in shipping, optimizing ship routes based on various parameters (fuel consumption, travel time, weather conditions, etc.) is crucial. The goal is to create an application that can suggest optimal routes between ports in the Indian Ocean, considering factors like surface winds, currents, and waves.

### Technologies Used

- **Frontend**: Next.js, Tailwind CSS, Leaflet
- **Backend**: Firebase Functions
- **Database**: Firebase Realtime Database or Cloud Firestore
- **Optimization Algorithm**: Custom implementation in Node.js

## Features

- **Map Integration**: Display ship routes and environmental data using Leaflet.
- **Real-time Data**: Update ship routes and environmental data in real-time using Firebase.
- **Optimization Algorithm**: Calculate optimal routes considering fuel consumption, travel time, and safety.
- **User Interface**: Interactive forms for user input (e.g., ports, preferences, time frame).

## Setup and Installation

### Prerequisites

- Node.js (v14 or later)
- Firebase CLI
- Next.js and Tailwind CSS

### Frontend Setup

1. **Clone the Repository**

    ```bash
    git clone https://github.com/codewithmirza/optimal-ship-routing.git
    cd optimal-ship-routing
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Run the Development Server**

    ```bash
    npm run dev
    ```

### Backend Setup

1. **Install Firebase CLI**

    ```bash
    npm install -g firebase-tools
    ```

2. **Initialize Firebase Functions**

    ```bash
    firebase init functions
    ```

3. **Install Dependencies**

    ```bash
    cd functions
    npm install
    ```

4. **Deploy Firebase Functions**

    ```bash
    firebase deploy --only functions
    ```

## Usage

1. **Frontend**: Navigate to `http://localhost:3000` to view the application. Use the input forms to select ports, optimization preferences, and specify the time frame for the route.

2. **Backend**: The Firebase Functions handle backend logic, including data processing and route optimization. Ensure that the functions are deployed and accessible via Firebase Hosting.

3. **Data Handling**: Data extracted from .nc files will be stored in Firebase Realtime Database or Cloud Firestore. Ensure the data structure is set up according to the project's needs.

## Deployment

1. **Deploy Frontend**

    ```bash
    firebase deploy --only hosting
    ```

2. **Deploy Functions**

    ```bash
    firebase deploy --only functions
    ```

## Dataset

- Short-term forecasts of surface currents and waves: [INCOIS Forecasts](https://incois.gov.in/portal/osf/osf.jsp)
- Surface winds forecasts: Provided by INCOIS upon request

## References

- [Indian National Center for Ocean Information Services (INCOIS)](https://incois.gov.in/)
- [Video on Ship Routing](https://www.youtube.com/watch?v=ct9v-mQgYqE)
- [Additional Video on Ship Routing](https://www.youtube.com/watch?v=wCTdHRTWtNI)


## Contact

For any questions or further information, please contact the project team at [mail@calistixinnovators](mailto:manwaarullahb@gmail.com).

---

Feel free to adjust the contact details, links, and any other project-specific information as needed.
