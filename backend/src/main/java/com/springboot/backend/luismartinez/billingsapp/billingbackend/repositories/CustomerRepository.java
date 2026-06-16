package com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByEmail(String email);
}
