// FR-GEN-02, NFR-02: phân quyền theo ma trận SRS mục 3, kiểm tra phía máy chủ.
// Phạm vi "Phòng" và "Giao" là giả định Q-33; quyền xem lịch sử là giả định Q-30.
import type { ObjectType, Role } from "@prisma/client";
import { db } from "@/lib/db";
import { ForbiddenError } from "@/lib/errors";
import { auditStandalone } from "./audit";
import type { Actor } from "./session";
import { getNow } from "./clock";

export function hasRole(actor: Actor, ...roles: Role[]) {
  return roles.includes(actor.role);
}

/** Người dùng có (hoặc đã có) nhiệm vụ thuộc yêu cầu này: phạm vi "Giao". */
async function hasTaskOnCase(actor: Actor, caseCode: string) {
  const n = await db.task.count({ where: { assigneeId: actor.userId, caseCode } });
  return n > 0;
}

export async function canViewOnboarding(actor: Actor, ob: { requestCode: string; managerId: number }) {
  if (hasRole(actor, "HR", "ADMIN")) return true;
  if (actor.role === "MANAGER" && ob.managerId === actor.employeeId) return true;
  if (hasRole(actor, "IT", "SECURITY")) return hasTaskOnCase(actor, ob.requestCode);
  return false;
}

export async function canViewOffboarding(
  actor: Actor,
  off: { requestCode: string; employee: { managerId: number | null } },
) {
  if (hasRole(actor, "HR", "ADMIN")) return true;
  if (actor.role === "MANAGER" && off.employee.managerId === actor.employeeId) return true;
  if (hasRole(actor, "IT", "SECURITY")) return hasTaskOnCase(actor, off.requestCode);
  return false;
}

export async function canViewAccessRequest(
  actor: Actor,
  ar: { requestCode: string; requesterId: number; approverId: number; requester: { managerId: number | null } },
) {
  if (ar.requesterId === actor.employeeId) return true;
  if (actor.role === "ADMIN") return true;
  if (actor.role === "MANAGER" && (ar.approverId === actor.employeeId || ar.requester.managerId === actor.employeeId))
    return true;
  if (hasRole(actor, "IT", "SECURITY")) return hasTaskOnCase(actor, ar.requestCode);
  return false;
}

export function canViewAudit(actor: Actor) {
  return hasRole(actor, "SECURITY", "ADMIN");
}

/** Ghi lịch sử truy cập trái phép rồi chặn (FR-GEN-02, FR-GEN-09). */
export async function deny(actor: Actor, what: string, objectType: ObjectType = "SYSTEM", objectId = 0): Promise<never> {
  await auditStandalone({
    actorId: actor.userId,
    action: "UNAUTHORIZED_ACCESS",
    objectType,
    objectId,
    result: "FAILED",
    reason: what,
    now: await getNow(),
  });
  throw new ForbiddenError();
}

export async function requireRole(actor: Actor, roles: Role[], what: string) {
  if (!roles.includes(actor.role)) await deny(actor, what);
}

/** Ghi lịch sử truy cập trái phép khi mở trang (không ném lỗi), trang hiển thị MSG-15. */
export async function auditDenied(actor: Actor, what: string) {
  await auditStandalone({
    actorId: actor.userId,
    action: "UNAUTHORIZED_ACCESS",
    objectType: "SYSTEM",
    objectId: 0,
    result: "FAILED",
    reason: what,
    now: await getNow(),
  });
}
