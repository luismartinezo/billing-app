package com.springboot.backend.luismartinez.billingsapp.billingbackend.services;

import java.util.List;
import java.util.Optional;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Invoice;

public interface InvoiceService {
    List<Invoice> findAll();
    Optional<Invoice> findById(Long id);
    List<Invoice> findByCustomerId(Long customerId);
    Invoice createInvoice(Invoice invoice);
    void delete(Long id);
}
