// Dữ liệu mẫu theo nhân vật trong kịch bản UAT (validation/uat-*.md).
// Chạy: npm run db:seed (xóa sạch dữ liệu cũ).
import { PrismaClient, type DeviceType, type Role } from "@prisma/client";
import { createOnboarding } from "../src/server/onboarding";
import { submitAccessRequest } from "../src/server/access-request";
import type { Actor } from "../src/server/session";
import { addDays, vnDateOnly } from "../src/lib/dates";

const db = new PrismaClient();

export async function reset() {
  const tables = await db.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'`;
  const list = tables.map((t) => `"${t.tablename}"`).join(", ");
  await db.$executeRawUnsafe(`TRUNCATE ${list} RESTART IDENTITY CASCADE`);
}

export async function seed(opts: { scenarios?: boolean; now?: Date } = {}) {
  const scenarios = opts.scenarios ?? true;
  await reset();
  const now = opts.now ?? new Date();
  const today = vnDateOnly(now);

  // --- Tổ chức
  const dept = Object.fromEntries(
    await Promise.all(
      ["Ban Giám đốc", "Kế toán", "Kinh doanh", "Nhân sự", "Công nghệ thông tin"].map(async (name) => [
        name,
        await db.department.create({ data: { name } }),
      ]),
    ),
  );
  const titles = Object.fromEntries(
    await Promise.all(
      [
        "Giám đốc Tài chính",
        "Trưởng phòng Kế toán",
        "Trưởng phòng Kinh doanh",
        "Kế toán viên",
        "Kế toán tổng hợp",
        "Nhân viên kinh doanh",
        "Chuyên viên Nhân sự",
        "Chuyên viên IT",
        "Chuyên viên An ninh thông tin",
        "Quản trị hệ thống",
        "Thực tập sinh",
      ].map(async (name) => [name, await db.jobTitle.create({ data: { name } })]),
    ),
  );

  let seq = 1;
  async function person(
    fullName: string,
    email: string,
    deptName: string,
    titleName: string,
    managerId: number | null,
    role: Role | null,
    username: string,
    startDate = "2024-03-01",
  ) {
    const e = await db.employee.create({
      data: {
        employeeCode: `NV24${String(seq++).padStart(4, "0")}`,
        fullName,
        personalEmail: email,
        departmentId: dept[deptName].id,
        jobTitleId: titles[titleName].id,
        managerId,
        status: "ACTIVE",
        startDate: new Date(`${startDate}T00:00:00Z`),
      },
    });
    if (role) await db.appUser.create({ data: { employeeId: e.id, username, role } });
    return e;
  }

  const duc = await person("Phan Văn Đức", "duc.phan@gmail.com", "Ban Giám đốc", "Giám đốc Tài chính", null, "MANAGER", "duc.phan");
  const binh = await person("Trần Thị Bình", "binh.tran@gmail.com", "Kế toán", "Trưởng phòng Kế toán", duc.id, "MANAGER", "binh.tran");
  const huy = await person("Hoàng Gia Huy", "huy.hoang@gmail.com", "Kinh doanh", "Trưởng phòng Kinh doanh", duc.id, "MANAGER", "huy.hoang");
  const ha = await person("Lê Thu Hà", "ha.le@gmail.com", "Nhân sự", "Chuyên viên Nhân sự", duc.id, "HR", "ha.le");
  const dung = await person("Phạm Quốc Dũng", "dung.pham@gmail.com", "Công nghệ thông tin", "Chuyên viên IT", duc.id, "IT", "dung.pham");
  await person("Đỗ Minh Khoa", "khoa.do@gmail.com", "Công nghệ thông tin", "Chuyên viên IT", duc.id, "IT", "khoa.do");
  const hai = await person("Võ Thanh Hải", "hai.vo@gmail.com", "Công nghệ thông tin", "Chuyên viên An ninh thông tin", duc.id, "SECURITY", "hai.vo");
  await person("Quản trị viên", "admin@technova.vn", "Công nghệ thông tin", "Quản trị hệ thống", duc.id, "ADMIN", "admin");
  const chau = await person("Lê Minh Châu", "chau.le@gmail.com", "Kế toán", "Kế toán viên", binh.id, "EMPLOYEE", "chau.le", "2025-06-02");
  const nam = await person("Hoàng Văn Nam", "nam.hoang@gmail.com", "Kế toán", "Kế toán tổng hợp", binh.id, "EMPLOYEE", "nam.hoang", "2023-09-04");
  const mai = await person("Trịnh Thu Mai", "mai.trinh@gmail.com", "Kinh doanh", "Nhân viên kinh doanh", huy.id, "EMPLOYEE", "mai.trinh", "2025-01-06");
  const vinh = await person("Đỗ Quang Vinh", "vinh.do@gmail.com", "Kinh doanh", "Nhân viên kinh doanh", huy.id, "EMPLOYEE", "vinh.do", "2025-02-03");

  // --- Danh mục quyền
  const sys = Object.fromEntries(
    await Promise.all(
      ["Microsoft 365", "MISA", "SharePoint", "CRM", "VPN"].map(async (name) => [name, await db.targetSystem.create({ data: { name } })]),
    ),
  );
  const acc = {
    email: await db.accessCatalog.create({ data: { systemId: sys["Microsoft 365"].id, name: "Email công ty", accessLevels: "Người dùng", isSensitive: false } }),
    misa: await db.accessCatalog.create({ data: { systemId: sys["MISA"].id, name: "Phần mềm kế toán", accessLevels: "Xem, Ghi, Quản trị", isSensitive: true } }),
    docs: await db.accessCatalog.create({ data: { systemId: sys["SharePoint"].id, name: "Kho tài liệu chung", accessLevels: "Đọc, Ghi", isSensitive: false } }),
    crm: await db.accessCatalog.create({ data: { systemId: sys["CRM"].id, name: "CRM nội bộ", accessLevels: "Xem, Ghi", isSensitive: false } }),
    vpn: await db.accessCatalog.create({ data: { systemId: sys["VPN"].id, name: "VPN truy cập từ xa", accessLevels: "Người dùng", isSensitive: true } }),
  };

  // Mẫu theo chức danh (BR-ON-01, BR-ON-09)
  const tpl = async (title: string, rows: [keyof typeof acc, string, boolean][], devices: [DeviceType, string | null][]) => {
    for (const [i, [k, level, mandatory]] of rows.entries()) {
      await db.positionAccessTemplate.create({
        data: { jobTitleId: titles[title].id, accessId: acc[k].id, defaultLevel: level, isMandatory: mandatory, sequenceNo: i + 1 },
      });
    }
    for (const [type, note] of devices) await db.positionDeviceTemplate.create({ data: { jobTitleId: titles[title].id, deviceType: type, configNote: note } });
  };
  await tpl("Kế toán viên", [["email", "Người dùng", true], ["misa", "Xem", true], ["docs", "Đọc", false]], [["LAPTOP", "Cấu hình kế toán"]]);
  await tpl("Kế toán tổng hợp", [["email", "Người dùng", true], ["misa", "Ghi", true], ["crm", "Xem", false]], [["LAPTOP", "Cấu hình kế toán"], ["MONITOR", null]]);
  await tpl("Nhân viên kinh doanh", [["email", "Người dùng", true], ["crm", "Ghi", true]], [["LAPTOP", null], ["PHONE", "Điện thoại công tác"]]);
  await tpl("Chuyên viên IT", [["email", "Người dùng", true], ["vpn", "Người dùng", true], ["docs", "Ghi", false]], [["LAPTOP", "Cấu hình kỹ thuật"]]);

  // --- Thiết bị
  const device = (assetCode: string, deviceType: DeviceType, description: string, holder?: number) =>
    db.device.create({ data: { assetCode, deviceType, description, status: holder ? "ASSIGNED" : "IN_STOCK", holderEmployeeId: holder ?? null } });
  await device("LT-2026-0457", "LAPTOP", "Dell Latitude 5450 · cấu hình kế toán");
  await device("LT-2026-0458", "LAPTOP", "Dell Latitude 5450");
  await device("LT-2026-0459", "LAPTOP", "ThinkPad T14");
  await device("MN-2026-0101", "MONITOR", "Dell 24 inch");
  await device("PH-2026-0021", "PHONE", "iPhone 15");
  await device("LT-2025-0188", "LAPTOP", "Dell Latitude 5440", nam.id);
  await device("MN-2025-0042", "MONITOR", "Dell 24 inch", nam.id);
  await device("LT-2025-0150", "LAPTOP", "Dell Latitude 5440", chau.id);
  await device("LT-2025-0201", "LAPTOP", "ThinkPad T14", mai.id);
  await device("LT-2025-0202", "LAPTOP", "ThinkPad T14", vinh.id);

  // --- Sổ quyền hiện có (cấp trước khi dùng ELAMS, coi như qua Onboarding)
  async function grant(empId: number, ident: string, a: keyof typeof acc, level: string) {
    const systemId = acc[a].systemId;
    const account =
      (await db.systemAccount.findUnique({ where: { employeeId_systemId: { employeeId: empId, systemId } } })) ??
      (await db.systemAccount.create({ data: { employeeId: empId, systemId, accountIdentifier: ident, status: "ACTIVE" } }));
    await db.accessGrant.create({
      data: { employeeId: empId, accessId: acc[a].id, accountId: account.id, accessLevel: level, source: "ONBOARDING", grantedAt: new Date("2025-01-01T02:00:00Z"), status: "ACTIVE" },
    });
  }
  await grant(nam.id, "nam.hoang", "email", "Người dùng");
  await grant(nam.id, "nam.hoang", "misa", "Ghi");
  await grant(nam.id, "nam.hoang", "crm", "Xem");
  await grant(chau.id, "chau.le", "email", "Người dùng");
  await grant(chau.id, "chau.le", "misa", "Xem");
  await grant(mai.id, "mai.trinh", "email", "Người dùng");
  await grant(vinh.id, "vinh.do", "email", "Người dùng");
  for (const [e, ident] of [[binh, "binh.tran"], [huy, "huy.hoang"], [duc, "duc.phan"], [ha, "ha.le"], [dung, "dung.pham"], [hai, "hai.vo"]] as const) {
    await grant(e.id, ident, "email", "Người dùng");
  }
  // Nam có VPN cấp ngoài ELAMS: chỉ có tài khoản, không có trong sổ quyền (IT bổ sung khi thu hồi).

  // --- Cấu hình
  const user = (empId: number) => db.appUser.findUniqueOrThrow({ where: { employeeId: empId } });
  const dungUser = await user(dung.id);
  const haiUser = await user(hai.id);
  await db.systemSetting.createMany({
    data: [
      { key: "assignee.IT", value: String(dungUser.id) },
      { key: "assignee.SECURITY", value: String(haiUser.id) },
    ],
  });

  const ids = { dept, titles, acc, sys, people: { duc, binh, huy, ha, dung, hai, chau, nam, mai, vinh } };
  if (!scenarios) return ids;

  // --- Một yêu cầu onboarding đang chạy, một yêu cầu quyền đang chờ (tạo qua chính logic nghiệp vụ)
  const actorOf = async (empId: number, fullName: string): Promise<Actor> => {
    const u = await user(empId);
    return { userId: u.id, employeeId: empId, role: u.role, fullName, username: u.username };
  };
  const haActor = await actorOf(ha.id, ha.fullName);
  const start = addDays(today, 5).toISOString().slice(0, 10);
  const tplRows = await db.positionAccessTemplate.findMany({ where: { jobTitleId: titles["Kế toán viên"].id }, orderBy: { sequenceNo: "asc" } });
  await createOnboarding(
    haActor,
    {
      fullName: "Nguyễn Văn An",
      personalEmail: "an.nguyen@gmail.com",
      departmentId: dept["Kế toán"].id,
      jobTitleId: titles["Kế toán viên"].id,
      startDate: start,
      managerId: binh.id,
      accesses: tplRows.map((t) => ({ accessId: t.accessId, level: t.defaultLevel, isMandatory: t.isMandatory, fromTemplate: true })),
      devices: [{ deviceType: "LAPTOP", configNote: "Cấu hình kế toán", fromTemplate: true }],
      note: "Cần cài sẵn phần mềm kế toán",
      submissionKey: "seed-onboarding-an",
    },
    now,
  );
  await submitAccessRequest(
    await actorOf(mai.id, mai.fullName),
    { accessId: acc.crm.id, level: "Ghi", reason: "Theo dõi khách hàng khu vực phía Nam", submissionKey: "seed-ar-mai" },
    now,
  );

  console.log("Seed xong:", await db.employee.count(), "nhân viên,", await db.appUser.count(), "tài khoản");
  return ids;
}

if (!process.env.VITEST) {
  seed()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => db.$disconnect());
}
