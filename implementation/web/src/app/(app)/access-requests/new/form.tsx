"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, FieldError, FormResult, Label, SubmitButton, inputClass, ActionForm, useActionThen } from "@/components/forms";
import { Card, SectionTitle, SensitiveBadge, btnClass } from "@/components/ui";
import { submitArAction } from "../actions";

type Cat = { id: number; name: string; system: string; sensitive: boolean; levels: string[] };

export function ArForm({ catalog, grants, today }: { catalog: Cat[]; grants: { accessId: number; level: string }[]; today: string }) {
  const [state, action] = useActionThen(submitArAction, (r, router) => {
    if (r.ok && r.data) router.push(`/access-requests/${(r.data as { code: string }).code}?msg=${encodeURIComponent(r.message ?? "")}`);
  });
  const [submissionKey] = useState(() => crypto.randomUUID());
  const [accessId, setAccessId] = useState("");
  const router = useRouter();
  const c = catalog.find((x) => x.id === Number(accessId));
  const has = grants.filter((g) => g.accessId === Number(accessId));

  return (
    <ActionForm action={action}>
      <input type="hidden" name="submissionKey" value={submissionKey} />
      <Card>
        <SectionTitle>Quyền cần cấp</SectionTitle>
        <div className="space-y-4">
          <FormResult state={state} />
          <Field label="Quyền" name="accessId" state={state} required>
            <select id="accessId" name="accessId" value={accessId} onChange={(e) => setAccessId(e.target.value)} className={inputClass(!!state.fieldErrors?.accessId)}>
              <option value="">– Chọn quyền –</option>
              {catalog.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.system})
                </option>
              ))}
            </select>
          </Field>
          {c && (
            <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
              <p>
                Hệ thống: {c.system} {c.sensitive && <SensitiveBadge />}
              </p>
              <p>Cấp phê duyệt: {c.sensitive ? "Manager → Security → IT" : "Manager → IT"}</p>
            </div>
          )}
          {has.length > 0 && c && (
            <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p>
                ⚠ Bạn đã có quyền {c.name} mức {has.map((h) => h.level).join(", ")}. Chỉ gửi nếu bạn cần mức quyền khác.
              </p>
              <label className="mt-2 flex items-center gap-2">
                <input type="checkbox" name="confirmHasAccess" value="1" /> Tôi vẫn muốn gửi yêu cầu
              </label>
            </div>
          )}
          <Field label="Mức quyền" name="level" state={state} required>
            <select id="level" name="level" key={accessId} className={inputClass(!!state.fieldErrors?.level)}>
              {(c?.levels ?? []).map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="Lý do sử dụng" name="reason" state={state} required>
            <textarea id="reason" name="reason" rows={3} maxLength={500} className={inputClass(!!state.fieldErrors?.reason)} />
          </Field>
          <Field label="Ngày cần có quyền" name="neededBy" state={state}>
            <input id="neededBy" type="date" name="neededBy" min={today} className={inputClass(!!state.fieldErrors?.neededBy)} />
          </Field>
          <div>
            <Label>Tệp đính kèm</Label>
            <input type="file" name="attachment" accept=".pdf,.jpg,.jpeg,.png" className="text-sm" />
            <FieldError state={state} name="attachment" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className={btnClass("secondary")} onClick={() => router.push("/access-requests")}>
              Hủy
            </button>
            <SubmitButton>Gửi yêu cầu</SubmitButton>
          </div>
        </div>
      </Card>
    </ActionForm>
  );
}
