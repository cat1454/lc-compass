"use client";

import Link from "next/link";
import { HeartHandshake, Landmark, PhoneCall } from "lucide-react";
import React from "react";

interface HomeSupportHotlineProps {
  isLargeText: boolean;
}

export function HomeSupportHotline({ isLargeText }: HomeSupportHotlineProps) {
  return (
    <section
      className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-xl p-5 sm:p-7 shadow-md relative overflow-hidden"
      aria-label="Thông tin hỗ trợ trực tiếp người dân"
    >
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-md bg-teal-800/80 border border-teal-600 text-teal-200 text-xs font-bold">
            <HeartHandshake className="w-3.5 h-3.5 text-teal-300" />
            <span>Điểm tựa cộng đồng</span>
          </div>
          <h2
            className={`font-black text-white ${
              isLargeText ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
            }`}
          >
            Cần hỗ trợ trực tiếp từ địa phương?
          </h2>
          <p className="text-teal-100 text-xs sm:text-sm leading-relaxed">
            Nếu bác hoặc anh chị gặp khó khăn khi thao tác trên điện thoại, hãy gọi tổng đài hoặc đến trực tiếp điểm hỗ trợ của Đoàn thanh niên phường:
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0">
          {/* Nút gọi Hotline 1022 Đà Nẵng */}
          <a
            href="tel:02361022"
            className="touch-target flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-sm transition-transform active:scale-95"
          >
            <PhoneCall className="w-5 h-5 text-slate-950 shrink-0" />
            <div className="text-left leading-tight">
              <div>Gọi Tổng đài 1022</div>
              <div className="text-[11px] font-medium text-slate-900">Bấm số: 0236 1022</div>
            </div>
          </a>

          {/* Điểm Một cửa thanh niên hỗ trợ */}
          <Link
            href="/places"
            className="touch-target flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-sm transition-colors"
          >
            <Landmark className="w-5 h-5 text-teal-200 shrink-0" />
            <div className="text-left leading-tight">
              <div>Bộ phận Một cửa</div>
              <div className="text-[11px] font-medium text-teal-200">68 Lạc Long Quân</div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
