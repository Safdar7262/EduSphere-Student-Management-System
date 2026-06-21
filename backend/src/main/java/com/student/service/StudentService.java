package com.student.service;

import com.student.dto.DashboardStats;
import com.student.dto.StudentRequest;
import com.student.dto.StudentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Service contract for all student business operations.
 */
public interface StudentService {

    StudentResponse createStudent(StudentRequest request);

    StudentResponse getStudentById(Long id);

    StudentResponse updateStudent(Long id, StudentRequest request);

    void deleteStudent(Long id);

    Page<StudentResponse> getAllStudents(Pageable pageable);

    Page<StudentResponse> searchStudents(String keyword, Pageable pageable);

    Page<StudentResponse> getStudentsByCourse(String course, Pageable pageable);

    Page<StudentResponse> getStudentsByDepartment(String department, Pageable pageable);

    Page<StudentResponse> getStudentsByStatus(String status, Pageable pageable);

    DashboardStats getDashboardStats();

    List<StudentResponse> getAllStudentsForExport();
}
