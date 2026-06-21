package com.student.controller;

import com.student.dto.ApiResponse;
import com.student.dto.DashboardStats;
import com.student.dto.StudentRequest;
import com.student.dto.StudentResponse;
import com.student.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing all Student Management endpoints.
 * Base path: /api/students
 */
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")  // Allow frontend dev server; restrict in production
public class StudentController {

    private final StudentService studentService;

    // ── Dashboard ────────────────────────────────────────────────────────────

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStats>> getDashboard() {
        DashboardStats stats = studentService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics retrieved", stats));
    }

    // ── CRUD ─────────────────────────────────────────────────────────────────

    /** POST /api/students — Create a new student */
    @PostMapping
    public ResponseEntity<ApiResponse<StudentResponse>> createStudent(
            @Valid @RequestBody StudentRequest request) {

        StudentResponse created = studentService.createStudent(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student added successfully", created));
    }

    /** GET /api/students/{id} — Get student by ID */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudent(@PathVariable Long id) {
        StudentResponse student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success("Student retrieved", student));
    }

    /** PUT /api/students/{id} — Update student */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request) {

        StudentResponse updated = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updated));
    }

    /** DELETE /api/students/{id} — Delete student */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
    }

    // ── Listing & Search ─────────────────────────────────────────────────────

    /** GET /api/students — List all students (paginated) */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<StudentResponse>>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<StudentResponse> students = studentService.getAllStudents(pageable);
        return ResponseEntity.ok(ApiResponse.success("Students retrieved", students));
    }

    /** GET /api/students/search?keyword=... — Search students */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<StudentResponse>>> searchStudents(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<StudentResponse> results = studentService.searchStudents(keyword, pageable);
        return ResponseEntity.ok(ApiResponse.success("Search results", results));
    }

    /** GET /api/students/course/{course} */
    @GetMapping("/course/{course}")
    public ResponseEntity<ApiResponse<Page<StudentResponse>>> getByCourse(
            @PathVariable String course,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
                ApiResponse.success("Students by course", studentService.getStudentsByCourse(course, pageable)));
    }

    /** GET /api/students/department/{department} */
    @GetMapping("/department/{department}")
    public ResponseEntity<ApiResponse<Page<StudentResponse>>> getByDepartment(
            @PathVariable String department,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
                ApiResponse.success("Students by department",
                        studentService.getStudentsByDepartment(department, pageable)));
    }

    /** GET /api/students/status/{status} */
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<Page<StudentResponse>>> getByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
                ApiResponse.success("Students by status",
                        studentService.getStudentsByStatus(status, pageable)));
    }

    /** GET /api/students/export — All students for CSV export */
    @GetMapping("/export")
    public ResponseEntity<ApiResponse<List<StudentResponse>>> exportStudents() {
        List<StudentResponse> all = studentService.getAllStudentsForExport();
        return ResponseEntity.ok(ApiResponse.success("Export data", all));
    }
}
