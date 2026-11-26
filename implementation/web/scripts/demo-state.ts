// Đưa dữ liệu mẫu tới vài trạng thái tiêu biểu để chụp màn hình (chạy sau db:seed).
import { db } from "../src/lib/db";
import { reviewOnboardingItem, recordOnboardingProvision, recordDeviceMissing } from "../src/server/onboarding";
import { createOffboarding, saveHandoverPlan, recordRevocation, recordDeviceReturn, recordDeviceReturnMissing, decideDeviceException, updateHandoverItem, activateRevocation } from "../src/server/offboarding";
import type { Actor } from "../src/server/session";

async function actor(username: string): Promise<Actor> {
  const u = await db.appUser.findUniqueOrThrow({ where: { username }, include: { employee: true } });
  return { userId: u.id, employeeId: u.employeeId, role: u.role, fullName: u.employee.fullName, username };
}
async function task(username: string, type: string) {
  const u = await db.appUser.findUniqueOrThrow({ where: { username } });
  return db.task.findFirstOrThrow({ where: { assigneeId: u.id, taskType: type as never, status: { in: ["OPEN", "WAITING"] } }, orderBy: { id: "desc" } });
}

async function main() {
  const now = new Date();
  // Onboarding của An: Email xong, MISA bị Security từ chối mức Quản trị → BLOCKED; laptop thiếu
  const item2 = await db.onboardingAccessItem.findFirstOrThrow({ where: { sequenceNo: 2 } });
  await db.onboardingAccessItem.update({ where: { id: item2.id }, data: { accessLevel: "Quản trị" } });
  await reviewOnboardingItem(await actor("binh.tran"), (await task("binh.tran", "ON_ACCESS_REVIEW")).id, { decision: "APPROVE" }, now);
  await recordOnboardingProvision(await actor("dung.pham"), (await task("dung.pham", "PROVISION")).id, { accountChoice: "CREATED", accountIdentifier: "an.nguyen", result: "SUCCESS", evidenceRef: "Ticket: IT-1001" }, now);
  await reviewOnboardingItem(await actor("binh.tran"), (await task("binh.tran", "ON_ACCESS_REVIEW")).id, { decision: "APPROVE", reason: "Cần lập báo cáo" }, now);
  await reviewOnboardingItem(await actor("hai.vo"), (await task("hai.vo", "SECURITY_REVIEW")).id, { decision: "REJECT", reason: "Kế toán viên chỉ cần quyền xem" }, now);
  const dev = await task("dung.pham", "ON_DEVICE");
  const line = await db.onboardingDeviceItem.findFirstOrThrow({ where: { onboardingId: dev.objectId } });
  await recordDeviceMissing(await actor("dung.pham"), dev.id, line.id, { reason: "Kho hết laptop cấu hình kế toán" }, now);

  // Offboarding của Nam: đột xuất, MISA chưa thu hồi được, màn hình ngoại lệ
  const nam = await db.employee.findFirstOrThrow({ where: { fullName: "Hoàng Văn Nam" } });
  const chau = await db.employee.findFirstOrThrow({ where: { fullName: "Lê Minh Châu" } });
  const today = new Date(now.getTime() + 7 * 3600_000).toISOString().slice(0, 10);
  await createOffboarding(await actor("ha.le"), { employeeId: nam.id, lastWorkingDate: today, leaveReason: "VOLUNTARY", isUrgent: true, urgentReason: "Nghỉ gấp vì lý do gia đình", submissionKey: "demo-off-nam" }, now);
  const off = await db.offboardingRequest.findFirstOrThrow({ where: { employeeId: nam.id }, include: { revocations: true, deviceReturns: { include: { device: true } } } });
  await activateRevocation(db, off.id, now);
  const ht = await task("binh.tran", "OFF_HANDOVER");
  await saveHandoverPlan(await actor("binh.tran"), ht.id, [
    { title: "Sổ cái tháng 12", receiverId: chau.id, dueDate: today },
    { title: "Hồ sơ thuế quý 4", receiverId: chau.id, dueDate: today },
  ], now);
  const items = await db.handoverItem.findMany({ where: { offboardingId: off.id }, orderBy: { id: "asc" } });
  await updateHandoverItem(await actor("binh.tran"), ht.id, items[0].id, { status: "HANDED_OVER" }, now);
  const rt = await task("dung.pham", "OFF_REVOKE");
  for (const r of off.revocations) {
    if (r.accessName === "Phần mềm kế toán") await recordRevocation(await actor("dung.pham"), rt.id, r.id, { result: "NOT_REVOKED", failureReason: "Hệ thống MISA đang bảo trì" }, now);
    else await recordRevocation(await actor("dung.pham"), rt.id, r.id, { result: "DISABLED", evidenceRef: "Ticket: IT-2041" }, now);
  }
  const dt = await task("dung.pham", "OFF_DEVICE");
  const lt = off.deviceReturns.find((d) => d.device.assetCode === "LT-2025-0188")!;
  const mn = off.deviceReturns.find((d) => d.device.assetCode === "MN-2025-0042")!;
  await recordDeviceReturn(await actor("dung.pham"), dt.id, lt.id, { returnedAt: new Date(now.getTime() + 7 * 3600_000 - 3600_000).toISOString().slice(0, 16), condition: "GOOD" }, now);
  await recordDeviceReturnMissing(await actor("dung.pham"), dt.id, mn.id, { reason: "Màn hình để tại nhà", evidenceRef: "Ticket: IT-2042" }, now);
  await decideDeviceException(await actor("binh.tran"), (await task("binh.tran", "OFF_DEVICE_EXCEPTION")).id, { decision: "APPROVE_EXCEPTION", reason: "Đã trừ vào lương tháng cuối" }, now);
  console.log("demo state ready");
}
main().finally(() => db.$disconnect());
