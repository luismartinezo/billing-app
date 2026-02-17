package com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.enums.InvoiceStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class InvoiceDTO {
    private Long id;
    private String invoiceNumber;

    private LocalDateTime createdAt;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private LocalDateTime paidAt;

    private InvoiceStatus status;

    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal total;

    private CustomerDTO customer;
    private List<InvoiceItemDTO> items;
}
