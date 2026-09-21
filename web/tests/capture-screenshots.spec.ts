import { expect, test } from "@playwright/test";
import path from "path";

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 375, height: 812 },
  { width: 320, height: 568 },
]) {
  test(`Ảnh trang chủ mới thân thiện ${viewport.width}x${viewport.height}`, async ({ page, isMobile }, testInfo) => {
    if (isMobile && viewport.width > 500) return;
    if (!isMobile && viewport.width <= 500) return;
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "Thủ tục & hướng dẫn" })).toBeVisible();
    await expect(page.getByText(/Lối tắt nhu cầu hàng ngày/i)).toBeVisible();
    await page.screenshot({
      path: path.join(__dirname, `screenshots/${testInfo.project.name.replace(/\s+/g, "_")}-home-${viewport.width}.png`),
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test(`Ảnh bản chính thức ${viewport.width}x${viewport.height}`, async ({ page, isMobile }, testInfo) => {
    if (isMobile && viewport.width > 500) return;
    if (!isMobile && viewport.width <= 500) return;
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#tra-cuu article")).toHaveCount(3);
    await page.screenshot({
      path: path.join(__dirname, `screenshots/${testInfo.project.name.replace(/\s+/g, "_")}-official-${viewport.width}.png`),
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test(`Ảnh danh bạ tiện ích đời sống ${viewport.width}x${viewport.height}`, async ({ page, isMobile }, testInfo) => {
    if (isMobile && viewport.width > 500) return;
    if (!isMobile && viewport.width <= 500) return;
    await page.setViewportSize(viewport);
    await page.goto("/places");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(/Tra cứu Tiện ích & Đời sống Phường Liên Chiểu/i)).toBeVisible();
    await page.screenshot({
      path: path.join(__dirname, `screenshots/${testInfo.project.name.replace(/\s+/g, "_")}-places-${viewport.width}.png`),
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
