"use client";

import Link from "next/link";
import { ArrowRight, Check, FileText, Landmark, MapPin, Target } from "lucide-react";
import React from "react";

interface HomeThreeCoreNeedsProps {
  isLargeText: boolean;
}

export function HomeThreeCoreNeeds({ isLargeText }: HomeThreeCoreNeedsProps) {
  return (
    <section aria-labelledby="three-entries-heading" className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <h2
          id="three-entries-heading"
          className={`font-bold text-slate-900 flex items-center gap-2 ${
            isLargeText ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
          }`}
        >
          <Target className="w-5 h-5 text-blue-600" />
          <span>Ba nhu cầu phổ biến nhất</span>
        </h2>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Chọn đúng việc cần làm
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Lối vào 1: Thủ tục &amp; hướng dẫn */}
        <div className="liquid-glass-card bg-gradient-to-br from-blue-50/90 to-indigo-50/70 border border-blue-200/80 rounded-xl p-4 sm:p-6 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="px-2 py-0.5 rounded-sm bg-blue-100 text-blue-900 text-[10.5px] font-bold">
                Thủ tục giấy tờ
              </span>
            </div>
            <div>
              <h3 className={`font-black text-blue-950 ${isLargeText ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}>
                Thủ tục &amp; hướng dẫn
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5 font-medium">
                Tìm hướng dẫn, bước chuẩn bị và đầu mối cho việc cần làm.
              </p>
            </div>
            <ul className="text-xs text-slate-500 space-y-1 font-medium pt-0.5">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Hướng dẫn từng bước rõ ràng</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Liên kết nguồn và biểu mẫu phù hợp</span>
              </li>
            </ul>
          </div>
          <div className="pt-2">
            <Link
              href="/services"
              className="touch-target px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base transition-colors text-center w-full flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Xem thủ tục &amp; hướng dẫn</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Lối vào 2: Địa điểm &amp; tiện ích */}
        <div className="liquid-glass-card bg-gradient-to-br from-teal-50/90 to-emerald-50/70 border border-teal-200/80 rounded-xl p-4 sm:p-6 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="px-2 py-0.5 rounded-sm bg-teal-100 text-teal-900 text-[10.5px] font-bold">
                Tiện ích cộng đồng
              </span>
            </div>
            <div>
              <h3 className={`font-black text-teal-950 ${isLargeText ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}>
                Địa điểm &amp; tiện ích
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5 font-medium">
                Chợ, trạm y tế, trường học, ATM và ủy ban trong phường.
              </p>
            </div>
            <ul className="text-xs text-slate-500 space-y-1 font-medium pt-0.5">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Xác minh đúng ranh giới phường</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Xem địa chỉ và thông tin liên hệ hiện có</span>
              </li>
            </ul>
          </div>
          <div className="pt-2">
            <Link
              href="/places"
              className="touch-target px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm sm:text-base transition-colors text-center w-full flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Tra cứu danh bạ địa điểm</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Lối vào 3: Khám phá Liên Chiểu */}
        <div className="liquid-glass-card bg-gradient-to-br from-amber-50/90 to-orange-50/70 border border-amber-200/80 rounded-xl p-4 sm:p-6 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
                <Landmark className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="px-2 py-0.5 rounded-sm bg-amber-100 text-amber-900 text-[10.5px] font-bold">
                Di sản &amp; Đời sống
              </span>
            </div>
            <div>
              <h3 className={`font-black text-amber-950 ${isLargeText ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}>
                Khám phá Liên Chiểu
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5 font-medium">
                Đình làng Hòa Mỹ, bánh khô mè, bờ biển và danh thắng.
              </p>
            </div>
            <ul className="text-xs text-slate-500 space-y-1 font-medium pt-0.5">
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Văn hóa &amp; lịch sử địa phương</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Điểm đến gắn bó với cộng đồng</span>
              </li>
            </ul>
          </div>
          <div className="pt-2">
            <Link
              href="/discover"
              className="touch-target px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm sm:text-base transition-colors text-center w-full flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Khám phá di sản địa phương</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
