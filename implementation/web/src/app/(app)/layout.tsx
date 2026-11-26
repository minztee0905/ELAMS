import Link from "next/link";
import { db } from "@/lib/db";
import { fmtDateTime, toDateTimeInput } from "@/lib/dates";
import { ROLE_LABEL } from "@/lib/labels";
import { getClockOffset, getNow } from "@/server/clock";
import { requireActor } from "@/server/session";
import { logout } from "../login/actions";
import { NavLink } from "./nav-link";
import { runJobsNow, setClock } from "./demo-actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const actor = await requireActor();
  const [openTasks, unread, offset, now, emp] = await Promise.all([
    db.task.count({ where: { assigneeId: actor.userId, status: { in: ["OPEN", "WAITING"] } } }),
    db.notification.count({ where: { recipientId: actor.userId, isRead: false } }),
    getClockOffset(),
    getNow(),
    db.employee.findUniqueOrThrow({ where: { id: actor.employeeId } }),
  ]);
  const r = actor.role;
  const leaving = emp.status === "OFFBOARDING" && r === "EMPLOYEE"; // Q-44: chỉ thấy Việc cần làm

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
        <Link href="/tasks" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 font-bold text-white">E</span>
          <span className="text-lg font-semibold">ELAMS</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/notifications" className="relative text-gray-600 hover:text-gray-900" aria-label={`Thông báo (${unread} chưa đọc)`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            {unread > 0 && (
              <span className="absolute -top-1.5 -right-2 rounded-full bg-red-600 px-1.5 text-[10px] font-semibold text-white">{unread}</span>
            )}
          </Link>
          <div className="border-l border-gray-200 pl-5 text-right">
            <p className="text-sm font-medium">{actor.fullName}</p>
            <p className="text-xs text-gray-500">{ROLE_LABEL[r]}</p>
          </div>
          <form action={logout}>
            <button className="text-sm text-gray-500 hover:text-gray-900">Đăng xuất</button>
          </form>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="flex w-60 shrink-0 flex-col justify-between border-r border-gray-200 bg-white px-3 py-5">
          <nav className="space-y-1 text-sm">
            <NavLink href="/tasks">Việc cần làm ({openTasks})</NavLink>
            {!leaving && r !== "EMPLOYEE" && (
              <>
                <p className="px-3 pt-4 pb-1 text-xs font-semibold tracking-wide text-gray-400 uppercase">Onboarding</p>
                <NavLink href="/onboarding">Yêu cầu onboarding</NavLink>
                {r === "HR" && <NavLink href="/onboarding/new" sub>+ Tạo yêu cầu</NavLink>}
              </>
            )}
            {!leaving && (
              <>
                <p className="px-3 pt-4 pb-1 text-xs font-semibold tracking-wide text-gray-400 uppercase">Quyền truy cập</p>
                <NavLink href="/access-requests">Yêu cầu quyền</NavLink>
                <NavLink href="/access-requests/new" sub>+ Tạo yêu cầu quyền</NavLink>
              </>
            )}
            {!leaving && r !== "EMPLOYEE" && (
              <>
                <p className="px-3 pt-4 pb-1 text-xs font-semibold tracking-wide text-gray-400 uppercase">Offboarding</p>
                <NavLink href="/offboarding">Yêu cầu offboarding</NavLink>
                {r === "HR" && <NavLink href="/offboarding/new" sub>+ Tạo yêu cầu</NavLink>}
              </>
            )}
            {(r === "SECURITY" || r === "ADMIN") && (
              <>
                <p className="px-3 pt-4 pb-1 text-xs font-semibold tracking-wide text-gray-400 uppercase">Kiểm soát</p>
                <NavLink href="/audit">Lịch sử thao tác</NavLink>
              </>
            )}
            {r === "ADMIN" && <NavLink href="/admin">Quản trị danh mục</NavLink>}
          </nav>

          <div className="mt-8 rounded-md border border-dashed border-gray-300 p-3 text-xs text-gray-600">
            <p className="mb-1 font-semibold text-gray-700">Đồng hồ demo</p>
            <p className="mb-2">
              {fmtDateTime(now)}
              {offset !== 0 && <span className="ml-1 rounded bg-amber-100 px-1 text-amber-800">giả lập</span>}
            </p>
            <form action={setClock} className="space-y-1.5">
              <input type="datetime-local" name="at" defaultValue={toDateTimeInput(now)} className="w-full rounded border border-gray-300 px-1.5 py-1" />
              <div className="flex gap-1.5">
                <button className="flex-1 rounded bg-gray-800 px-2 py-1 text-white">Đặt giờ</button>
                {offset !== 0 && (
                  <button name="reset" value="1" className="flex-1 rounded border border-gray-300 px-2 py-1">
                    Giờ thật
                  </button>
                )}
              </div>
            </form>
            <form action={runJobsNow} className="mt-1.5">
              <button className="w-full rounded border border-gray-300 px-2 py-1">Chạy việc định kỳ</button>
            </form>
          </div>
        </aside>
        <main className="min-w-0 flex-1 bg-[#f7f8fa] px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
