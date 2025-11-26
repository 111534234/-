# Spec: User Accounts

This spec defines the requirements for user authentication and profile management.

## ADDED Requirements

### Requirement: User Registration

Users must be able to create a new account.

#### Scenario: Successful registration with Email
- **Given** a user is on the registration page,
- **When** they fill in their name, a valid email, and a password, and submit the form,
- **Then** their account is created,
- **And** they are logged into the application,
- **And** redirected to the homepage.

#### Scenario: Registration with an existing email
- **Given** a user is on the registration page,
- **When** they try to register with an email that is already in use,
- **Then** an error message is displayed indicating the email is taken.

### Requirement: User Login

Registered users must be able to log into their accounts.

#### Scenario: Successful login
- **Given** a user with a valid account is on the login page,
- **When** they enter their correct email and password and submit the form,
- **Then** they are logged into the application,
- **And** redirected to the homepage.

#### Scenario: Login with incorrect credentials
- **Given** a user is on the login page,
- **When** they enter an incorrect email or password,
- **Then** an error message is displayed.

### Requirement: User Profile Management

Authenticated users must be able to view and edit their profile information.

#### Scenario: View and update profile
- **Given** a logged-in user navigates to their profile page,
- **Then** they can see their current name and email.
- **When** they update their name and save the changes,
- **Then** a success message is shown,
- **And** the updated name is displayed on their profile.
