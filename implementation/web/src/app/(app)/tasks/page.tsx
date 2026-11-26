// SCR-ON-03 – Việc cần làm (Approval Inbox), mở rộng cho Access Request và Offboarding.
import Link from "next/link";
import type { Task, TaskType } from "@prisma/client";
import { db } from "@/lib/db";
import { fmtDate, fmtDateTime, fmtDay } from "@/lib/dates";
import { DEVICE_TYPE, ROLE_LABEL } from "@/lib/labels";
import { Alert, Badge, Card, EvidenceLink, KV, OverdueBadge, SensitiveBadge, StatusBadge, UrgentBadge, cx } from "@/components/ui";
import { TASK_STATUS } from "@/lib/labels";
import { getNow } from "@/server/clock";
import { requireActor } from "@/server/session";
import { SLA } from "@/server/settings";
import { TASK_LABEL, dueSoon, overdueLabel, taskHref } from "@/server/tasks";
import { parseLevels } from "@/server/ledger";
import { AdjustForm, ArReviewForm, DeviceExceptionForm, OnboardingReviewForm } from "./panels";

const PANEL_TYPES: TaskType[] = ["ON_ACCESS_REVIEW", "SECURITY_REVIEW", "ON_ACCESS_ADJUST", "AR_REVIEW", "OFF_DEVICE_EXCEPTION"];

type SP = { task?: string; type?: string; overdue?: string; q?: string; done?: string };

function sortTasks(tasks: Task[], now: Date) {
  // FR-GEN-03: đột xuất đứng đầu, quá hạn trước, rồi hạn tăng dần.
  return [...tasks].sort((a, b) => {
    if (a.isUrgent !== b.isUrgent) return a.isUrgent ? -1 : 1;
    const ao = overdueLabel(a, now) ? 0 : 1;
    const bo = overdueLabel(b, now) ? 0 : 1;
    if (ao !== bo) return ao - bo;
    const ad = a.dueAt?.getTime() ?? Infinity;
    const bd = b.dueAt?.getTime() ?? Infinity;
    return ad - bd;
  });
}

export default async function TasksPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const actor = await requireActor();
  const now = await getNow();
  const all = sortTasks(await db.task.findMany({ where: { assigneeId: actor.userId, status: { in: ["OPEN", "WAITING"] } } }), now);

  const counts = new Map<TaskType, number>();
  for (const t of all) counts.set(t.taskType, (counts.get(t.taskType) ?? 0) + 1);
  const q = (sp.q ?? "").trim().toLowerCase();
  const list = all.filter(
    (t) =>
      (!sp.type || t.taskType === sp.type) &&
      (!sp.overdue || overdueLabel(t, now)) &&
      (!q || t.title.toLowerCase().includes(q) || (t.caseCode ?? "").toLowerCase().includes(q)),
  );
  const selected = sp.task ? all.find((t) => t.id === Number(sp.task)) : list.find((t) => PANEL_TYPES.includes(t.taskType));
  const qs = (over: Partial<SP>) => {
    const p = new URLSearchParams();
    const m = { type: sp.type, overdue: sp.overdue, q: sp.q, ...over };
    for (const [k, v] of Object.entries(m)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/tasks?${s}` : "/tasks";
  };

  return (
    <>
      <h1 className="mb-4 text-xl font-semibold">Việc cần làm</h1>
      {sp.done && (
        <div className="mb-4">
          <Alert tone="success" title={sp.done} />
        </div>
      )}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_480px]">
        <Card className="p-0">
          <div className="space-y-3 border-b border-gray-200 p-4">
            <div className="flex flex-wrap gap-2">
              <Chip href={qs({ type: undefined, task: undefined })} active={!sp.type}>
                Tất cả {all.length}
              </Chip>
              {[...counts.entries()].map(([type, n]) => (
                <Chip key={type} href={qs({ type })} active={sp.type === type}>
                  {TASK_LABEL[type]} {n}
                </Chip>
              ))}
            </div>
            <form className="flex flex-wrap items-center gap-4 text-sm" action="/tasks">
              {sp.type && <input type="hidden" name="type" value={sp.type} />}
              <label className="flex items-center gap-2">
                <input type="checkbox" name="overdue" value="1" defaultChecked={!!sp.overdue} />
                Chỉ quá hạn
              </label>
              <input name="q" defaultValue={sp.q} placeholder="Tìm tên, mã yêu cầu" className="w-56 rounded-md border border-gray-300 px-3 py-1.5" />
              <button className="text-blue-600 hover:underline">Lọc</button>
            </form>
          </div>
          {list.length === 0 && <p className="p-6 text-sm text-gray-500">Bạn không có việc cần làm.</p>}
          <ul className="divide-y divide-gray-100">
            {list.map((t) => {
              const panel = PANEL_TYPES.includes(t.taskType);
              const href = panel ? qs({ task: String(t.id) }) : taskHref(t);
              const od = overdueLabel(t, now);
              return (
                <li key={t.id}>
                  <Link href={href} className={cx("block px-5 py-4 hover:bg-gray-50", selected?.id === t.id && "border-l-4 border-blue-600 bg-blue-50/50")}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {TASK_LABEL[t.taskType]} · {t.title}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {t.caseCode} · {t.dueAt ? `Hạn ${fmtDateTime(t.dueAt)}` : `Không có hạn · ${Math.max(0, Math.floor((now.getTime() - t.createdAt.getTime()) / 86_400_000))} ngày`}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <div className="flex gap-1">
                          {t.isUrgent && <UrgentBadge />}
                          <StatusBadge map={TASK_STATUS} value={t.status} />
                        </div>
                        <OverdueBadge label={od} />
                        {!od && dueSoon(t, now, SLA.dueSoonHours) && <Badge className="border border-orange-400 text-orange-700">Sắp đến hạn</Badge>}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>

        <div>{selected && PANEL_TYPES.includes(selected.taskType) ? <Panel task={selected} now={now} /> : <EmptyPanel />}</div>
      </div>
    </>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={cx("rounded-full border px-3 py-1 text-xs", active ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-50")}>
      {children}
    </Link>
  );
}

function EmptyPanel() {
  return (
    <Card>
      <p className="text-sm text-gray-500">Chọn một nhiệm vụ xét duyệt để xử lý tại đây. Nhiệm vụ cấp quyền, thiết bị, thu hồi và bàn giao mở trên màn hình riêng.</p>
    </Card>
  );
}

function PanelHeader({ title, task, now }: { title: string; task: Task; now: Date }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3 border-b border-gray-200 pb-3">
      <h2 className="text-sm font-semibold tracking-wide uppercase">{title}</h2>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {task.dueAt && <span>Hạn {fmtDay(task.dueAt)}</span>}
        <OverdueBadge label={overdueLabel(task, now)} />
      </div>
    </div>
  );
}

async function Panel({ task, now }: { task: Task; now: Date }) {
  if (task.objectType === "ONBOARDING_ACCESS_ITEM") {
    const item = await db.onboardingAccessItem.findUniqueOrThrow({
      where: { id: task.objectId },
      include: {
        access: { include: { system: true } },
        onboarding: { include: { employee: { include: { jobTitle: true, department: true } }, manager: true, accessItems: true } },
        decisions: { include: { decidedBy: { include: { employee: true } } }, orderBy: { decidedAt: "asc" } },
      },
    });
    const ob = item.onboarding;
    const total = ob.accessItems.length;
    const chain = item.access.isSensitive ? ["Manager", "Security", "IT"] : ["Manager", "IT"];
    const currentIdx = item.currentStep === "SECURITY_REVIEW" ? 1 : item.currentStep === "IT_PROVISION" ? chain.length - 1 : 0;
    const info = (
      <dl className="mb-5 space-y-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase">Nhân viên mới</p>
          <p className="text-sm">
            {ob.employee.fullName} – {ob.employee.jobTitle.name}
          </p>
          <p className="text-sm text-gray-600">
            {ob.employee.department.name} · Bắt đầu {fmtDate(ob.startDate)}
          </p>
          <Link href={`/onboarding/${ob.requestCode}`} className="text-sm text-blue-600 hover:underline">
            Yêu cầu: {ob.requestCode} ↗
          </Link>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase">Quyền</p>
          <p className="text-sm font-medium">
            {item.access.name} (#{item.sequenceNo}/{total})
          </p>
          <KV label="Hệ thống">{item.access.system.name}</KV>
          <KV label="Mức">{item.accessLevel}</KV>
          <KV label="Phân loại">{item.isMandatory ? "Bắt buộc 🔒" : "Không bắt buộc"}</KV>
          <KV label="Nhạy cảm">{item.access.isSensitive ? <SensitiveBadge /> : "Không"}</KV>
          <KV label="Cấp phê duyệt">
            {chain.map((c, i) => (
              <span key={c}>
                {i > 0 && " → "}
                <span className={i === currentIdx ? "font-semibold text-blue-700" : ""}>{c}</span>
              </span>
            ))}
          </KV>
        </div>
      </dl>
    );

    if (task.taskType === "ON_ACCESS_ADJUST") {
      const last = [...item.decisions].reverse().find((d) => d.decision === "REJECT");
      return (
        <Card>
          <PanelHeader title="Điều chỉnh quyền bị chặn" task={task} now={now} />
          <p className="mb-2 text-sm font-medium">
            {item.access.name} (#{item.sequenceNo}/{total}) · {item.access.system.name} · {item.isMandatory ? "Bắt buộc 🔒" : "Không bắt buộc"}{" "}
            {item.access.isSensitive && <SensitiveBadge />} <StatusBadge map={{ BLOCKED: ["BLOCKED", "red"] }} value="BLOCKED" />
          </p>
          {last && (
            <p className="text-sm text-gray-600">
              Bị chặn bởi: {last.decidedBy.employee.fullName} ({ROLE_LABEL[last.approverRole === "SECURITY" ? "SECURITY" : "MANAGER"]}) · {fmtDateTime(last.decidedAt)}
            </p>
          )}
          <p className="mb-5 text-sm text-gray-800">Lý do: “{item.blockedReason}”</p>
          <AdjustForm taskId={task.id} levels={parseLevels(item.access.accessLevels)} current={item.accessLevel} />
        </Card>
      );
    }

    const isManager = task.taskType === "ON_ACCESS_REVIEW";
    const mgrDecision = [...item.decisions].reverse().find((d) => d.approverRole === "MANAGER" && d.round === item.approvalRound);
    return (
      <Card>
        <PanelHeader title={isManager ? "Xét duyệt nhu cầu quyền" : "Xét duyệt quyền nhạy cảm"} task={task} now={now} />
        {info}
        {!isManager && (
          <div className="mb-5 rounded-md bg-gray-50 p-3 text-sm">
            <p className="font-medium">Quyết định của Manager</p>
            {mgrDecision ? (
              <p className="text-gray-700">
                {mgrDecision.decidedBy.employee.fullName} phê duyệt · {fmtDateTime(mgrDecision.decidedAt)} · {mgrDecision.reason || "Không có ghi chú"}
              </p>
            ) : (
              <p>–</p>
            )}
          </div>
        )}
        <OnboardingReviewForm
          taskId={task.id}
          isSensitive={item.access.isSensitive}
          isMandatory={item.isMandatory}
          isManager={isManager}
          managerName={ob.manager.fullName}
        />
      </Card>
    );
  }

  if (task.objectType === "ACCESS_REQUEST") {
    const ar = await db.accessRequest.findUniqueOrThrow({
      where: { id: task.objectId },
      include: {
        access: { include: { system: true } },
        requester: { include: { department: true, jobTitle: true } },
        decisions: { include: { decidedBy: { include: { employee: true } } }, orderBy: { decidedAt: "asc" } },
      },
    });
    const existing = await db.accessGrant.findMany({
      where: { employeeId: ar.requesterId, status: "ACTIVE", account: { systemId: ar.access.systemId } },
      include: { access: true },
    });
    const isManager = task.taskType === "AR_REVIEW";
    const mgr = [...ar.decisions].reverse().find((d) => d.approverRole === "MANAGER" && d.decision === "APPROVE");
    return (
      <Card>
        <PanelHeader title={isManager ? "Xét duyệt yêu cầu quyền" : "Xét duyệt quyền nhạy cảm – yêu cầu quyền"} task={task} now={now} />
        {!isManager && mgr && (
          <div className="mb-4 rounded-md bg-gray-50 p-3 text-sm">
            <p className="font-medium">Quyết định của Manager</p>
            <p className="text-gray-700">
              {mgr.decidedBy.employee.fullName} phê duyệt · {fmtDateTime(mgr.decidedAt)}
            </p>
          </div>
        )}
        <dl className="mb-5">
          <KV label="Người yêu cầu">
            {ar.requester.fullName} · {ar.requester.department.name}
          </KV>
          <KV label="Mã yêu cầu">
            <Link href={`/access-requests/${ar.requestCode}`} className="text-blue-600 hover:underline">
              {ar.requestCode} ↗
            </Link>
          </KV>
          <KV label="Quyền">
            {ar.access.name} {ar.access.isSensitive && <SensitiveBadge />}
          </KV>
          <KV label="Hệ thống">{ar.access.system.name}</KV>
          <KV label="Mức quyền">{ar.accessLevel}</KV>
          <KV label="Cấp phê duyệt">{ar.access.isSensitive ? "Manager → Security → IT" : "Manager → IT"}</KV>
          <KV label="Lý do sử dụng">{ar.reason}</KV>
          <KV label="Ngày cần">{fmtDate(ar.neededBy)}</KV>
          <KV label="Tệp">
            <EvidenceLink value={ar.attachment} />
          </KV>
          <KV label="Quyền hiện có">
            {existing.length ? existing.map((g) => `${g.access?.name ?? "Khác"} mức ${g.accessLevel}`).join("; ") : "Chưa có quyền trên hệ thống này"}
          </KV>
        </dl>
        <ArReviewForm taskId={task.id} isSensitive={ar.access.isSensitive} isManager={isManager} requesterName={ar.requester.fullName} />
      </Card>
    );
  }

  // OFF_DEVICE_EXCEPTION
  const item = await db.deviceReturnItem.findUniqueOrThrow({
    where: { id: task.objectId },
    include: { device: true, offboarding: { include: { employee: true } } },
  });
  return (
    <Card>
      <PanelHeader title="Duyệt ngoại lệ thiết bị" task={task} now={now} />
      <dl className="mb-5">
        <KV label="Nhân viên">{item.offboarding.employee.fullName}</KV>
        <KV label="Mã yêu cầu">
          <Link href={`/offboarding/${item.offboarding.requestCode}`} className="text-blue-600 hover:underline">
            {item.offboarding.requestCode} ↗
          </Link>
        </KV>
        <KV label="Thiết bị">
          {item.device.assetCode} · {DEVICE_TYPE[item.device.deviceType]}
        </KV>
        <KV label="Lý do thiếu">{item.missingReason}</KV>
        <KV label="Bằng chứng của IT">
          <EvidenceLink value={item.evidenceRef} />
        </KV>
      </dl>
      <DeviceExceptionForm taskId={task.id} />
    </Card>
  );
}
