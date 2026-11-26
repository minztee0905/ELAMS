"use client";

import { ActionForm } from "@/components/forms";

import { useActionState, type ReactNode } from "react";
import type { ActionState } from "@/lib/action-state";

/** Biểu mẫu một dòng: gửi bằng server action, hiển thị kết quả gọn. */
export function RowForm({
  action,
  children,
  className,
}: {
  action: (s: ActionState, fd: FormData) => Promise<ActionState>;
  children: ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <ActionForm action={formAction} className={className ?? "flex flex-wrap items-center gap-2"}>
      {children}
      <button disabled={pending} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50">
        {pending ? "…" : "Lưu"}
      </button>
      {state.error && <span className="text-xs text-red-600">{state.error}</span>}
      {state.ok && <span className="text-xs text-green-700">✓</span>}
    </ActionForm>
  );
}
