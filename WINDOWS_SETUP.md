# 🪟 Windows Setup Guide for Hostel Management System

Follow these steps to set up and run the project on a Windows laptop.

## **Step 1: Install Required Software**
1.  **Java 17**: Download and install [OpenJDK 17](https://adoptium.net/temurin/releases/?version=17).
2.  **Node.js**: Download and install [Node.js (LTS version)](https://nodejs.org/).
3.  **Maven**: Download and install [Apache Maven](https://maven.apache.org/download.cgi). (Add to System PATH).
4.  **MySQL**: Download and install [MySQL Community Server](https://dev.mysql.com/downloads/installer/).

---

## **Step 2: MySQL Database Setup**
1.  Open **MySQL Command Line Client**.
2.  Run these commands:
    ```sql
    -- Create the database
    CREATE DATABASE IF NOT EXISTS hostel_management;

    -- Create a user for the app
    CREATE USER IF NOT EXISTS 'hosteluser'@'localhost' IDENTIFIED BY 'hostelpass';
    GRANT ALL PRIVILEGES ON hostel_management.* TO 'hosteluser'@'localhost';
    FLUSH PRIVILEGES;

    -- Import the schema
    USE hostel_management;
    -- Replace with your actual path, use forward slashes /
    SOURCE C:/path/to/project/schema.sql;
    ```

---

## **Step 3: Backend Configuration**
1.  Open `hostel-backend/src/main/resources/application.properties`.
2.  Verify these lines match your MySQL setup:
    ```properties
    spring.datasource.url=jdbc:mysql://127.0.0.1:3306/hostel_management?useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true
    spring.datasource.username=hosteluser
    spring.datasource.password=hostelpass
    ```

---

## **Step 4: Running the Application**

### **1. Start the Backend**
Open a terminal in the `hostel-backend` folder:
```cmd
mvn clean install
mvn spring-boot:run
```
*Wait for "Started HostelBackendApplication" message.*

### **2. Start the Frontend**
Open a **new** terminal in the `hostel-frontend` folder:
```cmd
npm install
npm start
```
*Your browser will open to http://localhost:3000.*

---

## **Step 5: Logging In**
The system automatically ensures these default accounts work:

*   **Admin Login**: 
    - Email: `admin@hostel.com`
    - Password: `admin123`
*   **Student Login**:
    - Email: `john@example.com`
    - Password: `student123`

---

## **Troubleshooting**
1.  **500 Internal Server Error**: 
    - Check if MySQL service is running in Windows Services.
    - Check the backend terminal for "Access denied for user" or "Connection refused".
2.  **Login Fails**:
    - If you can't log in with the details from the database table, restart the backend. The `DataInitializer` will automatically reset the `admin@hostel.com` password to `admin123` on every startup to ensure you are never locked out.
3.  **Port 8080 or 3000 in use**:
    - Close any other apps using these ports (like another project or a local server).
