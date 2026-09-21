/**
 * Bộ Lọc & Bảo Vệ Dữ Liệu Cá Nhân Phía Client (Client-Side PII Sanitizer & Privacy Shield)
 * Trực tiếp ngăn ngừa nguy cơ "Oversharing": tự động phát hiện và che giấu CCCD (12 số),
 * Số điện thoại (10 số), đảm bảo không đẩy dữ liệu nhạy cảm của người dân ra ngoài.
 */

export interface PIIDetection {
  type: "cccd" | "phone" | "email";
  raw: string;
  masked: string;
}

export interface PIISanitizerResult {
  originalText: string;
  sanitizedText: string;
  detections: PIIDetection[];
  hasPII: boolean;
  privacyNotice?: string;
}

// Regex cho CCCD Việt Nam (12 chữ số liên tiếp)
const CCCD_REGEX = /\b\d{12}\b/g;

// Regex cho số điện thoại di động Việt Nam (10 chữ số bắt đầu bằng 03, 05, 07, 08, 09)
const PHONE_REGEX = /\b(0(?:3|5|7|8|9)\d{8})\b/g;

// Regex cho email
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

/**
 * Che giấu chuỗi CCCD (giữ 3 số đầu, ẩn các số còn lại)
 */
export function maskCCCD(cccd: string): string {
  if (cccd.length !== 12) return "************";
  return `${cccd.slice(0, 3)}*********`;
}

/**
 * Che giấu số điện thoại (giữ 3 số đầu và 2 số cuối)
 */
export function maskPhone(phone: string): string {
  if (phone.length < 10) return "**********";
  return `${phone.slice(0, 3)}*****${phone.slice(-2)}`;
}

/**
 * Che giấu email (giữ ký tự đầu và tên miền)
 */
export function maskEmail(email: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) return "***@***";
  const name = parts[0];
  const domain = parts[1];
  const visibleName = name.length > 2 ? `${name.slice(0, 2)}***` : "***";
  return `${visibleName}@${domain}`;
}

/**
 * Quét và che giấu dữ liệu định danh cá nhân nhạy cảm
 */
export function sanitizePII(text: string): PIISanitizerResult {
  if (!text || typeof text !== "string") {
    return {
      originalText: "",
      sanitizedText: "",
      detections: [],
      hasPII: false,
    };
  }

  const detections: PIIDetection[] = [];
  let sanitized = text;

  // 1. Quét CCCD
  sanitized = sanitized.replace(CCCD_REGEX, (match) => {
    const masked = maskCCCD(match);
    detections.push({ type: "cccd", raw: match, masked });
    return masked;
  });

  // 2. Quét Số điện thoại
  sanitized = sanitized.replace(PHONE_REGEX, (match) => {
    const masked = maskPhone(match);
    detections.push({ type: "phone", raw: match, masked });
    return masked;
  });

  // 3. Quét Email
  sanitized = sanitized.replace(EMAIL_REGEX, (match) => {
    const masked = maskEmail(match);
    detections.push({ type: "email", raw: match, masked });
    return masked;
  });

  let privacyNotice: string | undefined;
  if (detections.length > 0) {
    const types = detections.map((d) =>
      d.type === "cccd" ? "Số Căn cước (CCCD)" : d.type === "phone" ? "Số điện thoại" : "Email"
    );
    const uniqueTypes = Array.from(new Set(types));
    privacyNotice = `Đã che chắn thông tin cá nhân (${uniqueTypes.join(", ")}) cục bộ trên máy. LC Compass không lưu trữ hoặc gửi thông tin định danh của bạn ra máy chủ bên ngoài.`;
  }

  return {
    originalText: text,
    sanitizedText: sanitized,
    detections,
    hasPII: detections.length > 0,
    privacyNotice,
  };
}
