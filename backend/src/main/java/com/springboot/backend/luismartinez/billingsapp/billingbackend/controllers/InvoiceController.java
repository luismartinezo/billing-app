package com.springboot.backend.luismartinez.billingsapp.billingbackend.controllers;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Invoice;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("${api.version}/invoices")
@CrossOrigin(origins = "http://localhost:4200")
public class InvoiceController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(@PathVariable Long id) {
        Invoice invoice = invoiceRepository.findByIdWithCustomerAndItems(id);
        return invoice != null ? ResponseEntity.ok(invoice) : ResponseEntity.notFound().build();
    }

    @GetMapping("/customer/{customerId}")
    public List<Invoice> getInvoicesByCustomer(@PathVariable Long customerId) {
        return invoiceRepository.findByCustomerId(customerId);
    }

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@Valid @RequestBody Invoice invoice) {
        // Verify customer exists
        return customerRepository.findById(invoice.getCustomer().getId())
                .map(customer -> {
                    invoice.setCustomer(customer);
                    // Set current price for each item
                    invoice.getItems().forEach(item -> {
                        productRepository.findById(item.getProduct().getId())
                                .ifPresent(product -> {
                                    item.setPrice(BigDecimal.valueOf(product.getPrice()));
                                    item.setProduct(product);
                                });
                    });
                    Invoice savedInvoice = invoiceRepository.save(invoice);
                    return ResponseEntity.status(HttpStatus.CREATED).body(savedInvoice);
                })
                .orElse(ResponseEntity.badRequest().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        return invoiceRepository.findById(id)
                .map(invoice -> {
                    invoiceRepository.delete(invoice);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}