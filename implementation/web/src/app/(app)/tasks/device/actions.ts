"use server";

import type { HandoverCondition } from "@prisma/client";
import type { ActionState } from "@/lib/action-state";
import { runAction, num, str } from "@/server/action";
import { saveUpload } from "@/server/files";
import { recordDeviceAvailable, recordDeviceHandover, recordDeviceMissing } from "@/server/onboarding";

export async function deviceMissingAction(_: ActionState, fd: FormData) {
  return runAction((a, now) =>
    recordDeviceMissing(a, num(fd, "taskId"), num(fd, "lineId"), { reason: str(fd, "waitingReason"), expectedAt: str(fd, "expectedAt") }, now),
  );
}

export async function deviceAvailableAction(_: ActionState, fd: FormData) {
  return runAction((a, now) =>
    recordDeviceAvailable(
      a,
      num(fd, "taskId"),
      num(fd, "lineId"),
      { kind: str(fd, "kind") as "AS_REQUESTED" | "REPLACEMENT", description: str(fd, "description") },
      now,
    ),
  );
}

export async function handoverAction(_: ActionState, fd: FormData) {
  return runAction(async (a, now) => {
    const recordFile = await saveUpload(fd.get("recordFile") as File | null, "recordFile");
    await recordDeviceHandover(
      a,
      num(fd, "taskId"),
      num(fd, "lineId"),
      {
        deviceId: num(fd, "deviceId") || undefined,
        handedOverAt: str(fd, "handedOverAt"),
        condition: (str(fd, "condition") || undefined) as HandoverCondition | undefined,
        conditionNote: str(fd, "conditionNote"),
        recordCode: str(fd, "recordCode"),
        recordFile: recordFile ?? undefined,
      },
      now,
    );
    return { message: "Đã ghi nhận bàn giao." };
  });
}
