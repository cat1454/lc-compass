/**
 * File cấu hình kiểm soát tập trung toàn bộ tính năng và thành phần giao diện Trang chủ (Home)
 * Cho phép bật/tắt (enabled) hoặc điều chỉnh giới hạn (limit) hiển thị theo nhu cầu mà không cần sửa logic code.
 */

export interface HomeFeaturesConfig {
  /** Thanh trạng thái phê duyệt dữ liệu & Nút chuyển đổi Chế độ Chữ to (Aa) */
  topBarStatus: {
    enabled: boolean;
  };

  /** Lời chào thân thiện và badge Cẩm nang số Phường Liên Chiểu 2026 */
  heroGreeting: {
    enabled: boolean;
  };

  /** Lưới 6 ô lối tắt nhu cầu hàng ngày (Bấm là có) */
  quickActions: {
    enabled: boolean;
    limit: number;
  };

  /**
   * Khối 3 nhu cầu lớn ("Tôi cần làm việc", "Tôi mới đến", "Tôi muốn khám phá")
   * Khuyên dùng: Tắt (false) trên trang chủ để tránh trùng lặp nhận thức với 6 ô Lối tắt ở trên.
   */
  threeCoreNeeds: {
    enabled: boolean;
  };

  /** Khu vực tìm kiếm, gợi ý nhanh và danh sách thẻ thông tin */
  cardSearchAndListing: {
    enabled: boolean;
    /** Số lượng thẻ tối đa hiển thị mặc định trên trang chủ (tránh bung 24 thẻ làm trang dài 5.000px) */
    defaultLimit: number;
    /** Hiển thị nút dẫn sang trang đầy đủ (/services, /places) */
    showViewAllButton: boolean;
  };

  /** Khối hỗ trợ trực tiếp người dân: Hotline 1022 & Bộ phận Một cửa (hỗ trợ người cao tuổi) */
  supportHotline: {
    enabled: boolean;
  };

  /**
   * Hộp nghiên cứu mở rộng (External Research Box)
   * Khuyên dùng: Tắt (false) ở trang chủ để chống quá tải nhận thức, bật ở trang Thủ tục hành chính.
   */
  externalResearchBox: {
    enabled: boolean;
  };

  /** Thanh banner định vị vai trò Tiền hành chính & cầu nối Zalo DVC */
  strategyBanner: {
    enabled: boolean;
  };

  /** Khối Nhịp đập Liên Chiểu hôm nay (Dữ liệu sống thực địa tuần này) */
  livingPulse: {
    enabled: boolean;
  };
}

export const HOME_FEATURES_CONFIG: HomeFeaturesConfig = {
  topBarStatus: {
    enabled: true,
  },
  heroGreeting: {
    enabled: true,
  },
  strategyBanner: {
    enabled: false,
  },
  quickActions: {
    enabled: true,
    limit: 6,
  },
  livingPulse: {
    enabled: true,
  },
  threeCoreNeeds: {
    enabled: true, // Ba nhóm nhu cầu phục vụ cộng đồng
  },
  cardSearchAndListing: {
    enabled: true,
    defaultLimit: 3, // Giới hạn 3 thẻ tiêu biểu nhất khi chưa tìm kiếm
    showViewAllButton: true,
  },
  supportHotline: {
    enabled: false,
  },
  externalResearchBox: {
    enabled: false, // Đã tắt trên trang chủ để chống overload
  },
};
