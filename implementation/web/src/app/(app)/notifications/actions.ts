"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireActor } from "@/server/session";

export async function markAllRead() {
  const actor = await requireActor();
  await db.notification.updateMany({ where: { recipientId: actor.userId, isRead: false }, data: { isRead: true } });
  revalidatePath("/", "layout");
}
