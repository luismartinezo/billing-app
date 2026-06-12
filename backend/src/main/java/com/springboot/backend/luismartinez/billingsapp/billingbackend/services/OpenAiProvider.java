package com.springboot.backend.luismartinez.billingsapp.billingbackend.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.config.OpenAiProperties;
import com.springboot.backend.luismartinez.billingsapp.billingbackend.exceptions.BusinessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.Map;

@Service
public class OpenAiProvider implements AiProvider {

    private final OpenAiProperties properties;
    private final RestClient.Builder restClientBuilder;

    public OpenAiProvider(OpenAiProperties properties, RestClient.Builder restClientBuilder) {
        this.properties = properties;
        this.restClientBuilder = restClientBuilder;
    }

    @Override
    public String generateReply(String message) {
        if (!StringUtils.hasText(properties.getApiKey())) {
            throw new BusinessException("OpenAI API key is not configured");
        }

        try {
            JsonNode response = restClientBuilder
                    .baseUrl(properties.getBaseUrl())
                    .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getApiKey())
                    .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .build()
                    .post()
                    .uri("/responses")
                    .body(Map.of(
                            "model", properties.getModel(),
                            "input", message
                    ))
                    .retrieve()
                    .body(JsonNode.class);

            return extractText(response);
        } catch (RestClientException ex) {
            throw new BusinessException("AI provider request failed");
        }
    }

    private String extractText(JsonNode response) {
        if (response == null) {
            throw new BusinessException("AI provider returned an empty response");
        }

        JsonNode outputText = response.path("output_text");
        if (outputText.isTextual() && StringUtils.hasText(outputText.asText())) {
            return outputText.asText();
        }

        for (JsonNode output : response.path("output")) {
            for (JsonNode content : output.path("content")) {
                JsonNode text = content.path("text");
                if (text.isTextual() && StringUtils.hasText(text.asText())) {
                    return text.asText();
                }
            }
        }

        throw new BusinessException("AI provider response did not include text output");
    }
}
