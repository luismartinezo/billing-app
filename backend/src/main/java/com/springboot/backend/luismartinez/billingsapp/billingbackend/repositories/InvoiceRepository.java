package com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Invoice;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByCustomerId(Long customerId);
    
    @Query("SELECT i FROM Invoice i JOIN FETCH i.customer JOIN FETCH i.items WHERE i.id = ?1")
    Invoice findByIdWithCustomerAndItems(Long id);
}