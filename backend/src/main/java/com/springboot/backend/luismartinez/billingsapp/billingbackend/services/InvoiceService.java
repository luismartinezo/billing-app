package com.springboot.backend.luismartinez.billingsapp.billingbackend.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Invoice;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Payment;

public interface InvoiceService {
    List<Invoice> getAll();
    Invoice getById(Long id);
    List<Invoice> getByCustomerId(Long customerId);
    Invoice createInvoice(Invoice invoice);
    Invoice issueInvoice(Long id);
    Invoice payInvoice(Long id);
    Invoice cancelInvoice(Long id);
    void delete(Long id);
    Payment registerPayment(Long invoiceId, BigDecimal amount, String method);
}
