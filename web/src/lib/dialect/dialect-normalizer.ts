/**
 * Bộ Chuẩn Hóa Phương Ngữ Quảng Nam - Đà Nẵng (Quang Nam - Da Nang Dialect Normalizer)
 * Hỗ trợ chuyển đổi từ vựng, đại từ, chỉ từ và biến âm bản địa sang tiếng Việt phổ thông
 * giúp công cụ tìm kiếm và phân loại ý định không bị sai lệch đối với người dân địa phương.
 */

export interface DialectMatch {
  original: string;
  normalized: string;
  type: "pronoun" | "particle" | "verb" | "phonetic" | "time" | "adverb";
}

export interface DialectNormalizationResult {
  originalText: string;
  normalizedText: string;
  matches: DialectMatch[];
  hasDialect: boolean;
}

/**
 * Bảng từ điển đa phương ngữ Bắc - Trung - Nam
 * Phục vụ công nhân KCN Hòa Khánh và sinh viên các trường ĐH/CĐ đến từ mọi miền Tổ quốc
 */
export const DIALECT_DICTIONARY: Record<
  string,
  { replacement: string; type: DialectMatch["type"] }
> = {
  // === 1. ĐẠI TỪ NHÂN XƯNG & CHỈ TỪ ĐA VÙNG MIỀN ===
  tau: { replacement: "tôi", type: "pronoun" },
  mi: { replacement: "bạn", type: "pronoun" },
  bậu: { replacement: "bạn", type: "pronoun" },
  nẫu: { replacement: "người ta", type: "pronoun" },
  qua: { replacement: "tôi", type: "pronoun" },
  tui: { replacement: "tôi", type: "pronoun" },
  "bầy tui": { replacement: "chúng tôi", type: "pronoun" },
  "bầy tao": { replacement: "chúng tôi", type: "pronoun" },
  "mấy bồ": { replacement: "các bạn", type: "pronoun" },
  ngài: { replacement: "người", type: "pronoun" },

  // === 2. CỤM TỪ HỎI & TRẠNG TỪ KÉP (ƯU TIÊN TRƯỚC TỪ ĐƠN) ===
  "ở mô": { replacement: "ở đâu", type: "adverb" },
  "chừng mô": { replacement: "khi nào", type: "time" },
  "khi mô": { replacement: "khi nào", type: "time" },
  "mần răng": { replacement: "làm sao", type: "verb" },
  "mần chi": { replacement: "làm gì", type: "verb" },
  "ra răng": { replacement: "thế nào", type: "adverb" },
  "răng rứa": { replacement: "sao thế", type: "adverb" },
  "chi rứa": { replacement: "gì thế", type: "adverb" },
  "chi nứa": { replacement: "gì nữa", type: "adverb" },
  "răng hè": { replacement: "sao nhỉ", type: "adverb" },
  "hôm ni": { replacement: "hôm nay", type: "time" },
  "bữa ni": { replacement: "hôm nay", type: "time" },
  "bữa nay": { replacement: "hôm nay", type: "time" },
  "chút xí": { replacement: "một chút", type: "adverb" },
  "chút xíu": { replacement: "một chút", type: "adverb" },
  "đóa banh": { replacement: "đá banh", type: "phonetic" },

  // Tiếng Nghệ An - Hà Tĩnh (Bắc Trung Bộ)
  "nỏ có": { replacement: "không có", type: "adverb" },
  "nỏ biết": { replacement: "không biết", type: "verb" },
  "nỏ chộ": { replacement: "không thấy", type: "verb" },
  "mô tút": { replacement: "ở đâu xa", type: "adverb" },

  // Tiếng Miền Nam & Tây Nam Bộ
  "hổng có": { replacement: "không có", type: "adverb" },
  "hổng biết": { replacement: "không biết", type: "verb" },
  "chừng nào": { replacement: "khi nào", type: "time" },
  "hồi nào": { replacement: "khi nào", type: "time" },
  "làm sao dị": { replacement: "làm sao vậy", type: "adverb" },
  "thiệt hông": { replacement: "thật không", type: "adverb" },
  "dưới trỏng": { replacement: "ở trong đó", type: "adverb" },

  // === 3. CHỈ TỪ KHÔNG GIAN & TỪ PHỦ ĐỊNH ĐƠN ===
  mô: { replacement: "đâu", type: "adverb" },
  tê: { replacement: "kia", type: "adverb" },
  nớ: { replacement: "đó", type: "adverb" },
  ni: { replacement: "này", type: "adverb" },
  răng: { replacement: "sao", type: "adverb" },
  rứa: { replacement: "thế", type: "adverb" },
  chi: { replacement: "gì", type: "adverb" },
  nỏ: { replacement: "không", type: "adverb" },
  hổng: { replacement: "không", type: "adverb" },
  trỏng: { replacement: "trong đó", type: "adverb" },
  ngoải: { replacement: "ngoài đó", type: "adverb" },
  trển: { replacement: "trên đó", type: "adverb" },
  ngái: { replacement: "xa", type: "adverb" },
  hung: { replacement: "lắm", type: "adverb" },

  // === 4. ĐỘNG TỪ & BIẾN ÂM VÙNG MIỀN ===
  mần: { replacement: "làm", type: "verb" },
  lồm: { replacement: "làm", type: "verb" },
  chộ: { replacement: "thấy", type: "verb" },
  ngó: { replacement: "xem", type: "verb" },
  đọi: { replacement: "chờ", type: "verb" },
  chừ: { replacement: "bây giờ", type: "time" },
  cấy: { replacement: "cái", type: "phonetic" },
  trốc: { replacement: "đầu", type: "phonetic" },
  nác: { replacement: "nước", type: "phonetic" },
  gộ: { replacement: "gạo", type: "phonetic" },
  bòong: { replacement: "bàn", type: "phonetic" },
  bịnh: { replacement: "bệnh", type: "phonetic" },

  // === 5. TRỢ TỪ CẢM THÁN CUỐI CÂU ===
  hỉ: { replacement: "nhé", type: "particle" },
  hè: { replacement: "nhỉ", type: "particle" },
  rầu: { replacement: "rồi", type: "particle" },
  nghen: { replacement: "nhé", type: "particle" },
  dẫy: { replacement: "vậy", type: "particle" },
  nè: { replacement: "này", type: "particle" },
};

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Chuẩn hóa chuỗi văn bản chứa phương ngữ Quảng Nam - Đà Nẵng
 * Sử dụng Unicode boundary để bắt chính xác các ký tự tiếng Việt có dấu
 */
export function normalizeDialectQuery(text: string): DialectNormalizationResult {
  if (!text || typeof text !== "string") {
    return {
      originalText: "",
      normalizedText: "",
      matches: [],
      hasDialect: false,
    };
  }

  const matches: DialectMatch[] = [];
  let result = text;

  // Sắp xếp các mục từ điển theo chiều dài giảm dần (cụm từ dài ưu tiên trước từ đơn)
  const sortedEntries = Object.entries(DIALECT_DICTIONARY).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [phrase, info] of sortedEntries) {
    // Boundary Unicode an toàn cho tiếng Việt: (^|[^\p{L}\p{N}])phrase(?=[^\p{L}\p{N}]|$)
    const regex = new RegExp(
      `(^|[^\\p{L}\\p{N}])${escapeRegex(phrase)}(?=[^\\p{L}\\p{N}]|$)`,
      "gui"
    );

    if (regex.test(result)) {
      if (!matches.some((m) => m.original.toLowerCase() === phrase.toLowerCase())) {
        matches.push({
          original: phrase,
          normalized: info.replacement,
          type: info.type,
        });
      }
      result = result.replace(regex, `$1${info.replacement}`);
    }
  }

  const cleanedResult = result.replace(/\s+/g, " ").trim();

  return {
    originalText: text,
    normalizedText: cleanedResult,
    matches,
    hasDialect: matches.length > 0,
  };
}
