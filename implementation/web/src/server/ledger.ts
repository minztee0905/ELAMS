// Sổ quyền (FR-GEN-14) và tài khoản trên hệ thống đích (FR-GEN-15, BR-ON-10).
import type { GrantSource } from "@prisma/client";
import type { Tx } from "@/lib/db";
import { BusinessError, MSG } from "@/lib/errors";

export type AccountChoice = "EXISTING" | "CREATED" | "UNKNOWN";

/** Tài khoản đã ghi nhận của nhân viên trên hệ thống đích (nếu có). */
export function findAccount(tx: Tx, employeeId: number, systemId: number) {
  return tx.systemAccount.findUnique({ where: { employeeId_systemId: { employeeId, systemId } } });
}

/**
 * Xác định tài khoản dùng để cấp quyền. Đã có bản ghi thì luôn dùng lại (không tạo trùng);
 * chưa có thì ghi nhận định danh IT nhập.
 */
export async function resolveAccount(
  tx: Tx,
  employeeId: number,
  systemId: number,
  choice: AccountChoice,
  identifier: string | undefined,
) {
  const existing = await findAccount(tx, employeeId, systemId);
  if (existing) {
    if (existing.status !== "ACTIVE") {
      return tx.systemAccount.update({ where: { id: existing.id }, data: { status: "ACTIVE" } });
    }
    return existing;
  }
  if (choice === "UNKNOWN") throw new Error("resolveAccount called with UNKNOWN");
  const id = identifier?.trim();
  if (!id) throw new BusinessError(MSG.REQUIRED("định danh tài khoản"), { accountIdentifier: MSG.REQUIRED("định danh tài khoản") });
  return tx.systemAccount.create({
    data: { employeeId, systemId, accountIdentifier: id.slice(0, 100), status: "ACTIVE" },
  });
}

export async function recordGrant(
  tx: Tx,
  g: { employeeId: number; accessId: number | null; accountId: number; accessLevel: string; source: GrantSource; now: Date },
) {
  return tx.accessGrant.create({
    data: {
      employeeId: g.employeeId,
      accessId: g.accessId,
      accountId: g.accountId,
      accessLevel: g.accessLevel,
      source: g.source,
      grantedAt: g.now,
      status: "ACTIVE",
    },
  });
}

/** Quyền đang hiệu lực của nhân viên với một quyền trong danh mục (BR-AC-07). */
export function activeGrantsFor(tx: Tx, employeeId: number, accessId: number) {
  return tx.accessGrant.findMany({ where: { employeeId, accessId, status: "ACTIVE" } });
}

export function parseLevels(levels: string): string[] {
  return levels
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
