// Kiểm thử tự động theo UAT Offboarding (validation/uat-offboarding.md).
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import {
  addManualRevocation,
  changeLastWorkingDate,
  confirmHandover,
  confirmOffboarding,
  createOffboarding,
  decideDeviceException,
  markUrgent,
  recordDeviceReturn,
  recordDeviceReturnMissing,
  recordRevocation,
  saveHandoverPlan,
  updateHandoverItem,
} from "@/server/offboarding";
import { canViewOffboarding } from "@/server/authz";
import { runJobs } from "@/server/scheduler";
import { actor, mustTask, openTask, setup } from "./helpers";

// UAT Offboarding giả định ngày tạo 01/12/2026
const D1 = new Date("2026-12-01T02:00:00Z"); // 09:00 01/12
const key = () => `k-${Math.random()}`;
let ids: Awaited<ReturnType<typeof setup>>;

beforeEach(async () => {
  ids = await setup(D1);
});

async function createNam(over: object = {}) {
  return createOffboarding(
    await actor("ha.le"),
    { employeeId: ids.people.nam.id, lastWorkingDate: "2026-12-15", leaveReason: "VOLUNTARY", isUrgent: false, submissionKey: key(), ...over },
    D1,
  );
}
const off = (code: string) =>
  db.offboardingRequest.findUniqueOrThrow({ where: { requestCode: code }, include: { revocations: true, deviceReturns: { include: { device: true } }, handoverItems: true } });

describe("UAT-OFF-01 – Tạo yêu cầu hợp lệ", () => {
  it("danh sách thu hồi từ sổ quyền; nhiệm vụ cho Bình và Dũng; thu hồi lúc 18:00 ngày cuối", async () => {
    const r = await createNam();
    const o = await off(r.requestCode);
    expect(o.revocations.map((x) => x.accessName).sort()).toEqual(["CRM nội bộ", "Email công ty", "Phần mềm kế toán"]);
    expect(o.revocations.every((x) => x.status === "WAITING")).toBe(true);
    expect(o.deviceReturns.map((d) => d.device.assetCode).sort()).toEqual(["LT-2025-0188", "MN-2025-0042"]);
    expect(o.revokeAt.toISOString()).toBe("2026-12-15T11:00:00.000Z"); // 18:00 giờ Việt Nam
    expect(await openTask("binh.tran", "OFF_HANDOVER")).not.toBeNull();
    expect((await mustTask("dung.pham", "OFF_REVOKE")).status).toBe("WAITING");
    expect(await openTask("dung.pham", "OFF_DEVICE")).not.toBeNull();
    expect((await db.employee.findUniqueOrThrow({ where: { id: ids.people.nam.id } })).status).toBe("OFFBOARDING");
  });
});

describe("UAT-OFF-02 – Không hợp lệ, trùng, ngày đã qua", () => {
  it("thiếu lý do; trùng; ngày đã qua đề xuất đột xuất", async () => {
    await expect(createNam({ leaveReason: "" })).rejects.toMatchObject({ fieldErrors: { leaveReason: expect.any(String) } });
    await expect(createNam({ lastWorkingDate: "2026-11-30" })).rejects.toMatchObject({ code: "LAST_DAY_PAST" });
    await createNam();
    await expect(createNam()).rejects.toMatchObject({ code: "OFF_DUPLICATE" });
  });
});

describe("UAT-OFF-03 – Nghỉ đột xuất", () => {
  it("tạo đột xuất: thu hồi ngay, hạn 4 giờ; chuyển đột xuất cần lý do", async () => {
    const r = await createOffboarding(
      await actor("ha.le"),
      { employeeId: ids.people.mai.id, lastWorkingDate: "2026-12-01", leaveReason: "TERMINATION", isUrgent: true, submissionKey: key() },
      D1,
    );
    const o = await off(r.requestCode);
    expect(o.revocations.every((x) => x.status === "IN_PROGRESS")).toBe(true);
    expect(o.revokeDueAt!.getTime() - D1.getTime()).toBe(4 * 3600_000);

    const n = await createNam();
    const on = await off(n.requestCode);
    await expect(markUrgent(await actor("ha.le"), on.id, "", D1)).rejects.toThrow();
    await markUrgent(await actor("ha.le"), on.id, "Vi phạm kỷ luật", D1);
    const after = await off(n.requestCode);
    expect(after.isUrgent).toBe(true);
    expect(after.revocations.every((x) => x.status === "IN_PROGRESS")).toBe(true);
    expect((await mustTask("dung.pham", "OFF_REVOKE")).status).toBe("OPEN");
  });
});

describe("UAT-OFF-04, 05 – Bàn giao", () => {
  it("lập kế hoạch, Nam cập nhật, Bình đánh chưa đạt rồi xác nhận; Manager cập nhật thay khi đột xuất", async () => {
    const r = await createNam();
    const binh = await actor("binh.tran");
    const t = await mustTask("binh.tran", "OFF_HANDOVER");
    await expect(saveHandoverPlan(binh, t.id, [{ title: "Sổ cái", receiverId: null, dueDate: "2026-12-15" }], D1)).rejects.toThrow();
    await saveHandoverPlan(
      binh,
      t.id,
      [
        { title: "Sổ cái tháng 12", receiverId: ids.people.chau.id, dueDate: "2026-12-15" },
        { title: "Hồ sơ thuế quý 4", receiverId: ids.people.chau.id, dueDate: "2026-12-15" },
      ],
      D1,
    );
    const namTask = await mustTask("nam.hoang", "OFF_HANDOVER_UPDATE");
    const [a, b] = (await off(r.requestCode)).handoverItems;
    const nam = await actor("nam.hoang");
    await updateHandoverItem(nam, namTask.id, a.id, { status: "HANDED_OVER" }, D1);
    // Manager không cập nhật thay khi chưa đột xuất
    await expect(updateHandoverItem(binh, t.id, b.id, { status: "HANDED_OVER" }, D1)).rejects.toThrow();
    await updateHandoverItem(binh, t.id, a.id, { status: "NOT_MET", reason: "Thiếu chứng từ tháng 10" }, D1);
    await expect(confirmHandover(binh, t.id, D1)).rejects.toThrow();
    await updateHandoverItem(nam, namTask.id, a.id, { status: "HANDED_OVER" }, D1);
    await markUrgent(await actor("ha.le"), (await off(r.requestCode)).id, "Nghỉ gấp", D1);
    await updateHandoverItem(binh, t.id, b.id, { status: "HANDED_OVER" }, D1);
    const log = await db.auditLog.findFirstOrThrow({ where: { action: "HANDOVER_DONE", objectId: b.id } });
    expect(log.reason).toContain("cập nhật thay");
    await confirmHandover(binh, t.id, D1);
    expect((await off(r.requestCode)).handoverConfirmedAt).not.toBeNull();
  });
});

describe("UAT-OFF-06, 07 – Thu hồi quyền", () => {
  it("chờ tới 18:00; cần bằng chứng; chưa thu hồi được giữ nhánh mở; bổ sung VPN", async () => {
    const r = await createNam();
    const t = await mustTask("dung.pham", "OFF_REVOKE");
    const it = await actor("dung.pham");
    const o = await off(r.requestCode);
    const [email] = o.revocations.filter((x) => x.accessName === "Email công ty");
    await expect(recordRevocation(it, t.id, email.id, { result: "DISABLED", evidenceRef: "T" }, D1)).rejects.toThrow("Chưa đến");
    await runJobs(new Date("2026-12-15T10:00:00Z")); // 17:00
    expect((await db.task.findUniqueOrThrow({ where: { id: t.id } })).status).toBe("WAITING");
    const at18 = new Date("2026-12-15T11:00:00Z");
    await runJobs(at18);
    expect((await db.task.findUniqueOrThrow({ where: { id: t.id } })).status).toBe("OPEN");

    await expect(recordRevocation(it, t.id, email.id, { result: "DISABLED" }, at18)).rejects.toThrow("bằng chứng");
    await recordRevocation(it, t.id, email.id, { result: "DISABLED", evidenceRef: "T-1" }, at18);
    const misa = o.revocations.find((x) => x.accessName === "Phần mềm kế toán")!;
    await recordRevocation(it, t.id, misa.id, { result: "NOT_REVOKED", failureReason: "Hệ thống đang bảo trì" }, at18);
    await addManualRevocation(it, t.id, { accessName: "VPN", systemId: ids.sys["VPN"].id, accountIdentifier: "nam.hoang" }, at18);
    const after = await off(r.requestCode);
    expect(after.status).toBe("PENDING_CONDITIONS");
    expect(after.revocations.find((x) => x.source === "MANUAL")?.status).toBe("IN_PROGRESS");
    expect((await db.task.findUniqueOrThrow({ where: { id: t.id } })).status).toBe("OPEN");
    // Sổ quyền: Email đã thu hồi
    const g = await db.accessGrant.findUniqueOrThrow({ where: { id: email.grantId! } });
    expect(g.status).toBe("REVOKED");
  });
});

describe("UAT-OFF-08, 09 – Thiết bị và ngoại lệ", () => {
  it("cần tình trạng; thiếu → Manager quyết định; ngoại lệ cần lý do, HR được thông báo", async () => {
    const r = await createNam();
    const it = await actor("dung.pham");
    const t = await mustTask("dung.pham", "OFF_DEVICE");
    const o = await off(r.requestCode);
    const lt = o.deviceReturns.find((d) => d.device.assetCode === "LT-2025-0188")!;
    const mn = o.deviceReturns.find((d) => d.device.assetCode === "MN-2025-0042")!;
    await expect(recordDeviceReturn(it, t.id, lt.id, { returnedAt: "2026-12-01T08:30" }, D1)).rejects.toThrow("tình trạng");
    await recordDeviceReturn(it, t.id, lt.id, { returnedAt: "2026-12-01T08:30", condition: "GOOD" }, D1);
    expect((await db.device.findUniqueOrThrow({ where: { id: lt.deviceId } })).status).toBe("IN_STOCK");
    await recordDeviceReturnMissing(it, t.id, mn.id, { reason: "Đang để tại nhà", evidenceRef: "BB-thieu.pdf" }, D1);
    const ex = await mustTask("binh.tran", "OFF_DEVICE_EXCEPTION");
    const binh = await actor("binh.tran");
    await decideDeviceException(binh, ex.id, { decision: "CONTINUE" }, D1);
    expect((await db.deviceReturnItem.findUniqueOrThrow({ where: { id: mn.id } })).status).toBe("WAITING");
    await recordDeviceReturnMissing(it, t.id, mn.id, { reason: "Đã mất", evidenceRef: "BB-2.pdf" }, D1);
    const ex2 = await mustTask("binh.tran", "OFF_DEVICE_EXCEPTION");
    await expect(decideDeviceException(binh, ex2.id, { decision: "APPROVE_EXCEPTION" }, D1)).rejects.toThrow();
    await decideDeviceException(binh, ex2.id, { decision: "APPROVE_EXCEPTION", reason: "Đã trừ lương" }, D1);
    expect((await db.deviceReturnItem.findUniqueOrThrow({ where: { id: mn.id } })).status).toBe("EXCEPTION_NOT_RETURNED");
    expect((await db.device.findUniqueOrThrow({ where: { id: mn.deviceId } })).holderEmployeeId).toBe(ids.people.nam.id);
    expect((await db.task.findUniqueOrThrow({ where: { id: t.id } })).status).toBe("DONE");
  });
});

describe("UAT-OFF-10 – Xác nhận hoàn tất", () => {
  it("đủ ba nhánh → Chờ HR xác nhận → Hoàn tất, nhân viên LEFT, tài khoản ELAMS vô hiệu", async () => {
    const r = await createOffboarding(
      await actor("ha.le"),
      { employeeId: ids.people.vinh.id, lastWorkingDate: "2026-12-01", leaveReason: "VOLUNTARY", isUrgent: true, submissionKey: key() },
      D1,
    );
    const it = await actor("dung.pham");
    const huy = await actor("huy.hoang");
    const o = await off(r.requestCode);
    const rt = await mustTask("dung.pham", "OFF_REVOKE");
    for (const x of o.revocations) await recordRevocation(it, rt.id, x.id, { result: "DISABLED", evidenceRef: "T" }, D1);
    const dt = await mustTask("dung.pham", "OFF_DEVICE");
    for (const d of o.deviceReturns) await recordDeviceReturn(it, dt.id, d.id, { returnedAt: "2026-12-01T08:00", condition: "GOOD" }, D1);
    expect((await off(r.requestCode)).status).toBe("IN_PROGRESS"); // bàn giao chưa xác nhận
    const ht = await mustTask("huy.hoang", "OFF_HANDOVER");
    await saveHandoverPlan(huy, ht.id, [{ title: "Danh sách khách hàng", receiverId: ids.people.mai.id, dueDate: "2026-12-01" }], D1);
    const item = (await off(r.requestCode)).handoverItems[0];
    await updateHandoverItem(huy, ht.id, item.id, { status: "HANDED_OVER" }, D1);
    await confirmHandover(huy, ht.id, D1);
    const ready = await off(r.requestCode);
    expect(ready.status).toBe("PENDING_HR_CONFIRMATION");
    const res = await confirmOffboarding(await actor("ha.le"), ready.id, D1);
    expect(res.ok).toBe(true);
    expect((await db.employee.findUniqueOrThrow({ where: { id: ids.people.vinh.id } })).status).toBe("LEFT");
    expect((await db.appUser.findUniqueOrThrow({ where: { employeeId: ids.people.vinh.id } })).status).toBe("DISABLED");
  });
});

describe("UAT-OFF-12 – Phạm vi xem", () => {
  it("Manager phòng khác và IT không được giao không thấy", async () => {
    const r = await createNam();
    const o = await db.offboardingRequest.findUniqueOrThrow({ where: { requestCode: r.requestCode }, include: { employee: true } });
    expect(await canViewOffboarding(await actor("binh.tran"), o)).toBe(true);
    expect(await canViewOffboarding(await actor("huy.hoang"), o)).toBe(false);
    expect(await canViewOffboarding(await actor("dung.pham"), o)).toBe(true);
    expect(await canViewOffboarding(await actor("khoa.do"), o)).toBe(false);
  });
});

describe("UAT-OFF-13 – Đổi ngày nghỉ việc", () => {
  it("tính lại hạn và thời điểm thu hồi; ngày đã qua không lưu", async () => {
    const r = await createNam();
    const o = await off(r.requestCode);
    const hr = await actor("ha.le");
    await expect(changeLastWorkingDate(hr, o.id, { newDate: "2026-11-30", reason: "x" }, D1)).rejects.toThrow("đã qua");
    await changeLastWorkingDate(hr, o.id, { newDate: "2026-12-22", reason: "Gia hạn hợp đồng" }, D1);
    const after = await off(r.requestCode);
    expect(after.revokeAt.toISOString()).toBe("2026-12-22T11:00:00.000Z");
    const dev = await mustTask("dung.pham", "OFF_DEVICE");
    expect(dev.dueAt!.toISOString().slice(0, 10)).toBe("2026-12-22");
  });
});

describe("UAT-OFF-14 – Cảnh báo quá hạn thu hồi gửi cả Security", () => {
  it("Dũng, Hà và Hải nhận cảnh báo", async () => {
    await createOffboarding(
      await actor("ha.le"),
      { employeeId: ids.people.mai.id, lastWorkingDate: "2026-12-01", leaveReason: "TERMINATION", isUrgent: true, submissionKey: key() },
      D1,
    );
    const late = new Date(D1.getTime() + 5 * 3600_000);
    await runJobs(late);
    for (const u of ["dung.pham", "ha.le", "hai.vo"]) {
      const a = await actor(u);
      expect(await db.notification.count({ where: { recipientId: a.userId, message: { startsWith: "Quá hạn: Thu hồi quyền" } } })).toBe(1);
    }
  });
});
