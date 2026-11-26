"use client";

import { useState } from "react";
import { Dialog, FieldError, FormResult, Label, SubmitButton, inputClass, useDialogForm, ActionForm, useActionThen } from "@/components/forms";
import { btnClass } from "@/components/ui";
import { HANDOVER_CONDITION } from "@/lib/labels";
import { deviceAvailableAction, deviceMissingAction, handoverAction } from "./actions";

export function DeviceLineForm({
  taskId,
  lineId,
  devices,
  nowInput,
  today,
  handedBy,
  receiver,
}: {
  taskId: number;
  lineId: number;
  devices: { id: number; label: string }[];
  nowInput: string;
  today: string;
  handedBy: string;
  receiver: string;
}) {
  const [stock, setStock] = useState("");
  const [cond, setCond] = useState("");
  const [hState, hAction] = useActionThen(handoverAction, (r, router) => r.ok && router.refresh());
  const [mState, mAction] = useActionThen(deviceMissingAction, (r, router) => r.ok && router.refresh());

  return (
    <div className="space-y-4">
      <div>
        <Label required>Tình trạng kho</Label>
        <div className="flex gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" checked={stock === "OK"} onChange={() => setStock("OK")} /> Có thiết bị phù hợp
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={stock === "MISSING"} onChange={() => setStock("MISSING")} /> Thiếu thiết bị
          </label>
        </div>
      </div>
      {stock === "OK" && (
        <ActionForm action={hAction} className="grid gap-4 md:grid-cols-2">
          <input type="hidden" name="taskId" value={taskId} />
          <input type="hidden" name="lineId" value={lineId} />
          <div>
            <Label required>Mã thiết bị</Label>
            <select name="deviceId" className={inputClass(!!hState.fieldErrors?.deviceId)} defaultValue="">
              <option value="">– Chọn thiết bị trong kho –</option>
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
            <FieldError state={hState} name="deviceId" />
          </div>
          <div>
            <Label required>Thời gian bàn giao</Label>
            <input type="datetime-local" name="handedOverAt" max={nowInput} defaultValue={nowInput} className={inputClass(!!hState.fieldErrors?.handedOverAt)} />
            <FieldError state={hState} name="handedOverAt" />
          </div>
          <div>
            <Label required>Tình trạng thiết bị</Label>
            <select name="condition" value={cond} onChange={(e) => setCond(e.target.value)} className={inputClass(!!hState.fieldErrors?.condition)}>
              <option value="">– Chọn –</option>
              {Object.entries(HANDOVER_CONDITION).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            <FieldError state={hState} name="condition" />
          </div>
          {cond === "USED_NOTED" && (
            <div>
              <Label required>Mô tả tình trạng</Label>
              <input name="conditionNote" className={inputClass(!!hState.fieldErrors?.conditionNote)} />
              <FieldError state={hState} name="conditionNote" />
            </div>
          )}
          <div>
            <Label required>Mã biên bản</Label>
            <input name="recordCode" maxLength={30} className={inputClass(!!hState.fieldErrors?.recordCode)} placeholder="VD: BB-0912" />
            <FieldError state={hState} name="recordCode" />
          </div>
          <div>
            <Label required>Biên bản đã ký</Label>
            <input type="file" name="recordFile" accept=".pdf,.jpg,.jpeg,.png" className="text-sm" />
            <FieldError state={hState} name="recordFile" />
          </div>
          <p className="text-sm text-gray-600">Người giao: {handedBy} (bạn)</p>
          <p className="text-sm text-gray-600">Người nhận: {receiver}</p>
          <div className="md:col-span-2">
            <FormResult state={hState} hideSuccess />
          </div>
          <div className="flex justify-end md:col-span-2">
            <SubmitButton>Hoàn thành bàn giao</SubmitButton>
          </div>
        </ActionForm>
      )}
      {stock === "MISSING" && (
        <ActionForm action={mAction} className="grid gap-4 md:grid-cols-2">
          <input type="hidden" name="taskId" value={taskId} />
          <input type="hidden" name="lineId" value={lineId} />
          <div>
            <Label required>Lý do chờ</Label>
            <input name="waitingReason" maxLength={300} className={inputClass(!!mState.fieldErrors?.waitingReason)} />
            <FieldError state={mState} name="waitingReason" />
          </div>
          <div>
            <Label>Dự kiến có thiết bị</Label>
            <input type="date" name="expectedAt" min={today} className={inputClass(!!mState.fieldErrors?.expectedAt)} />
            <FieldError state={mState} name="expectedAt" />
          </div>
          <div className="md:col-span-2">
            <FormResult state={mState} hideSuccess />
          </div>
          <div className="flex justify-end md:col-span-2">
            <SubmitButton variant="secondary">Ghi nhận thiếu thiết bị</SubmitButton>
          </div>
        </ActionForm>
      )}
    </div>
  );
}

export function DeviceAvailableButton({ taskId, lineId }: { taskId: number; lineId: number }) {
  const { open, setOpen, state, action } = useDialogForm(deviceAvailableAction);
  const [kind, setKind] = useState("AS_REQUESTED");
  return (
    <>
      <button className={btnClass("secondary")} onClick={() => setOpen(true)}>
        Đã có thiết bị
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Xác nhận đã có thiết bị">
        <ActionForm action={action} className="space-y-4">
          <input type="hidden" name="taskId" value={taskId} />
          <input type="hidden" name="lineId" value={lineId} />
          <div className="space-y-1 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="kind" value="AS_REQUESTED" checked={kind === "AS_REQUESTED"} onChange={() => setKind("AS_REQUESTED")} /> Thiết bị như yêu cầu
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="kind" value="REPLACEMENT" checked={kind === "REPLACEMENT"} onChange={() => setKind("REPLACEMENT")} /> Thiết bị thay thế
            </label>
          </div>
          {kind === "REPLACEMENT" && (
            <div>
              <Label required>Mô tả thiết bị thay thế</Label>
              <input name="description" className={inputClass(!!state.fieldErrors?.description)} />
              <FieldError state={state} name="description" />
            </div>
          )}
          <FormResult state={state} hideSuccess />
          <div className="flex justify-end gap-2">
            <button type="button" className={btnClass("secondary")} onClick={() => setOpen(false)}>
              Hủy
            </button>
            <SubmitButton>Xác nhận</SubmitButton>
          </div>
        </ActionForm>
      </Dialog>
    </>
  );
}
