import { test, expect } from "@playwright/test";
import catalog from "../content/data/events.json";

test("real events page uses the approved catalog and never test fixtures", async ({ page }) => {
  await page.goto("/events");
  await expect(page.getByRole("button", { name: "Danh sách sự kiện", exact: true })).toContainText(`(${catalog.totalEvents})`);
  await expect(page.getByText("Danh mục xem trước", { exact: false })).toHaveCount(0);
  if (!catalog.totalEvents) await expect(page.getByRole("status")).toContainText("Không tìm thấy sự kiện");
  await expect(page.getByRole("note")).toContainText("chưa có tọa độ ranh giới");
});
