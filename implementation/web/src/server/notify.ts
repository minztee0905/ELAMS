// FR-GEN-05: thông báo trong ứng dụng và email.
// Bản chạy trên máy không có máy chủ email: email được ghi ra console.
import type { Tx } from "@/lib/db";

export async function notify(
  tx: Tx,
  recipientId: number,
  message: string,
  now: Date,
  opts: { link?: string; taskId?: number } = {},
) {
  await tx.notification.create({
    data: {
      recipientId,
      message: message.slice(0, 500),
      link: opts.link,
      taskId: opts.taskId,
      sendStatus: "SENT",
      createdAt: now,
    },
  });
  if (process.env.NODE_ENV !== "test" && !process.env.VITEST) {
    console.info(`[email] to user#${recipientId}: ${message}`);
  }
}

export async function notifyRole(tx: Tx, role: "HR" | "IT" | "SECURITY", message: string, now: Date, link?: string) {
  const users = await tx.appUser.findMany({ where: { role, status: "ACTIVE" } });
  for (const u of users) await notify(tx, u.id, message, now, { link });
}
