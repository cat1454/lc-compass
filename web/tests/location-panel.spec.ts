import { expect, test } from "@playwright/test";

test("Address map link works on narrow and wide screens without requesting location", async ({ page, context }, info) => {
  for (const width of [320, 375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/cards/place-dai-hoc-bach-khoa-da-nang");
    const panel = page.getByTestId("location-panel");
    await expect(panel).toBeVisible();
    const link = panel.getByRole("link", { name: "Tìm trên Google Maps theo địa chỉ" });
    const href = (await link.getAttribute("href"))!;
    expect(new URL(href).searchParams.get("query")).toContain("54");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: info.outputPath(`location-${width}.png`), fullPage: true });
    if (width === 375) {
      await context.route("https://www.google.com/maps/**", route => route.fulfill({ body: "Map destination test" }));
      const opened = context.waitForEvent("page");
      await link.click();
      const popup = await opened;
      await popup.waitForLoadState();
      expect(popup.url()).toBe(href);
      await popup.close();
    }
  }
});
