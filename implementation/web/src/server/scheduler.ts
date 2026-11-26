// Việc chạy định kỳ (NFR-06): kích hoạt thu hồi quyền, cảnh báo quá hạn, nhắc sắp đến hạn.
import { db } from "@/lib/db";
import { fmtDateTime } from "@/lib/dates";
import { audit } from "./audit";
import { notify } from "./notify";
import { activateRevocation } from "./offboarding";
import { SLA } from "./settings";
import { TASK_LABEL, taskHref } from "./tasks";
import { inTx } from "./tx";

export type JobResult = { activated: number; overdueAlerts: number; reminders: number };

/** Người theo dõi của nhiệm vụ: HR phụ trách onboarding/offboarding (FR-GEN-06). */
async function watchers(caseCode: string | null): Promise<number[]> {
  if (!caseCode) return [];
  if (caseCode.startsWith("ONB-")) {
    const ob = await db.onboardingRequest.findUnique({ where: { requestCode: caseCode } });
    return ob ? [ob.hrUserId] : [];
  }
  if (caseCode.startsWith("OFF-")) {
    const off = await db.offboardingRequest.findUnique({ where: { requestCode: caseCode } });
    return off ? [off.hrUserId] : [];
  }
  return [];
}

export async function runJobs(now: Date): Promise<JobResult> {
  const result: JobResult = { activated: 0, overdueAlerts: 0, reminders: 0 };

  // FR-OFF-04: đến thời điểm thu hồi → Đang thu hồi.
  const due = await db.offboardingRequest.findMany({
    where: { status: { not: "COMPLETED" }, revokeAt: { lte: now }, revocations: { some: { status: "WAITING" } } },
    select: { id: true },
  });
  for (const off of due) {
    await inTx((tx) => activateRevocation(tx, off.id, now));
    result.activated++;
  }
  // Nhiệm vụ thu hồi đang chờ dù không còn mục nào (ví dụ không có quyền) cũng được mở.
  const waitingRevoke = await db.task.findMany({ where: { taskType: "OFF_REVOKE", status: "WAITING" } });
  for (const t of waitingRevoke) {
    const off = await db.offboardingRequest.findUnique({ where: { id: t.objectId } });
    if (off && off.revokeAt <= now) await inTx((tx) => activateRevocation(tx, off.id, now));
  }

  // FR-GEN-06, FR-OFF-14: cảnh báo một lần cho mỗi hạn hiện hành.
  const overdue = await db.task.findMany({
    where: { status: { in: ["OPEN", "WAITING"] }, dueAt: { lt: now } },
  });
  for (const t of overdue) {
    if (t.overdueAlertedFor && t.dueAt && t.overdueAlertedFor.getTime() === t.dueAt.getTime()) continue;
    const recipients = new Set<number>([t.assigneeId, ...(await watchers(t.caseCode))]);
    if (t.taskType === "OFF_REVOKE") {
      const sec = await db.appUser.findMany({ where: { role: "SECURITY", status: "ACTIVE" } });
      sec.forEach((u) => recipients.add(u.id));
    }
    await inTx(async (tx) => {
      const msg = `Quá hạn: ${TASK_LABEL[t.taskType]} · ${t.title} (${t.caseCode}), hạn ${fmtDateTime(t.dueAt)}.`;
      for (const r of recipients) await notify(tx, r, msg, now, { link: taskHref(t), taskId: t.id });
      await tx.task.update({ where: { id: t.id }, data: { overdueAlertedFor: t.dueAt } });
      await audit(tx, {
        actorId: null,
        action: "SEND_OVERDUE_ALERT",
        objectType: t.objectType,
        objectId: t.objectId,
        caseCode: t.caseCode,
        reason: `${TASK_LABEL[t.taskType]}, hạn ${fmtDateTime(t.dueAt)}, gửi ${recipients.size} người`,
        now,
      });
    });
    result.overdueAlerts++;
  }

  // FR-GEN-07: nhắc sắp đến hạn (ngưỡng giả định, Q-01).
  const soon = await db.task.findMany({
    where: {
      status: { in: ["OPEN", "WAITING"] },
      dueAt: { gte: now, lte: new Date(now.getTime() + SLA.dueSoonHours * 3600_000) },
    },
  });
  for (const t of soon) {
    if (t.reminderSentFor && t.dueAt && t.reminderSentFor.getTime() === t.dueAt.getTime()) continue;
    await inTx(async (tx) => {
      await notify(tx, t.assigneeId, `Sắp đến hạn: ${TASK_LABEL[t.taskType]} · ${t.title}, hạn ${fmtDateTime(t.dueAt)}.`, now, {
        link: taskHref(t),
        taskId: t.id,
      });
      await tx.task.update({ where: { id: t.id }, data: { reminderSentFor: t.dueAt } });
    });
    result.reminders++;
  }
  return result;
}
