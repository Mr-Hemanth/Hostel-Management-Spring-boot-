# Hostel Management System

A complete full-stack web application for managing hostel operations with Spring Boot backend and React frontend.

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running with Docker](#running-with-docker)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Database Schema](#database-schema)
- [API Flow](#api-flow)
- [Database Relationships](#database-relationships)

## Features

### Authentication & Authorization
- User login and registration
- Roles: ADMIN and STUDENT
- Passwords encrypted using BCrypt
- Role-based access to APIs
- JWT-based authentication

### Admin Features
- Add / update / delete rooms
- View all rooms with capacity and occupancy
- Add students
- Allocate and deallocate rooms to students
- View all students and their room details

### Student Features
- Login
- View assigned room details
- View hostel information

## Architecture

### Backend (Spring Boot)
- **Package structure**:
  - controller
  - service
  - repository
  - entity
  - dto
  - security
  - config

- **Implemented**:
  - JWT filter
  - SecurityConfig
  - AuthController
  - RoomController
  - StudentController
  - Global exception handling

### Frontend (React)
- **Folder structure**:
  - components
  - pages
  - services
  - context
  - App.js

- **Implemented**:
  - Login & Register pages
  - Admin dashboard
  - Student dashboard
  - Room management UI
  - Axios interceptor for JWT token
  - Protected routes

## Prerequisites

- Docker and Docker Compose (for Docker deployment)
- Java 17+ (for local backend development)
- Maven 3.6+ (for local backend development)
- Node.js 18+ (for local frontend development)
- MySQL 8.0+ (for local development)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Hostel-management-system
   ```

2. The project structure includes:
   - `hostel-backend/` - Spring Boot application
   - `hostel-frontend/` - React application
   - `schema.sql` - Database schema
   - `docker-compose.yml` - Docker configuration

## Running with Docker (Recommended)

1. Make sure you have Docker and Docker Compose installed
2. Run the following command from the project root:

```bash
docker-compose up --build
```

3. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080

## Running Locally

### Backend Setup
1. Ensure you have Java 17+ and Maven installed
2. Make sure MySQL is running on your system
3. Update the database credentials in `hostel-backend/src/main/resources/application.properties`
4. Navigate to the backend directory and run:

```bash
cd hostel-backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
1. Ensure you have Node.js installed
2. Navigate to the frontend directory and run:

```bash
cd hostel-frontend
npm install
npm start
```

3. The frontend will be available at http://localhost:3000

### Default Admin User
- Email: admin@hostel.com
- Password: admin123 (hashed in the database)

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

### Admin Endpoints (require ADMIN role)
- GET `/api/admin/rooms` - Get all rooms
- POST `/api/admin/rooms` - Create room
- PUT `/api/admin/rooms/{id}` - Update room
- DELETE `/api/admin/rooms/{id}` - Delete room
- PUT `/api/admin/rooms/{roomId}/allocate/{studentId}` - Allocate room to student
- PUT `/api/admin/rooms/{roomId}/deallocate` - Deallocate room
- GET `/api/admin/students` - Get all students
- POST `/api/admin/students/{userId}` - Create student
- GET `/api/admin/users` - Get all users

### Student Endpoints (require STUDENT role)
- GET `/api/student/profile` - Get student profile

## Authentication Flow

1. User logs in with email and password
2. Server validates credentials and generates JWT token
3. Token is returned to the client and stored in localStorage
4. Client includes token in Authorization header for protected requests
5. Server validates token on each protected request

## Database Schema

- MySQL tables:
  - users (id, name, email, password, role)
  - rooms (id, room_number, capacity, occupied)
  - students (id, user_id, room_id)

## API Flow

1. Frontend makes API requests to backend
2. Backend validates JWT token
3. Backend processes request based on user role
4. Backend returns JSON response
5. Frontend handles response and updates UI

## Database Relationships

- User has one-to-one relationship with Student
- Student has many-to-one relationship with Room
- Room has one-to-many relationship with Student (via student_id)