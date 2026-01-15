package com.springboot.backend.luismartinez.billingsapp.billingbackend.entities;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.enums.InvoiceStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "invoices")
public class Invoice {

    // Getters and Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    @NotNull(message = "Creation date cannot be null")
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceItem> items;

    @Column(name = "tax_rate")
    private Double taxRate = 0.19; // Default tax rate 19%

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceStatus status;

    public Invoice() {
        this.items = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
    }

    // Calculated fields
    public Double getSubtotal() {
        return items.stream()
                .mapToDouble(InvoiceItem::getSubtotal)
                .sum();
    }

    public Double getTaxAmount() {
        return getSubtotal() * taxRate;
    }

    public Double getTotal() {
        return getSubtotal() + getTaxAmount();
    }

    // Helper method to add items
    public void addItem(InvoiceItem item) {
        items.add(item);
        item.setInvoice(this);
    }

    public void removeItem(InvoiceItem item) {
        items.remove(item);
        item.setInvoice(null);
    }

    @PrePersist
    private void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}