"use client";

import Link from "next/link";
import { createContext, useActionState, useContext, useEffect, useRef, useState, useTransition, type FormHTMLAttributes, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import type { ActionState } from "@/lib/action-state";
import { btnClass, cx } from "./ui";

const PendingContext = createContext(false);

/**
 * Biểu mẫu gọi server action nhưng không tự xóa dữ liệu sau khi gửi
 * (React mặc định reset form). Giữ nguyên dữ liệu khi có lỗi (MSG-05).
 */
export function ActionForm({
  action,
  children,
  ...rest
}: { action: (fd: FormData) => void; children: ReactNode } & Omit<FormHTMLAttributes<HTMLFormElement>, "action">) {
  const [pending, start] = useTransition();
  return (
    <form
      {...rest}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget, (e.nativeEvent as SubmitEvent).submitter);
        start(() => action(fd));
      }}
    >
      <PendingContext.Provider value={pending}>{children}</PendingContext.Provider>
    </form>
  );
}

export function SubmitButton({
  children,
  pendingText = "Đang gửi…",
  variant = "primary",
  name,
  value,
  disabled,
}: {
  children: ReactNode;
  pendingText?: string;
  variant?: "primary" | "secondary" | "danger";
  name?: string;
  value?: string;
  disabled?: boolean;
}) {
  const status = useFormStatus();
  const pending = useContext(PendingContext) || status.pending;
  // NFR-04: khóa nút khi đang gửi để tránh gửi hai lần.
  return (
    <button type="submit" name={name} value={value} disabled={pending || disabled} className={btnClass(variant)}>
      {pending ? pendingText : children}
    </button>
  );
}

export function FieldError({ state, name }: { state: ActionState; name: string }) {
  const msg = state.fieldErrors?.[name];
  return msg ? <p className="mt-1 text-xs text-red-600">{msg}</p> : null;
}

export function FormResult({ state, hideSuccess }: { state: ActionState; hideSuccess?: boolean }) {
  if (state.error) {
    return (
      <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
        <p>{state.error}</p>
        {state.fieldErrors && Object.keys(state.fieldErrors).length > 1 && (
          <ul className="mt-1 list-disc pl-5">
            {Object.values(state.fieldErrors).map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        )}
        {state.link && (
          <Link href={state.link.href} className="mt-1 inline-block font-medium underline">
            {state.link.label}
          </Link>
        )}
      </div>
    );
  }
  if (state.ok && state.message && !hideSuccess) {
    return (
      <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800" role="status">
        ✓ {state.message}
      </div>
    );
  }
  return null;
}

export function Label({ children, required, htmlFor }: { children: ReactNode; required?: boolean; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-700">
      {children}
      {required && <span className="ml-0.5 text-red-600">*</span>}
    </label>
  );
}

export const inputClass = (error?: boolean) =>
  cx(
    "w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
    error ? "border-red-500" : "border-gray-300",
  );

export function Field({
  label,
  name,
  state,
  required,
  children,
  hint,
}: {
  label: string;
  name: string;
  state: ActionState;
  required?: boolean;
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div>
      <Label required={required} htmlFor={name}>
        {label}
      </Label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      <FieldError state={state} name={name} />
    </div>
  );
}

/** Hộp thoại dùng thẻ <dialog> gốc. */
export function Dialog({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className={cx("m-auto rounded-lg p-0 shadow-xl backdrop:bg-black/40", wide ? "w-[720px] max-w-[95vw]" : "w-[520px] max-w-[95vw]")}
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label="Đóng">
          ✕
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </dialog>
  );
}

/** Ô nhập bằng chứng: tệp hoặc mã ticket. */
export function EvidenceInput({ state, label = "Bằng chứng", required }: { state: ActionState; label?: string; required?: boolean }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="flex flex-wrap items-center gap-3">
        <input type="file" name="evidenceFile" accept=".pdf,.jpg,.jpeg,.png" className="text-sm" />
        <span className="text-sm text-gray-500">hoặc mã ticket</span>
        <input name="ticket" className={cx(inputClass(!!state.fieldErrors?.evidence), "w-48")} placeholder="VD: IT-4521" />
      </div>
      <FieldError state={state} name="evidence" />
    </div>
  );
}

/**
 * Hộp thoại có biểu mẫu: đóng và làm mới trang khi thao tác thành công.
 * Đóng trong chính action (không dùng effect) để tránh render dây chuyền.
 */
export function useDialogForm(fn: (s: ActionState, fd: FormData) => Promise<ActionState>) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [state, action] = useActionState(async (prev: ActionState, fd: FormData) => {
    const r = await fn(prev, fd);
    if (r.ok) {
      setOpen(false);
      router.refresh();
    }
    return r;
  }, {});
  return { open, setOpen, state, action };
}

/** useActionState kèm bước tiếp theo chạy ngay trong action (ví dụ chuyển trang khi thành công). */
export function useActionThen(
  fn: (s: ActionState, fd: FormData) => Promise<ActionState>,
  then: (r: ActionState, router: ReturnType<typeof useRouter>) => void,
) {
  const router = useRouter();
  return useActionState(async (prev: ActionState, fd: FormData) => {
    const r = await fn(prev, fd);
    then(r, router);
    return r;
  }, {});
}

export const goDone = (r: ActionState, router: ReturnType<typeof useRouter>) => {
  if (r.ok && r.message) router.push(`/tasks?done=${encodeURIComponent(r.message)}`);
};
