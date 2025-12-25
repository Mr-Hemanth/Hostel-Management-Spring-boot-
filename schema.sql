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
