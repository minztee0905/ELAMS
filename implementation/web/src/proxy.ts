import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_IDLE_MS, issueToken, verifyToken } from "@/lib/session-token";

// FR-GEN-01, NFR-01: bắt buộc đăng nhập; phiên trượt 30 phút.
export function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const userId = verifyToken(token);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/login")) return NextResponse.next();

  if (!userId) {
    const url = new URL("/login", request.url);
    if (token) url.searchParams.set("expired", "1");
    const res = NextResponse.redirect(url);
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }

  const res = NextResponse.next();
  res.cookies.set(SESSION_COOKIE, issueToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_IDLE_MS / 1000,
  });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
