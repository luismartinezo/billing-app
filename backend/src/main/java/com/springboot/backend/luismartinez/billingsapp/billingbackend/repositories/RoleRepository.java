package com.springboot.backend.luismartinez.billingsapp.billingbackend.repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.entities.Role;

public interface RoleRepository extends CrudRepository<Role, Long>{

    Optional<Role> findByName(String name);

}
