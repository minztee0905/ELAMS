// Kiểm thử tự động theo UAT Access Request (validation/uat-access-request.md).
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/lib/db";
import {
  cancelAccessRequest,
  recordAccessRequestProvision,
  resubmitAccessRequest,
  retryAccessRequestProvision,
  reviewAccessRequest,
  submitAccessRequest,
} from "@/server/access-request";
import { runJobs } from "@/server/scheduler";
import { T0, actor, mustTask, openTask, setup } from "./helpers";

let ids: Awaited<ReturnType<typeof setup>>;
const key = () => `k-${Math.random()}`;

beforeEach(async () => {
  ids = await setup();
});

async function submit(username: string, access: "crm" | "misa" | "docs", level: string, extra: object = {}) {
  return submitAccessRequest(await actor(username), { accessId: ids.acc[access].id, level, reason: "Cần cho công việc", submissionKey: key(), ...extra }, T0);
}

describe("UAT-AC-01 – Gửi yêu cầu hợp lệ", () => {
  it("Chờ Manager duyệt, người duyệt là Manager trực tiếp", async () => {
    const r = await submit("chau.le", "crm", "Xem");
    expect(r.approverName).toBe("Trần Thị Bình");
    const ar = await db.accessRequest.findUniqueOrThrow({ where: { requestCode: r.requestCode } });
    expect(ar.status).toBe("PENDING_MANAGER");
    expect(await openTask("binh.tran", "AR_REVIEW")).not.toBeNull();
  });
});

describe("UAT-AC-02 – Không hợp lệ, trùng, thiếu người duyệt", () => {
  it("thiếu lý do; trùng yêu cầu chưa kết thúc; không có Manager", async () => {
    const chau = await actor("chau.le");
    await expect(
      submitAccessRequest(chau, { accessId: ids.acc.crm.id, level: "Xem", reason: " ", submissionKey: key() }, T0),
    ).rejects.toMatchObject({ fieldErrors: { reason: expect.any(String) } });
    await submit("chau.le", "crm", "Xem");
    await expect(submit("chau.le", "crm", "Ghi")).rejects.toMatchObject({ code: "AR_DUPLICATE" });
    // Đức là cấp cao nhất, không có Manager
    await expect(submit("duc.phan", "crm", "Xem")).rejects.toMatchObject({ code: "AR_NO_APPROVER" });
  });
});

describe("UAT-AC-03 – Quyền nhạy cảm qua Manager và Security", () => {
  it("cảnh báo đã có quyền; Security chỉ nhận sau Manager; IT chỉ nhận sau Security", async () => {
    await expect(submit("chau.le", "misa", "Ghi")).rejects.toMatchObject({ code: "AR_HAS_ACCESS" });
    const r = await submit("chau.le", "misa", "Ghi", { confirmHasAccess: true });
    expect(await openTask("hai.vo", "SECURITY_REVIEW")).toBeNull();
    const t = await mustTask("binh.tran", "AR_REVIEW");
    await reviewAccessRequest(await actor("binh.tran"), t.id, { decision: "APPROVE" }, T0);
    expect((await db.accessRequest.findUniqueOrThrow({ where: { requestCode: r.requestCode } })).status).toBe("PENDING_SECURITY");
    expect(await openTask("dung.pham", "PROVISION")).toBeNull();
    const s = await mustTask("hai.vo", "SECURITY_REVIEW");
    await expect(reviewAccessRequest(await actor("hai.vo"), s.id, { decision: "REQUEST_INFO", reason: "x" }, T0)).rejects.toThrow();
    await reviewAccessRequest(await actor("hai.vo"), s.id, { decision: "APPROVE" }, T0);
    expect((await db.accessRequest.findUniqueOrThrow({ where: { requestCode: r.requestCode } })).status).toBe("PENDING_PROVISION");
  });
});

describe("UAT-AC-04, 05 – Cấp quyền, tài khoản mới và dùng lại", () => {
  it("CRM tạo tài khoản mới; MISA dùng lại tài khoản sẵn có; ghi sổ quyền", async () => {
    const r1 = await submit("chau.le", "crm", "Xem");
    await reviewAccessRequest(await actor("binh.tran"), (await mustTask("binh.tran", "AR_REVIEW")).id, { decision: "APPROVE" }, T0);
    const it1 = await mustTask("dung.pham", "PROVISION");
    await recordAccessRequestProvision(await actor("dung.pham"), it1.id, { accountChoice: "CREATED", accountIdentifier: "chau.le", result: "SUCCESS", evidenceRef: "T-1" }, T0);
    expect((await db.accessRequest.findUniqueOrThrow({ where: { requestCode: r1.requestCode } })).status).toBe("GRANTED");

    await submit("chau.le", "misa", "Ghi", { confirmHasAccess: true });
    await reviewAccessRequest(await actor("binh.tran"), (await mustTask("binh.tran", "AR_REVIEW")).id, { decision: "APPROVE" }, T0);
    await reviewAccessRequest(await actor("hai.vo"), (await mustTask("hai.vo", "SECURITY_REVIEW")).id, { decision: "APPROVE" }, T0);
    const it2 = await mustTask("dung.pham", "PROVISION");
    // IT chọn "tạo mới" nhưng ELAMS đã có tài khoản MISA → dùng lại, không tạo trùng
    await recordAccessRequestProvision(await actor("dung.pham"), it2.id, { accountChoice: "CREATED", accountIdentifier: "chau.le2", result: "SUCCESS", evidenceRef: "T-2" }, T0);
    const accounts = await db.systemAccount.findMany({ where: { employeeId: ids.people.chau.id, systemId: ids.sys["MISA"].id } });
    expect(accounts).toHaveLength(1);
    expect(accounts[0].accountIdentifier).toBe("chau.le");
    expect(await db.accessGrant.count({ where: { employeeId: ids.people.chau.id, source: "ACCESS_REQUEST" } })).toBe(2);
  });
});

describe("UAT-AC-06 – Từ chối", () => {
  it("thiếu lý do không lưu; từ chối kết thúc và thông báo người yêu cầu", async () => {
    const r = await submit("chau.le", "crm", "Xem");
    const t = await mustTask("binh.tran", "AR_REVIEW");
    await expect(reviewAccessRequest(await actor("binh.tran"), t.id, { decision: "REJECT" }, T0)).rejects.toThrow("lý do từ chối");
    await reviewAccessRequest(await actor("binh.tran"), t.id, { decision: "REJECT", reason: "Không thuộc phạm vi công việc" }, T0);
    expect((await db.accessRequest.findUniqueOrThrow({ where: { requestCode: r.requestCode } })).status).toBe("REJECTED");
    const chau = await actor("chau.le");
    expect(await db.notification.count({ where: { recipientId: chau.userId, message: { contains: "bị từ chối" } } })).toBe(1);
  });
});

describe("UAT-AC-07 – Bổ sung, gửi lại và hủy", () => {
  it("Chờ bổ sung không có hạn; gửi lại cùng mã; hủy được khi Chờ bổ sung", async () => {
    const r = await submit("chau.le", "crm", "Xem");
    const t = await mustTask("binh.tran", "AR_REVIEW");
    await reviewAccessRequest(await actor("binh.tran"), t.id, { decision: "REQUEST_INFO", reason: "Ghi rõ khách hàng" }, T0);
    const need = await mustTask("chau.le", "AR_NEED_INFO");
    expect(need.dueAt).toBeNull();
    const ar = await db.accessRequest.findUniqueOrThrow({ where: { requestCode: r.requestCode } });
    await resubmitAccessRequest(await actor("chau.le"), ar.id, { level: "Ghi", reason: "Khách hàng nhóm A, B" }, T0);
    const after = await db.accessRequest.findUniqueOrThrow({ where: { id: ar.id } });
    expect(after).toMatchObject({ status: "PENDING_MANAGER", accessLevel: "Ghi", requestCode: r.requestCode });
    await reviewAccessRequest(await actor("binh.tran"), (await mustTask("binh.tran", "AR_REVIEW")).id, { decision: "REQUEST_INFO", reason: "Thêm tệp" }, T0);
    await cancelAccessRequest(await actor("chau.le"), ar.id, T0);
    expect((await db.accessRequest.findUniqueOrThrow({ where: { id: ar.id } })).status).toBe("CANCELLED");
    expect(await db.approvalDecision.count({ where: { accessRequestId: ar.id } })).toBe(2);
  });
});

describe("UAT-AC-08 – Lỗi cấp quyền", () => {
  it("thất bại giữ Chờ cấp quyền; xử lý lại rồi cấp", async () => {
    const r = await submit("chau.le", "crm", "Xem");
    await reviewAccessRequest(await actor("binh.tran"), (await mustTask("binh.tran", "AR_REVIEW")).id, { decision: "APPROVE" }, T0);
    const t = await mustTask("dung.pham", "PROVISION");
    const it = await actor("dung.pham");
    await recordAccessRequestProvision(it, t.id, { accountChoice: "CREATED", accountIdentifier: "chau.le", result: "FAILURE", failureReason: "CRM lỗi license" }, T0);
    expect((await db.accessRequest.findUniqueOrThrow({ where: { requestCode: r.requestCode } })).status).toBe("PENDING_PROVISION");
    await retryAccessRequestProvision(it, t.id, T0);
    await recordAccessRequestProvision(it, t.id, { accountChoice: "CREATED", accountIdentifier: "chau.le", result: "SUCCESS", evidenceRef: "T" }, T0);
    expect((await db.accessRequest.findUniqueOrThrow({ where: { requestCode: r.requestCode } })).status).toBe("GRANTED");
  });
});

describe("UAT-AC-09 – Manager tự xin quyền", () => {
  it("người duyệt là cấp trên; không ai tự duyệt yêu cầu của mình", async () => {
    const r = await submit("binh.tran", "crm", "Xem");
    expect(r.approverName).toBe("Phan Văn Đức");
    expect(await openTask("binh.tran", "AR_REVIEW")).toBeNull();
    expect(await openTask("duc.phan", "AR_REVIEW")).not.toBeNull();
  });
});

describe("UAT-AC-10 – Cảnh báo quá hạn", () => {
  it("nhiệm vụ duyệt quá hạn được cảnh báo; Chờ bổ sung không quá hạn", async () => {
    await submit("chau.le", "crm", "Xem");
    await submit("mai.trinh", "crm", "Xem");
    await reviewAccessRequest(await actor("huy.hoang"), (await mustTask("huy.hoang", "AR_REVIEW")).id, { decision: "REQUEST_INFO", reason: "?" }, T0);
    const late = new Date("2026-12-10T02:00:00Z");
    const res = await runJobs(late);
    expect(res.overdueAlerts).toBe(1);
  });
});

describe("Quyết định không hợp lệ", () => {
  it("giá trị quyết định rỗng hoặc lạ không được coi là từ chối", async () => {
    const r = await submit("chau.le", "crm", "Xem");
    const t = await mustTask("binh.tran", "AR_REVIEW");
    await expect(reviewAccessRequest(await actor("binh.tran"), t.id, { decision: "" as never, reason: "x" }, T0)).rejects.toThrow("quyết định");
    expect((await db.accessRequest.findUniqueOrThrow({ where: { requestCode: r.requestCode } })).status).toBe("PENDING_MANAGER");
  });
});
