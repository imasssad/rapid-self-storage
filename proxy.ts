// First line of defence for the admin panel: no valid session cookie, no admin page or admin API.
// This is only a quick signature check. Every admin page, Server Action and route handler checks the user
// again against the users file (lib/auth.ts), so a gap here never exposes anything on its own.
import { NextResponse, type NextRequest } from "next/server";
import { EDITOR_HINT_COOKIE } from "./lib/editor-hint";
import { SESSION_COOKIE, SESSION_MAX_AGE, verifySession } from "./lib/session-token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  const isLogin = pathname === "/admin/login";

  let response: NextResponse;
  if (isLogin && session) {
    response = NextResponse.redirect(new URL("/admin", request.url));
  } else if (!isLogin && !session) {
    response = pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Sign in first." }, { status: 401 })
      : NextResponse.redirect(new URL("/admin/login", request.url));
  } else {
    response = NextResponse.next();
  }
  // Lets the public website show signed-in people an "Edit this part" bar. Only a hint: the editor checks the session.
  if (session && !pathname.startsWith("/api/")) {
    response.cookies.set(EDITOR_HINT_COOKIE, "1", { path: "/", sameSite: "lax", secure: true, maxAge: SESSION_MAX_AGE });
  } else if (!session && request.cookies.has(EDITOR_HINT_COOKIE)) {
    response.cookies.delete(EDITOR_HINT_COOKIE);
  }
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
