"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  WifiOff,
  ClipboardList,
  Printer,
  Save,
  Trash2,
  ShieldCheck,
  AlertCircle,
  Check,
} from "lucide-react";
import { PublicServiceCardDTO } from "../contracts/card";

interface PreparationSlipProps {
  card: PublicServiceCardDTO;
  activeStepIds: string[];
  answers?: Record<string, string>;
  onRestoreAnswers?: (answers: Record<string, string>) => void;
}

export function PreparationSlip({
  card,
  activeStepIds,
  answers = {},
  onRestoreAnswers,
}: PreparationSlipProps) {
  const storageKey = `lc_slip_${card.id}`;
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [savedTime, setSavedTime] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  // Theo dõi trạng thái kết nối mạng của thiết bị
  useEffect(() => {
    setIsOffline(typeof navigator !== "undefined" ? !navigator.onLine : false);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const onRestoreAnswersRef = useRef(onRestoreAnswers);
  useEffect(() => {
    onRestoreAnswersRef.current = onRestoreAnswers;
  }, [onRestoreAnswers]);

  // Khôi phục trạng thái đã lưu tự nguyện trong localStorage (cả checked items và câu trả lời phân nhánh)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.checkedItems === "object") {
          setCheckedItems(parsed.checkedItems);
          setSavedTime(parsed.savedTime || null);
          if (parsed.answers && typeof parsed.answers === "object" && onRestoreAnswersRef.current) {
            onRestoreAnswersRef.current(parsed.answers);
          }
        }
      }
    } catch {
      // Bỏ qua lỗi truy cập localStorage
    }
  }, [storageKey]);

  if (!card.body) {
    return null;
  }

  // Lấy các bước hiển thị theo luồng nhánh hiện tại
  const visibleSteps = card.body.steps.filter((s) => activeStepIds.includes(s.id));
  const allDocs = visibleSteps.flatMap((s) =>
    s.requiredDocs.map((doc) => ({
      stepId: s.id,
      stepTitle: s.title,
      docText: doc,
      docKey: `${s.id}_${doc}`,
    }))
  );

  const totalItems = allDocs.length;
  const completedCount = allDocs.filter((d) => checkedItems[d.docKey]).length;

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => {
      const updated = {
        ...prev,
        [key]: !prev[key],
      };
      return updated;
    });
  };

  const handleSaveVoluntary = () => {
    const nowStr = new Date().toLocaleString("vi-VN");
    const payload = {
      cardId: card.id,
      cardTitle: card.title,
      checkedItems,
      answers,
      savedTime: nowStr,
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
      setSavedTime(nowStr);
      setSaveSuccessMsg("Đã lưu phiếu vào bộ nhớ thiết bị (kèm tùy chọn phân nhánh đã chọn) thành công!");
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } catch {
      setSaveSuccessMsg("Không thể lưu vào bộ nhớ trình duyệt (bộ nhớ đầy hoặc bị chặn).");
    }
  };

  const handleClearSession = () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ thông tin đã lưu của phiếu này trên thiết bị?")) {
      try {
        localStorage.removeItem(storageKey);
      } catch {
        // Bỏ qua
      }
      setCheckedItems({});
      setSavedTime(null);
      if (onRestoreAnswers) {
        onRestoreAnswers({});
      }
      setSaveSuccessMsg("Đã xóa sạch dữ liệu phiên làm việc trên thiết bị.");
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="mt-8 bg-white border-2 border-teal-600/30 rounded-2xl p-6 shadow-sm space-y-4">
      {/* Thông báo chế độ ngoại tuyến nếu mất mạng */}
      {isOffline && (
        <div
          role="status"
          className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center gap-2 no-print"
        >
          <WifiOff className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
          <div>
            <strong>Chế độ ngoại tuyến (Offline):</strong> Thiết bị đang không có kết nối Internet. Toàn bộ phiếu chuẩn bị hành trang và dữ liệu đã lưu trong bộ nhớ máy vẫn hoạt động bình thường mà không cần mạng.
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-teal-600 shrink-0" aria-hidden="true" />
            <span>Phiếu chuẩn bị hành trang mang theo</span>
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Tự kiểm tra các giấy tờ cần thiết trước khi đến cơ quan hoặc nộp hồ sơ trực tuyến.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            type="button"
            onClick={handlePrint}
            className="touch-target px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-sm transition-colors inline-flex items-center gap-1.5"
            title="In phiếu hoặc lưu PDF để mang theo"
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
            <span>In phiếu</span>
          </button>
          <button
            type="button"
            onClick={handleSaveVoluntary}
            className="touch-target px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            <span>Lưu phiếu</span>
          </button>
          {savedTime && (
            <button
              type="button"
              onClick={handleClearSession}
              className="touch-target px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-sm transition-colors inline-flex items-center gap-1.5"
              title="Xóa dữ liệu để bảo mật khi dùng thiết bị công cộng"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              <span>Xóa phiên</span>
            </button>
          )}
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-sm font-medium animate-fadeIn no-print flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Tiến độ chuẩn bị */}
      <div className="flex items-center justify-between gap-4 p-4 bg-teal-50/60 rounded-xl border border-teal-100 text-sm">
        <div className="font-semibold text-teal-950">
          Tiến độ chuẩn bị:{" "}
          <span className="text-teal-700 font-bold">
            {completedCount}/{totalItems}
          </span>{" "}
          hạng mục giấy tờ
        </div>
        {savedTime && (
          <div className="text-xs text-slate-500 no-print">
            Lưu gần nhất: <span className="font-medium text-slate-700">{savedTime}</span>
          </div>
        )}
      </div>

      {/* Danh sách các giấy tờ cần kiểm tra theo bước */}
      <div className="space-y-4 pt-2">
        {visibleSteps.map((step) => {
          if (step.requiredDocs.length === 0) return null;

          return (
            <div key={step.id} className="p-4 bg-slate-50/80 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 text-sm mb-2">{step.title}</div>
              <div className="space-y-2">
                {step.requiredDocs.map((doc) => {
                  const key = `${step.id}_${doc}`;
                  const isChecked = !!checkedItems[key];
                  return (
                    <label
                      key={key}
                      className="touch-target flex items-start gap-3 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCheck(key)}
                        className="mt-1 w-5 h-5 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
                      />
                      <span
                        className={`text-sm select-none ${
                          isChecked ? "line-through text-slate-400 font-normal" : "text-slate-700 font-medium"
                        }`}
                      >
                        {doc}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ghi chú an toàn & quyền riêng tư */}
      <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1.5">
        <p className="flex items-start gap-1.5">
          <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <strong>Bảo mật thông tin:</strong> Phiếu này chỉ lưu trạng thái tích chọn của các đầu mục giấy tờ trong bộ nhớ máy (Local Storage), hoàn toàn không thu thập hoặc lưu trữ số Căn cước công dân, ảnh giấy tờ, mật khẩu VNeID hay mã OTP.
          </span>
        </p>
        <p className="flex items-start gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            <strong>Lưu ý pháp lý:</strong> Phiếu chuẩn bị này phục vụ nhu cầu ghi nhớ cá nhân của người dân, không đại diện cho trạng thái hồ sơ của cơ quan công an hoặc cơ quan nhà nước có thẩm quyền.
          </span>
        </p>
      </div>
    </section>
  );
}
