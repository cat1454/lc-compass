import { describe, it, expect, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Be_Vietnam_Pro: () => ({
    className: "font-be-vietnam-pro",
    variable: "--font-be-vietnam-pro",
  }),
}));

import { metadata, viewport } from "../src/app/layout";
import HomePage from "../src/app/page";
import { EntryPointSchema } from "../src/contracts/navigation";

describe("Smoke Test - Ứng dụng & Nền tảng (Package 00)", () => {
  it("Kiểm tra metadata của Root Layout trong mã nguồn ứng dụng", () => {
    expect(metadata.title).toBe("LC Compass — La bàn Liên Chiểu");
    expect(metadata.description).toContain("Đúng nguồn – Rõ nơi – Biết bước tiếp theo");
  });

  it("Kiểm tra cấu hình viewport responsive mobile-first", () => {
    expect(viewport.width).toBe("device-width");
    expect(viewport.initialScale).toBe(1);
  });

  it("Kiểm tra 3 lối vào định nghĩa trong hợp đồng điều hướng (contracts/navigation)", () => {
    const validEntries = ["services", "places", "discover"];
    for (const entry of validEntries) {
      expect(EntryPointSchema.safeParse(entry).success).toBe(true);
    }
    expect(EntryPointSchema.safeParse("invalid_entry").success).toBe(false);
  });

  it("Kiểm tra Component HomePage được định nghĩa và là React function component", () => {
    expect(typeof HomePage).toBe("function");
  });

  it("Kiểm tra Component EventsPage được định nghĩa và là React function component", async () => {
    const { default: EventsPage } = await import("../src/app/events/page");
    expect(typeof EventsPage).toBe("function");
  });
});
