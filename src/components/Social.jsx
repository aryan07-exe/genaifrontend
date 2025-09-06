import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatPage({ userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() && !image) return;

    // Append user message locally
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: input || null, image: image ? URL.createObjectURL(image) : null },
    ]);

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      if (input.trim()) formData.append("query", input);
      if (image) formData.append("image", image);

      const response = await axios.post(
        "https://genaibackend-r809.onrender.com/assistant/social",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: response.data.response },
      ]);
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Error sending message." },
      ]);
    } finally {
      setInput("");
      setImage(null);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between shadow-md">
        <h1 className="text-xl font-bold">Social AI Assistant</h1>
        <p className="text-gray-400 text-sm">User ID: {userId}</p>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-lg p-4 rounded-2xl shadow-md break-words ${
              msg.sender === "user"
                ? "bg-blue-600 text-white ml-auto"
                : "bg-gray-700 text-gray-200 ml-0"
            }`}
          >
            {msg.text && <p>{msg.text}</p>}
            {msg.image && (
              <img
                src={msg.image}
                alt="Uploaded"
                className="mt-2 max-h-60 rounded-lg border border-gray-600"
              />
            )}
          </div>
        ))}
        {loading && (
          <div className="max-w-lg p-4 rounded-2xl bg-gray-700 text-gray-200 ml-0 animate-pulse">
            AI is typing...
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input section */}
      <div className="bg-gray-800 p-4 flex items-center gap-3 border-t border-gray-700">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 rounded-full bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Image upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
          title="Upload image"
        >
          📷
        </label>

        {/* Send button */}
        <button
          onClick={sendMessage}
          className="bg-blue-600 px-5 py-3 rounded-full hover:bg-blue-500 transition-colors shadow-md font-semibold"
        >
          Send
        </button>
      </div>

      {/* Preview selected image */}
      {image && (
        <div className="bg-gray-800 p-2 flex items-center justify-between text-gray-200 border-t border-gray-700">
          <span className="truncate">{image.name}</span>
          <button
            onClick={() => setImage(null)}
            className="text-red-400 hover:text-red-500 font-bold"
          >
            ✖
          </button>
        </div>
      )}
    </div>
  );
}
