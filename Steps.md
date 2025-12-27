# Hostel Management System - Setup and Running Guide

This guide provides step-by-step instructions to set up and run the Hostel Management System with both backend and frontend components.

## Prerequisites

Before starting, ensure you have the following installed on your system:
- Java 17 or higher
- Maven 3.6.0 or higher
- Node.js (v14 or higher) and npm
- MySQL 8.0 or higher
- Git (optional, for cloning the repository)
- Docker and Docker Compose (for containerized deployment)

## Step 1: Database Setup

1. Install and start MySQL server on your system
2. Create a new database for the hostel management system:
   ```sql
   CREATE DATABASE hostel_management;
   ```
3. Execute the schema file to create tables and insert sample data:
   ```sql
   USE hostel_management;
   SOURCE /path/to/your/schema.sql;
   ```

## Step 2: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd /Users/apple/Desktop/Hemanth.K's Projects/Hostel-management-system/hostel-backend
   ```

2. Open the `application.properties` file and update the database connection settings:
   ```properties
   # Database configuration
   spring.datasource.url=jdbc:mysql://localhost:3306/hostel_management
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```

3. Build the backend application:
   ```bash
   mvn clean install
   ```

4. Start the backend server:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

## Step 3: Frontend Setup

1. Open a new terminal window/tab and navigate to the frontend directory:
   ```bash
   cd /Users/apple/Desktop/Hemanth.K's Projects/Hostel-management-system/hostel-frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```
   The frontend will start on `http://localhost:3000`

## Step 4: Access the Application

1. Open your web browser and navigate to `http://localhost:3000`

2. You can log in with the following default credentials:
   - **Admin**: 
     - Email: `admin@hostel.com`
     - Password: `admin123`
   - **Student**: 
     - Email: Use a student account you create

## Step 5: Using Docker (Alternative Method)

If you prefer to run the application using Docker:

1. Make sure Docker and Docker Compose are installed on your system

2. Navigate to the project root directory:
   ```bash
   cd /Users/apple/Desktop/Hemanth.K's Projects/Hostel-management-system
   ```

3. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

4. The application will be available at `http://localhost:3000`

5. The Docker setup includes:
   - MySQL database container (port 3306)
   - Backend Spring Boot container (port 8080)
   - Frontend React container (port 3000)
   - Automatic database initialization with schema.sql

6. To stop the containers:
   ```bash
   docker-compose down
   ```

7. To view container logs:
   ```bash
   docker-compose logs
   ```

## Features Overview

### Admin Dashboard Features:
- **Room Management**: Add, update, delete rooms with capacity information
- **Student Management**: View all students and their room assignments
- **Room Allocation**: Assign students to rooms and deallocate specific students
- **Selective Deallocation**: Choose which specific student to deallocate from a room
- **Maintenance Requests**: View and manage maintenance requests from students
- **Room Booking Requests**: Process room booking requests from students
- **Search Functionality**: Search rooms and students by various criteria
- **Real-time Updates**: Dashboard updates automatically with latest information
- **Statistics Dashboard**: View occupancy rates, available rooms, and student stats

### Student Dashboard Features:
- **Profile Information**: View personal details and room assignment
- **Room Information**: See assigned room number, capacity, and occupancy
- **Maintenance Requests**: Submit and track maintenance requests
- **Room Booking**: View available rooms and request room changes
- **Real-time Updates**: Information refreshes automatically
- **Available Rooms**: Browse and request available rooms

### Additional Features:
- **Maintenance Management**: Track and manage maintenance requests for rooms
- **Room Booking System**: Students can request specific rooms and admins can approve/reject
- **Advanced Search**: Search functionality for rooms and students in admin dashboard
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Security**: JWT-based authentication with role-based access control
- **Data Validation**: Frontend and backend validation to ensure data integrity

## Troubleshooting

### Common Issues:

1. **Database Connection Error**: 
   - Ensure MySQL is running
   - Verify database credentials in `application.properties`

2. **Port Already in Use**:
   - Check if ports 8080 (backend) and 3000 (frontend) are available
   - Kill existing processes if needed: `lsof -i :8080` or `lsof -i :3000`

3. **Frontend Cannot Connect to Backend**:
   - Verify that the backend is running on `http://localhost:8080`
   - Check the proxy settings in `package.json` if needed

4. **Maven Build Issues**:
   - Ensure Java and Maven are properly installed
   - Run `mvn clean compile` to check for compilation errors

5. **Docker Issues**:
   - Make sure Docker has enough resources allocated
   - Check Docker logs: `docker-compose logs`

### API Endpoints:
- Backend API: `http://localhost:8080/api`
- Authentication: `/api/auth/login`, `/api/auth/register`
- Admin endpoints: `/api/admin/rooms`, `/api/admin/students`
- Student endpoints: `/api/student/profile`, `/api/student/maintenance-requests`
- Room Booking: `/api/student/room-booking-requests`, `/api/admin/room-booking-requests`

## Production Deployment

For production deployment:

1. Update database connection settings for production
2. Set up environment variables for sensitive information
3. Consider using a reverse proxy (nginx) for the frontend
4. Configure proper SSL certificates
5. Set up a production-grade database with backups
6. Use environment-specific configurations
7. Implement proper logging and monitoring
8. Set up automated builds and deployments

## Additional Notes

- The application uses JWT-based authentication
- Passwords are encrypted using BCrypt
- The system includes role-based access control (Admin/Student)
- All data is persisted in the MySQL database
- The application is responsive and works on different screen sizes
- The UI has been enhanced with a modern, clean design
- The system includes comprehensive error handling
- Real-time data synchronization keeps information up-to-date