import { useState, useRef, useEffect } from "react";

const SUGGESTED = [
  "Can I afford this?",
  "How long to reach my goal?",
  "Where should I cut expenses?",
  "Is my savings rate healthy?",
];

export default function AIChat({ financialContext, apiBase }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I've reviewed your financial data. Ask me anything about your budget, goals, or where to cut back.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(question) {
    const q = question || input.trim();
    if (!q) return;

    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/ai-advice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          financial_context: financialContext,
        }),
      });
      if (!res.ok) throw new Error("AI request failed");
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't connect to the advisor. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            <span className="bubble-icon">{msg.role === "assistant" ? "◈" : "▸"}</span>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble assistant loading">
            <span className="bubble-icon">◈</span>
            <p>
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips */}
      <div className="suggestion-chips">
        {SUGGESTED.map((s, i) => (
          <button
            key={i}
            className="chip"
            onClick={() => sendMessage(s)}
            disabled={loading}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input-row">
        <textarea
          className="chat-input"
          rows={2}
          placeholder="Ask anything about your finances…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="btn-send"
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
