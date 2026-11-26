// Danh sách yêu cầu onboarding (phạm vi xem theo ma trận SRS mục 3).
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { fmtDate, fmtDay } from "@/lib/dates";
import { CASE_STATUS } from "@/lib/labels";
import { Forbidden, LinkButton, PageTitle, StatusBadge, Table, Td } from "@/components/ui";
import { auditDenied } from "@/server/authz";
import { requireActor } from "@/server/session";

export default async function OnboardingList() {
  const actor = await requireActor();
  if (actor.role === "EMPLOYEE") {
    await auditDenied(actor, "Mở danh sách onboarding");
    return <Forbidden />;
  }
  let where: Prisma.OnboardingRequestWhereInput = {};
  if (actor.role === "MANAGER") where = { managerId: actor.employeeId };
  if (actor.role === "IT" || actor.role === "SECURITY") {
    const codes = await db.task.findMany({ where: { assigneeId: actor.userId, caseCode: { startsWith: "ONB-" } }, distinct: ["caseCode"], select: { caseCode: true } });
    where = { requestCode: { in: codes.map((c) => c.caseCode!) } };
  }
  const rows = await db.onboardingRequest.findMany({
    where,
    include: { employee: { include: { jobTitle: true, department: true } }, accessItems: true, deviceItems: true },
    orderBy: { id: "desc" },
  });
  return (
    <>
      <PageTitle right={actor.role === "HR" && <LinkButton href="/onboarding/new" variant="primary">+ Tạo yêu cầu</LinkButton>}>Yêu cầu onboarding</PageTitle>
      <Table head={["Mã", "Nhân viên mới", "Chức danh", "Ngày bắt đầu", "Tiến độ", "Trạng thái", "Tạo"]} empty={rows.length ? undefined : "Chưa có yêu cầu nào."}>
        {rows.map((r) => (
          <tr key={r.id} className="hover:bg-gray-50">
            <Td>
              <Link href={`/onboarding/${r.requestCode}`} className="font-medium text-blue-600 hover:underline">
                {r.requestCode}
              </Link>
            </Td>
            <Td>{r.employee.fullName}</Td>
            <Td>
              {r.employee.jobTitle.name} · {r.employee.department.name}
            </Td>
            <Td>{fmtDate(r.startDate)}</Td>
            <Td className="text-gray-600">
              Quyền {r.accessItems.filter((i) => i.status === "COMPLETED" || i.status === "REJECTED").length}/{r.accessItems.length} · Thiết bị{" "}
              {r.deviceItems.filter((d) => d.status === "HANDED_OVER").length}/{r.deviceItems.length}
            </Td>
            <Td>
              <StatusBadge map={CASE_STATUS} value={r.status} />
            </Td>
            <Td>{fmtDay(r.createdAt)}</Td>
          </tr>
        ))}
      </Table>
    </>
  );
}
