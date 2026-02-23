package com.springboot.backend.luismartinez.billingsapp.billingbackend.controllers;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.InvoiceDTO;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.PaymentRequest;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Invoice;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Payment;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.mappers.InvoiceMapper;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.services.CustomerService;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.services.InvoiceService;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.services.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("${api.version}/invoices")
@CrossOrigin(origins = "http://localhost:4200")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private ProductService productService;

    @Autowired
    private InvoiceMapper invoiceMapper;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/list")
    public List<Invoice> getAllInvoices() {
        return invoiceService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceDTO> getById(@PathVariable Long id) {
        Invoice invoice = invoiceService.getById(id);
        return ResponseEntity.ok(invoiceMapper.toDTO(invoice));
    }

    @GetMapping("/customer/{customerId}")
    public List<Invoice> getByCustomer(@PathVariable Long customerId) {
        return invoiceService.getByCustomerId(customerId);
    }

    @GetMapping("/{id}/payments/list")
    public List<Payment> getPayments(@PathVariable Long id){
        return paymentRepository.findByInvoiceId(id);
    }

    @PostMapping("/{id}/payments/add")
    public ResponseEntity<Payment> payInvoice(
            @PathVariable Long id,
            @RequestBody PaymentRequest request
        ) {
        Payment payment = invoiceService.registerPayment(
                id,
                request.getAmount(),
                String.valueOf(request.getMethod())
        );
        return ResponseEntity.ok(payment);
    }
    @PostMapping
    public ResponseEntity<Invoice> create(@Valid @RequestBody Invoice invoice) {
        Invoice created = invoiceService.createInvoice(invoice);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        invoiceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Status (PASO 5 y 6)
    @PostMapping("/{id}/issue")
    public Invoice issue(@PathVariable Long id) {
        return invoiceService.issueInvoice(id);
    }

    @PostMapping("/{id}/pay")
    public Invoice pay(@PathVariable Long id) {
        return invoiceService.payInvoice(id);
    }

    @PostMapping("/{id}/cancel")
    public Invoice cancel(@PathVariable Long id) {
        return invoiceService.cancelInvoice(id);
    }
}