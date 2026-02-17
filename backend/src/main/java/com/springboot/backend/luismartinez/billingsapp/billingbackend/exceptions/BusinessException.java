package com.springboot.backend.luismartinez.billingsapp.billingbackend.exceptions;

public class BusinessException extends RuntimeException{
    public BusinessException(String message) {
        super(message);
    }
}
