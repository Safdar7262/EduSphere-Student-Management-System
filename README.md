# 🎓 Student Management System

A full-stack **Student Management System** built with **Spring Boot** (backend) and **HTML/CSS/JS + Bootstrap 5** (frontend), backed by **PostgreSQL**.

---

## 📁 Project Structure

```
student-management-system/
├── backend/                          # Spring Boot Maven project
│   ├── pom.xml
│   └── src/main/java/com/student/
│       ├── StudentManagementApplication.java
│       ├── controller/StudentController.java
│       ├── service/StudentService.java
│       ├── service/impl/StudentServiceImpl.java
│       ├── repository/StudentRepository.java
│       ├── entity/Student.java
│       ├── dto/StudentRequest.java
│       ├── dto/StudentResponse.java
│       ├── dto/ApiResponse.java
│       ├── dto/DashboardStats.java
│       ├── exception/StudentNotFoundException.java
│       ├── exception/DuplicateEmailException.java
│       ├── exception/GlobalExceptionHandler.java
│       └── config/CorsConfig.java
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── index.html          # Dashboard
│   ├── students.html       # Student list with search/filter/pagination
│   ├── add-student.html    # Add new student form
│   ├── edit-student.html   # Edit student form
│   ├── css/style.css
│   └── js/
│       ├── app.js          # Shared utilities, dark mode, dashboard
│       └── student.js      # CRUD, search, pagination, CSV export
├── database.sql            # PostgreSQL setup + 20 sample records
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Java 17+**
- **Maven 3.8+**
- **PostgreSQL 14+**
- **VS Code** with extensions: *Java Extension Pack*, *Spring Boot Extension Pack*

---

### Step 1 — PostgreSQL Setup

```bash
# Log in as postgres superuser
psql -U postgres

# Run the setup script
\i path/to/database.sql
```

Or manually:
```sql
CREATE DATABASE student_management_db;
\c student_management_db
-- Then run the CREATE TABLE and INSERT statements from database.sql
```

---

### Step 2 — Configure Backend

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/student_management_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

---

### Step 3 — Run Backend

```bash
cd backend
mvn spring-boot:run
```

Backend starts at: **http://localhost:8080**

---

### Step 4 — Open Frontend

Open any of these files directly in your browser (no server needed):

| File | Description |
|------|-------------|
| `frontend/index.html` | Dashboard |
| `frontend/students.html` | Student list |
| `frontend/add-student.html` | Add student |
| `frontend/edit-student.html?id=1` | Edit student |

> **Tip:** Use VS Code's **Live Server** extension to serve the frontend at `http://127.0.0.1:5500`

---

## 🔌 REST API Reference

Base URL: `http://localhost:8080/api/students`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all students (paginated) |
| GET | `/{id}` | Get student by ID |
| POST | `/` | Create new student |
| PUT | `/{id}` | Update student |
| DELETE | `/{id}` | Delete student |
| GET | `/dashboard` | Dashboard statistics |
| GET | `/search?keyword=x` | Search students |
| GET | `/status/{status}` | Filter by status |
| GET | `/department/{dept}` | Filter by department |
| GET | `/course/{course}` | Filter by course |
| GET | `/export` | Export all students |

### Pagination Parameters
- `page` (default: 0)
- `size` (default: 10)
- `sortBy` (default: id)
- `sortDir` (asc/desc)

### Request Body (POST/PUT)
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+14155551234",
  "gender": "Male",
  "dob": "2001-05-15",
  "course": "B.Sc. Computer Science",
  "department": "Computer Science",
  "semester": 3,
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "country": "USA",
  "zipCode": "94102",
  "admissionDate": "2023-08-01",
  "status": "ACTIVE"
}
```

### Response Format
```json
{
  "success": true,
  "message": "Student added successfully",
  "data": { ... }
}
```

---

## 🧪 Postman Testing

Import this collection or test manually:

```
GET  http://localhost:8080/api/students
GET  http://localhost:8080/api/students/1
GET  http://localhost:8080/api/students/dashboard
GET  http://localhost:8080/api/students/search?keyword=alice&page=0&size=5
GET  http://localhost:8080/api/students?page=0&size=10&sortBy=firstName&sortDir=asc
POST http://localhost:8080/api/students        (Content-Type: application/json)
PUT  http://localhost:8080/api/students/1      (Content-Type: application/json)
DEL  http://localhost:8080/api/students/1
```

---

## ✨ Features

- ✅ Full CRUD (Create, Read, Update, Delete)
- ✅ Dashboard with live statistics
- ✅ Search across name, email, phone, department, course
- ✅ Filter by status, department, course
- ✅ Pagination with configurable page size
- ✅ Sortable table columns
- ✅ Dark mode (persisted in localStorage)
- ✅ CSV export
- ✅ View student details modal
- ✅ Delete confirmation dialog
- ✅ Toast notifications
- ✅ Responsive mobile layout
- ✅ Client-side + server-side validation
- ✅ Global exception handling
- ✅ 20 sample students pre-loaded

---

## 🔧 VS Code Extensions Recommended

- Extension Pack for Java
- Spring Boot Extension Pack
- Live Server
- REST Client (for .http files)
- PostgreSQL (by Chris Kolkman)

---

## 🚢 Deployment

### Backend (JAR)
```bash
cd backend
mvn clean package -DskipTests
java -jar target/student-management-system-1.0.0.jar
```

### Environment Variables (production)
```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://prod-host:5432/student_management_db
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=prod_password
java -jar target/student-management-system-1.0.0.jar
```

---

## 🔮 Future Improvements

- [ ] JWT Authentication & Role-based access
- [ ] Swagger / OpenAPI documentation
- [ ] Docker Compose setup
- [ ] JUnit + Mockito unit tests
- [ ] Email notifications on admission
- [ ] Profile image upload (S3/local)
- [ ] PDF student report download
- [ ] Audit logs
- [ ] Bulk CSV import

---

## 📄 License

MIT License – free to use and modify.
