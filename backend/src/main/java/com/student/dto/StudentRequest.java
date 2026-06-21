package com.student.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

/**
 * DTO for creating/updating a student. Decouples API input from the entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentRequest {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number")
    private String phone;

    @NotBlank(message = "Gender is required")
    private String gender;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dob;

    @NotBlank(message = "Course is required")
    private String course;

    @NotBlank(message = "Department is required")
    private String department;

    @Min(1) @Max(12)
    private Integer semester;

    private String address;
    private String city;
    private String state;
    private String country;
    private String zipCode;
    private LocalDate admissionDate;
    private String status;
    private String profileImage;
}
