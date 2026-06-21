package com.student.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for returning student data to the client. Hides entity internals.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private String gender;
    private LocalDate dob;
    private String course;
    private String department;
    private Integer semester;
    private String address;
    private String city;
    private String state;
    private String country;
    private String zipCode;
    private LocalDate admissionDate;
    private String status;
    private String profileImage;
    private String studentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
