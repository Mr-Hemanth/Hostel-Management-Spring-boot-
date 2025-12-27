# Hostel Management System

A comprehensive full-stack web application for managing hostel operations, built with Spring Boot (backend) and React (frontend) with MySQL database and Docker deployment.

## 🚀 Features

### Admin Dashboard
- **Room Management**: Add, update, delete rooms with capacity information
- **Student Management**: View all students and their room assignments
- **Room Allocation**: Assign students to rooms and selectively deallocate specific students
- **Maintenance Requests**: View and manage maintenance requests from students
- **Room Booking Requests**: Process room booking requests from students
- **Search Functionality**: Search rooms and students by various criteria
- **Real-time Updates**: Dashboard updates automatically with latest information
- **Statistics Dashboard**: View occupancy rates, available rooms, and student stats

### Student Dashboard
- **Profile Information**: View personal details and room assignment
- **Room Information**: See assigned room number, capacity, and occupancy
- **Maintenance Requests**: Submit and track maintenance requests
- **Room Booking**: Browse available rooms and request room changes
- **Real-time Updates**: Information refreshes automatically

### Additional Features
- **Maintenance Management**: Track and manage maintenance requests for rooms
- **Room Booking System**: Students can request specific rooms and admins can approve/reject
- **Advanced Search**: Search functionality for rooms and students in admin dashboard
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Security**: JWT-based authentication with role-based access control
- **Data Validation**: Frontend and backend validation to ensure data integrity

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Security**: Spring Security with JWT Authentication
- **ORM**: Spring Data JPA
- **Validation**: Bean Validation (JSR 303)

### Frontend
- **Framework**: React 18.2.0
- **Router**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS with responsive design
- **State Management**: React Context API

### Deployment
- **Containerization**: Docker & Docker Compose
- **Build Tools**: Maven (Backend), npm (Frontend)

## 📋 Database Schema

The system includes the following tables:
- `users`: Stores user information (name, email, password, role)
- `rooms`: Stores room information (number, capacity, occupancy)
- `students`: Links users to rooms
- `maintenance_requests`: Tracks maintenance requests
- `room_booking_requests`: Manages room booking requests

## 🔐 Authentication & Authorization

- JWT-based authentication system
- Role-based access control (Admin/Student)
- Passwords encrypted with BCrypt
- Secure session management

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6.0 or higher
- Node.js (v14 or higher) and npm
- MySQL 8.0 or higher
- Docker and Docker Compose (for containerized deployment)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hostel-management-system
   ```

2. **Database Setup**
   ```sql
   CREATE DATABASE hostel_management;
   USE hostel_management;
   SOURCE schema.sql;
   ```

3. **Backend Setup**
   ```bash
   cd hostel-backend
   # Update application.properties with your database credentials
   mvn clean install
   mvn spring-boot:run
   ```

4. **Frontend Setup**
   ```bash
   cd ../hostel-frontend
   npm install
   npm start
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api

### Docker Deployment
```bash
# From project root directory
docker-compose up --build
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Admin Endpoints
- `GET /api/admin/rooms` - Get all rooms
- `POST /api/admin/rooms` - Create room
- `PUT /api/admin/rooms/{id}` - Update room
- `DELETE /api/admin/rooms/{id}` - Delete room
- `PUT /api/admin/rooms/{roomId}/allocate/{studentId}` - Allocate room to student
- `PUT /api/admin/rooms/{roomId}/deallocate-student/{studentId}` - Deallocate specific student
- `GET /api/admin/students` - Get all students
- `GET /api/admin/room-booking-requests` - Get all booking requests
- `PUT /api/admin/room-booking-requests/{id}` - Update booking request status

### Student Endpoints
- `GET /api/student/profile` - Get student profile
- `GET /api/student/room-booking-requests` - Get student's booking requests
- `POST /api/student/room-booking-requests` - Create booking request
- `GET /api/student/maintenance-requests` - Get student's maintenance requests
- `POST /api/student/maintenance-requests` - Create maintenance request

## 🧪 Testing

### Backend Testing
- Unit tests using JUnit 5
- Integration tests for API endpoints
- Security tests for authentication

### Frontend Testing
- Component testing with React Testing Library
- API integration tests

## 🚀 Production Deployment

1. Update database connection settings for production
2. Set up environment variables for sensitive information
3. Configure reverse proxy (nginx) for the frontend
4. Set up SSL certificates
5. Configure production-grade database with backups
6. Implement proper logging and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
- Check the [Steps.md](Steps.md) file for detailed setup instructions
- Create an issue in the repository
- Contact the development team

## 🙏 Acknowledgments

- Spring Boot Framework
- React.js
- MySQL Database
- Docker Containerization
- All open-source libraries used in this project

---

Built with ❤️ for efficient hostel management!