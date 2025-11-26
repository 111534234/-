# Spec: Itinerary Sharing

This spec defines the requirements for sharing a user's travel itinerary with others.

## ADDED Requirements

### Requirement: Generate a Shareable Link

Authenticated users must be able to generate a unique, public link to one of their itineraries.

#### Scenario: User creates a shareable link
- **Given** a logged-in user is viewing one of their itineraries,
- **When** they click a "Share" button,
- **Then** the system generates a unique and private URL for that itinerary,
- **And** this URL is displayed to the user so they can copy it.

### Requirement: View a Shared Itinerary

Anyone with a shareable link must be able to view the corresponding itinerary without needing to log in.

#### Scenario: A non-logged-in user accesses a shared link
- **Given** a person has received a shareable link for an itinerary,
- **When** they navigate to that URL in their browser,
- **Then** they see a read-only version of the itinerary,
- **And** this view includes the day-by-day schedule of spots and a map view.
- **But** they cannot edit the itinerary.
