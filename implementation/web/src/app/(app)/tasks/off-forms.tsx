"use client";

import { useState } from "react";
import { Dialog, EvidenceInput, FieldError, FormResult, Label, SubmitButton, inputClass, useDialogForm, ActionForm, useActionThen, goDone } from "@/components/forms";
import { btnClass } from "@/components/ui";
import { RETURN_CONDITION } from "@/lib/labels";
import {
  addManualRevocationAction,
  confirmHandoverAction,
  deviceMissingReturnAction,
  deviceReturnAction,
  recordRevocationAction,
  saveHandoverPlanAction,
  updateHandoverItemAction,
} from "../offboarding/actions";

const useDialogAction = useDialogForm;

/** Hộp thoại Ghi kết quả thu hồi (SCR-OFF-03). Không có lựa chọn đóng theo ngoại lệ. */
export function RevocationResultButton({ taskId, itemId, label }: { taskId: number; itemId: number; label: string }) {
  const { open, setOpen, state, action } = useDialogAction(recordRevocationAction);
  const [result, setResult] = useState("");
  return (
    <>
      <button className={btnClass("secondary")} onClick={() => setOpen(true)}>
        Ghi kết quả
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title={`Ghi kết quả thu hồi – ${label}`}>
        <ActionForm action={action} className="space-y-4">
          <input type="hidden" name="taskId" value={taskId} />
          <input type="hidden" name="itemId" value={itemId} />
          <div>
            <Label required>Kết quả</Label>
            <div className="space-y-1 text-sm">
              {[
                ["REVOKED", "Đã thu hồi"],
                ["DISABLED", "Đã vô hiệu hóa"],
                ["NOT_REVOKED", "Chưa thu hồi được"],
              ].map(([v, l]) => (
                <label key={v} className="flex items-center gap-2">
                  <input type="radio" name="result" value={v} checked={result === v} onChange={() => setResult(v)} /> {l}
                </label>
              ))}
            </div>
          </div>
          {(result === "REVOKED" || result === "DISABLED") && <EvidenceInput state={state} required />}
          {result === "NOT_REVOKED" && (
            <div>
              <Label required>Lý do</Label>
              <textarea name="failureReason" rows={2} className={inputClass(!!state.fieldErrors?.failureReason)} />
              <FieldError state={state} name="failureReason" />
            </div>
          )}
          <p className="text-xs text-gray-500">ℹ Thu hồi quyền không có ngoại lệ. Tài khoản chưa thu hồi được cần tiếp tục xử lý.</p>
          <FormResult state={state} hideSuccess />
          <div className="flex justify-end gap-2">
            <button type="button" className={btnClass("secondary")} onClick={() => setOpen(false)}>
              Hủy
            </button>
            <SubmitButton disabled={!result}>Lưu kết quả</SubmitButton>
          </div>
        </ActionForm>
      </Dialog>
    </>
  );
}

export function AddManualRevocationButton({ taskId, systems }: { taskId: number; systems: { id: number; name: string }[] }) {
  const { open, setOpen, state, action } = useDialogAction(addManualRevocationAction);
  return (
    <>
      <button className={btnClass("secondary")} onClick={() => setOpen(true)}>
        + Bổ sung quyền cấp ngoài ELAMS
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Bổ sung quyền cấp ngoài ELAMS">
        <ActionForm action={action} className="space-y-4">
          <input type="hidden" name="taskId" value={taskId} />
          <div>
            <Label>Quyền</Label>
            <input name="accessName" className={inputClass()} placeholder="VD: VPN" />
          </div>
          <div>
            <Label required>Hệ thống</Label>
            <select name="systemId" defaultValue="" className={inputClass(!!state.fieldErrors?.systemId)}>
              <option value="">– Chọn –</option>
              {systems.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <FieldError state={state} name="systemId" />
          </div>
          <div>
            <Label required>Tài khoản</Label>
            <input name="accountIdentifier" className={inputClass(!!state.fieldErrors?.accountIdentifier)} />
            <FieldError state={state} name="accountIdentifier" />
          </div>
          <div>
            <Label>Ghi chú</Label>
            <input name="note" className={inputClass()} />
          </div>
          <FormResult state={state} hideSuccess />
          <div className="flex justify-end gap-2">
            <button type="button" className={btnClass("secondary")} onClick={() => setOpen(false)}>
              Hủy
            </button>
            <SubmitButton>Thêm mục thu hồi</SubmitButton>
          </div>
        </ActionForm>
      </Dialog>
    </>
  );
}

export function DeviceReturnButtons({ taskId, itemId, assetCode, nowInput }: { taskId: number; itemId: number; assetCode: string; nowInput: string }) {
  const ret = useDialogAction(deviceReturnAction);
  const miss = useDialogAction(deviceMissingReturnAction);
  return (
    <div className="flex gap-2">
      <button className={btnClass("secondary")} onClick={() => ret.setOpen(true)}>
        Ghi nhận thu hồi
      </button>
      <button className={btnClass("secondary")} onClick={() => miss.setOpen(true)}>
        Ghi nhận thiếu
      </button>
      <Dialog open={ret.open} onClose={() => ret.setOpen(false)} title={`Ghi nhận thu hồi ${assetCode}`}>
        <ActionForm action={ret.action} className="space-y-4">
          <input type="hidden" name="taskId" value={taskId} />
          <input type="hidden" name="itemId" value={itemId} />
          <div>
            <Label required>Thời điểm</Label>
            <input type="datetime-local" name="returnedAt" defaultValue={nowInput} max={nowInput} className={inputClass(!!ret.state.fieldErrors?.returnedAt)} />
            <FieldError state={ret.state} name="returnedAt" />
          </div>
          <div>
            <Label required>Tình trạng</Label>
            <select name="condition" defaultValue="" className={inputClass(!!ret.state.fieldErrors?.condition)}>
              <option value="">– Chọn –</option>
              {Object.entries(RETURN_CONDITION).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            <FieldError state={ret.state} name="condition" />
          </div>
          <div>
            <Label>Ghi chú</Label>
            <input name="note" className={inputClass()} />
          </div>
          <FormResult state={ret.state} hideSuccess />
          <div className="flex justify-end">
            <SubmitButton>Lưu</SubmitButton>
          </div>
        </ActionForm>
      </Dialog>
      <Dialog open={miss.open} onClose={() => miss.setOpen(false)} title={`Ghi nhận thiếu ${assetCode}`}>
        <ActionForm action={miss.action} className="space-y-4">
          <input type="hidden" name="taskId" value={taskId} />
          <input type="hidden" name="itemId" value={itemId} />
          <div>
            <Label required>Lý do</Label>
            <textarea name="missingReason" rows={2} className={inputClass(!!miss.state.fieldErrors?.missingReason)} />
            <FieldError state={miss.state} name="missingReason" />
          </div>
          <EvidenceInput state={miss.state} label="Bằng chứng (biên bản ghi nhận thiếu)" required />
          <p className="text-xs text-gray-500">Manager trực tiếp sẽ nhận nhiệm vụ quyết định ngoại lệ.</p>
          <FormResult state={miss.state} hideSuccess />
          <div className="flex justify-end">
            <SubmitButton>Lưu</SubmitButton>
          </div>
        </ActionForm>
      </Dialog>
    </div>
  );
}

type PlanRow = { id?: number; key: string; title: string; receiverId: string; dueDate: string; locked: boolean };

/** SCR-OFF-05 – Manager lập kế hoạch bàn giao. */
export function HandoverPlanEditor({
  taskId,
  rows: initial,
  people,
  defaultDue,
}: {
  taskId: number;
  rows: { id: number; title: string; receiverId: number; dueDate: string; locked: boolean }[];
  people: { id: number; name: string }[];
  defaultDue: string;
}) {
  const [state, action] = useActionThen(saveHandoverPlanAction, (r, router) => r.ok && router.refresh());
  const [rows, setRows] = useState<PlanRow[]>(initial.map((r) => ({ ...r, key: `e${r.id}`, receiverId: String(r.receiverId) })));
  const set = (key: string, patch: Partial<PlanRow>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  return (
    <ActionForm action={action} className="space-y-3">
      <input type="hidden" name="taskId" value={taskId} />
      <input
        type="hidden"
        name="rows"
        value={JSON.stringify(rows.map((r) => ({ id: r.id, title: r.title, receiverId: Number(r.receiverId) || null, dueDate: r.dueDate })))}
      />
      <table className="w-full text-sm">
        <thead className="text-left text-gray-500">
          <tr>
            <th className="py-2">Hạng mục *</th>
            <th>Người nhận *</th>
            <th>Hạn *</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.key} className="align-top">
              <td className="py-1 pr-2">
                <input value={r.title} onChange={(e) => set(r.key, { title: e.target.value })} className={inputClass(!!state.fieldErrors?.[`rows.${i}.title`])} />
              </td>
              <td className="py-1 pr-2">
                <select value={r.receiverId} onChange={(e) => set(r.key, { receiverId: e.target.value })} className={inputClass(!!state.fieldErrors?.[`rows.${i}.receiverId`])}>
                  <option value="">– Chọn –</option>
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <FieldError state={state} name={`rows.${i}.receiverId`} />
              </td>
              <td className="py-1 pr-2">
                <input type="date" value={r.dueDate} onChange={(e) => set(r.key, { dueDate: e.target.value })} className={inputClass(!!state.fieldErrors?.[`rows.${i}.dueDate`])} />
              </td>
              <td className="py-1">
                {!r.locked && (
                  <button type="button" className="px-2 py-2 text-red-500" onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))} aria-label="Xóa">
                    🗑
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        className="text-sm text-blue-600 hover:underline"
        onClick={() => setRows((rs) => [...rs, { key: `n${Date.now()}`, title: "", receiverId: "", dueDate: defaultDue, locked: false }])}
      >
        + Thêm hạng mục
      </button>
      <FormResult state={state} />
      <div className="flex justify-end">
        <SubmitButton variant="secondary" pendingText="Đang lưu…">
          Lưu kế hoạch
        </SubmitButton>
      </div>
    </ActionForm>
  );
}

export function HandoverItemActions({
  taskId,
  itemId,
  canMarkDone,
  canMarkNotMet,
  onBehalf,
}: {
  taskId: number;
  itemId: number;
  canMarkDone: boolean;
  canMarkNotMet: boolean;
  onBehalf: boolean;
}) {
  const [state, action] = useActionThen(updateHandoverItemAction, (r, router) => r.ok && router.refresh());
  const nm = useDialogAction(updateHandoverItemAction);
  return (
    <div className="flex items-center gap-2">
      {canMarkDone && (
        <ActionForm action={action}>
          <input type="hidden" name="taskId" value={taskId} />
          <input type="hidden" name="itemId" value={itemId} />
          <input type="hidden" name="status" value="HANDED_OVER" />
          <SubmitButton variant="secondary" pendingText="…">
            {onBehalf ? "Cập nhật thay nhân viên" : "Đánh dấu đã bàn giao"}
          </SubmitButton>
        </ActionForm>
      )}
      {canMarkNotMet && (
        <button className={btnClass("secondary")} onClick={() => nm.setOpen(true)}>
          Chưa đạt
        </button>
      )}
      {state.error && <span className="text-xs text-red-600">{state.error}</span>}
      <Dialog open={nm.open} onClose={() => nm.setOpen(false)} title="Đánh dấu hạng mục chưa đạt">
        <ActionForm action={nm.action} className="space-y-4">
          <input type="hidden" name="taskId" value={taskId} />
          <input type="hidden" name="itemId" value={itemId} />
          <input type="hidden" name="status" value="NOT_MET" />
          <div>
            <Label required>Lý do</Label>
            <textarea name="reason" rows={2} className={inputClass(!!nm.state.fieldErrors?.reason)} />
            <FieldError state={nm.state} name="reason" />
          </div>
          <p className="text-xs text-gray-500">Hạng mục quay lại đang bàn giao; nhân viên được thông báo kèm lý do.</p>
          <div className="flex justify-end">
            <SubmitButton>Lưu</SubmitButton>
          </div>
        </ActionForm>
      </Dialog>
    </div>
  );
}

export function ConfirmHandoverButton({ taskId }: { taskId: number }) {
  const [state, action] = useActionThen(confirmHandoverAction, goDone);
  return (
    <ActionForm action={action}>
      <input type="hidden" name="taskId" value={taskId} />
      <FormResult state={state} hideSuccess />
      <SubmitButton>Xác nhận bàn giao đầy đủ</SubmitButton>
    </ActionForm>
  );
}
