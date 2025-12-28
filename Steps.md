# Setup and Run Guide for Windows (Clone from Repo)

Follow these detailed steps to set up and run the Hostel Management System on a Windows machine.

---

## **1. Prerequisites**
Ensure you have the following installed on your system:

- **Git**: [Download Git for Windows](https://git-scm.com/download/win)
- **Java Development Kit (JDK) 17**: [Download JDK 17](https://www.oracle.com/java/technologies/downloads/#java17)
- **Node.js & npm**: [Download Node.js (LTS)](https://nodejs.org/)
- **MySQL Server 8.0+**: [Download MySQL Installer](https://dev.mysql.com/downloads/installer/)
- **Maven**: [Download Maven](https://maven.apache.org/download.cgi) (Ensure it's added to your System PATH)

---

## **2. Clone the Repository**
Open **Command Prompt** or **PowerShell** and run:
```bash
git clone <your-repository-url>
cd Hostel-management-system
```

---

## **3. Database Setup**
1. Open **MySQL Command Line Client** or **MySQL Workbench**.
2. Execute the following SQL commands to prepare the database:
   ```sql
   CREATE DATABASE hostel_management;
   
   -- Create the application user
   CREATE USER 'hosteluser'@'localhost' IDENTIFIED BY 'hostelpass';
   GRANT ALL PRIVILEGES ON hostel_management.* TO 'hosteluser'@'localhost';
   FLUSH PRIVILEGES;
   
   USE hostel_management;
   
   -- Import the schema and initial data
   -- Replace the path with the actual location of schema.sql on your PC
   SOURCE C:/path/to/Hostel-management-system/schema.sql;
   ```

---

## **4. Backend Setup (Spring Boot)**
1. Navigate to the backend folder:
   ```bash
   cd hostel-backend
   ```
2. **Check Configuration**: Open `src/main/resources/application.properties` and verify:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/hostel_management?useSSL=false&serverTimezone=UTC
   spring.datasource.username=hosteluser
   spring.datasource.password=hostelpass
   ```
3. **Run the Backend**:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   *Backend will be available at: http://localhost:8080*

---

## **5. Frontend Setup (React)**
1. Open a **new** terminal window and navigate to the frontend folder:
   ```bash
   cd hostel-frontend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start the Application**:
   ```bash
   npm start
   ```
   *Frontend will open automatically at: http://localhost:3000*

---

## **6. Alternative: Run with Docker**
If you have **Docker Desktop** installed, run the entire stack with one command from the project root:
```bash
docker-compose up --build
```

---

## **7. Default Login Credentials**
- **Role**: Admin
- **Email**: `admin@hostel.com`
- **Password**: `admin123`

---

## **Troubleshooting (Windows)**
- **Port Conflicts**: If port `8080` or `3306` is busy, stop the existing service via Task Manager or `netstat -ano`.
- **Environment Variables**: If `mvn` or `java` isn't recognized, add their `bin` folders to the system `Path` variable.
- **Node Modules**: If `npm install` fails, try `npm cache clean --force` and delete `node_modules` before retrying.
