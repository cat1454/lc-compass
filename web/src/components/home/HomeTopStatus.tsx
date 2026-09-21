"use client";

import { Compass, ShieldCheck } from "lucide-react";
import React from "react";

interface HomeTopStatusProps {
  isLargeText: boolean;
  onToggleLargeText: () => void;
}

export function HomeTopStatus({ isLargeText, onToggleLargeText }: HomeTopStatusProps) {
  return (
    <div className="space-y-3">
      {/* Thanh điều hướng tiện ích trên cùng: Trạng thái chính thức & Chế độ Dễ đọc */}
      <div className="flex flex-wrap items-center justify-between gap-3 liquid-glass p-3 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50/90 text-teal-800 text-xs font-bold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>Hệ thống dữ liệu cẩm nang số chính thức đã phê duyệt</span>
        </div>

        {/* Nút bật/tắt chế độ Chữ to (Hỗ trợ người cao tuổi & mắt kém) */}
        <button
          type="button"
          onClick={onToggleLargeText}
          className={`touch-target inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-bold transition-all ${
            isLargeText
              ? "bg-teal-700 text-white border-teal-800 shadow-xs"
              : "bg-white/80 text-slate-700 border-slate-300 hover:bg-white"
          }`}
          aria-label="Chuyển đổi kích thước chữ dễ đọc cho người lớn tuổi"
        >
          <span className="text-sm font-black font-mono">Aa</span>
          <span>{isLargeText ? "Chế độ chữ to: ĐANG BẬT" : "Chế độ chữ to (Dễ đọc)"}</span>
        </button>
      </div>

      {/* Dấu ấn đặc biệt: Thanh trạng thái PWA La bàn cơ sở Liên Chiểu */}
      <div className="lg:hidden liquid-glass rounded-xl p-2.5 px-3 border border-slate-200/90 flex items-center justify-between text-xs shadow-2xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Compass className="w-4 h-4 text-blue-600 shrink-0" />
          <span>La bàn số:</span>
          <span className="text-slate-600 font-medium">16°04&apos;N 108°08&apos;E</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Một cửa &amp; 1022 Trực tuyến</span>
        </div>
      </div>
    </div>
  );
}
