import { expect, test } from "@playwright/test";

test("Trang chủ tải catalog chính thức với các thẻ đã phê duyệt", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Cẩm nang cộng đồng Liên Chiểu · Trạng thái rà soát được ghi trên từng nội dung.")).toBeVisible();
  await page.getByRole("link", { name: /Xem thủ tục & hướng dẫn/i }).click();
  await expect(page).toHaveURL(/\/services/);
  await expect(page.getByRole("heading", { name: "Chuẩn bị thông tin đăng ký tạm trú" })).toBeVisible();
});

test("Trang chủ không tràn ngang tại 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Chào bác, anh chị & các bạn!", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("Giữ AppShell 04A trên desktop và mobile", async ({ page, isMobile }) => {
  await page.goto("/");
  const bottom = page.getByRole("navigation", { name: /Thanh điều hướng dưới/i });
  const side = page.getByRole("complementary", { name: /Thanh điều hướng chính màn hình lớn/i });
  if (isMobile) {
    await expect(bottom).toBeVisible(); await expect(side).not.toBeVisible();
  } else {
    await expect(side).toBeVisible(); await expect(bottom).not.toBeVisible();
  }
});
