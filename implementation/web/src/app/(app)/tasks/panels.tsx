"use client";

import { useState } from "react";
import { Dialog, FieldError, FormResult, Label, SubmitButton, inputClass, ActionForm, useActionThen, goDone } from "@/components/forms";
import { btnClass } from "@/components/ui";
import { adjustAction, deviceExceptionAction, reviewArAction, reviewOnboardingAction } from "./actions";


function Radio({ name, value, checked, onChange, children }: { name: string; value: string; checked: boolean; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} />
      {children}
    </label>
  );
}

/** Bảng xét duyệt quyền onboarding (UC-ON-03 Manager, UC-ON-04 Security). */
export function OnboardingReviewForm({
  taskId,
  isSensitive,
  isMandatory,
  isManager,
  managerName,
}: {
  taskId: number;
  isSensitive: boolean;
  isMandatory: boolean;
  isManager: boolean;
  managerName: string;
}) {
  const [state, action] = useActionThen(reviewOnboardingAction, goDone);
  const [decision, setDecision] = useState("");
  const [confirm, setConfirm] = useState(false);
  const consequence =
    decision === "APPROVE"
      ? isManager && isSensitive
        ? "Quyền nhạy cảm: Security Approver sẽ xét duyệt tiếp. IT chưa nhận nhiệm vụ."
        : "IT sẽ nhận nhiệm vụ cấp quyền."
      : decision === "REJECT"
        ? isMandatory
          ? `Quyền bắt buộc không thể kết thúc bằng từ chối. Quyền sẽ chuyển BLOCKED và Manager ${managerName} nhận nhiệm vụ điều chỉnh. Các quyền phía sau tiếp tục chờ.`
          : "Quyền sẽ kết thúc với REJECTED và không được cấp. Quyền tiếp theo trong danh sách sẽ bắt đầu."
        : null;

  return (
    <ActionForm action={action} id={`review-${taskId}`} className="space-y-4">
      <input type="hidden" name="taskId" value={taskId} />
      <div>
        <Label required>Quyết định</Label>
        <div className="flex gap-6">
          <Radio name="decision" value="APPROVE" checked={decision === "APPROVE"} onChange={setDecision}>
            Phê duyệt
          </Radio>
          <Radio name="decision" value="REJECT" checked={decision === "REJECT"} onChange={setDecision}>
            Từ chối
          </Radio>
        </div>
      </div>
      <div>
        <Label required={decision === "REJECT"}>{decision === "REJECT" ? "Lý do từ chối" : "Lý do nghiệp vụ (không bắt buộc)"}</Label>
        <textarea name="reason" rows={3} maxLength={500} className={inputClass(!!state.fieldErrors?.reason)} />
        <FieldError state={state} name="reason" />
      </div>
      {consequence && <div className="rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-900">ℹ {consequence}</div>}
      <FormResult state={state} hideSuccess />
      <div className="flex justify-end">
        {decision === "REJECT" ? (
          <button type="button" className={btnClass("primary")} onClick={() => setConfirm(true)}>
            Gửi quyết định
          </button>
        ) : (
          <SubmitButton disabled={!decision}>Gửi quyết định</SubmitButton>
        )}
      </div>
      <Dialog open={confirm} onClose={() => setConfirm(false)} title="Xác nhận từ chối">
        <p className="mb-5 text-sm text-gray-700">{consequence}</p>
        <div className="flex justify-end gap-2">
          <button type="button" className={btnClass("secondary")} onClick={() => setConfirm(false)}>
            Quay lại
          </button>
          <button type="submit" form={`review-${taskId}`} className={btnClass("danger")} onClick={() => setConfirm(false)}>
            Từ chối
          </button>
        </div>
      </Dialog>
    </ActionForm>
  );
}

/** Bảng điều chỉnh quyền bị chặn (UC-ON-03 AF-03). */
export function AdjustForm({ taskId, levels, current }: { taskId: number; levels: string[]; current: string }) {
  const [state, action] = useActionThen(adjustAction, goDone);
  return (
    <ActionForm action={action} className="space-y-4">
      <input type="hidden" name="taskId" value={taskId} />
      <div>
        <Label required>Mức quyền</Label>
        <select name="level" defaultValue={current} className={inputClass()}>
          {levels.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>
      <div>
        <Label>Phân loại</Label>
        <p className="text-sm text-gray-700">Bắt buộc 🔒 (không thay đổi được)</p>
      </div>
      <div>
        <Label required>Nội dung điều chỉnh</Label>
        <textarea name="note" rows={3} maxLength={500} className={inputClass(!!state.fieldErrors?.note)} />
        <FieldError state={state} name="note" />
      </div>
      <div className="rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-900">
        ℹ Sau khi gửi lại, quyền quay về bước xét duyệt của Manager với nội dung mới, rồi đi tiếp theo cấp phê duyệt của danh mục.
      </div>
      <FormResult state={state} hideSuccess />
      <div className="flex justify-end">
        <SubmitButton>Gửi lại</SubmitButton>
      </div>
    </ActionForm>
  );
}

/** Bảng xét duyệt yêu cầu quyền (UC-AC-04 Manager, UC-AC-05 Security). */
export function ArReviewForm({
  taskId,
  isSensitive,
  isManager,
  requesterName,
}: {
  taskId: number;
  isSensitive: boolean;
  isManager: boolean;
  requesterName: string;
}) {
  const [state, action] = useActionThen(reviewArAction, goDone);
  const [decision, setDecision] = useState("");
  const consequence = {
    APPROVE: isManager && isSensitive ? "Security Approver sẽ xét duyệt tiếp. IT chưa nhận nhiệm vụ." : "IT sẽ nhận nhiệm vụ cấp quyền.",
    REQUEST_INFO: `Yêu cầu chuyển Chờ bổ sung; ${requesterName} nhận nội dung cần bổ sung.`,
    REJECT: `Yêu cầu kết thúc; ${requesterName} nhận lý do từ chối.`,
  }[decision];
  return (
    <ActionForm action={action} className="space-y-4">
      <input type="hidden" name="taskId" value={taskId} />
      <div>
        <Label required>Quyết định</Label>
        <div className="flex flex-wrap gap-6">
          <Radio name="decision" value="APPROVE" checked={decision === "APPROVE"} onChange={setDecision}>
            Phê duyệt
          </Radio>
          {isManager && (
            <Radio name="decision" value="REQUEST_INFO" checked={decision === "REQUEST_INFO"} onChange={setDecision}>
              Yêu cầu bổ sung
            </Radio>
          )}
          <Radio name="decision" value="REJECT" checked={decision === "REJECT"} onChange={setDecision}>
            Từ chối
          </Radio>
        </div>
      </div>
      <div>
        <Label required={decision === "REJECT" || decision === "REQUEST_INFO"}>
          {decision === "REQUEST_INFO" ? "Nội dung cần bổ sung" : decision === "REJECT" ? "Lý do từ chối" : "Ghi chú (không bắt buộc)"}
        </Label>
        <textarea name="reason" rows={3} maxLength={500} className={inputClass(!!state.fieldErrors?.reason)} />
        <FieldError state={state} name="reason" />
      </div>
      {consequence && <div className="rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-900">ℹ {consequence}</div>}
      <FormResult state={state} hideSuccess />
      <div className="flex justify-end">
        <SubmitButton disabled={!decision}>Gửi quyết định</SubmitButton>
      </div>
    </ActionForm>
  );
}

/** Bảng duyệt ngoại lệ thiết bị (UC-OFF-07). */
export function DeviceExceptionForm({ taskId }: { taskId: number }) {
  const [state, action] = useActionThen(deviceExceptionAction, goDone);
  const [decision, setDecision] = useState("");
  const consequence =
    decision === "APPROVE_EXCEPTION"
      ? "Thiết bị chuyển Ngoại lệ – chưa thu hồi và vẫn được theo dõi. HR được thông báo."
      : decision === "CONTINUE"
        ? "IT tiếp tục thu hồi thiết bị."
        : null;
  return (
    <ActionForm action={action} className="space-y-4">
      <input type="hidden" name="taskId" value={taskId} />
      <div>
        <Label required>Quyết định</Label>
        <div className="flex gap-6">
          <Radio name="decision" value="APPROVE_EXCEPTION" checked={decision === "APPROVE_EXCEPTION"} onChange={setDecision}>
            Duyệt ngoại lệ
          </Radio>
          <Radio name="decision" value="CONTINUE" checked={decision === "CONTINUE"} onChange={setDecision}>
            Tiếp tục thu hồi
          </Radio>
        </div>
      </div>
      <div>
        <Label required={decision === "APPROVE_EXCEPTION"}>Lý do</Label>
        <textarea name="reason" rows={3} maxLength={500} className={inputClass(!!state.fieldErrors?.reason)} />
        <FieldError state={state} name="reason" />
      </div>
      {consequence && <div className="rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-900">ℹ {consequence}</div>}
      <FormResult state={state} hideSuccess />
      <div className="flex justify-end">
        <SubmitButton disabled={!decision}>Gửi quyết định</SubmitButton>
      </div>
    </ActionForm>
  );
}
