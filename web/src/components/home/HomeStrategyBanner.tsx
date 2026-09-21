"use client";

import React from "react";
import {
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

interface HomeStrategyBannerProps {
  isLargeText: boolean;
}

export function HomeStrategyBanner({ isLargeText }: HomeStrategyBannerProps) {
  return (
    <section
      aria-label="Hướng dẫn chuẩn bị trước khi nộp hồ sơ"
      className="liquid-glass-card rounded-2xl border-2 border-teal-600/30 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white p-4 sm:p-6 shadow-sm space-y-4"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/30">
            <FileCheck2 className="w-3.5 h-3.5 text-teal-400" />
            <span>TÌM HƯỚNG DẪN · CHUẨN BỊ · MỞ KÊNH CHÍNH THỨC</span>
          </div>
          <h2
            className={`font-black tracking-tight text-white leading-snug ${
              isLargeText ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
            }`}
          >
            Hiểu bước chuẩn bị trước khi nộp hồ sơ
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Bạn đang cần làm giấy tờ nhưng chưa biết bắt đầu từ đâu?
            LC Compass giúp bạn xem hướng dẫn, ghi lại điều cần hỏi và mở kênh chính thức phù hợp với thủ tục.
          </p>
        </div>

        {/* 2 Bước rõ ràng: Bước 1 LC Compass -> Bước 2 Zalo / Cổng DVC */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
          <div className="space-y-1 sm:text-right">
            <span className="text-[11px] font-bold text-teal-300 block uppercase tracking-wider">
              Bước 1: Chuẩn bị tại đây
            </span>
            <span className="text-xs text-white font-medium block">
              Xem hướng dẫn · Ghi điều cần hỏi · In phiếu
            </span>
          </div>

          <div className="hidden sm:flex items-center text-teal-400">
            <ArrowRight className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-emerald-300 block uppercase tracking-wider">
              Bước 2: Nộp chính thức
            </span>
            <a
              href="https://dichvucong.bocongan.gov.vn"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
            >
              <span>Cổng DVC Bộ Công an</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 3 Cam kết cốt lõi bảo vệ người dân */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/10 text-xs text-slate-200">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Xem nguồn và ngày rà soát trên thẻ hướng dẫn</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Chỉ nhập việc cần hỏi; không nhập số căn cước, mật khẩu hoặc OTP</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Chưa rõ thông tin? In câu hỏi để mang theo khi nhờ hỗ trợ</span>
        </div>
      </div>
    </section>
  );
}
