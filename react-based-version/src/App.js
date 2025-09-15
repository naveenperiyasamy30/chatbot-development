// src/App.jsx
import { useState, useRef, useEffect } from "react";
import "./styles.css"; // keep your CSS exactly as you wrote

export default function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatWindowRef = useRef(null);

  const key = "YOUR API KEY"; // Replace with your OpenRouter key

  // Auto-scroll on new message
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  async function getBotResponse(userInput) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "HTTP-Referer": "https://github.com/naveenperiyasamy30/chatbot-development",
          "X-Title": "Compositor Instinct",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [{ role: "user", content: userInput }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("API call failed:", error);
      return "Sorry, something went wrong. Please try again later.";
    }
  }

  function formatBotResponse(text) {
    let formatted = text;
    formatted = formatted.replace(/###\s*(.*)/g, "<br><b>$1</b>");
    formatted = formatted.replace(/\*\*\*(.*?)\*\*\*/g, "<b><i>$1</i></b>");
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    formatted = formatted.replace(/\*(.*?)\*/g, "<i>$1</i>");
    return formatted;
  }

  async function sendMessage() {
    if (input.trim() === "") return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setIsTyping(true);

    // Reset textarea height to default
    const textarea = document.getElementById("user-input");
    if (textarea) 
      {
        textarea.style.height = "4.1rem";
        
        textarea.style.padding = "0.5rem 1rem"; 
      }
      ;
    
    // Get bot reply
    const botReply = await getBotResponse(input);

    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: botReply },
    ]);
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="chat-container w-full max-w-sm h-[650px] flex flex-col">
        {/* Header */}
        <div className="chat-header p-4 text-center text-lg font-bold">
          Chatbot
        </div>

        {/* Chat window */}
        <div
          id="chat-window"
          ref={chatWindowRef}
          className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`message-box px-4 py-2 max-w-[80%] ${
                  msg.sender === "user" ? "user-message" : "bot-message"
                }`}
                dangerouslySetInnerHTML={{
                  __html: msg.sender === "bot" ? formatBotResponse(msg.text) : msg.text,
                }}
              />
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="message-box bot-message px-4 py-2 max-w-[80%] flex items-center space-x-2">
                <div className="loader"></div>
                <span>Fetching...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 bg-transparent flex items-end space-x-2 border-t-2 border-primary-color">
          <textarea
            id="user-input"
            placeholder="Type a message..."
            className="flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button id="send-btn" className="font-bold" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
