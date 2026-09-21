import { describe, expect, it } from "vitest";
import { getPublicCardById, loadPublicCatalog } from "./support/synthetic-catalog";
import { DISCOVERY_IDS, INTENTS, MVP_IDS, PLACE_IDS, PROFILES, RESIDENCE_IDS, STRESSES } from "../src/lib/navigation/constants";
import { decideRoute } from "../src/lib/navigation/decide";
import { removeVietnameseTones, searchCatalog } from "../src/lib/navigation/search";
import { ActionType, ProfileMode, StressFlag } from "../src/lib/navigation/types";

describe("03 - Lõi điều hướng (Navigation Engine & Content Loader)", () => {
  describe("1. Kiểm chứng đầy đủ 10.000 ca kịch bản thiết kế (In-memory Simulation)", () => {
    it("Chạy tích Descartes 100 mục tiêu x 10 hoàn cảnh x 10 áp lực = 10.000 ca và xác nhận toàn bộ invariants", () => {
      let runCount = 0;
      let prepareCount = 0;

      for (const intent of INTENTS) {
        for (const profile of PROFILES) {
          for (const stress of STRESSES) {
            runCount++;

            const result = decideRoute({
              intentId: intent.id,
              profileMode: profile.mode,
              flags: [stress.flag],
              supportedIntentIds: MVP_IDS,
            });

            const action = result.action;
            const flag = stress.flag;
            const inScope = MVP_IDS.has(intent.id);

            // Invariants theo simulate.py
            if (action === "PREPARE") {
              prepareCount++;
              expect(inScope).toBe(true);
              expect(["clean", "ai_down"]).toContain(flag);
              expect(profile.mode).not.toBe("language");
              if (profile.mode === "proxy_no") {
                expect(["PLACE", "DISCOVER"]).toContain(result.outputType);
              }
            }

            if (flag === "urgent") {
              expect(action).toBe("URGENT_HELP");
            }
            if (flag === "sensitive") {
              expect(action).toBe("REMOVE_SENSITIVE");
            }
            if (["stale", "conflict", "missing_fact", "outside", "unknown_area", "offline"].includes(flag)) {
              expect(action).not.toBe("PREPARE");
            }
            if (!inScope) {
              expect(action).not.toBe("PREPARE");
            }
          }
        }
      }

      expect(runCount).toBe(10000);
      expect(prepareCount).toBeGreaterThan(0);
    });
  });

  describe("2. Kiểm tra 1.000 cặp tương đương khi AI ngừng hoạt động (AI Outage Equivalence)", () => {
    it("Xác nhận toàn bộ 1.000 cặp (100 intents x 10 profiles) cho cùng định tuyến khi AI hoạt động vs AI tắt", () => {
      let checkedPairs = 0;

      for (const intent of INTENTS) {
        for (const profile of PROFILES) {
          const resClean = decideRoute({
            intentId: intent.id,
            profileMode: profile.mode,
            flags: ["clean"],
            supportedIntentIds: MVP_IDS,
          });

          const resAiDown = decideRoute({
            intentId: intent.id,
            profileMode: profile.mode,
            flags: ["ai_down"],
            supportedIntentIds: MVP_IDS,
          });

          expect(resClean.action).toBe(resAiDown.action);
          expect(resClean.outputType).toBe(resAiDown.outputType);
          checkedPairs++;
        }
      }

      expect(checkedPairs).toBe(1000);
    });
  });

  describe("3. Kiểm tra 14 ca phối hợp nhiều lỗi đồng thời (Combined Fault Checks)", () => {
    const combinations: [string, ProfileMode, StressFlag[], ActionType][] = [
      ["cu_tru-02", "self", ["urgent", "sensitive", "stale"], "URGENT_HELP"],
      ["cu_tru-02", "shared", ["sensitive", "offline"], "REMOVE_SENSITIVE"],
      ["cu_tru-02", "self", ["unknown_area", "stale"], "ASK_AREA"],
      ["cu_tru-02", "proxy_no", ["conflict", "offline"], "GENERAL_ONLY"],
      ["cu_tru-02", "self", ["conflict", "offline"], "REVIEW_SOURCE"],
      ["cu_tru-02", "self", ["stale", "ai_down"], "REVIEW_SOURCE"],
      ["cu_tru-02", "self", ["offline", "missing_fact"], "OFFLINE_VIEW"],
      ["cu_tru-02", "language", ["missing_fact", "ai_down"], "ASK_FACT"],
      ["cu_tru-09", "self", ["clean"], "OFFICIAL_REDIRECT"],
      ["kinh_doanh-01", "self", ["urgent", "outside"], "URGENT_HELP"],
      ["cu_tru-02", "self", ["outside", "ai_down"], "OUTSIDE"],
      ["cu_tru-02", "proxy_yes", ["clean"], "PREPARE"],
      ["dia_diem-01", "proxy_no", ["clean"], "PREPARE"],
      ["van_hoa-01", "proxy_no", ["clean"], "PREPARE"],
    ];

    it.each(combinations)(
      "Ca phối hợp %s với profile %s và flags %j -> kỳ vọng %s",
      (intentId, mode, flags, expectedAction) => {
        const result = decideRoute({
          intentId,
          profileMode: mode,
          flags,
          supportedIntentIds: MVP_IDS,
        });
        expect(result.action).toBe(expectedAction);
      }
    );
  });

  describe("4. Tìm kiếm tiếng Việt có dấu & không dấu (Vietnamese Search)", () => {
    it("Hàm removeVietnameseTones loại bỏ chính xác các ký tự dấu và đ/Đ", () => {
      expect(removeVietnameseTones("Liên Chiểu Đà Nẵng")).toBe("lien chieu da nang");
      expect(removeVietnameseTones("Đăng ký tạm trú phòng trọ")).toBe("dang ky tam tru phong tro");
      expect(removeVietnameseTones("Đình làng Hòa Mỹ")).toBe("dinh lang hoa my");
    });

    it("searchCatalog tìm chính xác thẻ khi nhập từ khóa không dấu", async () => {
      const catalog = await loadPublicCatalog();

      const searchTamTru = searchCatalog("tam tru", catalog);
      expect(searchTamTru.results.length).toBeGreaterThan(0);
      expect(searchTamTru.results[0].title).toContain("tạm trú");

      const searchCongAn = searchCatalog("cong an", catalog);
      expect(searchCongAn.results.length).toBeGreaterThan(0);
      expect(searchCongAn.results[0].title).toContain("Công an");

      const searchDinh = searchCatalog("hoa my", catalog);
      expect(searchDinh.results.length).toBeGreaterThan(0);
      expect(searchDinh.results[0].title).toContain("Hòa Mỹ");
    });

    it("searchCatalog trả về gợi ý khi không khớp từ khóa", async () => {
      const catalog = await loadPublicCatalog();
      const searchRandom = searchCatalog("tu_khoa_khong_co_trong_catalog_12345", catalog);
      expect(searchRandom.results).toHaveLength(0);
      expect(searchRandom.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe("5. Synthetic fixture projection & expiry (public boundary tested in sourced-demo.test.ts)", () => {
    it("loadPublicCatalog nạp đúng danh mục thẻ khả dụng", async () => {
      const catalog = await loadPublicCatalog();
      expect(catalog.length).toBeGreaterThanOrEqual(7);
      for (const card of catalog) {
        expect(card.availability).toBe("available");
        expect(card.body).toBeDefined();
      }
    });

    it("getPublicCardById lấy đúng thẻ có sẵn", async () => {
      const res = await getPublicCardById("service-tam-tru-lc");
      expect(res.availability).toBe("available");
      expect(res.card?.title).toContain("tạm trú");
      expect(res.card?.body).toBeDefined();
    });

    it("getPublicCardById xử lý thẻ không tồn tại (not_found)", async () => {
      const res = await getPublicCardById("the-khong-ton-tai-xyz");
      expect(res.availability).toBe("not_found");
      expect(res.card).toBeUndefined();
    });

    it("getPublicCardById bảo vệ thẻ khi kiểm tra với thời điểm quá hạn (expired fail-closed)", async () => {
      const futureDate = new Date("2030-01-01T00:00:00Z");
      const res = await getPublicCardById("service-tam-tru-lc", { asOfDate: futureDate });
      expect(res.availability).toBe("expired");
      expect(res.card?.body).toBeUndefined();
      expect(res.card?.actions).toHaveLength(0);
      expect(res.message).toContain("quá hạn rà soát");
    });
  });
});
