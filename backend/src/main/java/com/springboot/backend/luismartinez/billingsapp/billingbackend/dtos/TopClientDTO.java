package com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class TopClientDTO {
    private Long customerId;
    private String customerName;
    private Long invoiceCount;
    private BigDecimal totalInvoiced;
}
