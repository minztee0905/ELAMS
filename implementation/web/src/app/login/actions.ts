"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SESSION_COOKIE, SESSION_IDLE_MS, issueToken } from "@/lib/session-token";
import { audit } from "@/server/audit";
import { getNow } from "@/server/clock";

// Đăng nhập demo: chọn người dùng mẫu. Tài khoản DISABLED bị từ chối (FR-GEN-01).
export async function loginAs(formData: FormData) {
  const userId = Number(formData.get("userId"));
  const user = await db.appUser.findUnique({ where: { id: userId } });
  if (!user || user.status !== "ACTIVE") redirect("/login?disabled=1");
  const store = await cookies();
  store.set(SESSION_COOKIE, issueToken(user.id), { httpOnly: true, sameSite: "lax", path: "/", maxAge: SESSION_IDLE_MS / 1000 });
  await audit(db, { actorId: user.id, action: "LOGIN", objectType: "APP_USER", objectId: user.id, now: await getNow() });
  redirect("/tasks");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
