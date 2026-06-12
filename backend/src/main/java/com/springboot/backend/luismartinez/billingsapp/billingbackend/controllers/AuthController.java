package com.springboot.backend.luismartinez.billingsapp.billingbackend.controllers;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.AuthUserResponse;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.UserDTO;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Role;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.User;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.mappers.UserMapper;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.RoleRepository;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.version}/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;

    @GetMapping("/me")
    public ResponseEntity<AuthUserResponse> me(Authentication authentication) {

        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow();

        AuthUserResponse response = new AuthUserResponse();
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setLastname(user.getLastname());
        response.setRoles(
                user.getRoles().stream()
                        .map(Role::getName)
                        .toList()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody User user){

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Role roleUser = roleRepository.findByName("ROLE_USER")
                .orElseThrow();

        user.setRoles(List.of(roleUser));

        return ResponseEntity.ok(userMapper.toDTO(userRepository.save(user)));
    }
}
