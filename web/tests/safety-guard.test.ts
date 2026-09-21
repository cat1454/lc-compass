import { describe, it, expect } from "vitest";
import { sanitizePII, maskCCCD, maskPhone } from "../src/lib/safety/pii-sanitizer";
import { evaluateResultConfidence, CONFIDENCE_THRESHOLD } from "../src/lib/safety/confidence-guard";

describe("Client-Side PII Sanitizer & Confidence Guard", () => {
  describe("Bộ lọc dữ liệu cá nhân PII", () => {
    it("che giấu đúng số CCCD 12 chữ số", () => {
      expect(maskCCCD("048199001234")).toBe("048*********");
    });

    it("che giấu đúng số điện thoại di động 10 chữ số", () => {
      expect(maskPhone("0905423233")).toBe("090*****33");
    });

    it("phát hiện và che giấu PII trong câu người dân gõ", () => {
      const res = sanitizePII("tôi muốn đăng ký tạm trú, số CCCD là 048199001234 và sđt 0905423233");
      expect(res.hasPII).toBe(true);
      expect(res.detections.length).toBe(2);
      expect(res.sanitizedText).toContain("048*********");
      expect(res.sanitizedText).toContain("090*****33");
      expect(res.privacyNotice).toBeDefined();
    });

    it("không can thiệp khi không có thông tin nhạy cảm", () => {
      const res = sanitizePII("hướng dẫn thủ tục đăng ký tạm trú");
      expect(res.hasPII).toBe(false);
      expect(res.detections.length).toBe(0);
      expect(res.sanitizedText).toBe("hướng dẫn thủ tục đăng ký tạm trú");
    });
  });

  describe("Cơ chế Human-In-The-Loop & Ngưỡng tin cậy", () => {
    it("đạt ngưỡng tin cậy >= 90% khi khớp chính xác nguồn đã thẩm định", () => {
      const res = evaluateResultConfidence(150, true, true);
      expect(res.confidenceScore).toBeGreaterThanOrEqual(CONFIDENCE_THRESHOLD);
      expect(res.isAboveThreshold).toBe(true);
      expect(res.requiresHumanHandover).toBe(false);
    });

    it("kích hoạt Fail-Closed và chuyển giao Cán bộ / Tổng đài 1022 khi điểm tin cậy thấp", () => {
      const res = evaluateResultConfidence(40, false, false);
      expect(res.confidenceScore).toBeLessThan(CONFIDENCE_THRESHOLD);
      expect(res.requiresHumanHandover).toBe(true);
      expect(res.handoverReason).toBeDefined();
      expect(res.officialContacts.phone).toBe("0236 1022");
      expect(res.officialContacts.address).toContain("68 đường Lạc Long Quân");
    });
  });
});
