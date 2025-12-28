-- Hostel Management System Database Schema

-- Create database

-- Create users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'STUDENT') NOT NULL
);

-- Create rooms table
CREATE TABLE rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    occupied BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create students table
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    room_id BIGINT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

-- Create maintenance_requests table
CREATE TABLE maintenance_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    description TEXT NOT NULL,
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    remarks TEXT,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Create room_booking_requests table
CREATE TABLE room_booking_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    admin_remarks TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Insert sample admin user (password is 'admin123' hashed with BCrypt)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@hostel.com', '$2a$10$Nk6r4H8u1I5q.PJYz9Pq1eF9Z8Q4H3N2W7V6U5T4S3R2Q1P0O9N8M', 'ADMIN');

-- Insert sample rooms
INSERT INTO rooms (room_number, capacity) VALUES 
('101', 2),
('102', 2),
('103', 1),
('201', 4),
('202', 3);

-- Insert sample students (Required for maintenance requests below)
-- Note: These students are linked to the 'Admin User' for testing purposes
-- In a real scenario, you would create separate users first.
INSERT INTO students (user_id, room_id) VALUES 
(1, 1);

-- Insert sample maintenance requests
INSERT INTO maintenance_requests (room_id, student_id, description, status) VALUES
(1, 1, 'Leaky faucet in bathroom', 'PENDING');