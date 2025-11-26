# Spec: Reviews and Ratings

This spec defines the requirements for user-submitted reviews and ratings for travel spots.

## ADDED Requirements

### Requirement: Submit a Review

Authenticated users must be able to submit a rating and a written comment for a travel spot.

#### Scenario: Successfully submit a review
- **Given** a logged-in user is on the detail page for a spot they have visited,
- **When** they select a star rating (1-5) and write a comment, and submit the form,
- **Then** their review is saved,
- **And** it appears in the list of reviews for that spot.

#### Scenario: Submit a review without a rating
- **Given** a logged-in user is on the detail page for a spot,
- **When** they attempt to submit a review without providing a star rating,
- **Then** an error message is displayed, and the review is not submitted.

### Requirement: View Reviews

Users must be able to see all reviews submitted for a particular spot.

#### Scenario: View reviews on spot detail page
- **Given** any user is on the detail page for a spot,
- **Then** they can see a section dedicated to user reviews,
- **And** this section displays a list of all reviews, including the user's name, rating, and comment for each.
- **And** the page displays the calculated average rating for the spot.
