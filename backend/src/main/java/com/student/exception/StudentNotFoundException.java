package com.student.exception;

/**
 * Thrown when a student with the given ID or email cannot be found.
 */
public class StudentNotFoundException extends RuntimeException {

    public StudentNotFoundException(String message) {
        super(message);
    }

    public StudentNotFoundException(Long id) {
        super("Student not found with ID: " + id);
    }
}
