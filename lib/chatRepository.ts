import { supabaseAdmin } from "./supabaseAdmin";

export type ChatMessageRow = {
  id: string;
  session_id: string;
  source: string;
  role: "user" | "bot";
  content: string;
  created_at: string;
};

export async function ensureConversation(sessionId: string, source: string) {
  await supabaseAdmin
    .from("conversations")
    .upsert({ session_id: sessionId, source, updated_at: new Date().toISOString() }, { onConflict: "session_id" });
}

export async function addMessage(sessionId: string, source: string, role: "user" | "bot", content: string) {
  await ensureConversation(sessionId, source);

  await supabaseAdmin.from("messages").insert({
    session_id: sessionId,
    source,
    role,
    content
  });

  await supabaseAdmin
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("session_id", sessionId);
}

export async function listConversations(limit = 100) {
  const { data, error } = await supabaseAdmin
    .from("conversations")
    .select("session_id, source, updated_at")
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data ?? [];
}

export async function listMessagesBySession(sessionId: string) {
  const { data, error } = await supabaseAdmin
    .from("messages")
    .select("id, session_id, source, role, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []) as ChatMessageRow[];
}
