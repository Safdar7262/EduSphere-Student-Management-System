package com.student.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Student entity mapped to the 'students' table in PostgreSQL.
 */
@Entity
@Table(name = "students")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Please provide a valid phone number")
    @Column(name = "phone", length = 20)
    private String phone;

    @NotBlank(message = "Gender is required")
    @Column(name = "gender", length = 10)
    private String gender;

    @Past(message = "Date of birth must be in the past")
    @Column(name = "date_of_birth")
    private LocalDate dob;

    @NotBlank(message = "Course is required")
    @Column(name = "course", length = 100)
    private String course;

    @NotBlank(message = "Department is required")
    @Column(name = "department", length = 100)
    private String department;

    @Min(value = 1, message = "Semester must be at least 1")
    @Max(value = 12, message = "Semester cannot exceed 12")
    @Column(name = "semester")
    private Integer semester;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "zip_code", length = 20)
    private String zipCode;

    @Column(name = "admission_date")
    private LocalDate admissionDate;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "profile_image")
    private String profileImage;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
