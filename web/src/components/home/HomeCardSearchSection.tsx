"use client";

import { useUrlFilters } from "../../lib/use-url-filters";
import Image from "next/image";
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
  const selectedType = ["SERVICE", "PLACE", "DISCOVER"].includes(rawType)
    ? rawType
    : "ALL";
  const setSearchQuery = (search: string) => update({ search });
  const setSelectedType = (type: string) => update({ type });
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUnknownHelp, setShowUnknownHelp] = useState(false);

  // 1. Kiểm tra an toàn PII phía Client
  const piiCheck = useMemo(() => sanitizePII(searchQuery), [searchQuery]);

  // 2. Tìm kiếm thời gian thực (tích hợp phương ngữ, sửa lỗi gõ, thực thể lịch sử)
  const searchResult = useMemo(
    () => searchCatalog(searchQuery, cards),
    [searchQuery, cards],
  );

  // 3. Lọc theo loại thẻ
  const filteredCards =
    selectedType === "ALL"
      ? searchResult.results
      : searchResult.results.filter((c) => c.type === selectedType);

  const serviceCount = searchResult.results.filter(
    (c) => c.type === "SERVICE",
  ).length;
  const placeCount = searchResult.results.filter(
    (c) => c.type === "PLACE",
  ).length;
  const discoverCount = searchResult.results.filter(
    (c) => c.type === "DISCOVER",
  ).length;

  const quickSearchChips = [
    {
      label: "Đăng ký tạm trú",
      query: "đăng ký tạm trú",
      icon: <Home className="w-3.5 h-3.5" />,
    },
    {
      label: "Không có hợp đồng",
      query: "thuê trọ không có hợp đồng",
      icon: <Home className="w-3.5 h-3.5 text-blue-600" />,
    },
    {
      label: "Công nhân làm ca",
      query: "công nhân làm ca kíp",
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-600" />,
    },
    {
      label: "Tránh bão ngập lụt",
      query: "sơ tán bão ngập lụt",
      icon: <Shield className="w-3.5 h-3.5 text-red-600" />,
    },
    {
      label: "Chuyển trường",
      query: "chuyển trường",
      icon: <GraduationCap className="w-3.5 h-3.5" />,
    },
    {
      label: "BHYT hộ gia đình",
      query: "bhyt",
      icon: <HeartPulse className="w-3.5 h-3.5 text-rose-600" />,
    },
    {
      label: "Một cửa",
      query: "một cửa",
      icon: <Landmark className="w-3.5 h-3.5" />,
    },
    {
      label: "Trạm Y tế",
      query: "trạm y tế",
      icon: <HeartPulse className="w-3.5 h-3.5 text-rose-600" />,
    },
    {
      label: "Tiếng Quảng: Làm tạm trú ở mô rứa",
      query: "Bữa ni mần tạm trú ở mô rứa",
      icon: <MessageSquareQuote className="w-3.5 h-3.5 text-teal-600" />,
    },
  ];

  const isSearching = searchQuery.trim().length > 0;
  const displayedCards =
    isSearching || isExpanded
      ? filteredCards
      : filteredCards.slice(0, defaultLimit);

  const hasHiddenCards =
    !isSearching && !isExpanded && filteredCards.length > defaultLimit;

  const dailyShortcuts = [
    {
      id: "services",
      title: "Thủ tục",
      subtitle: "Hướng dẫn & hồ sơ",
      icon: <FileText className="w-4 h-4 text-blue-600" />,
      href: "/services",
    },
    {
      id: "healthcare",
      title: "Y tế",
      subtitle: "Trạm xá & nhà thuốc",
      icon: <HeartPulse className="w-4 h-4 text-rose-600" />,
      href: "/places?category=healthcare",
    },
    {
      id: "market",
      title: "Mua sắm",
      subtitle: "Chợ & cửa hàng",
      icon: <ShoppingBag className="w-4 h-4 text-emerald-600" />,
      href: "/places?category=market",
    },
    {
      id: "community",
      title: "Hành chính",
      subtitle: "UBND & công an",
      icon: <Landmark className="w-4 h-4 text-amber-600" />,
      href: "/places?category=community",
    },
    {
      id: "discover",
      title: "Khám phá",
      subtitle: "Văn hóa & di sản",
      icon: <Compass className="w-4 h-4 text-indigo-600" />,
      href: "/discover",
    },
    {
      id: "education",
      title: "Trường học",
      subtitle: "Mầm non đến ĐH",
      icon: <GraduationCap className="w-4 h-4 text-teal-600" />,
      href: "/places?category=education",
    },
  ];

  return (
    <section
      id="tra-cuu"
      className="space-y-5"
      aria-label="Tra cứu thẻ hướng dẫn và thông tin"
    >
      {/* ========================================================================= */}
      {/* 1. HERO BANNER KHUNG TÌM KIẾM TRUNG TÂM PHONG CÁCH KHÁM PHÁ LIÊN CHIỂU   */}
      {/* ========================================================================= */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200/90 bg-slate-900">
        {/* Hình nền đồi núi / vịnh biển Liên Chiểu & dải gradient thiên nhiên mờ */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/scenic-danang.jpg"
            alt="Phong cảnh Vịnh biển Liên Chiểu và Đèo Hải Vân"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-[center_35%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-50/95 via-teal-50/90 to-emerald-50/80 sm:to-white/60" />
        </div>

        {/* Nội dung bên trong Hero Banner với padding rộng rãi (p-6 sm:p-8 md:p-10) */}
        <div className="relative z-10 p-6 sm:p-8 md:p-10 space-y-5 sm:space-y-6">
          {/* Cụm Text: Trái trên Desktop, căn giữa trên Mobile */}
          <div className="text-center sm:text-left space-y-1 sm:space-y-1.5 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
              Bạn cần tìm thông tin gì?
            </h2>
            <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed">
              Hỏi tự nhiên như đang trò chuyện. LC Compass sẽ giúp bạn tìm đúng thủ tục, địa điểm và tiện ích từ nguồn chính thống.
            </p>
          </div>

          {/* Thanh tìm kiếm khổng lồ (Giant Search Input) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const el = document.getElementById("ket-qua-tim-kiem");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="relative flex items-center bg-white rounded-full shadow-md hover:shadow-lg focus-within:shadow-xl focus-within:ring-2 focus-within:ring-blue-500/20 border border-slate-200/90 transition-all p-1.5 pl-4 sm:pl-5 gap-2 w-full max-w-3xl"
          >
            <Search
              className="w-5 h-5 text-slate-400 shrink-0 pointer-events-none"
              aria-hidden="true"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm thủ tục, giấy tờ, nơi đến (VD: 'tạm trú', 'ở mô rứa')..."
              style={{ fontSize: isLargeText ? "18px" : "16px" }}
              className="w-full py-2.5 pr-2 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm sm:text-base font-normal"
              aria-label="Nhập từ khóa tìm kiếm hoặc nói bằng giọng nói"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="touch-target w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Xóa từ khóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Icon Voice (Micro) 44x44px */}
            <VoiceInputButton
              onTranscript={(text) => setSearchQuery(text)}
              className="!rounded-full shrink-0 shadow-2xs w-11 h-11 min-w-[44px] min-h-[44px] border border-slate-200 hover:bg-slate-50 transition-transform active:scale-95"
            />

            {/* Nút Tìm kiếm tròn màu xanh lam (bg-blue-600) */}
            <button
              type="submit"
              className="w-11 h-11 min-w-[44px] min-h-[44px] bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-full font-bold transition-all flex items-center justify-center shrink-0 shadow-md cursor-pointer"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5 text-white stroke-[2.5]" />
            </button>
          </form>

          {/* Dải Gợi ý 1-Chạm (Quick Chips) - 1 dòng cuộn ngang mượt mà */}
          <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-1 -mx-1 px-1">
            <span className="text-xs text-slate-500 font-bold shrink-0 select-none pl-0.5">
              Gợi ý:
            </span>
            {quickSearchChips.map((chip) => (
              <button
                key={chip.query}
                type="button"
                onClick={() => setSearchQuery(chip.query)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold transition-all border border-slate-200/90 active:scale-95 shrink-0 whitespace-nowrap shadow-2xs backdrop-blur-sm"
              >
                {chip.icon}
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          {/* Khối Lối tắt nhu cầu hàng ngày dính liền mép dưới banner chính */}
          <div className="pt-3 sm:pt-4 border-t border-slate-200/70">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
              {dailyShortcuts.map((action) => (
                <Link
                  key={action.id}
                  href={action.href}
                  className="group flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl bg-white/90 hover:bg-white border border-slate-200/80 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all backdrop-blur-sm"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                    {action.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700 truncate transition-colors">
                      {action.title}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {action.subtitle}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

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

      {/* 2. Bộ lọc kết quả dạng Segmented Control gọn nhẹ */}
      <div id="ket-qua-tim-kiem" className="pt-1">
        <div className="inline-flex p-1 bg-slate-100/90 rounded-full border border-slate-200/80 max-w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] gap-1">
          <button
            type="button"
            onClick={() => setSelectedType("ALL")}
            className={`touch-target inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 whitespace-nowrap ${
              selectedType === "ALL"
                ? "bg-white text-blue-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Tất cả ({searchResult.results.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("SERVICE")}
            className={`touch-target inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 whitespace-nowrap ${
              selectedType === "SERVICE"
                ? "bg-white text-blue-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Thủ tục ({serviceCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("PLACE")}
            className={`touch-target inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 whitespace-nowrap ${
              selectedType === "PLACE"
                ? "bg-white text-blue-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>Địa điểm ({placeCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("DISCOVER")}
            className={`touch-target inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 whitespace-nowrap ${
              selectedType === "DISCOVER"
                ? "bg-white text-blue-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-amber-600" />
            <span>Khám phá ({discoverCount})</span>
          </button>
        </div>
      </div>

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

      {/* Đánh giá Ngưỡng tin cậy & Human-in-the-loop */}
      {isSearching && searchResult.confidence && (
        <ConfidenceNotice confidence={searchResult.confidence} />
      )}

      {/* Tiêu đề trạng thái hiển thị */}
      {!isSearching && (
        <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5 font-medium">
          <div className="flex items-center gap-1.5 text-blue-950 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Thủ tục &amp; Tiện ích nổi bật</span>
          </div>
          {hasHiddenCards && (
            <span>
              Đang hiển thị {displayedCards.length} / {filteredCards.length} thẻ
            </span>
          )}
        </div>
      )}

      {/* Kết quả hiển thị thẻ */}
      {displayedCards.length > 0 ? (
        <div className="space-y-4 pt-1">
          <div className="responsive-cards">
            {displayedCards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>

          {/* Thanh điều hướng tinh gọn khi có thẻ bị ẩn */}
          {hasHiddenCards && showViewAllButton && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-blue-50/70 border border-blue-200/80">
              <div className="text-xs text-slate-600 font-medium text-center sm:text-left">
                Còn{" "}
                <strong className="text-blue-900">
                  {filteredCards.length - defaultLimit} thẻ thông tin
                </strong>{" "}
                khác đã được thẩm định.
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
                  className="px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-2xs transition-colors inline-flex items-center gap-1.5"
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
        <div className="space-y-4 pt-1">
          <div className="p-4 sm:p-6 rounded-xl bg-white/80 border border-slate-200 text-center space-y-2">
            <Compass
              className="w-8 h-8 text-slate-400 mx-auto"
              aria-hidden="true"
            />
            <div className="font-bold text-slate-800 text-base">
              {cards.length === 0
                ? "Chưa có nội dung được phát hành"
                : searchQuery
                  ? `Không có thẻ thông tin phù hợp với từ khóa "${searchQuery}"`
                  : "Không có thẻ phù hợp với bộ lọc"}
            </div>
            <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
              Bạn có thể thử từ khóa ngắn hơn, bỏ bộ lọc hoặc in câu hỏi để mang
              theo khi nhờ hỗ trợ.
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
            searchQuery={
              searchQuery || "Tình huống dân sinh đặc thù cần hướng dẫn"
            }
            onClearSearch={() => setShowUnknownHelp(false)}
          />
        </div>
      )}

      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <Link
          className="touch-target inline-flex items-center gap-1.5 text-blue-800 hover:text-blue-950 font-bold underline transition-colors"
          href={`/places?search=${encodeURIComponent(searchQuery)}`}
        >
          <span>
            Tìm từ khóa này trong danh bạ tiện ích (
            {searchQuery ? `"${searchQuery}"` : "tất cả"})
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <button
          type="button"
          onClick={() => setShowUnknownHelp(!showUnknownHelp)}
          className="text-purple-700 hover:text-purple-900 font-bold underline transition-colors flex items-center gap-1"
        >
          <span>
            {showUnknownHelp
              ? "Đóng phiếu trợ giúp tình huống đặc thù ↑"
              : "Gặp tình huống đặc thù chưa có trên hệ thống? Bấm vào đây ↓"}
          </span>
        </button>
      </div>
    </section>
  );
}
