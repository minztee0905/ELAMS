// UAT Offboarding: nghỉ đột xuất → bàn giao (Manager cập nhật thay) → thu hồi quyền (gồm VPN ngoài ELAMS) → thiết bị và ngoại lệ → HR xác nhận.
import { expect, test } from "@playwright/test";
import { login, openTask, samplePdf } from "./helpers";

test("Offboarding đầu-cuối", async ({ page }) => {
  await login(page, "Lê Thu Hà");
  await page.goto("/offboarding/new");
  await page.locator("#employeeId").selectOption({ label: "Hoàng Văn Nam – Kế toán tổng hợp" });
  await expect(page.getByText(/LT-2025-0188/)).toBeVisible();
  const today = new Date(Date.now() + 7 * 3600_000).toISOString().slice(0, 10);
  await page.locator("#lastWorkingDate").fill(today);
  await page.locator("#leaveReason").selectOption("TERMINATION");
  await page.getByRole("radio", { name: "Có" }).check();
  await expect(page.getByText("Ngay khi gửi · hạn 4 giờ")).toBeVisible();
  await page.locator("input[name=urgentReason]").fill("Chấm dứt hợp đồng ngay");
  await page.getByRole("button", { name: "Gửi yêu cầu" }).click();
  await expect(page.getByText(/Đã tạo yêu cầu OFF-2026-\d+/)).toBeVisible();
  const code = (await page.locator("h1 span.font-semibold").textContent())!;

  // UAT-OFF-04, 05: Bình lập kế hoạch, cập nhật thay (đột xuất), xác nhận
  await login(page, "Trần Thị Bình");
  await openTask(page, /Bàn giao công việc · Hoàng Văn Nam/);
  await page.getByRole("button", { name: "+ Thêm hạng mục" }).click();
  await page.locator("tbody input:not([type=date])").first().fill("Sổ cái tháng 12");
  await page.locator("tbody select").first().selectOption({ label: "Lê Minh Châu" });
  await page.getByRole("button", { name: "Lưu kế hoạch" }).click();
  await expect(page.getByText("Đã lưu kế hoạch bàn giao.")).toBeVisible();
  await page.getByRole("button", { name: "Cập nhật thay nhân viên" }).click();
  await expect(page.getByRole("button", { name: "Xác nhận bàn giao đầy đủ" })).toBeVisible();
  await page.getByRole("button", { name: "Xác nhận bàn giao đầy đủ" }).click();
  await expect(page.getByText("Đã xác nhận bàn giao đầy đủ.")).toBeVisible();

  // UAT-OFF-06, 07: thu hồi quyền, chưa thu hồi được, VPN ngoài ELAMS
  await login(page, "Phạm Quốc Dũng");
  await openTask(page, /Thu hồi quyền · Hoàng Văn Nam/);
  const rows = page.locator("tbody tr");
  await expect(rows).toHaveCount(3);
  await page.getByRole("button", { name: "+ Bổ sung quyền cấp ngoài ELAMS" }).click();
  const dlg = page.getByRole("dialog");
  await dlg.locator("input[name=accessName]").fill("VPN");
  await dlg.locator("select[name=systemId]").selectOption({ label: "VPN" });
  await dlg.locator("input[name=accountIdentifier]").fill("nam.hoang");
  await dlg.getByRole("button", { name: "Thêm mục thu hồi" }).click();
  await expect(rows).toHaveCount(4);
  // MISA chưa thu hồi được
  await rows.filter({ hasText: "Phần mềm kế toán" }).getByRole("button", { name: "Ghi kết quả" }).click();
  await page.getByRole("dialog").filter({ hasText: "Phần mềm kế toán" }).getByRole("radio", { name: "Chưa thu hồi được" }).check();
  await page.getByRole("dialog").filter({ hasText: "Phần mềm kế toán" }).locator("textarea[name=failureReason]").fill("Hệ thống đang bảo trì");
  await page.getByRole("dialog").filter({ hasText: "Phần mềm kế toán" }).getByRole("button", { name: "Lưu kết quả" }).click();
  await expect(rows.filter({ hasText: "Phần mềm kế toán" }).locator("span", { hasText: "Chưa thu hồi được" }).first()).toBeVisible();
  for (const name of ["Email công ty", "CRM nội bộ", "VPN", "Phần mềm kế toán"]) {
    await rows.filter({ hasText: name }).getByRole("button", { name: "Ghi kết quả" }).click();
    const d = page.getByRole("dialog").filter({ hasText: `Ghi kết quả thu hồi – ${name}` });
    await d.getByRole("radio", { name: "Đã vô hiệu hóa" }).check();
    await d.locator("input[name=ticket]").fill(`IT-${name.length}`);
    await d.getByRole("button", { name: "Lưu kết quả" }).click();
    await expect(rows.filter({ hasText: name }).locator("span", { hasText: "Đã vô hiệu hóa" }).first()).toBeVisible();
  }

  // UAT-OFF-08, 09: laptop trả, màn hình thiếu → ngoại lệ
  await openTask(page, /Thu hồi thiết bị · Hoàng Văn Nam/);
  const lt = page.locator("tbody tr").filter({ hasText: "LT-2025-0188" });
  await lt.getByRole("button", { name: "Ghi nhận thu hồi" }).click();
  const rd = page.getByRole("dialog").filter({ hasText: "Ghi nhận thu hồi LT-2025-0188" });
  await rd.getByRole("button", { name: "Lưu" }).click();
  await expect(rd.getByText("Vui lòng nhập tình trạng.").first()).toBeVisible();
  await rd.locator("select[name=condition]").selectOption("GOOD");
  await rd.getByRole("button", { name: "Lưu" }).click();
  await expect(lt.getByText("Đã thu hồi")).toBeVisible();
  const mn = page.locator("tbody tr").filter({ hasText: "MN-2025-0042" });
  await mn.getByRole("button", { name: "Ghi nhận thiếu" }).click();
  const md = page.getByRole("dialog").filter({ hasText: "Ghi nhận thiếu MN-2025-0042" });
  await md.locator("textarea[name=missingReason]").fill("Màn hình để tại nhà, nhân viên không mang trả");
  await md.locator("input[name=evidenceFile]").setInputFiles(samplePdf());
  await md.getByRole("button", { name: "Lưu" }).click();
  await expect(mn.getByText("Thiếu – chờ quyết định")).toBeVisible();

  await login(page, "Trần Thị Bình");
  await openTask(page, /Duyệt ngoại lệ thiết bị · MN-2025-0042/);
  await page.getByRole("radio", { name: "Duyệt ngoại lệ" }).check();
  await page.locator("textarea[name=reason]").fill("Đã trừ vào lương tháng cuối");
  await page.getByRole("button", { name: "Gửi quyết định" }).click();
  await expect(page.getByText(/Đã duyệt ngoại lệ/)).toBeVisible();

  // UAT-OFF-10: HR xác nhận hoàn tất
  await login(page, "Lê Thu Hà");
  await page.goto(`/offboarding/${code}`);
  await expect(page.getByText("Đủ điều kiện, chờ HR xác nhận hoàn tất")).toBeVisible();
  await expect(page.getByText(/MN-2025-0042 – duyệt bởi Trần Thị Bình/)).toBeVisible();
  await page.getByRole("button", { name: "Xác nhận hoàn tất" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Xác nhận" }).click();
  await expect(page.getByText(/Đã hoàn tất ngày/)).toBeVisible();

  // FR-OFF-13: tài khoản ELAMS của Nam bị vô hiệu hóa
  await page.context().clearCookies();
  await page.goto("/login");
  await expect(page.getByRole("button", { name: /^Hoàng Văn Nam/ })).toBeDisabled();
});
