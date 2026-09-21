import { ACTION_TEXT, DISCOVERY_IDS, MVP_IDS, PLACE_IDS, RESIDENCE_IDS } from "./constants";
import { ActionType, NavigationDecideInput, NavigationResult, OutputType, StressFlag } from "./types";

/**
 * Hàm quyết định điều hướng thuần túy cho LC Compass
 * Ported 1-1 từ hàm decide() trong design/compass/simulate.py
 */
export function decideRoute(input: NavigationDecideInput): NavigationResult {
  const { intentId, profileMode, flags: rawFlags, supportedIntentIds = MVP_IDS } = input;
  const flags = rawFlags instanceof Set ? rawFlags : new Set<StressFlag>(rawFlags);

  let action: ActionType;
  let reason: string;

  // Thứ tự ưu tiên toàn cục (Global handling order)
  if (flags.has("urgent")) {
    action = "URGENT_HELP";
    reason = "Nguy cơ tức thời được ưu tiên hơn hành trình thủ tục.";
  } else if (flags.has("sensitive")) {
    action = "REMOVE_SENSITIVE";
    reason = "Đầu vào nhạy cảm không cần thiết cho nhiệm vụ chuẩn bị.";
  } else if (flags.has("unknown_area")) {
    action = "ASK_AREA";
    reason = "Chưa xác định địa bàn thì không áp nội dung địa phương.";
  } else if (flags.has("outside")) {
    action = "OUTSIDE";
    reason = "Phạm vi hướng dẫn phụ thuộc địa bàn được xác nhận.";
  } else if (!supportedIntentIds.has(intentId)) {
    action = "OFFICIAL_REDIRECT";
    reason = "Nhu cầu này chưa nằm trong gói nội dung thí điểm.";
  } else if (
    profileMode === "proxy_no" &&
    !intentId.startsWith("dia_diem-") &&
    !intentId.startsWith("van_hoa-")
  ) {
    action = "GENERAL_ONLY";
    reason = "Chưa có sự đồng ý để cá nhân hóa hoặc chia sẻ cho người được hỗ trợ.";
  } else if (flags.has("stale") || flags.has("conflict")) {
    action = "REVIEW_SOURCE";
    reason = "Nguồn không đạt điều kiện phát hành hướng dẫn chi tiết.";
  } else if (flags.has("offline")) {
    action = "OFFLINE_VIEW";
    reason = "Có thể xem lại phiếu, nhưng không thể xác minh tính mới khi mất mạng.";
  } else if (flags.has("missing_fact")) {
    action = "ASK_FACT";
    reason = "Thiếu thông tin để chọn nhánh; cần làm rõ trước.";
  } else if (profileMode === "language") {
    action = "LANGUAGE_HELP";
    reason = "Khả năng hiểu nội dung phải được bảo đảm trước khi tự thực hiện.";
  } else {
    action = "PREPARE";
    reason = "Nhu cầu trong phạm vi, điều kiện mô hình đã rõ và nội dung mô hình đã duyệt.";
  }

  const outputType: OutputType = RESIDENCE_IDS.has(intentId)
    ? "SERVICE"
    : PLACE_IDS.has(intentId)
    ? "PLACE"
    : DISCOVERY_IDS.has(intentId)
    ? "DISCOVER"
    : "OUT_OF_SCOPE";

  let actionText = ACTION_TEXT[action];
  if (action === "PREPARE" && outputType === "PLACE") {
    actionText =
      "Hiển thị thẻ địa điểm đã duyệt, chức năng phục vụ, nguồn, ngày rà soát; chỉ đường bằng ứng dụng bản đồ ngoài.";
  } else if (action === "PREPARE" && outputType === "DISCOVER") {
    actionText =
      "Hiển thị thẻ khám phá đã biên tập, câu chuyện có nguồn và nơi tham khảo; không sinh tour hoặc giờ mở cửa.";
  }

  let targetCardIds: string[] = [];
  if (action === "PREPARE" || action === "GENERAL_ONLY" || action === "OFFLINE_VIEW") {
    if (outputType === "SERVICE") {
      targetCardIds = ["service-tam-tru-lc"];
    } else if (outputType === "PLACE") {
      targetCardIds = [
        "place-ca-lienchieu",
        "place-ubnd-lienchieu",
        "place-tyt-lienchieu",
        "place-hotro-so",
        "place-to-tuquan-32",
      ];
    } else if (outputType === "DISCOVER") {
      targetCardIds = ["discover-dinh-hoamy", "discover-lang-nghe-note"];
    }
  }

  return {
    action,
    reason,
    actionText,
    outputType,
    targetCardIds,
  };
}
