// SCR-AC-02 – Danh sách yêu cầu quyền.
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { fmtDay } from "@/lib/dates";
import { AR_STATUS } from "@/lib/labels";
import { LinkButton, OverdueBadge, PageTitle, StatusBadge, Table, Tabs, Td } from "@/components/ui";
import { AR_OPEN } from "@/server/access-request";
import { getNow } from "@/server/clock";
import { requireActor } from "@/server/session";
import { overdueLabel } from "@/server/tasks";

export default async function AccessRequestList({ searchParams }: { searchParams: Promise<{ tab?: string; status?: string; q?: string }> }) {
  const sp = await searchParams;
  const actor = await requireActor();
  const now = await getNow();
  const tabs = [{ key: "mine", label: "Của tôi" }];
  if (actor.role === "MANAGER") tabs.push({ key: "team", label: "Phòng ban" });
  if (actor.role === "IT" || actor.role === "SECURITY") tabs.push({ key: "assigned", label: "Được giao" });
  if (actor.role === "ADMIN") tabs.push({ key: "all", label: "Tất cả" });
  const tab = tabs.some((t) => t.key === sp.tab) ? sp.tab! : "mine";

  let scope: Prisma.AccessRequestWhereInput = { requesterId: actor.employeeId };
  if (tab === "team") scope = { requester: { managerId: actor.employeeId } };
  if (tab === "assigned") {
    const codes = await db.task.findMany({ where: { assigneeId: actor.userId, caseCode: { startsWith: "AR-" } }, distinct: ["caseCode"], select: { caseCode: true } });
    scope = { requestCode: { in: codes.map((c) => c.caseCode!) } };
  }
  if (tab === "all") scope = {};
  const where: Prisma.AccessRequestWhereInput = {
    AND: [
      scope,
      sp.status ? { status: sp.status as never } : {},
      sp.q ? { OR: [{ requestCode: { contains: sp.q, mode: "insensitive" } }, { access: { name: { contains: sp.q, mode: "insensitive" } } }, { requester: { fullName: { contains: sp.q, mode: "insensitive" } } }] } : {},
    ],
  };
  const rows = await db.accessRequest.findMany({ where, include: { access: true, requester: true }, orderBy: { id: "desc" } });
  rows.sort((a, b) => Number(!AR_OPEN.includes(a.status as never)) - Number(!AR_OPEN.includes(b.status as never)));
  const tasks = await db.task.findMany({
    where: { objectType: "ACCESS_REQUEST", objectId: { in: rows.map((r) => r.id) }, status: { in: ["OPEN", "WAITING"] } },
    include: { assignee: { include: { employee: true } } },
  });
  const showRequester = tab !== "mine";

  return (
    <>
      <PageTitle right={<LinkButton href="/access-requests/new" variant="primary">+ Tạo yêu cầu quyền</LinkButton>}>Yêu cầu quyền</PageTitle>
      <Tabs tabs={tabs.map((t) => ({ ...t, href: `?tab=${t.key}` }))} active={tab} />
      <form className="mb-4 flex items-center gap-3 text-sm">
        <input type="hidden" name="tab" value={tab} />
        <select name="status" defaultValue={sp.status ?? ""} className="rounded-md border border-gray-300 px-2 py-1.5">
          <option value="">Trạng thái: Tất cả</option>
          {Object.entries(AR_STATUS).map(([v, [l]]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <input name="q" defaultValue={sp.q} placeholder="Tìm mã, quyền, người yêu cầu" className="w-64 rounded-md border border-gray-300 px-3 py-1.5" />
        <button className="text-blue-600 hover:underline">Lọc</button>
      </form>
      <Table
        head={["Mã", ...(showRequester ? ["Người yêu cầu"] : []), "Quyền", "Mức", "Gửi ngày", "Trạng thái", "Đang chờ"]}
        empty={rows.length ? undefined : "Bạn chưa có yêu cầu quyền nào."}
      >
        {rows.map((r) => {
          const t = tasks.find((x) => x.objectId === r.id);
          const isMe = t?.assigneeId === actor.userId;
          return (
            <tr key={r.id} className="hover:bg-gray-50">
              <Td>
                <Link href={`/access-requests/${r.requestCode}`} className="font-medium text-blue-600 hover:underline">
                  {r.requestCode}
                </Link>
              </Td>
              {showRequester && <Td>{r.requester.fullName}</Td>}
              <Td>{r.access.name}</Td>
              <Td>{r.accessLevel}</Td>
              <Td>{fmtDay(r.createdAt)}</Td>
              <Td>
                <StatusBadge map={AR_STATUS} value={r.status} />
              </Td>
              <Td>
                {t ? (
                  r.status === "NEED_INFO" ? (
                    <span>
                      {isMe ? "Bạn" : t.assignee.employee.fullName} · {Math.max(0, Math.floor((now.getTime() - t.createdAt.getTime()) / 86_400_000))} ngày
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      {r.status === "PENDING_PROVISION" ? "IT" : t.assignee.employee.fullName} · hạn {fmtDay(t.dueAt)} <OverdueBadge label={overdueLabel(t, now)} />
                    </span>
                  )
                ) : (
                  "–"
                )}
              </Td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
