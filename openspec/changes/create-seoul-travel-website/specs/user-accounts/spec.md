## MODIFIED Requirements

### Requirement: Administrators SHALL be able to log in to the system to manage content.

#### Scenario: Admin Login
- **Given** an administrator is on the login page,
- **When** they enter their correct credentials,
- **Then** they should be redirected to the admin dashboard.

#### Scenario: Invalid Admin Login
- **Given** a user is on the login page,
- **When** they enter incorrect credentials,
- **Then** an error message should be displayed.