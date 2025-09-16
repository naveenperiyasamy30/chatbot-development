import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { fetchChatHistory, sendMessageToBot } from "./services/api";
import "./styles.css";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await fetchChatHistory();
        setMessages(history.map((msg) => ({ id: msg.id, sender: msg.sender, text: msg.message })));
      } catch (err) {
        console.error("Error loading history:", err);
      }
    }
    loadHistory();
  }, []);

  const handleSend = async (message) => {
    setMessages((prev) => [...prev, { id: Date.now(), sender: "user", text: message }]);
    setIsTyping(true);
    try {
      const botResponse = await sendMessageToBot(message);
      setMessages((prev) => [...prev, { id: Date.now(), sender: "bot", text: botResponse }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "bot", text: "Error: Unable to get response from bot" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="chat-container w-full max-w-sm h-[650px] flex flex-col">
          <div className="chat-header p-4 text-center text-lg font-bold">Chatbot</div>
          <ChatWindow messages={messages} isTyping={isTyping} />
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </ErrorBoundary>
  );
}