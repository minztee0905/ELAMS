// SCR-OFF-02 – Danh sách yêu cầu offboarding.
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { fmtDate } from "@/lib/dates";
import { CASE_STATUS } from "@/lib/labels";
import { Forbidden, LinkButton, PageTitle, StatusBadge, Table, Td, UrgentBadge } from "@/components/ui";
import { auditDenied } from "@/server/authz";
import { getNow } from "@/server/clock";
import { requireActor } from "@/server/session";
import { overdueLabel } from "@/server/tasks";

export default async function OffboardingList() {
  const actor = await requireActor();
  if (actor.role === "EMPLOYEE") {
    await auditDenied(actor, "Mở danh sách offboarding");
    return <Forbidden />;
  }
  const now = await getNow();
  let where: Prisma.OffboardingRequestWhereInput = {};
  if (actor.role === "MANAGER") where = { employee: { managerId: actor.employeeId } };
  if (actor.role === "IT" || actor.role === "SECURITY") {
    const codes = await db.task.findMany({ where: { assigneeId: actor.userId, caseCode: { startsWith: "OFF-" } }, distinct: ["caseCode"], select: { caseCode: true } });
    where = { requestCode: { in: codes.map((c) => c.caseCode!) } };
  }
  const rows = await db.offboardingRequest.findMany({
    where,
    include: { employee: { include: { department: true } }, revocations: true, deviceReturns: true, handoverItems: true },
    orderBy: { id: "desc" },
  });
  const tasks = await db.task.findMany({ where: { caseCode: { in: rows.map((r) => r.requestCode) }, status: { in: ["OPEN", "WAITING"] } } });
  return (
    <>
      <PageTitle right={actor.role === "HR" && <LinkButton href="/offboarding/new" variant="primary">+ Tạo yêu cầu</LinkButton>}>Yêu cầu offboarding</PageTitle>
      <Table head={["Mã", "Nhân viên", "Phòng ban", "Ngày cuối", "Trạng thái", "Tiến độ", "Quá hạn"]} empty={rows.length ? undefined : "Chưa có yêu cầu nào."}>
        {rows.map((r) => {
          const hDone = r.handoverItems.filter((h) => h.status === "HANDED_OVER").length;
          const rDone = r.revocations.filter((x) => x.status === "REVOKED" || x.status === "DISABLED").length;
          const dDone = r.deviceReturns.filter((d) => d.status === "RETURNED" || d.status === "EXCEPTION_NOT_RETURNED").length;
          const od = tasks.filter((t) => t.caseCode === r.requestCode && overdueLabel(t, now)).length;
          return (
            <tr key={r.id} className="hover:bg-gray-50">
              <Td>
                <Link href={`/offboarding/${r.requestCode}`} className="font-medium text-blue-600 hover:underline">
                  {r.requestCode}
                </Link>
              </Td>
              <Td>{r.employee.fullName}</Td>
              <Td>{r.employee.department.name}</Td>
              <Td>{fmtDate(r.lastWorkingDate)}</Td>
              <Td>
                <div className="flex gap-1">
                  {r.isUrgent && <UrgentBadge />}
                  <StatusBadge map={CASE_STATUS} value={r.status} />
                </div>
              </Td>
              <Td className="text-gray-600">
                Bàn giao {hDone}/{r.handoverItems.length}
                {r.handoverConfirmedAt && " ✓"} · Quyền {rDone}/{r.revocations.length} · Thiết bị {dDone}/{r.deviceReturns.length}
              </Td>
              <Td className={od ? "font-semibold text-red-600" : ""}>{od}</Td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
