package com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class InvoiceItemDTO {
    private Long productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal total;
}
