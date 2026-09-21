"use client";

import React from "react";
import { PublicCardDTO } from "../../contracts/card";
import { HomeCardSearchSection } from "../../components/home/HomeCardSearchSection";
import { Compass, Sparkles } from "lucide-react";

interface EmbedClientProps {
  initialCards: PublicCardDTO[];
}

/**
 * Giao diện nhúng siêu nhẹ dành riêng cho Zalo Mini App hoặc Widget Cổng thông tin
 * Loại bỏ thanh điều hướng lớn, tối ưu hóa 100% không gian cho tra cứu và thẻ tác vụ 1-chạm.
 */
export function EmbedClient({ initialCards }: EmbedClientProps) {
  return (
    <div className="w-full min-h-screen bg-slate-50 p-2 sm:p-4 space-y-4">
      {/* Header nhỏ gọn */}
      <div className="flex items-center justify-between px-2 py-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black uppercase text-teal-900 tracking-wide">
              LC COMPASS · ZALO MINI APP
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Một chạm hành chính dân sinh Phường Liên Chiểu
            </div>
          </div>
        </div>
        <div className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Zero-CAC Widget</span>
        </div>
      </div>

      {/* Khối tra cứu & Thẻ hành động */}
      <HomeCardSearchSection
        cards={initialCards}
        isLargeText={false}
        defaultLimit={5}
        showViewAllButton={false}
      />

      <div className="text-center text-[11px] text-slate-400 py-2">
        UBND Phường Liên Chiểu — Đoàn TNCS Hồ Chí Minh phường Liên Chiểu
      </div>
    </div>
  );
}
