package com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AuthUserResponse {
    private String username;
    private String email;
    private String name;
    private String lastname;
    private List<String> roles;
}
