"use client";

import { Dialog, FieldError, FormResult, Label, SubmitButton, inputClass, useDialogForm, ActionForm, useActionThen } from "@/components/forms";
import { btnClass } from "@/components/ui";
import { cancelArAction, resubmitArAction } from "../actions";

/** Chờ bổ sung: người yêu cầu sửa mức, lý do, tệp rồi gửi lại hoặc hủy (UC-AC-02). */
export function NeedInfoForm({ requestId, code, levels, level, reason, accessName }: { requestId: number; code: string; levels: string[]; level: string; reason: string; accessName: string }) {
  const [state, action] = useActionThen(resubmitArAction, (r, router) => {
    if (r.ok) router.replace(`/access-requests/${code}?msg=${encodeURIComponent(r.message ?? "")}`);
  });
  const { open: cancelOpen, setOpen: setCancelOpen, state: cState, action: cAction } = useDialogForm(cancelArAction);
  return (
    <>
      <ActionForm action={action} className="space-y-4">
        <input type="hidden" name="requestId" value={requestId} />
        <div>
          <Label>Quyền</Label>
          <p className="text-sm">{accessName} 🔒</p>
        </div>
        <div>
          <Label required>Mức quyền</Label>
          <select name="level" defaultValue={level} className={inputClass()}>
            {levels.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
        <div>
          <Label required>Lý do</Label>
          <textarea name="reason" rows={3} defaultValue={reason} maxLength={500} className={inputClass(!!state.fieldErrors?.reason)} />
          <FieldError state={state} name="reason" />
        </div>
        <div>
          <Label>Tệp</Label>
          <input type="file" name="attachment" accept=".pdf,.jpg,.jpeg,.png" className="text-sm" />
        </div>
        <FormResult state={state} />
        <FormResult state={cState} />
        <div className="flex justify-end gap-2">
          <button type="button" className={btnClass("secondary")} onClick={() => setCancelOpen(true)}>
            Hủy yêu cầu
          </button>
          <SubmitButton>Gửi lại</SubmitButton>
        </div>
      </ActionForm>
      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)} title="Hủy yêu cầu">
        <ActionForm action={cAction}>
          <input type="hidden" name="requestId" value={requestId} />
          <p className="mb-5 text-sm">Hủy yêu cầu {code}? Yêu cầu đã hủy không mở lại được.</p>
          <div className="flex justify-end gap-2">
            <button type="button" className={btnClass("secondary")} onClick={() => setCancelOpen(false)}>
              Quay lại
            </button>
            <SubmitButton variant="danger" pendingText="Đang hủy…">
              Hủy yêu cầu
            </SubmitButton>
          </div>
        </ActionForm>
      </Dialog>
    </>
  );
}
