package com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiChatRequest {

    @NotBlank(message = "Message is required")
    private String message;
}
