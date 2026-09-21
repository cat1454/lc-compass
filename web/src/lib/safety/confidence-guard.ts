/**
 * Cơ Chế Phòng Chống Ảo Giác AI & Đảm Bảo Trách Nhiệm Giải Trình Pháp Lý (Human-in-the-Loop & Confidence Guard)
 * Khi độ tự tin của câu trả lời dưới 90% hoặc yêu cầu pháp lý phức tạp chưa được chuyên viên rà soát,
 * hệ thống tuân thủ nguyên tắc FAIL-CLOSED: Dừng suy đoán, kích hoạt chuyển giao trực tiếp đến
 * Cán bộ Một cửa hoặc Tổng đài Dịch vụ công 1022.
 */

export interface ConfidenceEvaluation {
  confidenceScore: number; // 0 - 100
  isAboveThreshold: boolean;
  requiresHumanHandover: boolean;
  handoverReason?: string;
  officialContacts: {
    name: string;
    phone: string;
    address: string;
    workingHours: string;
  };
}

export const CONFIDENCE_THRESHOLD = 90; // 90% minimum threshold

export const OFFICIAL_WARD_CONTACTS = {
  name: "Bộ phận Tiếp nhận và Trả kết quả (Một cửa) Phường Liên Chiểu",
  phone: "0236 1022",
  directHotline: "0236 3842 113",
  address: "68 đường Lạc Long Quân, phường Liên Chiểu, TP. Đà Nẵng",
  workingHours: "Thứ 2 đến Thứ 6 (Sáng 7h30 - 11h30, Chiều 13h30 - 17h00)",
};

/**
 * Đánh giá độ tin cậy của kết quả tra cứu
 * @param topScore Điểm số của thẻ khớp tốt nhất
 * @param hasExactMatch Khớp chính xác cả cụm từ khóa có nguồn
 * @param isVerified Thẻ đã được cán bộ có thẩm quyền rà soát chính thức
 */
export function evaluateResultConfidence(
  topScore: number,
  hasExactMatch: boolean,
  isVerified: boolean = false
): ConfidenceEvaluation {
  let confidenceScore = 0;

  if (hasExactMatch) {
    confidenceScore = isVerified ? 98 : 88;
  } else if (topScore >= 100) {
    confidenceScore = isVerified ? 92 : 82;
  } else if (topScore >= 50) {
    confidenceScore = 70;
  } else if (topScore > 0) {
    confidenceScore = 45;
  } else {
    confidenceScore = 0;
  }

  const isAboveThreshold = confidenceScore >= CONFIDENCE_THRESHOLD;
  const requiresHumanHandover = !isAboveThreshold;

  let handoverReason: string | undefined;
  if (requiresHumanHandover) {
    if (confidenceScore === 0) {
      handoverReason =
        "Không tìm thấy thủ tục trùng khớp với nguồn đã kiểm chứng. Để tránh sai sót pháp lý, vui lòng liên hệ trực tiếp Bộ phận Một cửa hoặc Tổng đài 1022.";
    } else if (confidenceScore < 80) {
      handoverReason =
        "Thông tin có độ tương đồng thấp. Quy trình hành chính cần độ chuẩn xác 100%, khuyến nghị liên hệ Cán bộ chuyên môn để được đối soát hồ sơ.";
    } else {
      handoverReason =
        "Dữ liệu đang trong giai đoạn chờ cán bộ tư pháp - hộ tịch ký duyệt chính thức. Bạn có thể tham khảo hoặc gọi Tổng đài 1022 để xác nhận.";
    }
  }

  return {
    confidenceScore,
    isAboveThreshold,
    requiresHumanHandover,
    handoverReason,
    officialContacts: OFFICIAL_WARD_CONTACTS,
  };
}
