package com.springboot.backend.luismartinez.billingsapp.billingbackend.models;

import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public interface IUser {

    boolean isAdmin();
    Collection<? extends GrantedAuthority> getAuthorities();
    String getPassword();
    String getUsername();
    boolean isAccountNonExpired();
    boolean isAccountNonLocked();
    boolean isCredentialsNonExpired();
    boolean isEnabled();
}
