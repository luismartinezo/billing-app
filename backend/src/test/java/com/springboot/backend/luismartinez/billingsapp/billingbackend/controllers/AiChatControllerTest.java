package com.springboot.backend.luismartinez.billingsapp.billingbackend.controllers;

import com.springboot.backend.luismartinez.billingsapp.billingbackend.services.AiProvider;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.services.AiChatServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AiChatController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(AiChatServiceImpl.class)
class AiChatControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnAiChatResponse() throws Exception {
        mockMvc.perform(post("/api/v1/ai/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"hello\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reply").value("Test AI response: hello"));
    }

    @TestConfiguration
    static class AiChatControllerTestConfig {
        @Bean
        AiProvider aiProvider() {
            return message -> "Test AI response: " + message;
        }
    }
}
