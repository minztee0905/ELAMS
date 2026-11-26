// SCR-OFF-05 – Bàn giao công việc (Manager lập kế hoạch, nhân viên cập nhật).
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { fmtDate, fmtDateTime, toDateInput } from "@/lib/dates";
import { HANDOVER_STATUS } from "@/lib/labels";
import { Alert, Breadcrumb, Card, Forbidden, SectionTitle, StatusBadge, Table, Td, UrgentBadge } from "@/components/ui";
import { auditDenied } from "@/server/authz";
import { getNow } from "@/server/clock";
import { canUpdateOnBehalf } from "@/server/offboarding";
import { requireActor } from "@/server/session";
import { ConfirmHandoverButton, HandoverItemActions, HandoverPlanEditor } from "../../off-forms";

export default async function HandoverPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const actor = await requireActor();
  const now = await getNow();
  const task = await db.task.findUnique({ where: { id: Number(id) } });
  if (!task || (task.taskType !== "OFF_HANDOVER" && task.taskType !== "OFF_HANDOVER_UPDATE")) notFound();
  if (task.assigneeId !== actor.userId) {
    await auditDenied(actor, `Mở nhiệm vụ bàn giao #${id}`);
    return <Forbidden />;
  }
  const off = await db.offboardingRequest.findUniqueOrThrow({
    where: { id: task.objectId },
    include: { employee: true, handoverItems: { include: { receiver: true, updatedBy: { include: { employee: true } } }, orderBy: { id: "asc" } } },
  });
  const isManager = task.taskType === "OFF_HANDOVER";
  const open = task.status === "OPEN" || task.status === "WAITING";
  const onBehalf = isManager && canUpdateOnBehalf(off, now);
  const people = await db.employee.findMany({
    where: { status: "ACTIVE", id: { not: off.employeeId }, departmentId: off.employee.departmentId },
    orderBy: { fullName: "asc" },
  });
  const allHanded = off.handoverItems.length > 0 && off.handoverItems.every((h) => h.status === "HANDED_OVER");

  return (
    <>
      <Breadcrumb items={[{ label: "Việc cần làm", href: "/tasks" }, { label: `Bàn giao công việc · ${off.employee.fullName}` }]} />
      <div className="max-w-5xl space-y-5">
        <Card>
          <p className="font-medium">
            {isManager ? (
              <Link href={`/offboarding/${off.requestCode}`} className="text-blue-600 hover:underline">
                {off.requestCode}
              </Link>
            ) : (
              off.requestCode
            )}{" "}
            · {off.employee.fullName} · Ngày cuối {fmtDate(off.lastWorkingDate)} {off.isUrgent && <UrgentBadge />}
          </p>
        </Card>
        {off.handoverConfirmedAt && <Alert tone="success" title={`Bàn giao đã được xác nhận đầy đủ lúc ${fmtDateTime(off.handoverConfirmedAt)}.`} />}
        {isManager && open && !off.handoverConfirmedAt && (
          <Card>
            <SectionTitle>Kế hoạch bàn giao</SectionTitle>
            <HandoverPlanEditor
              taskId={task.id}
              rows={off.handoverItems.map((h) => ({ id: h.id, title: h.title, receiverId: h.receiverId, dueDate: toDateInput(h.dueDate), locked: h.status === "HANDED_OVER" }))}
              people={people.map((p) => ({ id: p.id, name: p.fullName }))}
              defaultDue={toDateInput(off.lastWorkingDate)}
            />
          </Card>
        )}
        <Card>
          <SectionTitle>Tiến độ bàn giao</SectionTitle>
          {onBehalf && open && !off.handoverConfirmedAt && (
            <p className="mb-3 text-sm text-amber-700">Yêu cầu đột xuất hoặc tài khoản nhân viên đã bị thu hồi: bạn có thể cập nhật thay nhân viên.</p>
          )}
          <Table head={["Hạng mục", "Người nhận", "Hạn", "Trạng thái", "Cập nhật gần nhất", ""]} empty={off.handoverItems.length ? undefined : "Chưa có hạng mục."}>
            {off.handoverItems.map((h) => (
              <tr key={h.id}>
                <Td>
                  {h.title}
                  {h.notMetReason && <p className="text-xs text-red-600">Lý do: “{h.notMetReason}”</p>}
                </Td>
                <Td>{h.receiver.fullName}</Td>
                <Td>{fmtDate(h.dueDate)}</Td>
                <Td>
                  <StatusBadge map={HANDOVER_STATUS} value={h.status} />
                </Td>
                <Td className="text-xs text-gray-600">
                  {h.updatedBy?.employee.fullName} · {fmtDateTime(h.updatedAt)}
                </Td>
                <Td className="text-right">
                  {open && !off.handoverConfirmedAt && (
                    <HandoverItemActions
                      taskId={task.id}
                      itemId={h.id}
                      canMarkDone={h.status !== "HANDED_OVER" && (!isManager || onBehalf)}
                      canMarkNotMet={isManager && h.status === "HANDED_OVER"}
                      onBehalf={isManager}
                    />
                  )}
                </Td>
              </tr>
            ))}
          </Table>
          {isManager && open && !off.handoverConfirmedAt && (
            <div className="mt-4 flex justify-end">{allHanded ? <ConfirmHandoverButton taskId={task.id} /> : <p className="text-sm text-gray-500">Xác nhận bàn giao đầy đủ khi mọi hạng mục đã bàn giao.</p>}</div>
          )}
        </Card>
      </div>
    </>
  );
}
