# Tasks: Create Seoul Travel Website

This document lists the tasks required to implement the Seoul Travel Website, based on the system design in `doc/SD.md`.

1.  **Backend: Setup Project**
    *   Initialize a Spring Boot project with necessary dependencies (Spring Web, Spring Data JPA, MySQL Driver, Spring Security, Thymeleaf).
2.  **Backend: Database Schema**
    *   Create the `Article`, `Banner`, `StatLog`, and `Media` entities based on the ERD in `SD.md`.
3.  **Backend: Implement User Authentication**
    *   Set up Spring Security for admin login (`/admin/login`).
4.  **Backend: Content Management API**
    *   Implement CRUD APIs for articles (`/admin/api/articles`).
    *   Implement image upload and thumbnail generation logic.
5.  **Backend: Banner Management API**
    *   Implement CRUD APIs for banners (`/admin/api/banners`).
6.  **Backend: Statistics Service**
    *   Implement service to log page views and banner clicks.
    *   Implement API to retrieve statistics (`/admin/api/stats/summary`).
7.  **Frontend: Admin UI**
    *   Create Thymeleaf templates for admin pages: login, content management, banner management, and statistics.
8.  **Frontend: Public UI**
    *   Create Thymeleaf templates for public pages: home, content list, and content detail.
    *   Implement responsive design and bilingual support.
9.  **Deployment**
    *   Deploy the application.
    *   Set up regular database backups.
10. **Validation**
    *   Perform vulnerability scanning (OWASP Top 10).
    *   Verify page load times.