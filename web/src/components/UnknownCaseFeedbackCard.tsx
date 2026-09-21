"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Phone,
  Save,
  Printer,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  MapPin,
  Sparkles,
} from "lucide-react";

interface UnknownCaseFeedbackCardProps {
  searchQuery: string;
  className?: string;
  onClearSearch?: () => void;
}

export function UnknownCaseFeedbackCard({
  searchQuery,
  className = "",
  onClearSearch,
}: UnknownCaseFeedbackCardProps) {
  const [savedQuery, setSavedQuery] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const cleanQuery = searchQuery.trim();

  const handleSaveQuestion = () => {
    setSaveError(null);
    // Chỉ lưu câu hỏi trong trình duyệt; chưa có kênh gửi đến cơ quan tiếp nhận.
    try {
      const storedQueue = JSON.parse(
        localStorage.getItem("lc_unknown_inquiries") || "[]"
      );
      if (!Array.isArray(storedQueue)) throw new Error("Invalid saved questions");
      storedQueue.push({
        query: cleanQuery,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("lc_unknown_inquiries", JSON.stringify(storedQueue));
      setSavedQuery(cleanQuery);
    } catch {
      setSaveError(cleanQuery);
    }
  };

  const handlePrintSlip = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 150);
  };

  return (
    <div
      role="region"
      aria-label="Tháo gỡ trường hợp chưa có dữ liệu"
      className={`rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50/90 via-white to-slate-50/90 p-4 sm:p-6 shadow-sm space-y-4 ${className}`}
    >
      {/* Header với triết lý Fail-Closed: Minh bạch, không bịa đặt AI */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-purple-600 text-white shrink-0 shadow-sm mt-0.5">
          <FileQuestion className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
              Điểm dừng an toàn thông tin
            </span>
            <span className="text-xs text-purple-700 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Kiểm tra nguồn trước khi thực hiện</span>
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            Chưa tìm thấy hướng dẫn phù hợp
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Bạn có thể thử từ khóa ngắn hơn hoặc in câu hỏi để mang theo khi nhờ hỗ trợ.
          </p>
        </div>
      </div>

      {/* Câu hỏi của người dân được trích xuất an toàn */}
      {cleanQuery && (
        <div className="p-3 rounded-xl bg-white border border-purple-100 shadow-2xs space-y-1 text-xs sm:text-sm">
          <span className="text-slate-500 font-medium">Nội dung bác/anh chị đang tìm kiếm:</span>
          <div className="font-semibold text-slate-900 italic pl-2 border-l-2 border-purple-400">
            &ldquo;{cleanQuery}&rdquo;
          </div>
        </div>
      )}

      {/* 3 Lối tháo gỡ thực tế dành cho người dân */}
      <div className="space-y-2.5 pt-1">
        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-950">
          Bạn có thể tiếp tục bằng các cách sau:
        </h4>

        {/* Bước 1: In hoặc lưu phiếu vướng mắc mang theo */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
            1
          </span>
          <div className="flex-1 space-y-2">
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              <strong>Lập phiếu câu hỏi mang theo:</strong> Xuất phiếu in A5 tóm tắt vướng mắc để đưa cho Cán bộ Một cửa hoặc Tổ công nhân tự quản xem trực tiếp (không cần kể lại từ đầu).
            </div>
            <button
              type="button"
              onClick={handlePrintSlip}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs border border-purple-200 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isPrinting ? "Đang chuẩn bị in..." : "In / Lưu phiếu câu hỏi A5"}</span>
            </button>
          </div>
        </div>

        {/* Bước 2: Gọi trực tiếp cán bộ chuyên môn / Tổng đài 1022 */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
            2
          </span>
          <div className="flex-1 space-y-2">
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              <strong>Hỏi trực tiếp chuyên viên:</strong> Gọi Tổng đài DVC Đà Nẵng hoặc hotline Bộ phận Một cửa Phường Liên Chiểu để được hướng dẫn cá nhân hóa:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="tel:02361022"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-transform active:scale-95 shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Gọi Tổng đài 1022 (0236 1022)</span>
              </a>
              <a
                href="tel:0905423233"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 text-white rounded-lg text-xs font-bold hover:bg-purple-800 transition-transform active:scale-95 shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Hotline CĐS Phường (0905 423 233)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bước 3: Lưu câu hỏi trên thiết bị */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
            3
          </span>
          <div className="flex-1 space-y-2">
            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              <strong>Lưu câu hỏi trên thiết bị:</strong> Câu hỏi chỉ được lưu trong trình duyệt này, chưa gửi đến phường. Không lưu thông tin cá nhân trên máy dùng chung.
            </div>
            {savedQuery === cleanQuery ? (
              <div role="status" className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Đã lưu câu hỏi trong trình duyệt này. Chưa gửi đến phường.</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSaveQuestion}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu câu hỏi trên thiết bị</span>
              </button>
            )}
            {saveError === cleanQuery && (
              <p role="alert" className="text-xs text-red-700">
                Chưa lưu được câu hỏi. Bạn có thể thử lại hoặc in câu hỏi để mang theo.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Trụ sở trực tiếp */}
      <div className="pt-2 border-t border-purple-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Trực tiếp tại: <strong>68 đường Lạc Long Quân, phường Liên Chiểu</strong></span>
        </div>
        {onClearSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="text-purple-700 hover:text-purple-900 font-bold underline transition-colors"
          >
            Quay lại xem tất cả thẻ đã duyệt
          </button>
        )}
      </div>

      {/* Phiếu In A5 Ẩn chỉ hiện khi bấm in */}
      <div className="hidden print:block fixed inset-0 bg-white p-8 z-50 text-slate-900">
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="text-xs uppercase font-bold tracking-wider text-slate-500">
            ỦY BAN NHÂN DÂN PHƯỜNG LIÊN CHIỂU – TỔ CHUYỂN ĐỔI SỐ
          </div>
          <h1 className="text-xl font-black mt-1">
            PHIẾU GHI NHẬN CÂU HỎI VƯỚNG MẮC DÂN SINH (MẪU DÙNG TẠI MỘT CỬA)
          </h1>
          <div className="text-xs text-slate-500 mt-1">
            Mã phiên: LC-INQUIRY-{Date.now().toString().slice(-6)} · Thời gian tạo: {new Date().toLocaleString("vi-VN")}
          </div>
        </div>

        <div className="space-y-4 text-sm leading-relaxed">
          <div className="p-4 rounded-xl border border-slate-300 bg-slate-50">
            <span className="font-bold text-xs uppercase text-slate-500 block">
              Nội dung vướng mắc công dân cần giải quyết:
            </span>
            <div className="text-base font-bold mt-1 text-slate-900">
              &ldquo;{cleanQuery || "Vướng mắc thủ tục hành chính đặc thù"}&rdquo;
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-xs uppercase text-slate-500">
              Ý kiến hướng dẫn của cán bộ tiếp nhận Một cửa / Công an phường:
            </span>
            <div className="h-36 border border-dashed border-slate-400 rounded-xl p-3 text-xs text-slate-400">
              (Cán bộ tiếp nhận ghi chú hồ sơ cần chuẩn bị, biểu mẫu hoặc ngày hẹn trả lời công dân tại đây)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 text-center text-xs">
            <div>
              <span className="font-bold block">NGƯỜI HỖ TRỢ / TỔ TRƯỞNG</span>
              <span className="text-slate-400 italic block mt-12">(Ký và ghi rõ họ tên)</span>
            </div>
            <div>
              <span className="font-bold block">CÁN BỘ TIẾP NHẬN MỘT CỬA</span>
              <span className="text-slate-400 italic block mt-12">(Ký và ghi rõ họ tên)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
