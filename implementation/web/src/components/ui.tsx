import Link from "next/link";
import type { ReactNode } from "react";
import type { Tone } from "@/lib/labels";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

const TONES: Record<Tone, string> = {
  blue: "bg-blue-50 text-blue-700",
  orange: "bg-orange-50 text-orange-700",
  purple: "bg-purple-50 text-purple-700",
  green: "bg-green-50 text-green-700",
  gray: "bg-gray-200 text-gray-700",
  grayOutline: "border border-gray-400 text-gray-600",
  red: "bg-red-50 text-red-700",
  redOutline: "border border-red-500 text-red-600",
};

export function Badge({ tone = "gray", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cx("inline-block rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap", TONES[tone], className)}>{children}</span>;
}

export function StatusBadge({ map, value, suffix }: { map: Record<string, [string, Tone]>; value: string; suffix?: string }) {
  const [label, tone] = map[value] ?? [value, "gray"];
  return <Badge tone={tone}>{suffix ? `${label} – ${suffix}` : label}</Badge>;
}

export function OverdueBadge({ label }: { label: string | null }) {
  return label ? <Badge tone="redOutline">{label}</Badge> : null;
}

export function SensitiveBadge() {
  return <Badge className="border border-orange-400 bg-white text-orange-600">Nhạy cảm</Badge>;
}

export function UrgentBadge() {
  return <Badge tone="redOutline">Đột xuất</Badge>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cx("rounded-lg border border-gray-200 bg-white p-6", className)}>{children}</section>;
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-sm font-semibold tracking-wide text-gray-800 uppercase">{children}</h2>
      {right}
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="mb-5 text-sm text-gray-500">
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1.5">›</span>}
          {it.href ? (
            <Link href={it.href} className="hover:text-gray-800">
              {it.label}
            </Link>
          ) : (
            <span className="text-gray-700">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

const BTN = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
  secondary: "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 disabled:text-gray-400",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
  link: "text-blue-600 hover:underline px-0",
};

export function btnClass(variant: keyof typeof BTN = "secondary", className?: string) {
  return cx("inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors", BTN[variant], className);
}

export function LinkButton({ href, variant = "secondary", children }: { href: string; variant?: keyof typeof BTN; children: ReactNode }) {
  return (
    <Link href={href} className={btnClass(variant)}>
      {children}
    </Link>
  );
}

export function Alert({ tone, title, children }: { tone: "info" | "warning" | "error" | "success"; title?: ReactNode; children?: ReactNode }) {
  const c = {
    info: "border-blue-200 bg-blue-50 text-blue-900",
    warning: "border-amber-300 bg-amber-50 text-amber-900",
    error: "border-red-300 bg-red-50 text-red-900",
    success: "border-green-300 bg-green-50 text-green-900",
  }[tone];
  const icon = { info: "ℹ", warning: "⚠", error: "⚠", success: "✓" }[tone];
  return (
    <div className={cx("rounded-lg border px-5 py-4 text-sm", c)} role={tone === "error" ? "alert" : "status"}>
      {title && (
        <p className="mb-1 font-semibold">
          <span className="mr-2">{icon}</span>
          {title}
        </p>
      )}
      {children && <div className={title ? "" : ""}>{children}</div>}
    </div>
  );
}

export function KV({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-3 py-1 text-sm">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-gray-900">{children}</dd>
    </div>
  );
}

export function Table({ head, children, empty }: { head: ReactNode[]; children: ReactNode; empty?: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 font-medium whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">{children}</tbody>
      </table>
      {empty && <p className="px-4 py-6 text-center text-sm text-gray-500">{empty}</p>}
    </div>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cx("px-4 py-3 align-top", className)}>{children}</td>;
}

export function Tabs({ tabs, active }: { tabs: { key: string; label: string; href: string }[]; active: string }) {
  return (
    <div className="mb-5 flex gap-1 border-b border-gray-200">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          scroll={false}
          className={cx(
            "-mb-px border-b-2 px-4 py-2.5 text-sm",
            t.key === active ? "border-blue-600 font-medium text-blue-700" : "border-transparent text-gray-600 hover:text-gray-900",
          )}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}

export function PageTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h1 className="text-xl font-semibold text-gray-900">{children}</h1>
      {right}
    </div>
  );
}

export function EvidenceLink({ value }: { value: string | null | undefined }) {
  if (!value) return <span>–</span>;
  if (value.startsWith("file:")) {
    const [key, name] = value.slice(5).split("|");
    return (
      <a href={`/files/${key}`} target="_blank" className="text-blue-600 hover:underline">
        {name || key}
      </a>
    );
  }
  return <span>{value}</span>;
}

export function Forbidden() {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-lg border border-red-200 bg-white p-8 text-center">
      <p className="mb-2 text-3xl">⛔</p>
      <p className="font-medium text-gray-900">Bạn không có quyền truy cập chức năng này.</p>
      <p className="mt-1 text-sm text-gray-500">Lần truy cập đã được ghi vào lịch sử thao tác.</p>
      <Link href="/tasks" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
        Về Việc cần làm
      </Link>
    </div>
  );
}
