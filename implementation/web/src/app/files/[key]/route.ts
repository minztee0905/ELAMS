import { readFile } from "node:fs/promises";
import path from "node:path";
import { getActor } from "@/server/session";
import { UPLOAD_DIR } from "@/server/files";

const TYPES: Record<string, string> = { ".pdf": "application/pdf", ".jpg": "image/jpeg", ".png": "image/png" };

// Tệp chỉ truy cập qua ELAMS khi đã đăng nhập (SRS mục 8).
export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const actor = await getActor();
  if (!actor) return new Response("Unauthorized", { status: 401 });
  const { key } = await params;
  if (!/^[0-9a-f-]{36}\.(pdf|jpg|png)$/.test(key)) return new Response("Not found", { status: 404 });
  try {
    const buf = await readFile(path.join(UPLOAD_DIR, key));
    return new Response(buf, { headers: { "Content-Type": TYPES[path.extname(key)] ?? "application/octet-stream" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
