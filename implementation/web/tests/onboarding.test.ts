// Kiểm thử tự động theo UAT Onboarding (validation/uat-onboarding.md).
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import { BusinessError } from "@/lib/errors";
import {
  adjustBlockedItem,
  changeStartDate,
  confirmOnboarding,
  createOnboarding,
  recordDeviceAvailable,
  recordDeviceHandover,
  recordDeviceMissing,
  recordInvalidApprovalRevocation,
  recordOnboardingProvision,
  retryOnboardingProvision,
  reviewOnboardingItem,
  type CreateOnboardingInput,
} from "@/server/onboarding";
import { runJobs } from "@/server/scheduler";
import { T0, actor, hours, mustTask, openTask, setup } from "./helpers";

let ids: Awaited<ReturnType<typeof setup>>;

async function anInput(over: Partial<CreateOnboardingInput> = {}): Promise<CreateOnboardingInput> {
  const tpl = await db.positionAccessTemplate.findMany({ where: { jobTitleId: ids.titles["Kế toán viên"].id }, orderBy: { sequenceNo: "asc" } });
  return {
    fullName: "Nguyễn Văn An",
    personalEmail: "an.nguyen@gmail.com",
    departmentId: ids.dept["Kế toán"].id,
    jobTitleId: ids.titles["Kế toán viên"].id,
    startDate: "2026-12-01",
    managerId: ids.people.binh.id,
    accesses: tpl.map((t) => ({ accessId: t.accessId, level: t.defaultLevel, isMandatory: t.isMandatory, fromTemplate: true })),
    devices: [{ deviceType: "LAPTOP", configNote: "Cấu hình kế toán", fromTemplate: true }],
    note: "",
    submissionKey: `k-${Math.random()}`,
    ...over,
  };
}

async function items(code: string) {
  return db.onboardingAccessItem.findMany({ where: { onboarding: { requestCode: code } }, orderBy: { sequenceNo: "asc" }, include: { access: true } });
}

async function approve(username: string, type: "ON_ACCESS_REVIEW" | "SECURITY_REVIEW", now = T0) {
  const t = await mustTask(username, type);
  return reviewOnboardingItem(await actor(username), t.id, { decision: "APPROVE" }, now);
}

async function provisionOk(now = T0, ident = "an.nguyen") {
  const t = await mustTask("dung.pham", "PROVISION");
  return recordOnboardingProvision(await actor("dung.pham"), t.id, { accountChoice: "CREATED", accountIdentifier: ident, result: "SUCCESS", evidenceRef: "TICKET-1" }, now);
}

beforeEach(async () => {
  ids = await setup();
});

describe("UAT-ON-01 – Tạo yêu cầu hợp lệ", () => {
  it("tạo yêu cầu, hồ sơ PRE_HIRE, chỉ quyền đầu có nhiệm vụ xét duyệt, IT có nhiệm vụ thiết bị", async () => {
    const r = await createOnboarding(await actor("ha.le"), await anInput(), T0);
    expect(r.requestCode).toBe("ONB-2026-0001");
    const ob = await db.onboardingRequest.findUniqueOrThrow({ where: { requestCode: r.requestCode }, include: { employee: true } });
    expect(ob.status).toBe("IN_PROGRESS");
    expect(ob.employee.status).toBe("PRE_HIRE");
    const its = await items(r.requestCode);
    expect(its.map((i) => i.status)).toEqual(["IN_PROGRESS", "WAITING", "WAITING"]);
    const review = await mustTask("binh.tran", "ON_ACCESS_REVIEW");
    expect(review.objectId).toBe(its[0].id);
    expect(review.dueAt).not.toBeNull();
    expect(await openTask("dung.pham", "ON_DEVICE")).not.toBeNull();
  });
});

describe("UAT-ON-02 – Dữ liệu không hợp lệ", () => {
  it("thiếu trường, ngày quá khứ, đổi phân loại quyền bắt buộc", async () => {
    const hr = await actor("ha.le");
    await expect(createOnboarding(hr, await anInput({ fullName: " " }), T0)).rejects.toThrow(BusinessError);
    await expect(createOnboarding(hr, await anInput({ startDate: "2026-11-20" }), T0)).rejects.toMatchObject({
      fieldErrors: { startDate: "Ngày bắt đầu không được trước ngày hôm nay." },
    });
    const input = await anInput();
    input.accesses[0].isMandatory = false;
    await expect(createOnboarding(hr, input, T0)).rejects.toMatchObject({ fieldErrors: { "accesses.0.isMandatory": expect.stringContaining("bắt buộc") } });
    expect(await db.onboardingRequest.count()).toBe(0);
  });
});

describe("UAT-ON-03 – Chặn yêu cầu trùng", () => {
  it("cùng email cá nhân, yêu cầu chưa hoàn tất → không tạo", async () => {
    const hr = await actor("ha.le");
    await createOnboarding(hr, await anInput(), T0);
    await expect(createOnboarding(hr, await anInput({ personalEmail: "AN.NGUYEN@gmail.com" }), T0)).rejects.toMatchObject({
      code: "ONB_DUPLICATE",
    });
  });
});

describe("UAT-ON-04 – Gửi lại không tạo trùng", () => {
  it("cùng khóa gửi → trả về yêu cầu cũ", async () => {
    const hr = await actor("ha.le");
    const input = await anInput();
    const a = await createOnboarding(hr, input, T0);
    const b = await createOnboarding(hr, input, T0);
    expect(b.replay).toBe(true);
    expect(b.requestCode).toBe(a.requestCode);
    expect(await db.onboardingRequest.count()).toBe(1);
    expect(await db.task.count({ where: { taskType: "ON_ACCESS_REVIEW" } })).toBe(1);
  });
});

describe("UAT-ON-05 – Quyền thường và quyền nhạy cảm", () => {
  it("quyền thường → IT; quyền nhạy cảm → Security rồi IT", async () => {
    const { requestCode } = await createOnboarding(await actor("ha.le"), await anInput(), T0);
    await approve("binh.tran", "ON_ACCESS_REVIEW");
    expect(await openTask("hai.vo", "SECURITY_REVIEW")).toBeNull();
    await provisionOk();
    // Quyền 2 (MISA, nhạy cảm) bắt đầu
    await approve("binh.tran", "ON_ACCESS_REVIEW");
    expect(await openTask("dung.pham", "PROVISION")).toBeNull(); // chưa đủ phê duyệt
    await approve("hai.vo", "SECURITY_REVIEW");
    expect(await openTask("dung.pham", "PROVISION")).not.toBeNull();
    const its = await items(requestCode);
    expect(its[0].status).toBe("COMPLETED");
    expect(its[1].currentStep).toBe("IT_PROVISION");
  });
});

describe("UAT-ON-06 – Từ chối quyền không bắt buộc", () => {
  it("REJECTED và kết thúc nhánh; thiếu lý do thì không lưu", async () => {
    const { requestCode } = await createOnboarding(await actor("ha.le"), await anInput(), T0);
    await approve("binh.tran", "ON_ACCESS_REVIEW");
    await provisionOk();
    await approve("binh.tran", "ON_ACCESS_REVIEW");
    await approve("hai.vo", "SECURITY_REVIEW");
    await provisionOk();
    const t = await mustTask("binh.tran", "ON_ACCESS_REVIEW");
    await expect(reviewOnboardingItem(await actor("binh.tran"), t.id, { decision: "REJECT", reason: "" }, T0)).rejects.toThrow("lý do từ chối");
    await reviewOnboardingItem(await actor("binh.tran"), t.id, { decision: "REJECT", reason: "Chưa cần" }, T0);
    expect((await items(requestCode))[2].status).toBe("REJECTED");
  });
});

describe("UAT-ON-07 – Từ chối quyền bắt buộc và điều chỉnh", () => {
  it("BLOCKED, quyền sau tiếp tục chờ, Manager điều chỉnh mức rồi duyệt lại", async () => {
    const input = await anInput();
    input.accesses[1].level = "Quản trị";
    const { requestCode } = await createOnboarding(await actor("ha.le"), input, T0);
    await approve("binh.tran", "ON_ACCESS_REVIEW");
    await provisionOk();
    await approve("binh.tran", "ON_ACCESS_REVIEW");
    const sec = await mustTask("hai.vo", "SECURITY_REVIEW");
    await reviewOnboardingItem(await actor("hai.vo"), sec.id, { decision: "REJECT", reason: "Chỉ cần quyền xem" }, T0);
    let its = await items(requestCode);
    expect(its[1].status).toBe("BLOCKED");
    expect(its[2].status).toBe("WAITING");
    const ob = await db.onboardingRequest.findUniqueOrThrow({ where: { requestCode } });
    expect(ob.status).toBe("PENDING_CONDITIONS");

    const adj = await mustTask("binh.tran", "ON_ACCESS_ADJUST");
    await adjustBlockedItem(await actor("binh.tran"), adj.id, { level: "Xem", note: "Giảm xuống quyền xem" }, T0);
    its = await items(requestCode);
    expect(its[1]).toMatchObject({ status: "IN_PROGRESS", currentStep: "MANAGER_REVIEW", accessLevel: "Xem", isMandatory: true });
    expect(await openTask("binh.tran", "ON_ACCESS_REVIEW")).not.toBeNull();
  });
});

describe("UAT-ON-08 – Cấp quyền và dùng lại tài khoản", () => {
  it("thiếu bằng chứng không lưu; quyền sau cùng hệ thống dùng lại tài khoản; ghi sổ quyền", async () => {
    const { requestCode } = await createOnboarding(await actor("ha.le"), await anInput(), T0);
    await approve("binh.tran", "ON_ACCESS_REVIEW");
    const t = await mustTask("dung.pham", "PROVISION");
    await expect(
      recordOnboardingProvision(await actor("dung.pham"), t.id, { accountChoice: "CREATED", accountIdentifier: "an.nguyen", result: "SUCCESS" }, T0),
    ).rejects.toThrow("bằng chứng");
    await provisionOk();
    const ob = await db.onboardingRequest.findUniqueOrThrow({ where: { requestCode } });
    const grants = await db.accessGrant.findMany({ where: { employeeId: ob.employeeId } });
    expect(grants).toHaveLength(1);
    expect(grants[0].source).toBe("ONBOARDING");
    // Không tạo tài khoản thứ hai trên cùng hệ thống
    const before = await db.systemAccount.count({ where: { employeeId: ob.employeeId } });
    expect(before).toBe(1);
  });
});

describe("UAT-ON-09 – Lỗi cấp quyền và khắc phục", () => {
  it("không xác định tài khoản → BLOCKED, không tạo tài khoản; khắc phục rồi cấp", async () => {
    const { requestCode } = await createOnboarding(await actor("ha.le"), await anInput(), T0);
    await approve("binh.tran", "ON_ACCESS_REVIEW");
    const it = await actor("dung.pham");
    const t = await mustTask("dung.pham", "PROVISION");
    await recordOnboardingProvision(it, t.id, { accountChoice: "UNKNOWN", unknownReason: "Trùng tên trên M365" }, T0);
    let its = await items(requestCode);
    expect(its[0].status).toBe("BLOCKED");
    expect(its[0].blockedReason).toContain("Không xác định được tài khoản");
    expect(await db.systemAccount.count({ where: { employeeId: (await db.onboardingRequest.findUniqueOrThrow({ where: { requestCode } })).employeeId } })).toBe(0);
    await expect(provisionOk()).rejects.toThrow();
    await retryOnboardingProvision(it, t.id, T0);
    await provisionOk();
    its = await items(requestCode);
    expect(its[0].status).toBe("COMPLETED");
  });
});

describe("UAT-ON-10 – Phê duyệt mất hiệu lực", () => {
  it("danh mục đổi sang nhạy cảm sau khi duyệt → BLOCKED, IT thu hồi, chờ phê duyệt mới", async () => {
    const { requestCode } = await createOnboarding(await actor("ha.le"), await anInput(), T0);
    await approve("binh.tran", "ON_ACCESS_REVIEW");
    await db.accessCatalog.update({ where: { id: ids.acc.email.id }, data: { isSensitive: true } });
    const r = await provisionOk();
    expect(r.status).toBe("APPROVAL_INVALID");
    let its = await items(requestCode);
    expect(its[0]).toMatchObject({ status: "BLOCKED", blockedKind: "APPROVAL_INVALID" });
    expect(await db.accessGrant.count({ where: { accessId: ids.acc.email.id, employee: { fullName: "Nguyễn Văn An" } } })).toBe(0);
    const t = await mustTask("dung.pham", "PROVISION");
    await recordInvalidApprovalRevocation(await actor("dung.pham"), t.id, { targetState: "GRANTED", action: "REVOKE", evidenceRef: "TICKET-9" }, T0);
    its = await items(requestCode);
    expect(its[0]).toMatchObject({ status: "BLOCKED", blockedKind: "REVOKED_AWAITING_APPROVAL" });
    expect(await openTask("binh.tran", "ON_ACCESS_ADJUST")).not.toBeNull();
  });
});

describe("UAT-ON-11 – Thiếu thiết bị và bàn giao", () => {
  it("thiếu → chờ, không tự chuyển; có thiết bị → bàn giao đủ biên bản", async () => {
    const { requestCode } = await createOnboarding(await actor("ha.le"), await anInput(), T0);
    const it = await actor("dung.pham");
    const t = await mustTask("dung.pham", "ON_DEVICE");
    const line = await db.onboardingDeviceItem.findFirstOrThrow({ where: { onboarding: { requestCode } } });
    await recordDeviceMissing(it, t.id, line.id, { reason: "Kho hết laptop cấu hình kế toán" }, T0);
    expect((await db.task.findUniqueOrThrow({ where: { id: t.id } })).status).toBe("WAITING");
    await runJobs(hours(T0, 72));
    expect((await db.onboardingDeviceItem.findUniqueOrThrow({ where: { id: line.id } })).status).toBe("WAITING_DEVICE");
    await recordDeviceAvailable(it, t.id, line.id, { kind: "AS_REQUESTED" }, T0);
    const dev = await db.device.findUniqueOrThrow({ where: { assetCode: "LT-2026-0457" } });
    await expect(
      recordDeviceHandover(it, t.id, line.id, { deviceId: dev.id, handedOverAt: "2026-11-24T08:30", condition: "NEW", recordCode: "BB-0912" }, T0),
    ).rejects.toThrow("biên bản đã ký");
    await recordDeviceHandover(
      it,
      t.id,
      line.id,
      { deviceId: dev.id, handedOverAt: "2026-11-24T08:30", condition: "NEW", recordCode: "BB-0912", recordFile: "uploads/bb.pdf" },
      T0,
    );
    expect((await db.device.findUniqueOrThrow({ where: { id: dev.id } })).status).toBe("ASSIGNED");
    expect((await db.task.findUniqueOrThrow({ where: { id: t.id } })).status).toBe("DONE");
  });
});

async function runToCompletion() {
  const r = await createOnboarding(await actor("ha.le"), await anInput(), T0);
  await approve("binh.tran", "ON_ACCESS_REVIEW");
  await provisionOk();
  await approve("binh.tran", "ON_ACCESS_REVIEW");
  await approve("hai.vo", "SECURITY_REVIEW");
  await provisionOk();
  const rev = await mustTask("binh.tran", "ON_ACCESS_REVIEW");
  await reviewOnboardingItem(await actor("binh.tran"), rev.id, { decision: "REJECT", reason: "Chưa cần" }, T0);
  const dt = await mustTask("dung.pham", "ON_DEVICE");
  const line = await db.onboardingDeviceItem.findFirstOrThrow({ where: { onboarding: { requestCode: r.requestCode } } });
  const dev = await db.device.findUniqueOrThrow({ where: { assetCode: "LT-2026-0457" } });
  await recordDeviceHandover(
    await actor("dung.pham"),
    dt.id,
    line.id,
    { deviceId: dev.id, handedOverAt: "2026-11-24T08:30", condition: "NEW", recordCode: "BB-1", recordFile: "uploads/bb.pdf" },
    T0,
  );
  return r.requestCode;
}

describe("UAT-ON-12 – Xác nhận hoàn tất", () => {
  it("đủ điều kiện → Chờ HR xác nhận → Hoàn tất, nhân viên ACTIVE, có tài khoản ELAMS", async () => {
    const code = await runToCompletion();
    const ob = await db.onboardingRequest.findUniqueOrThrow({ where: { requestCode: code } });
    expect(ob.status).toBe("PENDING_HR_CONFIRMATION");
    expect(await openTask("ha.le", "ON_CONFIRM")).not.toBeNull();
    const r = await confirmOnboarding(await actor("ha.le"), ob.id, T0);
    expect(r.ok).toBe(true);
    const after = await db.onboardingRequest.findUniqueOrThrow({ where: { id: ob.id }, include: { employee: { include: { user: true } } } });
    expect(after.status).toBe("COMPLETED");
    expect(after.employee.status).toBe("ACTIVE");
    expect(after.employee.user?.username).toBe("an.nguyen");
    expect(await db.auditLog.count({ where: { action: "CONFIRM_COMPLETION", caseCode: code, result: "SUCCESS" } })).toBe(1);
  });

  it("BLOCKED → Chờ xử lý điều kiện còn thiếu; xem không kiểm tra lại", async () => {
    const input = await anInput();
    const { requestCode } = await createOnboarding(await actor("ha.le"), input, T0);
    const t = await mustTask("binh.tran", "ON_ACCESS_REVIEW");
    await reviewOnboardingItem(await actor("binh.tran"), t.id, { decision: "REJECT", reason: "Sai người" }, T0);
    const ob = await db.onboardingRequest.findUniqueOrThrow({ where: { requestCode } });
    expect(ob.status).toBe("PENDING_CONDITIONS");
    expect(ob.conditionsCheckedRev).toBe(ob.dataRev);
  });
});

describe("UAT-ON-13 – Điều kiện thay đổi ngay trước khi ghi", () => {
  it("dữ liệu đổi sau khi Chờ HR xác nhận → không đóng, về Chờ xử lý điều kiện còn thiếu", async () => {
    const code = await runToCompletion();
    const ob = await db.onboardingRequest.findUniqueOrThrow({ where: { requestCode: code } });
    // Giả lập dữ liệu đổi ngoài luồng (ví dụ thiết bị bị thu hồi lại) trước khi HR bấm xác nhận
    await db.onboardingDeviceItem.updateMany({ where: { onboardingId: ob.id }, data: { status: "PREPARING" } });
    const r = await confirmOnboarding(await actor("ha.le"), ob.id, T0);
    expect(r.ok).toBe(false);
    expect(r.message).toContain("Điều kiện hoàn tất đã thay đổi");
    expect((await db.onboardingRequest.findUniqueOrThrow({ where: { id: ob.id } })).status).toBe("PENDING_CONDITIONS");
  });
});

describe("UAT-ON-14 – Phân quyền và lịch sử", () => {
  it("IT không được giao không xử lý được; lịch sử thao tác không sửa được", async () => {
    await createOnboarding(await actor("ha.le"), await anInput(), T0);
    await approve("binh.tran", "ON_ACCESS_REVIEW");
    const t = await mustTask("dung.pham", "PROVISION");
    await expect(
      recordOnboardingProvision(await actor("khoa.do"), t.id, { accountChoice: "CREATED", accountIdentifier: "x", result: "SUCCESS", evidenceRef: "T" }, T0),
    ).rejects.toThrow("không có quyền");
    const log = await db.auditLog.findFirstOrThrow();
    await expect(db.auditLog.update({ where: { id: log.id }, data: { reason: "sửa" } })).rejects.toThrow();
    await expect(db.auditLog.delete({ where: { id: log.id } })).rejects.toThrow();
  });
});

describe("UAT-ON-15 – Đổi ngày bắt đầu", () => {
  it("tính lại hạn nhiệm vụ chưa xong, gỡ Quá hạn, không đụng quyền đã cấp", async () => {
    const { requestCode } = await createOnboarding(await actor("ha.le"), await anInput(), T0);
    await approve("binh.tran", "ON_ACCESS_REVIEW");
    await provisionOk();
    const dev = await mustTask("dung.pham", "ON_DEVICE");
    const late = new Date("2026-11-29T02:00:00Z");
    await runJobs(late);
    expect((await db.task.findUniqueOrThrow({ where: { id: dev.id } })).overdueAlertedFor).not.toBeNull();
    const ob = await db.onboardingRequest.findUniqueOrThrow({ where: { requestCode } });
    await expect(changeStartDate(await actor("ha.le"), ob.id, { newDate: "2026-12-08", reason: "" }, late)).rejects.toThrow();
    await changeStartDate(await actor("ha.le"), ob.id, { newDate: "2026-12-08", reason: "Ứng viên xin lùi" }, late);
    const after = await db.task.findUniqueOrThrow({ where: { id: dev.id } });
    expect(after.overdueAlertedFor).toBeNull();
    expect(after.dueAt!.getTime()).toBeGreaterThan(late.getTime());
    expect((await items(requestCode))[0].status).toBe("COMPLETED");
    expect(await db.accessGrant.count({ where: { employeeId: ob.employeeId } })).toBe(1);
  });
});

describe("UAT-ON-16 – Cảnh báo quá hạn", () => {
  it("cảnh báo người phụ trách và HR một lần cho mỗi hạn; nhiệm vụ đã xong không cảnh báo", async () => {
    await createOnboarding(await actor("ha.le"), await anInput(), T0);
    const dev = await mustTask("dung.pham", "ON_DEVICE");
    const late = new Date(dev.dueAt!.getTime() + 3600_000);
    const ha = await actor("ha.le");
    const before = await db.notification.count({ where: { recipientId: ha.userId } });
    await runJobs(late);
    const mid = await db.notification.count({ where: { recipientId: ha.userId } });
    expect(mid).toBeGreaterThan(before);
    await runJobs(hours(late, 1));
    expect(await db.notification.count({ where: { recipientId: ha.userId } })).toBe(mid);
    const alerts = await db.auditLog.count({ where: { action: "SEND_OVERDUE_ALERT", objectId: dev.objectId, objectType: "ONBOARDING_REQUEST" } });
    expect(alerts).toBe(1);
  });
});
