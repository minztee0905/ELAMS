"use server";

import type { ActionState } from "@/lib/action-state";
import { reviewOnboardingItem, adjustBlockedItem } from "@/server/onboarding";
import { reviewAccessRequest } from "@/server/access-request";
import { decideDeviceException } from "@/server/offboarding";
import { runAction, str, num } from "@/server/action";

export async function reviewOnboardingAction(_: ActionState, fd: FormData) {
  return runAction((a, now) =>
    reviewOnboardingItem(a, num(fd, "taskId"), { decision: str(fd, "decision") as "APPROVE" | "REJECT", reason: str(fd, "reason") }, now),
  );
}

export async function adjustAction(_: ActionState, fd: FormData) {
  return runAction((a, now) => adjustBlockedItem(a, num(fd, "taskId"), { level: str(fd, "level"), note: str(fd, "note") }, now));
}

export async function reviewArAction(_: ActionState, fd: FormData) {
  return runAction((a, now) =>
    reviewAccessRequest(a, num(fd, "taskId"), { decision: str(fd, "decision") as "APPROVE" | "REJECT" | "REQUEST_INFO", reason: str(fd, "reason") }, now),
  );
}

export async function deviceExceptionAction(_: ActionState, fd: FormData) {
  return runAction((a, now) =>
    decideDeviceException(a, num(fd, "taskId"), { decision: str(fd, "decision") as "APPROVE_EXCEPTION" | "CONTINUE", reason: str(fd, "reason") }, now),
  );
}
