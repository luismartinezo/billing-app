package com.springboot.backend.luismartinez.billingsapp.billingbackend.services;

import java.util.List;
import java.util.Optional;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Product;

public interface ProductService {
    List<Product> findAll();
    Optional<Product> findById(Long id);
    Product save(Product product);
    Product update(Long id, Product product);
    void delete(Long id);
}
