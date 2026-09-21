"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Phone,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Scale,
  Sparkles,
} from "lucide-react";
import { EdgeCaseGuidance } from "../lib/navigation/edge-case-resolver";

interface EdgeCaseGuidanceCardProps {
  guidance: EdgeCaseGuidance;
  className?: string;
}

export function EdgeCaseGuidanceCard({
  guidance,
  className = "",
}: EdgeCaseGuidanceCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      role="region"
      aria-label={guidance.title}
      className={`rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/80 p-4 sm:p-5 shadow-sm transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 shadow-sm mt-0.5">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                Tháo gỡ tình huống đặc thù
              </span>
              <span className="text-xs text-indigo-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Giải pháp có căn cứ pháp lý</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 leading-snug">
              {guidance.title}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-white/60 transition-colors shrink-0"
          title={isExpanded ? "Thu gọn giải pháp" : "Mở rộng giải pháp"}
          aria-label={isExpanded ? "Thu gọn giải pháp" : "Mở rộng giải pháp"}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mt-2.5">
        {guidance.summary}
      </p>

      {/* Nội dung chi tiết các bước tháo gỡ */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-indigo-100/80 space-y-3.5">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2">
              Các bước tháo gỡ cụ thể:
            </h4>
            <div className="space-y-2">
              {guidance.solutionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm p-2.5 rounded-xl bg-white/95 border border-indigo-100 text-slate-800 shadow-2xs leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Căn cứ pháp lý */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-white/60 px-3 py-1.5 rounded-lg border border-indigo-50">
            <Scale className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>
              <strong>Căn cứ:</strong> {guidance.legalBasis}
            </span>
          </div>

          {/* Nút hành động & Đầu mối liên hệ trực tiếp */}
          <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <a
                href={`tel:${guidance.actionContact.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-transform active:scale-95 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi hỗ trợ: {guidance.actionContact.phone}</span>
              </a>

              {guidance.actionContact.address && (
                <div className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-600 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{guidance.actionContact.address}</span>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 italic">
              {guidance.actionContact.label}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
