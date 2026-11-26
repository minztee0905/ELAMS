import { revalidatePath } from "next/cache";
import { BusinessError, ForbiddenError, MSG } from "@/lib/errors";
import type { ActionState } from "@/lib/action-state";
import { SystemError } from "./tx";
import { getNow } from "./clock";
import { requireActor, type Actor } from "./session";

/** Chạy một thao tác ghi và đổi lỗi thành trạng thái hiển thị (NFR-05). */
export async function runAction(
  fn: (actor: Actor, now: Date) => Promise<ActionState | { message?: string; ok?: boolean } | void>,
  systemMessage: string = MSG.SYSTEM_ERROR,
): Promise<ActionState> {
  const actor = await requireActor();
  const now = await getNow();
  const at = Date.now();
  try {
    const r: ActionState = ((await fn(actor, now)) ?? {}) as ActionState;
    revalidatePath("/", "layout");
    return { ok: r.ok ?? true, message: r.message, data: r.data, at };
  } catch (e) {
    if (e instanceof BusinessError) return { ok: false, error: e.message, fieldErrors: e.fieldErrors, code: e.code, link: e.link, at };
    if (e instanceof ForbiddenError) return { ok: false, error: e.message, at };
    if (!(e instanceof SystemError)) console.error(e);
    return { ok: false, error: systemMessage, at };
  }
}

export const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
export const num = (fd: FormData, k: string) => Number(fd.get(k) ?? 0);
