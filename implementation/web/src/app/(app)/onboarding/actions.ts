"use server";

import type { ActionState } from "@/lib/action-state";
import { db } from "@/lib/db";
import { fmtDateTime } from "@/lib/dates";
import { MSG } from "@/lib/errors";
import { runAction, num, str } from "@/server/action";
import { changeStartDate, confirmOnboarding, createOnboarding, previewStartDateChange, type CreateOnboardingInput } from "@/server/onboarding";
import { getNow } from "@/server/clock";
import { requireActor } from "@/server/session";
import { TASK_LABEL } from "@/server/tasks";

export async function createOnboardingAction(_: ActionState, fd: FormData): Promise<ActionState> {
  let input: CreateOnboardingInput;
  try {
    input = JSON.parse(str(fd, "payload"));
  } catch {
    return { ok: false, error: MSG.ONB_CREATE_FAILED, at: Date.now() };
  }
  return runAction(async (actor, now) => {
    const r = await createOnboarding(actor, input, now);
    const ob = await db.onboardingRequest.findUniqueOrThrow({
      where: { requestCode: r.requestCode },
      include: { accessItems: { include: { access: true }, orderBy: { sequenceNo: "asc" } }, employee: { include: { jobTitle: true } } },
    });
    const tasks = await db.task.findMany({
      where: { caseCode: r.requestCode },
      include: { assignee: { include: { employee: true } } },
      orderBy: { id: "asc" },
    });
    return {
      message: `Đã tạo yêu cầu ${r.requestCode} và ${tasks.length} nhiệm vụ.`, // MSG-06
      data: {
        requestCode: r.requestCode,
        summary: `${ob.employee.fullName} – ${ob.employee.jobTitle.name}`,
        tasks: tasks.map((t) => ({ label: `${TASK_LABEL[t.taskType]}: ${t.title.split(" · ")[0]}`, assignee: t.assignee.employee.fullName, due: fmtDateTime(t.dueAt) })),
        waiting: ob.accessItems.filter((i) => i.status === "WAITING").map((i) => i.access.name),
      },
    };
  }, MSG.ONB_CREATE_FAILED);
}

export async function confirmOnboardingAction(_: ActionState, fd: FormData) {
  return runAction(async (actor, now) => {
    const r = await confirmOnboarding(actor, num(fd, "onboardingId"), now);
    return r.ok ? { message: r.message } : { ok: false, message: r.message };
  });
}

export async function changeStartDateAction(_: ActionState, fd: FormData) {
  return runAction((actor, now) => changeStartDate(actor, num(fd, "onboardingId"), { newDate: str(fd, "newDate"), reason: str(fd, "reason") }, now));
}

export async function previewStartDateAction(onboardingId: number, newDate: string) {
  await requireActor();
  const rows = await previewStartDateChange(onboardingId, newDate, await getNow());
  return rows.map((r) => ({ id: r.id, label: `${TASK_LABEL[r.taskType]} · ${r.title}`, oldDue: fmtDateTime(r.oldDue), newDue: fmtDateTime(r.newDue) }));
}
