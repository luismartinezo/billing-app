package com.springboot.backend.luismartinez.billingsapp.billingbackend.mappers;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.CustomerDTO;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public CustomerDTO toDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setFirstName(customer.getFirstName());
        dto.setLastName(customer.getLastName());
        dto.setName(customer.getFirstName() + " " + customer.getLastName());
        dto.setEmail(customer.getEmail());
        dto.setAddress(customer.getAddress());
        dto.setPhone(customer.getPhone());
        return dto;
    }
}
