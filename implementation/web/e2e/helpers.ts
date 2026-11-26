import { expect, type Page } from "@playwright/test";
import path from "node:path";
import { writeFileSync, mkdirSync } from "node:fs";

export async function login(page: Page, fullName: string) {
  await page.context().clearCookies();
  await page.goto("/login");
  await page.getByRole("button", { name: new RegExp(`^${fullName}`) }).click();
  await expect(page).toHaveURL(/\/tasks/);
}

/** Tệp PDF nhỏ để tải lên làm biên bản / bằng chứng. */
export function samplePdf() {
  const dir = path.join(process.cwd(), "test-results");
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "bien-ban.pdf");
  writeFileSync(file, "%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n");
  return file;
}

export async function openTask(page: Page, text: string | RegExp) {
  await page.goto("/tasks");
  await page.getByRole("link", { name: text }).first().click();
}
