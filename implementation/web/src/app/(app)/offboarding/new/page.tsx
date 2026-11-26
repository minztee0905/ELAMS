// SCR-OFF-01 – Tạo yêu cầu offboarding.
import { db } from "@/lib/db";
import { Breadcrumb, Forbidden } from "@/components/ui";
import { auditDenied } from "@/server/authz";
import { getNow } from "@/server/clock";
import { requireActor } from "@/server/session";
import { toDateInput, vnDateOnly } from "@/lib/dates";
import { OffboardingForm } from "./form";

export default async function NewOffboarding() {
  const actor = await requireActor();
  if (actor.role !== "HR") {
    await auditDenied(actor, "Mở SCR-OFF-01 Tạo yêu cầu offboarding");
    return <Forbidden />;
  }
  const employees = await db.employee.findMany({ where: { status: "ACTIVE" }, include: { jobTitle: true }, orderBy: { fullName: "asc" } });
  return (
    <>
      <Breadcrumb items={[{ label: "Offboarding", href: "/offboarding" }, { label: "Tạo yêu cầu offboarding" }]} />
      <OffboardingForm today={toDateInput(vnDateOnly(await getNow()))} employees={employees.map((e) => ({ id: e.id, label: `${e.fullName} – ${e.jobTitle.name}` }))} />
    </>
  );
}
