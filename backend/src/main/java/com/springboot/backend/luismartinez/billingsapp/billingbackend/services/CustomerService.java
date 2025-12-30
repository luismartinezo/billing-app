package com.springboot.backend.luismartinez.billingsapp.billingbackend.services;

import java.util.List;
import java.util.Optional;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Customer;

public interface CustomerService {
    List<Customer> findAll();
    Optional<Customer> findById(Long id);
    Customer save(Customer customer);
    Customer update(Long id, Customer customer);
    void delete(Long id);
}
