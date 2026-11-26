import { db } from "@/lib/db";
import { ROLE_LABEL } from "@/lib/labels";
import { Alert } from "@/components/ui";
import { loginAs } from "./actions";

const ORDER = ["HR", "MANAGER", "IT", "SECURITY", "EMPLOYEE", "ADMIN"];

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ expired?: string; disabled?: string }> }) {
  const sp = await searchParams;
  const users = await db.appUser.findMany({
    include: { employee: { include: { jobTitle: true, department: true } } },
    orderBy: { id: "asc" },
  });
  users.sort((a, b) => ORDER.indexOf(a.role) - ORDER.indexOf(b.role));

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">E</span>
        <div>
          <h1 className="text-2xl font-semibold">ELAMS</h1>
          <p className="text-sm text-gray-500">Employee Lifecycle & Access Management · TechNova</p>
        </div>
      </div>
      {sp.expired && (
        <div className="mb-5">
          <Alert tone="warning" title="Phiên đăng nhập đã hết hạn sau 30 phút không thao tác." />
        </div>
      )}
      {sp.disabled && (
        <div className="mb-5">
          <Alert tone="error" title="Tài khoản đã bị vô hiệu hóa, không đăng nhập được." />
        </div>
      )}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-1 font-semibold">Đăng nhập demo</h2>
        <p className="mb-5 text-sm text-gray-500">Chọn một người dùng mẫu để vào ELAMS với vai trò tương ứng.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {users.map((u) => (
            <form key={u.id} action={loginAs}>
              <input type="hidden" name="userId" value={u.id} />
              <button
                type="submit"
                disabled={u.status !== "ACTIVE"}
                className="w-full rounded-md border border-gray-200 px-4 py-3 text-left hover:border-blue-400 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="block text-sm font-medium">{u.employee.fullName}</span>
                <span className="block text-xs text-gray-500">
                  {ROLE_LABEL[u.role]} · {u.employee.jobTitle.name}
                  {u.status !== "ACTIVE" && " · Đã vô hiệu hóa"}
                </span>
              </button>
            </form>
          ))}
        </div>
      </section>
    </main>
  );
}
