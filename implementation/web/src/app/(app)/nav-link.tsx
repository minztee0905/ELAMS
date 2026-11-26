"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/components/ui";

export function NavLink({ href, children, sub }: { href: string; children: React.ReactNode; sub?: boolean }) {
  const path = usePathname();
  const active = path === href || (!sub && href !== "/tasks" && path.startsWith(href) && !path.endsWith("/new"));
  return (
    <Link
      href={href}
      className={cx("block rounded-md px-3 py-2", sub && "pl-7", active ? "bg-blue-50 font-medium text-blue-700" : "text-gray-700 hover:bg-gray-50")}
    >
      {children}
    </Link>
  );
}
