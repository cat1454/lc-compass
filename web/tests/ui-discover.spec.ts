import { test, expect } from "@playwright/test";

test("Khám phá chính thức nạp các di sản đã duyệt vào catalog", async ({ page }) => {
  await page.goto("/discover");
  await expect(page.getByRole("heading", { name: "Khám phá Liên Chiểu", level: 2 })).toBeVisible();
  await expect(page.locator(".responsive-cards article")).toHaveCount(6);
  const response = await page.goto("/cards/discover-dinh-lang-thanh-vinh");
  expect(response?.status()).toBe(200);
  const notFoundRes = await page.goto("/cards/discover-non-existent-999");
  expect(notFoundRes?.status()).toBe(404);
});

test("Khám phá có nhãn rà soát trên bản chính thức", async ({ page }) => {
  await page.goto("/discover");
  await expect(page.locator(".responsive-cards article")).toHaveCount(6);
  await expect(page.locator(".responsive-cards article").first()).toContainText("Đã rà soát");
});
