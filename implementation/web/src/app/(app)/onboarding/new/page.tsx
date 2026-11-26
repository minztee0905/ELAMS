import { db } from "@/lib/db";
import { Breadcrumb, Forbidden } from "@/components/ui";
import { auditDenied } from "@/server/authz";
import { requireActor } from "@/server/session";
import { getNow } from "@/server/clock";
import { toDateInput, vnDateOnly } from "@/lib/dates";
import { parseLevels } from "@/server/ledger";
import { OnboardingForm } from "./form";

export default async function NewOnboardingPage() {
  const actor = await requireActor();
  if (actor.role !== "HR") {
    await auditDenied(actor, "Mở SCR-ON-01 Tạo yêu cầu onboarding");
    return <Forbidden />;
  }
  const [departments, titles, managers, catalog, accessTpl, deviceTpl, now] = await Promise.all([
    db.department.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" } }),
    db.jobTitle.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" } }),
    db.appUser.findMany({ where: { role: "MANAGER", status: "ACTIVE" }, include: { employee: true } }),
    db.accessCatalog.findMany({ where: { status: "ACTIVE" }, include: { system: true }, orderBy: { name: "asc" } }),
    db.positionAccessTemplate.findMany({ orderBy: { sequenceNo: "asc" } }),
    db.positionDeviceTemplate.findMany(),
    getNow(),
  ]);
  return (
    <>
      <Breadcrumb items={[{ label: "Onboarding", href: "/onboarding" }, { label: "Tạo yêu cầu onboarding" }]} />
      <OnboardingForm
        today={toDateInput(vnDateOnly(now))}
        departments={departments.map((d) => ({ id: d.id, name: d.name }))}
        titles={titles.map((t) => ({ id: t.id, name: t.name }))}
        managers={managers.map((m) => ({ id: m.employeeId, name: m.employee.fullName, departmentId: m.employee.departmentId }))}
        catalog={catalog.map((c) => ({ id: c.id, name: c.name, system: c.system.name, levels: parseLevels(c.accessLevels), sensitive: c.isSensitive }))}
        accessTpl={accessTpl.map((t) => ({ jobTitleId: t.jobTitleId, accessId: t.accessId, level: t.defaultLevel, mandatory: t.isMandatory }))}
        deviceTpl={deviceTpl.map((t) => ({ jobTitleId: t.jobTitleId, deviceType: t.deviceType, note: t.configNote ?? "" }))}
      />
    </>
  );
}
