# 🚀 AI Resume Analyzer

An AI-powered Resume Analyzer built using **Java Spring Boot, React, and MySQL** that evaluates resumes against a job description using a rule-based ATS (Applicant Tracking System) engine. The application provides an ATS score, matching skills, missing skills, and personalized improvement suggestions.

---

## 📌 Features

- 🔐 User Registration & Login (JWT Authentication)
- 📄 Upload Resume (PDF)
- 🤖 Rule-Based ATS Resume Analysis
- 📊 ATS Compatibility Score
- ✅ Matching Skills Detection
- ❌ Missing Skills Detection
- 💡 Resume Improvement Suggestions
- 📂 Resume Upload & Storage
- 🗄️ MySQL Database Integration
- 🌐 RESTful APIs
- 🎨 Modern Responsive React UI

---

# 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- REST APIs
- Maven

### Database

- MySQL

### Other Libraries

- Apache PDFBox
- Lombok

---

# 📂 Project Structure

```
AI_RESUME_ANALYZER
│
├── backend
│   ├── src
│   ├── pom.xml
│   └── mvnw.cmd
│
├── frontend
│   ├── src
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Prerequisites

Install the following before running the project:

- Java 17+
- Node.js (v18 or above)
- MySQL Server 8+
- MySQL Workbench
- Git

---

# 🗄️ Database Setup

## Step 1

Open **MySQL Workbench**

Run:

```sql
CREATE DATABASE IF NOT EXISTS resume_analyzer_db;
```

---

## Step 2

Open:

```
backend/src/main/resources/application.properties
```

Update these values:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/resume_analyzer_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC

spring.datasource.username=root

spring.datasource.password=YOUR_MYSQL_PASSWORD
```

Replace:

```
YOUR_MYSQL_PASSWORD
```

with your actual MySQL password.

---

# ▶️ Running the Project

## Step 1 — Start Backend

Open **Terminal 1**

```bash
cd backend
```

Run

Windows

```bash
.\mvnw.cmd spring-boot:run
```

Mac/Linux

```bash
./mvnw spring-boot:run
```

Backend runs on

```
http://localhost:9090
```

_(or whichever port is configured in `application.properties`.)_

---

## Step 2 — Start Frontend

Open **Terminal 2**

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run

```bash
npm run dev
```

Frontend runs on

```
http://localhost:3000
```

_(If Vite shows another port such as 5173, open that URL instead.)_

---

# 🚀 Application Flow

1. Register a new account
2. Login securely
3. Upload Resume (PDF)
4. Paste Job Description
5. Click Analyze
6. View ATS Score
7. Check Matching Skills
8. Check Missing Skills
9. View Resume Improvement Suggestions

---

# 📊 Database

The application automatically creates the required tables using Hibernate.

Example tables:

- users
- resumes
- analysis

No manual table creation is required.

---

# 🔐 Authentication

- JWT Authentication
- Password Encryption using BCrypt
- Secure REST APIs
- Spring Security

---

# 📸 Screenshots

### Home Page

(Add Screenshot)

### Login

(Add Screenshot)

### Dashboard

(Add Screenshot)

### Resume Analysis

(Add Screenshot)

---

# 📈 Future Enhancements

- AI-powered Resume Suggestions (LLM Integration)
- Resume History
- Export Analysis Report
- Company-wise ATS Templates
- Resume Version Comparison
- Email Notifications
- Cloud Deployment
- Docker Support

---

# 👨‍💻 Author

**Vishal Kumar**

B.Tech CSE (AI & ML)

Java Full Stack Developer

GitHub: https://github.com/YOUR_USERNAME

LinkedIn: https://linkedin.com/in/YOUR_PROFILE

---

# ⭐ If you found this project useful, consider giving it a Star!
