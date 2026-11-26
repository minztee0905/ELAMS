// Token phiên ký HMAC: "<userId>.<hết hạn ms>.<chữ ký>". Dùng được ở proxy và server.
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "elams_session";
export const SESSION_IDLE_MS = 30 * 60_000; // NFR-01: 30 phút không thao tác

function secret() {
  return process.env.SESSION_SECRET ?? "dev-secret";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function issueToken(userId: number, nowMs = Date.now()): string {
  const payload = `${userId}.${nowMs + SESSION_IDLE_MS}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined, nowMs = Date.now()): number | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [uid, exp, sig] = parts;
  const expected = sign(`${uid}.${exp}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(exp) < nowMs) return null;
  const id = Number(uid);
  return Number.isInteger(id) ? id : null;
}
