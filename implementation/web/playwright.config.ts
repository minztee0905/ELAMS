import { defineConfig } from "@playwright/test";

// Kiểm thử đầu-cuối trên trình duyệt theo kịch bản UAT. Dữ liệu mẫu được tạo lại trước khi chạy.
export default defineConfig({
  testDir: "e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 10_000 },
  use: { baseURL: "http://localhost:3000", locale: "vi-VN", timezoneId: "Asia/Ho_Chi_Minh", screenshot: "only-on-failure" },
  webServer: { command: "npm run dev", url: "http://localhost:3000/login", reuseExistingServer: true, timeout: 120_000 },
});
