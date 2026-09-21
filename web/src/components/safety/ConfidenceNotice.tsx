"use client";

import React from "react";
import { ShieldCheck, UserCheck, Phone, MapPin, AlertCircle } from "lucide-react";
import { ConfidenceEvaluation } from "../../lib/safety/confidence-guard";

interface ConfidenceNoticeProps {
  confidence?: ConfidenceEvaluation;
  className?: string;
}

export function ConfidenceNotice({ confidence, className = "" }: ConfidenceNoticeProps) {
  if (!confidence) return null;

  if (confidence.isAboveThreshold) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs border border-emerald-200 ${className}`}>
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Độ tin cậy xác minh: <strong>{confidence.confidenceScore}%</strong> — Nguồn dữ liệu đã được rà soát và đối soát địa giới.
        </span>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 text-amber-950 text-xs sm:text-sm space-y-2.5 shadow-sm ${className}`}>
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <span>Cơ Chế Hỗ Trợ Trực Tiếp (Human-In-The-Loop)</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-amber-200 text-amber-900 rounded font-semibold">
              Tin cậy: {confidence.confidenceScore}%
            </span>
          </div>
          <p className="text-amber-800 text-xs leading-relaxed mt-1">
            {confidence.handoverReason ||
              "Quy trình hành chính công đòi hỏi độ chuẩn xác tuyệt đối. Hệ thống dừng suy đoán tự động để bảo vệ quyền lợi pháp lý của bạn."}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-amber-200 flex flex-wrap items-center gap-2">
        <a
          href={`tel:${confidence.officialContacts.phone.replace(/\s+/g, "")}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Gọi Tổng đài {confidence.officialContacts.phone}</span>
        </a>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white text-gray-700 rounded-lg text-xs border border-amber-200">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>{confidence.officialContacts.address}</span>
        </div>
      </div>
    </div>
  );
}
