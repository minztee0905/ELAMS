// Cấu hình hạn nhiệm vụ. Q-01, Q-03, Q-17 chưa chốt nên đây là giả định,
// lấy theo các mốc trong kịch bản UAT (xem implementation/README.md).
import type { Tx } from "@/lib/db";

export const SLA = {
  reviewDays: 2, // xét duyệt, điều chỉnh: ngày tạo + 2
  provisionDaysBeforeStart: 2, // cấp quyền onboarding: ngày bắt đầu - 2
  deviceDaysBeforeStart: 3, // thiết bị onboarding: ngày bắt đầu - 3
  urgentRevokeHours: 4, // BR-OFF-04
  normalRevokeHours: 4, // thu hồi thường: chờ Q-01, tạm bằng đột xuất
  handoverDaysBeforeLastDay: 0, // bàn giao: hạn là ngày làm việc cuối cùng
  dueSoonHours: 24, // FR-GEN-07, ngưỡng "Sắp đến hạn" (Q-01)
};

/** Người được giao mặc định theo vai trò (IT, Security). */
export async function defaultAssignee(tx: Tx, role: "IT" | "SECURITY"): Promise<number> {
  const setting = await tx.systemSetting.findUnique({ where: { key: `assignee.${role}` } });
  if (setting) {
    const u = await tx.appUser.findFirst({ where: { id: Number(setting.value), status: "ACTIVE", role } });
    if (u) return u.id;
  }
  const u = await tx.appUser.findFirst({ where: { role, status: "ACTIVE" }, orderBy: { id: "asc" } });
  if (!u) throw new Error(`Không có người dùng ${role} đang hoạt động`);
  return u.id;
}

/** FR-GEN-12: mã ONB-/AR-/OFF- kèm năm và số thứ tự, cấp trong giao dịch. */
export async function nextCode(tx: Tx, prefix: "ONB" | "AR" | "OFF" | "NV", year: number): Promise<string> {
  const key = `seq.${prefix}.${year}`;
  const rows = await tx.$queryRaw<{ value: string }[]>`
    INSERT INTO system_setting (key, value) VALUES (${key}, '1')
    ON CONFLICT (key) DO UPDATE SET value = (system_setting.value::int + 1)::text
    RETURNING value`;
  const n = Number(rows[0].value);
  if (prefix === "NV") return `NV${String(year).slice(2)}${String(n).padStart(4, "0")}`;
  return `${prefix}-${year}-${String(n).padStart(4, "0")}`;
}
