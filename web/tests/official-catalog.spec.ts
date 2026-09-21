import { test, expect } from "@playwright/test";

test("one public catalog; removed demo routes return 404", async ({ page, request }) => {
  for (const url of ["/demo", "/demo?search=mot%20cua", "/demo/cards/service-chuan-bi-tam-tru"]) {
    expect((await request.get(url)).status()).toBe(404);
  }
  await page.goto("/");
  await expect(page.locator('a[href^="/demo"]')).toHaveCount(0);
  const search = page.getByRole("searchbox", { name: "Nhập từ khóa tìm kiếm" });
  for (const query of ["tạm trú", "tam tru", "ky tuc xa", "thue tro"]) {
    await search.fill(query);
    await expect(page.getByRole("heading", { name: "Chuẩn bị thông tin đăng ký tạm trú", exact: true })).toBeVisible();
  }
  await search.fill("khong-co-du-lieu-98765");
  await expect(page.getByText(/Không có thẻ thông tin phù hợp với từ khóa/)).toBeVisible();
});

test("official details preserve source actions and expiry protection", async ({ page, context }) => {
  await page.goto("/cards/service-chuan-bi-tam-tru");
  await expect(page.getByText("Đã rà soát", { exact: true }).first()).toBeVisible();
  const source = page.getByRole("link", { name: /Điểm mới về cư trú/ }).first();
  const url = (await source.getAttribute("href"))!;
  await context.route(url, route => route.fulfill({ body: "Source navigation test" }));
  const opened = context.waitForEvent("page");
  await source.click();
  const popup = await opened;
  await popup.waitForLoadState();
  expect(popup.url()).toBe(url);
  await popup.close();
  await page.clock.install({ time: new Date("2028-01-01T00:00:00Z") });
  await page.goto("/cards/service-chuan-bi-tam-tru");
  await expect(page.getByRole("heading", { name: /Thông tin tạm ngưng/ })).toBeVisible();
  await page.goto("/");
  await expect(page.getByText("Chưa có nội dung được phát hành", { exact: true })).toBeVisible();
});
