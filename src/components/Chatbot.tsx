import { useState, useRef, useEffect } from "react";
import { getApiUrl } from "@/config/api";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const API_URL = getApiUrl("");

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "🌾 Hello! I am your Smart Farm AI Assistant. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText },
    ]);

    setInput("");
    setLoading(true);

    try {
      console.log("💬 Chat: Sending message...", { userText, apiUrl: API_URL });
      
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userText }),
      });

      console.log("💬 Chat: Response status", res.status);

      const data = await res.json();
      console.log("💬 Chat: Response data", data);

      if (!res.ok) {
        throw new Error(data.reply || `Server error: ${res.status}`);
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "No response",
        },
      ]);
    } catch (error: any) {
      console.error("❌ Chat error:", error.message);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `⚠️ Error: ${error.message || 'Server Error. Please try again.'}`,
        },
      ]);
    }

    setLoading(false);
  };

  // Send on Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl max-w-[80%] ${
              msg.sender === "user"
                ? "bg-green-600 text-white ml-auto"
                : "bg-gray-100 border"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-500">Typing...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about crops, soil, irrigation..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-green-600 text-white px-4 rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
