package com.springboot.backend.luismartinez.billingsapp.billingbackend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Customer;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.CustomerRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    @Override
    public Optional<Customer> findById(Long id) {
        return customerRepository.findById(id);
    }

    @Override
    public Customer save(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public Customer update(Long id, Customer customer) {
        return customerRepository.findById(id)
                .map(existing -> {
                    customer.setId(id);
                    return customerRepository.save(customer);
                })
                .orElse(null);
    }

    @Override
    public void delete(Long id) {
        customerRepository.findById(id).ifPresent(customerRepository::delete);
    }
}
