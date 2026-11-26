// Mọi mốc thời gian hiển thị và tính theo giờ Việt Nam (NFR-07, NFR-11).
// Cột kiểu Ngày (@db.Date) lưu nửa đêm UTC của ngày Việt Nam tương ứng.

export const VN_TZ = "Asia/Ho_Chi_Minh";
const VN_OFFSET_MS = 7 * 3600_000;
const DAY_MS = 86_400_000;

/** Ngày Việt Nam (yyyy-mm-dd) của một thời điểm. */
export function vnDateKey(d: Date): string {
  return new Date(d.getTime() + VN_OFFSET_MS).toISOString().slice(0, 10);
}

/** Giá trị lưu cột Ngày cho ngày Việt Nam của thời điểm d. */
export function vnDateOnly(d: Date): Date {
  return new Date(`${vnDateKey(d)}T00:00:00.000Z`);
}

/** Đọc "yyyy-mm-dd" (từ input type=date) thành giá trị cột Ngày. */
export function parseDateInput(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Đọc "yyyy-mm-ddTHH:mm" (giờ Việt Nam, từ input datetime-local). */
export function parseDateTimeInput(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) return null;
  const d = new Date(`${s}:00.000+07:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * DAY_MS);
}

export function addHours(d: Date, n: number): Date {
  return new Date(d.getTime() + n * 3600_000);
}

/** Thời điểm hh:mm giờ Việt Nam của một ngày (giá trị cột Ngày). */
export function vnTimeOn(dateOnly: Date, hh: number, mm = 0): Date {
  return new Date(dateOnly.getTime() + (hh * 60 + mm) * 60_000 - VN_OFFSET_MS);
}

/** Cuối ngày làm việc (23:59) giờ Việt Nam của ngày chứa thời điểm d. */
export function endOfVnDay(d: Date): Date {
  return vnTimeOn(vnDateOnly(d), 23, 59);
}

/** Số ngày lịch (theo ngày Việt Nam) từ a tới b. */
export function vnDayDiff(a: Date, b: Date): number {
  return Math.round((vnDateOnly(b).getTime() - vnDateOnly(a).getTime()) / DAY_MS);
}

function parts(d: Date) {
  const v = new Date(d.getTime() + VN_OFFSET_MS);
  const p = (n: number) => String(n).padStart(2, "0");
  return {
    dd: p(v.getUTCDate()),
    mm: p(v.getUTCMonth() + 1),
    yyyy: String(v.getUTCFullYear()),
    HH: p(v.getUTCHours()),
    MI: p(v.getUTCMinutes()),
  };
}

/** dd/mm/yyyy cho cột Ngày. */
export function fmtDate(d: Date | null | undefined): string {
  if (!d) return "–";
  const iso = d.toISOString();
  return `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
}

/** dd/mm/yyyy cho một thời điểm (theo giờ Việt Nam). */
export function fmtDay(d: Date | null | undefined): string {
  if (!d) return "–";
  const p = parts(d);
  return `${p.dd}/${p.mm}/${p.yyyy}`;
}

/** dd/mm/yyyy HH:mm theo giờ Việt Nam. */
export function fmtDateTime(d: Date | null | undefined): string {
  if (!d) return "–";
  const p = parts(d);
  return `${p.dd}/${p.mm}/${p.yyyy} ${p.HH}:${p.MI}`;
}

/** HH:mm dd/mm/yyyy (dùng cho thời điểm thu hồi). */
export function fmtTimeDate(d: Date | null | undefined): string {
  if (!d) return "–";
  const p = parts(d);
  return `${p.HH}:${p.MI} ${p.dd}/${p.mm}/${p.yyyy}`;
}

/** Giá trị cho input type=date. */
export function toDateInput(d: Date | null | undefined): string {
  return d ? d.toISOString().slice(0, 10) : "";
}

/** Giá trị cho input datetime-local, theo giờ Việt Nam. */
export function toDateTimeInput(d: Date): string {
  const p = parts(d);
  return `${p.yyyy}-${p.mm}-${p.dd}T${p.HH}:${p.MI}`;
}
