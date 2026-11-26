// SCR-AC-03 – Chi tiết yêu cầu cấp quyền.
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { fmtDate, fmtDateTime, fmtDay } from "@/lib/dates";
import { AR_STATUS } from "@/lib/labels";
import { AuditTable, type AuditFilter } from "@/components/audit-table";
import { Alert, Breadcrumb, Card, EvidenceLink, Forbidden, KV, LinkButton, SectionTitle, SensitiveBadge, StatusBadge, Tabs, cx } from "@/components/ui";
import { auditDenied, canViewAccessRequest, canViewAudit } from "@/server/authz";
import { parseLevels } from "@/server/ledger";
import { requireActor } from "@/server/session";
import { NeedInfoForm } from "./forms";

export default async function AccessRequestDetail({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<AuditFilter & { tab?: string; msg?: string }>;
}) {
  const { code } = await params;
  const sp = await searchParams;
  const actor = await requireActor();
  const ar = await db.accessRequest.findUnique({
    where: { requestCode: code },
    include: {
      access: { include: { system: true } },
      requester: { include: { department: true } },
      approver: true,
      account: true,
      decisions: { include: { decidedBy: { include: { employee: true } } }, orderBy: { decidedAt: "asc" } },
    },
  });
  if (!ar) notFound();
  if (!(await canViewAccessRequest(actor, ar))) {
    await auditDenied(actor, `Mở ${code}`);
    return <Forbidden />;
  }
  const tab = sp.tab ?? "info";
  const showAudit = canViewAudit(actor);
  if (tab === "audit" && !showAudit) {
    await auditDenied(actor, `Mở lịch sử thao tác ${code}`);
    return <Forbidden />;
  }
  const isRequester = ar.requesterId === actor.employeeId;
  const tasks = await db.task.findMany({ where: { objectType: "ACCESS_REQUEST", objectId: ar.id }, include: { assignee: { include: { employee: true } } }, orderBy: { id: "asc" } });
  const open = tasks.filter((t) => t.status === "OPEN" || t.status === "WAITING");
  const myOpen = open.find((t) => t.assigneeId === actor.userId && t.taskType !== "AR_NEED_INFO");
  const lastDecision = ar.decisions.at(-1);
  const logs = await db.auditLog.findMany({ where: { caseCode: code, action: { in: ["CREATE_REQUEST", "RESUBMIT", "GRANT", "CANCEL"] } }, include: { actor: { include: { employee: true } } }, orderBy: { id: "asc" } });

  // Tiến trình: gửi, mọi lần duyệt, cấp quyền (US-AC-03 AC-4, US-AC-05 AC-2)
  type Step = { icon: string; title: string; who: string; when: Date | null; note?: string | null; tone: "done" | "warn" | "fail" | "todo" };
  const steps: Step[] = [];
  for (const l of logs.filter((l) => l.action !== "GRANT" || l.result === "SUCCESS")) {
    if (l.action === "CREATE_REQUEST") steps.push({ icon: "✓", title: "Gửi yêu cầu", who: l.actor?.employee.fullName ?? "", when: l.createdAt, tone: "done" });
    if (l.action === "RESUBMIT") steps.push({ icon: "✓", title: "Gửi lại", who: l.actor?.employee.fullName ?? "", when: l.createdAt, note: l.reason, tone: "done" });
    if (l.action === "CANCEL") steps.push({ icon: "✕", title: "Hủy yêu cầu", who: l.actor?.employee.fullName ?? "", when: l.createdAt, tone: "fail" });
    if (l.action === "GRANT") steps.push({ icon: "✓", title: "IT cấp quyền", who: l.actor?.employee.fullName ?? "", when: l.createdAt, tone: "done" });
  }
  for (const d of ar.decisions) {
    steps.push({
      icon: d.decision === "APPROVE" ? "✓" : d.decision === "REJECT" ? "✕" : "⚠",
      title: `${d.approverRole === "MANAGER" ? "Manager" : "Security"} · ${d.decision === "APPROVE" ? "Phê duyệt" : d.decision === "REJECT" ? "Từ chối" : "Yêu cầu bổ sung"}`,
      who: d.decidedBy.employee.fullName,
      when: d.decidedAt,
      note: d.reason,
      tone: d.decision === "APPROVE" ? "done" : d.decision === "REJECT" ? "fail" : "warn",
    });
  }
  steps.sort((a, b) => (a.when?.getTime() ?? 0) - (b.when?.getTime() ?? 0));
  if (["PENDING_MANAGER", "PENDING_SECURITY", "PENDING_PROVISION", "NEED_INFO"].includes(ar.status)) {
    const remaining = ar.status === "PENDING_MANAGER" || ar.status === "NEED_INFO" ? (ar.access.isSensitive ? ["Manager", "Security", "IT cấp quyền"] : ["Manager", "IT cấp quyền"]) : ar.status === "PENDING_SECURITY" ? ["Security", "IT cấp quyền"] : ["IT cấp quyền"];
    for (const r of remaining) steps.push({ icon: "○", title: r, who: "", when: null, tone: "todo" });
  }
  const pendingTask = open.find((t) => t.taskType !== "AR_NEED_INFO");

  return (
    <>
      <Breadcrumb items={[{ label: "Quyền truy cập", href: "/access-requests" }, { label: code }]} />
      <div className="max-w-5xl space-y-5">
        {sp.msg && <Alert tone="success" title={sp.msg} />}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl">
                <span className="font-semibold">{ar.requestCode}</span> <span className="ml-2">{ar.access.name} · mức {ar.accessLevel}</span>
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Người yêu cầu: {ar.requester.fullName} · {ar.requester.department.name} · Gửi {fmtDay(ar.createdAt)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge map={AR_STATUS} value={ar.status} />
              {myOpen && <LinkButton href={`/tasks?task=${myOpen.id}`}>Mở trong Việc cần làm</LinkButton>}
            </div>
          </div>
        </Card>

        {(ar.status === "PENDING_MANAGER" || ar.status === "PENDING_SECURITY") && pendingTask && (
          <Alert tone="info" title={`Đang chờ ${pendingTask.assignee.employee.fullName}, hạn ${fmtDay(pendingTask.dueAt)}`} />
        )}
        {ar.status === "NEED_INFO" && lastDecision && (
          <Alert tone="warning" title={`${lastDecision.decidedBy.employee.fullName} yêu cầu bổ sung (${fmtDateTime(lastDecision.decidedAt)}):`}>
            “{lastDecision.reason}”
          </Alert>
        )}
        {ar.status === "PENDING_PROVISION" && <Alert tone="info" title="IT đang xử lý" />}
        {ar.status === "GRANTED" && (
          <Alert tone="success" title="Đã cấp quyền">
            Tài khoản {ar.account?.accountIdentifier} · {fmtDateTime(logs.find((l) => l.action === "GRANT")?.createdAt)}
          </Alert>
        )}
        {ar.status === "REJECTED" && lastDecision && (
          <Alert tone="error" title={`Bị từ chối bởi ${lastDecision.decidedBy.employee.fullName} · ${fmtDateTime(lastDecision.decidedAt)}`}>
            “{lastDecision.reason}”
          </Alert>
        )}
        {ar.status === "CANCELLED" && <Alert tone="info" title={`Đã hủy ${fmtDateTime(logs.find((l) => l.action === "CANCEL")?.createdAt)}`} />}

        <Card>
          {showAudit && (
            <Tabs
              tabs={[
                { key: "info", label: "Thông tin", href: "?tab=info" },
                { key: "audit", label: "Lịch sử thao tác", href: "?tab=audit" },
              ]}
              active={tab}
            />
          )}
          {tab === "audit" ? (
            <AuditTable caseCode={code} filter={sp} baseHref={`/access-requests/${code}?tab=audit`} />
          ) : (
            <div className="grid gap-8 md:grid-cols-[1fr_300px]">
              <div>
                <SectionTitle>Thông tin yêu cầu</SectionTitle>
                {ar.status === "NEED_INFO" && isRequester ? (
                  <NeedInfoForm requestId={ar.id} code={ar.requestCode} levels={parseLevels(ar.access.accessLevels)} level={ar.accessLevel} reason={ar.reason} accessName={ar.access.name} />
                ) : (
                  <dl>
                    <KV label="Quyền">
                      {ar.access.name} {ar.access.isSensitive && <SensitiveBadge />}
                    </KV>
                    <KV label="Hệ thống">
                      {ar.access.system.name} · {ar.access.isSensitive ? "Nhạy cảm" : "Không nhạy cảm"}
                    </KV>
                    <KV label="Mức quyền">{ar.accessLevel}</KV>
                    <KV label="Lý do">{ar.reason}</KV>
                    <KV label="Ngày cần">{fmtDate(ar.neededBy)}</KV>
                    <KV label="Tệp">
                      <EvidenceLink value={ar.attachment} />
                    </KV>
                    <KV label="Người duyệt">{ar.approver.fullName}</KV>
                  </dl>
                )}
              </div>
              <div>
                <SectionTitle>Tiến trình</SectionTitle>
                <ol className="space-y-3">
                  {steps.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span
                        className={cx(
                          "mt-0.5 w-4 text-center",
                          s.tone === "done" && "text-green-600",
                          s.tone === "warn" && "text-amber-600",
                          s.tone === "fail" && "text-red-600",
                          s.tone === "todo" && "text-gray-400",
                        )}
                      >
                        {s.icon}
                      </span>
                      <div>
                        <p className={s.tone === "todo" ? "text-gray-400" : "font-medium"}>
                          {s.title} {s.when && <span className="font-normal text-gray-500">{fmtDateTime(s.when)}</span>}
                        </p>
                        {s.who && <p className="text-gray-600">{s.who}</p>}
                        {s.note && <p className="text-gray-500">“{s.note}”</p>}
                      </div>
                    </li>
                  ))}
                </ol>
                {isRequester && ar.status === "PENDING_PROVISION" && <p className="mt-3 text-xs text-gray-500">Chi tiết xử lý của IT không hiển thị cho người yêu cầu.</p>}
              </div>
            </div>
          )}
        </Card>
        {!isRequester && actor.role === "MANAGER" && ar.approverId === actor.employeeId && !myOpen && ar.status === "PENDING_MANAGER" && (
          <p className="text-sm text-gray-500">
            Nhiệm vụ duyệt của bạn nằm ở <Link href="/tasks" className="text-blue-600">Việc cần làm</Link>.
          </p>
        )}
      </div>
    </>
  );
}
