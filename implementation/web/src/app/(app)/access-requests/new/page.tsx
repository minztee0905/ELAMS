// SCR-AC-01 – Tạo yêu cầu cấp quyền.
import { db } from "@/lib/db";
import { MSG } from "@/lib/errors";
import { Alert, Breadcrumb, Card, SectionTitle } from "@/components/ui";
import { resolveApprover } from "@/server/access-request";
import { getNow } from "@/server/clock";
import { parseLevels } from "@/server/ledger";
import { requireActor } from "@/server/session";
import { toDateInput, vnDateOnly } from "@/lib/dates";
import { ArForm } from "./form";

export default async function NewAccessRequest() {
  const actor = await requireActor();
  const now = await getNow();
  const me = await db.employee.findUniqueOrThrow({ where: { id: actor.employeeId }, include: { jobTitle: true, department: true } });
  const approver = await resolveApprover(db, actor.employeeId);
  const [catalog, grants] = await Promise.all([
    db.accessCatalog.findMany({ where: { status: "ACTIVE" }, include: { system: true }, orderBy: { name: "asc" } }),
    db.accessGrant.findMany({ where: { employeeId: actor.employeeId, status: "ACTIVE", accessId: { not: null } } }),
  ]);
  return (
    <>
      <Breadcrumb items={[{ label: "Quyền truy cập", href: "/access-requests" }, { label: "Tạo yêu cầu cấp quyền" }]} />
      <div className="max-w-3xl space-y-5">
        <Card>
          <SectionTitle>Người yêu cầu</SectionTitle>
          <p className="text-sm">
            {me.fullName} · {me.jobTitle.name} · Phòng {me.department.name}
          </p>
          {approver ? (
            <p className="mt-1 text-sm text-gray-600">
              Người duyệt: {approver.employee.fullName} ({actor.role === "MANAGER" ? "cấp trên trực tiếp" : "Manager trực tiếp"})
            </p>
          ) : (
            <div className="mt-3">
              <Alert tone="error" title={MSG.AR_NO_APPROVER} />
            </div>
          )}
        </Card>
        {approver && (
          <ArForm
            today={toDateInput(vnDateOnly(now))}
            catalog={catalog.map((c) => ({ id: c.id, name: c.name, system: c.system.name, sensitive: c.isSensitive, levels: parseLevels(c.accessLevels) }))}
            grants={grants.map((g) => ({ accessId: g.accessId!, level: g.accessLevel }))}
          />
        )}
      </div>
    </>
  );
}
