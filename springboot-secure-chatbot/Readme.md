# AI Chatbot (Spring Boot + React)

This is a simple chatbot project built with **Spring Boot (backend)** and **React (frontend)**.  
The backend securely handles API key and forwards user messages to the DeepSeek API.  
The frontend provides a clean chat interface for interaction.

---

### PREVIEW:

[![Watch the video](https://img.youtube.com/vi/POpXWshxE6A/0.jpg)](https://www.youtube.com/watch?v=POpXWshxE6A)
 
---

## 🚀 Features
- React-based modern chat UI  
- Spring Boot REST API backend  
- API key is stored in backend (not exposed to frontend)  
- Secure communication between frontend and backend  
- Easy to extend and customize  

---

## 🛠️ Tech Stack
- **Frontend:** React, CSS  
- **Backend:** Java 17, Spring Boot 3.x  
- **API:** DeepSeek API (via OpenRouter or direct)  

---

## ⚙️ Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/your-username/chatbot.git
cd chatbot

```

### 2. Backend Setup (Spring Boot)

- Update application.properties with your DeepSeek API key:
```text
server.port=9090
deepseek.api.key=YOUR_API_KEY
deepseek.api.url=https://api.openrouter.ai/v1/chat/completions
```
---

- Run Spring Boot app:

```bash
mvn spring-boot:run
```

Backend runs at 👉 http://localhost:8080/api/chat
---
### 3.Frontend Setup (React)

```bash
cd frontend
npm install
npm start

```
Frontend runs at 👉 http://localhost:3000
---

### 🔐 Security Notes


- API key is stored in application.properties (safe in backend).

- Frontend never contains the API key.

- Always use .gitignore to avoid committing sensitive files.

---
### 📌 Usage

- Open http://localhost:3000

- Type a message in the chatbox

- Backend calls DeepSeek API securely and returns response

