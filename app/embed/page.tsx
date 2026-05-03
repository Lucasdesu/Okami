"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
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
  const messagesRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, loading]);

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

  function onInputKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void onSend(e as unknown as FormEvent);
    }
  }

  return (
    <main className="chat-root">
      <header className="chat-header">Atendimento</header>
      <section className="chat-messages" ref={messagesRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`bubble ${msg.from}`}>
            {msg.text}
          </div>
        ))}
        {loading ? <div className="bubble bot">Digitando...</div> : null}
      </section>
      <form className="chat-input" onSubmit={onSend}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder="Digite sua mensagem"
          rows={1}
        />
        <button type="submit" disabled={loading}>Enviar</button>
      </form>
    </main>
  );
}
