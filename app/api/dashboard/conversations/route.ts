import { NextResponse } from "next/server";
import { listConversations } from "@/lib/chatRepository";

export async function GET() {
  try {
    const conversations = await listConversations(200);
    return NextResponse.json({ conversations });
  } catch {
    return NextResponse.json({ error: "Falha ao carregar conversas." }, { status: 500 });
  }
}
