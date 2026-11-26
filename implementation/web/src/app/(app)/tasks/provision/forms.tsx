"use client";

import { useState } from "react";
import { EvidenceInput, FieldError, FormResult, Label, SubmitButton, inputClass, ActionForm, useActionThen, goDone } from "@/components/forms";
import { SectionTitle } from "@/components/ui";
import { provisionAction, retryAction, revokeInvalidAction } from "./actions";

function Radio({ name, value, cur, set, children }: { name: string; value: string; cur: string; set: (v: string) => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1 text-sm">
      <input type="radio" name={name} value={value} checked={cur === value} onChange={() => set(value)} />
      {children}
    </label>
  );
}

/** Mục 2 (tài khoản) và mục 3 (kết quả) của SCR-ON-04. */
export function ProvisionForm({
  taskId,
  systemName,
  existing,
}: {
  taskId: number;
  systemName: string;
  existing: { identifier: string; since: string } | null;
}) {
  const [state, action] = useActionThen(provisionAction, (r, router) => {
    const status = (r.data as { status?: string } | undefined)?.status;
    if (r.ok && (status === "COMPLETED" || status === "GRANTED")) goDone(r, router);
    else if (r.ok) router.refresh();
  });
  const [choice, setChoice] = useState(existing ? "EXISTING" : "");
  const [result, setResult] = useState("");
  const unknown = choice === "UNKNOWN";
  return (
    <ActionForm action={action} className="space-y-6">
      <input type="hidden" name="taskId" value={taskId} />
      <section>
        <SectionTitle>2. Tài khoản trên hệ thống đích *</SectionTitle>
        {existing ? (
          <>
            <p className="mb-2 text-sm">
              Tài khoản đã ghi nhận: <b>{existing.identifier}</b> ({existing.since})
            </p>
            <Radio name="accountChoice" value="EXISTING" cur={choice} set={setChoice}>
              Dùng lại tài khoản này
            </Radio>
            <Radio name="accountChoice" value="UNKNOWN" cur={choice} set={setChoice}>
              Không xác định được nhân viên đã có tài khoản hay chưa
            </Radio>
          </>
        ) : (
          <>
            <p className="mb-2 text-sm text-gray-600">ELAMS chưa ghi nhận tài khoản nào của nhân viên này trên {systemName}.</p>
            <Radio name="accountChoice" value="EXISTING" cur={choice} set={setChoice}>
              Đã có tài khoản trên {systemName} – dùng lại
            </Radio>
            <Radio name="accountChoice" value="CREATED" cur={choice} set={setChoice}>
              Chưa có – tôi đã tạo tài khoản mới
            </Radio>
            <Radio name="accountChoice" value="UNKNOWN" cur={choice} set={setChoice}>
              Không xác định được nhân viên đã có tài khoản hay chưa
            </Radio>
          </>
        )}
        <FieldError state={state} name="accountChoice" />
        {!unknown && !existing && choice && (
          <div className="mt-3 max-w-sm">
            <Label required>Định danh tài khoản</Label>
            <input name="accountIdentifier" className={inputClass(!!state.fieldErrors?.accountIdentifier)} placeholder="VD: an.nguyen" />
            <FieldError state={state} name="accountIdentifier" />
          </div>
        )}
        {unknown && (
          <div className="mt-3">
            <p className="mb-2 text-sm text-amber-700">Không được tạo tài khoản mới khi chưa xác định được.</p>
            <Label required>Lý do không xác định được</Label>
            <textarea name="unknownReason" rows={2} maxLength={500} className={inputClass(!!state.fieldErrors?.unknownReason)} />
            <FieldError state={state} name="unknownReason" />
          </div>
        )}
      </section>

      {!unknown && (
        <section>
          <SectionTitle>3. Kết quả cấp quyền *</SectionTitle>
          <div className="flex gap-6">
            <Radio name="result" value="SUCCESS" cur={result} set={setResult}>
              Thành công
            </Radio>
            <Radio name="result" value="FAILURE" cur={result} set={setResult}>
              Thất bại
            </Radio>
          </div>
          <FieldError state={state} name="result" />
          {result === "SUCCESS" && (
            <div className="mt-3">
              <EvidenceInput state={state} required />
            </div>
          )}
          {result === "FAILURE" && (
            <div className="mt-3">
              <Label required>Lý do thất bại</Label>
              <textarea name="failureReason" rows={2} maxLength={500} className={inputClass(!!state.fieldErrors?.failureReason)} />
              <FieldError state={state} name="failureReason" />
            </div>
          )}
          <div className="mt-3">
            <Label>Ghi chú</Label>
            <textarea name="note" rows={2} maxLength={500} className={inputClass()} />
          </div>
        </section>
      )}
      <FormResult state={state} />
      <div className="flex justify-end">
        <SubmitButton disabled={!choice}>{unknown ? "Gửi – chuyển BLOCKED" : "Gửi kết quả"}</SubmitButton>
      </div>
    </ActionForm>
  );
}

export function RetryButton({ taskId, label }: { taskId: number; label: string }) {
  const [state, action] = useActionThen(retryAction, (r, router) => r.ok && router.refresh());
  return (
    <ActionForm action={action}>
      <input type="hidden" name="taskId" value={taskId} />
      <FormResult state={state} hideSuccess />
      <SubmitButton pendingText="Đang mở…">{label}</SubmitButton>
    </ActionForm>
  );
}

/** Mục Thu hồi / tạm ngừng khi phê duyệt mất hiệu lực (BR-ON-12). */
export function RevokeInvalidForm({ taskId }: { taskId: number }) {
  const [state, action] = useActionThen(revokeInvalidAction, goDone);
  const [target, setTarget] = useState("");
  return (
    <ActionForm action={action} className="space-y-4">
      <input type="hidden" name="taskId" value={taskId} />
      <SectionTitle>3. Thu hồi / tạm ngừng</SectionTitle>
      <div>
        <Label required>Tình trạng quyền trên hệ thống đích</Label>
        <div className="flex gap-6">
          <Radio name="targetState" value="GRANTED" cur={target} set={setTarget}>
            Đã được cấp
          </Radio>
          <Radio name="targetState" value="NOT_GRANTED" cur={target} set={setTarget}>
            Chưa được cấp
          </Radio>
        </div>
      </div>
      {target === "GRANTED" && (
        <div>
          <Label required>Hành động đã thực hiện</Label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="action" value="REVOKE" /> Thu hồi
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="action" value="SUSPEND" /> Tạm ngừng
            </label>
          </div>
          <FieldError state={state} name="action" />
        </div>
      )}
      <EvidenceInput state={state} required />
      <div>
        <Label>Ghi chú</Label>
        <textarea name="note" rows={2} className={inputClass()} />
      </div>
      <FormResult state={state} />
      <div className="flex justify-end">
        <SubmitButton disabled={!target}>Gửi kết quả thu hồi</SubmitButton>
      </div>
    </ActionForm>
  );
}
