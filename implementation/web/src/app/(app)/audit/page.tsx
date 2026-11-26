// UC-ON-09, FR-GEN-10: lịch sử thao tác toàn hệ thống (Security, Admin).
import { AuditTable, type AuditFilter } from "@/components/audit-table";
import { Card, Forbidden, PageTitle } from "@/components/ui";
import { auditDenied, canViewAudit } from "@/server/authz";
import { requireActor } from "@/server/session";

export default async function AuditPage({ searchParams }: { searchParams: Promise<AuditFilter> }) {
  const actor = await requireActor();
  if (!canViewAudit(actor)) {
    await auditDenied(actor, "Mở lịch sử thao tác");
    return <Forbidden />;
  }
  return (
    <>
      <PageTitle>Lịch sử thao tác</PageTitle>
      <p className="mb-4 text-sm text-gray-500">Chỉ xem và lọc. Lịch sử không thể sửa hoặc xóa.</p>
      <Card>
        <AuditTable filter={await searchParams} baseHref="/audit" />
      </Card>
    </>
  );
}
