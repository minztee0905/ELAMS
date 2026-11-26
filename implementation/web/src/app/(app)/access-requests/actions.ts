"use server";

import type { ActionState } from "@/lib/action-state";
import { runAction, num, str } from "@/server/action";
import { saveUpload } from "@/server/files";
import { cancelAccessRequest, resubmitAccessRequest, submitAccessRequest } from "@/server/access-request";

export async function submitArAction(_: ActionState, fd: FormData) {
  return runAction(async (a, now) => {
    const attachment = await saveUpload(fd.get("attachment") as File | null, "attachment");
    const r = await submitAccessRequest(
      a,
      {
        accessId: num(fd, "accessId"),
        level: str(fd, "level"),
        reason: str(fd, "reason"),
        neededBy: str(fd, "neededBy") || undefined,
        attachment,
        confirmHasAccess: fd.get("confirmHasAccess") === "1",
        submissionKey: str(fd, "submissionKey"),
      },
      now,
    );
    return { message: `Đã gửi yêu cầu ${r.requestCode}. Người duyệt: ${r.approverName}.`, data: { code: r.requestCode } }; // MSG-19
  });
}

export async function resubmitArAction(_: ActionState, fd: FormData) {
  return runAction(async (a, now) => {
    const attachment = await saveUpload(fd.get("attachment") as File | null, "attachment");
    return resubmitAccessRequest(a, num(fd, "requestId"), { level: str(fd, "level"), reason: str(fd, "reason"), attachment: attachment ?? undefined }, now);
  });
}

export async function cancelArAction(_: ActionState, fd: FormData) {
  return runAction((a, now) => cancelAccessRequest(a, num(fd, "requestId"), now));
}
