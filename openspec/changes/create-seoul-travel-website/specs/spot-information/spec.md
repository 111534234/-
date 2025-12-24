## ADDED Requirements

### Requirement: The system MUST support a content management system for travel information.

#### Scenario: Create a New Article
- **Given** an administrator is logged in,
- **When** they navigate to the content management page and create a new article with text, images, and videos,
- **Then** the article is saved and a thumbnail is generated for the images.

#### Scenario: View an Article
- **Given** a visitor is on the website,
- **When** they click on an article,
- **Then** the article content is displayed, and the view count for that article is incremented.

#### Scenario: List Articles by Category
- **Given** a visitor is on the website,
- **When** they select a category (e.g., "Food", "Shopping"),
- **Then** a list of articles belonging to that category is displayed.

### Requirement: The website MUST support dual languages (Traditional Chinese and English).

#### Scenario: Switch Language
- **Given** a visitor is on the website,
- **When** they switch the language from Traditional Chinese to English,
- **Then** the UI text and article content should be displayed in English.