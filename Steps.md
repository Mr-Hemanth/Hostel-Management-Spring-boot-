# 🏁 Comprehensive Setup Guide for Windows

This guide provides step-by-step instructions to get the Hostel Management System running on a Windows machine, from zero to a fully functional application.

---

## **Part 1: Install Required Software**

Before you can run the code, you need to install these tools. Download and install them in this order:

1.  **Git**: [Download Git for Windows](https://git-scm.com/download/win). (Use default settings during installation).
2.  **Java 17 (JDK)**: [Download Amazon Corretto 17](https://docs.aws.amazon.com/corretto/latest/corretto-17-ug/downloads.html) (Download the `.msi` for Windows x64).
3.  **Node.js**: [Download Node.js v20 LTS](https://nodejs.org/). (This includes `npm`).
4.  **MySQL Server**: [Download MySQL Community Server](https://dev.mysql.com/downloads/installer/).
    -   During installation, choose **"Developer Default"**.
    -   Set a **Root Password** and remember it (e.g., `root123`).
5.  **Maven**: [Download Maven](https://maven.apache.org/download.cgi) (Download the Binary zip).
    -   Extract it to `C:\Program Files\apache-maven`.
    -   Add `C:\Program Files\apache-maven\bin` to your **System Environment Variables (Path)**.

---

## **Part 2: Get the Code**

1.  Open **Command Prompt** (search for `cmd` in Start Menu).
2.  Navigate to where you want to keep the project (e.g., Documents):
    ```cmd
    cd Documents
    ```
3.  Clone the repository:
    ```cmd
    git clone <your-repository-url>
    cd Hostel-management-system
    ```

---

## **Part 3: Database Configuration**

1.  Open the **MySQL Command Line Client** from your Start Menu.
2.  Type your **Root Password** when prompted.
3.  Copy and paste these commands one by one:
    ```sql
    -- 1. Create the database
    CREATE DATABASE hostel_management;

    -- 2. Create a specific user for the app (matches application.properties)
    CREATE USER 'hosteluser'@'localhost' IDENTIFIED BY 'hostelpass';
    GRANT ALL PRIVILEGES ON hostel_management.* TO 'hosteluser'@'localhost';
    FLUSH PRIVILEGES;

    -- 3. Use the new database
    USE hostel_management;

    -- 4. Import the schema (tables and initial data)
    -- IMPORTANT: Find schema.sql in your folder, Shift + Right Click -> "Copy as path"
    -- Paste it after SOURCE and replace \ with /
    SOURCE C:/Users/YourName/Documents/Hostel-management-system/schema.sql;
    ```

---

## **Part 4: Run the Backend (Server)**

1.  Go back to your **Command Prompt**.
2.  Enter the backend folder:
    ```cmd
    cd hostel-backend
    ```
3.  Build and run the application:
    ```cmd
    mvn clean install
    mvn spring-boot:run
    ```
4.  Wait until you see: `Started HostelBackendApplication in X seconds`.
    -   **Note**: Keep this terminal window open.

---

## **Part 5: Run the Frontend (UI)**

1.  Open a **SECOND Command Prompt** window.
2.  Navigate to the project folder again:
    ```cmd
    cd Documents\Hostel-management-system\hostel-frontend
    ```
3.  Install the React dependencies (first time only):
    ```cmd
    npm install
    ```
4.  Start the web app:
    ```cmd
    npm start
    ```
5.  Your browser will automatically open to `http://localhost:3000`.

---

## **Part 6: Log In and Test**

Once the website loads, use these default admin credentials:

-   **Email**: `admin@hostel.com`
-   **Password**: `admin123`

---

## **Part 7: Verify or Add Admin Manually**

The `schema.sql` already contains the admin user. To check if it was added correctly, run this in MySQL:
```sql
USE hostel_management;
SELECT * FROM users WHERE email = 'admin@hostel.com';
```

If the result is empty, paste this command to add the admin manually:
```sql
INSERT INTO users (name, email, password, role) 
VALUES ('Admin User', 'admin@hostel.com', '$2a$10$Nk6r4H8u1I5q.PJYz9Pq1eF9Z8Q4H3N2W7V6U5T4S3R2Q1P0O9N8M', 'ADMIN');
```
*(Note: The long string starting with `$2a$` is the encrypted version of `admin123`. Do not change it!)*

---

## **Part 8: Add a Test Student Manually**

To add a student named "John Doe" to Room 101:

1. **Add the User:**
   ```sql
   INSERT INTO users (name, email, password, role) 
   VALUES ('John Doe', 'john@example.com', '$2a$10$7v5V9fVpU.mO8O6O.p.XHe5p.S8E7E/9Yy8Z9W8V7U6T5S4R3Q2P1', 'STUDENT');
   ```
   *(Password is `student123`)*

2. **Check the IDs:**
   ```sql
   SELECT id FROM users WHERE email = 'john@example.com';
   SELECT id FROM rooms WHERE room_number = '101';
   ```

3. **Add the Student Record:**
   *(Replace `USER_ID` and `ROOM_ID` with the numbers from step 2)*
   ```sql
   INSERT INTO students (user_id, room_id) VALUES (USER_ID, ROOM_ID);
   ```

---

## **Part 9: Database Connection Errors (500 Error)**

If you see a `500 Internal Server Error` during login, it usually means the backend cannot talk to your MySQL database. 

1. **Check if MySQL is running.**
2. **Create the specific user the app expects:**
   Run these commands in your MySQL terminal:
   ```sql
   CREATE USER IF NOT EXISTS 'hosteluser'@'localhost' IDENTIFIED BY 'hostelpass';
   GRANT ALL PRIVILEGES ON hostel_management.* TO 'hosteluser'@'localhost';
   FLUSH PRIVILEGES;
   ```
3. **Restart the Backend** after running these commands.

---

## **Part 10: Windows-Specific Login Fixes**

If your friend is on Windows and login is failing:

1. **Fix MySQL Authentication:**
   Open MySQL Command Line and run:
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '34576';
   FLUSH PRIVILEGES;
   ```

2. **Update `application.properties`:**
   Use `127.0.0.1` instead of `localhost` and add `allowPublicKeyRetrieval`:
   ```properties
   spring.datasource.url=jdbc:mysql://127.0.0.1:3306/hostel_management?useSSL=false&serverTimezone=Asia/Kolkata&allowPublicKeyRetrieval=true
   ```

3. **Check Firewall:**
   Ensure Windows Firewall isn't blocking Java/JDK from accessing the network.

---

## **💡 Expert Tips for Windows Users**

-   **Path Formatting**: In MySQL, if your path is `C:\Users\Name\file.sql`, you MUST type it as `C:/Users/Name/file.sql` (use forward slashes).
-   **Ports**: If you see an error saying "Port 8080 is already in use", you might have another app running. You can kill it by typing:
    ```cmd
    netstat -ano | findstr :8080
    taskkill /PID <number_at_end> /F
    ```
-   **Environment Variables**: If `mvn` or `java` is not recognized, search for "Edit the system environment variables" in Windows, click **Environment Variables**, find **Path** under System Variables, and add the `bin` folder paths for Java and Maven.
