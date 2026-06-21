package com.student.repository;

import com.student.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for Student entities.
 * Extends JpaRepository for full CRUD + pagination support.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // ── Basic finders ────────────────────────────────────────────────────────

    Optional<Student> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    List<Student> findByDepartment(String department);

    List<Student> findByCourse(String course);

    List<Student> findByStatus(String status);

    // ── Paginated finders ────────────────────────────────────────────────────

    Page<Student> findByDepartment(String department, Pageable pageable);

    Page<Student> findByCourse(String course, Pageable pageable);

    Page<Student> findByStatus(String status, Pageable pageable);

    // ── Full-text search across multiple fields ──────────────────────────────

    @Query("""
        SELECT s FROM Student s WHERE
            LOWER(s.firstName)  LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(s.lastName)   LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(s.email)      LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(s.phone)      LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(s.department) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(s.course)     LIKE LOWER(CONCAT('%', :keyword, '%'))
        """)
    Page<Student> searchStudents(@Param("keyword") String keyword, Pageable pageable);

    // ── Dashboard statistics ─────────────────────────────────────────────────

    long countByStatus(String status);

    @Query("SELECT COUNT(DISTINCT s.department) FROM Student s")
    long countDistinctDepartments();

    @Query("SELECT COUNT(DISTINCT s.course) FROM Student s")
    long countDistinctCourses();

    /** Returns the 5 most recently admitted students. */
    List<Student> findTop5ByOrderByAdmissionDateDesc();
}
