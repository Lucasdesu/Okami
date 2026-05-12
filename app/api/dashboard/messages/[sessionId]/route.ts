import { NextResponse } from "next/server";
import { listMessagesBySession } from "@/lib/chatRepository";

export async function GET(
  _req: Request,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await context.params;
    const messages = await listMessagesBySession(sessionId);
    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ error: "Falha ao carregar mensagens." }, { status: 500 });
  }
}