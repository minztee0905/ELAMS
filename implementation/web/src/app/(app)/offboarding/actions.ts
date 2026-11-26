"use server";

import type { LeaveReason, ReturnCondition } from "@prisma/client";
import type { ActionState } from "@/lib/action-state";
import { db } from "@/lib/db";
import { fmtDateTime, fmtTimeDate } from "@/lib/dates";
import { runAction, num, str } from "@/server/action";
import { getNow } from "@/server/clock";
import { evidenceFrom } from "@/server/files";
import {
  addManualRevocation,
  changeLastWorkingDate,
  confirmHandover,
  confirmOffboarding,
  createOffboarding,
  markUrgent,
  previewLastDayChange,
  recordDeviceReturn,
  recordDeviceReturnMissing,
  recordRevocation,
  revocationPreview,
  saveHandoverPlan,
  updateHandoverItem,
  type HandoverPlanRow,
} from "@/server/offboarding";
import { requireActor } from "@/server/session";
import { TASK_LABEL } from "@/server/tasks";

export async function createOffboardingAction(_: ActionState, fd: FormData) {
  return runAction(async (a, now) => {
    const r = await createOffboarding(
      a,
      {
        employeeId: num(fd, "employeeId"),
        lastWorkingDate: str(fd, "lastWorkingDate"),
        leaveReason: str(fd, "leaveReason") as LeaveReason | "",
        isUrgent: str(fd, "isUrgent") === "1",
        urgentReason: str(fd, "urgentReason"),
        note: str(fd, "note"),
        submissionKey: str(fd, "submissionKey"),
      },
      now,
    );
    return { message: `Đã tạo yêu cầu ${r.requestCode}.`, data: { code: r.requestCode } };
  });
}

export async function previewEmployeeAction(employeeId: number) {
  await requireActor();
  const emp = await db.employee.findUnique({ where: { id: employeeId }, include: { department: true, manager: true } });
  if (!emp) return null;
  const open = await db.offboardingRequest.findFirst({ where: { employeeId, status: { not: "COMPLETED" } } });
  const { grants, devices } = await revocationPreview(employeeId);
  return {
    department: emp.department.name,
    manager: emp.manager?.fullName ?? "–",
    openCode: open?.requestCode ?? null,
    grants: grants.map((g) => `${g.access?.name ?? "Khác"}${g.accessLevel !== "Người dùng" ? ` – ${g.accessLevel}` : ""} (${g.account.system.name}, ${g.account.accountIdentifier})`),
    devices: devices.map((d) => `${d.assetCode} ${d.description ?? ""}`),
  };
}

export async function markUrgentAction(_: ActionState, fd: FormData) {
  return runAction((a, now) => markUrgent(a, num(fd, "offboardingId"), str(fd, "reason"), now));
}

export async function changeLastDayAction(_: ActionState, fd: FormData) {
  return runAction((a, now) => changeLastWorkingDate(a, num(fd, "offboardingId"), { newDate: str(fd, "newDate"), reason: str(fd, "reason") }, now));
}

export async function previewLastDayAction(offboardingId: number, newDate: string) {
  await requireActor();
  const r = await previewLastDayChange(offboardingId, newDate, await getNow());
  return {
    revokeAt: r.revokeChanges ? fmtTimeDate(r.revokeAt) : null,
    tasks: r.tasks.map((t) => ({ id: t.id, label: TASK_LABEL[t.taskType], oldDue: fmtDateTime(t.oldDue), newDue: fmtDateTime(t.newDue) })),
  };
}

export async function confirmOffboardingAction(_: ActionState, fd: FormData) {
  return runAction(async (a, now) => {
    const r = await confirmOffboarding(a, num(fd, "offboardingId"), now);
    return r.ok ? { message: r.message } : { ok: false, message: r.message };
  });
}

export async function saveHandoverPlanAction(_: ActionState, fd: FormData) {
  return runAction((a, now) => saveHandoverPlan(a, num(fd, "taskId"), JSON.parse(str(fd, "rows") || "[]") as HandoverPlanRow[], now));
}

export async function updateHandoverItemAction(_: ActionState, fd: FormData) {
  return runAction((a, now) =>
    updateHandoverItem(a, num(fd, "taskId"), num(fd, "itemId"), { status: str(fd, "status") as "HANDED_OVER" | "NOT_MET", reason: str(fd, "reason") }, now),
  );
}

export async function confirmHandoverAction(_: ActionState, fd: FormData) {
  return runAction((a, now) => confirmHandover(a, num(fd, "taskId"), now));
}

export async function recordRevocationAction(_: ActionState, fd: FormData) {
  return runAction(async (a, now) =>
    recordRevocation(
      a,
      num(fd, "taskId"),
      num(fd, "itemId"),
      { result: str(fd, "result") as "REVOKED" | "DISABLED" | "NOT_REVOKED", evidenceRef: await evidenceFrom(fd), failureReason: str(fd, "failureReason") },
      now,
    ),
  );
}

export async function addManualRevocationAction(_: ActionState, fd: FormData) {
  return runAction((a, now) =>
    addManualRevocation(a, num(fd, "taskId"), { accessName: str(fd, "accessName"), systemId: num(fd, "systemId"), accountIdentifier: str(fd, "accountIdentifier"), note: str(fd, "note") }, now),
  );
}

export async function deviceReturnAction(_: ActionState, fd: FormData) {
  return runAction((a, now) =>
    recordDeviceReturn(a, num(fd, "taskId"), num(fd, "itemId"), { returnedAt: str(fd, "returnedAt"), condition: (str(fd, "condition") || undefined) as ReturnCondition | undefined, note: str(fd, "note") }, now),
  );
}

export async function deviceMissingReturnAction(_: ActionState, fd: FormData) {
  return runAction(async (a, now) =>
    recordDeviceReturnMissing(a, num(fd, "taskId"), num(fd, "itemId"), { reason: str(fd, "missingReason"), evidenceRef: await evidenceFrom(fd) }, now),
  );
}
