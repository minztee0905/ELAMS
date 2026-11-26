import type { TaskType } from "@prisma/client";
import { db } from "@/lib/db";
import type { Actor } from "@/server/session";
import { seed } from "../prisma/seed";

export const T0 = new Date("2026-11-24T02:00:00.000Z"); // 09:00 24/11/2026 giờ Việt Nam

export async function setup(now = T0) {
  return seed({ scenarios: false, now });
}

export async function actor(username: string): Promise<Actor> {
  const u = await db.appUser.findUniqueOrThrow({ where: { username }, include: { employee: true } });
  return { userId: u.id, employeeId: u.employeeId, role: u.role, fullName: u.employee.fullName, username };
}

export async function openTask(username: string, type: TaskType) {
  const u = await db.appUser.findUniqueOrThrow({ where: { username } });
  return db.task.findFirst({ where: { assigneeId: u.id, taskType: type, status: { in: ["OPEN", "WAITING"] } }, orderBy: { id: "desc" } });
}

export async function mustTask(username: string, type: TaskType) {
  const t = await openTask(username, type);
  if (!t) throw new Error(`Không có nhiệm vụ ${type} cho ${username}`);
  return t;
}

export function hours(d: Date, h: number) {
  return new Date(d.getTime() + h * 3600_000);
}
