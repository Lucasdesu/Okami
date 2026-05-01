import { NextResponse } from "next/server";

type ChatRequest = {
  sessionId: string;
  message: string;
  source?: "web" | "instagram";
};

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequest;

  if (!body?.sessionId || !body?.message) {
    return NextResponse.json({ error: "sessionId e message são obrigatórios" }, { status: 400 });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json({
      reply: "Webhook do n8n não configurado. Defina N8N_WEBHOOK_URL no ambiente."
    });
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: body.sessionId,
        message: body.message,
        source: body.source ?? "web",
        timestamp: new Date().toISOString()
      })
    });

    const data = await upstream.json().catch(() => ({}));
    const reply = typeof data?.reply === "string" ? data.reply : "Recebi sua mensagem. Um momento.";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({
      reply: "Estou com instabilidade no momento. Tente novamente em instantes."
    });
  }
}
