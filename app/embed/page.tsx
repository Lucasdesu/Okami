"use client";

import { FormEvent, useMemo, useState } from "react";
import "./embed.css";

type Message = {
  from: "user" | "bot";
  text: string;
};

function getSessionId() {
  if (typeof window === "undefined") return "";
  const key = "okami_session_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  localStorage.setItem(key, created);
  return created;
}

export default function EmbedPage() {
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Oi! Posso te ajudar com produtos, prazos e pedidos." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionId = useMemo(() => getSessionId(), []);

  async function onSend(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text, source: "web" })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: "bot", text: data.reply ?? "Sem resposta no momento." }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Falha temporária ao enviar. Tente novamente." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="chat-root">
      <header className="chat-header">Atendimento</header>
      <section className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`bubble ${msg.from}`}>
            {msg.text}
          </div>
        ))}
        {loading ? <div className="bubble bot">Digitando...</div> : null}
      </section>
      <form className="chat-input" onSubmit={onSend}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem"
        />
        <button type="submit" disabled={loading}>Enviar</button>
      </form>
    </main>
  );
}
