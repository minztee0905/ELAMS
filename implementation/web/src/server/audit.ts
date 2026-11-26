// FR-GEN-09: ghi lịch sử thao tác. audit_log chỉ thêm mới (trigger ở DB).
import type { ObjectType } from "@prisma/client";
import { db, type Tx } from "@/lib/db";

export type AuditEntry = {
  actorId: number | null;
  action: string;
  objectType: ObjectType;
  objectId: number;
  caseCode?: string | null;
  result?: "SUCCESS" | "FAILED";
  reason?: string | null;
  now: Date;
};

export async function audit(tx: Tx, e: AuditEntry) {
  await tx.auditLog.create({
    data: {
      actorId: e.actorId,
      action: e.action,
      objectType: e.objectType,
      objectId: e.objectId,
      caseCode: e.caseCode ?? null,
      result: e.result ?? "SUCCESS",
      reason: e.reason ?? null,
      createdAt: e.now,
    },
  });
}

/** Ghi lịch sử ngoài giao dịch (ví dụ truy cập trái phép, FR-GEN-02). */
export async function auditStandalone(e: AuditEntry) {
  await audit(db as unknown as Tx, e);
}
