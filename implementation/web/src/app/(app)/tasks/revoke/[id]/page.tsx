// SCR-OFF-03 – Thu hồi quyền truy cập.
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { fmtTimeDate } from "@/lib/dates";
import { REVOCATION_STATUS } from "@/lib/labels";
import { Alert, Breadcrumb, Card, EvidenceLink, Forbidden, OverdueBadge, StatusBadge, Table, Td, UrgentBadge } from "@/components/ui";
import { auditDenied } from "@/server/authz";
import { getNow } from "@/server/clock";
import { requireActor } from "@/server/session";
import { overdueLabel } from "@/server/tasks";
import { AddManualRevocationButton, RevocationResultButton } from "../../off-forms";

export default async function RevokePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const actor = await requireActor();
  const now = await getNow();
  const task = await db.task.findUnique({ where: { id: Number(id) } });
  if (!task || task.taskType !== "OFF_REVOKE") notFound();
  if (task.assigneeId !== actor.userId) {
    await auditDenied(actor, `Mở nhiệm vụ thu hồi quyền #${id}`);
    return <Forbidden />;
  }
  const off = await db.offboardingRequest.findUniqueOrThrow({
    where: { id: task.objectId },
    include: { employee: { include: { department: true } }, revocations: { include: { system: true, account: true }, orderBy: { id: "asc" } } },
  });
  const systems = await db.targetSystem.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" } });
  const waiting = task.status === "WAITING";
  const status = waiting ? "WAITING" : task.status === "DONE" ? "REVOKED" : "IN_PROGRESS";
  return (
    <>
      <Breadcrumb items={[{ label: "Việc cần làm", href: "/tasks" }, { label: `Thu hồi quyền · ${off.employee.fullName}` }]} />
      <div className="max-w-5xl space-y-5">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">
                <Link href={`/offboarding/${off.requestCode}`} className="text-blue-600 hover:underline">
                  {off.requestCode}
                </Link>{" "}
                · {off.employee.fullName} · {off.employee.department.name}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Thời điểm thu hồi {fmtTimeDate(off.revokeAt)} · Hạn {fmtTimeDate(task.dueAt)} <OverdueBadge label={overdueLabel(task, now)} />
              </p>
            </div>
            <div className="flex gap-1">
              {off.isUrgent && <UrgentBadge />}
              <StatusBadge map={REVOCATION_STATUS} value={status} />
            </div>
          </div>
          <p className="mt-3 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-900">
            ℹ Thu hồi quyền không có ngoại lệ. Tài khoản chưa thu hồi được cần tiếp tục xử lý.
          </p>
        </Card>
        {waiting && <Alert tone="info" title={`Chờ đến thời điểm thu hồi. Bắt đầu lúc ${fmtTimeDate(off.revokeAt)}.`} />}
        <Card>
          <Table head={["#", "Quyền", "Hệ thống", "Tài khoản", "Nguồn", "Trạng thái", ""]} empty={off.revocations.length ? undefined : "Không có mục thu hồi từ sổ quyền."}>
            {off.revocations.map((r, i) => (
              <tr key={r.id}>
                <Td>{i + 1}</Td>
                <Td>
                  {r.accessName}
                  {r.accessLevel && r.accessLevel !== "Người dùng" && ` – ${r.accessLevel}`}
                </Td>
                <Td>{r.system.name}</Td>
                <Td>{r.account?.accountIdentifier ?? "–"}</Td>
                <Td>{r.source === "ELAMS" ? "ELAMS" : "IT bổ sung"}</Td>
                <Td>
                  <StatusBadge map={REVOCATION_STATUS} value={r.status} />
                  {r.status === "NOT_REVOKED" && <p className="mt-1 text-xs text-red-600">{r.failureReason}</p>}
                  {(r.status === "REVOKED" || r.status === "DISABLED") && (
                    <p className="mt-1 text-xs text-gray-500">
                      <EvidenceLink value={r.evidenceRef} />
                    </p>
                  )}
                </Td>
                <Td className="text-right">
                  {!waiting && task.status === "OPEN" && (r.status === "IN_PROGRESS" || r.status === "NOT_REVOKED") && (
                    <RevocationResultButton taskId={task.id} itemId={r.id} label={r.accessName} />
                  )}
                </Td>
              </tr>
            ))}
          </Table>
          {task.status !== "DONE" && task.status !== "CANCELLED" && (
            <div className="mt-4 flex justify-end">
              <AddManualRevocationButton taskId={task.id} systems={systems.map((s) => ({ id: s.id, name: s.name }))} />
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
