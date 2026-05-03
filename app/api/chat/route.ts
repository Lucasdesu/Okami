import { NextResponse } from "next/server";

type ChatRequest = {
  sessionId: string;
  message: string;
  source?: "web" | "instagram";
};

type RateEntry = { count: number; resetAt: number };

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;
const MAX_MESSAGE_LENGTH = 500;

const globalForRateLimit = globalThis as typeof globalThis & {
  __okamiRateLimit?: Map<string, RateEntry>;
};
const rateLimitStore = globalForRateLimit.__okamiRateLimit ?? new Map<string, RateEntry>();
globalForRateLimit.__okamiRateLimit = rateLimitStore;

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now >= entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  rateLimitStore.set(key, entry);

  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

export async function POST(req: Request) {
  const body = (await req.json()) as ChatRequest;
  const message = body?.message?.trim() ?? "";
  const sessionId = body?.sessionId?.trim() ?? "";

  if (!sessionId || !message) {
    return NextResponse.json({ error: "sessionId e message sao obrigatorios" }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "Mensagem muito longa. Limite de 500 caracteres." }, { status: 400 });
  }

  const key = `${getClientIp(req)}:${sessionId}`;
  if (isRateLimited(key)) {
    return NextResponse.json(
      { error: "Muitas mensagens em pouco tempo. Aguarde 1 minuto e tente novamente." },
      { status: 429 }
    );
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json({
      reply: "Webhook do n8n nao configurado. Defina N8N_WEBHOOK_URL no ambiente."
    });
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        message,
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
