package com.springboot.backend.luismartinez.billingsapp.billingbackend.services;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.AiChatRequest;

public interface AiChatService {

    String chat(AiChatRequest request);
}
