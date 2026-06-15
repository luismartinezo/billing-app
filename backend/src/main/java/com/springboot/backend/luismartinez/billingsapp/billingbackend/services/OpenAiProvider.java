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
import org.springframework.web.client.RestClientResponseException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.Optional;

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
        String apiKey = resolveValue(properties.getApiKey(), "OPENAI_API_KEY");
        String model = resolveValue(properties.getModel(), "OPENAI_MODEL");

        if (!StringUtils.hasText(apiKey)) {
            throw new BusinessException("OpenAI API key is not configured");
        }

        try {
            JsonNode response = restClientBuilder
                    .baseUrl(properties.getBaseUrl())
                    .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .build()
                    .post()
                    .uri("/responses")
                    .body(Map.of(
                            "model", model,
                            "input", message
                    ))
                    .retrieve()
                    .body(JsonNode.class);

            return extractText(response);
        } catch (RestClientResponseException ex) {
            throw new BusinessException("AI provider request failed: " + extractProviderError(ex));
        } catch (RestClientException ex) {
            throw new BusinessException("AI provider request failed");
        }
    }

    private String resolveValue(String propertyValue, String envName) {
        if (StringUtils.hasText(propertyValue)) {
            return sanitize(propertyValue);
        }

        String environmentValue = System.getenv(envName);
        if (StringUtils.hasText(environmentValue)) {
            return sanitize(environmentValue);
        }

        return readEnvFileValue(envName)
                .map(this::sanitize)
                .orElse("");
    }

    private Optional<String> readEnvFileValue(String envName) {
        return Optional.ofNullable(readEnvFileValue(Path.of(".env"), envName)
                .orElseGet(() -> readEnvFileValue(Path.of("backend", ".env"), envName).orElse(null)));
    }

    private Optional<String> readEnvFileValue(Path path, String envName) {
        if (!Files.exists(path)) {
            return Optional.empty();
        }

        try {
            return Files.readAllLines(path).stream()
                    .map(String::trim)
                    .filter(line -> !line.isBlank())
                    .filter(line -> !line.startsWith("#"))
                    .map(line -> line.startsWith("export ") ? line.substring("export ".length()).trim() : line)
                    .filter(line -> line.startsWith(envName + "="))
                    .map(line -> line.substring((envName + "=").length()))
                    .findFirst();
        } catch (IOException ex) {
            return Optional.empty();
        }
    }

    private String sanitize(String value) {
        String sanitized = value.trim();
        if ((sanitized.startsWith("\"") && sanitized.endsWith("\""))
                || (sanitized.startsWith("'") && sanitized.endsWith("'"))) {
            return sanitized.substring(1, sanitized.length() - 1).trim();
        }
        return sanitized;
    }

    private String extractProviderError(RestClientResponseException ex) {
        String body = ex.getResponseBodyAsString();
        if (StringUtils.hasText(body)) {
            return body;
        }
        return ex.getStatusCode() + " " + ex.getStatusText();
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
