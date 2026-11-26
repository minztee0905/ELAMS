// FR-GEN-11 – Quản trị danh mục (System Administrator).
import { db } from "@/lib/db";
import { DEVICE_TYPE, EMPLOYEE_STATUS, ROLE_LABEL } from "@/lib/labels";
import { Badge, Card, Forbidden, PageTitle, Table, Tabs, Td } from "@/components/ui";
import { auditDenied } from "@/server/authz";
import { requireActor } from "@/server/session";
import { RowForm } from "./forms";
import { saveAccessAction, saveDeviceAction, saveOrgAction, saveSystemAction, saveTemplateAction, saveUserAction } from "./actions";

const sel = "rounded-md border border-gray-300 px-2 py-1.5 text-sm";
const inp = "rounded-md border border-gray-300 px-2 py-1.5 text-sm";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string; title?: string }> }) {
  const actor = await requireActor();
  if (actor.role !== "ADMIN") {
    await auditDenied(actor, "Mở Quản trị danh mục");
    return <Forbidden />;
  }
  const sp = await searchParams;
  const tab = sp.tab ?? "access";
  const tabs = [
    { key: "access", label: "Danh mục quyền" },
    { key: "templates", label: "Mẫu theo chức danh" },
    { key: "users", label: "Người dùng và Manager" },
    { key: "devices", label: "Thiết bị" },
    { key: "org", label: "Hệ thống, phòng ban, chức danh" },
  ].map((t) => ({ ...t, href: `?tab=${t.key}` }));

  return (
    <>
      <PageTitle>Quản trị danh mục</PageTitle>
      <Card>
        <Tabs tabs={tabs} active={tab} />
        {tab === "access" && <AccessTab />}
        {tab === "templates" && <TemplatesTab titleId={Number(sp.title) || 0} />}
        {tab === "users" && <UsersTab />}
        {tab === "devices" && <DevicesTab />}
        {tab === "org" && <OrgTab />}
      </Card>
    </>
  );
}

async function AccessTab() {
  const [rows, systems] = await Promise.all([
    db.accessCatalog.findMany({ include: { system: true }, orderBy: [{ systemId: "asc" }, { name: "asc" }] }),
    db.targetSystem.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" } }),
  ]);
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600">Cờ nhạy cảm quyết định quyền có cần Security duyệt (BR-AC-03). Đổi danh mục sau khi đã duyệt làm phê duyệt mất hiệu lực (giả định Q-37).</p>
      <Table head={["Quyền", "Hệ thống", "Các mức · Nhạy cảm · Trạng thái"]}>
        {rows.map((r) => (
          <tr key={r.id}>
            <Td className="font-medium">{r.name}</Td>
            <Td>{r.system.name}</Td>
            <Td>
              <RowForm action={saveAccessAction}>
                <input type="hidden" name="id" value={r.id} />
                <input name="accessLevels" defaultValue={r.accessLevels} className={`${inp} w-48`} />
                <label className="flex items-center gap-1 text-sm">
                  <input type="checkbox" name="isSensitive" defaultChecked={r.isSensitive} /> Nhạy cảm
                </label>
                <select name="status" defaultValue={r.status} className={sel}>
                  <option value="ACTIVE">Đang dùng</option>
                  <option value="INACTIVE">Ngừng sử dụng</option>
                </select>
              </RowForm>
            </Td>
          </tr>
        ))}
      </Table>
      <div>
        <p className="mb-2 text-sm font-semibold">Thêm quyền</p>
        <RowForm action={saveAccessAction}>
          <input name="name" placeholder="Tên quyền" className={inp} />
          <select name="systemId" className={sel}>
            {systems.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <input name="accessLevels" placeholder="Xem, Ghi" className={`${inp} w-40`} />
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" name="isSensitive" /> Nhạy cảm
          </label>
          <input type="hidden" name="status" value="ACTIVE" />
        </RowForm>
      </div>
    </div>
  );
}

async function TemplatesTab({ titleId }: { titleId: number }) {
  const titles = await db.jobTitle.findMany({ orderBy: { name: "asc" } });
  const title = titles.find((t) => t.id === titleId) ?? titles[0];
  const [access, devices, catalog] = await Promise.all([
    db.positionAccessTemplate.findMany({ where: { jobTitleId: title.id }, include: { access: { include: { system: true } } }, orderBy: { sequenceNo: "asc" } }),
    db.positionDeviceTemplate.findMany({ where: { jobTitleId: title.id } }),
    db.accessCatalog.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" } }),
  ]);
  return (
    <div className="space-y-5">
      <form className="flex items-center gap-2 text-sm">
        <input type="hidden" name="tab" value="templates" />
        <select name="title" defaultValue={title.id} className={sel}>
          {titles.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button className="text-blue-600 hover:underline">Xem mẫu</button>
      </form>
      <Table head={["#", "Quyền", "Mức mặc định", "Phân loại", ""]} empty={access.length ? undefined : "Chức danh chưa có mẫu quyền."}>
        {access.map((t) => (
          <tr key={t.id}>
            <Td>{t.sequenceNo}</Td>
            <Td>
              {t.access.name} · {t.access.system.name}
            </Td>
            <Td>{t.defaultLevel}</Td>
            <Td>{t.isMandatory ? "Bắt buộc" : "Không bắt buộc"}</Td>
            <Td>
              <RowForm action={saveTemplateAction}>
                <input type="hidden" name="op" value="delAccess" />
                <input type="hidden" name="id" value={t.id} />
                <input type="hidden" name="jobTitleId" value={title.id} />
                <span className="text-xs text-gray-500">Xóa khỏi mẫu</span>
              </RowForm>
            </Td>
          </tr>
        ))}
      </Table>
      <RowForm action={saveTemplateAction}>
        <input type="hidden" name="op" value="addAccess" />
        <input type="hidden" name="jobTitleId" value={title.id} />
        <select name="accessId" className={sel}>
          {catalog.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input name="defaultLevel" placeholder="Mức mặc định" className={`${inp} w-36`} />
        <label className="flex items-center gap-1 text-sm">
          <input type="checkbox" name="isMandatory" /> Bắt buộc
        </label>
      </RowForm>
      <Table head={["Thiết bị", "Ghi chú cấu hình", ""]} empty={devices.length ? undefined : "Chưa có mẫu thiết bị."}>
        {devices.map((d) => (
          <tr key={d.id}>
            <Td>{DEVICE_TYPE[d.deviceType]}</Td>
            <Td>{d.configNote ?? "–"}</Td>
            <Td>
              <RowForm action={saveTemplateAction}>
                <input type="hidden" name="op" value="delDevice" />
                <input type="hidden" name="id" value={d.id} />
                <input type="hidden" name="jobTitleId" value={title.id} />
                <span className="text-xs text-gray-500">Xóa khỏi mẫu</span>
              </RowForm>
            </Td>
          </tr>
        ))}
      </Table>
      <RowForm action={saveTemplateAction}>
        <input type="hidden" name="op" value="addDevice" />
        <input type="hidden" name="jobTitleId" value={title.id} />
        <select name="deviceType" className={sel}>
          {Object.entries(DEVICE_TYPE).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <input name="configNote" placeholder="Ghi chú cấu hình" className={inp} />
      </RowForm>
    </div>
  );
}

async function UsersTab() {
  const [emps, managers] = await Promise.all([
    db.employee.findMany({ include: { user: true, department: true, jobTitle: true }, orderBy: [{ departmentId: "asc" }, { fullName: "asc" }] }),
    db.employee.findMany({ where: { user: { role: "MANAGER" } }, orderBy: { fullName: "asc" } }),
  ]);
  return (
    <Table head={["Nhân viên", "Phòng ban · Chức danh", "Trạng thái", "Manager trực tiếp · Vai trò · Tài khoản"]}>
      {emps.map((e) => (
        <tr key={e.id}>
          <Td>
            <p className="font-medium">{e.fullName}</p>
            <p className="text-xs text-gray-500">{e.user?.username ?? "Chưa có tài khoản ELAMS"}</p>
          </Td>
          <Td>
            {e.department.name} · {e.jobTitle.name}
          </Td>
          <Td>
            <Badge>{EMPLOYEE_STATUS[e.status]}</Badge>
          </Td>
          <Td>
            <RowForm action={saveUserAction}>
              <input type="hidden" name="employeeId" value={e.id} />
              <select name="managerId" defaultValue={e.managerId ?? ""} className={sel}>
                <option value="">– Không có –</option>
                {managers
                  .filter((m) => m.id !== e.id)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName}
                    </option>
                  ))}
              </select>
              {e.user && (
                <>
                  <select name="role" defaultValue={e.user.role} className={sel}>
                    {Object.entries(ROLE_LABEL).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <select name="status" defaultValue={e.user.status} className={sel}>
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="DISABLED">Vô hiệu hóa</option>
                  </select>
                </>
              )}
            </RowForm>
          </Td>
        </tr>
      ))}
    </Table>
  );
}

async function DevicesTab() {
  const devices = await db.device.findMany({ include: { holder: true }, orderBy: { assetCode: "asc" } });
  const label = { IN_STOCK: "Trong kho", ASSIGNED: "Đang cấp", EXCEPTION_NOT_RETURNED: "Ngoại lệ – chưa thu hồi", RETIRED: "Thanh lý" };
  return (
    <div className="space-y-5">
      <Table head={["Mã tài sản", "Loại", "Mô tả", "Trạng thái", "Người giữ"]}>
        {devices.map((d) => (
          <tr key={d.id}>
            <Td className="font-medium">{d.assetCode}</Td>
            <Td>{DEVICE_TYPE[d.deviceType]}</Td>
            <Td>{d.description}</Td>
            <Td>
              <Badge tone={d.status === "IN_STOCK" ? "green" : d.status === "EXCEPTION_NOT_RETURNED" ? "purple" : "blue"}>{label[d.status]}</Badge>
            </Td>
            <Td>{d.holder?.fullName ?? "–"}</Td>
          </tr>
        ))}
      </Table>
      <div>
        <p className="mb-2 text-sm font-semibold">Thêm thiết bị vào kho</p>
        <RowForm action={saveDeviceAction}>
          <input name="assetCode" placeholder="LT-2026-0460" className={inp} />
          <select name="deviceType" className={sel}>
            {Object.entries(DEVICE_TYPE).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <input name="description" placeholder="Mô tả" className={inp} />
        </RowForm>
      </div>
    </div>
  );
}

async function OrgTab() {
  const [systems, depts, titles] = await Promise.all([
    db.targetSystem.findMany({ orderBy: { name: "asc" } }),
    db.department.findMany({ orderBy: { name: "asc" } }),
    db.jobTitle.findMany({ orderBy: { name: "asc" } }),
  ]);
  const statusSel = (v: string) => (
    <select name="status" defaultValue={v} className={sel}>
      <option value="ACTIVE">Đang dùng</option>
      <option value="INACTIVE">Ngừng sử dụng</option>
    </select>
  );
  const block = (title: string, rows: { id: number; name: string; status: string }[], action: typeof saveOrgAction, kind?: string) => (
    <div>
      <p className="mb-2 text-sm font-semibold">{title}</p>
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center gap-3 text-sm">
            <span className="w-56">{r.name}</span>
            <RowForm action={action}>
              <input type="hidden" name="id" value={r.id} />
              {kind && <input type="hidden" name="kind" value={kind} />}
              {statusSel(r.status)}
            </RowForm>
          </li>
        ))}
      </ul>
      <RowForm action={action} className="mt-2 flex items-center gap-2">
        {kind && <input type="hidden" name="kind" value={kind} />}
        <input name="name" placeholder="Thêm mới" className={inp} />
      </RowForm>
    </div>
  );
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {block("Hệ thống đích", systems, saveSystemAction)}
      {block("Phòng ban", depts, saveOrgAction, "department")}
      {block("Chức danh", titles, saveOrgAction, "title")}
    </div>
  );
}
