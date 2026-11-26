// Access Request: FR-AC-01 → FR-AC-10.
import type { Prisma } from "@prisma/client";
import { db, type Tx } from "@/lib/db";
import { addDays, endOfVnDay, parseDateInput, vnDateOnly } from "@/lib/dates";
import { BusinessError, ForbiddenError, MSG, type FieldErrors } from "@/lib/errors";
import { audit } from "./audit";
import { notify } from "./notify";
import type { Actor } from "./session";
import { SLA, defaultAssignee, nextCode } from "./settings";
import { claimTask, inTx, lockRow } from "./tx";
import { closeTasks, createTask } from "./tasks";
import { activeGrantsFor, parseLevels, recordGrant, resolveAccount } from "./ledger";
import { validateProvisionInput, type ProvisionInput } from "./onboarding";

export const AR_OPEN = ["PENDING_MANAGER", "NEED_INFO", "PENDING_SECURITY", "PENDING_PROVISION"] as const;

function reviewDue(now: Date) {
  return endOfVnDay(addDays(now, SLA.reviewDays));
}

/**
 * FR-AC-02, BR-AC-06: người duyệt là Manager trực tiếp; nếu người yêu cầu là Manager
 * thì là cấp trên trực tiếp của họ (cũng là manager_id trong cơ cấu). Không được là chính mình.
 */
export async function resolveApprover(tx: Tx, requesterEmployeeId: number) {
  const emp = await tx.employee.findUniqueOrThrow({ where: { id: requesterEmployeeId }, include: { manager: { include: { user: true } } } });
  const mgr = emp.manager;
  if (!mgr || mgr.id === emp.id || !mgr.user || mgr.user.status !== "ACTIVE") return null;
  return { employee: mgr, user: mgr.user };
}

export type SubmitInput = {
  accessId: number;
  level: string;
  reason: string;
  neededBy?: string;
  attachment?: string | null;
  confirmHasAccess?: boolean;
  submissionKey: string;
};

/** Kiểm tra trước khi gửi: trùng yêu cầu, đã có quyền (dùng cho giao diện và khi gửi). */
export async function precheckAccessRequest(employeeId: number, accessId: number) {
  const access = await db.accessCatalog.findUnique({ where: { id: accessId }, include: { system: true } });
  if (!access) return null;
  const open = await db.accessRequest.findFirst({
    where: { requesterId: employeeId, accessId, status: { in: [...AR_OPEN] } },
  });
  const grants = await activeGrantsFor(db, employeeId, accessId);
  return { access, openRequest: open, grants };
}

export async function submitAccessRequest(actor: Actor, input: SubmitInput, now: Date) {
  const errors: FieldErrors = {};
  const reason = input.reason?.trim() ?? "";
  if (!input.accessId) errors.accessId = MSG.REQUIRED("quyền");
  if (!input.level) errors.level = MSG.REQUIRED("mức quyền");
  if (!reason) errors.reason = MSG.REQUIRED("lý do sử dụng"); // BR-AC-01
  if (reason.length > 500) errors.reason = "Lý do tối đa 500 ký tự.";
  const neededBy = input.neededBy ? parseDateInput(input.neededBy) : null;
  if (input.neededBy && !neededBy) errors.neededBy = "Ngày không hợp lệ.";
  if (neededBy && neededBy < vnDateOnly(now)) errors.neededBy = "Ngày cần có quyền không được trước hôm nay.";
  if (Object.keys(errors).length) throw new BusinessError("Vui lòng kiểm tra các trường được đánh dấu.", errors);

  return inTx(async (tx) => {
    const prior = await tx.accessRequest.findUnique({ where: { submissionKey: input.submissionKey } });
    if (prior) return { requestCode: prior.requestCode, replay: true, approverName: "" };

    const access = await tx.accessCatalog.findFirst({ where: { id: input.accessId, status: "ACTIVE" } });
    if (!access) throw new BusinessError(MSG.REQUIRED("quyền"), { accessId: MSG.REQUIRED("quyền") });
    if (!parseLevels(access.accessLevels).includes(input.level))
      throw new BusinessError(MSG.REQUIRED("mức quyền"), { level: MSG.REQUIRED("mức quyền") });

    const approver = await resolveApprover(tx, actor.employeeId);
    if (!approver) throw new BusinessError(MSG.AR_NO_APPROVER, {}, "AR_NO_APPROVER");

    // FR-AC-03, BR-AC-07
    const open = await tx.accessRequest.findFirst({
      where: { requesterId: actor.employeeId, accessId: access.id, status: { in: [...AR_OPEN] } },
    });
    if (open) {
      throw new BusinessError(MSG.AR_DUPLICATE(open.requestCode), {}, "AR_DUPLICATE", {
        href: `/access-requests/${open.requestCode}`,
        label: "Mở yêu cầu",
      });
    }
    const grants = await activeGrantsFor(tx, actor.employeeId, access.id);
    if (grants.length && !input.confirmHasAccess) {
      throw new BusinessError(MSG.AR_HAS_ACCESS(access.name, grants.map((g) => g.accessLevel).join(", ")), {}, "AR_HAS_ACCESS");
    }

    const year = Number(now.toISOString().slice(0, 4));
    const ar = await tx.accessRequest.create({
      data: {
        requestCode: await nextCode(tx, "AR", year),
        requesterId: actor.employeeId,
        accessId: access.id,
        accessLevel: input.level,
        reason,
        neededBy,
        attachment: input.attachment || null,
        approverId: approver.employee.id,
        status: "PENDING_MANAGER",
        submissionKey: input.submissionKey,
        createdAt: now,
      },
    });
    await createTask(tx, {
      type: "AR_REVIEW",
      objectType: "ACCESS_REQUEST",
      objectId: ar.id,
      caseCode: ar.requestCode,
      title: `${access.name} · ${actor.fullName}`,
      assigneeId: approver.user.id,
      dueAt: reviewDue(now),
      now,
    });
    await audit(tx, {
      actorId: actor.userId,
      action: "CREATE_REQUEST",
      objectType: "ACCESS_REQUEST",
      objectId: ar.id,
      caseCode: ar.requestCode,
      reason: `${access.name} mức ${input.level}`,
      now,
    });
    return { requestCode: ar.requestCode, replay: false, approverName: approver.employee.fullName };
  });
}

type ArFull = Prisma.AccessRequestGetPayload<{ include: { access: true; requester: { include: { user: true } } } }>;

async function loadAr(tx: Tx, id: number): Promise<ArFull> {
  return tx.accessRequest.findUniqueOrThrow({ where: { id }, include: { access: true, requester: { include: { user: true } } } });
}

function arTitle(ar: ArFull) {
  return `${ar.access.name} · ${ar.requester.fullName}`;
}

async function notifyRequester(tx: Tx, ar: ArFull, message: string, now: Date) {
  if (ar.requester.user) await notify(tx, ar.requester.user.id, message, now, { link: `/access-requests/${ar.requestCode}` });
}

export type ArReviewInput = { decision: "APPROVE" | "REJECT" | "REQUEST_INFO"; reason?: string };

/** UC-AC-04 (Manager) và UC-AC-05 (Security). */
export async function reviewAccessRequest(actor: Actor, taskId: number, input: ArReviewInput, now: Date) {
  if (!["APPROVE", "REJECT", "REQUEST_INFO"].includes(input.decision))
    throw new BusinessError(MSG.REQUIRED("quyết định"), { decision: MSG.REQUIRED("quyết định") });
  const reason = input.reason?.trim() ?? "";
  if (input.decision !== "APPROVE" && !reason) {
    const msg = input.decision === "REJECT" ? MSG.REJECT_REASON : MSG.REQUIRED("nội dung cần bổ sung");
    throw new BusinessError(msg, { reason: msg });
  }
  return inTx(async (tx) => {
    const task = await claimTask(tx, taskId, actor.userId);
    if (task.objectType !== "ACCESS_REQUEST" || !["AR_REVIEW", "SECURITY_REVIEW"].includes(task.taskType)) throw new ForbiddenError();
    const role = task.taskType === "AR_REVIEW" ? "MANAGER" : "SECURITY";
    if (role === "SECURITY" && input.decision === "REQUEST_INFO") throw new BusinessError("Security chỉ có Phê duyệt hoặc Từ chối.");
    await lockRow(tx, "access_request", task.objectId);
    const ar = await loadAr(tx, task.objectId);
    if (ar.requesterId === actor.employeeId) throw new ForbiddenError(); // FR-AC-05
    const expected = role === "MANAGER" ? "PENDING_MANAGER" : "PENDING_SECURITY";
    if (ar.status !== expected) throw new BusinessError("Yêu cầu không còn ở bước xét duyệt của bạn.");

    await tx.approvalDecision.create({
      data: {
        accessRequestId: ar.id,
        decidedById: actor.userId,
        approverRole: role,
        decision: input.decision,
        accessLevel: ar.accessLevel,
        reason: reason || null,
        decidedAt: now,
      },
    });
    await closeTasks(tx, { objectType: "ACCESS_REQUEST", objectId: ar.id, types: [task.taskType] }, now);

    let message: string;
    if (input.decision === "APPROVE") {
      if (role === "MANAGER" && ar.access.isSensitive) {
        await tx.accessRequest.update({ where: { id: ar.id }, data: { status: "PENDING_SECURITY" } });
        await createTask(tx, {
          type: "SECURITY_REVIEW",
          objectType: "ACCESS_REQUEST",
          objectId: ar.id,
          caseCode: ar.requestCode,
          title: arTitle(ar),
          assigneeId: await defaultAssignee(tx, "SECURITY"),
          dueAt: reviewDue(now),
          now,
        });
        message = "Security Approver sẽ xét duyệt tiếp. IT chưa nhận nhiệm vụ.";
      } else {
        // FR-AC-08: chỉ tạo nhiệm vụ cấp quyền khi đủ phê duyệt.
        await tx.accessRequest.update({ where: { id: ar.id }, data: { status: "PENDING_PROVISION" } });
        await createTask(tx, {
          type: "PROVISION",
          objectType: "ACCESS_REQUEST",
          objectId: ar.id,
          caseCode: ar.requestCode,
          title: arTitle(ar),
          assigneeId: await defaultAssignee(tx, "IT"),
          dueAt: reviewDue(now),
          now,
        });
        message = "IT đã nhận nhiệm vụ cấp quyền.";
      }
    } else if (input.decision === "REQUEST_INFO") {
      await tx.accessRequest.update({ where: { id: ar.id }, data: { status: "NEED_INFO" } });
      if (ar.requester.user) {
        // FR-GEN-04: nhiệm vụ chờ người yêu cầu bổ sung không có hạn.
        await createTask(tx, {
          type: "AR_NEED_INFO",
          objectType: "ACCESS_REQUEST",
          objectId: ar.id,
          caseCode: ar.requestCode,
          title: `${ar.access.name}: ${reason}`,
          assigneeId: ar.requester.user.id,
          dueAt: null,
          now,
        });
      }
      message = `Yêu cầu chuyển Chờ bổ sung; ${ar.requester.fullName} nhận nội dung cần bổ sung.`;
    } else {
      await tx.accessRequest.update({ where: { id: ar.id }, data: { status: "REJECTED" } });
      await notifyRequester(tx, ar, `Yêu cầu ${ar.requestCode} bị từ chối: ${reason}`, now);
      message = `Yêu cầu kết thúc; ${ar.requester.fullName} nhận lý do từ chối.`;
    }

    await audit(tx, {
      actorId: actor.userId,
      action: input.decision === "APPROVE" ? "APPROVE" : input.decision === "REJECT" ? "REJECT" : "REQUEST_INFO",
      objectType: "ACCESS_REQUEST",
      objectId: ar.id,
      caseCode: ar.requestCode,
      reason: reason || null,
      now,
    });
    return { message: `Đã lưu quyết định. ${message}` };
  });
}

/** UC-AC-02, FR-AC-06: người yêu cầu bổ sung rồi gửi lại (cùng mã, không đổi quyền). */
export async function resubmitAccessRequest(
  actor: Actor,
  requestId: number,
  input: { level: string; reason: string; attachment?: string | null },
  now: Date,
) {
  const reason = input.reason?.trim() ?? "";
  if (!reason) throw new BusinessError(MSG.REQUIRED("lý do sử dụng"), { reason: MSG.REQUIRED("lý do sử dụng") });
  return inTx(async (tx) => {
    await lockRow(tx, "access_request", requestId);
    const ar = await loadAr(tx, requestId);
    if (ar.requesterId !== actor.employeeId) throw new ForbiddenError();
    if (ar.status !== "NEED_INFO") throw new BusinessError("Yêu cầu không ở trạng thái Chờ bổ sung.");
    if (!parseLevels(ar.access.accessLevels).includes(input.level))
      throw new BusinessError(MSG.REQUIRED("mức quyền"), { level: MSG.REQUIRED("mức quyền") });
    const approverUser = await tx.appUser.findUnique({ where: { employeeId: ar.approverId } });
    if (!approverUser || approverUser.status !== "ACTIVE") throw new BusinessError(MSG.AR_NO_APPROVER);

    await tx.accessRequest.update({
      where: { id: ar.id },
      data: {
        status: "PENDING_MANAGER",
        accessLevel: input.level,
        reason,
        attachment: input.attachment === undefined ? ar.attachment : input.attachment,
      },
    });
    await closeTasks(tx, { objectType: "ACCESS_REQUEST", objectId: ar.id, types: ["AR_NEED_INFO"] }, now);
    await createTask(tx, {
      type: "AR_REVIEW",
      objectType: "ACCESS_REQUEST",
      objectId: ar.id,
      caseCode: ar.requestCode,
      title: arTitle(ar),
      assigneeId: approverUser.id,
      dueAt: reviewDue(now),
      now,
    });
    await audit(tx, {
      actorId: actor.userId,
      action: "RESUBMIT",
      objectType: "ACCESS_REQUEST",
      objectId: ar.id,
      caseCode: ar.requestCode,
      reason: `Mức ${input.level}. ${reason}`,
      now,
    });
    return { message: "Yêu cầu đã được gửi lại và chuyển về Chờ Manager duyệt." }; // MSG-20
  });
}

export async function cancelAccessRequest(actor: Actor, requestId: number, now: Date) {
  return inTx(async (tx) => {
    await lockRow(tx, "access_request", requestId);
    const ar = await loadAr(tx, requestId);
    if (ar.requesterId !== actor.employeeId) throw new ForbiddenError();
    if (ar.status !== "NEED_INFO") throw new BusinessError("Chỉ hủy được yêu cầu đang Chờ bổ sung.");
    await tx.accessRequest.update({ where: { id: ar.id }, data: { status: "CANCELLED" } });
    await closeTasks(tx, { objectType: "ACCESS_REQUEST", objectId: ar.id }, now, "CANCELLED");
    await audit(tx, {
      actorId: actor.userId,
      action: "CANCEL",
      objectType: "ACCESS_REQUEST",
      objectId: ar.id,
      caseCode: ar.requestCode,
      now,
    });
    return { message: `Đã hủy yêu cầu ${ar.requestCode}.` };
  });
}

/** UC-AC-06, FR-AC-09: IT ghi kết quả cấp quyền. Thất bại giữ Chờ cấp quyền. */
export async function recordAccessRequestProvision(actor: Actor, taskId: number, input: ProvisionInput, now: Date) {
  const errors = validateProvisionInput(input);
  if (Object.keys(errors).length) throw new BusinessError(Object.values(errors)[0], errors);
  return inTx(async (tx) => {
    const task = await claimTask(tx, taskId, actor.userId);
    if (task.taskType !== "PROVISION" || task.objectType !== "ACCESS_REQUEST") throw new ForbiddenError();
    if (task.status !== "OPEN") throw new BusinessError("Bấm Xử lý lại trước khi ghi kết quả mới.");
    await lockRow(tx, "access_request", task.objectId);
    const ar = await loadAr(tx, task.objectId);
    if (ar.status !== "PENDING_PROVISION") throw new BusinessError("Yêu cầu không ở trạng thái Chờ cấp quyền.");
    const base = { objectType: "ACCESS_REQUEST" as const, objectId: ar.id, caseCode: ar.requestCode, now };

    if (input.accountChoice === "UNKNOWN" || input.result === "FAILURE") {
      const reason =
        input.accountChoice === "UNKNOWN"
          ? `Không xác định được tài khoản: ${input.unknownReason!.trim()}`
          : `Cấp quyền thất bại: ${input.failureReason!.trim()}`;
      await tx.accessRequest.update({ where: { id: ar.id }, data: { provisionFailure: reason.slice(0, 500) } });
      await tx.task.update({ where: { id: task.id }, data: { status: "WAITING" } });
      await audit(tx, { ...base, actorId: actor.userId, action: "GRANT", result: "FAILED", reason });
      return { status: "FAILED" as const, message: `Yêu cầu giữ Chờ cấp quyền. ${reason}` };
    }

    const account = await resolveAccount(tx, ar.requesterId, ar.access.systemId, input.accountChoice, input.accountIdentifier);
    await tx.accessRequest.update({
      where: { id: ar.id },
      data: {
        status: "GRANTED",
        accountId: account.id,
        evidenceRef: input.evidenceRef!.trim().slice(0, 300),
        provisionFailure: null,
      },
    });
    await recordGrant(tx, {
      employeeId: ar.requesterId,
      accessId: ar.accessId,
      accountId: account.id,
      accessLevel: ar.accessLevel,
      source: "ACCESS_REQUEST",
      now,
    });
    await closeTasks(tx, { objectType: "ACCESS_REQUEST", objectId: ar.id, types: ["PROVISION"] }, now);
    await audit(tx, {
      ...base,
      actorId: actor.userId,
      action: "GRANT",
      reason: `Tài khoản ${account.accountIdentifier}, mức ${ar.accessLevel}${input.note ? `. ${input.note}` : ""}`,
    });
    await notifyRequester(tx, ar, `Yêu cầu ${ar.requestCode} đã được cấp: ${ar.access.name} mức ${ar.accessLevel}.`, now);
    return { status: "GRANTED" as const, message: "Yêu cầu chuyển Đã cấp. Người yêu cầu đã được thông báo." };
  });
}

export async function retryAccessRequestProvision(actor: Actor, taskId: number, now: Date) {
  return inTx(async (tx) => {
    const task = await claimTask(tx, taskId, actor.userId);
    if (task.taskType !== "PROVISION" || task.objectType !== "ACCESS_REQUEST") throw new ForbiddenError();
    await tx.task.update({ where: { id: task.id }, data: { status: "OPEN" } });
    await audit(tx, {
      actorId: actor.userId,
      action: "RETRY_PROVISION",
      objectType: "ACCESS_REQUEST",
      objectId: task.objectId,
      caseCode: task.caseCode,
      now,
    });
  });
}
