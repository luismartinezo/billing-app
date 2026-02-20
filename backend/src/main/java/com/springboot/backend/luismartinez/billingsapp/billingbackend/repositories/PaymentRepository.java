package com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository <Payment, Long> {
    List<Payment> findByInvoiceId(Long invoiceId);
}
