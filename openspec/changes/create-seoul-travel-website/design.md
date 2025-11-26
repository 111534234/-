# Design: Seoul Travel Website

This document outlines the architectural design for the Seoul Travel Website. The design is based on the technical stack proposed in `PROJECT_PLAN.md` to ensure a scalable, maintainable, and modern application.

## 1. System Architecture

The application will follow a classic client-server architecture:

*   **Frontend (Client)**: A single-page application (SPA) built with React. It will be responsible for all user-facing views, interactions, and client-side state management.
*   **Backend (Server)**: A Node.js application using the Express.js framework. It will expose a RESTful API for the frontend to consume. Its responsibilities include business logic, data processing, user authentication, and communication with the database.
*   **Database**: A MongoDB database. It will store all application data, including user accounts, travel information (attractions, restaurants), and user-generated itineraries.

## 2. Technology Stack

*   **Frontend**: React (with TypeScript)
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB
*   **Mapping Services**: Google Maps API

## 3. Data Models

We will use the following primary data models, to be stored in MongoDB:

*   **User**:
    *   `email` (String, unique)
    *   `password` (String, hashed)
    *   `name` (String)
    *   `provider` (String, e.g., 'local', 'google')
*   **Spot (Attraction/Restaurant/etc.)**:
    *   `name` (String)
    *   `description` (String)
    *   `location` (GeoJSON Point)
    *   `address` (String)
    *   `photos` ([String])
    *   `category` (String, e.g., 'attraction', 'restaurant', 'accommodation')
    *   `openingHours` (String)
*   **Itinerary**:
    *   `userId` (ObjectId, ref: 'User')
    *   `name` (String)
    *   `startDate` (Date)
    *   `endDate` (Date)
    *   `days` ([{ date: Date, spots: [ObjectId] }])
*   **Review**:
    *   `spotId` (ObjectId, ref: 'Spot')
    *   `userId` (ObjectId, ref: 'User')
    *   `rating` (Number, 1-5)
    *   `comment` (String)

## 4. API Design

The backend will expose a RESTful API. Key endpoints will include:

*   `POST /api/auth/register`
*   `POST /api/auth/login`
*   `GET /api/spots` (with query params for search/filter)
*   `GET /api/spots/:id`
*   `POST /api/itineraries`
*   `GET /api/itineraries`
*   `PUT /api/itineraries/:id`
*   `POST /api/spots/:id/reviews`

This design provides a solid foundation for the features outlined in the project plan.
