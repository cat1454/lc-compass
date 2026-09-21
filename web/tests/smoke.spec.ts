import { test, expect } from "@playwright/test";

test.describe("LC Compass E2E Smoke Test", () => {
  test("Trang chủ tải được và hiển thị đúng 3 lối vào", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/LC Compass/i);
    await expect(page.getByRole("heading", { name: "Thủ tục & hướng dẫn" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Địa điểm & tiện ích" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Khám phá Liên Chiểu" })).toBeVisible();
  });
});
