import React, { useState } from "react";

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    onSend(input);
    setInput("");
  };

  return (
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
            handleSend();
          }
        }}
      />
      <button id="send-btn" className="font-bold" onClick={handleSend}>
        Send
      </button>
    </div>
  );
}