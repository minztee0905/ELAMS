// Offboarding: FR-OFF-01 → FR-OFF-15.
import type { LeaveReason, Prisma, ReturnCondition } from "@prisma/client";
import { db, type Tx } from "@/lib/db";
import { addHours, endOfVnDay, fmtDate, fmtTimeDate, parseDateInput, parseDateTimeInput, vnDateOnly, vnTimeOn } from "@/lib/dates";
import { BusinessError, ForbiddenError, MSG, type FieldErrors } from "@/lib/errors";
import { audit } from "./audit";
import { notify, notifyRole } from "./notify";
import type { Actor } from "./session";
import { SLA, defaultAssignee, nextCode } from "./settings";
import { claimTask, inTx, lockRow } from "./tx";
import { closeTasks, createTask } from "./tasks";

export const REVOKE_HOUR = 18; // BR-OFF-03: 18:00 ngày làm việc cuối cùng

export function revokeSchedule(lastWorkingDate: Date, isUrgent: boolean, now: Date) {
  if (isUrgent) return { revokeAt: now, revokeDueAt: addHours(now, SLA.urgentRevokeHours) };
  const revokeAt = vnTimeOn(lastWorkingDate, REVOKE_HOUR);
  return { revokeAt, revokeDueAt: addHours(revokeAt, SLA.normalRevokeHours) };
}

function lastDayDue(lastWorkingDate: Date, now: Date) {
  const due = endOfVnDay(lastWorkingDate);
  return due < endOfVnDay(now) ? endOfVnDay(now) : due;
}

/** Danh sách sẽ thu hồi, lập từ sổ quyền và thiết bị đang cấp (FR-OFF-03, BR-OFF-02). */
export async function revocationPreview(employeeId: number) {
  const [grants, devices] = await Promise.all([
    db.accessGrant.findMany({
      where: { employeeId, status: { in: ["ACTIVE", "SUSPENDED"] } },
      include: { access: { include: { system: true } }, account: { include: { system: true } } },
      orderBy: { grantedAt: "asc" },
    }),
    db.device.findMany({ where: { holderEmployeeId: employeeId, status: "ASSIGNED" }, orderBy: { assetCode: "asc" } }),
  ]);
  return { grants, devices };
}

// ---------------------------------------------------------------------------
// UC-OFF-01

export type CreateOffboardingInput = {
  employeeId: number;
  lastWorkingDate: string;
  leaveReason?: LeaveReason | "";
  isUrgent: boolean;
  urgentReason?: string;
  note?: string;
  submissionKey: string;
};

export async function createOffboarding(actor: Actor, input: CreateOffboardingInput, now: Date) {
  if (actor.role !== "HR") throw new ForbiddenError();
  const errors: FieldErrors = {};
  const last = parseDateInput(input.lastWorkingDate ?? "");
  if (!input.employeeId) errors.employeeId = MSG.REQUIRED("nhân viên");
  if (!last) errors.lastWorkingDate = MSG.REQUIRED("ngày làm việc cuối cùng");
  if (!input.leaveReason) errors.leaveReason = MSG.REQUIRED("lý do nghỉ việc");
  if ((input.note ?? "").length > 500) errors.note = "Ghi chú tối đa 500 ký tự.";
  // FR-OFF-02: ngày đã qua → cảnh báo, đề xuất đột xuất.
  if (last && !input.isUrgent && last < vnDateOnly(now)) errors.lastWorkingDate = MSG.LAST_DAY_PAST;
  if (Object.keys(errors).length) {
    const code = errors.lastWorkingDate === MSG.LAST_DAY_PAST && Object.keys(errors).length === 1 ? "LAST_DAY_PAST" : undefined;
    throw new BusinessError(Object.values(errors)[0], errors, code);
  }

  return inTx(async (tx) => {
    const prior = await tx.offboardingRequest.findUnique({ where: { submissionKey: input.submissionKey } });
    if (prior) return { requestCode: prior.requestCode, replay: true };

    const emp = await tx.employee.findUnique({ where: { id: input.employeeId }, include: { manager: { include: { user: true } } } });
    if (!emp) throw new BusinessError(MSG.REQUIRED("nhân viên"), { employeeId: MSG.REQUIRED("nhân viên") });
    const open = await tx.offboardingRequest.findFirst({ where: { employeeId: emp.id, status: { not: "COMPLETED" } } });
    if (open) {
      throw new BusinessError(MSG.OFF_DUPLICATE(open.requestCode), {}, "OFF_DUPLICATE", {
        href: `/offboarding/${open.requestCode}`,
        label: "Mở yêu cầu",
      });
    }
    if (emp.status !== "ACTIVE") throw new BusinessError("Chỉ tạo offboarding cho nhân viên đang làm việc.", { employeeId: "Nhân viên không ở trạng thái đang làm việc." });
    const managerUser = emp.manager?.user;
    if (!managerUser || managerUser.status !== "ACTIVE") throw new BusinessError("Nhân viên chưa có Manager trực tiếp đang hoạt động để nhận bàn giao.");

    const { revokeAt, revokeDueAt } = revokeSchedule(last!, input.isUrgent, now);
    const year = Number(now.toISOString().slice(0, 4));
    const off = await tx.offboardingRequest.create({
      data: {
        requestCode: await nextCode(tx, "OFF", year),
        employeeId: emp.id,
        hrUserId: actor.userId,
        lastWorkingDate: last!,
        leaveReason: input.leaveReason as LeaveReason,
        isUrgent: input.isUrgent,
        urgentReason: input.isUrgent ? input.urgentReason?.trim() || null : null,
        revokeAt,
        revokeDueAt,
        status: "IN_PROGRESS",
        note: input.note?.trim() || null,
        submissionKey: input.submissionKey,
        createdAt: now,
      },
    });
    await tx.employee.update({ where: { id: emp.id }, data: { status: "OFFBOARDING", lastWorkingDate: last! } });

    const started = now >= revokeAt;
    const grants = await tx.accessGrant.findMany({
      where: { employeeId: emp.id, status: { in: ["ACTIVE", "SUSPENDED"] } },
      include: { access: true, account: true },
    });
    for (const g of grants) {
      await tx.revocationItem.create({
        data: {
          offboardingId: off.id,
          grantId: g.id,
          systemId: g.account.systemId,
          accountId: g.accountId,
          accessName: g.access?.name ?? "Quyền ngoài danh mục",
          accessLevel: g.accessLevel,
          source: "ELAMS",
          status: started ? "IN_PROGRESS" : "WAITING",
        },
      });
    }
    const devices = await tx.device.findMany({ where: { holderEmployeeId: emp.id, status: "ASSIGNED" } });
    for (const d of devices) {
      await tx.deviceReturnItem.create({ data: { offboardingId: off.id, deviceId: d.id, status: "WAITING" } });
    }

    const it = await defaultAssignee(tx, "IT");
    const common = { objectType: "OFFBOARDING_REQUEST" as const, objectId: off.id, caseCode: off.requestCode, isUrgent: input.isUrgent, now };
    await createTask(tx, {
      ...common,
      type: "OFF_HANDOVER",
      title: emp.fullName,
      assigneeId: managerUser.id,
      dueAt: lastDayDue(last!, now),
    });
    // FR-OFF-04: nhiệm vụ thu hồi quyền chờ đến thời điểm thu hồi, tự kích hoạt.
    await createTask(tx, {
      ...common,
      type: "OFF_REVOKE",
      title: emp.fullName,
      assigneeId: it,
      dueAt: revokeDueAt,
      status: started ? "OPEN" : "WAITING",
    });
    await createTask(tx, {
      ...common,
      type: "OFF_DEVICE",
      title: emp.fullName,
      assigneeId: it,
      dueAt: lastDayDue(last!, now),
      status: devices.length ? "OPEN" : "DONE",
      silent: devices.length === 0,
    });

    await audit(tx, {
      actorId: actor.userId,
      action: "CREATE_REQUEST",
      objectType: "OFFBOARDING_REQUEST",
      objectId: off.id,
      caseCode: off.requestCode,
      reason: `${grants.length} quyền, ${devices.length} thiết bị. Thu hồi ${input.isUrgent ? "đột xuất" : fmtTimeDate(revokeAt)}`,
      now,
    });
    await bumpRev(tx, off.id);
    await evaluateOffboarding(tx, off.id, now);
    return { requestCode: off.requestCode, replay: false };
  });
}

// ---------------------------------------------------------------------------
// UC-OFF-09: chuyển đột xuất, đổi ngày

/** FR-OFF-05: chỉ khi thu hồi chưa bắt đầu. */
export async function markUrgent(actor: Actor, offboardingId: number, reason: string, now: Date) {
  const r = reason?.trim() ?? "";
  if (!r) throw new BusinessError(MSG.REQUIRED("lý do"), { reason: MSG.REQUIRED("lý do") });
  return inTx(async (tx) => {
    await lockRow(tx, "offboarding_request", offboardingId);
    const off = await tx.offboardingRequest.findUniqueOrThrow({
      where: { id: offboardingId },
      include: { employee: { include: { manager: { include: { user: true } } } } },
    });
    if (actor.role !== "HR" || off.hrUserId !== actor.userId) throw new ForbiddenError();
    if (off.status === "COMPLETED") throw new BusinessError("Yêu cầu đã hoàn tất.");
    if (off.isUrgent || now >= off.revokeAt) throw new BusinessError("Thu hồi quyền đã bắt đầu; không cần chuyển đột xuất.");

    const { revokeAt, revokeDueAt } = revokeSchedule(off.lastWorkingDate, true, now);
    await tx.offboardingRequest.update({
      where: { id: off.id },
      data: { isUrgent: true, urgentReason: r.slice(0, 500), revokeAt, revokeDueAt },
    });
    await tx.task.updateMany({
      where: { objectType: "OFFBOARDING_REQUEST", objectId: off.id, status: { in: ["OPEN", "WAITING"] } },
      data: { isUrgent: true },
    });
    await tx.task.updateMany({
      where: { objectType: "OFFBOARDING_REQUEST", objectId: off.id, taskType: "OFF_REVOKE", status: { in: ["OPEN", "WAITING"] } },
      data: { dueAt: revokeDueAt, overdueAlertedFor: null, reminderSentFor: null },
    });
    await activateRevocation(tx, off.id, now);
    const msg = `${off.requestCode} chuyển nghỉ đột xuất: thu hồi quyền của ${off.employee.fullName} ngay, hạn ${fmtTimeDate(revokeDueAt)}.`;
    const mgr = off.employee.manager?.user;
    if (mgr) await notify(tx, mgr.id, msg, now, { link: `/offboarding/${off.requestCode}` });
    await audit(tx, {
      actorId: actor.userId,
      action: "MARK_URGENT",
      objectType: "OFFBOARDING_REQUEST",
      objectId: off.id,
      caseCode: off.requestCode,
      reason: r,
      now,
    });
    return { message: `Đã chuyển sang đột xuất. Thu hồi bắt đầu ngay, hạn ${fmtTimeDate(revokeDueAt)}.` };
  });
}

/** Kích hoạt thu hồi quyền (đến 18:00 ngày cuối hoặc chuyển đột xuất). */
export async function activateRevocation(tx: Tx, offboardingId: number, now: Date) {
  const off = await tx.offboardingRequest.findUniqueOrThrow({ where: { id: offboardingId }, include: { employee: true } });
  const { count } = await tx.revocationItem.updateMany({
    where: { offboardingId, status: "WAITING" },
    data: { status: "IN_PROGRESS" },
  });
  const tasks = await tx.task.findMany({
    where: { objectType: "OFFBOARDING_REQUEST", objectId: offboardingId, taskType: "OFF_REVOKE", status: "WAITING" },
  });
  for (const t of tasks) {
    await tx.task.update({ where: { id: t.id }, data: { status: "OPEN" } });
    await notify(tx, t.assigneeId, `Bắt đầu thu hồi quyền của ${off.employee.fullName} (${off.requestCode}), hạn ${fmtTimeDate(t.dueAt)}.`, now, {
      link: `/tasks/revoke/${t.id}`,
      taskId: t.id,
    });
  }
  if (count || tasks.length) {
    await audit(tx, {
      actorId: null,
      action: "START_REVOCATION",
      objectType: "OFFBOARDING_REQUEST",
      objectId: offboardingId,
      caseCode: off.requestCode,
      reason: `${count} mục thu hồi chuyển Đang thu hồi`,
      now,
    });
  }
}

async function affectedByDateChange(tx: Tx, offId: number) {
  return tx.task.findMany({
    where: {
      objectType: "OFFBOARDING_REQUEST",
      objectId: offId,
      status: { in: ["OPEN", "WAITING"] },
      taskType: { in: ["OFF_HANDOVER", "OFF_HANDOVER_UPDATE", "OFF_DEVICE", "OFF_REVOKE", "OFF_CONFIRM"] },
    },
  });
}

export async function previewLastDayChange(offboardingId: number, newDate: string, now: Date) {
  const last = parseDateInput(newDate);
  const off = await db.offboardingRequest.findUniqueOrThrow({ where: { id: offboardingId } });
  if (!last) return { tasks: [], revokeAt: off.revokeAt, revokeChanges: false };
  const revokeChanges = !off.isUrgent && now < off.revokeAt;
  const sched = revokeChanges ? revokeSchedule(last, false, now) : { revokeAt: off.revokeAt, revokeDueAt: off.revokeDueAt };
  const tasks = await affectedByDateChange(db, off.id);
  return {
    revokeAt: sched.revokeAt,
    revokeChanges,
    tasks: tasks
      .filter((t) => t.taskType !== "OFF_REVOKE" || revokeChanges)
      .map((t) => ({ id: t.id, taskType: t.taskType, oldDue: t.dueAt, newDue: t.taskType === "OFF_REVOKE" ? sched.revokeDueAt : lastDayDue(last, now) })),
  };
}

/** FR-OFF-15, BR-OFF-07. */
export async function changeLastWorkingDate(actor: Actor, offboardingId: number, input: { newDate: string; reason: string }, now: Date) {
  const errors: FieldErrors = {};
  const last = parseDateInput(input.newDate ?? "");
  const reason = input.reason?.trim() ?? "";
  if (!last) errors.newDate = MSG.REQUIRED("ngày làm việc cuối cùng mới");
  else if (last < vnDateOnly(now)) errors.newDate = MSG.LAST_DAY_PAST;
  if (!reason) errors.reason = MSG.REQUIRED("lý do thay đổi");
  if (Object.keys(errors).length) throw new BusinessError(Object.values(errors)[0], errors);

  return inTx(async (tx) => {
    await lockRow(tx, "offboarding_request", offboardingId);
    const off = await tx.offboardingRequest.findUniqueOrThrow({ where: { id: offboardingId } });
    if (actor.role !== "HR" || off.hrUserId !== actor.userId) throw new ForbiddenError();
    if (off.status === "COMPLETED") throw new BusinessError("Yêu cầu đã hoàn tất.");
    if (off.lastWorkingDate.getTime() === last!.getTime()) throw new BusinessError("Ngày mới phải khác ngày hiện hành.", { newDate: "Ngày mới phải khác ngày hiện hành." });

    const revokeChanges = !off.isUrgent && now < off.revokeAt;
    const sched = revokeChanges ? revokeSchedule(last!, false, now) : { revokeAt: off.revokeAt, revokeDueAt: off.revokeDueAt };
    const tasks = await affectedByDateChange(tx, off.id);
    let n = 0;
    for (const t of tasks) {
      if (t.taskType === "OFF_REVOKE" && !revokeChanges) continue; // thu hồi đã bắt đầu: giữ nguyên
      const dueAt = t.taskType === "OFF_REVOKE" ? sched.revokeDueAt : lastDayDue(last!, now);
      await tx.task.update({ where: { id: t.id }, data: { dueAt, overdueAlertedFor: null, reminderSentFor: null } });
      n++;
    }
    await tx.offboardingRequest.update({
      where: { id: off.id },
      data: {
        lastWorkingDate: last!,
        originalLastWorkingDate: off.originalLastWorkingDate ?? off.lastWorkingDate,
        revokeAt: sched.revokeAt,
        revokeDueAt: sched.revokeDueAt,
      },
    });
    await tx.employee.update({ where: { id: off.employeeId }, data: { lastWorkingDate: last! } });
    await audit(tx, {
      actorId: actor.userId,
      action: "CHANGE_LAST_DAY",
      objectType: "OFFBOARDING_REQUEST",
      objectId: off.id,
      caseCode: off.requestCode,
      reason: `${fmtDate(off.lastWorkingDate)} → ${fmtDate(last!)}. ${reason}. Cập nhật hạn ${n} nhiệm vụ.`,
      now,
    });
    return {
      message: `Đã đổi ngày làm việc cuối cùng sang ${fmtDate(last!)}.${revokeChanges ? ` Thu hồi quyền lúc ${fmtTimeDate(sched.revokeAt)}.` : ""}`,
    };
  });
}

// ---------------------------------------------------------------------------
// UC-OFF-03, 04: bàn giao

async function loadOffForTask(tx: Tx, taskId: number, actor: Actor, types: string[]) {
  const task = await claimTask(tx, taskId, actor.userId);
  if (!types.includes(task.taskType) || task.objectType !== "OFFBOARDING_REQUEST") throw new ForbiddenError();
  const off = await tx.offboardingRequest.findUniqueOrThrow({
    where: { id: task.objectId },
    include: { employee: { include: { user: true, manager: { include: { user: true } } } }, handoverItems: true },
  });
  return { task, off };
}

export type HandoverPlanRow = { id?: number; title: string; receiverId: number | null; dueDate: string };

/** US-OFF-03: Manager lưu kế hoạch bàn giao. */
export async function saveHandoverPlan(actor: Actor, taskId: number, rows: HandoverPlanRow[], now: Date) {
  const errors: FieldErrors = {};
  if (!rows.length) errors.rows = "Cần ít nhất một hạng mục.";
  rows.forEach((r, i) => {
    if (!r.title?.trim()) errors[`rows.${i}.title`] = MSG.REQUIRED("hạng mục");
    if (!r.receiverId) errors[`rows.${i}.receiverId`] = MSG.REQUIRED("người nhận");
    if (!parseDateInput(r.dueDate ?? "")) errors[`rows.${i}.dueDate`] = MSG.REQUIRED("hạn");
  });
  if (Object.keys(errors).length) throw new BusinessError(Object.values(errors)[0], errors);

  return inTx(async (tx) => {
    const { task, off } = await loadOffForTask(tx, taskId, actor, ["OFF_HANDOVER"]);
    if (off.handoverConfirmedAt) throw new BusinessError("Bàn giao đã được xác nhận.");
    const receivers = new Set<number>();
    for (const r of rows) {
      const data = { title: r.title.trim().slice(0, 200), receiverId: r.receiverId!, dueDate: parseDateInput(r.dueDate)! };
      if (r.id) {
        const existing = off.handoverItems.find((h) => h.id === r.id);
        if (!existing) continue;
        await tx.handoverItem.update({ where: { id: r.id }, data: { ...data, updatedById: actor.userId } });
      } else {
        await tx.handoverItem.create({ data: { ...data, offboardingId: off.id, status: "NOT_HANDED_OVER", updatedById: actor.userId } });
      }
      receivers.add(r.receiverId!);
    }
    // Hạng mục bị bỏ khỏi kế hoạch (chưa bàn giao) được xóa.
    const keep = new Set(rows.filter((r) => r.id).map((r) => r.id));
    for (const h of off.handoverItems) {
      if (!keep.has(h.id) && h.status !== "HANDED_OVER") await tx.handoverItem.delete({ where: { id: h.id } });
    }

    const first = !(await tx.task.findFirst({ where: { objectType: "OFFBOARDING_REQUEST", objectId: off.id, taskType: "OFF_HANDOVER_UPDATE" } }));
    const empUser = off.employee.user;
    if (first && empUser && empUser.status === "ACTIVE") {
      await createTask(tx, {
        type: "OFF_HANDOVER_UPDATE",
        objectType: "OFFBOARDING_REQUEST",
        objectId: off.id,
        caseCode: off.requestCode,
        title: off.employee.fullName,
        assigneeId: empUser.id,
        dueAt: task.dueAt,
        isUrgent: off.isUrgent,
        now,
      });
    } else if (empUser) {
      await notify(tx, empUser.id, `Kế hoạch bàn giao ${off.requestCode} đã được cập nhật.`, now);
    }
    for (const rid of receivers) {
      const u = await tx.appUser.findUnique({ where: { employeeId: rid } });
      if (u) await notify(tx, u.id, `Bạn là người nhận bàn giao từ ${off.employee.fullName} (${off.requestCode}).`, now);
    }
    await audit(tx, {
      actorId: actor.userId,
      action: "SAVE_HANDOVER_PLAN",
      objectType: "OFFBOARDING_REQUEST",
      objectId: off.id,
      caseCode: off.requestCode,
      reason: `${rows.length} hạng mục`,
      now,
    });
    await bumpRev(tx, off.id);
    await evaluateOffboarding(tx, off.id, now);
    return { message: "Đã lưu kế hoạch bàn giao." };
  });
}

/** Manager được cập nhật thay khi đột xuất hoặc tài khoản đã bị thu hồi (FR-OFF-10). */
export function canUpdateOnBehalf(off: { isUrgent: boolean; revokeAt: Date }, now: Date) {
  return off.isUrgent || now >= off.revokeAt;
}

/** US-OFF-04, US-OFF-05 AC-2: cập nhật trạng thái một hạng mục. */
export async function updateHandoverItem(
  actor: Actor,
  taskId: number,
  itemId: number,
  input: { status: "HANDED_OVER" | "NOT_MET"; reason?: string },
  now: Date,
) {
  if (input.status !== "HANDED_OVER" && input.status !== "NOT_MET") throw new BusinessError(MSG.REQUIRED("trạng thái"));
  return inTx(async (tx) => {
    const { off } = await loadOffForTask(tx, taskId, actor, ["OFF_HANDOVER", "OFF_HANDOVER_UPDATE"]);
    const item = off.handoverItems.find((h) => h.id === itemId);
    if (!item) throw new BusinessError("Không tìm thấy hạng mục.");
    if (off.handoverConfirmedAt) throw new BusinessError("Bàn giao đã được xác nhận.");
    const isEmployee = actor.employeeId === off.employeeId;
    const isManager = actor.employeeId === off.employee.managerId;
    let onBehalf = false;

    if (input.status === "HANDED_OVER") {
      if (!isEmployee) {
        if (!isManager || !canUpdateOnBehalf(off, now)) throw new ForbiddenError();
        onBehalf = true;
      }
    } else {
      if (!isManager) throw new ForbiddenError();
      if (!input.reason?.trim()) throw new BusinessError(MSG.REQUIRED("lý do chưa đạt"), { reason: MSG.REQUIRED("lý do chưa đạt") });
    }
    await tx.handoverItem.update({
      where: { id: item.id },
      data: {
        status: input.status,
        notMetReason: input.status === "NOT_MET" ? input.reason!.trim().slice(0, 500) : null,
        updatedById: actor.userId,
      },
    });
    if (input.status === "NOT_MET" && off.employee.user) {
      await notify(tx, off.employee.user.id, `Hạng mục "${item.title}" chưa đạt: ${input.reason}`, now);
    }
    await audit(tx, {
      actorId: actor.userId,
      action: input.status === "HANDED_OVER" ? "HANDOVER_DONE" : "HANDOVER_NOT_MET",
      objectType: "HANDOVER_ITEM",
      objectId: item.id,
      caseCode: off.requestCode,
      reason: onBehalf ? `${actor.fullName} cập nhật thay ${off.employee.fullName}` : input.reason?.trim() || null,
      now,
    });
    await bumpRev(tx, off.id);
    await evaluateOffboarding(tx, off.id, now);
  });
}

/** US-OFF-05 AC-1: Manager xác nhận bàn giao đầy đủ. */
export async function confirmHandover(actor: Actor, taskId: number, now: Date) {
  return inTx(async (tx) => {
    const { off } = await loadOffForTask(tx, taskId, actor, ["OFF_HANDOVER"]);
    if (!off.handoverItems.length || off.handoverItems.some((h) => h.status !== "HANDED_OVER"))
      throw new BusinessError("Chỉ xác nhận khi mọi hạng mục đã bàn giao.");
    await tx.offboardingRequest.update({ where: { id: off.id }, data: { handoverConfirmedAt: now } });
    await closeTasks(tx, { objectType: "OFFBOARDING_REQUEST", objectId: off.id, types: ["OFF_HANDOVER", "OFF_HANDOVER_UPDATE"] }, now);
    await audit(tx, {
      actorId: actor.userId,
      action: "CONFIRM_HANDOVER",
      objectType: "OFFBOARDING_REQUEST",
      objectId: off.id,
      caseCode: off.requestCode,
      now,
    });
    await bumpRev(tx, off.id);
    await evaluateOffboarding(tx, off.id, now);
    return { message: "Đã xác nhận bàn giao đầy đủ." };
  });
}

// ---------------------------------------------------------------------------
// UC-OFF-05: thu hồi quyền (không có ngoại lệ, BR-OFF-05)

export async function recordRevocation(
  actor: Actor,
  taskId: number,
  itemId: number,
  input: { result: "REVOKED" | "DISABLED" | "NOT_REVOKED"; evidenceRef?: string; failureReason?: string },
  now: Date,
) {
  if (!["REVOKED", "DISABLED", "NOT_REVOKED"].includes(input.result))
    throw new BusinessError(MSG.REQUIRED("kết quả"), { result: MSG.REQUIRED("kết quả") });
  if (input.result !== "NOT_REVOKED" && !input.evidenceRef?.trim())
    throw new BusinessError(MSG.REVOKE_EVIDENCE, { evidence: MSG.REVOKE_EVIDENCE });
  if (input.result === "NOT_REVOKED" && !input.failureReason?.trim())
    throw new BusinessError(MSG.REQUIRED("lý do"), { failureReason: MSG.REQUIRED("lý do") });

  return inTx(async (tx) => {
    const { task, off } = await loadOffForTask(tx, taskId, actor, ["OFF_REVOKE"]);
    if (task.status !== "OPEN") throw new BusinessError("Chưa đến thời điểm thu hồi.");
    const item = await tx.revocationItem.findFirst({ where: { id: itemId, offboardingId: off.id } });
    if (!item || !["IN_PROGRESS", "NOT_REVOKED"].includes(item.status)) throw new BusinessError("Mục này không ở trạng thái cần thu hồi.");

    await tx.revocationItem.update({
      where: { id: item.id },
      data: {
        status: input.result,
        evidenceRef: input.result === "NOT_REVOKED" ? item.evidenceRef : input.evidenceRef!.trim().slice(0, 300),
        failureReason: input.result === "NOT_REVOKED" ? input.failureReason!.trim().slice(0, 500) : null,
        processedAt: now,
      },
    });
    if (input.result !== "NOT_REVOKED") {
      // FR-OFF-06: cập nhật sổ quyền và tài khoản.
      if (item.grantId) await tx.accessGrant.update({ where: { id: item.grantId }, data: { status: "REVOKED" } });
      if (item.accountId) {
        const stillActive = await tx.revocationItem.count({
          where: { offboardingId: off.id, accountId: item.accountId, status: { notIn: ["REVOKED", "DISABLED"] } },
        });
        if (!stillActive) {
          await tx.systemAccount.update({
            where: { id: item.accountId },
            data: { status: input.result === "DISABLED" ? "DISABLED" : "REVOKED" },
          });
        }
      }
    }
    // FR-OFF-08: nhánh kết thúc khi mọi mục Đã thu hồi hoặc Đã vô hiệu hóa.
    const remaining = await tx.revocationItem.count({ where: { offboardingId: off.id, status: { notIn: ["REVOKED", "DISABLED"] } } });
    if (!remaining) await closeTasks(tx, { objectType: "OFFBOARDING_REQUEST", objectId: off.id, types: ["OFF_REVOKE"] }, now);

    await audit(tx, {
      actorId: actor.userId,
      action: input.result === "NOT_REVOKED" ? "REVOKE" : input.result === "DISABLED" ? "DISABLE" : "REVOKE",
      objectType: "REVOCATION_ITEM",
      objectId: item.id,
      caseCode: off.requestCode,
      result: input.result === "NOT_REVOKED" ? "FAILED" : "SUCCESS",
      reason: input.result === "NOT_REVOKED" ? input.failureReason : `${item.accessName}. Bằng chứng: ${input.evidenceRef}`,
      now,
    });
    await bumpRev(tx, off.id);
    await evaluateOffboarding(tx, off.id, now);
  });
}

/** FR-OFF-07: IT bổ sung quyền cấp ngoài ELAMS. */
export async function addManualRevocation(
  actor: Actor,
  taskId: number,
  input: { accessName?: string; systemId: number; accountIdentifier: string; note?: string },
  now: Date,
) {
  const errors: FieldErrors = {};
  if (!input.systemId) errors.systemId = MSG.REQUIRED("hệ thống");
  if (!input.accountIdentifier?.trim()) errors.accountIdentifier = MSG.REQUIRED("tài khoản");
  if (Object.keys(errors).length) throw new BusinessError(Object.values(errors)[0], errors);
  return inTx(async (tx) => {
    const { task, off } = await loadOffForTask(tx, taskId, actor, ["OFF_REVOKE"]);
    const system = await tx.targetSystem.findUniqueOrThrow({ where: { id: input.systemId } });
    let account = await tx.systemAccount.findUnique({
      where: { employeeId_systemId: { employeeId: off.employeeId, systemId: system.id } },
    });
    if (!account) {
      account = await tx.systemAccount.create({
        data: { employeeId: off.employeeId, systemId: system.id, accountIdentifier: input.accountIdentifier.trim(), status: "ACTIVE" },
      });
    }
    const started = now >= off.revokeAt;
    const item = await tx.revocationItem.create({
      data: {
        offboardingId: off.id,
        systemId: system.id,
        accountId: account.id,
        accessName: (input.accessName?.trim() || system.name).slice(0, 100),
        source: "MANUAL",
        status: started ? "IN_PROGRESS" : "WAITING",
      },
    });
    if (task.status === "DONE") await tx.task.update({ where: { id: task.id }, data: { status: "OPEN", completedAt: null } });
    await audit(tx, {
      actorId: actor.userId,
      action: "ADD_MANUAL_REVOCATION",
      objectType: "REVOCATION_ITEM",
      objectId: item.id,
      caseCode: off.requestCode,
      reason: `${item.accessName} (${system.name}, ${account.accountIdentifier})${input.note ? `. ${input.note}` : ""}`,
      now,
    });
    await bumpRev(tx, off.id);
    await evaluateOffboarding(tx, off.id, now);
  });
}

// ---------------------------------------------------------------------------
// UC-OFF-06, 07: thiết bị

export async function recordDeviceReturn(
  actor: Actor,
  taskId: number,
  itemId: number,
  input: { returnedAt?: string; condition?: ReturnCondition; note?: string },
  now: Date,
) {
  const errors: FieldErrors = {};
  const at = input.returnedAt ? parseDateTimeInput(input.returnedAt) : null;
  if (!at) errors.returnedAt = MSG.REQUIRED("thời điểm thu hồi");
  else if (at > now) errors.returnedAt = "Thời điểm không được sau hiện tại.";
  if (!input.condition) errors.condition = MSG.REQUIRED("tình trạng"); // US-OFF-08 AC-3
  if (Object.keys(errors).length) throw new BusinessError(Object.values(errors)[0], errors);
  return inTx(async (tx) => {
    const { task, off } = await loadOffForTask(tx, taskId, actor, ["OFF_DEVICE"]);
    const item = await tx.deviceReturnItem.findFirst({ where: { id: itemId, offboardingId: off.id }, include: { device: true } });
    if (!item || item.status !== "WAITING") throw new BusinessError("Thiết bị không ở trạng thái Chờ thu hồi.");
    await tx.deviceReturnItem.update({
      where: { id: item.id },
      data: { status: "RETURNED", returnedAt: at!, deviceCondition: input.condition },
    });
    await tx.device.update({ where: { id: item.deviceId }, data: { status: "IN_STOCK", holderEmployeeId: null } });
    await syncDeviceReturnTask(tx, task.id, off.id, now);
    await audit(tx, {
      actorId: actor.userId,
      action: "RETURN_DEVICE",
      objectType: "DEVICE_RETURN_ITEM",
      objectId: item.id,
      caseCode: off.requestCode,
      reason: `${item.device.assetCode} · ${input.condition}${input.note ? `. ${input.note}` : ""}`,
      now,
    });
    await bumpRev(tx, off.id);
    await evaluateOffboarding(tx, off.id, now);
  });
}

export async function recordDeviceReturnMissing(
  actor: Actor,
  taskId: number,
  itemId: number,
  input: { reason?: string; evidenceRef?: string },
  now: Date,
) {
  const errors: FieldErrors = {};
  if (!input.reason?.trim()) errors.missingReason = MSG.REQUIRED("lý do");
  if (!input.evidenceRef?.trim()) errors.evidence = MSG.REQUIRED("bằng chứng");
  if (Object.keys(errors).length) throw new BusinessError(Object.values(errors)[0], errors);
  return inTx(async (tx) => {
    const { task, off } = await loadOffForTask(tx, taskId, actor, ["OFF_DEVICE"]);
    const item = await tx.deviceReturnItem.findFirst({ where: { id: itemId, offboardingId: off.id }, include: { device: true } });
    if (!item || item.status !== "WAITING") throw new BusinessError("Thiết bị không ở trạng thái Chờ thu hồi.");
    await tx.deviceReturnItem.update({
      where: { id: item.id },
      data: { status: "MISSING_PENDING_DECISION", missingReason: input.reason!.trim().slice(0, 500), evidenceRef: input.evidenceRef!.trim().slice(0, 300) },
    });
    const mgr = off.employee.manager?.user;
    if (!mgr) throw new BusinessError("Nhân viên chưa có Manager để quyết định ngoại lệ.");
    await createTask(tx, {
      type: "OFF_DEVICE_EXCEPTION",
      objectType: "DEVICE_RETURN_ITEM",
      objectId: item.id,
      caseCode: off.requestCode,
      title: `${item.device.assetCode} · ${off.employee.fullName}`,
      assigneeId: mgr.id,
      dueAt: endOfVnDay(addHours(now, 48)),
      isUrgent: off.isUrgent,
      now,
    });
    await syncDeviceReturnTask(tx, task.id, off.id, now);
    await audit(tx, {
      actorId: actor.userId,
      action: "DEVICE_MISSING",
      objectType: "DEVICE_RETURN_ITEM",
      objectId: item.id,
      caseCode: off.requestCode,
      reason: input.reason,
      now,
    });
    await bumpRev(tx, off.id);
    await evaluateOffboarding(tx, off.id, now);
  });
}

/** UC-OFF-07: Manager duyệt ngoại lệ hoặc yêu cầu tiếp tục thu hồi. */
export async function decideDeviceException(
  actor: Actor,
  taskId: number,
  input: { decision: "APPROVE_EXCEPTION" | "CONTINUE"; reason?: string },
  now: Date,
) {
  if (input.decision !== "APPROVE_EXCEPTION" && input.decision !== "CONTINUE")
    throw new BusinessError(MSG.REQUIRED("quyết định"), { decision: MSG.REQUIRED("quyết định") });
  if (input.decision === "APPROVE_EXCEPTION" && !input.reason?.trim())
    throw new BusinessError(MSG.REQUIRED("lý do duyệt ngoại lệ"), { reason: MSG.REQUIRED("lý do duyệt ngoại lệ") });
  return inTx(async (tx) => {
    const task = await claimTask(tx, taskId, actor.userId);
    if (task.taskType !== "OFF_DEVICE_EXCEPTION") throw new ForbiddenError();
    const item = await tx.deviceReturnItem.findUniqueOrThrow({
      where: { id: task.objectId },
      include: { device: true, offboarding: { include: { employee: true } } },
    });
    if (item.status !== "MISSING_PENDING_DECISION") throw new BusinessError("Thiết bị không còn chờ quyết định.");
    const off = item.offboarding;
    if (input.decision === "APPROVE_EXCEPTION") {
      await tx.deviceReturnItem.update({
        where: { id: item.id },
        data: { status: "EXCEPTION_NOT_RETURNED", exceptionById: actor.userId, exceptionReason: input.reason!.trim().slice(0, 500), exceptionAt: now },
      });
      // Thiết bị vẫn gắn với nhân viên để tiếp tục theo dõi.
      await tx.device.update({ where: { id: item.deviceId }, data: { status: "EXCEPTION_NOT_RETURNED" } });
      await notify(tx, off.hrUserId, `${item.device.assetCode} của ${off.employee.fullName} được duyệt ngoại lệ – chưa thu hồi: ${input.reason}`, now, {
        link: `/offboarding/${off.requestCode}`,
      });
    } else {
      await tx.deviceReturnItem.update({
        where: { id: item.id },
        data: { status: "WAITING", missingReason: null },
      });
    }
    await closeTasks(tx, { objectType: "DEVICE_RETURN_ITEM", objectId: item.id, types: ["OFF_DEVICE_EXCEPTION"] }, now);
    const devTask = await tx.task.findFirst({ where: { objectType: "OFFBOARDING_REQUEST", objectId: off.id, taskType: "OFF_DEVICE" } });
    if (devTask) {
      await syncDeviceReturnTask(tx, devTask.id, off.id, now);
      if (input.decision === "CONTINUE")
        await notify(tx, devTask.assigneeId, `Tiếp tục thu hồi ${item.device.assetCode} của ${off.employee.fullName}.`, now, { link: `/tasks/device-return/${devTask.id}` });
    }
    await audit(tx, {
      actorId: actor.userId,
      action: input.decision === "APPROVE_EXCEPTION" ? "APPROVE_EXCEPTION" : "CONTINUE_RECOVERY",
      objectType: "DEVICE_RETURN_ITEM",
      objectId: item.id,
      caseCode: off.requestCode,
      reason: input.reason?.trim() || null,
      now,
    });
    await bumpRev(tx, off.id);
    await evaluateOffboarding(tx, off.id, now);
    return {
      message:
        input.decision === "APPROVE_EXCEPTION"
          ? "Đã duyệt ngoại lệ. Thiết bị chuyển Ngoại lệ – chưa thu hồi; HR đã được thông báo."
          : "IT tiếp tục thu hồi thiết bị.",
    };
  });
}

async function syncDeviceReturnTask(tx: Tx, taskId: number, offId: number, now: Date) {
  const items = await tx.deviceReturnItem.findMany({ where: { offboardingId: offId } });
  const done = items.every((i) => i.status === "RETURNED" || i.status === "EXCEPTION_NOT_RETURNED");
  const waitingManager = items.some((i) => i.status === "MISSING_PENDING_DECISION");
  await tx.task.update({
    where: { id: taskId },
    data: done ? { status: "DONE", completedAt: now } : { status: waitingManager && !items.some((i) => i.status === "WAITING") ? "WAITING" : "OPEN", completedAt: null },
  });
}

// ---------------------------------------------------------------------------
// UC-OFF-08: điều kiện hoàn tất và xác nhận

async function bumpRev(tx: Tx, offId: number) {
  await tx.offboardingRequest.update({ where: { id: offId }, data: { dataRev: { increment: 1 } } });
}

type OffForConditions = Prisma.OffboardingRequestGetPayload<{
  include: { revocations: true; deviceReturns: { include: { device: true } }; handoverItems: true };
}>;

/** BR-OFF-08: quyền thu hồi đủ, bàn giao được xác nhận, thiết bị thu hồi hoặc ngoại lệ. */
export function offboardingConditions(off: OffForConditions) {
  const missing: { label: string; status: string; reason: string | null }[] = [];
  if (!off.handoverConfirmedAt) missing.push({ label: "Bàn giao công việc", status: "Chưa xác nhận", reason: null });
  for (const r of off.revocations) {
    if (r.status === "REVOKED" || r.status === "DISABLED") continue;
    missing.push({ label: r.accessName, status: r.status, reason: r.failureReason });
  }
  for (const d of off.deviceReturns) {
    if (d.status === "RETURNED" || d.status === "EXCEPTION_NOT_RETURNED") continue;
    missing.push({ label: `Thiết bị ${d.device.assetCode}`, status: d.status, reason: d.missingReason });
  }
  const stuck =
    off.revocations.some((r) => r.status === "NOT_REVOKED") ||
    off.deviceReturns.some((d) => d.status === "MISSING_PENDING_DECISION") ||
    off.handoverItems.some((h) => h.status === "NOT_MET");
  return { met: missing.length === 0, missing, stuck };
}

async function loadOffForConditions(tx: Tx, id: number) {
  return tx.offboardingRequest.findUniqueOrThrow({
    where: { id },
    include: { revocations: true, deviceReturns: { include: { device: true } }, handoverItems: true, employee: true },
  });
}

export async function evaluateOffboarding(tx: Tx, offId: number, now: Date) {
  const off = await loadOffForConditions(tx, offId);
  if (off.status === "COMPLETED" || off.dataRev <= off.conditionsCheckedRev) return;
  const { met, stuck } = offboardingConditions(off);
  const next = met ? "PENDING_HR_CONFIRMATION" : stuck ? "PENDING_CONDITIONS" : "IN_PROGRESS";
  await tx.offboardingRequest.update({ where: { id: off.id }, data: { status: next, conditionsCheckedRev: off.dataRev } });
  if (next === off.status) return;
  if (off.status === "PENDING_HR_CONFIRMATION")
    await closeTasks(tx, { objectType: "OFFBOARDING_REQUEST", objectId: off.id, types: ["OFF_CONFIRM"] }, now, "CANCELLED");
  if (next === "PENDING_HR_CONFIRMATION") {
    await createTask(tx, {
      type: "OFF_CONFIRM",
      objectType: "OFFBOARDING_REQUEST",
      objectId: off.id,
      caseCode: off.requestCode,
      title: off.employee.fullName,
      assigneeId: off.hrUserId,
      dueAt: endOfVnDay(addHours(now, 48)),
      isUrgent: off.isUrgent,
      now,
    });
  }
  await audit(tx, {
    actorId: null,
    action: "STATUS_CHANGE",
    objectType: "OFFBOARDING_REQUEST",
    objectId: off.id,
    caseCode: off.requestCode,
    reason: `${off.status} → ${next}`,
    now,
  });
}

/** FR-OFF-13. */
export async function confirmOffboarding(actor: Actor, offId: number, now: Date) {
  return inTx(async (tx) => {
    await lockRow(tx, "offboarding_request", offId);
    const off = await loadOffForConditions(tx, offId);
    if (actor.role !== "HR" || off.hrUserId !== actor.userId) throw new ForbiddenError();
    if (off.status !== "PENDING_HR_CONFIRMATION") throw new BusinessError("Yêu cầu không ở trạng thái Chờ HR xác nhận.");
    const { met, missing } = offboardingConditions(off);
    if (!met) {
      const reason = missing.map((m) => `${m.label} ${m.status}`).join(", ");
      await tx.offboardingRequest.update({ where: { id: off.id }, data: { status: "PENDING_CONDITIONS", conditionsCheckedRev: off.dataRev } });
      await closeTasks(tx, { objectType: "OFFBOARDING_REQUEST", objectId: off.id, types: ["OFF_CONFIRM"] }, now, "CANCELLED");
      await audit(tx, {
        actorId: actor.userId,
        action: "CONFIRM_COMPLETION",
        objectType: "OFFBOARDING_REQUEST",
        objectId: off.id,
        caseCode: off.requestCode,
        result: "FAILED",
        reason,
        now,
      });
      return { ok: false as const, message: MSG.CONDITIONS_CHANGED(reason) };
    }
    await tx.offboardingRequest.update({ where: { id: off.id }, data: { status: "COMPLETED", completedAt: now } });
    await tx.employee.update({ where: { id: off.employeeId }, data: { status: "LEFT" } });
    await tx.appUser.updateMany({ where: { employeeId: off.employeeId }, data: { status: "DISABLED" } });
    await closeTasks(tx, { objectType: "OFFBOARDING_REQUEST", objectId: off.id }, now);
    await audit(tx, {
      actorId: actor.userId,
      action: "CONFIRM_COMPLETION",
      objectType: "OFFBOARDING_REQUEST",
      objectId: off.id,
      caseCode: off.requestCode,
      now,
    });
    return { ok: true as const, message: `Đã hoàn tất ${off.requestCode}. Tài khoản ELAMS của ${off.employee.fullName} đã bị vô hiệu hóa.` };
  });
}

export { notifyRole };
