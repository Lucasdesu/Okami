import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "okami-webchat",
    now: new Date().toISOString()
  });
}
