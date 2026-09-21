/**
 * Bộ Đối Khớp Thực Thể Lịch Sử & Thay Đổi Địa Giới (Historical Entity Resolution Engine)
 * Căn cứ: Nghị quyết số 1659/NQ-UBTVQH15 về sắp xếp đơn vị hành chính cấp xã TP. Đà Nẵng
 * Giúp người dân tìm bằng danh xưng cũ, đơn vị sáp nhập hoặc di dời vẫn được định tuyến chính xác.
 */

export interface HistoricalEntityMapping {
  alias: string;
  targetCardId?: string;
  currentName: string;
  currentAddress?: string;
  isWithinNewLienChieu: boolean;
  historicalNotice: string;
  actionGuidance?: string;
}

export interface HistoricalResolutionResult {
  hasHistoricalMatch: boolean;
  matchedEntities: HistoricalEntityMapping[];
  primaryNotice?: string;
  suggestedCardIds: string[];
}

const RAW_HISTORICAL_MAP: HistoricalEntityMapping[] = [
  {
    alias: "công an phường hòa khánh bắc",
    targetCardId: "place-cong-an-phuong-lien-chieu",
    currentName: "Công an Phường Liên Chiểu mới",
    currentAddress: "66 đường Lạc Long Quân, phường Liên Chiểu",
    isWithinNewLienChieu: true,
    historicalNotice:
      "Theo NQ 1659/NQ-UBTVQH15, Công an phường Hòa Khánh Bắc cũ đã đổi tên và sáp nhập thành Công an Phường Liên Chiểu mới.",
    actionGuidance: "Trụ sở tiếp nhận đăng ký cư trú tại số 66 đường Lạc Long Quân (cạnh UBND phường).",
  },
  {
    alias: "trạm y tế hòa khánh bắc",
    targetCardId: "place-tram-y-te-lien-chieu",
    currentName: "Trạm Y tế Phường Liên Chiểu",
    currentAddress: "178 đường Âu Cơ, phường Liên Chiểu",
    isWithinNewLienChieu: true,
    historicalNotice:
      "Theo NQ 1659/NQ-UBTVQH15, Trạm y tế Hòa Khánh Bắc cũ chuyển giao nhiệm vụ chăm sóc sức khỏe ban đầu cho Trạm Y tế Phường Liên Chiểu.",
    actionGuidance: "Khám chữa bệnh BHYT ban đầu tại số 178 đường Âu Cơ.",
  },
  {
    alias: "ubnd phường hòa khánh bắc",
    targetCardId: "place-trung-tam-hanh-chinh-lien-chieu",
    currentName: "Trung tâm Hành chính Phường Liên Chiểu mới",
    currentAddress: "68 đường Lạc Long Quân, phường Liên Chiểu",
    isWithinNewLienChieu: true,
    historicalNotice:
      "Theo NQ 1659/NQ-UBTVQH15, UBND phường Hòa Khánh Bắc cũ nay chuyển giao toàn bộ chức năng về Trung tâm Hành chính Phường Liên Chiểu.",
    actionGuidance: "Bộ phận Một cửa tiếp nhận tại số 68 đường Lạc Long Quân.",
  },
  {
    alias: "hòa khánh bắc",
    targetCardId: "place-trung-tam-hanh-chinh-lien-chieu",
    currentName: "Phường Liên Chiểu mới",
    currentAddress: "68 đường Lạc Long Quân, phường Liên Chiểu",
    isWithinNewLienChieu: true,
    historicalNotice:
      "Theo NQ 1659/NQ-UBTVQH15, toàn bộ phường Hòa Khánh Bắc cũ đã được hợp nhất thành Phường Liên Chiểu mới.",
    actionGuidance: "Mọi thủ tục hành chính nộp tại Trung tâm Hành chính Phường Liên Chiểu (68 Lạc Long Quân).",
  },
  {
    alias: "nam ô",
    currentName: "Phường Hải Vân mới",
    isWithinNewLienChieu: false,
    historicalNotice:
      "Làng nghề Nam Ô và phường Hòa Hiệp Nam cũ nay thuộc địa phận Phường Hải Vân mới theo NQ 1659.",
    actionGuidance: "Liên hệ UBND Phường Hải Vân để giải quyết các thủ tục liên quan đến khu vực Nam Ô.",
  },
  {
    alias: "ký túc xá tập trung phía tây",
    currentName: "Phường Hòa Khánh mới",
    currentAddress: "08 đường Hà Văn Tính",
    isWithinNewLienChieu: false,
    historicalNotice:
      "KTX tập trung phía Tây (số 08 Hà Văn Tính) thuộc phường Hòa Khánh Nam cũ, nay thuộc địa phận Phường Hòa Khánh mới.",
    actionGuidance: "Sinh viên cư trú tại KTX phía Tây liên hệ Công an Phường Hòa Khánh mới để làm thủ tục tạm trú.",
  },
  {
    alias: "ktx phía tây",
    currentName: "Phường Hòa Khánh mới",
    currentAddress: "08 đường Hà Văn Tính",
    isWithinNewLienChieu: false,
    historicalNotice:
      "KTX phía Tây nay thuộc địa phận Phường Hòa Khánh mới, không thuộc địa giới Phường Liên Chiểu mới.",
    actionGuidance: "Sinh viên liên hệ Ban quản trị KTX hoặc Công an Phường Hòa Khánh.",
  },
];

// Sắp xếp ưu tiên các alias cụ thể dài hơn lên trước
export const HISTORICAL_ENTITY_MAP: HistoricalEntityMapping[] = [...RAW_HISTORICAL_MAP].sort(
  (a, b) => b.alias.length - a.alias.length
);

/**
 * Phân tích và đối khớp thực thể lịch sử từ câu truy vấn
 */
export function resolveHistoricalEntities(query: string): HistoricalResolutionResult {
  if (!query || typeof query !== "string") {
    return {
      hasHistoricalMatch: false,
      matchedEntities: [],
      suggestedCardIds: [],
    };
  }

  const lowerQuery = query.toLowerCase().trim();
  const matchedEntities: HistoricalEntityMapping[] = [];
  const suggestedCardIds: string[] = [];

  for (const item of HISTORICAL_ENTITY_MAP) {
    if (lowerQuery.includes(item.alias)) {
      matchedEntities.push(item);
      if (item.targetCardId && !suggestedCardIds.includes(item.targetCardId)) {
        suggestedCardIds.push(item.targetCardId);
      }
    }
  }

  let primaryNotice: string | undefined;
  if (matchedEntities.length > 0) {
    const first = matchedEntities[0];
    primaryNotice = first.historicalNotice;
    if (first.actionGuidance) {
      primaryNotice += ` → ${first.actionGuidance}`;
    }
  }

  return {
    hasHistoricalMatch: matchedEntities.length > 0,
    matchedEntities,
    primaryNotice,
    suggestedCardIds,
  };
}
