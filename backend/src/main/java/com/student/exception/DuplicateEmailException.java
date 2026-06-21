package com.student.exception;

/**
 * Thrown when attempting to register a student with an already-used email.
 */
public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException(String email) {
        super("A student with email '" + email + "' already exists");
    }
}
