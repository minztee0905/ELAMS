// Đồng hồ hệ thống có hỗ trợ giả lập thời gian cho demo và UAT
// ("giả lập sang 29/11" trong kịch bản UAT). Độ lệch lưu ở system_setting.
import { db } from "@/lib/db";

const KEY = "clock_offset_ms";

export async function getClockOffset(): Promise<number> {
  const row = await db.systemSetting.findUnique({ where: { key: KEY } });
  return row ? Number(row.value) : 0;
}

export async function getNow(): Promise<Date> {
  return new Date(Date.now() + (await getClockOffset()));
}

export async function setSimulatedNow(target: Date | null): Promise<void> {
  const offset = target ? target.getTime() - Date.now() : 0;
  await db.systemSetting.upsert({
    where: { key: KEY },
    create: { key: KEY, value: String(offset) },
    update: { value: String(offset) },
  });
}
