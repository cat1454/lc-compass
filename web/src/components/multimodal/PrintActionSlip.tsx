"use client";

import React, { useState } from "react";
import { Printer, X, CheckSquare, Phone, MapPin, Clock } from "lucide-react";
import { PublicCardDTO } from "../../contracts/card";

interface PrintActionSlipProps {
  card: PublicCardDTO;
  className?: string;
}

export function PrintActionSlip({ card, className = "" }: PrintActionSlipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const steps = card.type === "SERVICE" && card.body ? card.body.steps : [];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg text-xs sm:text-sm font-medium transition-colors bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 ${className}`}
        title="In phiếu A5 cầm tay cho người lớn tuổi"
      >
        <Printer className="w-4 h-4 text-emerald-600" />
        <span>In phiếu hướng dẫn A5</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:p-0 print:bg-white print:static">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-100 print:shadow-none print:border-none print:max-h-none print:p-0">
            {/* Header điều khiển (ẩn khi in) */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 print:hidden">
              <span className="text-sm font-bold text-gray-800">
                Phiếu Hướng Dẫn Dân Sinh (Khổ A5 Chữ To)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In ngay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Nội dung phiếu in khổ A5 dành cho người lớn tuổi */}
            <div className="pt-4 text-black font-sans leading-relaxed">
              <div className="text-center pb-3 border-b-2 border-dashed border-gray-300">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-600">
                  UBND PHƯỜNG LIÊN CHIỂU — TỔ CÔNG NGHỆ SỐ CỘNG ĐỒNG
                </div>
                <h1 className="text-lg font-black uppercase text-gray-900 mt-1">
                  PHIẾU HƯỚNG DẪN THỦ TỤC
                </h1>
                <p className="text-sm font-bold text-blue-800 mt-0.5">{card.title}</p>
              </div>

              {/* Thông tin nơi đến */}
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs sm:text-sm space-y-1.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Nơi tiếp nhận:</span>{" "}
                    {card.jurisdiction.label} (Bộ phận Một cửa / Công an phường)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Giờ làm việc:</span> Thứ 2 – Thứ 6 (Sáng 7h30–11h30, Chiều 13h30–17h00)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Tổng đài giải đáp:</span> 0236 1022 (Nhánh Dịch vụ công)
                  </div>
                </div>
              </div>

              {/* Các bước cần làm có ô tích vuông */}
              <div className="mt-4">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800 mb-2 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <span>Các bước cần chuẩn bị:</span>
                </h2>
                <div className="space-y-2.5">
                  {steps.map((step, idx) => (
                    <div
                      key={step.id || idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm p-2 rounded-lg border border-gray-100 bg-white"
                    >
                      <div className="w-5 h-5 rounded border-2 border-gray-400 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{step.title}</div>
                        <div className="text-gray-700 text-xs leading-normal mt-0.5">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lời nhắn cho con cháu / người hỗ trợ */}
              <div className="mt-4 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 leading-normal">
                💡 <span className="font-bold">Lưu ý cho người lớn tuổi / người thân:</span> Mang theo Căn cước công dân gốc và Giấy tờ chứng minh chỗ ở hợp pháp (Hợp đồng thuê trọ / Sổ đỏ / Giấy ủy quyền nếu làm hộ).
              </div>

              {/* Chân phiếu */}
              <div className="mt-4 pt-3 border-t border-dashed border-gray-300 text-center text-[10px] text-gray-500">
                Phiếu tra cứu từ nền tảng LC Compass — Cập nhật ngày: {card.review?.reviewedAt || "20/09/2026"}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
