package com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.enums.PaymentMethod;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PaymentRequest {
    private BigDecimal amount;
//    private String method;
private PaymentMethod method;
}
