2# Design: Seoul Travel Website

This document outlines the system architecture for the Seoul Travel Website, based on `doc/SA.md`.

## System Layer Overview

The system will use a standard layered architecture:

-   **WebUI (Frontend):** Displays data and handles user interaction. It will be responsive (RWD) and support Traditional Chinese and English.
-   **Controller/API (Backend):** Receives frontend requests, validates input, and returns results.
-   **Service Layer:** Contains core business logic, such as image processing (thumbnail generation), content management, and data statistics.
-   **Data Layer (Repository/DB):** Handles CRUD access to the database.

## System Architecture Diagram

```mermaid
graph TD
    A[User/Admin] -->|Browser RWD| B(WebUI Frontend)
    B -->|HTTPS Request| C(Controller)
    C --> D(Service Layer)
    D --> E(Repository)
    E --> F[(Database)]

    subgraph Core Backend Services
        D --> D1[Content Management]
        D --> D2[Image Processing (Auto-thumbnail)]
        D --> D3[Data Statistics]
        D1 & D2 & D3 --> E
    end

    C -- Sensitive Data -->|SFTP/HTTPS| G(External Data Exchange/Backup)
```