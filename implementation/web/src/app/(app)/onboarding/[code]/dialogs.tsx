"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Dialog, FieldError, FormResult, Label, SubmitButton, inputClass, useDialogForm, ActionForm } from "@/components/forms";
import { btnClass } from "@/components/ui";
import { changeStartDateAction, confirmOnboardingAction, previewStartDateAction } from "../actions";

/** Hộp thoại Đổi ngày bắt đầu (SCR-ON-02 mục 4.5). */
export function ChangeStartDateButton({ onboardingId, current }: { onboardingId: number; current: string }) {
  const { open, setOpen, state, action } = useDialogForm(changeStartDateAction);
  const [preview, setPreview] = useState<{ id: number; label: string; oldDue: string; newDue: string }[]>([]);
  const [, start] = useTransition();
  return (
    <>
      <button className={btnClass("secondary")} onClick={() => setOpen(true)}>
        Đổi ngày bắt đầu
      </button>
      {state.ok && state.message && <span className="sr-only">{state.message}</span>}
      <Dialog open={open} onClose={() => setOpen(false)} title="Đổi ngày bắt đầu" wide>
        <ActionForm action={action} className="space-y-4">
          <input type="hidden" name="onboardingId" value={onboardingId} />
          <p className="text-sm">
            Ngày bắt đầu hiện hành: <b>{current}</b>
          </p>
          <div>
            <Label required>Ngày bắt đầu mới</Label>
            <input
              type="date"
              name="newDate"
              className={inputClass(!!state.fieldErrors?.newDate)}
              onChange={(e) => {
                const v = e.target.value;
                start(async () => setPreview(v ? await previewStartDateAction(onboardingId, v) : []));
              }}
            />
            <FieldError state={state} name="newDate" />
          </div>
          <div>
            <Label required>Lý do thay đổi</Label>
            <textarea name="reason" rows={2} maxLength={300} className={inputClass(!!state.fieldErrors?.reason)} />
            <FieldError state={state} name="reason" />
          </div>
          <div>
            <p className="mb-1 text-sm font-medium">Nhiệm vụ bị ảnh hưởng</p>
            {preview.length === 0 ? (
              <p className="text-sm text-gray-500">Chọn ngày mới để xem trước. Nhiệm vụ đã hoàn thành không bị ảnh hưởng.</p>
            ) : (
              <table className="w-full text-sm">
                <tbody>
                  {preview.map((p) => (
                    <tr key={p.id} className="border-t border-gray-100">
                      <td className="py-1.5">{p.label}</td>
                      <td className="text-gray-500">{p.oldDue}</td>
                      <td>→ {p.newDue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <p className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">Đổi ngày không cấp lại hay thu hồi quyền đã cấp.</p>
          <FormResult state={state} hideSuccess />
          <div className="flex justify-end gap-2">
            <button type="button" className={btnClass("secondary")} onClick={() => setOpen(false)}>
              Hủy
            </button>
            <SubmitButton pendingText="Đang lưu…">Lưu thay đổi</SubmitButton>
          </div>
        </ActionForm>
      </Dialog>
    </>
  );
}

/** Hộp thoại Xác nhận hoàn tất (SCR-ON-02 mục 4.4, SCR-OFF-02). */
export function ConfirmCompletionButton({
  onboardingId,
  code,
  subtitle,
  rows,
  action: actionOverride,
  idField = "onboardingId",
  kind = "onboarding",
}: {
  onboardingId: number;
  code: string;
  subtitle: string;
  rows: { ok: boolean; label: string; value: string }[];
  action?: typeof confirmOnboardingAction;
  idField?: string;
  kind?: "onboarding" | "offboarding";
}) {
  const { open, setOpen, state, action } = useDialogForm(actionOverride ?? confirmOnboardingAction);
  const router = useRouter();
  return (
    <>
      <button className={btnClass("primary")} onClick={() => setOpen(true)}>
        Xác nhận hoàn tất
      </button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          if (state.at) router.refresh();
        }}
        title={`Xác nhận hoàn tất ${kind} – ${code}`}
      >
        <ActionForm action={action} className="space-y-4">
          <input type="hidden" name={idField} value={onboardingId} />
          <p className="text-sm text-gray-700">{subtitle}</p>
          <ul className="space-y-1 text-sm">
            {rows.map((r, i) => (
              <li key={i} className="grid grid-cols-[20px_1fr_1.4fr] gap-2">
                <span>{r.ok ? "✓" : "–"}</span>
                <span>{r.label}</span>
                <span className="text-gray-600">{r.value}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-700">Sau khi xác nhận, yêu cầu chuyển sang Hoàn tất và không thể mở lại.</p>
          {state.ok === false && (state.message || state.error) && (
            <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
              {state.message ?? state.error}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className={btnClass("secondary")}
              onClick={() => {
                setOpen(false);
                if (state.at) router.refresh();
              }}
            >
              Quay lại
            </button>
            {state.ok !== false || state.error ? <SubmitButton pendingText="Đang ghi…">Xác nhận</SubmitButton> : null}
          </div>
        </ActionForm>
      </Dialog>
    </>
  );
}
