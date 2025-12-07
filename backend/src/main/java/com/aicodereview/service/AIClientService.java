//This is the bridge that calls your Phase 1 Python Engine.

package com.aicodereview.service;

import com.aicodereview.model.CodeReviewRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AIClientService {

    private final WebClient webClient;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    public AIClientService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String sendToAI(CodeReviewRequest request) {
        try {
            return webClient.post()
                    .uri(aiServiceUrl)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(); // Blocking here is okay because it's running in a background worker
        } catch (Exception e) {
            System.err.println("Error calling AI Engine: " + e.getMessage());
            return null;
        }
    }
}