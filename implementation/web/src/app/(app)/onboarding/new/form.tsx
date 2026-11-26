"use client";

// SCR-ON-01 – Tạo yêu cầu onboarding.
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { Dialog, Field, FieldError, FormResult, SubmitButton, inputClass, ActionForm } from "@/components/forms";
import { Badge, Card, SectionTitle, SensitiveBadge, btnClass } from "@/components/ui";
import { DEVICE_TYPE } from "@/lib/labels";
import { createOnboardingAction } from "../actions";

type Catalog = { id: number; name: string; system: string; levels: string[]; sensitive: boolean };
type AccessRow = { key: string; accessId: number | null; level: string; isMandatory: boolean | null; fromTemplate: boolean; locked: boolean };
type DeviceRow = { key: string; deviceType: string; configNote: string; fromTemplate: boolean };

let seq = 0;
const k = () => `r${++seq}`;

export function OnboardingForm(props: {
  today: string;
  departments: { id: number; name: string }[];
  titles: { id: number; name: string }[];
  managers: { id: number; name: string; departmentId: number }[];
  catalog: Catalog[];
  accessTpl: { jobTitleId: number; accessId: number; level: string; mandatory: boolean }[];
  deviceTpl: { jobTitleId: number; deviceType: string; note: string }[];
}) {
  const [state, action] = useActionState(createOnboardingAction, {});
  // NFR-04: cùng một khóa cho mọi lần gửi lại của biểu mẫu này.
  const [submissionKey] = useState(() => crypto.randomUUID());
  const [form, setForm] = useState({ fullName: "", personalEmail: "", departmentId: "", jobTitleId: "", startDate: "", managerId: "", note: "" });
  const [accesses, setAccesses] = useState<AccessRow[]>([]);
  const [devices, setDevices] = useState<DeviceRow[]>([]);
  const [edited, setEdited] = useState(false);
  const [pendingTitle, setPendingTitle] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const cat = useMemo(() => new Map(props.catalog.map((c) => [c.id, c])), [props.catalog]);
  const fe = state.fieldErrors ?? {};

  function loadTemplate(titleId: string) {
    const id = Number(titleId);
    setAccesses(
      props.accessTpl
        .filter((t) => t.jobTitleId === id)
        .map((t) => ({ key: k(), accessId: t.accessId, level: t.level, isMandatory: t.mandatory, fromTemplate: true, locked: t.mandatory })),
    );
    setDevices(props.deviceTpl.filter((t) => t.jobTitleId === id).map((t) => ({ key: k(), deviceType: t.deviceType, configNote: t.note, fromTemplate: true })));
    setEdited(false);
    setForm((f) => ({ ...f, jobTitleId: titleId }));
  }

  function onTitle(v: string) {
    if (edited && (accesses.length || devices.length)) setPendingTitle(v);
    else loadTemplate(v);
  }

  function onDepartment(v: string) {
    const head = props.managers.find((m) => m.departmentId === Number(v));
    setForm((f) => ({ ...f, departmentId: v, managerId: f.managerId || (head ? String(head.id) : "") }));
  }

  const updateAccess = (key: string, patch: Partial<AccessRow>) => {
    setEdited(true);
    setAccesses((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };
  const move = (i: number, d: number) => {
    setEdited(true);
    setAccesses((rows) => {
      const next = [...rows];
      [next[i], next[i + d]] = [next[i + d], next[i]];
      return next;
    });
  };

  const payload = JSON.stringify({
    ...form,
    departmentId: Number(form.departmentId) || 0,
    jobTitleId: Number(form.jobTitleId) || 0,
    managerId: Number(form.managerId) || 0,
    accesses: accesses.map((a) => ({ accessId: a.accessId ?? 0, level: a.level, isMandatory: a.isMandatory, fromTemplate: a.fromTemplate })),
    devices: devices.map((d) => ({ deviceType: d.deviceType, configNote: d.configNote, fromTemplate: d.fromTemplate })),
    submissionKey,
  });

  if (state.ok && state.data) {
    const d = state.data as { requestCode: string; summary: string; tasks: { label: string; assignee: string; due: string }[]; waiting: string[] };
    return (
      <Card>
        <p className="mb-1 text-lg font-semibold text-green-700">✓ {state.message}</p>
        <p className="mb-5 text-sm text-gray-700">
          {d.summary} · Bắt đầu {form.startDate.split("-").reverse().join("/")} <Badge tone="blue">Đang xử lý</Badge>
        </p>
        <p className="mb-2 text-sm font-semibold">Nhiệm vụ đã tạo</p>
        <table className="mb-4 w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr>
              <th className="py-2">Nhiệm vụ</th>
              <th>Người phụ trách</th>
              <th>Hạn</th>
            </tr>
          </thead>
          <tbody>
            {d.tasks.map((t, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="py-2">{t.label}</td>
                <td>{t.assignee}</td>
                <td>{t.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {d.waiting.length > 0 && <p className="mb-5 text-sm text-gray-600">Quyền chờ xử lý theo thứ tự: {d.waiting.join(", ")}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" className={btnClass("secondary")} onClick={() => window.location.reload()}>
            Tạo yêu cầu khác
          </button>
          <Link href={`/onboarding/${d.requestCode}`} className={btnClass("primary")}>
            Xem chi tiết yêu cầu
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <ActionForm action={action} className="space-y-5">
      <input type="hidden" name="payload" value={payload} />
      {state.error && <FormResult state={state} />}

      <Card>
        <SectionTitle>A. Thông tin nhân viên mới</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Họ và tên" name="fullName" state={state} required>
            <input id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass(!!fe.fullName)} />
          </Field>
          <Field label="Email cá nhân" name="personalEmail" state={state} required>
            <input id="personalEmail" type="email" value={form.personalEmail} onChange={(e) => setForm({ ...form, personalEmail: e.target.value })} className={inputClass(!!fe.personalEmail)} />
          </Field>
          <Field label="Phòng ban" name="departmentId" state={state} required>
            <select id="departmentId" value={form.departmentId} onChange={(e) => onDepartment(e.target.value)} className={inputClass(!!fe.departmentId)}>
              <option value="">– Chọn –</option>
              {props.departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Chức danh" name="jobTitleId" state={state} required hint="Đổi chức danh sẽ tải lại danh sách đề xuất">
            <select id="jobTitleId" value={form.jobTitleId} onChange={(e) => onTitle(e.target.value)} className={inputClass(!!fe.jobTitleId)}>
              <option value="">– Chọn –</option>
              {props.titles.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle>B. Thời gian và quản lý</SectionTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Ngày bắt đầu" name="startDate" state={state} required>
            <input id="startDate" type="date" min={props.today} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={inputClass(!!fe.startDate)} />
          </Field>
          <Field label="Manager trực tiếp" name="managerId" state={state} required>
            <select id="managerId" value={form.managerId} onChange={(e) => setForm({ ...form, managerId: e.target.value })} className={inputClass(!!fe.managerId)}>
              <option value="">– Chọn –</option>
              {props.managers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle
          right={
            <button
              type="button"
              className={btnClass("secondary")}
              onClick={() => {
                setEdited(true);
                setAccesses((r) => [...r, { key: k(), accessId: null, level: "", isMandatory: null, fromTemplate: false, locked: false }]);
              }}
            >
              + Thêm quyền
            </button>
          }
        >
          C. Danh sách quyền <span className="ml-1 font-normal normal-case text-gray-500">(xử lý lần lượt theo thứ tự)</span>
        </SectionTitle>
        <FieldError state={state} name="accesses" />
        {!form.jobTitleId && <p className="text-sm text-gray-500">Chọn chức danh để tải danh sách đề xuất.</p>}
        {form.jobTitleId && accesses.length === 0 && (
          <p className="text-sm text-amber-700">Chức danh này chưa có mẫu. Vui lòng thêm quyền và thiết bị thủ công, chọn phân loại cho từng quyền.</p>
        )}
        {accesses.length > 0 && (
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="w-8 py-2">#</th>
                <th>Quyền</th>
                <th>Hệ thống</th>
                <th>Mức</th>
                <th>Phân loại *</th>
                <th>Nhạy cảm</th>
                <th className="w-24" />
              </tr>
            </thead>
            <tbody>
              {accesses.map((a, i) => {
                const c = a.accessId ? cat.get(a.accessId) : undefined;
                return (
                  <tr key={a.key} className="border-t border-gray-100 align-top">
                    <td className="py-3">{i + 1}</td>
                    <td className="py-2 pr-2">
                      {a.fromTemplate ? (
                        <span>{c?.name}</span>
                      ) : (
                        <select
                          value={a.accessId ?? ""}
                          onChange={(e) => {
                            const nc = cat.get(Number(e.target.value));
                            updateAccess(a.key, { accessId: Number(e.target.value) || null, level: nc?.levels[0] ?? "" });
                          }}
                          className={inputClass(!!fe[`accesses.${i}.accessId`])}
                        >
                          <option value="">– Chọn quyền –</option>
                          {props.catalog.map((o) => (
                            <option key={o.id} value={o.id} disabled={accesses.some((x) => x.accessId === o.id && x.key !== a.key)}>
                              {o.name}
                            </option>
                          ))}
                        </select>
                      )}
                      <div className="mt-1">
                        <Badge tone={a.fromTemplate ? "gray" : "blue"}>{a.fromTemplate ? "Mẫu" : "Thêm thủ công"}</Badge>
                      </div>
                      <FieldError state={state} name={`accesses.${i}.accessId`} />
                    </td>
                    <td className="py-3">{c?.system ?? "–"}</td>
                    <td className="py-2 pr-2">
                      <select value={a.level} onChange={(e) => updateAccess(a.key, { level: e.target.value })} className={inputClass(!!fe[`accesses.${i}.level`])}>
                        {(c?.levels ?? []).map((l) => (
                          <option key={l}>{l}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3">
                      {a.locked ? (
                        <span title="Quyền này là bắt buộc theo mẫu vị trí. Không thể đổi sang không bắt buộc.">Bắt buộc 🔒</span>
                      ) : (
                        <div className="space-y-1">
                          {[
                            [true, "Bắt buộc"],
                            [false, "Không bắt buộc"],
                          ].map(([v, l]) => (
                            <label key={String(v)} className="flex items-center gap-1.5">
                              <input type="radio" checked={a.isMandatory === v} onChange={() => updateAccess(a.key, { isMandatory: v as boolean })} />
                              {l as string}
                            </label>
                          ))}
                        </div>
                      )}
                      <FieldError state={state} name={`accesses.${i}.isMandatory`} />
                    </td>
                    <td className="py-3">{c?.sensitive && <SensitiveBadge />}</td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="px-1 text-gray-500 disabled:opacity-30" aria-label="Lên">
                        ↑
                      </button>
                      <button type="button" disabled={i === accesses.length - 1} onClick={() => move(i, 1)} className="px-1 text-gray-500 disabled:opacity-30" aria-label="Xuống">
                        ↓
                      </button>
                      {!a.locked && (
                        <button
                          type="button"
                          onClick={() => {
                            setEdited(true);
                            setAccesses((r) => r.filter((x) => x.key !== a.key));
                          }}
                          className="px-1 text-red-500"
                          aria-label="Xóa"
                        >
                          🗑
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      <Card>
        <SectionTitle
          right={
            <button
              type="button"
              className={btnClass("secondary")}
              onClick={() => {
                setEdited(true);
                setDevices((r) => [...r, { key: k(), deviceType: "", configNote: "", fromTemplate: false }]);
              }}
            >
              + Thêm thiết bị
            </button>
          }
        >
          D. Thiết bị
        </SectionTitle>
        {devices.length === 0 && <p className="text-sm text-gray-500">Chưa có thiết bị.</p>}
        <div className="space-y-2">
          {devices.map((d, i) => (
            <div key={d.key} className="grid grid-cols-[220px_1fr_40px] items-start gap-3">
              <div>
                <select
                  value={d.deviceType}
                  onChange={(e) => {
                    setEdited(true);
                    setDevices((r) => r.map((x) => (x.key === d.key ? { ...x, deviceType: e.target.value } : x)));
                  }}
                  className={inputClass(!!fe[`devices.${i}.deviceType`])}
                >
                  <option value="">– Loại thiết bị –</option>
                  {Object.entries(DEVICE_TYPE).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
                {d.fromTemplate && <Badge className="mt-1">Mẫu</Badge>}
              </div>
              <input
                value={d.configNote}
                maxLength={200}
                placeholder="Ghi chú cấu hình"
                onChange={(e) => setDevices((r) => r.map((x) => (x.key === d.key ? { ...x, configNote: e.target.value } : x)))}
                className={inputClass()}
              />
              <button type="button" onClick={() => setDevices((r) => r.filter((x) => x.key !== d.key))} className="py-2 text-red-500" aria-label="Xóa">
                🗑
              </button>
            </div>
          ))}
        </div>
        <FieldError state={state} name="devices" />
      </Card>

      <Card>
        <SectionTitle>E. Ghi chú</SectionTitle>
        <textarea
          value={form.note}
          maxLength={500}
          rows={3}
          placeholder="Yêu cầu đặc biệt (không bắt buộc)"
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className={inputClass()}
        />
      </Card>

      <div className="flex justify-end gap-2">
        <button type="button" className={btnClass("secondary")} onClick={() => (form.fullName || accesses.length ? setCancelOpen(true) : history.back())}>
          Hủy
        </button>
        <SubmitButton>Gửi yêu cầu</SubmitButton>
      </div>

      <Dialog open={pendingTitle !== null} onClose={() => setPendingTitle(null)} title="Đổi chức danh?">
        <p className="mb-5 text-sm">Danh sách quyền và thiết bị đã chỉnh sửa sẽ được thay bằng mẫu của chức danh mới.</p>
        <div className="flex justify-end gap-2">
          <button type="button" className={btnClass("secondary")} onClick={() => setPendingTitle(null)}>
            Giữ danh sách hiện tại
          </button>
          <button
            type="button"
            className={btnClass("primary")}
            onClick={() => {
              loadTemplate(pendingTitle!);
              setPendingTitle(null);
            }}
          >
            Thay bằng mẫu mới
          </button>
        </div>
      </Dialog>
      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)} title="Bỏ dữ liệu đã nhập?">
        <div className="flex justify-end gap-2">
          <button type="button" className={btnClass("secondary")} onClick={() => setCancelOpen(false)}>
            Tiếp tục nhập
          </button>
          <Link href="/onboarding" className={btnClass("danger")}>
            Bỏ
          </Link>
        </div>
      </Dialog>
    </ActionForm>
  );
}
