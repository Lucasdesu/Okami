import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function unauthorizedResponse() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Okami Dashboard"' }
  });
}

export function middleware(req: NextRequest) {
  const username = process.env.DASHBOARD_USERNAME;
  const password = process.env.DASHBOARD_PASSWORD;

  if (!username || !password) {
    return new NextResponse("Dashboard auth vars missing", { status: 500 });
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) {
    return unauthorizedResponse();
  }

  const base64Credentials = authHeader.split(" ")[1] ?? "";
  const credentials = atob(base64Credentials);
  const [user, pass] = credentials.split(":");

  if (user !== username || pass !== password) {
    return unauthorizedResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/dashboard/:path*"]
};
