package com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    // You can add custom query methods here if needed
}