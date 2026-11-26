"use server";

import type { ActionState } from "@/lib/action-state";
import { db } from "@/lib/db";
import { runAction, num, str } from "@/server/action";
import { evidenceFrom } from "@/server/files";
import type { AccountChoice } from "@/server/ledger";
import { recordInvalidApprovalRevocation, recordOnboardingProvision, retryOnboardingProvision, type ProvisionInput } from "@/server/onboarding";
import { recordAccessRequestProvision, retryAccessRequestProvision } from "@/server/access-request";

export async function provisionAction(_: ActionState, fd: FormData) {
  return runAction(async (actor, now) => {
    const taskId = num(fd, "taskId");
    const input: ProvisionInput = {
      accountChoice: str(fd, "accountChoice") as AccountChoice,
      accountIdentifier: str(fd, "accountIdentifier"),
      unknownReason: str(fd, "unknownReason"),
      result: (str(fd, "result") || undefined) as ProvisionInput["result"],
      evidenceRef: await evidenceFrom(fd),
      failureReason: str(fd, "failureReason"),
      note: str(fd, "note"),
    };
    const task = await db.task.findUniqueOrThrow({ where: { id: taskId } });
    const r =
      task.objectType === "ACCESS_REQUEST"
        ? await recordAccessRequestProvision(actor, taskId, input, now)
        : await recordOnboardingProvision(actor, taskId, input, now);
    return { message: r.message, data: { status: r.status } };
  });
}

export async function retryAction(_: ActionState, fd: FormData) {
  return runAction(async (actor, now) => {
    const taskId = num(fd, "taskId");
    const task = await db.task.findUniqueOrThrow({ where: { id: taskId } });
    if (task.objectType === "ACCESS_REQUEST") await retryAccessRequestProvision(actor, taskId, now);
    else await retryOnboardingProvision(actor, taskId, now);
  });
}

export async function revokeInvalidAction(_: ActionState, fd: FormData) {
  return runAction(async (actor, now) =>
    recordInvalidApprovalRevocation(
      actor,
      num(fd, "taskId"),
      {
        targetState: str(fd, "targetState") as "GRANTED" | "NOT_GRANTED",
        action: (str(fd, "action") || undefined) as "REVOKE" | "SUSPEND" | undefined,
        evidenceRef: await evidenceFrom(fd),
        note: str(fd, "note"),
      },
      now,
    ),
  );
}
