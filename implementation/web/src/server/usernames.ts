import type { Tx } from "@/lib/db";

export function unaccent(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

/** "Nguyễn Văn An" → "an.nguyen" (thêm số nếu trùng). */
export async function usernameFromName(tx: Tx, fullName: string) {
  const parts = unaccent(fullName).toLowerCase().split(/\s+/).filter(Boolean);
  const base = parts.length > 1 ? `${parts[parts.length - 1]}.${parts[0]}` : parts[0] ?? "user";
  let candidate = base;
  for (let i = 2; await tx.appUser.findUnique({ where: { username: candidate } }); i++) candidate = `${base}${i}`;
  return candidate;
}
