import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { SESSION_COOKIE, verifyToken } from "@/lib/session-token";

export type Actor = {
  userId: number;
  employeeId: number;
  role: Role;
  fullName: string;
  username: string;
};

export async function getActor(): Promise<Actor | null> {
  const store = await cookies();
  const userId = verifyToken(store.get(SESSION_COOKIE)?.value);
  if (!userId) return null;
  const user = await db.appUser.findUnique({ where: { id: userId }, include: { employee: true } });
  if (!user || user.status !== "ACTIVE") return null; // FR-GEN-01: tài khoản DISABLED không đăng nhập được
  return {
    userId: user.id,
    employeeId: user.employeeId,
    role: user.role,
    fullName: user.employee.fullName,
    username: user.username,
  };
}

export async function requireActor(): Promise<Actor> {
  const actor = await getActor();
  if (!actor) redirect("/login");
  return actor;
}
