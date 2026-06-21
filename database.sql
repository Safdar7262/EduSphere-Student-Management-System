-- ============================================================
-- Student Management System – PostgreSQL Setup Script
-- Run this ONCE before starting the application
-- ============================================================

-- 1. Create Database (run as superuser / postgres)
CREATE DATABASE student_management_db;

-- 2. Connect to the new database
\c student_management_db;

-- 3. Create students table (Hibernate will also auto-create via ddl-auto=update,
--    but having the explicit script is useful for reference / production setups)
CREATE TABLE IF NOT EXISTS students (
    id              BIGSERIAL PRIMARY KEY,
    first_name      VARCHAR(50)  NOT NULL,
    last_name       VARCHAR(50)  NOT NULL,
    email           VARCHAR(100) NOT NULL UNIQUE,
    phone           VARCHAR(20),
    gender          VARCHAR(10),
    date_of_birth   DATE,
    course          VARCHAR(100),
    department      VARCHAR(100),
    semester        INTEGER CHECK (semester BETWEEN 1 AND 12),
    address         VARCHAR(255),
    city            VARCHAR(100),
    state           VARCHAR(100),
    country         VARCHAR(100),
    zip_code        VARCHAR(20),
    admission_date  DATE,
    status          VARCHAR(20) DEFAULT 'ACTIVE',
    profile_image   VARCHAR(255),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- 4. Index for common lookups
CREATE INDEX IF NOT EXISTS idx_students_email      ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);
CREATE INDEX IF NOT EXISTS idx_students_course     ON students(course);
CREATE INDEX IF NOT EXISTS idx_students_status     ON students(status);

-- 5. Sample data – 20 realistic students
INSERT INTO students (first_name, last_name, email, phone, gender, date_of_birth, course, department, semester, address, city, state, country, zip_code, admission_date, status)
VALUES
('Alice',   'Johnson',  'alice.johnson@example.com',  '+14155552671', 'Female', '2001-03-15', 'B.Sc. Computer Science',      'Computer Science',       3,  '101 Maple Ave',   'San Francisco', 'CA', 'USA', '94102', '2023-08-01', 'ACTIVE'),
('Bob',     'Smith',    'bob.smith@example.com',      '+14155552672', 'Male',   '2000-07-22', 'B.Tech Software Engineering', 'Computer Science',       5,  '202 Oak St',      'Los Angeles',   'CA', 'USA', '90001', '2022-08-01', 'ACTIVE'),
('Carol',   'Williams', 'carol.williams@example.com', '+14155552673', 'Female', '2002-01-10', 'BBA',                         'Business Administration', 1,  '303 Pine Rd',     'Chicago',       'IL', 'USA', '60601', '2024-01-15', 'ACTIVE'),
('David',   'Brown',    'david.brown@example.com',    '+14155552674', 'Male',   '1999-11-05', 'MBA',                         'Business Administration', 3,  '404 Cedar Blvd',  'Houston',       'TX', 'USA', '77001', '2023-01-10', 'ACTIVE'),
('Eva',     'Davis',    'eva.davis@example.com',      '+14155552675', 'Female', '2001-06-30', 'B.Sc. Mathematics',           'Mathematics',            4,  '505 Birch Lane',  'Phoenix',       'AZ', 'USA', '85001', '2022-08-15', 'ACTIVE'),
('Frank',   'Miller',   'frank.miller@example.com',   '+14155552676', 'Male',   '2000-09-18', 'B.Sc. Physics',               'Physics',                6,  '606 Elm St',      'Philadelphia',  'PA', 'USA', '19101', '2021-08-01', 'ACTIVE'),
('Grace',   'Wilson',   'grace.wilson@example.com',   '+14155552677', 'Female', '2002-04-25', 'B.Sc. Chemistry',             'Chemistry',              2,  '707 Walnut Ave',  'San Antonio',   'TX', 'USA', '78201', '2023-08-01', 'ACTIVE'),
('Henry',   'Moore',    'henry.moore@example.com',    '+14155552678', 'Male',   '1998-12-12', 'MBBS',                        'Medicine',               8,  '808 Chestnut Rd', 'San Diego',     'CA', 'USA', '92101', '2020-08-01', 'ACTIVE'),
('Iris',    'Taylor',   'iris.taylor@example.com',    '+14155552679', 'Female', '2001-08-07', 'LLB',                         'Law',                    5,  '909 Spruce Blvd', 'Dallas',        'TX', 'USA', '75201', '2022-08-01', 'ACTIVE'),
('Jack',    'Anderson', 'jack.anderson@example.com',  '+14155552680', 'Male',   '2003-02-14', 'B.A. Literature',             'Arts & Humanities',      1,  '1010 Fir Lane',   'San Jose',      'CA', 'USA', '95101', '2024-08-01', 'ACTIVE'),
('Karen',   'Thomas',   'karen.thomas@example.com',   '+14155552681', 'Female', '2000-05-19', 'B.Sc. Computer Science',      'Computer Science',       6,  '11 Ash Way',      'Austin',        'TX', 'USA', '78701', '2021-08-01', 'INACTIVE'),
('Leo',     'Jackson',  'leo.jackson@example.com',    '+14155552682', 'Male',   '1999-10-23', 'B.Tech Software Engineering', 'Engineering',            8,  '22 Poplar St',    'Jacksonville',  'FL', 'USA', '32099', '2020-08-01', 'ACTIVE'),
('Mia',     'White',    'mia.white@example.com',      '+14155552683', 'Female', '2002-07-11', 'BBA',                         'Business Administration', 3,  '33 Sycamore Rd',  'Columbus',      'OH', 'USA', '43085', '2023-01-15', 'ACTIVE'),
('Noah',    'Harris',   'noah.harris@example.com',    '+14155552684', 'Male',   '2001-01-28', 'B.Sc. Mathematics',           'Mathematics',            5,  '44 Willow Ave',   'Charlotte',     'NC', 'USA', '28201', '2022-08-01', 'SUSPENDED'),
('Olivia',  'Martin',   'olivia.martin@example.com',  '+14155552685', 'Female', '2000-03-03', 'B.Sc. Physics',               'Physics',                7,  '55 Alder Blvd',   'Indianapolis',  'IN', 'USA', '46201', '2021-08-01', 'ACTIVE'),
('Paul',    'Garcia',   'paul.garcia@example.com',    '+14155552686', 'Male',   '2003-09-09', 'B.Sc. Chemistry',             'Chemistry',              1,  '66 Magnolia Lane','San Francisco', 'CA', 'USA', '94103', '2024-08-01', 'ACTIVE'),
('Quinn',   'Martinez', 'quinn.martinez@example.com', '+14155552687', 'Female', '2001-12-17', 'MBBS',                        'Medicine',               4,  '77 Cypress Rd',   'Seattle',       'WA', 'USA', '98101', '2022-08-01', 'ACTIVE'),
('Ryan',    'Robinson', 'ryan.robinson@example.com',  '+14155552688', 'Male',   '2002-06-06', 'LLB',                         'Law',                    3,  '88 Juniper St',   'Denver',        'CO', 'USA', '80201', '2023-08-01', 'ACTIVE'),
('Sophia',  'Clark',    'sophia.clark@example.com',   '+14155552689', 'Female', '2000-08-20', 'B.A. Literature',             'Arts & Humanities',      7,  '99 Redwood Ave',  'Nashville',     'TN', 'USA', '37201', '2021-08-01', 'ACTIVE'),
('Tyler',   'Rodriguez','tyler.rodriguez@example.com','+14155552690', 'Male',   '2003-11-30', 'B.Tech Software Engineering', 'Engineering',            1,  '110 Sequoia Blvd','Portland',      'OR', 'USA', '97201', '2024-08-01', 'ACTIVE');

-- 6. Verify
SELECT COUNT(*) AS total_students FROM students;
SELECT department, COUNT(*) AS count FROM students GROUP BY department ORDER BY count DESC;

-- ============================================================
-- Postman API Examples (for reference)
-- ============================================================
-- GET    http://localhost:8080/api/students
-- GET    http://localhost:8080/api/students/1
-- GET    http://localhost:8080/api/students/dashboard
-- GET    http://localhost:8080/api/students/search?keyword=alice
-- GET    http://localhost:8080/api/students/status/ACTIVE
-- GET    http://localhost:8080/api/students/department/Computer%20Science
-- GET    http://localhost:8080/api/students/course/BBA
-- POST   http://localhost:8080/api/students          (body: JSON)
-- PUT    http://localhost:8080/api/students/1        (body: JSON)
-- DELETE http://localhost:8080/api/students/1
