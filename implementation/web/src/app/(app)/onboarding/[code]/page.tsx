// SCR-ON-02 – Chi tiết và tiến độ yêu cầu onboarding.
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { fmtDate, fmtDateTime, fmtDay } from "@/lib/dates";
import { CASE_STATUS, DEVICE_TYPE, HANDOVER_CONDITION, ON_ACCESS_STATUS, ON_DEVICE_STATUS, STEP_LABEL } from "@/lib/labels";
import { AuditTable, type AuditFilter } from "@/components/audit-table";
import { Alert, Breadcrumb, Card, EvidenceLink, Forbidden, OverdueBadge, SensitiveBadge, StatusBadge, Table, Tabs, Td } from "@/components/ui";
import { auditDenied, canViewAudit, canViewOnboarding } from "@/server/authz";
import { getNow } from "@/server/clock";
import { onboardingConditions } from "@/server/onboarding";
import { requireActor } from "@/server/session";
import { TASK_LABEL, overdueLabel } from "@/server/tasks";
import { TaskTable } from "@/components/task-table";
import { ChangeStartDateButton, ConfirmCompletionButton } from "./dialogs";

export default async function OnboardingDetail({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<AuditFilter & { tab?: string }>;
}) {
  const { code } = await params;
  const sp = await searchParams;
  const actor = await requireActor();
  const now = await getNow();
  const ob = await db.onboardingRequest.findUnique({
    where: { requestCode: code },
    include: {
      employee: { include: { jobTitle: true, department: true } },
      manager: true,
      hrUser: { include: { employee: true } },
      accessItems: {
        include: {
          access: { include: { system: true } },
          account: true,
          decisions: { include: { decidedBy: { include: { employee: true } } }, orderBy: { decidedAt: "asc" } },
        },
        orderBy: { sequenceNo: "asc" },
      },
      deviceItems: { include: { device: true, handedBy: { include: { employee: true } } }, orderBy: { id: "asc" } },
    },
  });
  if (!ob) notFound();
  if (!(await canViewOnboarding(actor, ob))) {
    await auditDenied(actor, `Mở ${code}`);
    return <Forbidden />;
  }
  const showAudit = canViewAudit(actor);
  const tab = sp.tab ?? "access";
  if (tab === "audit" && !showAudit) {
    await auditDenied(actor, `Mở lịch sử thao tác ${code}`);
    return <Forbidden />;
  }

  const itemIds = ob.accessItems.map((i) => i.id);
  const tasks = await db.task.findMany({
    where: {
      OR: [
        { objectType: "ONBOARDING_ACCESS_ITEM", objectId: { in: itemIds } },
        { objectType: "ONBOARDING_REQUEST", objectId: ob.id },
      ],
    },
    include: { assignee: { include: { employee: true } } },
    orderBy: { id: "asc" },
  });
  const openTasks = tasks.filter((t) => t.status === "OPEN" || t.status === "WAITING");
  const holderOf = (objectType: string, objectId: number) => openTasks.filter((t) => t.objectType === objectType && t.objectId === objectId).at(-1);
  const { missing } = onboardingConditions(ob);
  const isHrOwner = actor.role === "HR" && ob.hrUserId === actor.userId;
  const doneAccess = ob.accessItems.filter((i) => i.status === "COMPLETED" || i.status === "REJECTED").length;
  const doneDevices = ob.deviceItems.filter((d) => d.status === "HANDED_OVER").length;
  const overdueCount = openTasks.filter((t) => overdueLabel(t, now)).length;
  const completedLog = ob.status === "COMPLETED" ? await db.auditLog.findFirst({ where: { caseCode: code, action: "CONFIRM_COMPLETION", result: "SUCCESS" }, include: { actor: { include: { employee: true } } } }) : null;

  // Điều kiện chưa đạt kèm người đang giữ (US-ON-12 AC-3)
  const missingRows = [
    ...ob.accessItems
      .filter((i) => i.status !== "COMPLETED" && i.status !== "REJECTED")
      .map((i) => ({ label: i.access.name, status: i.status, statusMap: ON_ACCESS_STATUS, reason: i.blockedReason, task: holderOf("ONBOARDING_ACCESS_ITEM", i.id) })),
    ...ob.deviceItems
      .filter((d) => d.status !== "HANDED_OVER")
      .map((d) => ({
        label: `Thiết bị ${DEVICE_TYPE[d.deviceType]}`,
        status: d.status,
        statusMap: ON_DEVICE_STATUS,
        reason: d.waitingReason,
        task: openTasks.find((t) => t.taskType === "ON_DEVICE"),
      })),
  ];

  const tabs = [
    { key: "access", label: `Quyền (${ob.accessItems.length})`, href: `?tab=access` },
    { key: "devices", label: `Thiết bị (${ob.deviceItems.length})`, href: `?tab=devices` },
    { key: "tasks", label: `Nhiệm vụ (${tasks.length})`, href: `?tab=tasks` },
    ...(showAudit ? [{ key: "audit", label: "Lịch sử thao tác", href: `?tab=audit` }] : []),
  ];

  return (
    <>
      <Breadcrumb items={[{ label: "Onboarding", href: "/onboarding" }, { label: code }]} />
      <div className="space-y-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-xl">
                <span className="font-semibold">{ob.requestCode}</span> <span className="ml-2">{ob.employee.fullName}</span>
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {ob.employee.jobTitle.name} · {ob.employee.department.name} · Bắt đầu {fmtDate(ob.startDate)}
                {ob.originalStartDate && <span className="text-gray-500"> (đã đổi từ {fmtDate(ob.originalStartDate)})</span>}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Manager: {ob.manager.fullName} · HR phụ trách: {ob.hrUser.employee.fullName} · Tạo {fmtDay(ob.createdAt)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <StatusBadge map={CASE_STATUS} value={ob.status} />
              {isHrOwner && ob.status !== "COMPLETED" && (
                <div className="flex gap-2">
                  <ChangeStartDateButton onboardingId={ob.id} current={fmtDate(ob.startDate)} />
                  {ob.status === "PENDING_HR_CONFIRMATION" && (
                    <ConfirmCompletionButton
                      onboardingId={ob.id}
                      code={ob.requestCode}
                      subtitle={`${ob.employee.fullName} · Bắt đầu ${fmtDate(ob.startDate)}`}
                      rows={[
                        ...ob.accessItems.map((i) => ({
                          ok: i.status === "COMPLETED",
                          label: i.access.name,
                          value: i.status === "REJECTED" ? `REJECTED – “${i.blockedReason ?? ""}”` : i.status,
                        })),
                        ...ob.deviceItems.map((d) => ({
                          ok: true,
                          label: DEVICE_TYPE[d.deviceType],
                          value: `Đã bàn giao ${fmtDay(d.handedOverAt)}`,
                        })),
                      ]}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>

        {ob.status === "PENDING_CONDITIONS" && (
          <Alert tone="warning" title="Chưa đủ điều kiện hoàn tất">
            <ul className="mt-2 space-y-3">
              {missingRows.map((m, i) => (
                <li key={i}>
                  <p>
                    • <span className="font-semibold">{m.label}:</span> <StatusBadge map={m.statusMap} value={m.status} /> {m.reason}
                  </p>
                  {m.task && (
                    <p className="ml-3 text-xs text-gray-600">
                      Đang chờ: {m.task.assignee.employee.fullName} ({TASK_LABEL[m.task.taskType].toLowerCase()}) · Hạn {fmtDay(m.task.dueAt)}{" "}
                      <OverdueBadge label={overdueLabel(m.task, now)} />
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </Alert>
        )}
        {ob.status === "PENDING_HR_CONFIRMATION" && (
          <Alert tone="info" title="Đã đủ điều kiện, chờ HR xác nhận hoàn tất">
            <ul className="mt-1 list-disc pl-6">
              {ob.accessItems.map((i) => (
                <li key={i.id}>
                  {i.access.name}: {i.status}
                  {i.status === "REJECTED" && ` – “${i.blockedReason}”`}
                </li>
              ))}
              {ob.deviceItems.map((d) => (
                <li key={d.id}>
                  {DEVICE_TYPE[d.deviceType]}: đã bàn giao {fmtDay(d.handedOverAt)}
                </li>
              ))}
            </ul>
          </Alert>
        )}
        {ob.status === "COMPLETED" && (
          <Alert tone="success" title={`Đã hoàn tất ngày ${fmtDay(ob.completedAt)} bởi ${completedLog?.actor?.employee.fullName ?? ob.hrUser.employee.fullName}`} />
        )}

        <Card className="py-4">
          <div className="flex flex-wrap gap-10 text-sm">
            <span className="font-semibold">Tiến độ</span>
            <span>
              <span className="text-gray-500">Quyền</span> <b>{doneAccess}/{ob.accessItems.length} xong</b>
            </span>
            <span>
              <span className="text-gray-500">Thiết bị</span> <b>{doneDevices}/{ob.deviceItems.length} đã bàn giao</b>
            </span>
            <span>
              <span className="text-gray-500">Nhiệm vụ quá hạn</span> <b className={overdueCount ? "text-red-600" : ""}>{overdueCount}</b>
            </span>
            {missing.length === 0 && ob.status !== "COMPLETED" && <span className="text-green-700">Đủ điều kiện</span>}
          </div>
        </Card>

        <Card>
          <Tabs tabs={tabs} active={tab} />
          {tab === "access" && (
            <Table head={["#", "Quyền", "Hệ thống", "Mức", "Phân loại", "Trạng thái", "Đang giữ / Hạn"]}>
              {ob.accessItems.map((i, idx) => {
                const t = holderOf("ONBOARDING_ACCESS_ITEM", i.id);
                const prev = ob.accessItems.slice(0, idx).findLast((p) => p.status !== "COMPLETED" && p.status !== "REJECTED");
                const od = t ? overdueLabel(t, now) : null;
                return (
                  <tr key={i.id} className={i.status === "BLOCKED" ? "bg-red-50/40" : ""}>
                    <Td>{i.sequenceNo}</Td>
                    <Td>
                      <details>
                        <summary className="cursor-pointer">{i.access.name}</summary>
                        <div className="mt-2 space-y-1 text-xs text-gray-600">
                          {i.blockedReason && (
                            <p>
                              <b>Lý do:</b> {i.blockedReason}
                            </p>
                          )}
                          {i.status === "COMPLETED" && (
                            <p>
                              Tài khoản: {i.account?.accountIdentifier} · Bằng chứng: <EvidenceLink value={i.evidenceRef} />
                            </p>
                          )}
                          <p className="font-medium text-gray-500">Lịch sử quyết định</p>
                          {i.decisions.length === 0 && <p>Chưa có quyết định.</p>}
                          {i.decisions.map((d) => (
                            <p key={d.id}>
                              {fmtDateTime(d.decidedAt)} · {d.decidedBy.employee.fullName} ({d.approverRole === "MANAGER" ? "Manager" : "Security"}) ·{" "}
                              {d.decision === "APPROVE" ? `Phê duyệt – mức ${d.accessLevel}` : `Từ chối – “${d.reason}”`}
                            </p>
                          ))}
                        </div>
                      </details>
                      {i.access.isSensitive && (
                        <div className="mt-1">
                          <SensitiveBadge />
                        </div>
                      )}
                    </Td>
                    <Td>{i.access.system.name}</Td>
                    <Td>{i.accessLevel}</Td>
                    <Td>{i.isMandatory ? "Bắt buộc" : "Không bắt buộc"}</Td>
                    <Td>
                      <div className="flex flex-col items-start gap-1">
                        <StatusBadge map={ON_ACCESS_STATUS} value={i.status} suffix={i.status === "IN_PROGRESS" && i.currentStep ? STEP_LABEL[i.currentStep] : undefined} />
                        <OverdueBadge label={od} />
                      </div>
                    </Td>
                    <Td className={od ? "text-red-600" : ""}>
                      {t ? (
                        <>
                          {t.assignee.employee.fullName}
                          {t.taskType === "ON_ACCESS_ADJUST" && " (điều chỉnh)"}
                          <br />
                          <span className="text-xs">Hạn {fmtDay(t.dueAt)}</span>
                        </>
                      ) : i.status === "WAITING" && prev ? (
                        <span className="text-gray-500">Chờ quyền #{prev.sequenceNo}</span>
                      ) : (
                        "–"
                      )}
                    </Td>
                  </tr>
                );
              })}
            </Table>
          )}
          {tab === "devices" && (
            <Table head={["Loại", "Trạng thái", "Lý do chờ", "Mã thiết bị", "Bàn giao", "Tình trạng", "Biên bản", "Người giao"]}>
              {ob.deviceItems.map((d) => (
                <tr key={d.id}>
                  <Td>
                    {DEVICE_TYPE[d.deviceType]}
                    {d.configNote && <p className="text-xs text-gray-500">{d.configNote}</p>}
                  </Td>
                  <Td>
                    <StatusBadge map={ON_DEVICE_STATUS} value={d.status} />
                  </Td>
                  <Td>{d.waitingReason ?? "–"}</Td>
                  <Td>{d.device?.assetCode ?? "–"}</Td>
                  <Td>{fmtDateTime(d.handedOverAt)}</Td>
                  <Td>{d.deviceCondition ? HANDOVER_CONDITION[d.deviceCondition] : "–"}</Td>
                  <Td>
                    {d.handoverRecordCode ?? "–"} {d.handoverRecordFile && <EvidenceLink value={d.handoverRecordFile} />}
                  </Td>
                  <Td>{d.handedBy?.employee.fullName ?? "–"}</Td>
                </tr>
              ))}
            </Table>
          )}
          {tab === "tasks" && <TaskTable tasks={tasks} now={now} />}
          {tab === "audit" && <AuditTable caseCode={code} filter={sp} baseHref={`/onboarding/${code}?tab=audit`} />}
        </Card>
      </div>
    </>
  );
}
