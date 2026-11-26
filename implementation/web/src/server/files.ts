// FR-GEN-13: tệp PDF, JPG, PNG tối đa 10 MB. Lưu trên đĩa, chỉ tải qua ELAMS khi đã đăng nhập.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { BusinessError } from "@/lib/errors";

export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const ALLOWED: Record<string, string> = { "application/pdf": ".pdf", "image/jpeg": ".jpg", "image/png": ".png" };
const MAX = 10 * 1024 * 1024;

export async function saveUpload(file: File | null | undefined, field = "file"): Promise<string | null> {
  if (!file || typeof file === "string" || file.size === 0) return null;
  const ext = ALLOWED[file.type];
  if (!ext) throw new BusinessError("Chỉ nhận tệp PDF, JPG, PNG.", { [field]: "Chỉ nhận tệp PDF, JPG, PNG." });
  if (file.size > MAX) throw new BusinessError("Tệp tối đa 10 MB.", { [field]: "Tệp tối đa 10 MB." });
  await mkdir(UPLOAD_DIR, { recursive: true });
  const key = `${randomUUID()}${ext}`;
  await writeFile(path.join(UPLOAD_DIR, key), Buffer.from(await file.arrayBuffer()));
  const name = file.name.replace(/[|]/g, "_").slice(0, 120);
  return `file:${key}|${name}`;
}

/** Bằng chứng: tệp hoặc mã ticket (ít nhất một). */
export async function evidenceFrom(fd: FormData, fileField = "evidenceFile", ticketField = "ticket"): Promise<string | undefined> {
  const file = await saveUpload(fd.get(fileField) as File | null, "evidence");
  if (file) return file;
  const ticket = String(fd.get(ticketField) ?? "").trim();
  return ticket ? `Ticket: ${ticket}` : undefined;
}
