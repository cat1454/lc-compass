"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Search, ShieldCheck, FileText, MapPin, Compass } from "lucide-react";

interface ScenicBannerProps {
  onSearchSubmit?: (query: string) => void;
  defaultQuery?: string;
  quoteText?: string;
  showQuickActions?: boolean;
  placeholder?: string;
  searchDescription?: string;
}

export function ScenicBanner({
  onSearchSubmit,
  defaultQuery = "",
  showQuickActions = true,
  placeholder = "Tôi cần làm thủ tục tạm trú như thế nào?",
  searchDescription = "Hỏi tự nhiên như đang trò chuyện. LC Compass sẽ giúp bạn tìm đúng thông tin từ các nguồn chính thống.",
  quoteText = "Nơi con người, thiên nhiên và cơ hội cùng vươn xa",
}: ScenicBannerProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(query);
    } else if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE HERO VIEW (lg:hidden) - PWA Liquid Glass, góc gọn (rounded-xl)  */}
      {/* ========================================================================= */}
      <section
        aria-label="Khung tìm kiếm di động"
        className="lg:hidden space-y-2 pt-2 pb-1 px-3.5 sm:px-4"
      >
        <div className="space-y-0.5">
          <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
            La bàn số Liên Chiểu
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
            Bạn cần thông tin gì?
          </h1>
        </div>

        {/* PWA Liquid Glass Search Bar - Hạn chế bo tròn quá mức (rounded-xl) */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-2 liquid-glass-card rounded-xl p-1.5 pl-3.5 pr-1.5 border border-slate-200 shadow-xs focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Gõ từ khóa: tạm trú, y tế, trường học..."
              style={{ fontSize: "16px" }}
              className="w-full py-1 text-[16px] text-slate-900 placeholder:text-slate-400 placeholder:text-[15px] bg-transparent focus:outline-none pr-1 font-medium"
              aria-label="Nhập câu hỏi hoặc từ khóa tìm kiếm"
            />
            <button
              type="submit"
              className="px-3 h-9 min-h-[36px] touch-target bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1 shrink-0 shadow-xs cursor-pointer"
              aria-label="Tìm kiếm"
            >
              <span>Tìm</span>
            </button>
          </div>
        </form>

        {/* Quick Micro-tags for mobile (1 chạm) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs font-medium text-slate-600">
          <span className="text-xs font-semibold text-slate-500 shrink-0 select-none">Gợi ý:</span>
          <button
            type="button"
            onClick={() => {
              setQuery("tạm trú");
              router.push("/?search=tam%20tru");
            }}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-300 text-slate-700 text-xs font-semibold shrink-0 shadow-2xs active:scale-95 transition-all"
          >
            Tạm trú
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("y tế");
              router.push("/places?category=healthcare");
            }}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-300 text-slate-700 text-xs font-semibold shrink-0 shadow-2xs active:scale-95 transition-all"
          >
            Y tế
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("Một cửa");
              router.push("/?search=mot%20cua");
            }}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-300 text-slate-700 text-xs font-semibold shrink-0 shadow-2xs active:scale-95 transition-all"
          >
            Một cửa
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("chợ");
              router.push("/places?category=market");
            }}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-blue-300 text-slate-700 text-xs font-semibold shrink-0 shadow-2xs active:scale-95 transition-all"
          >
            Chợ dân sinh
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DESKTOP PANORAMIC VIEW (hidden lg:block) - Tự nhiên, không khóa chiều cao */}
      {/* Phong cảnh Vịnh biển Liên Chiểu, 4 chips hành động nhanh                     */}
      {/* ========================================================================= */}
      <section
        aria-label="Khung tìm kiếm phong cảnh Liên Chiểu"
        className="hidden lg:block relative rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-sky-100/90 bg-slate-900"
      >
        {/* Real High-Resolution Scenic Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/scenic-danang.jpg"
            alt="Phong cảnh Vịnh biển Liên Chiểu và Đèo Hải Vân"
            fill
            sizes="85vw"
            className="object-cover object-[center_35%]"
            priority
          />
          {/* Soft overlay gradient to ensure readability while preserving the stunning scenery */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-50/95 via-sky-50/80 to-transparent" />
        </div>

        {/* Foreground Content - Tự nhiên, không ép chiều cao */}
        <div className="relative z-10 px-6 py-3.5 space-y-2">
          {/* Desktop Top Row with Quote matching ref_desktop_web.png */}
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-white/90 backdrop-blur-sm rounded-full border border-sky-100 shadow-2xs text-[10.5px] text-slate-700 italic">
              <span className="text-blue-500 font-serif leading-none">“</span>
              <span>
                <strong className="not-italic text-slate-900 font-bold">Liên Chiểu:</strong> {quoteText}
              </span>
              <span className="text-blue-500 font-serif leading-none">”</span>
            </div>
          </div>

          {/* Greeting & Title */}
          <div className="space-y-0.5 max-w-xl">
            <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
              <span>Xin chào!</span>
            </div>
            <h1 className="text-[20px] font-black text-slate-900 tracking-tight leading-tight">
              Bạn cần tìm thông tin gì về Liên Chiểu?
            </h1>
            <p className="text-[11.5px] text-slate-600 leading-snug font-medium">
              {searchDescription}
            </p>
          </div>

          {/* Search Bar matching exact pill shape in ref_desktop_web.png with prominent search button */}
          <form onSubmit={handleSubmit} className="max-w-xl relative pt-0.5">
            <div className="flex items-center gap-2 bg-white rounded-full p-1 pl-4 pr-1.5 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.06)] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                style={{ fontSize: "16px" }}
                className="w-full py-1 text-[16px] text-slate-900 placeholder:text-slate-400 placeholder:text-[16px] bg-transparent focus:outline-none pr-2"
                aria-label="Nhập câu hỏi hoặc từ khóa tìm kiếm"
              />
              <button
                type="submit"
                className="w-8 h-8 bg-gradient-to-tr from-[#1E60D5] via-[#2563EB] to-[#38BDF8] hover:from-[#1D4ED8] hover:to-[#0284C7] active:scale-95 hover:scale-105 text-white rounded-full font-bold transition-all flex items-center justify-center shrink-0 shadow-[0_2px_10px_rgba(30,96,213,0.4)] hover:shadow-[0_4px_14px_rgba(30,96,213,0.55)] cursor-pointer"
                aria-label="Tìm kiếm"
              >
                <Search className="w-4 h-4 text-white stroke-[2.5]" />
              </button>
            </div>
          </form>

          {/* 4 Action Chips on Desktop inside banner bottom matching ref_desktop_web.png */}
          <div hidden={!showQuickActions} className={showQuickActions ? "grid grid-cols-4 gap-2 pt-0.5 max-w-2xl" : "hidden"}>
            {/* Chip 1: Dịch vụ */}
            <a
              href="https://dichvucong.bocongan.gov.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-1.5 rounded-xl bg-white/95 backdrop-blur-sm border border-slate-100 shadow-2xs hover:shadow-xs hover:border-purple-200 transition-all group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#F3EEFF] text-[#8B5CF6] border border-[#E0D0FF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                  Dịch vụ
                </div>
                <div className="text-[9px] text-slate-500 truncate leading-tight">
                  công trực tuyến
                </div>
              </div>
            </a>

            {/* Chip 2: Thủ tục */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("cac-buoc-thuc-hien");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-white/95 backdrop-blur-sm border border-slate-100 shadow-2xs hover:shadow-xs hover:border-blue-200 transition-all group text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#3B82F6] border border-[#CFE2FF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                  Thủ tục
                </div>
                <div className="text-[9px] text-slate-500 truncate leading-tight">
                  hành chính
                </div>
              </div>
            </button>

            {/* Chip 3: Địa điểm */}
            <a
              href="/places"
              className="flex items-center gap-2 p-1.5 rounded-xl bg-white/95 backdrop-blur-sm border border-slate-100 shadow-2xs hover:shadow-xs hover:border-teal-200 transition-all group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#E6FFFA] text-[#0D9488] border border-[#99F6E4] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                  Địa điểm
                </div>
                <div className="text-[9px] text-slate-500 truncate leading-tight">
                  gần bạn
                </div>
              </div>
            </a>

            {/* Chip 4: Trợ lý La bàn */}
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("la-ban-assistant");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-white/95 backdrop-blur-sm border border-slate-100 shadow-2xs hover:shadow-xs hover:border-orange-200 transition-all group text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Compass className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-900 group-hover:text-orange-700 transition-colors truncate">
                  Trợ lý La bàn
                </div>
                <div className="text-[9px] text-slate-500 truncate leading-tight">
                  tư vấn hoàn cảnh
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
