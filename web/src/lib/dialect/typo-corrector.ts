/**
 * Bộ Sửa Lỗi Chính Tả & Viết Tắt Dành Cho Người Lớn Tuổi & Lao Động Phổ Thông
 * Hỗ trợ ma trận nhầm âm miền Trung (tr/ch, s/x, d/gi, hỏi/ngã), lỗi gõ phím telex, và viết tắt dân sinh.
 */

export interface TypoCorrection {
  original: string;
  corrected: string;
  type: "abbreviation" | "phonetic_confusion" | "telex_typo" | "tone_confusion";
}

export interface TypoCorrectionResult {
  originalText: string;
  correctedText: string;
  corrections: TypoCorrection[];
  hasCorrections: boolean;
}

/**
 * Bảng từ viết tắt hành chính - dân sinh phổ biến
 */
export const ABBREVIATIONS_MAP: Record<string, string> = {
  đk: "đăng ký",
  dki: "đăng ký",
  dk: "đăng ký",
  tt: "tạm trú",
  "thường trú": "thường trú",
  bhyt: "bảo hiểm y tế",
  cccd: "căn cước công dân",
  cmnd: "căn cước công dân",
  ubnd: "trung tâm hành chính ủy ban",
  ub: "ủy ban",
  ca: "công an phường",
  yt: "y tế",
  dvc: "dịch vụ công",
  kcn: "khu công nghiệp",
  ktx: "ký túc xá",
  hộ_khẩu: "sổ hộ khẩu",
  hk: "hộ khẩu",
  gks: "giấy khai sinh",
  đt: "điện thoại",
  sđt: "số điện thoại",
};

/**
 * Bảng sửa lỗi nhầm lẫn ngữ âm miền Trung và lỗi gõ phím của người lớn tuổi
 */
export const PHONETIC_AND_TELEX_MAP: Record<
  string,
  { corrected: string; type: TypoCorrection["type"] }
> = {
  // Nhầm tr <-> ch
  "tạm chú": { corrected: "tạm trú", type: "phonetic_confusion" },
  "thường chú": { corrected: "thường trú", type: "phonetic_confusion" },
  "chú ngụ": { corrected: "trú ngụ", type: "phonetic_confusion" },
  "trữa bệnh": { corrected: "chữa bệnh", type: "phonetic_confusion" },
  "chứng thựt": { corrected: "chứng thực", type: "phonetic_confusion" },
  "công trức": { corrected: "công chức", type: "phonetic_confusion" },
  "chuyển trườn": { corrected: "chuyển trường", type: "phonetic_confusion" },
  "trường truyên": { corrected: "trường chuyên", type: "phonetic_confusion" },

  // Nhầm s <-> x
  "xổ hộ khẩu": { corrected: "sổ hộ khẩu", type: "phonetic_confusion" },
  "cơ xở": { corrected: "cơ sở", type: "phonetic_confusion" },
  "khảo xát": { corrected: "khảo sát", type: "phonetic_confusion" },

  // Nhầm d <-> gi
  "dấy tạm trú": { corrected: "giấy tạm trú", type: "phonetic_confusion" },
  "dấy tờ": { corrected: "giấy tờ", type: "phonetic_confusion" },
  "dấy khai sinh": { corrected: "giấy khai sinh", type: "phonetic_confusion" },
  "gia đình": { corrected: "gia đình", type: "phonetic_confusion" },

  // Nhầm hỏi <-> ngã
  "hộ khẫu": { corrected: "hộ khẩu", type: "tone_confusion" },
  "bão hiểm": { corrected: "bảo hiểm", type: "tone_confusion" },
  "chổ ở": { corrected: "chỗ ở", type: "tone_confusion" },
  "chổ trọ": { corrected: "chỗ trọ", type: "tone_confusion" },
  "củ": { corrected: "cũ", type: "tone_confusion" },

  // Nhầm l <-> n (Phương ngữ Bắc Bộ: Thanh Hóa, Hải Dương, v.v.)
  "nàm": { corrected: "làm", type: "phonetic_confusion" },
  "nấy": { corrected: "lấy", type: "phonetic_confusion" },
  "lộp": { corrected: "nộp", type: "phonetic_confusion" },
  "nưu trú": { corrected: "lưu trú", type: "phonetic_confusion" },
  "lơi cư trú": { corrected: "nơi cư trú", type: "phonetic_confusion" },
  "liêm yết": { corrected: "niêm yết", type: "phonetic_confusion" },

  // Từ xưng hô thân tộc vùng miền
  "thầy bu": { corrected: "bố mẹ", type: "phonetic_confusion" },
  "u ở quê": { corrected: "mẹ ở quê", type: "phonetic_confusion" },

  // Lỗi gõ Telex & phím kẹt thường gặp
  "tamj trus": { corrected: "tạm trú", type: "telex_typo" },
  "thu tucj": { corrected: "thủ tục", type: "telex_typo" },
  "phuongwf": { corrected: "phường", type: "telex_typo" },
  "tamg tru": { corrected: "tạm trú", type: "telex_typo" },
  "tqam tru": { corrected: "tạm trú", type: "telex_typo" },
  "liên chiêur": { corrected: "liên chiểu", type: "telex_typo" },
  "căn cướt": { corrected: "căn cước", type: "telex_typo" },
};

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Xử lý sửa lỗi chính tả và mở rộng viết tắt cho truy vấn
 */
export function correctTyposAndAbbreviations(text: string): TypoCorrectionResult {
  if (!text || typeof text !== "string") {
    return {
      originalText: "",
      correctedText: "",
      corrections: [],
      hasCorrections: false,
    };
  }

  const corrections: TypoCorrection[] = [];
  let result = text;

  // 1. Quét và sửa các cụm từ ngữ âm / telex (xếp từ dài trước)
  const sortedPhonetics = Object.entries(PHONETIC_AND_TELEX_MAP).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [wrong, info] of sortedPhonetics) {
    const regex = new RegExp(
      `(^|[^\\p{L}\\p{N}])${escapeRegex(wrong)}(?=[^\\p{L}\\p{N}]|$)`,
      "gui"
    );

    if (regex.test(result)) {
      if (!corrections.some((c) => c.original.toLowerCase() === wrong.toLowerCase())) {
        corrections.push({
          original: wrong,
          corrected: info.corrected,
          type: info.type,
        });
      }
      result = result.replace(regex, `$1${info.corrected}`);
    }
  }

  // 2. Quét và mở rộng từ viết tắt (sử dụng Unicode boundary)
  const sortedAbbr = Object.entries(ABBREVIATIONS_MAP).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [abbr, expansion] of sortedAbbr) {
    const regex = new RegExp(
      `(^|[^\\p{L}\\p{N}])${escapeRegex(abbr)}(?=[^\\p{L}\\p{N}]|$)`,
      "gui"
    );

    if (regex.test(result)) {
      if (!corrections.some((c) => c.original.toLowerCase() === abbr.toLowerCase())) {
        corrections.push({
          original: abbr,
          corrected: expansion,
          type: "abbreviation",
        });
      }
      result = result.replace(regex, `$1${expansion}`);
    }
  }

  result = result.replace(/\s+/g, " ").trim();

  return {
    originalText: text,
    correctedText: result,
    corrections,
    hasCorrections: corrections.length > 0,
  };
}
