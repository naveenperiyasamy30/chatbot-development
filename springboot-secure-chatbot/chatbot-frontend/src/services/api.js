const API_BASE = "http://localhost:9090/api";

export async function fetchChatHistory() {
  try {
    const res = await fetch(`${API_BASE}/chat/history`);
    if (!res.ok) throw new Error("Failed to fetch history");
    return await res.json();
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
}

export async function sendMessageToBot(message) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return await res.text();
  } catch (error) {
    console.error("Error sending message:", error);
    return "Error: Unable to get response from bot";
  }
}