import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import gsap from "gsap";
import "./Chat.css";

export default function Chat({ userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Animate chat container on mount
    gsap.fromTo(
      ".chat-container",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    // Auto scroll to bottom
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Animate new messages
    if (messages.length > 0) {
      gsap.fromTo(
        `.msg-${messages.length - 1}`,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);

    try {
      const res = await axios.post(
        `https://genaibackend-r809.onrender.com/chats/${userId}?message=${encodeURIComponent(
          input
        )}`
      );

      setMessages([
        ...newMessages,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch (err) {
      console.error("Error sending message:", err);
    }

    setInput("");
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">💬 Chat with AI</h2>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-message msg-${i} ${
              msg.role === "user" ? "user" : "bot"
            }`}
          >
            <span>{msg.content}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="chat-send-btn" onClick={sendMessage}>
          Send 🚀
        </button>
      </div>
    </div>
  );
}
