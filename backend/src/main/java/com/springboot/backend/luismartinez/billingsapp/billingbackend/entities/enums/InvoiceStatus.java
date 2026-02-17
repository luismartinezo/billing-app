package com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.enums;

public enum InvoiceStatus {
    PENDING,
    DRAFT,      // Borrador
    ISSUED,     // Emitida
    PAID,       // Pagada
    OVERDUE,    // Vencida
    CANCELLED   // Cancelada
}
