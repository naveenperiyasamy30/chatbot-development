package com.chatbot.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.chatbot.model.ChatMessage;
import com.chatbot.service.ChatService;

import java.util.List;
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    private final ChatService chatService;

    // Ask bot
    @PostMapping
    public String chat(@RequestBody ChatRequest request) {
        return chatService.askBot(request.getMessage());
    }

    // Get all chat history
    @GetMapping("/history")
    public List<ChatMessage> getHistory() {
        return chatService.getHistory();
    }

    // DTO for request
    public static class ChatRequest {
        private String message;

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}