import { test, expect } from "@playwright/test";

// Network and catalog fixtures are confined to the dedicated events test server.
test.beforeEach(async ({ page }) => {
  await page.route("https://api.maptiler.com/**", route => route.fulfill({ contentType: "application/json", body: JSON.stringify({ version: 8, sources: {}, layers: [{ id: "background", type: "background", paint: { "background-color": "#e8eee9" } }, { id: "ward-old", type: "background", paint: { "background-color": "#d9dddd" } }] }) }));
  await page.route("https://server.arcgisonline.com/**", route => route.fulfill({ contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=", "base64") }));
  await page.route("https://events.example.invalid/photo/**", route => route.fulfill({ contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#d4dfcd"/><text x="30" y="130" font-size="28" fill="#374b32">KIỂM THỬ GIAO DIỆN</text><text x="30" y="190" font-size="22">Không phải ảnh sự kiện thật</text></svg>' }));
});

for (const width of [320, 360, 390, 430, 768, 1280]) {
  test(`events layout ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/events");
    const root = page.getByTestId("event-map");
    await expect(page.getByRole("textbox", { name: "Tìm sự kiện" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const bounds = await root.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    await page.getByRole("button", { name: "Danh sách sự kiện", exact: true }).click();
    await page.getByRole("dialog", { name: "Danh sách sự kiện", exact: true }).getByRole("button", { name: /KIỂM THỬ — Hội sách cộng đồng/ }).click();
    const card = page.getByRole("article", { name: "Sự kiện đã chọn" });
    await expect(card).toBeVisible();
    await expect(card.getByRole("img")).toBeVisible();
    await expect(card).toContainText("08:30");
    await expect(card).toContainText("Địa chỉ kiểm thử");

    await expect.poll(async () => {
      const box = await card.boundingBox();
      return !!box && box.x >= 0 && box.x + box.width <= width + 1;
    }).toBe(true);
    const cardBounds = await card.boundingBox();
    const nav = page.getByRole("navigation", { name: "Thanh điều hướng dưới màn hình di động" });
    if (await nav.isVisible()) expect(cardBounds!.y + cardBounds!.height).toBeLessThanOrEqual((await nav.boundingBox())!.y);
    await page.screenshot({ path: testInfo.outputPath(`events-${width}.png`), fullPage: false });
    await card.getByRole("button", { name: "Xem chi tiết", exact: true }).click();
    const detail = page.getByRole("dialog", { name: /KIỂM THỬ — Hội sách cộng đồng/ });
    await expect(detail).toBeVisible();
    await expect(detail).toContainText("Kiểm tra nguồn:");
    await expect(detail).toContainText("Chưa có thông tin chi phí");
    await expect(detail.getByRole("link", { name: "Chỉ đường Google Maps" })).toHaveAttribute("href", /google.com\/maps/);
    await page.keyboard.press("Escape");
    await expect(detail).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Xem chi tiết", exact: true })).toBeFocused();
    await page.getByRole("button", { name: "Đóng sự kiện" }).click();
    await page.getByRole("button", { name: "Chọn ngày", exact: true }).click();
    const calendar = page.getByRole("dialog", { name: "Chọn ngày sự kiện" });
    const calendarBox = await calendar.boundingBox();
    expect(calendarBox!.x).toBeGreaterThanOrEqual(0);
    expect(calendarBox!.x + calendarBox!.width).toBeLessThanOrEqual(width);
    expect(await calendar.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Chọn ngày", exact: true })).toBeFocused();
  });
}

test("filters, empty state, fullscreen and repeated map styles", async ({ page }) => {
  await page.goto("/events");
  const search = page.getByRole("textbox", { name: "Tìm sự kiện" });
  const list = page.getByRole("button", { name: "Danh sách sự kiện", exact: true });
  await search.fill("Giao lưu văn hóa");
  await expect(list).toContainText("(1)");
  await page.getByRole("button", { name: "Thể thao", exact: true }).click();
  await expect(list).toContainText("(0)");
  await expect(page.getByRole("status")).toContainText("Không tìm thấy");
  await page.getByRole("button", { name: "Xóa tìm kiếm" }).click();
  await page.getByRole("button", { name: "Tất cả", exact: true }).click();
  await expect(list).toContainText("(7)");
  await page.getByRole("button", { name: "Toàn màn hình", exact: true }).click();
  const root = page.getByTestId("event-map");
  expect(await root.evaluate(el => getComputedStyle(el).position)).toBe("fixed");
  const layer = page.getByRole("button", { name: "Đổi lớp bản đồ" });
  await expect(layer).toBeEnabled();
  for (let i = 0; i < 3; i++) { await layer.click(); await expect(layer).toBeEnabled(); }
  await list.click();
  await page.getByRole("dialog", { name: "Danh sách sự kiện", exact: true }).getByRole("button", { name: /KIỂM THỬ — Hội sách cộng đồng/ }).click();
  await expect(page.getByRole("article", { name: "Sự kiện đã chọn" })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.keyboard.press("Escape");
  expect(await root.evaluate(el => getComputedStyle(el).position)).toBe("relative");
  await page.setViewportSize({ width: 844, height: 390 });
  await page.evaluate(() => document.documentElement.classList.add("large-text"));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("calendar dates, venue pagination, selection removed by filters", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-10-01T08:00:00+07:00"));
  await page.goto("/events");
  await page.getByRole("button", { name: "Chọn ngày", exact: true }).click();
  const calendar = page.getByRole("dialog", { name: "Chọn ngày sự kiện" });
  await expect(calendar.getByRole("button", { name: "2026-10-03", exact: true }).locator("i")).toHaveCount(1);
  await calendar.getByRole("button", { name: "2026-10-03", exact: true }).click();
  const list = page.getByRole("button", { name: "Danh sách sự kiện", exact: true });
  await expect(list).toContainText("(2)");
  await page.getByRole("button", { name: "Hiện tất cả ngày" }).click();
  await expect(list).toContainText("(7)");
  await list.click();
  await page.getByRole("dialog", { name: "Danh sách sự kiện", exact: true }).getByRole("button", { name: /KIỂM THỬ — Hội sách cộng đồng/ }).click();
  const card = page.getByRole("article", { name: "Sự kiện đã chọn" });
  await expect(card).toContainText("1 / 7");
  await card.getByRole("button", { name: "Tiếp ›" }).click();
  await expect(card).toContainText("2 / 7");
  await card.getByRole("button", { name: "Tiếp ›" }).click();
  await expect(card).toContainText("3 / 7");
  for (let i = 0; i < 4; i++) await card.getByRole("button", { name: "Tiếp ›" }).click();
  await expect(card).toContainText("7 / 7");
  await expect(card.getByRole("button", { name: "Tiếp ›" })).toBeDisabled();
  await page.getByRole("textbox", { name: "Tìm sự kiện" }).fill("không có sự kiện này");
  await expect(card).toHaveCount(0);
});

test("map unavailable still permits details", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type.includes("webgl")) return null;
      return original.apply(this, [type, ...args] as Parameters<typeof original>);
    } as typeof original;
  });
  await page.goto("/events");
  await expect(page.getByRole("status")).toContainText("Bản đồ chưa tải đầy đủ");
  await page.getByRole("button", { name: "Danh sách sự kiện", exact: true }).click();
  await page.getByRole("dialog", { name: "Danh sách sự kiện", exact: true }).getByRole("button", { name: /KIỂM THỬ — Hội sách cộng đồng/ }).click();
  await page.getByRole("button", { name: "Xem chi tiết", exact: true }).click();
  await expect(page.getByRole("dialog", { name: /KIỂM THỬ — Hội sách cộng đồng/ })).toBeVisible();
});


for (const size of [{ width: 320, height: 700 }, { width: 844, height: 390 }]) {
  test(`short viewport ${size.width}x${size.height}, large text and navigation`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto("/events");
    await page.evaluate(() => document.documentElement.classList.add("large-text"));
    await page.getByRole("button", { name: "Toàn màn hình", exact: true }).click();
    await page.getByRole("button", { name: "Danh sách sự kiện", exact: true }).click();
    await page.getByRole("dialog", { name: "Danh sách sự kiện", exact: true }).getByRole("button", { name: /KIỂM THỬ — Hội sách cộng đồng/ }).click();
    const card = page.getByRole("article", { name: "Sự kiện đã chọn" });
    await expect(card).toBeVisible();
    await expect(card.getByRole("img")).toBeVisible();
    await expect(card).toContainText("08:30");
    await expect(card).toContainText("Địa chỉ kiểm thử");
    await expect.poll(async () => {
      const box = await card.boundingBox();
      return !!box && box.x >= 0 && box.x + box.width <= size.width + 1 && box.y >= 0 && box.y + box.height <= size.height + 1;
    }).toBe(true);
    await card.getByRole("button", { name: "Xem chi tiết", exact: true }).click();
    await expect(page.getByRole("dialog", { name: /KIỂM THỬ — Hội sách cộng đồng/ })).toBeVisible();
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await page.goto("/");
    await page.goBack();
    await expect(page.getByRole("textbox", { name: "Tìm sự kiện" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}


test("real GeoJSON marker opens its event with local worker", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", message => { if (message.text().includes("Event map:")) errors.push(message.text()); });
  const workerLoaded = page.waitForResponse(r => r.url().includes("maplibre-gl-shared.mjs") && r.ok());
  await page.goto("/events");
  await workerLoaded;
  await page.getByRole("textbox", { name: "Tìm sự kiện" }).fill("Giao lưu văn hóa");
  const canvas = page.getByTestId("event-map").locator("canvas");
  await expect(page.getByTestId("event-map").locator("[aria-busy]")).toHaveAttribute("aria-busy", "false");
  await canvas.scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();

  const mercatorY = (lat: number) => (1 - Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) / Math.PI) / 2;
  const scale = Math.min((box!.width - 64) / ((108.14 - 108.10) / 360), (box!.height - 64) / (mercatorY(16.07) - mercatorY(16.11)));
  const x = box!.width / 2;
  const y = box!.height / 2 + (mercatorY(16.08) - (mercatorY(16.07) + mercatorY(16.11)) / 2) * scale;
  await canvas.click({ position: { x, y } });
  await expect(page.getByRole("article", { name: "Sự kiện đã chọn" })).toContainText("Giao lưu văn hóa");
  expect(errors.filter(error => error.includes("Worker"))).toEqual([]);
});

test("venue image caption and broken image keep event actions available", async ({ page }) => {
  await page.route("https://events.example.invalid/photo/1.svg", route => route.abort());
  await page.goto("/events");
  await page.getByRole("button", { name: "Danh sách sự kiện", exact: true }).click();
  await page.getByRole("dialog", { name: "Danh sách sự kiện", exact: true }).getByRole("button", { name: /Hội sách cộng đồng/ }).click();
  const card = page.getByRole("article", { name: "Sự kiện đã chọn" });
  await expect(card).toContainText("Ảnh chưa tải được");
  await card.getByRole("button", { name: "Tiếp ›" }).click();
  await expect(card).toContainText("Ảnh địa điểm");
  await expect(card.getByRole("img")).toBeVisible();
  await card.getByRole("button", { name: "Xem chi tiết", exact: true }).click();
  await expect(page.getByRole("dialog", { name: /Đọc sách thiếu nhi/ })).toContainText("Nguồn ảnh");
});

test("invalid MapTiler response preserves list and details", async ({ page }) => {
  await page.route("https://api.maptiler.com/**", route => route.fulfill({ status: 403, body: "Forbidden" }));
  await page.goto("/events");
  await expect(page.getByRole("note").filter({ hasText: "Nền bản đồ chưa tải đầy đủ" })).toBeVisible();
  await page.getByRole("button", { name: "Danh sách sự kiện", exact: true }).click();
  await page.getByRole("dialog", { name: "Danh sách sự kiện", exact: true }).getByRole("button", { name: /Hội sách cộng đồng/ }).click();
  await page.getByRole("button", { name: "Xem chi tiết", exact: true }).click();
  await expect(page.getByRole("dialog", { name: /Hội sách cộng đồng/ })).toBeVisible();
});

