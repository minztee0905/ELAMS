// UAT Access Request: gửi → yêu cầu bổ sung → gửi lại → duyệt → cấp quyền.
import { expect, test } from "@playwright/test";
import { login, openTask } from "./helpers";

test("Access Request đầu-cuối", async ({ page }) => {
  // UAT-AC-01, 03: Châu xin MISA Ghi (đã có Xem) → cảnh báo
  await login(page, "Lê Minh Châu");
  await page.goto("/access-requests/new");
  await expect(page.getByText("Người duyệt: Trần Thị Bình")).toBeVisible();
  await page.locator("#accessId").selectOption({ label: "CRM nội bộ (CRM)" });
  await page.locator("#level").selectOption("Xem");
  await page.locator("#reason").fill("Theo dõi công nợ khách hàng");
  await page.getByRole("button", { name: "Gửi yêu cầu" }).click();
  await expect(page.getByText(/Đã gửi yêu cầu AR-2026-\d+\. Người duyệt: Trần Thị Bình/)).toBeVisible();
  const code = (await page.locator("h1 span.font-semibold").textContent())!;

  // UAT-AC-07: Manager yêu cầu bổ sung
  await login(page, "Trần Thị Bình");
  await openTask(page, /Xét duyệt yêu cầu quyền · CRM nội bộ · Lê Minh Châu/);
  await page.getByRole("radio", { name: "Yêu cầu bổ sung" }).check();
  await page.getByRole("button", { name: "Gửi quyết định" }).click();
  await expect(page.getByText("Vui lòng nhập nội dung cần bổ sung.").first()).toBeVisible();
  await page.locator("textarea[name=reason]").fill("Ghi rõ khách hàng cần theo dõi");
  await page.getByRole("button", { name: "Gửi quyết định" }).click();
  await expect(page.getByText(/Đã lưu quyết định\. Yêu cầu chuyển Chờ bổ sung/)).toBeVisible();

  await login(page, "Lê Minh Châu");
  await page.goto(`/access-requests/${code}`);
  await expect(page.getByText("“Ghi rõ khách hàng cần theo dõi”").first()).toBeVisible();
  await page.locator("textarea[name=reason]").fill("Theo dõi công nợ khách hàng nhóm A, B");
  await page.getByRole("button", { name: "Gửi lại" }).click();
  await expect(page.getByText("Yêu cầu đã được gửi lại và chuyển về Chờ Manager duyệt.")).toBeVisible();

  await login(page, "Trần Thị Bình");
  await openTask(page, /CRM nội bộ · Lê Minh Châu/);
  await page.getByRole("radio", { name: "Phê duyệt" }).check();
  await page.getByRole("button", { name: "Gửi quyết định" }).click();
  await expect(page.getByText(/IT đã nhận nhiệm vụ cấp quyền/)).toBeVisible();

  // UAT-AC-08: lỗi cấp quyền rồi xử lý lại
  await login(page, "Phạm Quốc Dũng");
  await openTask(page, /Cấp quyền · CRM nội bộ · Lê Minh Châu/);
  await page.getByRole("radio", { name: /Chưa có – tôi đã tạo tài khoản mới/ }).check();
  await page.locator("input[name=accountIdentifier]").fill("chau.le");
  await page.getByRole("radio", { name: "Thất bại" }).check();
  await page.locator("textarea[name=failureReason]").fill("CRM hết license");
  await page.getByRole("button", { name: "Gửi kết quả" }).click();
  await expect(page.getByText("Lần xử lý trước chưa thành công")).toBeVisible();
  await page.getByRole("button", { name: "Xử lý lại" }).click();
  await page.getByRole("radio", { name: /Chưa có – tôi đã tạo tài khoản mới/ }).check();
  await page.locator("input[name=accountIdentifier]").fill("chau.le");
  await page.getByRole("radio", { name: "Thành công" }).check();
  await page.locator("input[name=ticket]").fill("IT-2002");
  await page.getByRole("button", { name: "Gửi kết quả" }).click();
  await expect(page.getByText(/Yêu cầu chuyển Đã cấp/)).toBeVisible();

  // UAT-AC-09: người yêu cầu không thấy chi tiết lỗi của IT
  await login(page, "Lê Minh Châu");
  await page.goto(`/access-requests/${code}`);
  await expect(page.getByText("Đã cấp quyền")).toBeVisible();
  await expect(page.getByText("CRM hết license")).toHaveCount(0);
});

test("UAT-AC-02: trùng yêu cầu và Manager tự xin quyền", async ({ page }) => {
  await login(page, "Trịnh Thu Mai");
  await page.goto("/access-requests/new");
  await page.locator("#accessId").selectOption({ label: "CRM nội bộ (CRM)" });
  await page.locator("#reason").fill("Thử gửi lại");
  await page.getByRole("button", { name: "Gửi yêu cầu" }).click();
  await expect(page.getByText(/Bạn đang có yêu cầu AR-2026-0001 cho quyền này chưa kết thúc/)).toBeVisible();

  await login(page, "Trần Thị Bình");
  await page.goto("/access-requests/new");
  await expect(page.getByText("Người duyệt: Phan Văn Đức (cấp trên trực tiếp)")).toBeVisible();
});
