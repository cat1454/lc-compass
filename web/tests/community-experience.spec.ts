import { test, expect } from "@playwright/test";

test("six community shortcuts have working destinations", async ({ page }) => {
  await page.goto("/");
  const shortcuts = page.getByRole("region", { name: "Lối tắt nhu cầu thiết yếu thường dùng" });
  const links = shortcuts.getByRole("link");
  await expect(links).toHaveCount(6);
  const destinations = ["/services", "/places?category=healthcare", "/places?category=market", "/places?category=community", "/discover", "/places?category=education"];
  for (let index = 0; index < destinations.length; index++) {
    await page.goto("/");
    await links.nth(index).click();
    await expect(page).toHaveURL(new RegExp(destinations[index].replace("?", "\\?") + "$"));
    await expect(page.locator("main")).toBeVisible();
  }
});

test("URL filters survive reload, history, invalid categories and cross-directory search", async ({ page }) => {
  await page.goto("/?search=truong&type=PLACE");
  const search = page.getByRole("searchbox", { name: "Nhập từ khóa tìm kiếm" });
  await expect(search).toHaveValue("truong");
  await search.fill("y te");
  await expect(page).toHaveURL(/search=y\+te/);
  await page.reload();
  await expect(search).toHaveValue("y te");
  await page.goBack();
  await expect(search).toHaveValue("truong");
  const toPlacesLink = page.getByRole("link", { name: "Tìm từ khóa này trong danh bạ tiện ích" });
  await toPlacesLink.scrollIntoViewIfNeeded();
  await Promise.all([
    page.waitForURL(/\/places/),
    toPlacesLink.click(),
  ]);
  const directory = page.getByRole("searchbox", { name: "Tìm tiện ích đời sống theo từ khóa" });
  await expect(directory).toHaveValue("truong", { timeout: 15000 });
  await page.goto("/places?category=healthcare");
  await expect(page.getByRole("button", { name: /^Y tế & Nhà thuốc/ })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /^Giáo dục & Trường học/ }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: /^Giáo dục & Trường học/ })).toHaveAttribute("aria-pressed", "true");
  await page.goBack();
  await expect(page.getByRole("button", { name: /^Y tế & Nhà thuốc/ })).toHaveAttribute("aria-pressed", "true");
  await page.goto("/places?category=invalid&search=zzzzzzzz");
  await expect(page.locator("button[aria-pressed]").filter({ hasText: /^Tất cả/ })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Không tìm thấy địa điểm phù hợp", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Xem toàn bộ địa điểm" }).click();
  await expect(directory).toHaveValue("");
  await expect(page).toHaveURL(/\/places$/);
});

test("large text persists and three sections fit supported widths", async ({ page }, info) => {
  test.setTimeout(60000);
  await page.goto("/services");
  const initial = await page.locator("h1").evaluate(el => parseFloat(getComputedStyle(el).fontSize));
  await page.getByRole("button", { name: "Chữ lớn: Tắt" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveClass(/large-text/);
  expect(await page.locator("h1").evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThan(initial);
  for (const width of [320, 375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["services", "places", "discover"]) {
      await page.goto(`/${route}`);
      await expect(page.getByRole("button", { name: "Chữ lớn: Bật" })).toHaveAttribute("aria-pressed", "true");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.screenshot({ path: info.outputPath(`${route}-${width}.png`), fullPage: true });
    }
  }
  await page.goto("/services");
  await expect(page.getByText(/Dịch vụ tra cứu mở rộng chưa được kết nối/)).toBeVisible();
  await expect(page.getByPlaceholder(/Nhập câu hỏi cần tra cứu thêm/)).toHaveCount(0);
});
