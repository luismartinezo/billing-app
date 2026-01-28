package com.springboot.backend.luismartinez.billingsapp.billingbackend.exceptions;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
