package com.springboot.backend.luismartinez.billingsapp.billingbackend.mappers;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.UserDTO;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Role;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setLastname(user.getLastname());
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());
        dto.setRoles(user.getRoles().stream().map(Role::getName).toList());
        return dto;
    }
}
