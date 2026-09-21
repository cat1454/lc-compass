import { describe, it, expect } from "vitest";
import { normalizeDialectQuery } from "../src/lib/dialect/dialect-normalizer";
import { correctTyposAndAbbreviations } from "../src/lib/dialect/typo-corrector";
import { processCitizenQuery } from "../src/lib/dialect/smart-query-processor";
import { searchCatalog } from "../src/lib/navigation/search";
import { PublicCardDTO } from "../src/contracts/card";

// Mock cards để kiểm tra định tuyến
const MOCK_CARDS: PublicCardDTO[] = [
  {
    id: "service-chuan-bi-tam-tru",
    version: "1.0.1",
    type: "SERVICE",
    title: "Chuẩn bị thông tin đăng ký tạm trú",
    intentIds: ["cu_tru-01"],
    jurisdiction: { id: "lien-chieu-2025", label: "Phường Liên Chiểu, TP. Đà Nẵng" },
    applicability: ["Người dân thuê trọ"],
    review: { status: "published", reviewedAt: "2026-09-19" },
    isVerified: true,
    keywords: ["tạm trú", "thuê trọ", "cư trú"],
    body: { summary: "Các việc cần chuẩn bị trước khi đăng ký tạm trú", steps: [] },
  } as unknown as PublicCardDTO,
  {
    id: "service-tham-gia-bhyt-ho-gia-dinh",
    version: "1.0.0",
    type: "SERVICE",
    title: "Tìm thông tin tham gia bảo hiểm y tế hộ gia đình",
    intentIds: ["y_te-04"],
    jurisdiction: { id: "lien-chieu-2025", label: "Phường Liên Chiểu, TP. Đà Nẵng" },
    applicability: ["Công dân cư trú"],
    review: { status: "published", reviewedAt: "2026-09-19" },
    isVerified: true,
    keywords: ["BHYT", "bảo hiểm y tế"],
    body: { summary: "Mức đóng và điểm đăng ký BHYT", steps: [] },
  } as unknown as PublicCardDTO,
];

describe("Đa Phương Ngữ Vùng Miền & Xử Lý Điểm Biên Chưa Biết (Multi-Regional & Unknown Cases)", () => {
  describe("1. Chuẩn hóa tiếng Nghệ An - Hà Tĩnh (Bắc Trung Bộ)", () => {
    it("chuyển đổi chuẩn xác các từ nỏ, mần răng, ở mô, đọi", () => {
      const input = "nỏ biết mần tạm trú ở mô";
      const result = normalizeDialectQuery(input);
      expect(result.hasDialect).toBe(true);
      expect(result.normalizedText).toContain("không biết");
      expect(result.normalizedText).toContain("làm");
      expect(result.normalizedText).toContain("ở đâu");
    });

    it("chuyển đổi đại từ bầy tui, ngái, hung", () => {
      const input = "bầy tui ở ngái quá";
      const result = normalizeDialectQuery(input);
      expect(result.hasDialect).toBe(true);
      expect(result.normalizedText).toBe("chúng tôi ở xa quá");
    });
  });

  describe("2. Chuẩn hóa tiếng Nam Bộ & Tây Nam Bộ", () => {
    it("chuyển đổi hổng biết, tui, làm sao dị, chừng nào", () => {
      const input = "tui hổng biết làm sao dị";
      const result = normalizeDialectQuery(input);
      expect(result.hasDialect).toBe(true);
      expect(result.normalizedText).toContain("tôi");
      expect(result.normalizedText).toContain("không biết");
      expect(result.normalizedText).toContain("làm sao vậy");
    });

    it("chuyển đổi từ bịnh sang bệnh", () => {
      const input = "chỗ khám bịnh";
      const result = normalizeDialectQuery(input);
      expect(result.hasDialect).toBe(true);
      expect(result.normalizedText).toBe("chỗ khám bệnh");
    });
  });

  describe("3. Sửa lỗi nhầm lẫn l/n Bắc Bộ & từ xưng hô thân tộc", () => {
    it("sửa nhầm l/n: nàm tạm trú -> làm tạm trú", () => {
      const input = "nàm tạm trú ở đâu";
      const result = correctTyposAndAbbreviations(input);
      expect(result.hasCorrections).toBe(true);
      expect(result.correctedText).toContain("làm tạm trú");
    });

    it("sửa nhầm l/n: lộp hồ sơ -> nộp hồ sơ, nấy căn cước -> lấy căn cước", () => {
      const input = "lộp hồ sơ và nấy căn cước";
      const result = correctTyposAndAbbreviations(input);
      expect(result.hasCorrections).toBe(true);
      expect(result.correctedText).toContain("nộp hồ sơ");
      expect(result.correctedText).toContain("lấy căn cước");
    });

    it("nhận diện từ xưng hô thầy bu -> bố mẹ", () => {
      const input = "đón thầy bu ở quê ra ở cùng";
      const result = correctTyposAndAbbreviations(input);
      expect(result.hasCorrections).toBe(true);
      expect(result.correctedText).toContain("bố mẹ");
    });
  });

  describe("4. Tích hợp xuyên suốt qua Bộ Xử lý Thông minh (Smart Query Processor)", () => {
    it("xử lý truy vấn kết hợp: phương ngữ Nghệ Tĩnh + lỗi gõ phím", () => {
      const input = "nỏ biết nàm tamj trus ở mô rứa";
      const result = processCitizenQuery(input);
      expect(result.cleanQuery).toContain("không");
      expect(result.cleanQuery).toContain("làm");
      expect(result.cleanQuery).toContain("tạm trú");
      expect(result.userFacingExplanation).toBeDefined();
    });

    it("tìm kiếm thành công thẻ tạm trú dù công nhân gõ tiếng địa phương", () => {
      const query = "nỏ biết nàm tạm trú ở mô rứa";
      const searchResult = searchCatalog(query, MOCK_CARDS);
      expect(searchResult.results.length).toBeGreaterThan(0);
      expect(searchResult.results[0].id).toBe("service-chuan-bi-tam-tru");
    });
  });

  describe("5. Cơ chế ứng phó an toàn khi gặp tình huống hoàn toàn chưa biết (Unknown Edge Cases)", () => {
    it("fail-closed an toàn, không bịa đặt khi hỏi tình huống ngoài phạm vi", () => {
      const query = "thủ tục đăng ký kết hôn với người ngoài hành tinh sao hỏa";
      const searchResult = searchCatalog(query, MOCK_CARDS);
      // Kết quả rỗng, không tự sinh ra thẻ giả
      expect(searchResult.results.length).toBe(0);
      expect(searchResult.confidence?.confidenceScore).toBe(0);
      expect(searchResult.confidence?.requiresHumanHandover).toBe(true);
      expect(searchResult.confidence?.isAboveThreshold).toBe(false);
    });
  });
});
