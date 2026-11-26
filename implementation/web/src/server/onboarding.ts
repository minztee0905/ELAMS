// Onboarding: FR-ON-01 → FR-ON-18.
import type { DeviceType, HandoverCondition, OnboardingAccessItem, Prisma } from "@prisma/client";
import { z } from "zod";
import { db, type Tx } from "@/lib/db";
import { addDays, endOfVnDay, fmtDate, parseDateInput, parseDateTimeInput, vnDateOnly } from "@/lib/dates";
import { BusinessError, ForbiddenError, MSG, type FieldErrors } from "@/lib/errors";
import { audit } from "./audit";
import { notify } from "./notify";
import type { Actor } from "./session";
import { SLA, defaultAssignee, nextCode } from "./settings";
import { claimTask, inTx, lockRow } from "./tx";
import { closeTasks, createTask } from "./tasks";
import { findAccount, parseLevels, recordGrant, resolveAccount, type AccountChoice } from "./ledger";
import { usernameFromName } from "./usernames";

// ---------------------------------------------------------------------------
// Hạn nhiệm vụ (giả định Q-01, Q-03, Q-17)

function reviewDue(now: Date) {
  return endOfVnDay(addDays(now, SLA.reviewDays));
}
function startRelativeDue(startDate: Date, daysBefore: number, now: Date) {
  const due = endOfVnDay(addDays(startDate, -daysBefore));
  const floor = endOfVnDay(now);
  return due < floor ? floor : due;
}
export function provisionDue(startDate: Date, now: Date) {
  return startRelativeDue(startDate, SLA.provisionDaysBeforeStart, now);
}
export function deviceDue(startDate: Date, now: Date) {
  return startRelativeDue(startDate, SLA.deviceDaysBeforeStart, now);
}

const DEVICE_LABEL: Record<DeviceType, string> = { LAPTOP: "Laptop", MONITOR: "Màn hình", PHONE: "Điện thoại", OTHER: "Thiết bị khác" };
export { DEVICE_LABEL };

async function userOfEmployee(tx: Tx, employeeId: number) {
  const u = await tx.appUser.findUnique({ where: { employeeId } });
  if (!u || u.status !== "ACTIVE") throw new BusinessError("Người phụ trách chưa có tài khoản ELAMS đang hoạt động.");
  return u;
}

// ---------------------------------------------------------------------------
// UC-ON-01: tạo yêu cầu

const createSchema = z.object({
  fullName: z.string().trim().min(2, "Họ và tên cần 2–100 ký tự.").max(100, "Họ và tên cần 2–100 ký tự."),
  personalEmail: z.string().trim().email("Email cá nhân không đúng định dạng."),
  departmentId: z.coerce.number().int().positive(MSG.REQUIRED("phòng ban")),
  jobTitleId: z.coerce.number().int().positive(MSG.REQUIRED("chức danh")),
  startDate: z.string().min(1, MSG.REQUIRED("ngày bắt đầu")),
  managerId: z.coerce.number().int().positive(MSG.REQUIRED("Manager trực tiếp")),
  accesses: z
    .array(
      z.object({
        accessId: z.coerce.number().int().positive(MSG.REQUIRED("quyền")),
        level: z.string().min(1, MSG.REQUIRED("mức quyền")),
        isMandatory: z.boolean().nullable(),
        fromTemplate: z.boolean(),
      }),
    )
    .min(1, "Cần ít nhất một quyền."),
  devices: z
    .array(
      z.object({
        deviceType: z.enum(["LAPTOP", "MONITOR", "PHONE", "OTHER"], { message: MSG.REQUIRED("loại thiết bị") }),
        configNote: z.string().max(200).optional().default(""),
        fromTemplate: z.boolean(),
      }),
    )
    .min(1, "Cần ít nhất một thiết bị."),
  note: z.string().max(500).optional().default(""),
  submissionKey: z.string().min(8).max(64),
});

export type CreateOnboardingInput = z.input<typeof createSchema>;

function zodToFieldErrors(err: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export async function createOnboarding(actor: Actor, raw: CreateOnboardingInput, now: Date) {
  if (actor.role !== "HR") throw new ForbiddenError();
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) throw new BusinessError("Vui lòng kiểm tra các trường được đánh dấu.", zodToFieldErrors(parsed.error));
  const input = parsed.data;

  return inTx(async (tx) => {
    // NFR-04: gửi lại cùng khóa thì trả về kết quả cũ, không tạo trùng.
    const prior = await tx.onboardingRequest.findUnique({ where: { submissionKey: input.submissionKey } });
    if (prior) return { requestCode: prior.requestCode, onboardingId: prior.id, replay: true };

    const errors: FieldErrors = {};
    const start = parseDateInput(input.startDate);
    if (!start) errors.startDate = MSG.REQUIRED("ngày bắt đầu");
    else if (start < vnDateOnly(now)) errors.startDate = MSG.START_DATE_PAST; // FR-ON-03

    const [dept, title, managerUser] = await Promise.all([
      tx.department.findFirst({ where: { id: input.departmentId, status: "ACTIVE" } }),
      tx.jobTitle.findFirst({ where: { id: input.jobTitleId, status: "ACTIVE" } }),
      tx.appUser.findFirst({ where: { employeeId: input.managerId, role: "MANAGER", status: "ACTIVE" } }),
    ]);
    if (!dept) errors.departmentId = MSG.REQUIRED("phòng ban");
    if (!title) errors.jobTitleId = MSG.REQUIRED("chức danh");
    if (!managerUser) errors.managerId = MSG.REQUIRED("Manager trực tiếp");

    // BR-ON-01: quyền bắt buộc theo mẫu không đổi phân loại, không xóa (Q-39).
    const templates = await tx.positionAccessTemplate.findMany({ where: { jobTitleId: input.jobTitleId } });
    const mandatoryTemplate = new Set(templates.filter((t) => t.isMandatory).map((t) => t.accessId));
    const catalog = await tx.accessCatalog.findMany({
      where: { id: { in: input.accesses.map((a) => a.accessId) }, status: "ACTIVE" },
    });
    const seen = new Set<number>();
    input.accesses.forEach((a, i) => {
      const cat = catalog.find((c) => c.id === a.accessId);
      if (!cat) errors[`accesses.${i}.accessId`] = MSG.REQUIRED("quyền");
      else if (!parseLevels(cat.accessLevels).includes(a.level)) errors[`accesses.${i}.level`] = MSG.REQUIRED("mức quyền");
      if (seen.has(a.accessId)) errors[`accesses.${i}.accessId`] = "Quyền này đã có trong danh sách.";
      seen.add(a.accessId);
      if (mandatoryTemplate.has(a.accessId) && a.isMandatory !== true) errors[`accesses.${i}.isMandatory`] = MSG.MANDATORY_LOCKED;
      if (a.isMandatory === null) errors[`accesses.${i}.isMandatory`] = MSG.REQUIRED("phân loại");
    });
    for (const accessId of mandatoryTemplate) {
      if (!seen.has(accessId)) errors.accesses = MSG.MANDATORY_LOCKED;
    }
    if (Object.keys(errors).length) throw new BusinessError("Vui lòng kiểm tra các trường được đánh dấu.", errors);

    // FR-ON-04, BR-ON-11: chặn yêu cầu thứ hai (nhận diện bằng email cá nhân, Q-38).
    const email = input.personalEmail.toLowerCase();
    const existing = await tx.onboardingRequest.findFirst({
      where: { status: { not: "COMPLETED" }, employee: { personalEmail: { equals: email, mode: "insensitive" } } },
    });
    if (existing) {
      throw new BusinessError(MSG.ONB_DUPLICATE(existing.requestCode), {}, "ONB_DUPLICATE", {
        href: `/onboarding/${existing.requestCode}`,
        label: "Mở yêu cầu hiện có",
      });
    }

    const year = Number(now.toISOString().slice(0, 4));
    const employee = await tx.employee.create({
      data: {
        employeeCode: await nextCode(tx, "NV", year),
        fullName: input.fullName,
        personalEmail: email,
        departmentId: input.departmentId,
        jobTitleId: input.jobTitleId,
        managerId: input.managerId,
        status: "PRE_HIRE",
        startDate: start!,
      },
    });
    const requestCode = await nextCode(tx, "ONB", year);
    const ob = await tx.onboardingRequest.create({
      data: {
        requestCode,
        employeeId: employee.id,
        managerId: input.managerId,
        hrUserId: actor.userId,
        startDate: start!,
        status: "IN_PROGRESS",
        note: input.note || null,
        submissionKey: input.submissionKey,
        createdAt: now,
      },
    });

    // FR-ON-06: chỉ quyền đầu tiên bắt đầu; các quyền sau chờ theo thứ tự.
    const items: OnboardingAccessItem[] = [];
    for (const [i, a] of input.accesses.entries()) {
      items.push(
        await tx.onboardingAccessItem.create({
          data: {
            onboardingId: ob.id,
            accessId: a.accessId,
            accessLevel: a.level,
            isMandatory: a.isMandatory === true,
            fromTemplate: a.fromTemplate,
            sequenceNo: i + 1,
            status: i === 0 ? "IN_PROGRESS" : "WAITING",
            currentStep: i === 0 ? "MANAGER_REVIEW" : null,
          },
        }),
      );
    }
    const firstCat = catalog.find((c) => c.id === items[0].accessId)!;
    const reviewTask = await createTask(tx, {
      type: "ON_ACCESS_REVIEW",
      objectType: "ONBOARDING_ACCESS_ITEM",
      objectId: items[0].id,
      caseCode: requestCode,
      title: `${firstCat.name} · ${employee.fullName}`,
      assigneeId: managerUser!.id,
      dueAt: reviewDue(now),
      now,
    });

    for (const d of input.devices) {
      await tx.onboardingDeviceItem.create({
        data: {
          onboardingId: ob.id,
          deviceType: d.deviceType,
          configNote: d.configNote || null,
          fromTemplate: d.fromTemplate,
          status: "PREPARING",
        },
      });
    }
    const deviceTask = await createTask(tx, {
      type: "ON_DEVICE",
      objectType: "ONBOARDING_REQUEST",
      objectId: ob.id,
      caseCode: requestCode,
      title: `${input.devices.map((d) => DEVICE_LABEL[d.deviceType]).join(", ")} · ${employee.fullName}`,
      assigneeId: await defaultAssignee(tx, "IT"),
      dueAt: deviceDue(start!, now),
      now,
    });

    await audit(tx, {
      actorId: actor.userId,
      action: "CREATE_REQUEST",
      objectType: "ONBOARDING_REQUEST",
      objectId: ob.id,
      caseCode: requestCode,
      reason: `${items.length} quyền, ${input.devices.length} thiết bị`,
      now,
    });

    return { requestCode, onboardingId: ob.id, replay: false, taskIds: [reviewTask.id, deviceTask.id] };
  });
}

// ---------------------------------------------------------------------------
// Dòng chảy quyền: xét duyệt → (Security) → IT

type ItemWithAccess = Prisma.OnboardingAccessItemGetPayload<{ include: { access: true; onboarding: { include: { employee: true } } } }>;

async function loadItem(tx: Tx, itemId: number): Promise<ItemWithAccess> {
  const item = await tx.onboardingAccessItem.findUnique({
    where: { id: itemId },
    include: { access: true, onboarding: { include: { employee: true } } },
  });
  if (!item) throw new BusinessError("Không tìm thấy quyền.");
  return item;
}

function itemTitle(item: ItemWithAccess) {
  return `${item.access.name} · ${item.onboarding.employee.fullName}`;
}

async function bumpRev(tx: Tx, onboardingId: number) {
  await tx.onboardingRequest.update({ where: { id: onboardingId }, data: { dataRev: { increment: 1 } } });
}

async function startProvision(tx: Tx, item: ItemWithAccess, now: Date) {
  await tx.onboardingAccessItem.update({ where: { id: item.id }, data: { currentStep: "IT_PROVISION" } });
  // FR-ON-10: nhiệm vụ cấp quyền chỉ tạo khi đủ phê duyệt.
  await createTask(tx, {
    type: "PROVISION",
    objectType: "ONBOARDING_ACCESS_ITEM",
    objectId: item.id,
    caseCode: item.onboarding.requestCode,
    title: itemTitle(item),
    assigneeId: await defaultAssignee(tx, "IT"),
    dueAt: provisionDue(item.onboarding.startDate, now),
    now,
  });
}

/** FR-ON-06: quyền sau bắt đầu khi mọi quyền trước COMPLETED hoặc REJECTED. */
async function startNextItem(tx: Tx, onboardingId: number, now: Date) {
  const items = await tx.onboardingAccessItem.findMany({
    where: { onboardingId },
    orderBy: { sequenceNo: "asc" },
    include: { access: true, onboarding: { include: { employee: true } } },
  });
  for (const it of items) {
    if (it.status === "COMPLETED" || it.status === "REJECTED") continue;
    if (it.status !== "WAITING") return; // còn quyền đang xử lý hoặc bị chặn
    await tx.onboardingAccessItem.update({
      where: { id: it.id },
      data: { status: "IN_PROGRESS", currentStep: "MANAGER_REVIEW" },
    });
    const managerUser = await userOfEmployee(tx, it.onboarding.managerId);
    await createTask(tx, {
      type: "ON_ACCESS_REVIEW",
      objectType: "ONBOARDING_ACCESS_ITEM",
      objectId: it.id,
      caseCode: it.onboarding.requestCode,
      title: itemTitle(it),
      assigneeId: managerUser.id,
      dueAt: reviewDue(now),
      now,
    });
    return;
  }
}

async function blockForAdjustment(tx: Tx, item: ItemWithAccess, kind: string, reason: string, now: Date) {
  await tx.onboardingAccessItem.update({
    where: { id: item.id },
    data: { status: "BLOCKED", blockedKind: kind, blockedReason: reason.slice(0, 500), currentStep: null },
  });
  const managerUser = await userOfEmployee(tx, item.onboarding.managerId);
  await createTask(tx, {
    type: "ON_ACCESS_ADJUST",
    objectType: "ONBOARDING_ACCESS_ITEM",
    objectId: item.id,
    caseCode: item.onboarding.requestCode,
    title: itemTitle(item),
    assigneeId: managerUser.id,
    dueAt: reviewDue(now),
    now,
  });
}

export type ReviewInput = { decision: "APPROVE" | "REJECT"; reason?: string };

/** UC-ON-03 (Manager) và UC-ON-04 (Security): quyết định cho một quyền onboarding. */
export async function reviewOnboardingItem(actor: Actor, taskId: number, input: ReviewInput, now: Date) {
  if (input.decision !== "APPROVE" && input.decision !== "REJECT")
    throw new BusinessError(MSG.REQUIRED("quyết định"), { decision: MSG.REQUIRED("quyết định") });
  const reason = input.reason?.trim() ?? "";
  if (input.decision === "REJECT" && !reason) throw new BusinessError(MSG.REJECT_REASON, { reason: MSG.REJECT_REASON });
  if (reason.length > 500) throw new BusinessError("Lý do tối đa 500 ký tự.", { reason: "Lý do tối đa 500 ký tự." });

  return inTx(async (tx) => {
    const task = await claimTask(tx, taskId, actor.userId);
    if (task.objectType !== "ONBOARDING_ACCESS_ITEM" || !["ON_ACCESS_REVIEW", "SECURITY_REVIEW"].includes(task.taskType))
      throw new ForbiddenError();
    const role = task.taskType === "ON_ACCESS_REVIEW" ? "MANAGER" : "SECURITY";
    const item = await loadItem(tx, task.objectId);
    const expectedStep = role === "MANAGER" ? "MANAGER_REVIEW" : "SECURITY_REVIEW";
    if (item.status !== "IN_PROGRESS" || item.currentStep !== expectedStep)
      throw new BusinessError("Quyền này không còn ở bước xét duyệt của bạn.");

    await tx.approvalDecision.create({
      data: {
        onboardingItemId: item.id,
        decidedById: actor.userId,
        approverRole: role,
        decision: input.decision,
        accessLevel: item.accessLevel,
        round: item.approvalRound,
        reason: reason || null,
        decidedAt: now,
      },
    });
    await closeTasks(tx, { objectType: "ONBOARDING_ACCESS_ITEM", objectId: item.id, types: [task.taskType] }, now);

    let outcome: string;
    if (input.decision === "APPROVE") {
      if (role === "MANAGER" && item.access.isSensitive) {
        // FR-ON-07, BR-AC-03: quyền nhạy cảm cần Security sau Manager.
        await tx.onboardingAccessItem.update({ where: { id: item.id }, data: { currentStep: "SECURITY_REVIEW" } });
        await createTask(tx, {
          type: "SECURITY_REVIEW",
          objectType: "ONBOARDING_ACCESS_ITEM",
          objectId: item.id,
          caseCode: item.onboarding.requestCode,
          title: itemTitle(item),
          assigneeId: await defaultAssignee(tx, "SECURITY"),
          dueAt: reviewDue(now),
          now,
        });
        outcome = "Security Approver sẽ xét duyệt tiếp.";
      } else {
        await startProvision(tx, item, now);
        outcome = "IT đã nhận nhiệm vụ cấp quyền.";
      }
    } else if (!item.isMandatory) {
      // FR-ON-08: quyền không bắt buộc kết thúc REJECTED, quyền sau bắt đầu.
      await tx.onboardingAccessItem.update({
        where: { id: item.id },
        data: { status: "REJECTED", currentStep: null, blockedReason: reason },
      });
      await startNextItem(tx, item.onboardingId, now);
      outcome = "Quyền kết thúc với REJECTED. Quyền tiếp theo đã bắt đầu.";
    } else {
      // FR-ON-08: quyền bắt buộc không kết thúc bằng từ chối → BLOCKED, Manager điều chỉnh.
      const who = role === "MANAGER" ? "Manager" : "Security";
      await blockForAdjustment(tx, item, "REVIEW_REJECTED", `${who} từ chối: ${reason}`, now);
      outcome = "Quyền chuyển BLOCKED. Manager nhận nhiệm vụ điều chỉnh.";
    }

    if (input.decision === "REJECT") {
      const ob = item.onboarding;
      await notify(tx, ob.hrUserId, `${item.access.name} của ${ob.employee.fullName} bị từ chối: ${reason}`, now, {
        link: `/onboarding/${ob.requestCode}`,
      });
    }

    await audit(tx, {
      actorId: actor.userId,
      action: input.decision === "APPROVE" ? "APPROVE" : "REJECT",
      objectType: "ONBOARDING_ACCESS_ITEM",
      objectId: item.id,
      caseCode: item.onboarding.requestCode,
      reason: reason || null,
      now,
    });
    await bumpRev(tx, item.onboardingId);
    await evaluateOnboarding(tx, item.onboardingId, now);
    return { message: `Đã lưu quyết định. ${outcome}` };
  });
}

/** UC-ON-03 AF-03, FR-ON-09: Manager điều chỉnh mức của quyền BLOCKED rồi gửi lại. */
export async function adjustBlockedItem(actor: Actor, taskId: number, input: { level: string; note: string }, now: Date) {
  const note = input.note?.trim() ?? "";
  if (!note) throw new BusinessError(MSG.REQUIRED("nội dung điều chỉnh"), { note: MSG.REQUIRED("nội dung điều chỉnh") });
  return inTx(async (tx) => {
    const task = await claimTask(tx, taskId, actor.userId);
    if (task.taskType !== "ON_ACCESS_ADJUST") throw new ForbiddenError();
    const item = await loadItem(tx, task.objectId);
    if (item.status !== "BLOCKED") throw new BusinessError("Quyền không còn ở trạng thái BLOCKED.");
    if (!parseLevels(item.access.accessLevels).includes(input.level))
      throw new BusinessError(MSG.REQUIRED("mức quyền"), { level: MSG.REQUIRED("mức quyền") });

    await tx.onboardingAccessItem.update({
      where: { id: item.id },
      data: {
        accessLevel: input.level, // phân loại không đổi (BR-ON-01)
        status: "IN_PROGRESS",
        currentStep: "MANAGER_REVIEW",
        blockedKind: null,
        blockedReason: null,
        approvalRound: { increment: 1 },
      },
    });
    await closeTasks(tx, { objectType: "ONBOARDING_ACCESS_ITEM", objectId: item.id, types: ["ON_ACCESS_ADJUST"] }, now);
    await createTask(tx, {
      type: "ON_ACCESS_REVIEW",
      objectType: "ONBOARDING_ACCESS_ITEM",
      objectId: item.id,
      caseCode: item.onboarding.requestCode,
      title: itemTitle(item),
      assigneeId: actor.userId,
      dueAt: reviewDue(now),
      now,
    });
    await audit(tx, {
      actorId: actor.userId,
      action: "ADJUST_ACCESS",
      objectType: "ONBOARDING_ACCESS_ITEM",
      objectId: item.id,
      caseCode: item.onboarding.requestCode,
      reason: `Mức ${item.accessLevel} → ${input.level}. ${note}`,
      now,
    });
    await bumpRev(tx, item.onboardingId);
    await evaluateOnboarding(tx, item.onboardingId, now);
    return { message: "Đã gửi lại. Quyền quay về bước xét duyệt của Manager." };
  });
}

// ---------------------------------------------------------------------------
// UC-ON-05: IT cấp quyền

export type ProvisionInput = {
  accountChoice: AccountChoice;
  accountIdentifier?: string;
  unknownReason?: string;
  result?: "SUCCESS" | "FAILURE";
  evidenceRef?: string; // tệp đã tải lên hoặc mã ticket
  failureReason?: string;
  note?: string;
};

export function validateProvisionInput(input: ProvisionInput): FieldErrors {
  const e: FieldErrors = {};
  if (!input.accountChoice) e.accountChoice = MSG.REQUIRED("tình trạng tài khoản");
  if (input.accountChoice === "UNKNOWN") {
    if (!input.unknownReason?.trim()) e.unknownReason = MSG.REQUIRED("lý do không xác định được");
    return e;
  }
  if (!input.result) e.result = MSG.REQUIRED("kết quả cấp quyền");
  if (input.result === "SUCCESS" && !input.evidenceRef?.trim()) e.evidence = MSG.EVIDENCE_REQUIRED;
  if (input.result === "FAILURE" && !input.failureReason?.trim()) e.failureReason = MSG.REQUIRED("lý do thất bại");
  return e;
}

/** Q-37 (giả định): phê duyệt mất hiệu lực khi danh mục hoặc nội dung quyền thay đổi sau khi duyệt. */
export async function approvalValidity(tx: Tx, item: ItemWithAccess): Promise<string | null> {
  if (item.access.status !== "ACTIVE") return "quyền đã ngừng sử dụng trong danh mục";
  const decisions = await tx.approvalDecision.findMany({
    where: { onboardingItemId: item.id, round: item.approvalRound, decision: "APPROVE" },
  });
  const mgr = decisions.find((d) => d.approverRole === "MANAGER");
  if (!mgr) return "chưa có phê duyệt của Manager cho lần xét duyệt hiện tại";
  if (mgr.accessLevel !== item.accessLevel) return "mức quyền đã thay đổi sau khi Manager phê duyệt";
  if (item.access.isSensitive && !decisions.some((d) => d.approverRole === "SECURITY"))
    return "quyền đã được đánh dấu nhạy cảm sau khi duyệt, chưa có phê duyệt của Security";
  return null;
}

export async function recordOnboardingProvision(actor: Actor, taskId: number, input: ProvisionInput, now: Date) {
  const errors = validateProvisionInput(input);
  if (Object.keys(errors).length) throw new BusinessError(Object.values(errors)[0], errors);

  return inTx(async (tx) => {
    const task = await claimTask(tx, taskId, actor.userId);
    if (task.taskType !== "PROVISION" || task.objectType !== "ONBOARDING_ACCESS_ITEM") throw new ForbiddenError();
    if (task.status !== "OPEN") throw new BusinessError("Nhiệm vụ đang chờ khắc phục. Bấm Khắc phục và thử lại trước.");
    const item = await loadItem(tx, task.objectId);
    if (item.status !== "IN_PROGRESS" || item.currentStep !== "IT_PROVISION")
      throw new BusinessError("Quyền không còn ở bước cấp quyền.");
    const ob = item.onboarding;
    const base = { objectType: "ONBOARDING_ACCESS_ITEM" as const, objectId: item.id, caseCode: ob.requestCode, now };

    // US-ON-09 AC-1, AC-2: không xác định tài khoản hoặc cấp thất bại → BLOCKED, IT khắc phục.
    if (input.accountChoice === "UNKNOWN" || input.result === "FAILURE") {
      const reason =
        input.accountChoice === "UNKNOWN"
          ? `Không xác định được tài khoản: ${input.unknownReason!.trim()}`
          : `Cấp quyền thất bại: ${input.failureReason!.trim()}`;
      await tx.onboardingAccessItem.update({
        where: { id: item.id },
        data: { status: "BLOCKED", blockedKind: "PROVISION_FAILED", blockedReason: reason.slice(0, 500) },
      });
      await tx.task.update({ where: { id: task.id }, data: { status: "WAITING" } });
      await audit(tx, { ...base, actorId: actor.userId, action: "GRANT", result: "FAILED", reason });
      await notify(tx, ob.hrUserId, `${item.access.name} của ${ob.employee.fullName} chuyển BLOCKED: ${reason}`, now, {
        link: `/onboarding/${ob.requestCode}`,
      });
      await bumpRev(tx, ob.id);
      await evaluateOnboarding(tx, ob.id, now);
      return { status: "BLOCKED" as const, message: `Quyền chuyển BLOCKED. ${reason}` };
    }

    const account = await resolveAccount(tx, ob.employeeId, item.access.systemId, input.accountChoice, input.accountIdentifier);

    // FR-ON-12, BR-ON-12: kiểm tra phê duyệt còn hiệu lực trước khi COMPLETED.
    const invalid = await approvalValidity(tx, item);
    if (invalid) {
      await tx.onboardingAccessItem.update({
        where: { id: item.id },
        data: {
          status: "BLOCKED",
          blockedKind: "APPROVAL_INVALID",
          blockedReason: `Phê duyệt không còn hiệu lực: ${invalid}`,
          accountId: account.id,
        },
      });
      await audit(tx, { ...base, actorId: actor.userId, action: "GRANT", result: "FAILED", reason: `Phê duyệt không còn hiệu lực: ${invalid}` });
      await bumpRev(tx, ob.id);
      await evaluateOnboarding(tx, ob.id, now);
      return { status: "APPROVAL_INVALID" as const, message: MSG.APPROVAL_INVALID(invalid) };
    }

    await tx.onboardingAccessItem.update({
      where: { id: item.id },
      data: {
        status: "COMPLETED",
        currentStep: null,
        accountId: account.id,
        evidenceRef: input.evidenceRef!.trim().slice(0, 300),
        blockedKind: null,
        blockedReason: null,
      },
    });
    await recordGrant(tx, {
      employeeId: ob.employeeId,
      accessId: item.accessId,
      accountId: account.id,
      accessLevel: item.accessLevel,
      source: "ONBOARDING",
      now,
    });
    await closeTasks(tx, { objectType: "ONBOARDING_ACCESS_ITEM", objectId: item.id, types: ["PROVISION"] }, now);
    await audit(tx, {
      ...base,
      actorId: actor.userId,
      action: "GRANT",
      reason: `Tài khoản ${account.accountIdentifier}, mức ${item.accessLevel}${input.note ? `. ${input.note}` : ""}`,
    });
    await startNextItem(tx, ob.id, now);
    await bumpRev(tx, ob.id);
    await evaluateOnboarding(tx, ob.id, now);
    return { status: "COMPLETED" as const, message: "Quyền đã COMPLETED. Quyền tiếp theo đã bắt đầu." };
  });
}

/** US-ON-09 AC-3: IT khắc phục và thử lại, quay về bước kiểm tra tài khoản. */
export async function retryOnboardingProvision(actor: Actor, taskId: number, now: Date) {
  return inTx(async (tx) => {
    const task = await claimTask(tx, taskId, actor.userId);
    if (task.taskType !== "PROVISION" || task.objectType !== "ONBOARDING_ACCESS_ITEM") throw new ForbiddenError();
    const item = await loadItem(tx, task.objectId);
    if (item.status !== "BLOCKED" || item.blockedKind !== "PROVISION_FAILED")
      throw new BusinessError("Quyền không ở trạng thái chờ khắc phục.");
    await tx.onboardingAccessItem.update({
      where: { id: item.id },
      data: { status: "IN_PROGRESS", currentStep: "IT_PROVISION", blockedKind: null, blockedReason: null },
    });
    await tx.task.update({ where: { id: task.id }, data: { status: "OPEN" } });
    await audit(tx, {
      actorId: actor.userId,
      action: "RETRY_PROVISION",
      objectType: "ONBOARDING_ACCESS_ITEM",
      objectId: item.id,
      caseCode: item.onboarding.requestCode,
      now,
    });
    await bumpRev(tx, item.onboardingId);
    await evaluateOnboarding(tx, item.onboardingId, now);
  });
}

/** US-ON-09 AC-4, AC-5: ghi kết quả thu hồi / tạm ngừng khi phê duyệt mất hiệu lực. */
export async function recordInvalidApprovalRevocation(
  actor: Actor,
  taskId: number,
  input: { targetState: "GRANTED" | "NOT_GRANTED"; action?: "REVOKE" | "SUSPEND"; evidenceRef?: string; note?: string },
  now: Date,
) {
  const errors: FieldErrors = {};
  if (!input.targetState) errors.targetState = MSG.REQUIRED("tình trạng quyền trên hệ thống đích");
  if (input.targetState === "GRANTED" && !input.action) errors.action = MSG.REQUIRED("hành động đã thực hiện");
  if (!input.evidenceRef?.trim()) errors.evidence = MSG.EVIDENCE_REQUIRED;
  if (Object.keys(errors).length) throw new BusinessError(Object.values(errors)[0], errors);

  return inTx(async (tx) => {
    const task = await claimTask(tx, taskId, actor.userId);
    if (task.taskType !== "PROVISION" || task.objectType !== "ONBOARDING_ACCESS_ITEM") throw new ForbiddenError();
    const item = await loadItem(tx, task.objectId);
    if (item.status !== "BLOCKED" || item.blockedKind !== "APPROVAL_INVALID")
      throw new BusinessError("Quyền không ở trạng thái cần thu hồi.");
    const what =
      input.targetState === "NOT_GRANTED" ? "Quyền chưa được cấp trên hệ thống đích" : input.action === "SUSPEND" ? "Đã tạm ngừng" : "Đã thu hồi";
    await tx.onboardingAccessItem.update({
      where: { id: item.id },
      data: {
        blockedKind: "REVOKED_AWAITING_APPROVAL",
        blockedReason: `${item.blockedReason}. ${what}; chờ phê duyệt hợp lệ mới.`.slice(0, 500),
        evidenceRef: input.evidenceRef!.trim().slice(0, 300),
      },
    });
    await closeTasks(tx, { objectType: "ONBOARDING_ACCESS_ITEM", objectId: item.id, types: ["PROVISION"] }, now);
    await audit(tx, {
      actorId: actor.userId,
      action: input.action === "SUSPEND" ? "SUSPEND" : "REVOKE",
      objectType: "ONBOARDING_ACCESS_ITEM",
      objectId: item.id,
      caseCode: item.onboarding.requestCode,
      reason: `${what}. Bằng chứng: ${input.evidenceRef}`,
      now,
    });
    // Chỉ cấp lại khi có phê duyệt hợp lệ mới: Manager nhận nhiệm vụ điều chỉnh, gửi lại để duyệt lần mới.
    const managerUser = await userOfEmployee(tx, item.onboarding.managerId);
    await createTask(tx, {
      type: "ON_ACCESS_ADJUST",
      objectType: "ONBOARDING_ACCESS_ITEM",
      objectId: item.id,
      caseCode: item.onboarding.requestCode,
      title: itemTitle(item),
      assigneeId: managerUser.id,
      dueAt: reviewDue(now),
      now,
    });
    await bumpRev(tx, item.onboardingId);
    await evaluateOnboarding(tx, item.onboardingId, now);
    return { message: "Đã ghi kết quả. Quyền giữ BLOCKED, chỉ cấp lại sau khi có phê duyệt hợp lệ mới." };
  });
}

// ---------------------------------------------------------------------------
// UC-ON-06: thiết bị

async function loadDeviceTask(tx: Tx, actor: Actor, taskId: number) {
  const task = await claimTask(tx, taskId, actor.userId);
  if (task.taskType !== "ON_DEVICE") throw new ForbiddenError();
  const ob = await tx.onboardingRequest.findUniqueOrThrow({
    where: { id: task.objectId },
    include: { employee: true, deviceItems: true },
  });
  return { task, ob };
}

async function syncDeviceTask(tx: Tx, taskId: number, onboardingId: number, now: Date) {
  const lines = await tx.onboardingDeviceItem.findMany({ where: { onboardingId } });
  if (lines.every((l) => l.status === "HANDED_OVER")) {
    await tx.task.update({ where: { id: taskId }, data: { status: "DONE", completedAt: now } });
  } else {
    const waiting = lines.some((l) => l.status === "WAITING_DEVICE");
    await tx.task.update({ where: { id: taskId }, data: { status: waiting ? "WAITING" : "OPEN" } });
  }
}

export async function recordDeviceMissing(
  actor: Actor,
  taskId: number,
  lineId: number,
  input: { reason: string; expectedAt?: string },
  now: Date,
) {
  const reason = input.reason?.trim() ?? "";
  const errors: FieldErrors = {};
  if (!reason) errors.waitingReason = MSG.REQUIRED("lý do chờ");
  if (reason.length > 300) errors.waitingReason = "Lý do tối đa 300 ký tự.";
  const expected = input.expectedAt ? parseDateInput(input.expectedAt) : null;
  if (expected && expected < vnDateOnly(now)) errors.expectedAt = "Ngày dự kiến không được trước hôm nay.";
  if (Object.keys(errors).length) throw new BusinessError(Object.values(errors)[0], errors);

  return inTx(async (tx) => {
    const { task, ob } = await loadDeviceTask(tx, actor, taskId);
    const line = ob.deviceItems.find((l) => l.id === lineId);
    if (!line || line.status !== "PREPARING") throw new BusinessError("Thiết bị không ở trạng thái Đang chuẩn bị.");
    await tx.onboardingDeviceItem.update({
      where: { id: line.id },
      data: { status: "WAITING_DEVICE", waitingReason: reason, expectedAt: expected, waitingSince: now },
    });
    await syncDeviceTask(tx, task.id, ob.id, now);
    await audit(tx, {
      actorId: actor.userId,
      action: "DEVICE_MISSING",
      objectType: "ONBOARDING_DEVICE_ITEM",
      objectId: line.id,
      caseCode: ob.requestCode,
      reason,
      now,
    });
    await bumpRev(tx, ob.id);
    await evaluateOnboarding(tx, ob.id, now);
  });
}

/** US-ON-11 AC-3: IT xác nhận đã có thiết bị (như yêu cầu hoặc thay thế). */
export async function recordDeviceAvailable(
  actor: Actor,
  taskId: number,
  lineId: number,
  input: { kind: "AS_REQUESTED" | "REPLACEMENT"; description?: string },
  now: Date,
) {
  if (input.kind === "REPLACEMENT" && !input.description?.trim())
    throw new BusinessError(MSG.REQUIRED("mô tả thiết bị thay thế"), { description: MSG.REQUIRED("mô tả thiết bị thay thế") });
  return inTx(async (tx) => {
    const { task, ob } = await loadDeviceTask(tx, actor, taskId);
    const line = ob.deviceItems.find((l) => l.id === lineId);
    if (!line || line.status !== "WAITING_DEVICE") throw new BusinessError("Thiết bị không ở trạng thái Chờ thiết bị.");
    await tx.onboardingDeviceItem.update({
      where: { id: line.id },
      data: {
        status: "PREPARING",
        waitingReason: null,
        expectedAt: null,
        waitingSince: null,
        configNote:
          input.kind === "REPLACEMENT" ? `Thay thế: ${input.description!.trim()}`.slice(0, 200) : line.configNote,
      },
    });
    await syncDeviceTask(tx, task.id, ob.id, now);
    await audit(tx, {
      actorId: actor.userId,
      action: "DEVICE_AVAILABLE",
      objectType: "ONBOARDING_DEVICE_ITEM",
      objectId: line.id,
      caseCode: ob.requestCode,
      reason: input.kind === "REPLACEMENT" ? `Thiết bị thay thế: ${input.description}` : "Thiết bị như yêu cầu",
      now,
    });
    await bumpRev(tx, ob.id);
    await evaluateOnboarding(tx, ob.id, now);
  });
}

export type HandoverInput = {
  deviceId?: number;
  handedOverAt?: string; // yyyy-mm-ddTHH:mm giờ Việt Nam
  condition?: HandoverCondition;
  conditionNote?: string;
  recordCode?: string;
  recordFile?: string;
};

/** FR-ON-14: đủ mã thiết bị, thời gian, tình trạng, mã biên bản và tệp biên bản. */
export async function recordDeviceHandover(actor: Actor, taskId: number, lineId: number, input: HandoverInput, now: Date) {
  const missing: string[] = [];
  const errors: FieldErrors = {};
  const need = (field: string, label: string) => {
    missing.push(label);
    errors[field] = MSG.REQUIRED(label);
  };
  const at = input.handedOverAt ? parseDateTimeInput(input.handedOverAt) : null;
  if (!input.deviceId) need("deviceId", "mã thiết bị");
  if (!at) need("handedOverAt", "thời gian bàn giao");
  else if (at > now) errors.handedOverAt = "Thời gian bàn giao không được sau thời điểm hiện tại.";
  if (!input.condition) need("condition", "tình trạng thiết bị");
  if (input.condition === "USED_NOTED" && !input.conditionNote?.trim()) need("conditionNote", "mô tả tình trạng");
  if (!input.recordCode?.trim()) need("recordCode", "mã biên bản");
  if (!input.recordFile) need("recordFile", "biên bản đã ký");
  if (missing.length) throw new BusinessError(MSG.HANDOVER_INCOMPLETE(missing), errors);
  if (Object.keys(errors).length) throw new BusinessError(Object.values(errors)[0], errors);

  return inTx(async (tx) => {
    const { task, ob } = await loadDeviceTask(tx, actor, taskId);
    const line = ob.deviceItems.find((l) => l.id === lineId);
    if (!line || line.status !== "PREPARING") throw new BusinessError("Thiết bị không ở trạng thái Đang chuẩn bị.");
    const device = await tx.device.findUnique({ where: { id: input.deviceId } });
    if (!device || device.status !== "IN_STOCK")
      throw new BusinessError("Thiết bị không còn trong kho hoặc đang gắn với người khác.", { deviceId: "Chọn thiết bị trong kho." });
    await tx.device.update({ where: { id: device.id }, data: { status: "ASSIGNED", holderEmployeeId: ob.employeeId } });
    await tx.onboardingDeviceItem.update({
      where: { id: line.id },
      data: {
        status: "HANDED_OVER",
        deviceId: device.id,
        handedOverAt: at!,
        deviceCondition: input.condition,
        conditionNote: input.conditionNote?.trim() || null,
        handoverRecordCode: input.recordCode!.trim().slice(0, 30),
        handoverRecordFile: input.recordFile,
        handedById: actor.userId,
      },
    });
    await syncDeviceTask(tx, task.id, ob.id, now);
    await audit(tx, {
      actorId: actor.userId,
      action: "HANDOVER_DEVICE",
      objectType: "ONBOARDING_DEVICE_ITEM",
      objectId: line.id,
      caseCode: ob.requestCode,
      reason: `${device.assetCode} → ${ob.employee.fullName}, biên bản ${input.recordCode}`,
      now,
    });
    await bumpRev(tx, ob.id);
    await evaluateOnboarding(tx, ob.id, now);
  });
}

// ---------------------------------------------------------------------------
// UC-ON-07: điều kiện hoàn tất và xác nhận

export type Condition = { label: string; status: string; reason: string | null };

type ObForConditions = Prisma.OnboardingRequestGetPayload<{
  include: { accessItems: { include: { access: true } }; deviceItems: true };
}>;

/** BR-ON-06: mọi quyền COMPLETED hoặc REJECTED (không bắt buộc), mọi thiết bị đã bàn giao. */
export function onboardingConditions(ob: ObForConditions) {
  const missing: Condition[] = [];
  for (const it of [...ob.accessItems].sort((a, b) => a.sequenceNo - b.sequenceNo)) {
    if (it.status === "COMPLETED" || it.status === "REJECTED") continue;
    missing.push({ label: it.access.name, status: it.status, reason: it.blockedReason });
  }
  for (const d of ob.deviceItems) {
    if (d.status === "HANDED_OVER") continue;
    missing.push({ label: `Thiết bị ${DEVICE_LABEL[d.deviceType]}`, status: d.status, reason: d.waitingReason });
  }
  const stuck =
    ob.accessItems.some((i) => i.status === "BLOCKED") || ob.deviceItems.some((d) => d.status === "WAITING_DEVICE");
  return { met: missing.length === 0, missing, stuck };
}

async function loadObForConditions(tx: Tx, id: number) {
  return tx.onboardingRequest.findUniqueOrThrow({
    where: { id },
    include: { accessItems: { include: { access: true } }, deviceItems: true, employee: true },
  });
}

/**
 * FR-ON-15, BR-ON-07: chỉ kiểm tra khi có dữ liệu mới (dataRev > conditionsCheckedRev).
 * Mở xem không gọi hàm này.
 */
export async function evaluateOnboarding(tx: Tx, onboardingId: number, now: Date) {
  const ob = await loadObForConditions(tx, onboardingId);
  if (ob.status === "COMPLETED" || ob.dataRev <= ob.conditionsCheckedRev) return;
  const { met, stuck } = onboardingConditions(ob);
  const next = met ? "PENDING_HR_CONFIRMATION" : stuck ? "PENDING_CONDITIONS" : "IN_PROGRESS";
  await tx.onboardingRequest.update({
    where: { id: ob.id },
    data: { status: next, conditionsCheckedRev: ob.dataRev },
  });
  if (next === ob.status) return;
  if (ob.status === "PENDING_HR_CONFIRMATION") {
    await closeTasks(tx, { objectType: "ONBOARDING_REQUEST", objectId: ob.id, types: ["ON_CONFIRM"] }, now, "CANCELLED");
  }
  if (next === "PENDING_HR_CONFIRMATION") {
    await createTask(tx, {
      type: "ON_CONFIRM",
      objectType: "ONBOARDING_REQUEST",
      objectId: ob.id,
      caseCode: ob.requestCode,
      title: ob.employee.fullName,
      assigneeId: ob.hrUserId,
      dueAt: endOfVnDay(ob.startDate),
      now,
    });
  }
  await audit(tx, {
    actorId: null,
    action: "STATUS_CHANGE",
    objectType: "ONBOARDING_REQUEST",
    objectId: ob.id,
    caseCode: ob.requestCode,
    reason: `${ob.status} → ${next}`,
    now,
  });
}

/** FR-ON-16: kiểm tra lại ngay trước khi ghi; lỗi ghi thì không báo thành công. */
export async function confirmOnboarding(actor: Actor, onboardingId: number, now: Date) {
  return inTx(async (tx) => {
    await lockRow(tx, "onboarding_request", onboardingId);
    const ob = await loadObForConditions(tx, onboardingId);
    if (actor.role !== "HR" || ob.hrUserId !== actor.userId) throw new ForbiddenError();
    if (ob.status !== "PENDING_HR_CONFIRMATION") throw new BusinessError("Yêu cầu không ở trạng thái Chờ HR xác nhận.");

    const { met, missing } = onboardingConditions(ob);
    if (!met) {
      const reason = missing.map((m) => `${m.label} ${m.status}`).join(", ");
      await tx.onboardingRequest.update({
        where: { id: ob.id },
        data: { status: "PENDING_CONDITIONS", conditionsCheckedRev: ob.dataRev },
      });
      await closeTasks(tx, { objectType: "ONBOARDING_REQUEST", objectId: ob.id, types: ["ON_CONFIRM"] }, now, "CANCELLED");
      await audit(tx, {
        actorId: actor.userId,
        action: "CONFIRM_COMPLETION",
        objectType: "ONBOARDING_REQUEST",
        objectId: ob.id,
        caseCode: ob.requestCode,
        result: "FAILED",
        reason,
        now,
      });
      return { ok: false as const, message: MSG.CONDITIONS_CHANGED(reason) };
    }

    await tx.onboardingRequest.update({ where: { id: ob.id }, data: { status: "COMPLETED", completedAt: now } });
    // FR-ON-17 (giả định Q-47): nhân viên ACTIVE và có tài khoản ELAMS vai trò EMPLOYEE.
    await tx.employee.update({ where: { id: ob.employeeId }, data: { status: "ACTIVE" } });
    const hasUser = await tx.appUser.findUnique({ where: { employeeId: ob.employeeId } });
    if (!hasUser) {
      await tx.appUser.create({
        data: { employeeId: ob.employeeId, username: await usernameFromName(tx, ob.employee.fullName), role: "EMPLOYEE" },
      });
    }
    await closeTasks(tx, { objectType: "ONBOARDING_REQUEST", objectId: ob.id, types: ["ON_CONFIRM"] }, now);
    await audit(tx, {
      actorId: actor.userId,
      action: "CONFIRM_COMPLETION",
      objectType: "ONBOARDING_REQUEST",
      objectId: ob.id,
      caseCode: ob.requestCode,
      now,
    });
    const managerUser = await tx.appUser.findUnique({ where: { employeeId: ob.managerId } });
    if (managerUser) {
      await notify(tx, managerUser.id, `Onboarding ${ob.requestCode} của ${ob.employee.fullName} đã hoàn tất.`, now, {
        link: `/onboarding/${ob.requestCode}`,
      });
    }
    return { ok: true as const, message: `Đã hoàn tất ${ob.requestCode}.` };
  });
}

// ---------------------------------------------------------------------------
// UC-ON-08: đổi ngày bắt đầu (FR-ON-18, BR-ON-04, BR-ON-05)

async function affectedByStartDate(tx: Tx, ob: { id: number; requestCode: string }) {
  const itemIds = (await tx.onboardingAccessItem.findMany({ where: { onboardingId: ob.id }, select: { id: true } })).map((i) => i.id);
  return tx.task.findMany({
    where: {
      status: { in: ["OPEN", "WAITING"] },
      OR: [
        { taskType: "PROVISION", objectType: "ONBOARDING_ACCESS_ITEM", objectId: { in: itemIds } },
        { taskType: "ON_DEVICE", objectType: "ONBOARDING_REQUEST", objectId: ob.id },
        { taskType: "ON_CONFIRM", objectType: "ONBOARDING_REQUEST", objectId: ob.id },
      ],
    },
  });
}

function newDueFor(taskType: string, newStart: Date, now: Date) {
  if (taskType === "PROVISION") return provisionDue(newStart, now);
  if (taskType === "ON_DEVICE") return deviceDue(newStart, now);
  return endOfVnDay(newStart);
}

export async function previewStartDateChange(onboardingId: number, newDate: string, now: Date) {
  const start = parseDateInput(newDate);
  if (!start) return [];
  const ob = await db.onboardingRequest.findUniqueOrThrow({ where: { id: onboardingId } });
  const tasks = await affectedByStartDate(db, ob);
  return tasks.map((t) => ({ id: t.id, title: t.title, taskType: t.taskType, oldDue: t.dueAt, newDue: newDueFor(t.taskType, start, now) }));
}

export async function changeStartDate(actor: Actor, onboardingId: number, input: { newDate: string; reason: string }, now: Date) {
  const errors: FieldErrors = {};
  const start = parseDateInput(input.newDate ?? "");
  const reason = input.reason?.trim() ?? "";
  if (!start) errors.newDate = MSG.REQUIRED("ngày bắt đầu mới");
  else if (start < vnDateOnly(now)) errors.newDate = MSG.START_DATE_PAST;
  if (!reason) errors.reason = MSG.REQUIRED("lý do thay đổi");
  if (reason.length > 300) errors.reason = "Lý do tối đa 300 ký tự.";
  if (Object.keys(errors).length) throw new BusinessError(Object.values(errors)[0], errors);

  return inTx(async (tx) => {
    await lockRow(tx, "onboarding_request", onboardingId);
    const ob = await tx.onboardingRequest.findUniqueOrThrow({ where: { id: onboardingId } });
    if (actor.role !== "HR" || ob.hrUserId !== actor.userId) throw new ForbiddenError();
    if (ob.status === "COMPLETED") throw new BusinessError("Yêu cầu đã hoàn tất.");
    if (ob.startDate.getTime() === start!.getTime())
      throw new BusinessError("Ngày mới phải khác ngày hiện hành.", { newDate: "Ngày mới phải khác ngày hiện hành." });

    const tasks = await affectedByStartDate(tx, ob);
    for (const t of tasks) {
      // Hạn đổi thì gỡ dấu cảnh báo cũ để tính lại (FR-GEN-06).
      await tx.task.update({
        where: { id: t.id },
        data: { dueAt: newDueFor(t.taskType, start!, now), overdueAlertedFor: null, reminderSentFor: null },
      });
    }
    await tx.onboardingRequest.update({
      where: { id: ob.id },
      data: { startDate: start!, originalStartDate: ob.originalStartDate ?? ob.startDate },
    });
    await tx.employee.update({ where: { id: ob.employeeId }, data: { startDate: start! } });
    await audit(tx, {
      actorId: actor.userId,
      action: "CHANGE_START_DATE",
      objectType: "ONBOARDING_REQUEST",
      objectId: ob.id,
      caseCode: ob.requestCode,
      reason: `${fmtDate(ob.startDate)} → ${fmtDate(start!)}. ${reason}. Cập nhật hạn ${tasks.length} nhiệm vụ.`,
      now,
    });
    return { message: `Đã đổi ngày bắt đầu sang ${fmtDate(start!)}; cập nhật hạn ${tasks.length} nhiệm vụ.` };
  });
}

export { findAccount };
