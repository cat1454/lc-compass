import { normalizeDialectQuery, DialectMatch } from "./dialect-normalizer";
import { correctTyposAndAbbreviations, TypoCorrection } from "./typo-corrector";

export interface EmergencyInfo {
  isEmergency: boolean;
  type?: "fire" | "crime" | "medical" | "flood" | "general";
  title: string;
  hotline: string;
  instructions: string;
}

export interface ProcessedCitizenQuery {
  rawQuery: string;
  cleanQuery: string;
  normalizedQuery: string;
  emergency: EmergencyInfo;
  dialectMatches: DialectMatch[];
  typoCorrections: TypoCorrection[];
  hasModifications: boolean;
  userFacingExplanation?: string;
}

const EMERGENCY_KEYWORDS: Record<
  string,
  { type: EmergencyInfo["type"]; title: string; hotline: string; instructions: string }
> = {
  cháy: {
    type: "fire",
    title: "CẢNH BÁO HỎA HOẠN KHẨN CẤP",
    hotline: "114",
    instructions: "Di chuyển ngay ra nơi thoáng khí, không sử dụng thang máy và gọi ngay 114.",
  },
  hỏa_hoạn: {
    type: "fire",
    title: "CẢNH BÁO HỎA HOẠN KHẨN CẤP",
    hotline: "114",
    instructions: "Báo động xung quanh và gọi ngay lực lượng Cảnh sát PCCC 114.",
  },
  "cứu hỏa": {
    type: "fire",
    title: "GỌI CỨU HỎA 114",
    hotline: "114",
    instructions: "Lực lượng Cảnh sát Phòng cháy chữa cháy và Cứu nạn cứu hộ TP. Đà Nẵng.",
  },
  "cấp cứu": {
    type: "medical",
    title: "CẤP CỨU Y TẾ KHẨN CẤP 115",
    hotline: "115",
    instructions: "Giữ người bệnh ở tư thế an toàn và gọi ngay Tổng đài Cấp cứu 115.",
  },
  "tai nạn": {
    type: "medical",
    title: "HỖ TRỢ TAI NẠN / CẤP CỨU 115",
    hotline: "115",
    instructions: "Gọi ngay 115 hoặc Trạm y tế Liên Chiểu (178 Âu Cơ).",
  },
  "bị đánh": {
    type: "crime",
    title: "BÁO ÁN KHẨN CẤP / AN NINH TRẬT TỰ 113",
    hotline: "113",
    instructions: "Gọi ngay Cảnh sát 113 hoặc Trực ban Công an phường Liên Chiểu: 0236 3842 113.",
  },
  "bị cướp": {
    type: "crime",
    title: "BÁO ÁN KHẨN CẤP 113",
    hotline: "113",
    instructions: "Tìm nơi an toàn và gọi ngay 113 hoặc Công an phường Liên Chiểu.",
  },
  "ngập lụt": {
    type: "flood",
    title: "CẢNH BÁO THIÊN TAI - NGẬP LỤT",
    hotline: "0236 1022",
    instructions: "Theo dõi cảnh báo bão lũ, ngắt nguồn điện tầng thấp và liên hệ cứu hộ Đà Nẵng.",
  },
  "ngập đường": {
    type: "flood",
    title: "CẢNH BÁO NGẬP ĐƯỜNG",
    hotline: "0236 1022",
    instructions: "Không di chuyển qua các điểm ngập sâu tại Liên Chiểu, gọi 1022 để báo sự cố.",
  },
};

/**
 * Xử lý toàn diện câu hỏi của người dân: Khẩn cấp -> Phương ngữ -> Lỗi chính tả -> Viết tắt
 */
export function processCitizenQuery(query: string): ProcessedCitizenQuery {
  const rawQuery = query?.trim() || "";
  if (!rawQuery) {
    return {
      rawQuery: "",
      cleanQuery: "",
      normalizedQuery: "",
      emergency: {
        isEmergency: false,
        title: "",
        hotline: "",
        instructions: "",
      },
      dialectMatches: [],
      typoCorrections: [],
      hasModifications: false,
    };
  }

  // 1. Kiểm tra tình huống khẩn cấp (Emergency Detection)
  const lowerQuery = rawQuery.toLowerCase();
  let emergency: EmergencyInfo = {
    isEmergency: false,
    title: "",
    hotline: "",
    instructions: "",
  };

  for (const [kw, info] of Object.entries(EMERGENCY_KEYWORDS)) {
    if (lowerQuery.includes(kw)) {
      emergency = {
        isEmergency: true,
        type: info.type,
        title: info.title,
        hotline: info.hotline,
        instructions: info.instructions,
      };
      break;
    }
  }

  // 2. Sửa lỗi chính tả & từ viết tắt (đk, cccd, tt, tamj trus, tạm chú...)
  const typoResult = correctTyposAndAbbreviations(rawQuery);

  // 3. Chuẩn hóa phương ngữ Quảng Nam - Đà Nẵng (mô, tê, răng, rứa, chi, ni, hôm ni...)
  const dialectResult = normalizeDialectQuery(typoResult.correctedText);

  const cleanQuery = dialectResult.normalizedText;
  const hasModifications =
    typoResult.hasCorrections || dialectResult.hasDialect;

  // Xây dựng giải thích thân thiện cho người dùng nếu có biến đổi
  let userFacingExplanation: string | undefined;
  if (hasModifications) {
    const parts: string[] = [];
    if (dialectResult.hasDialect) {
      const dialectWords = dialectResult.matches.map(
        (m) => `"${m.original}" → "${m.normalized}"`
      );
      parts.push(`Phương ngữ xứ Quảng (${dialectWords.join(", ")})`);
    }
    if (typoResult.hasCorrections) {
      const typoWords = typoResult.corrections.map(
        (c) => `"${c.original}" → "${c.corrected}"`
      );
      parts.push(`Chuẩn hóa (${typoWords.join(", ")})`);
    }
    userFacingExplanation = `Hệ thống đã nhận diện: ${parts.join(" và ")}.`;
  }

  return {
    rawQuery,
    cleanQuery,
    normalizedQuery: cleanQuery.toLowerCase(),
    emergency,
    dialectMatches: dialectResult.matches,
    typoCorrections: typoResult.corrections,
    hasModifications,
    userFacingExplanation,
  };
}
