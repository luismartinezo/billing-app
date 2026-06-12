package com.springboot.backend.luismartinez.billingsapp.billingbackend.services;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.AiChatRequest;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.AiChatResponse;

public interface AiChatService {

    AiChatResponse chat(AiChatRequest request);
}
