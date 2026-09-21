import { test, expect } from "@playwright/test";

test("Danh bạ chính thức giữ bố cục và nạp các địa điểm đã thẩm định", async ({ page }) => {
  await page.goto("/places");
  await expect(page.getByRole("heading", { name: "Địa điểm & tiện ích", level: 2 })).toBeVisible();
  await expect(page.locator(".responsive-cards article")).toHaveCount(10);
  await expect(page.getByRole("link", { name: /Trung tâm Phục vụ/i })).toBeVisible();
});

test("Mở địa điểm thật trên bản chính thức, hiển thị thông tin chính thống", async ({ page }) => {
  await page.goto("/places");
  await page.getByRole("link", { name: "Trung tâm Phục vụ hành chính công phường Liên Chiểu", exact: true }).click();
  await expect(page).toHaveURL(/\/cards\/place-trung-tam-hanh-chinh-lien-chieu$/);
  await expect(page.getByText("Đã rà soát", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("68 đường Lạc Long Quân, phường Liên Chiểu, TP. Đà Nẵng", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Địa chỉ trụ sở và trung tâm/ }).first()).toBeVisible();
});

test("Tra cứu danh bạ tiện ích đời sống 1.000+ địa điểm trên trang /places", async ({ page }) => {
  await page.goto("/places");
  await expect(page.getByText(/Tra cứu Tiện ích & Đời sống Phường Liên Chiểu/i)).toBeVisible();
  await expect(page.getByText(/1\.661 địa điểm/i).first()).toBeVisible();

  // Tìm kiếm theo từ khóa Chợ Hòa Khánh
  const searchInput = page.getByPlaceholder(/Tìm chợ, công viên, tiệm thuốc/i);
  await searchInput.fill("chợ hòa khánh");
  await expect(page.getByRole("heading", { name: /Chợ Hòa Khánh/i }).first()).toBeVisible();

  // Lọc theo danh mục Y tế & Nhà thuốc
  await searchInput.clear();
  await page.getByRole("button", { name: /Y tế & Nhà thuốc/i }).click();
  await expect(page.getByText(/Trạm Y tế phường Liên Chiểu/i).first()).toBeVisible();
});

