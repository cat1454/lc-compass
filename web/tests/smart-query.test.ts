import { describe, it, expect } from "vitest";
import { normalizeDialectQuery } from "../src/lib/dialect/dialect-normalizer";
import { correctTyposAndAbbreviations } from "../src/lib/dialect/typo-corrector";
import { processCitizenQuery } from "../src/lib/dialect/smart-query-processor";

describe("Smart Query Processor & Dialect Normalizer", () => {
  describe("Chuẩn hóa Phương ngữ Quảng Nam - Đà Nẵng", () => {
    it("nhận diện và chuẩn hóa các chỉ từ và câu hỏi đặc trưng", () => {
      const res = normalizeDialectQuery("Hôm ni mần tạm trú ở mô rứa hè");
      expect(res.hasDialect).toBe(true);
      expect(res.normalizedText).toContain("hôm nay");
      expect(res.normalizedText).toContain("làm");
      expect(res.normalizedText).toContain("ở đâu");
      expect(res.normalizedText).toContain("thế");
      expect(res.matches.length).toBeGreaterThanOrEqual(4);
    });

    it("chuẩn hóa đại từ nhân xưng xứ Quảng (tau, mi)", () => {
      const res = normalizeDialectQuery("chỗ tau làm việc gần trạm y tế");
      expect(res.hasDialect).toBe(true);
      expect(res.normalizedText).toContain("tôi");
    });

    it("chuẩn hóa biến âm ngữ âm xứ Quảng (nác, gộ, đóa banh)", () => {
      const res1 = normalizeDialectQuery("uống nác");
      expect(res1.normalizedText).toBe("uống nước");

      const res2 = normalizeDialectQuery("mua gộ");
      expect(res2.normalizedText).toBe("mua gạo");
    });
  });

  describe("Sửa lỗi chính tả & từ viết tắt của người lớn tuổi", () => {
    it("chuẩn hóa các từ viết tắt hành chính phổ biến (đk, tt, bhyt, cccd)", () => {
      const res = correctTyposAndAbbreviations("đk tt và làm cccd");
      expect(res.hasCorrections).toBe(true);
      expect(res.correctedText).toContain("đăng ký");
      expect(res.correctedText).toContain("tạm trú");
      expect(res.correctedText).toContain("căn cước công dân");
    });

    it("sửa lỗi nhầm âm tr <-> ch của người già miền Trung", () => {
      const res = correctTyposAndAbbreviations("thủ tục tạm chú và khám trữa bệnh");
      expect(res.hasCorrections).toBe(true);
      expect(res.correctedText).toContain("tạm trú");
      expect(res.correctedText).toContain("chữa bệnh");
    });

    it("sửa lỗi nhầm âm s <-> x và d <-> gi", () => {
      const res1 = correctTyposAndAbbreviations("xổ hộ khẩu");
      expect(res1.correctedText).toContain("sổ hộ khẩu");

      const res2 = correctTyposAndAbbreviations("dấy tạm trú");
      expect(res2.correctedText).toContain("giấy tạm trú");
    });

    it("sửa lỗi nhầm dấu hỏi <-> ngã", () => {
      const res = correctTyposAndAbbreviations("hộ khẫu và bão hiểm");
      expect(res.correctedText).toContain("hộ khẩu");
      expect(res.correctedText).toContain("bảo hiểm");
    });

    it("sửa lỗi gõ phím telex nhảy chữ (tamj trus, thu tucj)", () => {
      const res = correctTyposAndAbbreviations("tamj trus thu tucj");
      expect(res.correctedText).toContain("tạm trú");
      expect(res.correctedText).toContain("thủ tục");
    });
  });

  describe("Tích hợp toàn diện & Phát hiện Tình huống Khẩn cấp", () => {
    it("kích hoạt báo động khẩn cấp khi gặp từ khóa nguy hiểm", () => {
      const fireRes = processCitizenQuery("bị cháy nhà ở liên chiểu");
      expect(fireRes.emergency.isEmergency).toBe(true);
      expect(fireRes.emergency.type).toBe("fire");
      expect(fireRes.emergency.hotline).toBe("114");

      const medicalRes = processCitizenQuery("cần cấp cứu khẩn cấp");
      expect(medicalRes.emergency.isEmergency).toBe(true);
      expect(medicalRes.emergency.hotline).toBe("115");

      const crimeRes = processCitizenQuery("đang bị đánh");
      expect(crimeRes.emergency.isEmergency).toBe(true);
      expect(crimeRes.emergency.hotline).toBe("113");
    });

    it("xử lý đồng thời cả phương ngữ, viết tắt và lỗi chính tả", () => {
      const res = processCitizenQuery("bữa ni đk tạm chú ở mô rứa");
      expect(res.hasModifications).toBe(true);
      expect(res.cleanQuery).toContain("hôm nay");
      expect(res.cleanQuery).toContain("đăng ký");
      expect(res.cleanQuery).toContain("tạm trú");
      expect(res.cleanQuery).toContain("ở đâu");
      expect(res.userFacingExplanation).toBeDefined();
    });
  });
});
