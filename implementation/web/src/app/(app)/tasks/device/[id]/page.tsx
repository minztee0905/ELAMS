// SCR-ON-05 – Bàn giao và ghi nhận thiết bị.
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { fmtDate, fmtDateTime, fmtDay, toDateInput, toDateTimeInput, vnDateOnly } from "@/lib/dates";
import { DEVICE_TYPE, HANDOVER_CONDITION, ON_DEVICE_STATUS } from "@/lib/labels";
import { Alert, Breadcrumb, Card, EvidenceLink, Forbidden, OverdueBadge, SectionTitle, StatusBadge } from "@/components/ui";
import { auditDenied } from "@/server/authz";
import { getNow } from "@/server/clock";
import { requireActor } from "@/server/session";
import { overdueLabel } from "@/server/tasks";
import { DeviceAvailableButton, DeviceLineForm } from "../forms";

export default async function DeviceTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const actor = await requireActor();
  const now = await getNow();
  const task = await db.task.findUnique({ where: { id: Number(id) } });
  if (!task || task.taskType !== "ON_DEVICE") notFound();
  if (task.assigneeId !== actor.userId) {
    await auditDenied(actor, `Mở nhiệm vụ thiết bị #${id}`);
    return <Forbidden />;
  }
  const ob = await db.onboardingRequest.findUniqueOrThrow({
    where: { id: task.objectId },
    include: { employee: { include: { jobTitle: true } }, deviceItems: { include: { device: true }, orderBy: { id: "asc" } } },
  });
  const stock = await db.device.findMany({ where: { status: "IN_STOCK" }, orderBy: { assetCode: "asc" } });
  const taskStatus = ob.deviceItems.every((d) => d.status === "HANDED_OVER") ? "HANDED_OVER" : ob.deviceItems.some((d) => d.status === "WAITING_DEVICE") ? "WAITING_DEVICE" : "PREPARING";

  return (
    <>
      <Breadcrumb items={[{ label: "Việc cần làm", href: "/tasks" }, { label: `Cấp thiết bị · ${ob.employee.fullName}` }]} />
      <div className="max-w-4xl space-y-5">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">
                {ob.employee.fullName} · {ob.employee.jobTitle.name} · Bắt đầu {fmtDate(ob.startDate)} ·{" "}
                <Link href={`/onboarding/${ob.requestCode}`} className="text-blue-600 hover:underline">
                  {ob.requestCode} ↗
                </Link>
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Hạn {fmtDay(task.dueAt)} <OverdueBadge label={overdueLabel(task, now)} />
              </p>
              {ob.note && <p className="mt-1 text-sm text-gray-600">Ghi chú của HR: “{ob.note}”</p>}
            </div>
            <StatusBadge map={ON_DEVICE_STATUS} value={taskStatus} />
          </div>
        </Card>
        <Card>
          <SectionTitle>Thiết bị cần cấp</SectionTitle>
          <div className="space-y-6">
            {ob.deviceItems.map((d, i) => (
              <div key={d.id} className="border-t border-gray-100 pt-4 first:border-0 first:pt-0">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-medium">
                    {i + 1}. {DEVICE_TYPE[d.deviceType]}
                    {d.configNote && <span className="font-normal text-gray-600"> ({d.configNote})</span>}
                  </p>
                  <StatusBadge map={ON_DEVICE_STATUS} value={d.status} />
                </div>
                {d.status === "WAITING_DEVICE" && (
                  <Alert tone="warning" title={`Chờ thiết bị: ${d.waitingReason}`}>
                    <p>
                      Ghi nhận {fmtDateTime(d.waitingSince)}
                      {d.expectedAt && ` · Dự kiến có ${fmtDate(d.expectedAt)}`}. Nhiệm vụ không tự chuyển trạng thái.
                    </p>
                    {task.status !== "DONE" && (
                      <div className="mt-3">
                        <DeviceAvailableButton taskId={task.id} lineId={d.id} />
                      </div>
                    )}
                  </Alert>
                )}
                {d.status === "HANDED_OVER" && (
                  <p className="text-sm text-gray-700">
                    {d.device?.assetCode} · {fmtDateTime(d.handedOverAt)} · {d.deviceCondition && HANDOVER_CONDITION[d.deviceCondition]} · Biên bản{" "}
                    {d.handoverRecordCode} (<EvidenceLink value={d.handoverRecordFile} />)
                  </p>
                )}
                {d.status === "PREPARING" && task.status !== "DONE" && (
                  <DeviceLineForm
                    taskId={task.id}
                    lineId={d.id}
                    devices={stock.filter((s) => s.deviceType === d.deviceType).map((s) => ({ id: s.id, label: `${s.assetCode} · ${s.description ?? ""}` }))}
                    nowInput={toDateTimeInput(now)}
                    today={toDateInput(vnDateOnly(now))}
                    handedBy={actor.fullName}
                    receiver={ob.employee.fullName}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
