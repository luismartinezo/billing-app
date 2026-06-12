package com.springboot.backend.luismartinez.billingsapp.billingbackend.services;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.AiChatRequest;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.AiChatResponse;
import org.springframework.stereotype.Service;

@Service
public class AiChatServiceImpl implements AiChatService {

    private final AiProvider aiProvider;

    public AiChatServiceImpl(AiProvider aiProvider) {
        this.aiProvider = aiProvider;
    }

    @Override
    public AiChatResponse chat(AiChatRequest request) {
        return new AiChatResponse(aiProvider.generateReply(request.getMessage()));
    }
}
