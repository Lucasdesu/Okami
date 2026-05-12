"use client";

import { useEffect, useMemo, useState } from "react";

type Conversation = {
  session_id: string;
  source: string;
  updated_at: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
  created_at: string;
};

export default function DashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch("/api/dashboard/conversations")
      .then((r) => r.json())
      .then((data) => {
        const list = (data.conversations ?? []) as Conversation[];
        setConversations(list);
        if (list[0]?.session_id) setSelectedSession(list[0].session_id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedSession) return;
    void fetch(`/api/dashboard/messages/${selectedSession}`)
      .then((r) => r.json())
      .then((data) => setMessages((data.messages ?? []) as ChatMessage[]));
  }, [selectedSession]);

  const title = useMemo(() => {
    if (!selectedSession) return "Nenhuma conversa selecionada";
    return `Sessao: ${selectedSession}`;
  }, [selectedSession]);

  return (
    <main style={{ padding: 20, fontFamily: "Arial, sans-serif", background: "#f6f7fb", minHeight: "100vh" }}>
      <h1 style={{ marginTop: 0 }}>Dashboard de Conversas</h1>
      <p style={{ color: "#425466" }}>Visualize historico de atendimento do chat web.</p>

      <section style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
        <aside style={{ background: "#fff", border: "1px solid #d9deea", borderRadius: 12, padding: 12, maxHeight: "75vh", overflow: "auto" }}>
          <h2 style={{ marginTop: 0, fontSize: 16 }}>Sessoes</h2>
          {loading ? <p>Carregando...</p> : null}
          {conversations.map((c) => (
            <button
              key={c.session_id}
              onClick={() => setSelectedSession(c.session_id)}
              style={{
                width: "100%",
                textAlign: "left",
                marginBottom: 8,
                border: c.session_id === selectedSession ? "1px solid #6039cf" : "1px solid #d9deea",
                background: c.session_id === selectedSession ? "#f3efff" : "#fff",
                borderRadius: 8,
                padding: 10,
                cursor: "pointer"
              }}
            >
              <div style={{ fontSize: 12, color: "#617085" }}>{c.source}</div>
              <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}>{c.session_id}</div>
              <div style={{ fontSize: 12, color: "#617085" }}>{new Date(c.updated_at).toLocaleString("pt-BR")}</div>
            </button>
          ))}
        </aside>

        <section style={{ background: "#fff", border: "1px solid #d9deea", borderRadius: 12, padding: 12, maxHeight: "75vh", overflow: "auto" }}>
          <h2 style={{ marginTop: 0, fontSize: 16 }}>{title}</h2>
          {messages.map((m) => (
            <div key={m.id} style={{ marginBottom: 10, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div
                style={{
                  maxWidth: "70%",
                  borderRadius: 10,
                  padding: "8px 10px",
                  background: m.role === "user" ? "#115994" : "#eef2ff",
                  color: m.role === "user" ? "#fff" : "#1e2a3b"
                }}
              >
                <div style={{ fontSize: 13 }}>{m.content}</div>
                <div style={{ fontSize: 11, opacity: 0.75, marginTop: 4 }}>{new Date(m.created_at).toLocaleString("pt-BR")}</div>
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
