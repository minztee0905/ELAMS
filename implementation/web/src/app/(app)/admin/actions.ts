"use server";

// FR-GEN-11: quản trị danh mục. Ngừng sử dụng thay vì xóa mục đã được tham chiếu.
import type { ActiveStatus, DeviceType, Role, UserStatus } from "@prisma/client";
import type { ActionState } from "@/lib/action-state";
import { BusinessError, ForbiddenError, MSG } from "@/lib/errors";
import { runAction, num, str } from "@/server/action";
import { audit } from "@/server/audit";
import type { Actor } from "@/server/session";
import { inTx } from "@/server/tx";

function admin(a: Actor) {
  if (a.role !== "ADMIN") throw new ForbiddenError();
}

function levelsOk(s: string) {
  const parts = s.split(",").map((x) => x.trim()).filter(Boolean);
  if (!parts.length) throw new BusinessError(MSG.REQUIRED("các mức quyền"), { accessLevels: MSG.REQUIRED("các mức quyền") });
  return parts.join(", ");
}

export async function saveAccessAction(_: ActionState, fd: FormData) {
  return runAction((a, now) =>
    inTx(async (tx) => {
      admin(a);
      const id = num(fd, "id");
      const data = {
        accessLevels: levelsOk(str(fd, "accessLevels")),
        isSensitive: fd.get("isSensitive") === "on",
        status: str(fd, "status") as ActiveStatus,
      };
      if (id) {
        const before = await tx.accessCatalog.findUniqueOrThrow({ where: { id } });
        await tx.accessCatalog.update({ where: { id }, data });
        await audit(tx, {
          actorId: a.userId,
          action: "ADMIN_UPDATE",
          objectType: "CATALOG",
          objectId: id,
          reason: `${before.name}: mức “${before.accessLevels}” → “${data.accessLevels}”, nhạy cảm ${before.isSensitive} → ${data.isSensitive}, ${before.status} → ${data.status}`,
          now,
        });
      } else {
        const name = str(fd, "name");
        if (!name) throw new BusinessError(MSG.REQUIRED("tên quyền"), { name: MSG.REQUIRED("tên quyền") });
        const c = await tx.accessCatalog.create({ data: { ...data, name, systemId: num(fd, "systemId") } });
        await audit(tx, { actorId: a.userId, action: "ADMIN_UPDATE", objectType: "CATALOG", objectId: c.id, reason: `Thêm quyền ${name}`, now });
      }
      return { message: "Đã lưu danh mục quyền." };
    }),
  );
}

export async function saveSystemAction(_: ActionState, fd: FormData) {
  return runAction((a, now) =>
    inTx(async (tx) => {
      admin(a);
      const id = num(fd, "id");
      if (id) {
        await tx.targetSystem.update({ where: { id }, data: { status: str(fd, "status") as ActiveStatus } });
      } else {
        const name = str(fd, "name");
        if (!name) throw new BusinessError(MSG.REQUIRED("tên hệ thống"));
        await tx.targetSystem.create({ data: { name } });
      }
      await audit(tx, { actorId: a.userId, action: "ADMIN_UPDATE", objectType: "CATALOG", objectId: id, reason: `Hệ thống đích ${str(fd, "name") || id}`, now });
      return { message: "Đã lưu hệ thống đích." };
    }),
  );
}

export async function saveOrgAction(_: ActionState, fd: FormData) {
  return runAction((a, now) =>
    inTx(async (tx) => {
      admin(a);
      const kind = str(fd, "kind");
      const id = num(fd, "id");
      const name = str(fd, "name");
      const model = kind === "department" ? tx.department : tx.jobTitle;
      if (id) await (model as typeof tx.department).update({ where: { id }, data: { status: str(fd, "status") as ActiveStatus } });
      else {
        if (!name) throw new BusinessError(MSG.REQUIRED("tên"));
        await (model as typeof tx.department).create({ data: { name } });
      }
      await audit(tx, { actorId: a.userId, action: "ADMIN_UPDATE", objectType: "CATALOG", objectId: id, reason: `${kind === "department" ? "Phòng ban" : "Chức danh"} ${name || id}`, now });
      return { message: "Đã lưu." };
    }),
  );
}

export async function saveTemplateAction(_: ActionState, fd: FormData) {
  return runAction((a, now) =>
    inTx(async (tx) => {
      admin(a);
      const op = str(fd, "op");
      const jobTitleId = num(fd, "jobTitleId");
      if (op === "addAccess") {
        const max = await tx.positionAccessTemplate.aggregate({ where: { jobTitleId }, _max: { sequenceNo: true } });
        await tx.positionAccessTemplate.create({
          data: {
            jobTitleId,
            accessId: num(fd, "accessId"),
            defaultLevel: str(fd, "defaultLevel"),
            isMandatory: fd.get("isMandatory") === "on",
            sequenceNo: (max._max.sequenceNo ?? 0) + 1,
          },
        });
      } else if (op === "delAccess") {
        await tx.positionAccessTemplate.delete({ where: { id: num(fd, "id") } });
      } else if (op === "addDevice") {
        await tx.positionDeviceTemplate.create({ data: { jobTitleId, deviceType: str(fd, "deviceType") as DeviceType, configNote: str(fd, "configNote") || null } });
      } else if (op === "delDevice") {
        await tx.positionDeviceTemplate.delete({ where: { id: num(fd, "id") } });
      }
      await audit(tx, { actorId: a.userId, action: "ADMIN_UPDATE", objectType: "CATALOG", objectId: jobTitleId, reason: `Mẫu chức danh: ${op}`, now });
      return { message: "Đã cập nhật mẫu." };
    }),
  );
}

export async function saveUserAction(_: ActionState, fd: FormData) {
  return runAction((a, now) =>
    inTx(async (tx) => {
      admin(a);
      const employeeId = num(fd, "employeeId");
      const managerId = num(fd, "managerId") || null;
      if (managerId === employeeId) throw new BusinessError("Nhân viên không thể là Manager của chính mình.");
      await tx.employee.update({ where: { id: employeeId }, data: { managerId } });
      const user = await tx.appUser.findUnique({ where: { employeeId } });
      if (user) {
        await tx.appUser.update({ where: { id: user.id }, data: { role: str(fd, "role") as Role, status: str(fd, "status") as UserStatus } });
      }
      await audit(tx, {
        actorId: a.userId,
        action: "ADMIN_UPDATE",
        objectType: "APP_USER",
        objectId: user?.id ?? 0,
        reason: `Nhân viên #${employeeId}: Manager ${managerId ?? "–"}, vai trò ${str(fd, "role")}, ${str(fd, "status")}`,
        now,
      });
      return { message: "Đã lưu người dùng." };
    }),
  );
}

export async function saveDeviceAction(_: ActionState, fd: FormData) {
  return runAction((a, now) =>
    inTx(async (tx) => {
      admin(a);
      const assetCode = str(fd, "assetCode");
      if (!assetCode) throw new BusinessError(MSG.REQUIRED("mã tài sản"));
      const d = await tx.device.create({
        data: { assetCode, deviceType: str(fd, "deviceType") as DeviceType, description: str(fd, "description") || null, status: "IN_STOCK" },
      });
      await audit(tx, { actorId: a.userId, action: "ADMIN_UPDATE", objectType: "CATALOG", objectId: d.id, reason: `Thêm thiết bị ${assetCode}`, now });
      return { message: `Đã thêm ${assetCode}.` };
    }),
  );
}
