package com.student.service.impl;

import com.student.dto.DashboardStats;
import com.student.dto.StudentRequest;
import com.student.dto.StudentResponse;
import com.student.entity.Student;
import com.student.exception.DuplicateEmailException;
import com.student.exception.StudentNotFoundException;
import com.student.repository.StudentRepository;
import com.student.service.StudentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of StudentService containing all business logic.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    // ── Create ───────────────────────────────────────────────────────────────

    @Override
    public StudentResponse createStudent(StudentRequest request) {
        log.debug("Creating student with email: {}", request.getEmail());

        // Prevent duplicate email
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }

        Student student = mapToEntity(request);
        Student saved = studentRepository.save(student);
        log.info("Student created with ID: {}", saved.getId());
        return mapToResponse(saved);
    }

    // ── Read ─────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
        return mapToResponse(student);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> searchStudents(String keyword, Pageable pageable) {
        return studentRepository.searchStudents(keyword, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> getStudentsByCourse(String course, Pageable pageable) {
        return studentRepository.findByCourse(course, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> getStudentsByDepartment(String department, Pageable pageable) {
        return studentRepository.findByDepartment(department, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> getStudentsByStatus(String status, Pageable pageable) {
        return studentRepository.findByStatus(status, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStats getDashboardStats() {
        long total = studentRepository.count();
        long active = studentRepository.countByStatus("ACTIVE");
        long inactive = studentRepository.countByStatus("INACTIVE");
        long depts = studentRepository.countDistinctDepartments();
        long courses = studentRepository.countDistinctCourses();
        List<StudentResponse> recent = studentRepository.findTop5ByOrderByAdmissionDateDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());

        return DashboardStats.builder()
                .totalStudents(total)
                .activeStudents(active)
                .inactiveStudents(inactive)
                .totalDepartments(depts)
                .totalCourses(courses)
                .recentAdmissions(recent)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudentsForExport() {
        return studentRepository.findAll()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // ── Update ───────────────────────────────────────────────────────────────

    @Override
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));

        // Allow same email on self-update, but not if another student owns it
        if (studentRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
            throw new DuplicateEmailException(request.getEmail());
        }

        updateEntityFromRequest(existing, request);
        Student saved = studentRepository.save(existing);
        log.info("Student updated: ID {}", id);
        return mapToResponse(saved);
    }

    // ── Delete ───────────────────────────────────────────────────────────────

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new StudentNotFoundException(id);
        }
        studentRepository.deleteById(id);
        log.info("Student deleted: ID {}", id);
    }

    // ── Mapping Helpers ──────────────────────────────────────────────────────

    private Student mapToEntity(StudentRequest req) {
        return Student.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .gender(req.getGender())
                .dob(req.getDob())
                .course(req.getCourse())
                .department(req.getDepartment())
                .semester(req.getSemester())
                .address(req.getAddress())
                .city(req.getCity())
                .state(req.getState())
                .country(req.getCountry())
                .zipCode(req.getZipCode())
                .admissionDate(req.getAdmissionDate())
                .status(req.getStatus() != null ? req.getStatus() : "ACTIVE")
                .profileImage(req.getProfileImage())
                .build();
    }

    private void updateEntityFromRequest(Student student, StudentRequest req) {
        student.setFirstName(req.getFirstName());
        student.setLastName(req.getLastName());
        student.setEmail(req.getEmail());
        student.setPhone(req.getPhone());
        student.setGender(req.getGender());
        student.setDob(req.getDob());
        student.setCourse(req.getCourse());
        student.setDepartment(req.getDepartment());
        student.setSemester(req.getSemester());
        student.setAddress(req.getAddress());
        student.setCity(req.getCity());
        student.setState(req.getState());
        student.setCountry(req.getCountry());
        student.setZipCode(req.getZipCode());
        student.setAdmissionDate(req.getAdmissionDate());
        if (req.getStatus() != null) student.setStatus(req.getStatus());
        if (req.getProfileImage() != null) student.setProfileImage(req.getProfileImage());
    }

    private StudentResponse mapToResponse(Student s) {
        return StudentResponse.builder()
                .id(s.getId())
                .firstName(s.getFirstName())
                .lastName(s.getLastName())
                .fullName(s.getFirstName() + " " + s.getLastName())
                .email(s.getEmail())
                .phone(s.getPhone())
                .gender(s.getGender())
                .dob(s.getDob())
                .course(s.getCourse())
                .department(s.getDepartment())
                .semester(s.getSemester())
                .address(s.getAddress())
                .city(s.getCity())
                .state(s.getState())
                .country(s.getCountry())
                .zipCode(s.getZipCode())
                .admissionDate(s.getAdmissionDate())
                .status(s.getStatus())
                .profileImage(s.getProfileImage())
                .studentId(String.format("STU-%05d", s.getId()))
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }
}
