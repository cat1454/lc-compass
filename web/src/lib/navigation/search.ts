import { PublicCardDTO } from "../../contracts/card";
import {
  processCitizenQuery,
  EmergencyInfo,
} from "../dialect/smart-query-processor";
import { DialectMatch } from "../dialect/dialect-normalizer";
import { TypoCorrection } from "../dialect/typo-corrector";
import {
  resolveHistoricalEntities,
  HistoricalResolutionResult,
} from "./entity-resolver";
import {
  evaluateResultConfidence,
  ConfidenceEvaluation,
} from "../safety/confidence-guard";
import {
  resolveEdgeCases,
  EdgeCaseGuidance,
} from "./edge-case-resolver";

/**
 * Loại bỏ dấu tiếng Việt chuẩn xác
 */
export function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim();
}

/**
 * Chuẩn hóa truy vấn tìm kiếm
 */
export function normalizeSearchQuery(query: string): string {
  return query.trim().replace(/\s+/g, " ");
}

export interface SearchResult {
  results: PublicCardDTO[];
  query: string;
  normalizedQuery: string;
  totalMatches: number;
  suggestions: string[];
  emergency?: EmergencyInfo;
  dialectMatches?: DialectMatch[];
  typoCorrections?: TypoCorrection[];
  historicalNotice?: string;
  userFacingExplanation?: string;
  confidence?: ConfidenceEvaluation;
  edgeCases?: EdgeCaseGuidance[];
}

const COMMON_KEYWORD_SUGGESTIONS = [
  "đăng ký tạm trú",
  "thuê trọ mới đến",
  "công an phường liên chiểu",
  "trạm y tế phường",
  "bộ phận một cửa",
  "hỗ trợ dịch vụ công trực tuyến",
  "tổ tự quản khu nhà trọ 32",
  "đình làng thanh vinh",
  "ẩm thực ven biển liên chiểu",
];

/**
 * Tìm kiếm thẻ trong catalog hỗ trợ:
 * 1. Tiếng Việt có dấu và không dấu
 * 2. Phương ngữ xứ Quảng (mô, tê, răng, rứa, chi, ni...)
 * 3. Lỗi chính tả & viết tắt người lớn tuổi (tr/ch, s/x, hỏi/ngã, đk, cccd...)
 * 4. Đối khớp thực thể lịch sử sáp nhập NQ 1659
 * 5. Đánh giá ngưỡng tin cậy chống ảo giác
 */
export function searchCatalog(query: string, cards: PublicCardDTO[]): SearchResult {
  const cleanQuery = normalizeSearchQuery(query);
  if (!cleanQuery) {
    return {
      results: cards,
      query: "",
      normalizedQuery: "",
      totalMatches: cards.length,
      suggestions: COMMON_KEYWORD_SUGGESTIONS.slice(0, 4),
    };
  }

  // 1. Tiền xử lý thông minh qua Smart Query Processor (Khẩn cấp, Phương ngữ, Lỗi gõ, Viết tắt)
  const processed = processCitizenQuery(cleanQuery);

  // 2. Đối khớp thực thể lịch sử & sáp nhập địa giới
  const historical = resolveHistoricalEntities(cleanQuery);

  // 3. Phân tích các tình huống biên dân sinh đặc thù (10 Edge Cases)
  const edgeResolution = resolveEdgeCases(cleanQuery);

  // Câu truy vấn sau khi chuẩn hóa qua các lớp
  const effectiveQuery = processed.cleanQuery || cleanQuery;
  const queryRaw = effectiveQuery.toLowerCase();
  const queryNoTone = removeVietnameseTones(effectiveQuery);
  const queryTokens = queryNoTone.split(" ").filter(Boolean);

  // Cũng giữ các token gốc để không bỏ sót từ khóa nguyên bản
  const originalNoTone = removeVietnameseTones(cleanQuery);
  const originalTokens = originalNoTone.split(" ").filter(Boolean);

  let topScore = 0;
  let hasExactMatch = false;

  const scoredCards = cards
    .map((card) => {
      let score = 0;

      const titleRaw = card.title.toLowerCase();
      const titleNoTone = removeVietnameseTones(card.title);

      // Thu thập toàn bộ nội dung text của thẻ để so khớp
      let bodyText = "";
      if (card.type === "SERVICE" && card.body) {
        bodyText = `${card.body.summary} ${card.body.steps.map((s) => `${s.title} ${s.description}`).join(" ")}`;
      } else if (card.type === "PLACE" && card.body) {
        bodyText = `${card.body.function} ${card.body.address}`;
      } else if (card.type === "DISCOVER" && card.body) {
        bodyText = `${card.body.story} ${card.body.locality}`;
      }

      const allCardTextRaw = `${card.title} ${card.applicability.join(" ")} ${(card.keywords ?? []).join(" ")} ${card.jurisdiction.label} ${bodyText}`.toLowerCase();
      const allCardTextNoTone = removeVietnameseTones(allCardTextRaw);
      const cardWordSet = new Set(allCardTextNoTone.split(/[^a-z0-9]+/i).filter(Boolean));

      // Ưu tiên đặc biệt cho các thẻ được định tuyến từ thực thể lịch sử
      if (historical.suggestedCardIds.includes(card.id)) {
        score += 250;
      }

      const hasPhraseMatch =
        allCardTextNoTone.includes(queryNoTone) ||
        allCardTextRaw.includes(queryRaw) ||
        allCardTextNoTone.includes(originalNoTone);

      const matchedTokenCount = queryTokens.filter((token) => cardWordSet.has(token)).length;
      const matchedOriginalTokenCount = originalTokens.filter((token) => cardWordSet.has(token)).length;

      // Kiểm tra cụm từ khóa của thẻ hoặc cụm từ tiêu đề xuất hiện trong câu hỏi đàm thoại tự nhiên
      const hasCoreKeywordMatch =
        (card.keywords ?? []).some((kw) => {
          const kwNoTone = removeVietnameseTones(kw);
          return kwNoTone.length >= 4 && (queryNoTone.includes(kwNoTone) || originalNoTone.includes(kwNoTone));
        }) ||
        (titleNoTone.split(" ").length >= 2 && (queryNoTone.includes(titleNoTone) || originalNoTone.includes(titleNoTone)));

      const matchesAllTokens =
        (queryTokens.length > 2 && matchedTokenCount === queryTokens.length) ||
        (originalTokens.length > 2 && matchedOriginalTokenCount === originalTokens.length);

      // Nếu không khớp cả cụm và không khớp toàn bộ các từ và không khớp từ khóa cốt lõi và không nằm trong gợi ý lịch sử thì bỏ qua
      if (!hasPhraseMatch && !matchesAllTokens && !hasCoreKeywordMatch && !historical.suggestedCardIds.includes(card.id)) {
        return { card, score: 0 };
      }

      // 1. So khớp trực tiếp tiêu đề
      if (titleRaw.includes(queryRaw) || titleRaw.includes(originalNoTone)) {
        score += 100;
        hasExactMatch = true;
      } else if (titleNoTone.includes(queryNoTone) || titleNoTone.includes(originalNoTone)) {
        score += 80;
      } else if (hasCoreKeywordMatch) {
        score += 75;
      }

      // 2. Điểm khớp từ khóa theo token
      score += Math.max(matchedTokenCount, matchedOriginalTokenCount) * 15;

      // 3. So khớp loại thẻ và đối tượng áp dụng
      if (allCardTextNoTone.includes(queryNoTone) || allCardTextNoTone.includes(originalNoTone)) {
        score += 30;
      }

      if (score > topScore) {
        topScore = score;
      }

      return { card, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const results = scoredCards.map((item) => item.card);

  // Đánh giá mức độ tin cậy để phòng chống ảo giác
  const firstCard = results[0];
  const isVerified = firstCard?.review?.status === "published";
  const confidence = evaluateResultConfidence(topScore, hasExactMatch, isVerified);

  // Tạo danh sách gợi ý liên quan
  const suggestions = COMMON_KEYWORD_SUGGESTIONS.filter((s) => {
    const sNoTone = removeVietnameseTones(s);
    return !sNoTone.includes(queryNoTone) && queryTokens.some((t) => sNoTone.includes(t));
  }).slice(0, 3);

  return {
    results,
    query: cleanQuery,
    normalizedQuery: queryNoTone,
    totalMatches: results.length,
    suggestions: suggestions.length > 0 ? suggestions : COMMON_KEYWORD_SUGGESTIONS.slice(0, 3),
    emergency: processed.emergency.isEmergency ? processed.emergency : undefined,
    dialectMatches: processed.dialectMatches.length > 0 ? processed.dialectMatches : undefined,
    typoCorrections: processed.typoCorrections.length > 0 ? processed.typoCorrections : undefined,
    historicalNotice: historical.primaryNotice,
    userFacingExplanation: processed.userFacingExplanation,
    confidence,
    edgeCases: edgeResolution.matchedCases.length > 0 ? edgeResolution.matchedCases : undefined,
  };
}
