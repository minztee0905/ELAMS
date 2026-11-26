// SCR-OFF-04 – Thu hồi thiết bị.
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { fmtDate, fmtDateTime, fmtDay, toDateTimeInput } from "@/lib/dates";
import { DEVICE_RETURN_STATUS, DEVICE_TYPE, RETURN_CONDITION } from "@/lib/labels";
import { Breadcrumb, Card, Forbidden, OverdueBadge, StatusBadge, Table, Td } from "@/components/ui";
import { auditDenied } from "@/server/authz";
import { getNow } from "@/server/clock";
import { requireActor } from "@/server/session";
import { overdueLabel } from "@/server/tasks";
import { DeviceReturnButtons } from "../../off-forms";

export default async function DeviceReturnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const actor = await requireActor();
  const now = await getNow();
  const task = await db.task.findUnique({ where: { id: Number(id) } });
  if (!task || task.taskType !== "OFF_DEVICE") notFound();
  if (task.assigneeId !== actor.userId) {
    await auditDenied(actor, `Mở nhiệm vụ thu hồi thiết bị #${id}`);
    return <Forbidden />;
  }
  const off = await db.offboardingRequest.findUniqueOrThrow({
    where: { id: task.objectId },
    include: { employee: { include: { manager: true } }, deviceReturns: { include: { device: true, exceptionBy: { include: { employee: true } } }, orderBy: { id: "asc" } } },
  });
  return (
    <>
      <Breadcrumb items={[{ label: "Việc cần làm", href: "/tasks" }, { label: `Thu hồi thiết bị · ${off.employee.fullName}` }]} />
      <div className="max-w-5xl space-y-5">
        <Card>
          <p className="font-medium">
            <Link href={`/offboarding/${off.requestCode}`} className="text-blue-600 hover:underline">
              {off.requestCode}
            </Link>{" "}
            · {off.employee.fullName} · Ngày cuối {fmtDate(off.lastWorkingDate)} · Hạn {fmtDay(task.dueAt)} <OverdueBadge label={overdueLabel(task, now)} />
          </p>
        </Card>
        <Card>
          <Table head={["Mã tài sản", "Loại", "Trạng thái", ""]}>
            {off.deviceReturns.map((d) => (
              <tr key={d.id}>
                <Td>{d.device.assetCode}</Td>
                <Td>{DEVICE_TYPE[d.device.deviceType]}</Td>
                <Td>
                  <StatusBadge map={DEVICE_RETURN_STATUS} value={d.status} />
                  {d.status === "RETURNED" && <span className="ml-2 text-xs text-gray-600">{RETURN_CONDITION[d.deviceCondition!]} · {fmtDateTime(d.returnedAt)}</span>}
                  {d.status === "EXCEPTION_NOT_RETURNED" && (
                    <p className="mt-1 text-xs text-gray-600">
                      Duyệt bởi {d.exceptionBy?.employee.fullName}: “{d.exceptionReason}”
                    </p>
                  )}
                </Td>
                <Td className="text-right">
                  {d.status === "WAITING" && task.status !== "DONE" && (
                    <DeviceReturnButtons taskId={task.id} itemId={d.id} assetCode={d.device.assetCode} nowInput={toDateTimeInput(now)} />
                  )}
                  {d.status === "MISSING_PENDING_DECISION" && <span className="text-sm text-gray-600">Chờ {off.employee.manager?.fullName}</span>}
                </Td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </>
  );
}
