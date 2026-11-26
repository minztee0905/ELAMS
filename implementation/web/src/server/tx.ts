import { Prisma } from "@prisma/client";
import { db, type Tx } from "@/lib/db";
import { BusinessError, ForbiddenError } from "@/lib/errors";

export class SystemError extends Error {
  constructor(public readonly cause: unknown) {
    super("SYSTEM_ERROR");
    this.name = "SystemError";
  }
}

/**
 * NFR-03: thao tác ghi nhiều bản ghi là trọn gói.
 * Lỗi nghiệp vụ được giữ nguyên; lỗi khác đổi thành SystemError (NFR-05).
 */
export async function inTx<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  try {
    return await db.$transaction(fn, { timeout: 15_000 });
  } catch (e) {
    if (e instanceof BusinessError || e instanceof ForbiddenError) throw e;
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      // Vi phạm ràng buộc duy nhất: thường do gửi hai lần cùng lúc (NFR-04).
      throw new BusinessError("Thao tác này đã được ghi nhận trước đó. Vui lòng tải lại trang.", {}, "DUPLICATE");
    }
    console.error(e);
    throw new SystemError(e);
  }
}

/** Khóa dòng để tránh hai người cùng xử lý một đối tượng. */
export async function lockRow(tx: Tx, table: "task" | "onboarding_request" | "offboarding_request" | "access_request", id: number) {
  const pk = { task: "task_id", onboarding_request: "onboarding_id", offboarding_request: "offboarding_id", access_request: "request_id" }[table];
  await tx.$queryRawUnsafe(`SELECT 1 FROM "${table}" WHERE "${pk}" = $1 FOR UPDATE`, id);
}

/** Lấy nhiệm vụ còn mở, giao cho người dùng, đã khóa dòng. */
export async function claimTask(tx: Tx, taskId: number, userId: number) {
  await lockRow(tx, "task", taskId);
  const task = await tx.task.findUnique({ where: { id: taskId } });
  if (!task || task.assigneeId !== userId) throw new ForbiddenError();
  if (task.status !== "OPEN" && task.status !== "WAITING") {
    throw new BusinessError("Nhiệm vụ này đã được xử lý. Vui lòng tải lại trang.", {}, "TASK_CLOSED");
  }
  return task;
}
