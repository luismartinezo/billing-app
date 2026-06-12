package com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.enums.PaymentMethod;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentDTO {
    private Long id;
    private BigDecimal amount;
    private LocalDateTime paidAt;
    private PaymentMethod method;
    private Long invoiceId;
}
