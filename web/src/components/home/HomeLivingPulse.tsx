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
      title: "Tối Thứ Bảy Tình Nguyện: Hỗ trợ DVC cho Công nhân KCN",
      time: "19h00 - 21h30 Thứ Bảy hàng tuần",
      location: "Nhà văn hóa Lao động KCN Hòa Khánh & Nhà trọ Tổ 32",
      description:
        "Đội thanh niên số cắm chốt tại các khu trọ, hỗ trợ cài đặt VNeID, làm thủ tục tạm trú không cần nghỉ làm mất ca, hướng dẫn miễn 100% lệ phí cư trú.",
      actionText: "Xem hướng dẫn công nhân làm ca kíp",
      actionHref: "/cards/service-chuan-bi-tam-tru",
    },
    {
      id: "phong-chong-bao-lu",
      category: "DISASTER",
      badge: "Cảnh Báo Dân Sinh",
      badgeColor: "bg-amber-50 text-amber-900 border-amber-200",
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      title: "Vùng trũng thấp đường Mẹ Suốt & Điểm sơ tán bão lũ",
      time: "Sẵn sàng 24/7 trong mùa mưa bão",
      location: "THPT Nguyễn Trãi & THCS Nguyễn Lương Bằng",
      description:
        "Bà con các tổ dân phố trũng thấp dọc kênh thoát nước đường Mẹ Suốt khi có báo động ngập lụt chủ động di chuyển về 2 điểm sơ tán kiên cố có bộ phận hỗ trợ y tế.",
      actionText: "Gọi Đội phản ứng nhanh cứu hộ (0905 423 233)",
      actionHref: "tel:0905423233",
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>DỮ LIỆU THỰC ĐỊA TUẦN NÀY</span>
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
            Thông tin điều hành, lịch tiếp dân và cảnh báo dân sinh do Đoàn Thanh niên &amp; Tổ CĐS Phường cập nhật trực tiếp.
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
    </section>
  );
}
