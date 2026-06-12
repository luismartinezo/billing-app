package com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos;

import lombok.Data;

@Data
public class CustomerDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String name;
    private String email;
    private String address;
    private String phone;
}
