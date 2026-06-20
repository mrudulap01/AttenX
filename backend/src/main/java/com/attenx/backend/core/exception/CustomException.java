package com.attenx.backend.core.exception;

/**
 * Base custom exception class for application-specific errors.
 */
public class CustomException extends RuntimeException {
    public CustomException(String message) {
        super(message);
    }
}
