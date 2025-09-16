package com.chatbot.service;

import com.chatbot.model.ChatMessage;
import com.chatbot.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;

    @Value("${openrouter.api.key}")
    private String apiKey;

    @Value("${openrouter.api.url}")
    private String apiUrl;

    private final WebClient webClient = WebClient.create();

    public String askBot(String userMessage) {
        // Save user message
        chatMessageRepository.save(ChatMessage.builder()
                .sender("user")
                .message(userMessage)
                .timestamp(LocalDateTime.now())
                .build());

        // Call OpenRouter API
        Map<String, Object> requestBody = Map.of(
                "model", "deepseek/deepseek-r1:free",
                "messages", List.of(
                        Map.of("role", "user", "content", userMessage)
                )
        );

        Map<String, Object> response = webClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        String botReply = "Sorry, something went wrong";

        if (response != null) {
            Object choicesObj = response.get("choices");
            if (choicesObj instanceof List<?>) {
                List<Map<String, Object>> choices = ((List<?>) choicesObj).stream()
                        .filter(Map.class::isInstance)
                        .map(Map.class::cast)
                        .collect(Collectors.toList());

                if (!choices.isEmpty()) {
                    Map<String, Object> choice = choices.get(0);
                    Object messageObj = choice.get("message");
                    if (messageObj instanceof Map<?, ?> messageMap) {
                        Object contentObj = messageMap.get("content");
                        if (contentObj instanceof String contentStr) {
                            botReply = contentStr;
                        }
                    }
                }
            }
        }

        // Format bot response
        String formatted = formatBotResponse(botReply);

        // Save bot message
        chatMessageRepository.save(ChatMessage.builder()
                .sender("bot")
                .message(formatted)
                .timestamp(LocalDateTime.now())
                .build());

        return formatted;
    }

    public List<ChatMessage> getHistory() {
        return chatMessageRepository.findAll();
    }

    private String formatBotResponse(String text) {
        String formatted = text;
        formatted = formatted.replaceAll("###\\s*(.*)", "<br><b>$1</b>");
        formatted = formatted.replaceAll("\\*\\*\\*(.*?)\\*\\*\\*", "<b><i>$1</i></b>");
        formatted = formatted.replaceAll("\\*\\*(.*?)\\*\\*", "<b>$1</b>");
        formatted = formatted.replaceAll("\\*(.*?)\\*", "<i>$1</i>");
        return formatted;
    }
}