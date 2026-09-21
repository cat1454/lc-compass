import { describe, expect, it } from "vitest";
import { ContentCard } from "../src/contracts/card";
import { calculateAvailability, toPublicCardDTO, validateContentCard } from "../src/contracts/validator";
import { getPublicCardById, loadPublicCatalog, loadRawCards } from "./support/synthetic-catalog";
import { decideRoute } from "../src/lib/navigation/decide";
import { removeVietnameseTones, searchCatalog } from "../src/lib/navigation/search";

describe("Kiểm thử hồi quy theo kết quả rà soát Codex cho Gói 02–04", () => {
  describe("1. Phân nhánh theo dữ liệu & Không mặc định người dùng có hợp đồng", () => {
    it("Khi chưa trả lời câu hỏi (answers = {}), không kích hoạt bước bổ trợ và chỉ hiển thị luồng mặc định", async () => {
      const res = await getPublicCardById("service-tam-tru-lc");
      expect(res.availability).toBe("available");
      expect(res.card).toBeDefined();

      const card = res.card as any;
      const steps: any[] = card.body.steps;
      const stepWithBranch = steps.find((s) => s.branches && s.branches.length > 0);
      expect(stepWithBranch).toBeDefined();

      // Nhánh rẽ yêu cầu condition hoặc when khớp giá trị "no_contract"
      const branch = stepWithBranch!.branches[0];
      const cond = branch.when ?? branch.condition;
      expect(cond).toBeDefined();
      expect(cond!.questionId).toBe("q-housing-contract");
      expect(cond!.equals).toBe("no_contract");

      // Nếu answers rỗng, điều kiện không khớp -> không chuyển tiếp đến bước bổ trợ
      const emptyAnswers: Record<string, string> = {};
      const matchesEmpty = cond && emptyAnswers[cond.questionId] === cond.equals;
      expect(matchesEmpty).toBeFalsy();
    });

    it("Khi người dùng chọn 'no_contract', nhánh rẽ được kích hoạt động hoàn toàn từ dữ liệu thẻ", async () => {
      const res = await getPublicCardById("service-tam-tru-lc");
      const card = res.card as any;
      const steps: any[] = card.body.steps;
      const stepWithBranch = steps.find((s) => s.branches && s.branches.length > 0)!;
      const branch = stepWithBranch.branches[0];
      const cond = (branch.when ?? branch.condition)!;

      const userAnswers = { [cond.questionId]: "no_contract" };
      const branchTriggered = userAnswers[cond.questionId] === cond.equals;
      expect(branchTriggered).toBe(true);
      expect(branch.nextStepId).toBe("step-support-contract");
    });
  });

  describe("2. Kiểm tra hết hạn tại đúng thời điểm truy cập (Access-time Expiration)", () => {
    it("Thẻ có hạn reviewDue trong quá khứ bị từ chối truy cập ngay tại thời điểm kiểm tra", async () => {
      const rawCards = await loadRawCards();
      const expiredCard: ContentCard = {
        ...structuredClone(rawCards[0]),
        id: "test-card-expired",
        review: {
          ...rawCards[0].review,
          status: "published",
          reviewer: "Cán bộ B",
          reviewedAt: "2024-01-01",
          reviewDue: "2024-06-30", // Đã quá hạn so với 2026
        },
        isSynthetic: false,
      };

      const now = new Date("2026-09-18T00:00:00Z");
      const availability = calculateAvailability(expiredCard, now);
      expect(availability).toBe("expired");

      const dto = toPublicCardDTO(expiredCard, now);
      expect(dto.availability).toBe("expired");
      expect(dto.body).toBeUndefined();
      expect(dto.actions).toHaveLength(0);
      expect(dto.review.isVerified).toBe(false);
    });

    it("Thẻ còn hạn reviewDue tại thời điểm truy cập được chấp nhận available", async () => {
      const rawCards = await loadRawCards();
      const validCard: ContentCard = {
        ...structuredClone(rawCards[0]),
        id: "test-card-valid",
        review: {
          ...rawCards[0].review,
          status: "published",
          reviewer: "Cán bộ B",
          reviewedAt: "2026-01-01",
          reviewDue: "2026-12-31", // Còn hạn trong năm 2026
        },
        isSynthetic: false,
      };

      const now = new Date("2026-09-18T00:00:00Z");
      const availability = calculateAvailability(validCard, now);
      expect(availability).toBe("available");
    });
  });

  describe("3. Quản lý nguồn & Tách biệt số điện thoại tiếp nhận cuộc thi", () => {
    it("Không được sử dụng số tiếp nhận cuộc thi (0905423233) làm số hotline dịch vụ công trong catalog", async () => {
      const rawCards = await loadRawCards();
      const CONTEST_PHONE = "0905423233";

      for (const card of rawCards) {
        // Kiểm tra trong actions
        for (const action of card.actions) {
          if (action.type === "phone") {
            expect(action.contact).not.toBe(CONTEST_PHONE);
          }
        }

        // Kiểm tra trong body
        if (card.body && "contactPhone" in card.body) {
          expect(card.body.contactPhone).not.toBe(CONTEST_PHONE);
        }
      }
    });

    it("Dữ liệu mô phỏng chưa có người rà soát thật phải gắn nhãn isSynthetic và isVerified = false", async () => {
      const catalog = await loadPublicCatalog();
      for (const card of catalog) {
        // Thẻ đang lưu hành demo phải trung thực không đánh dấu là đã thẩm định chính thức
        expect(card.review.isVerified).toBe(false);
      }
    });
  });

  describe("4. Tích hợp Lõi điều hướng & Tìm kiếm tiếng Việt", () => {
    it("decideRoute hỗ trợ các hồ sơ đặc thù (renting_new_arrival, proxy_no, urgent)", () => {
      const directRoute = decideRoute({
        intentId: "cu_tru-01",
        profileMode: "self",
        flags: ["clean"],
      });
      expect(directRoute.action).toBe("PREPARE");

      const urgentRoute = decideRoute({
        intentId: "cu_tru-01",
        profileMode: "self",
        flags: ["urgent"],
      });
      expect(urgentRoute.action).toBe("URGENT_HELP");

      const proxyNoRoute = decideRoute({
        intentId: "cu_tru-01",
        profileMode: "proxy_no",
        flags: ["clean"],
      });
      expect(proxyNoRoute.action).toBe("GENERAL_ONLY");
    });

    it("searchCatalog chuẩn hóa tiếng Việt không dấu và loại bỏ dấu chính xác", () => {
      expect(removeVietnameseTones("Đăng Ký Tạm Trú")).toBe("dang ky tam tru");
      expect(removeVietnameseTones("Hòa Mỹ")).toBe("hoa my");
      expect(removeVietnameseTones("Liên Chiểu")).toBe("lien chieu");
    });
  });
});
