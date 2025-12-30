package com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // You can add custom query methods here if needed
}