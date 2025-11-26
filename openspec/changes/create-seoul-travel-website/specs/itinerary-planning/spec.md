# Spec: Itinerary Planning

This spec defines the requirements for creating and managing travel itineraries.

## ADDED Requirements

### Requirement: Create a New Itinerary

Authenticated users must be able to create a new, empty itinerary.

#### Scenario: Successful creation
- **Given** a logged-in user is on their "My Trips" page,
- **When** they click the "Create New Trip" button,
- **And** they provide a name (e.g., "Seoul 2025") and travel dates,
- **Then** a new itinerary is created and associated with their account,
- **And** they are redirected to the planning page for that itinerary.

### Requirement: Add Spots to Itinerary

Users must be able to add spots to specific days in their itinerary.

#### Scenario: Add a spot from the details page
- **Given** a user is viewing the detail page for a spot,
- **And** they have an active itinerary,
- **When** they click the "Add to Itinerary" button and select a date,
- **Then** the spot is added to their itinerary for the chosen date,
- **And** a confirmation message is displayed.

### Requirement: Manage Itinerary
Users must be able to organize the spots within their itinerary.

#### Scenario: View itinerary schedule
- **Given** a user is on their itinerary planning page,
- **Then** they see a day-by-day breakdown of their trip,
- **And** each day lists the spots they have added.

#### Scenario: Reorder spots
- **Given** a user is on their itinerary planning page,
- **When** they drag and drop a spot to a different position within the same day's list,
- **Then** the new order is saved automatically.

### Requirement: Itinerary Map View

Users must be able to visualize their itinerary on a map.

#### Scenario: View daily spots on a map
- **Given** a user is on their itinerary planning page,
- **When** they select a specific day,
- **Then** a map is displayed showing markers for all spots planned for that day.

#### Scenario: View route between spots
- **Given** a user is viewing the map for a specific day,
- **When** they click a "Show Route" button,
- **Then** the map displays an optimized travel route connecting the spots for that day,
- **And** provides an estimated travel time.
