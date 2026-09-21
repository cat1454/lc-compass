"use client";

import { cardStatus } from "../lib/card-status";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  User,
  Home,
  HeartHandshake,
  Zap,
  Compass,
  Phone,
  HelpCircle,
  ChevronRight,
  MapPin,
  Building2,
  Clock,
  Navigation,
  ExternalLink,
  FileText,
} from "lucide-react";
import { PublicCardDTO, PublicPlaceCardDTO, PublicServiceCardDTO } from "../contracts/card";
import { decideRoute } from "../lib/navigation/decide";
import { ProfileMode, StressFlag } from "../lib/navigation/types";
import { CardAccessGuard } from "./CardAccessGuard";
import { PreparationSlip } from "./PreparationSlip";
import { isMapAction } from "../lib/map-links";
import { LocationPanel } from "./LocationPanel";
import { ScenicBanner } from "./ScenicBanner";
import { TextToSpeechButton } from "./multimodal/TextToSpeechButton";
import { PrintActionSlip } from "./multimodal/PrintActionSlip";

interface CitizenServiceViewProps {
  primaryCard: PublicServiceCardDTO;
  otherServices: PublicCardDTO[];
  caPlaceCard?: PublicPlaceCardDTO | null;
}

export function CitizenServiceView({
  primaryCard,
  otherServices,
  caPlaceCard,
}: CitizenServiceViewProps) {
  // Trạng thái phân nhánh câu hỏi (khởi tạo rỗng, không mặc định)
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [profileMode, setProfileMode] = useState<ProfileMode>("self");
  const [stressFlag, setStressFlag] = useState<StressFlag>("clean");

  // Format ngày duyệt từ card data thật (reviewedAt: "2026-09-18" -> "18/09/2026")
  const formattedReviewDate = useMemo(() => {
    const raw = primaryCard.review?.reviewedAt;
    if (!raw) return "18/09/2026";
    const parts = raw.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return raw;
  }, [primaryCard.review?.reviewedAt]);

  const jurisdictionLabel =
    primaryCard.jurisdiction?.label || "Phường Liên Chiểu, TP. Đà Nẵng";

  // Thông tin cơ quan tiếp nhận hồ sơ cư trú
  const hasPlace = !!caPlaceCard && !!caPlaceCard.body;
  const receptionTitle = hasPlace ? caPlaceCard.title : "Địa điểm tiếp nhận: Chưa xác minh";
  const receptionAddress = hasPlace ? caPlaceCard.body!.address : "Chưa xác minh cơ quan tiếp nhận hồ sơ tại địa bàn";
  const receptionHours = hasPlace ? caPlaceCard.body!.openingHours : "Chưa xác minh";
  const receptionPhone = hasPlace ? caPlaceCard.body!.contactPhone : undefined;

  // Xác định hành động bản đồ / chỉ đường có nguồn từ thẻ địa điểm hoặc thẻ thủ tục
  // BẢO ĐẢM AN TOÀN: Chỉ nhận action thực sự là bản đồ/chỉ đường, không lấy bừa external_link bất kỳ
  const mapAction = useMemo(() => {
    return (
      caPlaceCard?.actions?.find(isMapAction) ||
      primaryCard.actions?.find(isMapAction)
    );
  }, [caPlaceCard?.actions, primaryCard.actions]);

  // Xử lý chọn phân nhánh
  const handleSelectOption = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const updated = { ...prev };
      if (updated[questionId] === value) {
        delete updated[questionId];
      } else {
        updated[questionId] = value;
      }
      return updated;
    });
  };

  // Tập hợp các ID bước là mục tiêu của nhánh rẽ điều kiện (phân nhánh động)
  const branchTargetIds = useMemo(() => {
    if (!primaryCard.body) return new Set<string>();
    return new Set(
      primaryCard.body.steps.flatMap((s) => s.branches?.map((b) => b.nextStepId) || [])
    );
  }, [primaryCard.body]);

  // Tính toán các bước hiển thị theo phân nhánh động
  const activeStepIds = useMemo(() => {
    if (!primaryCard.body) return [];
    const baseSteps = primaryCard.body.steps.filter((s) => !branchTargetIds.has(s.id));
    const activeIds: string[] = [];

    for (const step of baseSteps) {
      activeIds.push(step.id);

      if (step.branches && step.branches.length > 0) {
        for (const branch of step.branches) {
          const cond = branch.when || branch.condition;
          if (cond) {
            const userAns = answers[cond.questionId];
            if (userAns === cond.equals && !activeIds.includes(branch.nextStepId)) {
              activeIds.push(branch.nextStepId);
            }
          }
        }
      }
    }

    return activeIds;
  }, [primaryCard.body, branchTargetIds, answers]);

  // Tư vấn định tuyến từ Lõi điều hướng
  const navigationAdvice = useMemo(() => {
    return decideRoute({
      intentId: primaryCard.intentIds[0] || "cu_tru-01",
      profileMode,
      flags: [stressFlag],
    });
  }, [primaryCard.intentIds, profileMode, stressFlag]);

  const visibleSteps = useMemo(() => {
    if (!primaryCard.body) return [];
    return primaryCard.body.steps.filter((s) => activeStepIds.includes(s.id));
  }, [primaryCard.body, activeStepIds]);

  // Trạng thái mở/đóng từng bước trên Mobile (mỗi bước có button mở/đóng, aria-expanded)
  // Mặc định mở bước đầu tiên để người dùng có ngữ cảnh ngay
  const [expandedStepIds, setExpandedStepIds] = useState<Set<string>>(
    () => new Set(primaryCard.body?.steps[0]?.id ? [primaryCard.body.steps[0].id] : [])
  );

  const toggleStep = (stepId: string) => {
    setExpandedStepIds((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  // Cấu hình màu cho số bước theo chuẩn ref_desktop.png và ref_mobile.png:
  // Step 1: Blue (#2563EB)
  // Step 2: Emerald Green (#10B981)
  // Step 3: Orange (#F97316)
  // Step 4: Teal (#0D9488)
  const stepColorStyles = [
    { bg: "bg-[#2563EB]", text: "text-blue-600", border: "border-blue-200", line: "border-blue-300" },
    { bg: "bg-[#10B981]", text: "text-emerald-600", border: "border-emerald-200", line: "border-emerald-300" },
    { bg: "bg-[#F97316]", text: "text-orange-500", border: "border-orange-200", line: "border-orange-300" },
    { bg: "bg-[#0D9488]", text: "text-teal-600", border: "border-teal-200", line: "border-teal-300" },
    { bg: "bg-slate-700", text: "text-slate-700", border: "border-slate-300", line: "border-slate-300" },
  ];

  return (
    <CardAccessGuard card={primaryCard}>
      <div className="pt-2 pb-6 px-3 lg:py-3 lg:px-5 space-y-3 lg:space-y-4 w-full max-w-[1150px] mx-auto">
        {/* 1. Panoramic Scenic Hero Banner */}
        <ScenicBanner quoteText="Nơi con người, thiên nhiên và cơ hội cùng vươn xa" />

        {/* 2. Hàng 4 phím tắt danh mục nhanh trên Mobile (1 HÀNG DUY NHẤT: grid-cols-4) */}
        <div className="grid grid-cols-4 gap-2 lg:hidden pt-0.5 pb-0.5 items-stretch">
          {/* Phím 1: Dịch vụ công trực tuyến */}
          <a
            href="https://dichvucong.bocongan.gov.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="touch-target h-full min-h-[58px] flex flex-col items-center justify-between text-center p-1.5 rounded-xl bg-white/95 border border-slate-200/80 shadow-2xs active:scale-95 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#E6F7F2] text-[#0D9488] border border-[#C2EFE1] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
            </div>
            <div className="min-w-0 w-full mt-1">
              <div className="text-[11px] font-bold text-slate-800 leading-tight truncate w-full">
                Dịch vụ
              </div>
              <div className="text-[9px] text-slate-500 leading-tight truncate w-full mt-0.5">
                công trực tuyến
              </div>
            </div>
          </a>

          {/* Phím 2: Thủ tục hành chính */}
          <button
            type="button"
            onClick={() => {
              const el =
                document.getElementById("cac-buoc-thuc-hien-mobile") ||
                document.getElementById("cac-buoc-thuc-hien");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="touch-target h-full min-h-[58px] flex flex-col items-center justify-between text-center p-1.5 rounded-xl bg-white/95 border border-slate-200/80 shadow-2xs active:scale-95 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FFF0ED] text-[#EA580C] border border-[#FFD8D0] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4 text-[#EA580C]" />
            </div>
            <div className="min-w-0 w-full mt-1">
              <div className="text-[11px] font-bold text-slate-800 leading-tight truncate w-full">
                Thủ tục
              </div>
              <div className="text-[9px] text-slate-500 leading-tight truncate w-full mt-0.5">
                hành chính
              </div>
            </div>
          </button>

          {/* Phím 3: Địa điểm gần bạn */}
          <Link
            href="/places"
            className="touch-target h-full min-h-[58px] flex flex-col items-center justify-between text-center p-1.5 rounded-xl bg-white/95 border border-slate-200/80 shadow-2xs active:scale-95 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#F4EEFF] text-[#8B5CF6] border border-[#E3D4FF] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <MapPin className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <div className="min-w-0 w-full mt-1">
              <div className="text-[11px] font-bold text-slate-800 leading-tight truncate w-full">
                Địa điểm
              </div>
              <div className="text-[9px] text-slate-500 leading-tight truncate w-full mt-0.5">
                gần bạn
              </div>
            </div>
          </Link>

          {/* Phím 4: Trợ lý La bàn */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("la-ban-assistant");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="touch-target h-full min-h-[58px] flex flex-col items-center justify-between text-center p-1.5 rounded-xl bg-white/95 border border-slate-200/80 shadow-2xs active:scale-95 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#EBF3FE] text-[#2563EB] border border-[#CCE2FD] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Compass className="w-4 h-4 text-[#2563EB]" />
            </div>
            <div className="min-w-0 w-full mt-1">
              <div className="text-[11px] font-bold text-slate-800 leading-tight truncate w-full">
                Trợ lý
              </div>
              <div className="text-[9px] text-slate-500 leading-tight truncate w-full mt-0.5">
                tư vấn hoàn cảnh
              </div>
            </div>
          </button>
        </div>

        {/* 3. LƯỚI BỐ CỤC CHÍNH (Đồng bộ thứ bậc thị giác theo ref_desktop_web.png & ref_mobile_web.png) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-start">
          {/* CỘT TRÁI CHÍNH (8/12 = ~67%): Chứa THẺ THỦ TỤC & BÊN TRONG CÓ CÁC BƯỚC + ĐỊA ĐIỂM */}
          <div className="lg:col-span-8 space-y-2.5 lg:space-y-3.5">
            {/* THẺ THỦ TỤC CHÍNH */}
            <article className="bg-white rounded-xl lg:rounded-2xl border border-slate-200/80 p-3 lg:p-4 shadow-xs space-y-2.5 lg:space-y-3">
              {/* Header Thẻ: Sử dụng dữ liệu thật từ card */}
              <div className="space-y-2 border-b border-slate-100 pb-2.5">
                {/* Desktop Header Line matching ref_desktop_web.png */}
                <div className="hidden lg:flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>{cardStatus(primaryCard)}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    {primaryCard.review.reviewedAt ? `Rà soát: ${formattedReviewDate}` : "Chưa có ngày rà soát"}
                  </div>
                </div>

                {/* Mobile Header Line matching ref_mobile_web.png */}
                <div className="flex lg:hidden items-center justify-between gap-1.5 pb-0.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold border whitespace-nowrap shrink-0 bg-[#E6F7F0] text-[#0D9488] border-[#BDEBD7]">
                    <CheckCircle2 className="w-3 h-3 text-[#0D9488]" />
                    <span>{cardStatus(primaryCard)}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium shrink-0">
                    {primaryCard.review.reviewedAt ? `Rà soát: ${formattedReviewDate}` : "Chưa có ngày rà soát"}
                  </div>
                </div>

                {/* Tiêu đề thủ tục: Cỡ chữ rõ ràng, chuẩn phong cách */}
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug lg:hidden">
                  {primaryCard.title || "Thủ tục đăng ký tạm trú tại phường Liên Chiểu"}
                </h2>
                <h2 className="hidden lg:block text-xl font-bold text-slate-900 tracking-tight leading-snug">
                  {primaryCard.title || "Hướng dẫn chuẩn bị hồ sơ đăng ký tạm trú tại phường Liên Chiểu"}
                </h2>

                {/* Desktop Badge right under Title */}
                <div className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-md border w-fit text-emerald-700 bg-emerald-50 border-emerald-200/70">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{cardStatus(primaryCard)} • {jurisdictionLabel}</span>
                </div>

                {/* Đoạn tóm tắt thủ tục: Chữ dễ đọc, chuẩn >= 13px */}
                <p className="text-xs sm:text-sm leading-relaxed text-slate-600 pt-0.5 lg:hidden">
                  {primaryCard.body?.summary ||
                    "Đăng ký tạm trú là thủ tục hành chính thông báo nơi cư trú ngoài nơi thường trú tại phường Liên Chiểu."}
                </p>
                <p className="hidden lg:block text-xs text-slate-600 leading-relaxed pt-0.5">
                  {primaryCard.body?.summary ||
                    "Đăng ký tạm trú là thủ tục hành chính thông báo nơi cư trú tạm thời của công dân ngoài nơi thường trú. Công dân có thể thực hiện tại Công an Phường Liên Chiểu hoặc trực tuyến qua Cổng Dịch vụ công Bộ Công an."}
                </p>

                {/* Thanh công cụ trợ năng đa phương thức dành cho người lớn tuổi / người thân */}
                <div className="flex flex-wrap items-center gap-2 pt-2 pb-1">
                  <TextToSpeechButton
                    textToRead={`${primaryCard.title}. ${primaryCard.body?.summary || ""}. ${visibleSteps.map((s, i) => `Bước ${i + 1}: ${s.title}. ${s.description}`).join(". ")}`}
                    label="Nghe đọc các bước"
                  />
                  <PrintActionSlip card={primaryCard} />
                </div>

                <div className="lg:hidden pt-0.5">
                  <a
                    href="#cac-buoc-thuc-hien-mobile"
                    className="touch-target min-h-[36px] inline-flex items-center text-xs font-bold text-blue-600 hover:underline gap-1"
                  >
                    <span>Xem các bước thực hiện</span>
                    <span>↓</span>
                  </a>
                </div>

                {/* 1. KHỐI CÁC BƯỚC DI ĐỘNG (lg:hidden) - Render từ cùng visibleSteps với desktop, mỗi bước dùng button mở/đóng có aria-expanded */}
                <div id="cac-buoc-thuc-hien-mobile" className="lg:hidden bg-[#F0F6FC] rounded-2xl p-2.5 sm:p-3 border border-[#E2EEF9] space-y-2 mt-2">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Các bước thực hiện</span>
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {visibleSteps.length} bước
                    </span>
                  </div>

                  <div className="bg-white rounded-xl divide-y divide-slate-100 border border-[#E8EFF6] shadow-xs overflow-hidden">
                    {visibleSteps.map((step, idx) => {
                      const isBranchStep = branchTargetIds.has(step.id);
                      const colorScheme =
                        stepColorStyles[idx % stepColorStyles.length] || stepColorStyles[0];
                      const isExpanded = expandedStepIds.has(step.id);
                      const stepNumber = isBranchStep ? "★" : idx + 1;
                      const cleanTitle = step.title.replace(/^Bước\s+\d+:\s*/i, "").trim();

                      return (
                        <div key={step.id} className="transition-colors">
                          {/* Button mở/đóng nội dung bước, hỗ trợ aria-expanded và touch-target chuẩn */}
                          <button
                            type="button"
                            onClick={() => toggleStep(step.id)}
                            aria-expanded={isExpanded}
                            aria-controls={`step-mobile-content-${step.id}`}
                            id={`step-mobile-header-${step.id}`}
                            className="w-full touch-target min-h-[48px] flex items-center justify-between gap-3 py-3 px-3 text-left hover:bg-slate-50 active:bg-blue-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              {/* Vòng tròn số bước: tròn đều, nổi bật */}
                              <div
                                className={`w-7 h-7 min-w-[28px] min-h-[28px] rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-2xs ${
                                  isBranchStep ? "bg-amber-600" : colorScheme.bg
                                }`}
                              >
                                {stepNumber}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-[16px] font-bold text-slate-900 leading-snug">
                                  {cleanTitle}
                                </div>
                                {!isExpanded && (
                                  <div className="text-[16px] text-slate-500 leading-normal truncate mt-0.5">
                                    {step.description}
                                  </div>
                                )}
                              </div>
                            </div>
                            <span
                              className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                                isExpanded ? "rotate-90 text-blue-600" : ""
                              }`}
                              aria-hidden="true"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </button>

                          {/* Vùng nội dung chi tiết mở ra khi bấm */}
                          {isExpanded && (
                            <div
                              id={`step-mobile-content-${step.id}`}
                              role="region"
                              aria-labelledby={`step-mobile-header-${step.id}`}
                              className="px-3 pb-3.5 pt-1 pl-[48px] space-y-2 text-[16px] text-slate-700 leading-relaxed border-t border-slate-50 bg-slate-50/50"
                            >
                              <p className="font-normal">{step.description}</p>
                              {step.branches && step.branches.length > 0 && (
                                <div className="p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-[14px] font-medium flex items-start gap-1.5">
                                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                  <span>Lưu ý: Bước này có các hướng xử lý khác nhau tùy theo tình huống cá nhân của bạn (xem phần lựa chọn bên dưới).</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. BÊN TRONG THẺ: Lưới 2 cột con */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 pt-1">
                {/* CỘT BƯỚC THỰC HIỆN */}
                <div id="cac-buoc-thuc-hien" className="lg:col-span-7 space-y-3">
                  {/* Khối các bước thực hiện có khung nền mềm mại (chỉ hiện trên Desktop) */}
                  <div className="hidden lg:block bg-[#F4F9FD] rounded-2xl p-3 sm:p-4 border border-sky-100/80 space-y-2.5">
                    <div className="flex items-center justify-between pb-1">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Các bước thực hiện</span>
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {visibleSteps.length} bước
                      </span>
                    </div>

                    {/* Danh sách các bước với ĐƯỜNG NỐI NÉT ĐỨT (Dashed Line) chuẩn kiến trúc tham chiếu */}
                    <div className="space-y-2 relative">
                      {visibleSteps.map((step, idx) => {
                        const isBranchStep = branchTargetIds.has(step.id);
                        const colorScheme =
                          stepColorStyles[idx % stepColorStyles.length] || stepColorStyles[0];
                        const isLastStep = idx === visibleSteps.length - 1;
                        const originalTitle = step.title.replace(/^Bước\s+\d+:\s*/i, "").trim();
                        const displayTitle =
                          idx === 0 && originalTitle.toLowerCase().includes("chuẩn bị")
                            ? "Chuẩn bị hồ sơ"
                            : idx === 1 && (originalTitle.toLowerCase().includes("nộp") || originalTitle.toLowerCase().includes("điền"))
                            ? "Nộp hồ sơ"
                            : idx === 2 && (originalTitle.toLowerCase().includes("tiếp nhận") || originalTitle.toLowerCase().includes("xử lý") || originalTitle.toLowerCase().includes("nộp"))
                            ? "Tiếp nhận và xử lý"
                            : idx === 3 && originalTitle.toLowerCase().includes("nhận")
                            ? "Nhận kết quả"
                            : originalTitle;

                        return (
                          <div key={step.id} className="relative flex items-start gap-3">
                            {/* Cột icon số bước + Đường nối nét đứt thẳng đứng */}
                            <div className="flex flex-col items-center shrink-0 self-stretch pt-1">
                              {/* Vòng tròn số bước */}
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-2xs z-10 ${
                                  isBranchStep ? "bg-amber-600 text-white" : colorScheme.bg + " text-white"
                                }`}
                              >
                                {isBranchStep ? "★" : idx + 1}
                              </div>
                              {/* Đường nối nét đứt kéo dài tới bước tiếp theo (trừ bước cuối) */}
                              {!isLastStep && (
                                <div className="w-0 flex-1 border-l-2 border-dashed border-slate-300 my-1" />
                              )}
                            </div>

                            {/* Nội dung bước: Chữ to rõ, dễ đọc, không bị cắt xén */}
                            <div
                              className={`flex-1 rounded-xl p-2.5 sm:p-3 border transition-all ${
                                isBranchStep
                                  ? "bg-amber-50/80 border-amber-300 ring-1 ring-amber-300/40 shadow-2xs"
                                  : "bg-white border-slate-100 shadow-2xs hover:shadow-xs"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <h4 className="text-[13px] sm:text-sm font-bold text-slate-900 leading-snug">
                                    {displayTitle}
                                  </h4>
                                  <p className="text-[11.5px] sm:text-xs text-slate-600 mt-0.5 sm:mt-1 leading-relaxed">
                                    {step.description}
                                  </p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tùy chỉnh phân nhánh hoàn cảnh - Vùng chạm >= 44px, chữ >= 16px trên mobile */}
                  {primaryCard.body?.questions && primaryCard.body.questions.length > 0 && (
                    <section
                      aria-label="Lựa chọn tình huống cá nhân"
                      className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-2.5 lg:p-3 space-y-1.5"
                    >
                      <div className="flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-sky-700 shrink-0" aria-hidden="true" />
                        <h4 className="text-[16px] lg:text-xs font-bold text-sky-950">
                          Tình trạng chỗ ở của bạn:
                        </h4>
                      </div>

                      {primaryCard.body.questions.map((q) => {
                        const currentVal = answers[q.id];
                        return (
                          <div key={q.id} className="space-y-1">
                            <div className="text-[16px] lg:text-[11px] font-medium text-slate-700">
                              {q.prompt}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {q.options.map((opt) => {
                                const isSelected = currentVal === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleSelectOption(q.id, opt.value)}
                                    className={`touch-target min-h-[44px] px-3 py-1.5 rounded-xl text-[16px] lg:text-xs font-semibold transition-all flex items-center justify-center ${
                                      isSelected
                                        ? "bg-blue-600 text-white shadow-xs"
                                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </section>
                  )}
                </div>

                {/* CỘT ĐỊA ĐIỂM THỰC HIỆN (5/12 trên Desktop, Nối tiếp trên Mobile) */}
                {/* CỘT ĐỊA ĐIỂM THỰC HIỆN (5/12 trên Desktop, Nối tiếp trên Mobile) */}
                <div className="lg:col-span-5 space-y-2.5">
                  <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-2.5 lg:p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[16px] lg:text-xs font-bold text-slate-900 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span className="lg:hidden">Địa điểm tiếp nhận</span>
                        <span className="hidden lg:inline">Địa điểm thực hiện</span>
                      </h3>
                      {mapAction?.url ? (
                        <a
                          href={mapAction.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="touch-target min-h-[44px] inline-flex items-center text-xs lg:text-[10.5px] text-blue-600 hover:underline font-semibold"
                        >
                          <span className="lg:hidden">Bản đồ ↗</span>
                          <span className="hidden lg:inline">{mapAction.label || "Xem trên bản đồ"}</span>
                        </a>
                      ) : (
                        <span className="touch-target min-h-[44px] inline-flex items-center text-xs lg:text-[10.5px] text-slate-400 font-medium">
                          Chưa có bản đồ
                        </span>
                      )}
                    </div>

                    {/* Khối hiển thị vị trí / trạng thái bản đồ (thay thế minimap SVG trong luồng dữ liệu thật) */}
                    <LocationPanel card={hasPlace ? caPlaceCard! : primaryCard} />

                    {/* Chi tiết địa điểm - Mobile chữ >= 16px */}
                    <div className="space-y-1 text-slate-700">
                      <div className="font-bold text-slate-900 text-[16px] lg:text-xs">
                        {receptionTitle}
                      </div>

                      <div className="flex items-start gap-1.5 text-[16px] lg:text-[11px] text-slate-600">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">
                          {receptionAddress}
                        </span>
                      </div>

                      <div className="flex items-start gap-1.5 text-[16px] lg:text-[11px] text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium text-slate-700">Giờ làm việc: </span>
                          <span className="text-slate-500">
                            {receptionHours}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-[16px] lg:text-[11px] text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {receptionPhone ? (
                            <>Điện thoại liên hệ: <strong className="text-teal-700 font-bold">{receptionPhone}</strong></>
                          ) : (
                            <>Tổng đài DVC: <strong className="text-teal-700 font-bold">0236 1022</strong> (Đà Nẵng)</>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Nút chỉ đường nổi bật - Chỉ hiển thị link khi có action được xác minh trên thẻ */}
                    {mapAction?.url ? (
                      <a
                        href={mapAction.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="touch-target min-h-[44px] w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[16px] lg:text-xs text-center transition-colors shadow-2xs flex items-center justify-center gap-1.5 mt-0.5"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Chỉ đường</span>
                      </a>
                    ) : (
                      <div className="touch-target min-h-[44px] w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-400 font-medium text-xs text-center flex items-center justify-center gap-1.5 mt-0.5">
                        <span>Chưa có chỉ đường đã xác minh</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Khối Phiếu chuẩn bị hành trang mang theo */}
              <div className="pt-2 border-t border-slate-100">
                <PreparationSlip
                  card={primaryCard}
                  activeStepIds={activeStepIds}
                  answers={answers}
                  onRestoreAnswers={(restored) => setAnswers(restored)}
                />
              </div>
            </article>

            {/* Trợ lý La bàn (Navigation Assistant widget) - Vùng chạm >= 44px */}
            <section
              id="la-ban-assistant"
              className="bg-white rounded-xl lg:rounded-2xl border border-indigo-100/90 p-3 lg:p-4 space-y-2.5 shadow-2xs"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-[16px] lg:text-sm font-bold text-slate-900">
                      Trợ lý La bàn: Tư vấn theo hoàn cảnh
                    </h3>
                    <p className="text-xs lg:text-[11px] text-slate-500">
                      Chọn đúng tình huống để nhận lời khuyên xử lý nhanh gọn nhất.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {navigationAdvice.action}
                </span>
              </div>

              {/* Chuyển đổi hoàn cảnh - Vùng chạm >= 44px, chữ >= 16px trên mobile */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <button
                  type="button"
                  onClick={() => setProfileMode("self")}
                  className={`touch-target min-h-[44px] px-3 py-1.5 rounded-xl text-[16px] lg:text-xs font-semibold transition-all flex items-center justify-center ${
                    profileMode === "self"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <User className="w-4 h-4 mr-1.5" />
                  <span>Tự làm thủ tục</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileMode("shift")}
                  className={`touch-target min-h-[44px] px-3 py-1.5 rounded-xl text-[16px] lg:text-xs font-semibold transition-all flex items-center justify-center ${
                    profileMode === "shift"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Home className="w-4 h-4 mr-1.5" />
                  <span>Công nhân thuê trọ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileMode("proxy_yes")}
                  className={`touch-target min-h-[44px] px-3 py-1.5 rounded-xl text-[16px] lg:text-xs font-semibold transition-all flex items-center justify-center ${
                    profileMode === "proxy_yes"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <HeartHandshake className="w-4 h-4 mr-1.5" />
                  <span>Người thân làm hộ</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setStressFlag((prev) => (prev === "urgent" ? "clean" : "urgent"))
                  }
                  className={`touch-target min-h-[44px] px-3 py-1.5 rounded-xl text-[16px] lg:text-xs font-semibold transition-all flex items-center justify-center ${
                    stressFlag === "urgent"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Zap className="w-4 h-4 mr-1.5" />
                  <span>{stressFlag === "urgent" ? "Cần gấp" : "Tình huống khẩn"}</span>
                </button>
              </div>

              <div className="p-2.5 bg-indigo-50/70 rounded-lg border border-indigo-100 text-[16px] lg:text-xs text-indigo-950 leading-relaxed">
                <strong>Chỉ dẫn từ La bàn:</strong>{" "}
                {navigationAdvice.action === "URGENT_HELP"
                  ? hasPlace
                    ? `Tình huống cần gấp: Vui lòng mang giấy tờ trực tiếp đến ${caPlaceCard?.title} hoặc gọi Tổng đài 1022 để được ưu tiên hướng dẫn giải quyết nhanh nhất.`
                    : "Tình huống cần gấp: Vui lòng liên hệ cơ quan tiếp nhận có thẩm quyền tại địa bàn hoặc gọi Tổng đài 1022 để được hướng dẫn giải quyết."
                  : profileMode === "shift"
                  ? "Đối với công nhân ca kíp: Bạn nên chụp ảnh giấy tờ sẵn trên VNeID và xin xác nhận của Tổ công nhân tự quản để nộp hồ sơ trực tuyến bất kỳ lúc nào mà không cần nghỉ ca."
                  : "Tạo phiếu chuẩn bị theo nhánh đã duyệt; chuẩn bị đủ các đầu mục giấy tờ trước khi nộp hồ sơ."}
              </div>
            </section>
          </div>

          {/* CỘT PHẢI SIDEBAR (4/12 = ~33% chuẩn ref_desktop_web.png) */}
          <div className="lg:col-span-4 space-y-3 lg:space-y-3.5">
            {/* THẺ 1: Nguồn tham khảo chính thống - Chuẩn danh sách phẳng theo ref_desktop_web.png */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-4.5 shadow-xs space-y-3 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Nguồn tham khảo</h3>
              </div>

              <div className="divide-y divide-slate-100">
                {primaryCard.sources.map((src, srcIdx) => {
                  const sourceTitle = src.title.includes(" - ")
                    ? src.title.split(" - ").pop()?.trim() || src.title
                    : src.title;

                  let cleanDomain = src.url;
                  try {
                    const u = new URL(src.url);
                    cleanDomain = `${u.protocol}//${u.hostname}`;
                  } catch {
                    cleanDomain = src.url;
                  }

                  // Badge colors matching ref_desktop_web.png: 0: Red/gold national seal, 1: Blue government portal, 2: Rose law/statute
                  const badgeConfig =
                    srcIdx === 0
                      ? {
                          bg: "bg-red-50 text-red-600 border-red-200",
                          icon: (
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="9" />
                              <polygon points="12 4 14.5 9 20 9.5 16 13.5 17.5 19 12 16 6.5 19 8 13.5 4 9.5 9.5 9" />
                            </svg>
                          ),
                        }
                      : srcIdx === 1
                      ? {
                          bg: "bg-blue-50 text-blue-600 border-blue-200",
                          icon: (
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 21h18" />
                              <path d="M5 21V7l7-4 7 4v14" />
                              <path d="M9 10h1" /><path d="M9 14h1" /><path d="M14 10h1" /><path d="M14 14h1" />
                            </svg>
                          ),
                        }
                      : {
                          bg: "bg-rose-50 text-rose-600 border-rose-200",
                          icon: (
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                              <path d="M6 6h10" /><path d="M6 10h10" />
                            </svg>
                          ),
                        };

                  return (
                    <a
                      key={src.id}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="touch-target min-h-[44px] py-2.5 px-0.5 flex items-center justify-between gap-2.5 hover:bg-blue-50/50 rounded-xl transition-colors group w-full overflow-hidden"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                        {/* Circular Emblem matching exact design in ref_desktop_web.png */}
                        <div className={`w-7 h-7 rounded-full ${badgeConfig.bg} border flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                          {badgeConfig.icon}
                        </div>
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                            {sourceTitle}
                          </div>
                          <div className="text-[11px] text-blue-600 group-hover:underline truncate mt-0.5 font-medium">
                            {cleanDomain}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 mr-0.5" />
                    </a>
                  );
                })}
              </div>

              <div className="pt-1">
                <Link
                  href={`/cards/${primaryCard.id}`}
                  className="touch-target min-h-[40px] w-full py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 text-center transition-colors flex items-center justify-center"
                >
                  Xem thêm nguồn
                </Link>
              </div>
            </div>

            {/* THẺ 2: Bạn cần hỗ trợ thêm? (Highlight box hổ phách theo ref_desktop_web.png) */}
            <div className="rounded-xl lg:rounded-2xl p-3 lg:p-3.5 bg-gradient-to-br from-amber-50 to-orange-50/80 border border-amber-200/90 shadow-xs space-y-2 text-amber-950">
              <div className="flex items-center gap-1.5 font-bold text-[16px] lg:text-xs text-amber-900">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
                <span>Bạn cần hỗ trợ thêm?</span>
              </div>

              <p className="text-[16px] lg:text-xs text-amber-900/90 leading-relaxed">
                Hãy sử dụng Trợ lý La bàn hoặc liên hệ cơ quan chức năng để được hướng dẫn chi tiết hơn.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("la-ban-assistant");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="touch-target min-h-[44px] py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[16px] lg:text-xs rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Tư vấn hoàn cảnh</span>
                </button>

                <a
                  href="tel:02361022"
                  className="touch-target min-h-[44px] py-2 px-2 bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-900 font-bold text-[16px] lg:text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <span>Gọi ngay</span>
                </a>
              </div>
            </div>

            {/* THẺ 3: Danh sách các thủ tục liên quan khác nếu có */}
            {otherServices.length > 0 && (
              <div className="bg-white rounded-xl lg:rounded-2xl border border-slate-200/90 p-3 lg:p-3.5 shadow-xs space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Thủ tục liên quan:
                </h3>
                <div className="space-y-1">
                  {otherServices.map((svc) => (
                    <Link
                      key={svc.id}
                      href={`/cards/${svc.id}`}
                      className="touch-target min-h-[44px] flex items-center p-2 rounded-xl hover:bg-slate-50 text-[16px] lg:text-xs font-semibold text-slate-700 hover:text-blue-700 border border-slate-100 transition-colors"
                    >
                      <span className="truncate">{svc.title}</span>
                      <span className="ml-auto text-slate-400">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CardAccessGuard>
  );
}
