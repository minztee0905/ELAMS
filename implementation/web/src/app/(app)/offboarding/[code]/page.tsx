// SCR-OFF-02 – Chi tiết yêu cầu offboarding.
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { fmtDate, fmtDateTime, fmtDay, fmtTimeDate, toDateInput, vnDateOnly } from "@/lib/dates";
import { CASE_STATUS, DEVICE_RETURN_STATUS, DEVICE_TYPE, HANDOVER_STATUS, LEAVE_REASON, RETURN_CONDITION, REVOCATION_STATUS } from "@/lib/labels";
import { AuditTable, type AuditFilter } from "@/components/audit-table";
import { TaskTable } from "@/components/task-table";
import { Alert, Breadcrumb, Card, EvidenceLink, Forbidden, OverdueBadge, StatusBadge, Table, Tabs, Td, UrgentBadge } from "@/components/ui";
import { auditDenied, canViewAudit, canViewOffboarding } from "@/server/authz";
import { getNow } from "@/server/clock";
import { offboardingConditions } from "@/server/offboarding";
import { requireActor } from "@/server/session";
import { TASK_LABEL, overdueLabel } from "@/server/tasks";
import { ConfirmCompletionButton } from "../../onboarding/[code]/dialogs";
import { confirmOffboardingAction } from "../actions";
import { ChangeLastDayButton, MarkUrgentButton } from "./dialogs";

export default async function OffboardingDetail({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<AuditFilter & { tab?: string; msg?: string }>;
}) {
  const { code } = await params;
  const sp = await searchParams;
  const actor = await requireActor();
  const now = await getNow();
  const off = await db.offboardingRequest.findUnique({
    where: { requestCode: code },
    include: {
      employee: { include: { jobTitle: true, department: true, manager: true } },
      hrUser: { include: { employee: true } },
      handoverItems: { include: { receiver: true, updatedBy: { include: { employee: true } } }, orderBy: { id: "asc" } },
      revocations: { include: { system: true, account: true }, orderBy: { id: "asc" } },
      deviceReturns: { include: { device: true, exceptionBy: { include: { employee: true } } }, orderBy: { id: "asc" } },
    },
  });
  if (!off) notFound();
  if (!(await canViewOffboarding(actor, off))) {
    await auditDenied(actor, `Mở ${code}`);
    return <Forbidden />;
  }
  const showAudit = canViewAudit(actor);
  const tab = sp.tab ?? "handover";
  if (tab === "audit" && !showAudit) {
    await auditDenied(actor, `Mở lịch sử thao tác ${code}`);
    return <Forbidden />;
  }
  const deviceItemIds = off.deviceReturns.map((d) => d.id);
  const tasks = await db.task.findMany({
    where: { OR: [{ objectType: "OFFBOARDING_REQUEST", objectId: off.id }, { objectType: "DEVICE_RETURN_ITEM", objectId: { in: deviceItemIds } }] },
    include: { assignee: { include: { employee: true } } },
    orderBy: { id: "asc" },
  });
  const open = tasks.filter((t) => t.status === "OPEN" || t.status === "WAITING");
  const byType = (type: string) => open.find((t) => t.taskType === type);
  const isHrOwner = actor.role === "HR" && off.hrUserId === actor.userId;
  const { missing } = offboardingConditions(off);
  const revokeStarted = now >= off.revokeAt;
  const completedLog =
    off.status === "COMPLETED"
      ? await db.auditLog.findFirst({ where: { caseCode: code, action: "CONFIRM_COMPLETION", result: "SUCCESS" }, include: { actor: { include: { employee: true } } } })
      : null;
  const revLogs = await db.auditLog.findMany({
    where: { objectType: "REVOCATION_ITEM", objectId: { in: off.revocations.map((r) => r.id) } },
    include: { actor: { include: { employee: true } } },
    orderBy: { id: "asc" },
  });

  const holder = (label: string) => {
    if (label === "Bàn giao công việc") return byType("OFF_HANDOVER");
    if (label.startsWith("Thiết bị")) return byType("OFF_DEVICE_EXCEPTION") ?? byType("OFF_DEVICE");
    return byType("OFF_REVOKE");
  };
  const hDone = off.handoverItems.filter((h) => h.status === "HANDED_OVER").length;
  const rDone = off.revocations.filter((x) => x.status === "REVOKED" || x.status === "DISABLED").length;
  const dRet = off.deviceReturns.filter((d) => d.status === "RETURNED").length;
  const dEx = off.deviceReturns.filter((d) => d.status === "EXCEPTION_NOT_RETURNED").length;

  const tabs = [
    { key: "handover", label: "Bàn giao", href: "?tab=handover" },
    { key: "revoke", label: "Thu hồi quyền", href: "?tab=revoke" },
    { key: "devices", label: "Thu hồi thiết bị", href: "?tab=devices" },
    { key: "tasks", label: "Nhiệm vụ", href: "?tab=tasks" },
    ...(showAudit ? [{ key: "audit", label: "Lịch sử", href: "?tab=audit" }] : []),
  ];

  return (
    <>
      <Breadcrumb items={[{ label: "Offboarding", href: "/offboarding" }, { label: code }]} />
      <div className="space-y-5">
        {sp.msg && <Alert tone="success" title={sp.msg} />}
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl">
                <span className="font-semibold">{off.requestCode}</span> <span className="ml-2">{off.employee.fullName}</span>
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {off.employee.jobTitle.name} · {off.employee.department.name} · Ngày cuối {fmtDate(off.lastWorkingDate)}
                {off.originalLastWorkingDate && <span className="text-gray-500"> (đã đổi từ {fmtDate(off.originalLastWorkingDate)})</span>} · {LEAVE_REASON[off.leaveReason]}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Thu hồi quyền: {off.isUrgent ? `Đột xuất từ ${fmtTimeDate(off.revokeAt)}` : fmtTimeDate(off.revokeAt)} · Hạn {fmtTimeDate(off.revokeDueAt)}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Manager: {off.employee.manager?.fullName ?? "–"} · HR phụ trách: {off.hrUser.employee.fullName}
                {off.urgentReason && ` · Lý do đột xuất: ${off.urgentReason}`}
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex gap-1">
                {off.isUrgent && <UrgentBadge />}
                <StatusBadge map={CASE_STATUS} value={off.status} />
              </div>
              {isHrOwner && off.status !== "COMPLETED" && (
                <div className="flex gap-2">
                  <ChangeLastDayButton offboardingId={off.id} current={fmtDate(off.lastWorkingDate)} today={toDateInput(vnDateOnly(now))} />
                  {!off.isUrgent && !revokeStarted && <MarkUrgentButton offboardingId={off.id} />}
                  {off.status === "PENDING_HR_CONFIRMATION" && (
                    <ConfirmCompletionButton
                      onboardingId={off.id}
                      idField="offboardingId"
                      kind="offboarding"
                      action={confirmOffboardingAction}
                      code={off.requestCode}
                      subtitle={`${off.employee.fullName} · Ngày cuối ${fmtDate(off.lastWorkingDate)}`}
                      rows={[
                        { ok: true, label: "Bàn giao", value: `Xác nhận ${fmtDateTime(off.handoverConfirmedAt)}` },
                        ...off.revocations.map((r) => ({ ok: true, label: r.accessName, value: REVOCATION_STATUS[r.status][0] })),
                        ...off.deviceReturns.map((d) => ({
                          ok: d.status === "RETURNED",
                          label: d.device.assetCode,
                          value: d.status === "RETURNED" ? "Đã thu hồi" : `Ngoại lệ – ${d.exceptionBy?.employee.fullName}: ${d.exceptionReason}`,
                        })),
                      ]}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>

        {off.status === "PENDING_CONDITIONS" && (
          <Alert tone="warning" title="Chưa đủ điều kiện hoàn tất">
            <ul className="mt-2 space-y-2">
              {missing.map((m, i) => {
                const t = holder(m.label);
                return (
                  <li key={i}>
                    • <b>{m.label}</b>: {REVOCATION_STATUS[m.status]?.[0] ?? DEVICE_RETURN_STATUS[m.status]?.[0] ?? m.status}
                    {m.reason && ` – “${m.reason}”`}
                    {t && (
                      <span className="ml-2 text-xs text-gray-600">
                        Đang chờ: {t.assignee.employee.fullName} <OverdueBadge label={overdueLabel(t, now)} />
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </Alert>
        )}
        {off.status === "PENDING_HR_CONFIRMATION" && (
          <Alert tone="info" title="Đủ điều kiện, chờ HR xác nhận hoàn tất">
            Bàn giao xác nhận {fmtDateTime(off.handoverConfirmedAt)} · Quyền {rDone}/{off.revocations.length} đã thu hồi · Thiết bị {dRet} đã thu hồi
            {dEx > 0 &&
              `, ${dEx} theo ngoại lệ (${off.deviceReturns
                .filter((d) => d.status === "EXCEPTION_NOT_RETURNED")
                .map((d) => `${d.device.assetCode} – duyệt bởi ${d.exceptionBy?.employee.fullName}`)
                .join("; ")})`}
          </Alert>
        )}
        {off.status === "COMPLETED" && <Alert tone="success" title={`Đã hoàn tất ngày ${fmtDay(off.completedAt)} bởi ${completedLog?.actor?.employee.fullName ?? off.hrUser.employee.fullName}`} />}

        <Card className="py-4">
          <div className="flex flex-wrap gap-10 text-sm">
            <span className="font-semibold">Tiến độ</span>
            <span>
              Bàn giao {hDone}/{off.handoverItems.length} {off.handoverConfirmedAt ? "✓" : ""}
            </span>
            <span>
              Quyền {rDone}/{off.revocations.length}
            </span>
            <span>
              Thiết bị {dRet + dEx}/{off.deviceReturns.length}
              {dEx > 0 && ` (${dEx} ngoại lệ)`}
            </span>
            <span>
              Nhiệm vụ quá hạn <b className={open.some((t) => overdueLabel(t, now)) ? "text-red-600" : ""}>{open.filter((t) => overdueLabel(t, now)).length}</b>
            </span>
          </div>
        </Card>

        <Card>
          <Tabs tabs={tabs} active={tab} />
          {tab === "handover" && (
            <>
              <Table head={["Hạng mục", "Người nhận", "Hạn", "Trạng thái", "Cập nhật"]} empty={off.handoverItems.length ? undefined : "Manager chưa lập kế hoạch bàn giao."}>
                {off.handoverItems.map((h) => (
                  <tr key={h.id}>
                    <Td>
                      {h.title}
                      {h.notMetReason && <p className="text-xs text-red-600">Lý do chưa đạt: {h.notMetReason}</p>}
                    </Td>
                    <Td>{h.receiver.fullName}</Td>
                    <Td>{fmtDate(h.dueDate)}</Td>
                    <Td>
                      <StatusBadge map={HANDOVER_STATUS} value={h.status} />
                    </Td>
                    <Td className="text-xs text-gray-600">
                      {h.updatedBy?.employee.fullName} · {fmtDateTime(h.updatedAt)}
                    </Td>
                  </tr>
                ))}
              </Table>
              <p className="mt-3 text-sm text-gray-600">
                {off.handoverConfirmedAt ? `Manager đã xác nhận bàn giao đầy đủ lúc ${fmtDateTime(off.handoverConfirmedAt)}.` : "Manager chưa xác nhận bàn giao."}
              </p>
            </>
          )}
          {tab === "revoke" && (
            <Table head={["#", "Quyền", "Hệ thống", "Tài khoản", "Nguồn", "Trạng thái"]} empty={off.revocations.length ? undefined : "Không có quyền nào trong sổ quyền."}>
              {off.revocations.map((r, i) => (
                <tr key={r.id}>
                  <Td>{i + 1}</Td>
                  <Td>
                    <details>
                      <summary className="cursor-pointer">
                        {r.accessName}
                        {r.accessLevel && r.accessLevel !== "Người dùng" ? ` – ${r.accessLevel}` : ""}
                      </summary>
                      <div className="mt-1 space-y-0.5 text-xs text-gray-600">
                        {revLogs
                          .filter((l) => l.objectId === r.id)
                          .map((l) => (
                            <p key={l.id}>
                              {fmtDateTime(l.createdAt)} · {l.actor?.employee.fullName} · {l.result === "SUCCESS" ? "Thành công" : "Chưa thu hồi được"} · {l.reason}
                            </p>
                          ))}
                        {r.evidenceRef && (
                          <p>
                            Bằng chứng: <EvidenceLink value={r.evidenceRef} />
                          </p>
                        )}
                      </div>
                    </details>
                  </Td>
                  <Td>{r.system.name}</Td>
                  <Td>{r.account?.accountIdentifier ?? "–"}</Td>
                  <Td>{r.source === "ELAMS" ? "ELAMS" : "IT bổ sung"}</Td>
                  <Td>
                    <StatusBadge map={REVOCATION_STATUS} value={r.status} />
                    {r.failureReason && r.status === "NOT_REVOKED" && <p className="mt-1 text-xs text-red-600">{r.failureReason}</p>}
                  </Td>
                </tr>
              ))}
            </Table>
          )}
          {tab === "devices" && (
            <Table head={["Mã tài sản", "Loại", "Trạng thái", "Chi tiết"]} empty={off.deviceReturns.length ? undefined : "Nhân viên không giữ thiết bị nào."}>
              {off.deviceReturns.map((d) => (
                <tr key={d.id}>
                  <Td>{d.device.assetCode}</Td>
                  <Td>{DEVICE_TYPE[d.device.deviceType]}</Td>
                  <Td>
                    <StatusBadge map={DEVICE_RETURN_STATUS} value={d.status} />
                  </Td>
                  <Td className="text-sm text-gray-700">
                    {d.status === "RETURNED" && `${fmtDateTime(d.returnedAt)} · ${RETURN_CONDITION[d.deviceCondition!]}`}
                    {d.status === "MISSING_PENDING_DECISION" && `${d.missingReason} · chờ Manager quyết định`}
                    {d.status === "EXCEPTION_NOT_RETURNED" && `Duyệt bởi ${d.exceptionBy?.employee.fullName} · ${fmtDateTime(d.exceptionAt)} · “${d.exceptionReason}”`}
                  </Td>
                </tr>
              ))}
            </Table>
          )}
          {tab === "tasks" && <TaskTable tasks={tasks} now={now} />}
          {tab === "audit" && <AuditTable caseCode={code} filter={sp} baseHref={`/offboarding/${code}?tab=audit`} />}
          {tab === "tasks" && open.length > 0 && <p className="mt-3 text-xs text-gray-500">{open.map((t) => `${TASK_LABEL[t.taskType]}: ${t.assignee.employee.fullName}`).join(" · ")}</p>}
        </Card>
      </div>
    </>
  );
}
