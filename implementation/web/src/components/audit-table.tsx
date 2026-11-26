// Thẻ Lịch sử thao tác (UC-ON-09, FR-GEN-10): chỉ xem và lọc, không sửa/xóa.
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { fmtDateTime, parseDateInput } from "@/lib/dates";
import { ACTION_LABEL, ROLE_LABEL } from "@/lib/labels";
import { Badge, Table, Td } from "./ui";

export type AuditFilter = { action?: string; actor?: string; from?: string; to?: string; order?: string; case?: string };

export async function AuditTable({ caseCode, filter, baseHref }: { caseCode?: string; filter: AuditFilter; baseHref: string }) {
  const where: Prisma.AuditLogWhereInput = {};
  if (caseCode) where.caseCode = caseCode;
  else if (filter.case) where.caseCode = { contains: filter.case.trim(), mode: "insensitive" };
  if (filter.action) where.action = filter.action;
  if (filter.actor) where.actorId = Number(filter.actor);
  const from = filter.from ? parseDateInput(filter.from) : null;
  const to = filter.to ? parseDateInput(filter.to) : null;
  if (from || to) {
    where.createdAt = {
      ...(from ? { gte: new Date(from.getTime() - 7 * 3600_000) } : {}),
      ...(to ? { lt: new Date(to.getTime() + 17 * 3600_000) } : {}),
    };
  }
  const asc = filter.order === "asc";
  const [rows, actors, actions] = await Promise.all([
    db.auditLog.findMany({ where, include: { actor: { include: { employee: true } } }, orderBy: { id: asc ? "asc" : "desc" }, take: 300 }),
    db.appUser.findMany({ include: { employee: true }, orderBy: { id: "asc" } }),
    db.auditLog.findMany({ where: caseCode ? { caseCode } : {}, distinct: ["action"], select: { action: true } }),
  ]);
  const sep = baseHref.includes("?") ? "&" : "?";
  const toggle = new URLSearchParams(Object.entries({ ...filter, order: asc ? "desc" : "asc" }).filter(([, v]) => v) as [string, string][]);

  return (
    <div className="space-y-4">
      <form action={baseHref.split("?")[0]} className="flex flex-wrap items-end gap-3 text-sm">
        {baseHref.includes("tab=") && <input type="hidden" name="tab" value="audit" />}
        {!caseCode && (
          <label>
            <span className="block text-xs text-gray-500">Mã yêu cầu</span>
            <input name="case" defaultValue={filter.case} className="w-36 rounded-md border border-gray-300 px-2 py-1.5" />
          </label>
        )}
        <label>
          <span className="block text-xs text-gray-500">Loại thao tác</span>
          <select name="action" defaultValue={filter.action ?? ""} className="rounded-md border border-gray-300 px-2 py-1.5">
            <option value="">Tất cả</option>
            {actions.map((a) => (
              <option key={a.action} value={a.action}>
                {ACTION_LABEL[a.action] ?? a.action}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="block text-xs text-gray-500">Người thực hiện</span>
          <select name="actor" defaultValue={filter.actor ?? ""} className="rounded-md border border-gray-300 px-2 py-1.5">
            <option value="">Tất cả</option>
            {actors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.employee.fullName}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="block text-xs text-gray-500">Từ ngày</span>
          <input type="date" name="from" defaultValue={filter.from} className="rounded-md border border-gray-300 px-2 py-1" />
        </label>
        <label>
          <span className="block text-xs text-gray-500">Đến ngày</span>
          <input type="date" name="to" defaultValue={filter.to} className="rounded-md border border-gray-300 px-2 py-1" />
        </label>
        <button className="rounded-md border border-gray-300 px-3 py-1.5">Lọc</button>
        <Link href={`${baseHref}${sep}${toggle.toString()}`} className="py-1.5 text-blue-600 hover:underline" scroll={false}>
          {asc ? "Cũ nhất trước ↑" : "Mới nhất trước ↓"}
        </Link>
      </form>
      <Table
        head={["Thời điểm", "Người thực hiện", "Vai trò", "Thao tác", "Đối tượng", "Kết quả", "Lý do"]}
        empty={rows.length ? undefined : "Không có bản ghi."}
      >
        {rows.map((r) => (
          <tr key={r.id}>
            <Td className="whitespace-nowrap">{fmtDateTime(r.createdAt)}</Td>
            <Td>{r.actor ? r.actor.employee.fullName : "ELAMS (tự động)"}</Td>
            <Td>{r.actor ? ROLE_LABEL[r.actor.role] : "–"}</Td>
            <Td>{ACTION_LABEL[r.action] ?? r.action}</Td>
            <Td className="whitespace-nowrap">
              {r.caseCode ?? r.objectType}
              {r.caseCode ? "" : ` #${r.objectId}`}
            </Td>
            <Td>
              <Badge tone={r.result === "SUCCESS" ? "green" : "red"}>{r.result === "SUCCESS" ? "Thành công" : "Thất bại"}</Badge>
            </Td>
            <Td className="max-w-md text-gray-700">{r.reason}</Td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
