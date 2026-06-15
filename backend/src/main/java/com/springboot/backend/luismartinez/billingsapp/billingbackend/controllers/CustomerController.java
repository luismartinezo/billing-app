package com.springboot.backend.luismartinez.billingsapp.billingbackend.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.CustomerDTO;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Customer;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.mappers.CustomerMapper;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.CustomerRepository;

import java.util.List;

@RestController
@RequestMapping("${api.version}/customers")
@CrossOrigin(origins = "http://localhost:4200")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerMapper customerMapper;

    @GetMapping
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(customerMapper::toDTO)
                .toList();
    }

    @GetMapping({"/{id}", "detail/{id}"})
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable Long id) {
        return customerRepository.findById(id)
                .map(customerMapper::toDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping({"", "create"})
    public ResponseEntity<CustomerDTO> createCustomer(@Valid @RequestBody Customer customer) {
        Customer savedCustomer = customerRepository.save(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(customerMapper.toDTO(savedCustomer));
    }

    @PutMapping({"/{id}", "update/{id}"})
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable Long id, @Valid @RequestBody Customer customer) {
        return customerRepository.findById(id)
                .map(existingCustomer -> {
                    customer.setId(id);
                    Customer updatedCustomer = customerRepository.save(customer);
                    return ResponseEntity.ok(customerMapper.toDTO(updatedCustomer));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping({"/{id}", "delete/{id}"})
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        return customerRepository.findById(id)
                .map(customer -> {
                    customerRepository.delete(customer);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
