// SCR-ON-04 – Xử lý nhiệm vụ cấp quyền (dùng chung cho Access Request).
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { fmtDate, fmtDateTime, fmtDay } from "@/lib/dates";
import { MSG } from "@/lib/errors";
import { Alert, Breadcrumb, Card, EvidenceLink, Forbidden, KV, OverdueBadge, SectionTitle, SensitiveBadge } from "@/components/ui";
import { auditDenied } from "@/server/authz";
import { getNow } from "@/server/clock";
import { requireActor } from "@/server/session";
import { overdueLabel } from "@/server/tasks";
import { ProvisionForm, RetryButton, RevokeInvalidForm } from "../forms";

export default async function ProvisionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const actor = await requireActor();
  const now = await getNow();
  const task = await db.task.findUnique({ where: { id: Number(id) } });
  if (!task || task.taskType !== "PROVISION") notFound();
  if (task.assigneeId !== actor.userId) {
    await auditDenied(actor, `Mở nhiệm vụ cấp quyền #${id}`);
    return <Forbidden />;
  }

  const ob = task.objectType === "ONBOARDING_ACCESS_ITEM";
  const item = ob
    ? await db.onboardingAccessItem.findUniqueOrThrow({
        where: { id: task.objectId },
        include: {
          access: { include: { system: true } },
          onboarding: { include: { employee: { include: { jobTitle: true } }, accessItems: true } },
          decisions: { include: { decidedBy: { include: { employee: true } } }, orderBy: { decidedAt: "asc" } },
          account: true,
        },
      })
    : null;
  const ar = !ob
    ? await db.accessRequest.findUniqueOrThrow({
        where: { id: task.objectId },
        include: {
          access: { include: { system: true } },
          requester: { include: { jobTitle: true } },
          decisions: { include: { decidedBy: { include: { employee: true } } }, orderBy: { decidedAt: "asc" } },
          account: true,
        },
      })
    : null;

  const access = (item ?? ar)!.access;
  const employee = item ? item.onboarding.employee : ar!.requester;
  const caseCode = item ? item.onboarding.requestCode : ar!.requestCode;
  const caseHref = item ? `/onboarding/${caseCode}` : `/access-requests/${caseCode}`;
  const approvals = ((item ?? ar)!.decisions as { id: number; decision: string; approverRole: string; decidedAt: Date; round: number; decidedBy: { employee: { fullName: string } } }[]).filter(
    (d) => d.decision === "APPROVE" && (!item || d.round === item.approvalRound),
  );
  const account = await db.systemAccount.findUnique({ where: { employeeId_systemId: { employeeId: employee.id, systemId: access.systemId } } });
  let existing: { identifier: string; since: string } | null = null;
  if (account) {
    const firstGrant = await db.accessGrant.findFirst({ where: { accountId: account.id }, include: { access: true }, orderBy: { grantedAt: "asc" } });
    existing = {
      identifier: account.accountIdentifier,
      since: firstGrant ? `tạo khi cấp quyền ${firstGrant.access?.name ?? ""} ngày ${fmtDay(firstGrant.grantedAt)}` : `ghi nhận ngày ${fmtDay(account.createdAt)}`,
    };
  }

  const isDone = task.status === "DONE" || task.status === "CANCELLED";
  const blockedKind = item?.status === "BLOCKED" ? item.blockedKind : null;

  return (
    <>
      <Breadcrumb items={[{ label: "Việc cần làm", href: "/tasks" }, { label: `Cấp quyền · ${access.name} · ${employee.fullName}` }]} />
      <div className="max-w-4xl space-y-5">
        {blockedKind === "PROVISION_FAILED" && (
          <Alert tone="error" title="Quyền đang BLOCKED">
            <p>{item!.blockedReason}</p>
            <div className="mt-3">
              <RetryButton taskId={task.id} label="Khắc phục và thử lại" />
            </div>
          </Alert>
        )}
        {blockedKind === "APPROVAL_INVALID" && <Alert tone="error" title="Phê duyệt không còn hiệu lực">{MSG.APPROVAL_INVALID(item!.blockedReason?.replace("Phê duyệt không còn hiệu lực: ", "") ?? "")}</Alert>}
        {blockedKind === "REVOKED_AWAITING_APPROVAL" && (
          <Alert tone="warning" title="Quyền giữ BLOCKED. Chỉ cấp lại sau khi có phê duyệt hợp lệ mới.">
            <p>{item!.blockedReason}</p>
          </Alert>
        )}
        {ar && task.status === "WAITING" && (
          <Alert tone="warning" title="Lần xử lý trước chưa thành công">
            <p>{ar.provisionFailure}</p>
            <p className="mt-1">Yêu cầu vẫn ở Chờ cấp quyền.</p>
            <div className="mt-3">
              <RetryButton taskId={task.id} label="Xử lý lại" />
            </div>
          </Alert>
        )}
        {isDone && (item?.status === "COMPLETED" || ar?.status === "GRANTED") && (
          <Alert tone="success" title={item ? "Quyền đã COMPLETED" : "Yêu cầu đã cấp"}>
            Tài khoản {(item ?? ar)!.account?.accountIdentifier} · Bằng chứng <EvidenceLink value={(item ?? ar)!.evidenceRef} />
          </Alert>
        )}

        <Card>
          <SectionTitle
            right={
              <span className="flex items-center gap-2 text-sm text-gray-600">
                Hạn {fmtDay(task.dueAt)} <OverdueBadge label={overdueLabel(task, now)} />
              </span>
            }
          >
            1. Thông tin quyền
          </SectionTitle>
          <dl>
            <KV label="Nhân viên">
              {employee.fullName} · {employee.jobTitle.name} ·{" "}
              <Link href={caseHref} className="text-blue-600 hover:underline">
                {caseCode} ↗
              </Link>
            </KV>
            <KV label="Quyền">
              {access.name}
              {item && ` (#${item.sequenceNo}/${item.onboarding.accessItems.length})`} · Hệ thống: {access.system.name} · Mức: {(item ?? ar)!.accessLevel}
            </KV>
            {item && <KV label="Phân loại">{item.isMandatory ? "Bắt buộc" : "Không bắt buộc"}</KV>}
            {access.isSensitive && (
              <KV label="Nhạy cảm">
                <SensitiveBadge />
              </KV>
            )}
            {ar && (
              <>
                <KV label="Lý do sử dụng">{ar.reason}</KV>
                <KV label="Ngày cần">{fmtDate(ar.neededBy)}</KV>
              </>
            )}
            <KV label="Phê duyệt đã có">
              {approvals.map((d) => (
                <p key={d.id}>
                  ✓ {d.decidedBy.employee.fullName} ({d.approverRole === "MANAGER" ? "Manager" : "Security"}) · {fmtDateTime(d.decidedAt)}
                </p>
              ))}
            </KV>
          </dl>
        </Card>

        {!isDone && task.status === "OPEN" && !blockedKind && (
          <Card>
            <ProvisionForm taskId={task.id} systemName={access.system.name} existing={existing} />
          </Card>
        )}
        {!isDone && blockedKind === "APPROVAL_INVALID" && (
          <Card>
            <RevokeInvalidForm taskId={task.id} />
          </Card>
        )}
      </div>
    </>
  );
}
