"use client";

import { useUrlFilters } from "../../lib/use-url-filters";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import {
  ArrowRight,
  Compass,
  FileText,
  HeartPulse,
  Home,
  Landmark,
  Layers,
  MapPin,
  Search,
  ShoppingBag,
  Sparkles,
  X,
  Shield,
  GraduationCap,
  History,
  MessageSquareQuote,
} from "lucide-react";
import { PublicCardDTO } from "../../contracts/card";
import { searchCatalog } from "../../lib/navigation/search";
import { CardItem } from "../CardItem";
import { VoiceInputButton } from "../multimodal/VoiceInputButton";
import { EmergencyBanner } from "../EmergencyBanner";
import { ConfidenceNotice } from "../safety/ConfidenceNotice";
import { sanitizePII } from "../../lib/safety/pii-sanitizer";
import { EdgeCaseGuidanceCard } from "../EdgeCaseGuidanceCard";
import { UnknownCaseFeedbackCard } from "../UnknownCaseFeedbackCard";

interface HomeCardSearchSectionProps {
  cards: PublicCardDTO[];
  isLargeText: boolean;
  defaultLimit?: number;
  showViewAllButton?: boolean;
}

export function HomeCardSearchSection({
  cards,
  isLargeText,
  defaultLimit = 3,
  showViewAllButton = true,
}: HomeCardSearchSectionProps) {
  const { params, update } = useUrlFilters();
  const searchQuery = params.get("search") || "";
  const rawType = params.get("type") || "ALL";
  const selectedType = ["SERVICE", "PLACE", "DISCOVER"].includes(rawType) ? rawType : "ALL";
  const setSearchQuery = (search: string) => update({ search });
  const setSelectedType = (type: string) => update({ type });
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUnknownHelp, setShowUnknownHelp] = useState(false);

  // 1. Kiểm tra an toàn PII phía Client
  const piiCheck = useMemo(() => sanitizePII(searchQuery), [searchQuery]);

  // 2. Tìm kiếm thời gian thực (tích hợp phương ngữ, sửa lỗi gõ, thực thể lịch sử)
  const searchResult = useMemo(
    () => searchCatalog(searchQuery, cards),
    [searchQuery, cards]
  );

  // 3. Lọc theo loại thẻ
  const filteredCards =
    selectedType === "ALL"
      ? searchResult.results
      : searchResult.results.filter((c) => c.type === selectedType);

  const serviceCount = searchResult.results.filter((c) => c.type === "SERVICE").length;
  const placeCount = searchResult.results.filter((c) => c.type === "PLACE").length;
  const discoverCount = searchResult.results.filter((c) => c.type === "DISCOVER").length;

  const quickSearchChips = [
    { label: "Đăng ký tạm trú", query: "đăng ký tạm trú", icon: <Home className="w-3.5 h-3.5" /> },
    { label: "Không có hợp đồng", query: "thuê trọ không có hợp đồng", icon: <Home className="w-3.5 h-3.5 text-indigo-600" /> },
    { label: "Công nhân làm ca", query: "công nhân làm ca kíp", icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> },
    { label: "Tránh bão ngập lụt", query: "sơ tán bão ngập lụt", icon: <Shield className="w-3.5 h-3.5 text-red-600" /> },
    { label: "Chuyển trường", query: "chuyển trường", icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { label: "BHYT hộ gia đình", query: "bhyt", icon: <HeartPulse className="w-3.5 h-3.5" /> },
    { label: "Một cửa (68 Lạc Long Quân)", query: "một cửa", icon: <Landmark className="w-3.5 h-3.5" /> },
    { label: "Trạm Y tế (178 Âu Cơ)", query: "trạm y tế", icon: <HeartPulse className="w-3.5 h-3.5" /> },
    { label: "Tiếng Quảng: Bữa ni mần tạm trú ở mô rứa", query: "Bữa ni mần tạm trú ở mô rứa", icon: <MessageSquareQuote className="w-3.5 h-3.5 text-blue-600" /> },
  ];

  const isSearching = searchQuery.trim().length > 0;
  const displayedCards =
    isSearching || isExpanded
      ? filteredCards
      : filteredCards.slice(0, defaultLimit);

  const hasHiddenCards = !isSearching && !isExpanded && filteredCards.length > defaultLimit;

  return (
    <section
      id="tra-cuu"
      className="liquid-glass-card border border-slate-200/90 rounded-xl p-4 sm:p-6 shadow-xs space-y-4"
      aria-label="Tra cứu thẻ hướng dẫn và thông tin"
    >
      {/* Banner Khẩn cấp (khi phát hiện từ khóa nguy cấp) */}
      {searchResult.emergency && (
        <EmergencyBanner emergency={searchResult.emergency} />
      )}

      {/* Cảnh báo Che chắn PII phía Client */}
      {piiCheck.hasPII && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs sm:text-sm">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Bảo vệ dữ liệu cá nhân:</strong> {piiCheck.privacyNotice}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2
          className={`font-bold text-slate-900 flex items-center gap-2 ${
            isLargeText ? "text-xl" : "text-base sm:text-lg"
          }`}
        >
          <Search className="w-5 h-5 text-teal-600" />
          <span>Tra cứu thẻ hướng dẫn và thông tin</span>
        </h2>
        <div className="text-xs text-slate-500 font-medium">
          Hỗ trợ giọng nói 🎙️ · Tiếng Quảng Nam - Đà Nẵng · Sửa lỗi chính tả
        </div>
      </div>

      {/* Ô nhập tìm kiếm lớn có tích hợp nút Micro thu âm giọng nói */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm thủ tục, nơi đến, hoặc hỏi: 'Bữa ni làm tạm trú ở mô rứa'..."
            style={{ fontSize: isLargeText ? "18px" : "16px" }}
            className="touch-target w-full pl-12 pr-10 py-3 bg-white/90 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all shadow-2xs"
            aria-label="Nhập từ khóa tìm kiếm hoặc nói bằng giọng nói"
            aria-describedby="search-guidance"
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"
            aria-hidden="true"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 touch-target p-1.5 text-slate-400 hover:text-slate-600"
              aria-label="Xóa từ khóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Nút Micro thu âm giọng nói dành cho người lớn tuổi */}
        <VoiceInputButton
          onTranscript={(text) => setSearchQuery(text)}
          className="shrink-0 shadow-2xs"
        />
      </div>

      <p id="search-guidance" className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        Bạn chưa biết tên thủ tục? Hãy viết việc mình cần làm, chẳng hạn “mới chuyển đến thuê trọ” hoặc “tìm trạm y tế”.
      </p>

      {/* Thông báo Thực thể Lịch sử & Sáp nhập địa giới NQ 1659 */}
      {searchResult.historicalNotice && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs sm:text-sm">
          <History className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Định tuyến thực thể lịch sử:</span>{" "}
            {searchResult.historicalNotice}
          </div>
        </div>
      )}

      {/* Thông báo Chuẩn hóa Phương ngữ & Sửa lỗi gõ */}
      {searchResult.userFacingExplanation && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50/80 border border-teal-200 text-teal-900 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>{searchResult.userFacingExplanation}</span>
        </div>
      )}

      {/* Hướng dẫn tháo gỡ điểm biên dân sinh đặc thù (Edge Cases Guidance) */}
      {searchResult.edgeCases && searchResult.edgeCases.length > 0 && (
        <div className="space-y-3 pt-1">
          {searchResult.edgeCases.map((guidance) => (
            <EdgeCaseGuidanceCard key={guidance.id} guidance={guidance} />
          ))}
        </div>
      )}

      {/* Chip gợi ý bấm nhanh 1-chạm (Chống Cognitive Load) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1 sm:flex-wrap">
        <span className="text-xs text-slate-500 font-semibold shrink-0">1-Chạm:</span>
        {quickSearchChips.map((chip) => (
          <button
            key={chip.query}
            type="button"
            onClick={() => setSearchQuery(chip.query)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-teal-50 hover:text-teal-800 text-slate-700 text-xs sm:text-sm font-bold transition-colors border border-slate-200 active:scale-95 shadow-2xs shrink-0 whitespace-nowrap"
          >
            {chip.icon}
            <span>{chip.label}</span>
          </button>
        ))}
      </div>

      {/* Bộ lọc loại thẻ */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 -mx-1 px-1 sm:flex-wrap border-t border-slate-100">
        <button
          type="button"
          onClick={() => setSelectedType("ALL")}
          className={`touch-target inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all shrink-0 whitespace-nowrap ${
            selectedType === "ALL"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white/90 text-slate-600 hover:bg-white border border-slate-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Tất cả ({searchResult.results.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedType("SERVICE")}
          className={`touch-target inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all shrink-0 whitespace-nowrap ${
            selectedType === "SERVICE"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Thủ tục ({serviceCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedType("PLACE")}
          className={`touch-target inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all shrink-0 whitespace-nowrap ${
            selectedType === "PLACE"
              ? "bg-teal-600 text-white shadow-xs"
              : "bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Địa điểm ({placeCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedType("DISCOVER")}
          className={`touch-target inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all shrink-0 whitespace-nowrap ${
            selectedType === "DISCOVER"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Khám phá ({discoverCount})</span>
        </button>
      </div>

      {/* Đánh giá Ngưỡng tin cậy & Human-in-the-loop */}
      {isSearching && searchResult.confidence && (
        <ConfidenceNotice confidence={searchResult.confidence} />
      )}

      {/* Tiêu đề trạng thái hiển thị */}
      {!isSearching && (
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-medium">
          <div className="flex items-center gap-1.5 text-teal-800 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Thủ tục &amp; Tiện ích nổi bật</span>
          </div>
          {hasHiddenCards && (
            <span>Đang hiển thị {displayedCards.length} / {filteredCards.length} thẻ</span>
          )}
        </div>
      )}

      {displayedCards.length > 0 && (
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Khi xem thẻ, hãy kiểm tra nguồn, ngày rà soát và đối chiếu hoàn cảnh của mình trước khi thực hiện.
        </p>
      )}

      {/* Kết quả hiển thị thẻ */}
      {displayedCards.length > 0 ? (
        <div className="space-y-4">
          <div className="responsive-cards">
            {displayedCards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>

          {/* Thanh điều hướng tinh gọn khi có thẻ bị ẩn */}
          {hasHiddenCards && showViewAllButton && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-teal-50/70 border border-teal-200/80">
              <div className="text-xs text-slate-600 font-medium text-center sm:text-left">
                Còn <strong className="text-teal-900">{filteredCards.length - defaultLimit} thẻ thông tin</strong> khác đã được thẩm định.
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs transition-colors"
                >
                  Mở rộng tại đây
                </button>
                <Link
                  href="/services"
                  className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-2xs transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Xem tất cả danh mục</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {isExpanded && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Thu gọn danh sách thẻ ↑
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 sm:p-6 rounded-xl bg-white/80 border border-slate-200 text-center space-y-2">
            <Compass className="w-8 h-8 text-slate-400 mx-auto" aria-hidden="true" />
            <div className="font-bold text-slate-800 text-base">
              {cards.length === 0
                ? "Chưa có nội dung được phát hành"
                : searchQuery
                ? `Không có thẻ thông tin phù hợp với từ khóa "${searchQuery}"`
                : "Không có thẻ phù hợp với bộ lọc"}
            </div>
            <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
              Bạn có thể thử từ khóa ngắn hơn, bỏ bộ lọc hoặc in câu hỏi để mang theo khi nhờ hỗ trợ.
            </p>
          </div>

          {searchQuery && (
            <UnknownCaseFeedbackCard
              searchQuery={searchQuery}
              onClearSearch={() => update({ search: "", type: "ALL" })}
            />
          )}
        </div>
      )}

      {/* Tùy chọn mở trợ giúp cho tình huống đặc thù / điểm biên chưa biết */}
      {showUnknownHelp && (
        <div className="pt-2">
          <UnknownCaseFeedbackCard
            searchQuery={searchQuery || "Tình huống dân sinh đặc thù cần hướng dẫn"}
            onClearSearch={() => setShowUnknownHelp(false)}
          />
        </div>
      )}

      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <Link
          className="touch-target inline-flex items-center gap-1.5 text-teal-800 hover:text-teal-950 font-bold underline transition-colors"
          href={`/places?search=${encodeURIComponent(searchQuery)}`}
        >
          <span>Tìm từ khóa này trong danh bạ tiện ích ({searchQuery ? `"${searchQuery}"` : "tất cả"})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <button
          type="button"
          onClick={() => setShowUnknownHelp(!showUnknownHelp)}
          className="text-purple-700 hover:text-purple-900 font-bold underline transition-colors flex items-center gap-1"
        >
          <span>{showUnknownHelp ? "Đóng phiếu trợ giúp tình huống đặc thù ↑" : "Gặp tình huống đặc thù chưa có trên hệ thống? Bấm vào đây ↓"}</span>
        </button>
      </div>
    </section>
  );
}
