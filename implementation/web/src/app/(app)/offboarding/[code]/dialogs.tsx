"use client";

import { useState, useTransition } from "react";
import { Dialog, FieldError, FormResult, Label, SubmitButton, inputClass, useDialogForm, ActionForm } from "@/components/forms";
import { btnClass } from "@/components/ui";
import { changeLastDayAction, markUrgentAction, previewLastDayAction } from "../actions";

export function MarkUrgentButton({ offboardingId }: { offboardingId: number }) {
  const { open, setOpen, state, action } = useDialogForm(markUrgentAction);
  return (
    <>
      <button className={btnClass("secondary")} onClick={() => setOpen(true)}>
        Chuyển sang đột xuất
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Chuyển sang đột xuất">
        <ActionForm action={action} className="space-y-4">
          <input type="hidden" name="offboardingId" value={offboardingId} />
          <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
            ⚠ Chuyển sang đột xuất sẽ bắt đầu thu hồi quyền ngay, hạn 4 giờ. IT và Manager được thông báo. Không thể hoàn tác.
          </p>
          <div>
            <Label required>Lý do</Label>
            <textarea name="reason" rows={2} className={inputClass(!!state.fieldErrors?.reason)} />
            <FieldError state={state} name="reason" />
          </div>
          <FormResult state={state} hideSuccess />
          <div className="flex justify-end gap-2">
            <button type="button" className={btnClass("secondary")} onClick={() => setOpen(false)}>
              Hủy
            </button>
            <SubmitButton variant="danger">Xác nhận đột xuất</SubmitButton>
          </div>
        </ActionForm>
      </Dialog>
    </>
  );
}

export function ChangeLastDayButton({ offboardingId, current, today }: { offboardingId: number; current: string; today: string }) {
  const { open, setOpen, state, action } = useDialogForm(changeLastDayAction);
  const [preview, setPreview] = useState<Awaited<ReturnType<typeof previewLastDayAction>> | null>(null);
  const [past, setPast] = useState(false);
  const [, start] = useTransition();
  return (
    <>
      <button className={btnClass("secondary")} onClick={() => setOpen(true)}>
        Đổi ngày nghỉ việc
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Đổi ngày nghỉ việc" wide>
        <ActionForm action={action} className="space-y-4">
          <input type="hidden" name="offboardingId" value={offboardingId} />
          <p className="text-sm">
            Ngày làm việc cuối cùng hiện hành: <b>{current}</b>
          </p>
          <div>
            <Label required>Ngày mới</Label>
            <input
              type="date"
              name="newDate"
              className={inputClass(!!state.fieldErrors?.newDate)}
              onChange={(e) => {
                const v = e.target.value;
                setPast(!!v && v < today);
                start(async () => setPreview(v ? await previewLastDayAction(offboardingId, v) : null));
              }}
            />
            <FieldError state={state} name="newDate" />
            {past && <p className="mt-1 text-xs text-amber-700">Ngày đã qua: không lưu được. Hãy dùng “Chuyển sang đột xuất”.</p>}
          </div>
          <div>
            <Label required>Lý do</Label>
            <textarea name="reason" rows={2} className={inputClass(!!state.fieldErrors?.reason)} />
            <FieldError state={state} name="reason" />
          </div>
          {preview && (
            <div className="text-sm">
              {preview.revokeAt && (
                <p className="mb-2">
                  Thời điểm thu hồi quyền mới: <b>{preview.revokeAt}</b>
                </p>
              )}
              <p className="mb-1 font-medium">Nhiệm vụ chưa xong</p>
              {preview.tasks.length === 0 ? (
                <p className="text-gray-500">Không có nhiệm vụ bị ảnh hưởng.</p>
              ) : (
                <table className="w-full">
                  <tbody>
                    {preview.tasks.map((t) => (
                      <tr key={t.id} className="border-t border-gray-100">
                        <td className="py-1.5">{t.label}</td>
                        <td className="text-gray-500">{t.oldDue}</td>
                        <td>→ {t.newDue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
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
