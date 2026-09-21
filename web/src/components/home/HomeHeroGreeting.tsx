"use client";

import { Compass } from "lucide-react";
import React from "react";

interface HomeHeroGreetingProps {
  isLargeText: boolean;
}

export function HomeHeroGreeting({ isLargeText }: HomeHeroGreetingProps) {
  return (
    <section className="text-center space-y-2.5 max-w-3xl mx-auto pt-1">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-2xs text-xs text-slate-600 font-medium">
        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
        <span>Cẩm nang cộng đồng Liên Chiểu · Trạng thái rà soát được ghi trên từng nội dung.</span>
      </div>
      <h1
        className={`font-black text-slate-900 tracking-tight leading-tight ${
          isLargeText ? "text-2xl sm:text-4xl" : "text-xl sm:text-3xl"
        }`}
      >
        Chào bác, anh chị &amp; các bạn!
      </h1>
      <p className="text-slate-600 font-medium leading-normal max-w-2xl mx-auto text-xs sm:text-base">
        LC Compass giúp bạn tìm hướng dẫn thủ tục, tra cứu địa điểm và khám phá Liên Chiểu. Chọn việc đang cần để biết bước tiếp theo.
      </p>
    </section>
  );
}
