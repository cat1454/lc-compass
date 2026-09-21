"use client";

import React from "react";
import { AlertTriangle, PhoneCall, ShieldAlert, Siren } from "lucide-react";
import { EmergencyInfo } from "../lib/dialect/smart-query-processor";

interface EmergencyBannerProps {
  emergency: EmergencyInfo;
  className?: string;
}

export function EmergencyBanner({ emergency, className = "" }: EmergencyBannerProps) {
  if (!emergency.isEmergency) return null;

  return (
    <div
      role="alert"
      className={`w-full bg-red-600 text-white rounded-2xl p-4 sm:p-5 shadow-xl border-2 border-red-400 animate-pulse transition-all ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white/20 rounded-xl shrink-0 mt-0.5">
          <Siren className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider bg-white text-red-700 px-2 py-0.5 rounded-full">
              Khẩn cấp
            </span>
            <h3 className="text-base sm:text-lg font-black tracking-tight">{emergency.title}</h3>
          </div>

          <p className="text-xs sm:text-sm text-red-100 mt-1 leading-relaxed">
            {emergency.instructions}
          </p>

          <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
            <a
              href={`tel:${emergency.hotline.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-red-700 rounded-xl font-black text-sm hover:bg-red-50 transition-transform active:scale-95 shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>GỌI NGAY {emergency.hotline}</span>
            </a>

            <a
              href="tel:02363842113"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-700 text-white rounded-xl font-bold text-xs hover:bg-red-800 transition-colors border border-red-500"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Trực ban CAP Liên Chiểu (0236 3842 113)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
