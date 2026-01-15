package com.springboot.backend.luismartinez.billingsapp.billingbackend.services;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.enums.InvoiceStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Invoice;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.InvoiceItem;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.CustomerRepository;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.InvoiceRepository;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.ProductRepository;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Invoice> findAll() {
        return invoiceRepository.findAll();
    }

    @Override
    public Optional<Invoice> findById(Long id) {
        return Optional.ofNullable(invoiceRepository.findByIdWithCustomerAndItems(id));
    }

    @Override
    public List<Invoice> findByCustomerId(Long customerId) {
        return invoiceRepository.findByCustomerId(customerId);
    }

    @Override
    @Transactional
    public Invoice createInvoice(Invoice invoice) {
        // validate customer
        Long customerId = invoice.getCustomer() != null ? invoice.getCustomer().getId() : null;
        if (customerId == null) {
            throw new IllegalArgumentException("Customer id is required");
        }

        var customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        invoice.setCustomer(customer);

        // Ensure each item has current product and price
        for (InvoiceItem item : invoice.getItems()) {
            var product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + item.getProduct().getId()));
            item.setProduct(product);
            item.setPrice(product.getPrice());
        }

        // simple invoice number generation: YYYYMMddHHmmss + random
        var fmt = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        invoice.setInvoiceNumber(fmt.format(invoice.getCreatedAt()) + "-" + System.currentTimeMillis()%1000);

        // ✅ SET INITIAL STATUS HERE
        invoice.setStatus(InvoiceStatus.PENDING);

        return invoiceRepository.save(invoice);
    }

    @Override
    public void delete(Long id) {
        invoiceRepository.findById(id).ifPresent(invoiceRepository::delete);
    }
}
