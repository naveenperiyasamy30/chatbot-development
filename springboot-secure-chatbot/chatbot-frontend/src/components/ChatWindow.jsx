import React, { useEffect, useRef } from "react";

export default function ChatWindow({ messages, isTyping }) {
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const formatBotResponse = (text) => {
    let formatted = text;
    formatted = formatted.replace(/###\s*(.*)/g, "<br><b>$1</b>");
    formatted = formatted.replace(/\*\*\*(.*?)\*\*\*/g, "<b><i>$1</i></b>");
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    formatted = formatted.replace(/\*(.*?)\*/g, "<i>$1</i>");
    return formatted;
  };

  return (
    <div
      ref={chatWindowRef}
      id="chat-window"
      className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4"
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
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
  );
}