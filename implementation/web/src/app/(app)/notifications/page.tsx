import Link from "next/link";
import { db } from "@/lib/db";
import { fmtDateTime } from "@/lib/dates";
import { Card, PageTitle } from "@/components/ui";
import { requireActor } from "@/server/session";
import { markAllRead } from "./actions";

export default async function NotificationsPage() {
  const actor = await requireActor();
  const items = await db.notification.findMany({ where: { recipientId: actor.userId }, orderBy: { id: "desc" }, take: 100 });
  return (
    <>
      <PageTitle
        right={
          <form action={markAllRead}>
            <button className="text-sm text-blue-600 hover:underline">Đánh dấu đã đọc tất cả</button>
          </form>
        }
      >
        Thông báo
      </PageTitle>
      <Card className="p-0">
        {items.length === 0 && <p className="p-6 text-sm text-gray-500">Chưa có thông báo.</p>}
        <ul className="divide-y divide-gray-100">
          {items.map((n) => (
            <li key={n.id} className={n.isRead ? "px-6 py-3" : "bg-blue-50/40 px-6 py-3"}>
              <p className="text-sm">
                {!n.isRead && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-600" />}
                {n.link ? (
                  <Link href={n.link} className="hover:underline">
                    {n.message}
                  </Link>
                ) : (
                  n.message
                )}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {fmtDateTime(n.createdAt)} · Email: {n.sendStatus === "SENT" ? "đã gửi" : "gửi lỗi"}
              </p>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
