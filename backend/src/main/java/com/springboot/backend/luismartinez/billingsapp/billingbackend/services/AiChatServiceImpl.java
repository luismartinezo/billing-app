package com.springboot.backend.luismartinez.billingsapp.billingbackend.services;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.dtos.AiChatRequest;
import org.springframework.stereotype.Service;

@Service
public class AiChatServiceImpl implements AiChatService {

    private final InvoiceAgentService invoiceAgentService;

    public AiChatServiceImpl(InvoiceAgentService invoiceAgentService) {
        this.invoiceAgentService = invoiceAgentService;
    }

    @Override
    public String chat(AiChatRequest request) {
        return invoiceAgentService.handleMessage(request.getMessage());
    }
}
