// UAT Onboarding: tạo yêu cầu → duyệt → cấp quyền → từ chối quyền không bắt buộc → bàn giao thiết bị → HR xác nhận.
import { expect, test } from "@playwright/test";
import { login, openTask, samplePdf } from "./helpers";

test("Onboarding đầu-cuối", async ({ page }) => {
  // UAT-ON-01: HR tạo yêu cầu
  await login(page, "Lê Thu Hà");
  await page.goto("/onboarding/new");
  await page.locator("#fullName").fill("Lê Văn Tâm");
  await page.locator("#personalEmail").fill("tam.le@gmail.com");
  await page.locator("#departmentId").selectOption({ label: "Kế toán" });
  await page.locator("#jobTitleId").selectOption({ label: "Kế toán viên" });
  await expect(page.getByText("Phần mềm kế toán")).toBeVisible();
  const start = new Date(Date.now() + 7 * 86400_000).toISOString().slice(0, 10);
  await page.locator("#startDate").fill(start);
  await page.locator("#managerId").selectOption({ label: "Trần Thị Bình" });
  await page.getByRole("button", { name: "Gửi yêu cầu" }).click();
  await expect(page.getByText(/Đã tạo yêu cầu ONB-2026-\d+ và 2 nhiệm vụ/)).toBeVisible();
  await page.getByRole("link", { name: "Xem chi tiết yêu cầu" }).click();
  await expect(page.getByText("Chờ quyền #1")).toBeVisible();
  const code = (await page.locator("h1 span.font-semibold").textContent())!;

  // UAT-ON-05: Manager duyệt Email
  await login(page, "Trần Thị Bình");
  await openTask(page, /Xét duyệt quyền · Email công ty · Lê Văn Tâm/);
  await page.getByRole("radio", { name: "Phê duyệt" }).check();
  await expect(page.getByText("ℹ IT sẽ nhận nhiệm vụ cấp quyền.")).toBeVisible();
  await page.getByRole("button", { name: "Gửi quyết định" }).click();
  await expect(page.getByText(/Đã lưu quyết định/)).toBeVisible();

  // UAT-ON-08: IT cấp quyền, thiếu bằng chứng thì không lưu
  await login(page, "Phạm Quốc Dũng");
  await openTask(page, /Cấp quyền · Email công ty · Lê Văn Tâm/);
  await page.getByRole("radio", { name: /Chưa có – tôi đã tạo tài khoản mới/ }).check();
  await page.locator("input[name=accountIdentifier]").fill("tam.le");
  await page.getByRole("radio", { name: "Thành công" }).check();
  await page.getByRole("button", { name: "Gửi kết quả" }).click();
  await expect(page.getByText("Vui lòng đính kèm bằng chứng cấp quyền.").first()).toBeVisible();
  await page.locator("input[name=ticket]").fill("IT-1001");
  await page.getByRole("button", { name: "Gửi kết quả" }).click();
  await expect(page.getByText(/Quyền đã COMPLETED/)).toBeVisible();

  // Quyền 2 nhạy cảm: Manager → Security → IT
  await login(page, "Trần Thị Bình");
  await openTask(page, /Phần mềm kế toán · Lê Văn Tâm/);
  await page.getByRole("radio", { name: "Phê duyệt" }).check();
  await expect(page.getByText(/ℹ Quyền nhạy cảm: Security Approver sẽ xét duyệt tiếp/)).toBeVisible();
  await page.getByRole("button", { name: "Gửi quyết định" }).click();
  await expect(page.getByText(/Đã lưu quyết định/)).toBeVisible();

  await login(page, "Võ Thanh Hải");
  await openTask(page, /Phần mềm kế toán · Lê Văn Tâm/);
  await expect(page.getByText("Quyết định của Manager")).toBeVisible();
  await page.getByRole("radio", { name: "Phê duyệt" }).check();
  await page.getByRole("button", { name: "Gửi quyết định" }).click();
  await expect(page.getByText(/Đã lưu quyết định/)).toBeVisible();

  await login(page, "Phạm Quốc Dũng");
  await openTask(page, /Cấp quyền · Phần mềm kế toán · Lê Văn Tâm/);
  await page.getByRole("radio", { name: /Chưa có – tôi đã tạo tài khoản mới/ }).check();
  await page.locator("input[name=accountIdentifier]").fill("tam.le");
  await page.getByRole("radio", { name: "Thành công" }).check();
  await page.locator("input[name=evidenceFile]").setInputFiles(samplePdf());
  await page.getByRole("button", { name: "Gửi kết quả" }).click();
  await expect(page.getByText(/Quyền đã COMPLETED/)).toBeVisible();

  // UAT-ON-06: từ chối quyền không bắt buộc, có hộp thoại xác nhận
  await login(page, "Trần Thị Bình");
  await openTask(page, /Kho tài liệu chung · Lê Văn Tâm/);
  await page.getByRole("radio", { name: "Từ chối" }).check();
  await page.locator("textarea[name=reason]").fill("Chưa cần trong tháng đầu");
  await page.getByRole("button", { name: "Gửi quyết định" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Từ chối" }).click();
  await expect(page.getByText(/REJECTED/).first()).toBeVisible();

  // UAT-ON-11: bàn giao thiết bị, thiếu biên bản thì báo thiếu
  await login(page, "Phạm Quốc Dũng");
  await openTask(page, /Cấp thiết bị · Laptop · Lê Văn Tâm/);
  await page.getByRole("radio", { name: "Có thiết bị phù hợp" }).check();
  await page.locator("select[name=deviceId]").selectOption({ index: 1 });
  await page.locator("select[name=condition]").selectOption("NEW");
  await page.locator("input[name=recordCode]").fill("BB-2001");
  await page.getByRole("button", { name: "Hoàn thành bàn giao" }).click();
  await expect(page.getByText(/Thông tin bàn giao chưa đủ: biên bản đã ký/)).toBeVisible();
  await page.locator("input[name=recordFile]").setInputFiles(samplePdf());
  await page.getByRole("button", { name: "Hoàn thành bàn giao" }).click();
  await expect(page.getByText(/Đã bàn giao/).first()).toBeVisible();

  // UAT-ON-12: HR xác nhận hoàn tất
  await login(page, "Lê Thu Hà");
  await page.goto(`/onboarding/${code}`);
  await expect(page.getByText("Chờ HR xác nhận").first()).toBeVisible();
  await page.getByRole("button", { name: "Xác nhận hoàn tất" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Xác nhận" }).click();
  await expect(page.getByText(/Đã hoàn tất ngày/)).toBeVisible();

  // FR-ON-17: nhân viên mới đăng nhập được với vai trò Employee
  await login(page, "Lê Văn Tâm");
  await expect(page.getByText("Employee").first()).toBeVisible();
});

test("UAT-ON-14: phân quyền và lịch sử", async ({ page }) => {
  await login(page, "Đỗ Minh Khoa");
  await page.goto("/onboarding/ONB-2026-0001");
  await expect(page.getByText("Bạn không có quyền truy cập chức năng này.")).toBeVisible();
  await login(page, "Quản trị viên");
  await page.goto("/audit?action=UNAUTHORIZED_ACCESS");
  await expect(page.getByRole("cell", { name: "Đỗ Minh Khoa" }).first()).toBeVisible();
});
