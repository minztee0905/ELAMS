"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Field, FormResult, Label, SubmitButton, inputClass, ActionForm, useActionThen } from "@/components/forms";
import { Card, SectionTitle, btnClass } from "@/components/ui";
import { LEAVE_REASON } from "@/lib/labels";
import { createOffboardingAction, previewEmployeeAction } from "../actions";

type Preview = Awaited<ReturnType<typeof previewEmployeeAction>>;

export function OffboardingForm({ employees, today }: { employees: { id: number; label: string }[]; today: string }) {
  const [state, action] = useActionThen(createOffboardingAction, (r, router) => {
    if (r.ok && r.data) router.push(`/offboarding/${(r.data as { code: string }).code}?msg=${encodeURIComponent(r.message ?? "")}`);
  });
  const [submissionKey] = useState(() => crypto.randomUUID());
  const [employeeId, setEmployeeId] = useState("");
  const [preview, setPreview] = useState<Preview>(null);
  const [lastDay, setLastDay] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [, start] = useTransition();
  const past = !!lastDay && lastDay < today;

  return (
    <ActionForm action={action} className="max-w-3xl space-y-5">
      <input type="hidden" name="submissionKey" value={submissionKey} />
      <input type="hidden" name="isUrgent" value={urgent ? "1" : "0"} />
      {state.code !== "LAST_DAY_PAST" && <FormResult state={state} />}
      <Card>
        <SectionTitle>Nhân viên</SectionTitle>
        <Field label="Nhân viên" name="employeeId" state={state} required>
          <select
            id="employeeId"
            name="employeeId"
            value={employeeId}
            onChange={(e) => {
              const v = e.target.value;
              setEmployeeId(v);
              start(async () => setPreview(v ? await previewEmployeeAction(Number(v)) : null));
            }}
            className={inputClass(!!state.fieldErrors?.employeeId)}
          >
            <option value="">– Chọn nhân viên đang làm việc –</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.label}
              </option>
            ))}
          </select>
        </Field>
        {preview && (
          <p className="mt-2 text-sm text-gray-600">
            Phòng ban: {preview.department} · Manager: {preview.manager}
          </p>
        )}
        {preview?.openCode && (
          <div className="mt-3 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            Nhân viên này đã có yêu cầu offboarding đang xử lý: {preview.openCode}.{" "}
            <Link href={`/offboarding/${preview.openCode}`} className="font-medium underline">
              Mở yêu cầu
            </Link>
          </div>
        )}
      </Card>
      <Card>
        <SectionTitle>Thông tin nghỉ việc</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Ngày làm việc cuối cùng" name="lastWorkingDate" state={state} required>
            <input id="lastWorkingDate" type="date" name="lastWorkingDate" value={lastDay} onChange={(e) => setLastDay(e.target.value)} className={inputClass(!!state.fieldErrors?.lastWorkingDate && !urgent)} />
          </Field>
          <Field label="Lý do nghỉ việc" name="leaveReason" state={state} required>
            <select id="leaveReason" name="leaveReason" defaultValue="" className={inputClass(!!state.fieldErrors?.leaveReason)}>
              <option value="">– Chọn –</option>
              {Object.entries(LEAVE_REASON).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
        </div>
        {past && !urgent && (
          <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            ⚠ Ngày làm việc cuối cùng đã qua. Quyền của nhân viên có thể vẫn đang hoạt động. Bạn có muốn đánh dấu nghỉ đột xuất để thu hồi ngay?
            <button type="button" className="ml-2 font-medium underline" onClick={() => setUrgent(true)}>
              Đánh dấu đột xuất
            </button>
          </div>
        )}
        <div className="mt-4">
          <Label required>Nghỉ đột xuất</Label>
          <div className="flex gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" checked={!urgent} onChange={() => setUrgent(false)} /> Không
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={urgent} onChange={() => setUrgent(true)} /> Có
            </label>
          </div>
        </div>
        {urgent && (
          <div className="mt-3">
            <Label>Lý do đột xuất</Label>
            <input name="urgentReason" className={inputClass()} />
          </div>
        )}
        <p className="mt-3 text-sm">
          <span className="text-gray-500">Thời điểm thu hồi quyền:</span>{" "}
          <b>{urgent ? "Ngay khi gửi · hạn 4 giờ" : lastDay ? `18:00 ${lastDay.split("-").reverse().join("/")}` : "–"}</b>
        </p>
        <div className="mt-3">
          <Label>Ghi chú</Label>
          <textarea name="note" rows={2} maxLength={500} className={inputClass()} />
        </div>
      </Card>
      {preview && (
        <Card>
          <SectionTitle>Sẽ thu hồi (từ lịch sử cấp phát trên ELAMS)</SectionTitle>
          {preview.grants.length === 0 && preview.devices.length === 0 ? (
            <p className="text-sm text-gray-600">Chưa có quyền hay thiết bị nào cấp qua ELAMS. IT sẽ rà soát.</p>
          ) : (
            <dl className="space-y-1 text-sm">
              <div className="grid grid-cols-[80px_1fr]">
                <dt className="text-gray-500">Quyền:</dt>
                <dd>{preview.grants.join(" · ") || "–"}</dd>
              </div>
              <div className="grid grid-cols-[80px_1fr]">
                <dt className="text-gray-500">Thiết bị:</dt>
                <dd>{preview.devices.join(" · ") || "–"}</dd>
              </div>
            </dl>
          )}
          <p className="mt-2 text-sm text-gray-500">ℹ IT bổ sung quyền cấp ngoài ELAMS khi thu hồi.</p>
        </Card>
      )}
      <div className="flex justify-end gap-2">
        <Link href="/offboarding" className={btnClass("secondary")}>
          Hủy
        </Link>
        <SubmitButton disabled={!!preview?.openCode}>Gửi yêu cầu</SubmitButton>
      </div>
    </ActionForm>
  );
}
