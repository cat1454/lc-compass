import { expect, test } from "@playwright/test";

test("Public routes render without login or server errors", async ({ page }) => {
  for (const path of ["/", "/services", "/places", "/discover",
    "/cards/service-chuan-bi-tam-tru", "/cards/place-trung-tam-hanh-chinh-lien-chieu"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    await expect(page).toHaveTitle(/LC Compass/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path).toBe(true);
  }
});

test("Internal content and workspace files are not public assets", async ({ request }) => {
  for (const path of ["/content/published/cards.json", "/content/sourced-demo/cards.json",
    "/content/demo/cards.json", "/.env", "/.env.local", "/research/FREE_APIS.md",
    "/handoff/STATUS.md", "/not-a-real-lc-compass-route"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
  }
});
