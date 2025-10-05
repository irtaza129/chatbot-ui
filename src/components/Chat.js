import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./chat.css";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async (text) => {
    const query = text || input;
    if (!query.trim()) return;

    const userMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const baseUrl = process.env.REACT_APP_API_URL?.replace(/\/+$/, "") || "";
      const res = await fetch(`${baseUrl}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();

      const botMessage = {
        role: "bot",
        content: data.answer || "No reply from server.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("❌ API error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error connecting to API. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    "What is KYC in crypto compliance?",
    "Explain AML in crypto.",
    "How is FATF related to crypto?",
    "What are sanctions screening checks?",
    "Why is blockchain transparency important?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chat-wrapper">
      <div className="chat-box">
        <h1 className="chat-title">💬 Crypto Compliance Chatbot</h1>

        <div className="chat-window">
          {messages.length === 0 && (
            <div className="placeholder-questions">
              <p>Try asking one of these:</p>
              {sampleQueries.map((q, i) => (
                <button key={i} onClick={() => handleSend(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))}

          {loading && (
            <div className="message bot loading">
              <span className="typing-dots">
                <span></span><span></span><span></span>
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask about crypto compliance..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={() => handleSend()} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>

        <div
          className="about-dev"
          onMouseEnter={() => setShowAbout(true)}
          onMouseLeave={() => setShowAbout(false)}
          onClick={() => setShowAbout((prev) => !prev)}
        >
          <p>👨‍💻 About the Developer</p>
          {showAbout && (
            <div className="about-popup">
              <p><b>Irtaza Ali</b></p>
              <p>Full time SQA Engineer and part time AI Developer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
