"use client";

import React, { useState } from "react";
import {
  Calendar,
  AlertTriangle,
  Zap,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Phone,
} from "lucide-react";
import Link from "next/link";

interface HomeLivingPulseProps {
  isLargeText: boolean;
}

export function HomeLivingPulse({ isLargeText }: HomeLivingPulseProps) {
  const [activeTab, setActiveTab] = useState<"ALL" | "LEADERSHIP" | "COMMUNITY" | "DISASTER">("ALL");

  const pulseItems = [
    {
      id: "tiep-dan",
      category: "LEADERSHIP",
      badge: "Lịch Phường Tuần Này",
      badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
      icon: <Calendar className="w-4 h-4 text-blue-600" />,
      title: "Lịch tiếp công dân của Lãnh đạo UBND Phường",
      time: "Thứ Ba & Thứ Năm hàng tuần (07h30 - 11h30)",
      location: "Bộ phận Tiếp công dân, 68 Lạc Long Quân",
      description:
        "Chủ tịch và các Phó Chủ tịch UBND Phường trực tiếp lắng nghe, giải quyết khiếu nại, phản ánh và tháo gỡ vướng mắc hành chính cho nhân dân.",
      actionText: "Xem chỉ đường trụ sở 68 Lạc Long Quân",
      actionHref: "/places?search=68%20l%E1%BA%A1c%20long%20qu%C3%A2n",
    },
    {
      id: "thanh-nien-kcn",
      category: "COMMUNITY",
      badge: "Đoàn Thanh Niên",
      badgeColor: "bg-teal-50 text-teal-800 border-teal-200",
      icon: <Users className="w-4 h-4 text-teal-600" />,
      title: "Hỗ trợ Dịch vụ công trực tuyến cho Người lao động & Sinh viên",
      time: "Theo kế hoạch Đoàn phường & giờ tiếp nhận DVC",
      location: "Bộ phận Một cửa (68 Lạc Long Quân) & Các điểm lưu động",
      description:
        "Đội thanh niên số hỗ trợ cài đặt VNeID, làm thủ tục tạm trú không cần nghỉ làm mất ca, hướng dẫn quy trình dịch vụ công trực tuyến miễn phí.",
      actionText: "Xem hướng dẫn thủ tục tạm trú",
      actionHref: "/cards/service-chuan-bi-tam-tru",
    },
    {
      id: "phong-chong-bao-lu",
      category: "DISASTER",
      badge: "Cảnh Báo Dân Sinh",
      badgeColor: "bg-amber-50 text-amber-900 border-amber-200",
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      title: "Khuyến cáo phòng chống ngập lụt vùng trũng thấp",
      time: "Theo dõi bản tin PCTT & TKCN trong mùa mưa bão",
      location: "Khu vực trũng thấp đường Mẹ Suốt và dọc tuyến thoát nước",
      description:
        "Bà con nhân dân tại khu vực trũng thấp chủ động theo dõi cảnh báo thời tiết từ chính quyền; liên hệ đường dây nóng UBND phường hoặc Tổng đài 1022 khi cần trợ giúp.",
      actionText: "Gọi Đường dây nóng UBND Phường (02363 777 998)",
      actionHref: "tel:02363777998",
    },
  ];

  const filteredItems =
    activeTab === "ALL"
      ? pulseItems
      : pulseItems.filter((item) => item.category === activeTab);

  return (
    <section
      aria-label="Nhịp đập Liên Chiểu hôm nay"
      className="liquid-glass-card rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span>THÔNG TIN ĐIỀU HÀNH &amp; DÂN SINH</span>
          </div>
          <h2
            className={`font-black text-slate-900 flex items-center gap-2 ${
              isLargeText ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
            }`}
          >
            <Sparkles className="w-5 h-5 text-teal-600 shrink-0" />
            <span>Nhịp đập Liên Chiểu hôm nay</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Thông tin điều hành, lịch tiếp công dân và khuyến cáo dân sinh đối chiếu từ Cổng thông tin điện tử phường Liên Chiểu.
          </p>
        </div>

        {/* Tab lọc nhanh */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tất cả (3)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("LEADERSHIP")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "LEADERSHIP"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            Tiếp dân
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("COMMUNITY")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "COMMUNITY"
                ? "bg-teal-600 text-white shadow-xs"
                : "bg-teal-50 text-teal-700 hover:bg-teal-100"
            }`}
          >
            KCN &amp; Trọ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("DISASTER")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === "DISASTER"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            }`}
          >
            Mưa bão
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-xl bg-white/90 border border-slate-200 p-3.5 sm:p-4 flex flex-col justify-between space-y-3 hover:border-teal-300 hover:shadow-2xs transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${item.badgeColor}`}
                >
                  {item.icon}
                  <span>{item.badge}</span>
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                {item.title}
              </h3>

              <div className="space-y-1 text-xs text-slate-500 font-medium">
                <div className="flex items-start gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{item.time}</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{item.location}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-1 line-clamp-3">
                {item.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              {item.actionHref.startsWith("tel:") ? (
                <a
                  href={item.actionHref}
                  className="touch-target inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{item.actionText}</span>
                </a>
              ) : (
                <Link
                  href={item.actionHref}
                  className="touch-target inline-flex items-center gap-1 text-xs font-bold text-teal-800 hover:text-teal-950 hover:underline transition-colors"
                >
                  <span>{item.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Banner Cầu nối Sự kiện Liên Chiểu */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-sm border border-teal-600/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-400/20">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>Cầu nối Sự kiện Liên Chiểu</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30 font-semibold">
                Mới
              </span>
            </div>
            <p className="text-teal-200/90 text-[11px] mt-0.5">
              Khám phá các cuộc thi sáng tạo CĐS, giải bóng đá phong trào, ngày hội hiến máu và hội thảo công nghệ trên bản đồ di động.
            </p>
          </div>
        </div>
        <Link
          href="/events"
          className="touch-target px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs transition-colors inline-flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
        >
          <span>Xem Bản đồ Sự kiện</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
