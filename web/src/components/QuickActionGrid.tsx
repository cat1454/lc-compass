"use client";

import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  ShieldCheck,
  ShoppingBag,
  Zap,
} from "lucide-react";
import React from "react";

interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
  colorBg: string;
  colorBorder: string;
  colorIconBg: string;
  colorText: string;
  colorSubtext: string;
  badge?: string;
}

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: "tam-tru",
    title: "Thủ tục",
    subtitle: "Hướng dẫn & hồ sơ",
    icon: <Home className="w-5 h-5 sm:w-6 sm:h-6" />,
    href: "/services",
    colorBg: "bg-blue-50/90 hover:bg-blue-100/90",
    colorBorder: "border-blue-200",
    colorIconBg: "bg-blue-600 text-white",
    colorText: "text-blue-950",
    colorSubtext: "text-blue-700",
    
  },
  {
    id: "y-te",
    title: "Y tế",
    subtitle: "Y tế & nhà thuốc",
    icon: <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6" />,
    href: "/places?category=healthcare",
    colorBg: "bg-rose-50/90 hover:bg-rose-100/90",
    colorBorder: "border-rose-200",
    colorIconBg: "bg-rose-600 text-white",
    colorText: "text-rose-950",
    colorSubtext: "text-rose-700",
  },
  {
    id: "cho",
    title: "Mua sắm",
    subtitle: "Chợ & cửa hàng",
    icon: <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />,
    href: "/places?category=market",
    colorBg: "bg-emerald-50/90 hover:bg-emerald-100/90",
    colorBorder: "border-emerald-200",
    colorIconBg: "bg-emerald-600 text-white",
    colorText: "text-emerald-950",
    colorSubtext: "text-emerald-700",
    
  },
  {
    id: "mot-cua",
    title: "Hành chính",
    subtitle: "Cơ quan & cộng đồng",
    icon: <Landmark className="w-5 h-5 sm:w-6 sm:h-6" />,
    href: "/places?category=community",
    colorBg: "bg-amber-50/90 hover:bg-amber-100/90",
    colorBorder: "border-amber-200",
    colorIconBg: "bg-amber-600 text-white",
    colorText: "text-amber-950",
    colorSubtext: "text-amber-700",
  },
  {
    id: "cong-an",
    title: "Khám phá",
    subtitle: "Văn hóa & điểm đến",
    icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
    href: "/discover",
    colorBg: "bg-indigo-50/90 hover:bg-indigo-100/90",
    colorBorder: "border-indigo-200",
    colorIconBg: "bg-indigo-600 text-white",
    colorText: "text-indigo-950",
    colorSubtext: "text-indigo-700",
  },
  {
    id: "truong-hoc",
    title: "Trường học",
    subtitle: "Giáo dục & trường học",
    icon: <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />,
    href: "/places?category=education",
    colorBg: "bg-teal-50/90 hover:bg-teal-100/90",
    colorBorder: "border-teal-200",
    colorIconBg: "bg-teal-600 text-white",
    colorText: "text-teal-950",
    colorSubtext: "text-teal-700",
  },
];

interface QuickActionGridProps {
  isLargeText?: boolean;
}

export function QuickActionGrid({ isLargeText = false }: QuickActionGridProps) {
  return (
    <section aria-label="Lối tắt nhu cầu thiết yếu thường dùng" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2
          className={`font-bold text-slate-900 flex items-center gap-2 ${
            isLargeText ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
          }`}
        >
          <Zap className="w-5 h-5 text-amber-500 fill-amber-400" />
          <span>Lối tắt nhu cầu hàng ngày</span>
        </h2>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Dễ dùng cho người lớn tuổi &amp; thanh niên
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 items-stretch">
        {QUICK_ACTIONS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`group relative flex flex-col justify-between h-full p-3 sm:p-4 rounded-xl border bg-white/95 backdrop-blur-sm transition-all shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 ${item.colorBorder} hover:border-blue-400`}
          >
            {item.badge && (
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-white text-[9.5px] font-bold text-slate-700 shadow-2xs border border-slate-200 pointer-events-none">
                {item.badge}
              </span>
            )}

            <div className="flex flex-col items-start gap-2 flex-1">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-2xs shrink-0 transition-transform group-hover:scale-105 ${item.colorIconBg}`}
              >
                {item.icon}
              </div>
              <div className="min-w-0 w-full">
                <div
                  className={`font-black leading-snug tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors ${
                    isLargeText ? "text-base sm:text-lg" : "text-sm sm:text-base"
                  }`}
                >
                  {item.title}
                </div>
                <div
                  className="text-[11px] sm:text-xs font-medium mt-0.5 leading-tight text-slate-500 line-clamp-1"
                >
                  {item.subtitle}
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
              <span>Mở ngay</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
