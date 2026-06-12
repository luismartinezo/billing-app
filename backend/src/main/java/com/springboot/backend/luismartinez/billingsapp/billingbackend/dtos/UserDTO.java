package com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos;

import lombok.Data;

import java.util.List;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String lastname;
    private String email;
    private String username;
    private List<String> roles;
}
