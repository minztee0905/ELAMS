// BR-GEN-01, FR-GEN-03, FR-GEN-04: nhiệm vụ có người phụ trách, hạn, trạng thái.
import type { ObjectType, Task, TaskStatus, TaskType } from "@prisma/client";
import type { Tx } from "@/lib/db";
import { vnDayDiff } from "@/lib/dates";
import { notify } from "./notify";

export const TASK_LABEL: Record<TaskType, string> = {
  ON_ACCESS_REVIEW: "Xét duyệt quyền",
  ON_ACCESS_ADJUST: "Điều chỉnh quyền bị chặn",
  SECURITY_REVIEW: "Xét duyệt quyền nhạy cảm",
  PROVISION: "Cấp quyền",
  ON_DEVICE: "Cấp thiết bị",
  ON_CONFIRM: "Xác nhận hoàn tất onboarding",
  AR_REVIEW: "Xét duyệt yêu cầu quyền",
  AR_NEED_INFO: "Bổ sung yêu cầu quyền",
  OFF_HANDOVER: "Bàn giao công việc",
  OFF_HANDOVER_UPDATE: "Cập nhật bàn giao",
  OFF_REVOKE: "Thu hồi quyền",
  OFF_DEVICE: "Thu hồi thiết bị",
  OFF_DEVICE_EXCEPTION: "Duyệt ngoại lệ thiết bị",
  OFF_CONFIRM: "Xác nhận hoàn tất offboarding",
};

export function taskHref(t: Pick<Task, "id" | "taskType" | "caseCode">): string {
  switch (t.taskType) {
    case "PROVISION":
      return `/tasks/provision/${t.id}`;
    case "ON_DEVICE":
      return `/tasks/device/${t.id}`;
    case "ON_CONFIRM":
      return `/onboarding/${t.caseCode}`;
    case "AR_NEED_INFO":
      return `/access-requests/${t.caseCode}`;
    case "OFF_HANDOVER":
    case "OFF_HANDOVER_UPDATE":
      return `/tasks/handover/${t.id}`;
    case "OFF_REVOKE":
      return `/tasks/revoke/${t.id}`;
    case "OFF_DEVICE":
      return `/tasks/device-return/${t.id}`;
    case "OFF_CONFIRM":
      return `/offboarding/${t.caseCode}`;
    default:
      return `/tasks?task=${t.id}`;
  }
}

export type NewTask = {
  type: TaskType;
  objectType: ObjectType;
  objectId: number;
  caseCode: string;
  title: string;
  assigneeId: number;
  dueAt: Date | null;
  status?: TaskStatus;
  isUrgent?: boolean;
  now: Date;
  silent?: boolean; // không gửi thông báo "nhiệm vụ mới" (ví dụ nhiệm vụ chờ kích hoạt)
};

export async function createTask(tx: Tx, t: NewTask): Promise<Task> {
  const task = await tx.task.create({
    data: {
      taskType: t.type,
      objectType: t.objectType,
      objectId: t.objectId,
      caseCode: t.caseCode,
      title: t.title.slice(0, 200),
      assigneeId: t.assigneeId,
      dueAt: t.dueAt,
      status: t.status ?? "OPEN",
      isUrgent: t.isUrgent ?? false,
      createdAt: t.now,
    },
  });
  if (!t.silent) {
    await notify(tx, t.assigneeId, `Nhiệm vụ mới: ${TASK_LABEL[t.type]} · ${t.title} (${t.caseCode})`, t.now, {
      link: taskHref(task),
      taskId: task.id,
    });
  }
  return task;
}

/** Kết thúc các nhiệm vụ còn mở của một đối tượng. */
export async function closeTasks(
  tx: Tx,
  where: { objectType: ObjectType; objectId: number; types?: TaskType[] },
  now: Date,
  status: "DONE" | "CANCELLED" = "DONE",
) {
  await tx.task.updateMany({
    where: {
      objectType: where.objectType,
      objectId: where.objectId,
      status: { in: ["OPEN", "WAITING"] },
      ...(where.types ? { taskType: { in: where.types } } : {}),
    },
    data: { status, completedAt: now },
  });
}

export function isOpen(t: Pick<Task, "status">) {
  return t.status === "OPEN" || t.status === "WAITING";
}

/** Dấu Quá hạn: chỉ cho nhiệm vụ chưa kết thúc (US-ON-15 AC-2, AC-3). */
export function overdueLabel(t: Pick<Task, "status" | "dueAt">, now: Date): string | null {
  if (!isOpen(t) || !t.dueAt || now <= t.dueAt) return null;
  const days = vnDayDiff(t.dueAt, now);
  if (days >= 1) return `Quá hạn ${days} ngày`;
  const hours = Math.max(1, Math.floor((now.getTime() - t.dueAt.getTime()) / 3600_000));
  return `Quá hạn ${hours} giờ`;
}

export function dueSoon(t: Pick<Task, "status" | "dueAt">, now: Date, hours: number): boolean {
  if (!isOpen(t) || !t.dueAt || now > t.dueAt) return false;
  return t.dueAt.getTime() - now.getTime() <= hours * 3600_000;
}
