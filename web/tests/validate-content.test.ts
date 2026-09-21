import { describe, it, expect, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { validateCardCollection } from "../src/contracts/validator";

describe("R04 Integration Test - Kiểm tra trùng lặp ID và tính toàn vẹn danh mục", () => {
  let tempDir: string | null = null;

  afterEach(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  it("Phát hiện trùng lặp ID khi 2 file chứa thẻ có cùng ID (Cross-file duplicate check)", () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "lc-validate-test-"));

    const cardA = {
      id: "shared-card-id",
      version: "1.0.0",
      type: "PLACE",
      title: "Địa điểm A",
      intentIds: ["test_intent"],
      jurisdiction: { id: "lc", label: "Liên Chiểu" },
      applicability: [],
      exclusions: [],
      sources: [
        {
          id: "src-1",
          url: "https://danang.gov.vn",
          title: "Nguồn",
          publisher: "UBND",
          fetchedAt: "2026-09-18",
        },
      ],
      review: {
        status: "draft",
        owner: "Tổ rà soát",
        reviewDue: "2026-12-31",
      },
      actions: [],
      body: {
        function: "Chức năng",
        address: "Địa chỉ",
        jurisdictionDetail: "Chi tiết",
        openingHours: "Không rõ giờ",
        claimsWithSources: [],
      },
      isSynthetic: true,
    };

    const cardB = {
      ...cardA,
      title: "Địa điểm B trùng ID",
    };

    const fileAPath = path.join(tempDir, "card-a.json");
    const fileBPath = path.join(tempDir, "card-b.json");
    fs.writeFileSync(fileAPath, JSON.stringify(cardA), "utf8");
    fs.writeFileSync(fileBPath, JSON.stringify(cardB), "utf8");

    // Khi gộp 2 file trong cùng catalog, validateCardCollection phải phát hiện trùng ID
    const combinedCards = [
      JSON.parse(fs.readFileSync(fileAPath, "utf8")),
      JSON.parse(fs.readFileSync(fileBPath, "utf8")),
    ];

    const result = validateCardCollection(combinedCards);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.message.includes("ID trùng lặp"))).toBe(true);
    expect(result.issues.some((i) => i.cardId === "shared-card-id")).toBe(true);
  });

  it("Từ chối dữ liệu hỏng cú pháp hoặc tham chiếu source không tồn tại", () => {
    const corruptCard = {
      id: "card-bad-source",
      version: "1.0.0",
      type: "PLACE",
      title: "Thẻ lỗi source",
      intentIds: ["test"],
      jurisdiction: { id: "lc", label: "Liên Chiểu" },
      applicability: [],
      exclusions: [],
      sources: [
        {
          id: "src-real",
          url: "https://danang.gov.vn",
          title: "Nguồn thật",
          publisher: "UBND",
          fetchedAt: "2026-09-18",
        },
      ],
      review: {
        status: "draft",
        owner: "Tổ rà soát",
        reviewDue: "2026-12-31",
      },
      actions: [],
      body: {
        function: "Chức năng",
        address: "Địa chỉ",
        jurisdictionDetail: "Chi tiết",
        openingHours: "Không rõ giờ",
        claimsWithSources: [
          {
            id: "claim-1",
            claim: "Khẳng định",
            sourceId: "src-khong-ton-tai", // Lỗi
          },
        ],
      },
      isSynthetic: true,
    };

    const result = validateCardCollection([corruptCard]);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.message.includes("không tồn tại trong danh sách sources"))).toBe(true);
  });
});
