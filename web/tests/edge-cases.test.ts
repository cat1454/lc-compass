import { describe, it, expect } from "vitest";
import {
  resolveEdgeCases,
  EdgeCaseType,
} from "../src/lib/navigation/edge-case-resolver";

describe("Bộ Định Tuyến & Tháo Gỡ Điểm Biên Dân Sinh (Edge Case Resolver)", () => {
  it("trả về kết quả rỗng khi truy vấn trống hoặc không liên quan", () => {
    expect(resolveEdgeCases("").hasEdgeCase).toBe(false);
    expect(resolveEdgeCases("thời tiết hôm nay thế nào").hasEdgeCase).toBe(false);
    expect(resolveEdgeCases("   ").hasEdgeCase).toBe(false);
  });

  describe("Phát hiện chính xác 16 điểm biên dân sinh thực tế tại Phường Liên Chiểu", () => {
    const testCases: Array<{
      query: string;
      expectedType: EdgeCaseType;
      expectedKeywordInTitle: string;
    }> = [
      {
        query: "thuê trọ không có hợp đồng có đăng ký tạm trú được không",
        expectedType: "NO_CONTRACT",
        expectedKeywordInTitle: "hợp đồng",
      },
      {
        query: "công nhân làm ca đêm ngoài giờ hành chính thì nộp hồ sơ sao",
        expectedType: "OFF_HOURS",
        expectedKeywordInTitle: "ca",
      },
      {
        query: "sinh viên ở ghép phòng trọ không đứng tên hợp đồng",
        expectedType: "ROOMMATE_SHARING",
        expectedKeywordInTitle: "ghép",
      },
      {
        query: "bị mất căn cước công dân và chưa kích hoạt vneid",
        expectedType: "LOST_IDENTITY",
        expectedKeywordInTitle: "Căn cước",
      },
      {
        query: "ngập lụt đường mẹ suốt tìm điểm sơ tán bão",
        expectedType: "DISASTER_FLOOD",
        expectedKeywordInTitle: "THIÊN TAI",
      },
      {
        query: "người già neo đơn không đi lại được cần làm thủ tục tại nhà",
        expectedType: "MOBILITY_SENIOR",
        expectedKeywordInTitle: "lưu động tại nhà",
      },
      {
        query: "chính sách miễn lệ phí cho hộ nghèo và học sinh",
        expectedType: "FEE_WAIVER",
        expectedKeywordInTitle: "miễn 100% lệ phí",
      },
      {
        query: "tổ dân phố cũ hòa khánh bắc nay đổi thành tổ mấy",
        expectedType: "WARD_ADDRESS_DRIFT",
        expectedKeywordInTitle: "Tổ dân phố",
      },
      {
        query: "xóm trọ bị mất mạng sóng yếu không có wifi",
        expectedType: "OFFLINE_MODE",
        expectedKeywordInTitle: "ngoại tuyến",
      },
      {
        query: "cán bộ vẫn đòi sổ hộ khẩu giấy cũ",
        expectedType: "REGULATORY_LAG",
        expectedKeywordInTitle: "Sổ hộ khẩu giấy",
      },
      {
        query: "dùng máy tính quán net có an toàn bảo mật không",
        expectedType: "SHARED_DEVICE",
        expectedKeywordInTitle: "máy tính dùng chung",
      },
      {
        query: "đi nộp thay hồ sơ cho người thân nhưng không có giấy ủy quyền",
        expectedType: "THIRD_PARTY_PROXY",
        expectedKeywordInTitle: "thay người thân",
      },
      {
        query: "hồ sơ trực tuyến bị trả lại yêu cầu bổ sung giấy tờ",
        expectedType: "REJECTED_SUPPLEMENT",
        expectedKeywordInTitle: "bổ sung",
      },
      {
        query: "ký túc xá ktx phía tây 08 hà văn tính thuộc phường nào",
        expectedType: "OUT_OF_JURISDICTION",
        expectedKeywordInTitle: "CẢNH BÁO ĐỊA GIỚI",
      },
      {
        query: "xin học cho con diện tạm trú trường tiểu học nào",
        expectedType: "CHILD_SCHOOL_ADMISSION",
        expectedKeywordInTitle: "tạm trú",
      },
      {
        query: "thanh niên mở quán ăn sáng muốn đăng ký kinh doanh hộ cá thể",
        expectedType: "MICRO_BUSINESS_STARTUP",
        expectedKeywordInTitle: "kinh doanh",
      },
    ];

    for (const tc of testCases) {
      it(`phát hiện đúng ${tc.expectedType} cho truy vấn: "${tc.query}"`, () => {
        const result = resolveEdgeCases(tc.query);
        expect(result.hasEdgeCase).toBe(true);
        expect(result.primaryCase).toBeDefined();
        expect(result.primaryCase?.type).toBe(tc.expectedType);
        expect(result.primaryCase?.title).toContain(tc.expectedKeywordInTitle);
      });
    }
  });

  it("đảm bảo tính toàn vẹn pháp lý và quy chuẩn dữ liệu cho toàn bộ các điểm biên", () => {
    const edgeTypes: EdgeCaseType[] = [
      "NO_CONTRACT",
      "OFF_HOURS",
      "ROOMMATE_SHARING",
      "DISASTER_FLOOD",
      "LOST_IDENTITY",
      "MOBILITY_SENIOR",
      "FEE_WAIVER",
      "WARD_ADDRESS_DRIFT",
      "OFFLINE_MODE",
      "REGULATORY_LAG",
      "SHARED_DEVICE",
      "THIRD_PARTY_PROXY",
      "REJECTED_SUPPLEMENT",
      "OUT_OF_JURISDICTION",
      "CHILD_SCHOOL_ADMISSION",
      "MICRO_BUSINESS_STARTUP",
    ];

    for (const type of edgeTypes) {
      // Gọi qua từ khóa đặc trưng của từng loại
      const sampleQueries: Record<EdgeCaseType, string> = {
        NO_CONTRACT: "không có hợp đồng",
        OFF_HOURS: "làm ca đêm",
        ROOMMATE_SHARING: "ở ghép",
        DISASTER_FLOOD: "ngập lụt",
        LOST_IDENTITY: "mất cccd",
        MOBILITY_SENIOR: "người già neo đơn",
        FEE_WAIVER: "miễn lệ phí",
        WARD_ADDRESS_DRIFT: "tổ dân phố cũ",
        OFFLINE_MODE: "mất mạng",
        REGULATORY_LAG: "sổ hộ khẩu",
        SHARED_DEVICE: "máy tính quán net",
        THIRD_PARTY_PROXY: "làm thay",
        REJECTED_SUPPLEMENT: "hồ sơ bị trả lại",
        OUT_OF_JURISDICTION: "ktx phía tây",
        CHILD_SCHOOL_ADMISSION: "xin học cho con",
        MICRO_BUSINESS_STARTUP: "mở quán ăn sáng",
      };

      const result = resolveEdgeCases(sampleQueries[type]);
      expect(result.hasEdgeCase).toBe(true);
      const guidance = result.primaryCase!;
      expect(guidance.id).toBeDefined();
      expect(guidance.title.length).toBeGreaterThan(10);
      expect(guidance.summary.length).toBeGreaterThan(20);
      expect(guidance.solutionSteps.length).toBeGreaterThanOrEqual(2);
      expect(guidance.legalBasis.length).toBeGreaterThan(5);
      expect(guidance.actionContact.phone).toBeDefined();
      expect(guidance.actionContact.label).toBeDefined();
    }
  });
});
