"use client";

import { useMemo } from "react";
import { PublicCardDTO } from "../contracts/card";
import { HOME_FEATURES_CONFIG } from "../config/home-features.config";
import { ExternalResearchBox } from "./ExternalResearchBox";
import { QuickActionGrid } from "./QuickActionGrid";
import { HomeCardSearchSection } from "./home/HomeCardSearchSection";
import { HomeHeroGreeting } from "./home/HomeHeroGreeting";
import { HomeSupportHotline } from "./home/HomeSupportHotline";
import { HomeThreeCoreNeeds } from "./home/HomeThreeCoreNeeds";
import { HomeStrategyBanner } from "./home/HomeStrategyBanner";
import { HomeLivingPulse } from "./home/HomeLivingPulse";
import { useLargeText } from "./ReadingPreferences";

interface HomeClientProps {
  initialCards: PublicCardDTO[];
}

/**
 * Trang chủ LC Compass được cấu trúc module hóa và kiểm soát 100% bằng file cấu hình:
 * src/config/home-features.config.ts
 *
 * Cho phép bật/tắt hoặc điều chỉnh số lượng hiển thị các khối để chống quá tải (overload)
 * và giữ cho trang gọn gàng, thân thiện với người dân và thanh niên.
 */
export function HomeClient({ initialCards }: HomeClientProps) {
  const isLargeText = useLargeText();

  // Kiểm tra tính hiệu lực tại thời điểm truy cập (Access-time validation)
  const validCardsAtAccess = useMemo(() => {
    const nowTime = Date.now();
    return initialCards.filter((c) => {
      if (!c.review.reviewDue) return true;
      const due = new Date(`${c.review.reviewDue}T23:59:59+07:00`).getTime();
      return isNaN(due) || nowTime <= due;
    });
  }, [initialCards]);

  return (
    <div className={`responsive-container py-6 space-y-7 ${isLargeText ? "text-lg" : "text-base"}`}>
      {/* Lời chào thân thiện & Tiêu đề */}
      {HOME_FEATURES_CONFIG.heroGreeting.enabled && (
        <HomeHeroGreeting isLargeText={isLargeText} />
      )}

      {/* 2. Banner Định vị Chiến lược: Khâu Tiền Hành Chính & Cầu nối Cổng DVC / Zalo */}
      {HOME_FEATURES_CONFIG.strategyBanner?.enabled && (
        <HomeStrategyBanner isLargeText={isLargeText} />
      )}

      {/* 3. Lưới 6 ô lối tắt nhu cầu hàng ngày (Bấm là có) */}
      {HOME_FEATURES_CONFIG.quickActions.enabled && (
        <QuickActionGrid isLargeText={isLargeText} />
      )}

      {/* 4. Nhịp đập Liên Chiểu hôm nay (Dữ liệu sống thực địa tuần này) */}
      {HOME_FEATURES_CONFIG.livingPulse?.enabled && (
        <HomeLivingPulse isLargeText={isLargeText} />
      )}

      {/* 5. Khối 3 nhu cầu lớn */}
      {HOME_FEATURES_CONFIG.threeCoreNeeds.enabled && (
        <HomeThreeCoreNeeds isLargeText={isLargeText} />
      )}

      {/* 6. Khối tìm kiếm & Danh sách thẻ giới hạn tinh gọn (Mặc định 3 thẻ tiêu biểu) */}
      {HOME_FEATURES_CONFIG.cardSearchAndListing.enabled && (
        <HomeCardSearchSection
          cards={validCardsAtAccess}
          isLargeText={isLargeText}
          defaultLimit={HOME_FEATURES_CONFIG.cardSearchAndListing.defaultLimit}
          showViewAllButton={HOME_FEATURES_CONFIG.cardSearchAndListing.showViewAllButton}
        />
      )}

      {/* 7. Khối hỗ trợ người cao tuổi / Hotline 1022 & Một cửa */}
      {HOME_FEATURES_CONFIG.supportHotline.enabled && (
        <HomeSupportHotline isLargeText={isLargeText} />
      )}

      {/* 8. Hộp nghiên cứu mở rộng (Mặc định tắt ở trang chủ để tránh overload) */}
      {HOME_FEATURES_CONFIG.externalResearchBox.enabled && (
        <ExternalResearchBox />
      )}
    </div>
  );
}
