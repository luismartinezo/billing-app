package com.springboot.backend.luismartinez.billingsapp.billingbackend.services;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.enums.InvoiceStatus;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.exceptions.BusinessException;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.exceptions.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Invoice;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.InvoiceItem;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.CustomerRepository;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.InvoiceRepository;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.ProductRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Invoice> getAll() {
        return invoiceRepository.findAll();
    }

    @Override
    public Invoice getById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invoice with id " + id + " not found"));
    }

    @Override
    public List<Invoice> getByCustomerId(Long customerId) {
        return invoiceRepository.findByCustomerId(customerId);
    }

    @Override
    @Transactional
    public Invoice createInvoice(Invoice invoice) {
        // Current date
        LocalDateTime now = LocalDateTime.now();

        // createdAt
        invoice.setCreatedAt(now);
        // issueDate (if it doesn't come from the frontend)
        if (invoice.getIssueDate() == null) {
            invoice.setIssueDate(LocalDate.now());
        }
        if (invoice.getStatus() == null) {
            invoice.setStatus(InvoiceStatus.DRAFT);
        }
        // dueDate (example: 14 días)
        if (invoice.getDueDate() == null) {
            invoice.setDueDate(invoice.getIssueDate().plusDays(14));
        }
        // validate customer
        Long customerId = invoice.getCustomer() != null ? invoice.getCustomer().getId() : null;
        if (customerId == null) {
            throw new IllegalArgumentException("Customer id is required");
        }

        if (invoice.getIssueDate() != null && invoice.getDueDate().isBefore(invoice.getIssueDate())) {
            throw new IllegalArgumentException("Due date cannot be before issue date");
        }

        var customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        invoice.setCustomer(customer);

        // Ensure each item has current product and price
        for (InvoiceItem item : invoice.getItems()) {
            var product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + item.getProduct().getId()));
            item.setProduct(product);
            item.setPrice(BigDecimal.valueOf(product.getPrice()));
        }

        // simple invoice number generation: YYYYMMddHHmmss + random
        var fmt = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        invoice.setInvoiceNumber(fmt.format(invoice.getCreatedAt()) + "-" + System.currentTimeMillis()%1000);

        // ✅ SET INITIAL STATUS HERE
        invoice.setStatus(InvoiceStatus.PENDING);

        calculateTotals(invoice);

        return invoiceRepository.save(invoice);
    }

    private void calculateTotals(Invoice invoice) {

        BigDecimal subtotal = BigDecimal.ZERO;

        for (InvoiceItem item : invoice.getItems()) {

            BigDecimal itemTotal = item.getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()))
                    .setScale(2, RoundingMode.HALF_UP);

            item.setTotal(itemTotal);
            subtotal = subtotal.add(itemTotal);

            // ensure a two-way relationship
            item.setInvoice(invoice);
        }

        invoice.setSubtotal(subtotal);

        // Correct tax rate (percentage)
        BigDecimal taxRate = invoice.getTaxRate() != null
                ? invoice.getTaxRate()
                : new BigDecimal("0.19");

        invoice.setTaxRate(taxRate);

        BigDecimal taxAmount = subtotal
                .multiply(taxRate)
                .setScale(2, RoundingMode.HALF_UP);

        invoice.setTaxAmount(taxAmount);
        invoice.setTotal(subtotal.add(taxAmount));
    }

    public Invoice issueInvoice(Long invoiceId) {

        Invoice invoice = getInvoiceOrThrow(invoiceId);

        if (invoice.getStatus() != InvoiceStatus.DRAFT) {
            throw new IllegalStateException("Only DRAFT invoices can be issued");
        }

        invoice.setStatus(InvoiceStatus.ISSUED);
        invoice.setIssueDate(LocalDate.now());
        invoice.setDueDate(invoice.getIssueDate().plusDays(14));

        calculateTotals(invoice);

        return invoiceRepository.save(invoice);
    }

    @Override
    public Invoice payInvoice(Long invoiceId) {
        Invoice invoice = getById(invoiceId);

        if (invoice.getStatus() != InvoiceStatus.ISSUED) {
            throw new BusinessException("Only issued invoices can be paid");
        }

        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setPaidAt(LocalDateTime.now());

        return invoiceRepository.save(invoice);
    }


    public Invoice markAsPaid(Long invoiceId) {

        Invoice invoice = getInvoiceOrThrow(invoiceId);

        if (invoice.getStatus() != InvoiceStatus.ISSUED
                && invoice.getStatus() != InvoiceStatus.OVERDUE) {
            throw new IllegalStateException("Only ISSUED or OVERDUE invoices can be paid");
        }

        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setPaidAt(LocalDateTime.now());

        return invoiceRepository.save(invoice);
    }

    public Invoice cancelInvoice(Long invoiceId) {

        Invoice invoice = getById(invoiceId);

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new IllegalStateException("Paid invoices cannot be cancelled");
        }

        invoice.setStatus(InvoiceStatus.CANCELLED);

        return invoiceRepository.save(invoice);
    }

    private void validateEditable(Invoice invoice) {
        if (invoice.getStatus() != InvoiceStatus.DRAFT) {
            throw new IllegalStateException("Only DRAFT invoices can be edited");
        }
    }

    private Invoice getInvoiceOrThrow(Long invoiceId) {
        return invoiceRepository.findById(invoiceId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invoice not found with id: " + invoiceId
                        )
                );
    }

    @Override
    public void delete(Long id) {
        invoiceRepository.findById(id).ifPresent(invoiceRepository::delete);
    }
}
