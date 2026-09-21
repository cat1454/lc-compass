"use client";

import { useMemo, useState } from "react";
import {
  Compass,
  User,
  Home,
  HeartHandshake,
  Building2,
  Zap,
  Lightbulb,
  Info,
  ClipboardList,
} from "lucide-react";
import { PublicServiceCardDTO } from "../contracts/card";
import { ACTION_TEXT, MVP_IDS } from "../lib/navigation/constants";
import { decideRoute } from "../lib/navigation/decide";
import { ProfileMode, StressFlag } from "../lib/navigation/types";
import { PreparationSlip } from "./PreparationSlip";
import { TextToSpeechButton } from "./multimodal/TextToSpeechButton";
import { PrintActionSlip } from "./multimodal/PrintActionSlip";

interface InteractiveServiceFlowProps {
  card: PublicServiceCardDTO;
}

export function InteractiveServiceFlow({ card }: InteractiveServiceFlowProps) {
  // Trạng thái các câu trả lời của người dùng: questionId -> value
  // KHÔNG mặc định người dùng có hợp đồng; khởi tạo rỗng để người dùng tự chọn
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Tích hợp Lõi điều hướng (Navigation Engine): Cho phép người dùng kiểm tra phân tích tình huống
  const [profileMode, setProfileMode] = useState<ProfileMode>("self");
  const [stressFlag, setStressFlag] = useState<StressFlag>("clean");

  // Tính toán khuyến nghị từ Lõi điều hướng
  const navigationDiagnosis = useMemo(() => {
    const primaryIntentId = card.intentIds[0] || "cu_tru-01";
    return decideRoute({
      intentId: primaryIntentId,
      profileMode,
      flags: [stressFlag],
      supportedIntentIds: MVP_IDS,
    });
  }, [card.intentIds, profileMode, stressFlag]);

  // Thuật toán duyệt đồ thị bước theo dữ liệu hợp đồng (100% data-driven, không hardcode ID bước)
  const { activeSteps, activeStepIds } = useMemo(() => {
    if (!card.body?.steps || card.body.steps.length === 0) {
      return { activeSteps: [], activeStepIds: [] };
    }

    const steps = card.body.steps;
    type StepType = (typeof steps)[number];
    const stepMap = new Map<string, StepType>(steps.map((s) => [s.id, s]));
    const resolvedSteps: StepType[] = [];
    const visited = new Set<string>();

    // Bắt đầu từ bước 1 hoặc bước đầu tiên trong danh sách
    let currentStep: StepType | undefined = steps.find((s) => s.stepNumber === 1) || steps[0];

    while (currentStep && !visited.has(currentStep.id)) {
      visited.add(currentStep.id);
      resolvedSteps.push(currentStep);

      let nextId: string | undefined = undefined;

      // Duyệt qua các nhánh rẽ điều kiện (branches) của bước hiện tại
      if (currentStep.branches && currentStep.branches.length > 0) {
        for (const branch of currentStep.branches) {
          const cond = branch.when ?? branch.condition;
          if (cond && answers[cond.questionId] === cond.equals) {
            nextId = branch.nextStepId;
            break;
          }
        }
      }

      // Nếu không khớp nhánh rẽ nào, chuyển tiếp đến bước mặc định
      if (!nextId) {
        nextId = currentStep.nextStepId;
      }

      currentStep = nextId ? stepMap.get(nextId) : undefined;
    }

    return {
      activeSteps: resolvedSteps,
      activeStepIds: resolvedSteps.map((s) => s.id),
    };
  }, [card.body?.steps, answers]);

  if (!card.body) {
    return null;
  }

  const handleSelectOption = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Kiểm tra xem người dùng đã trả lời hết các câu hỏi tình huống chưa
  const hasAnsweredQuestions = card.body.questions.some((q) => !!answers[q.id]);

  return (
    <div className="space-y-8">
      {/* Tích hợp Lõi Điều Hướng (Navigation Engine Diagnosis) */}
      <section
        aria-label="Tư vấn định tuyến từ Lõi điều hướng"
        className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 space-y-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-700 shrink-0" aria-hidden="true" />
            <h3 className="text-base font-bold text-indigo-950">
              Trợ lý La bàn (Navigation Engine): Định hướng theo hoàn cảnh
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold">
            Chế độ: {navigationDiagnosis.action}
          </span>
        </div>

        <p className="text-xs text-indigo-900 leading-relaxed">
          Tùy theo hoàn cảnh và áp lực thực tế, Lõi điều hướng sẽ xác định bạn nên chuẩn bị hồ sơ tự túc, nộp trực tiếp hay qua cổng an toàn.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => setProfileMode("self")}
            className={`touch-target px-3 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
              profileMode === "self"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-indigo-100"
            }`}
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span>Tự làm thủ tục</span>
          </button>
          <button
            type="button"
            onClick={() => setProfileMode("shift")}
            className={`touch-target px-3 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
              profileMode === "shift"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-indigo-100"
            }`}
          >
            <Home className="w-3.5 h-3.5 shrink-0" />
            <span>Công nhân ca kíp / Thuê trọ</span>
          </button>
          <button
            type="button"
            onClick={() => setProfileMode("proxy_yes")}
            className={`touch-target px-3 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
              profileMode === "proxy_yes"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-indigo-100"
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
            <span>Người thân làm hộ (Có ủy quyền)</span>
          </button>
          <button
            type="button"
            onClick={() => setProfileMode("proxy_no")}
            className={`touch-target px-3 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
              profileMode === "proxy_no"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-indigo-100"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span>Chưa ủy quyền (Làm việc trực tiếp)</span>
          </button>
          <button
            type="button"
            onClick={() => setStressFlag(stressFlag === "urgent" ? "clean" : "urgent")}
            className={`touch-target px-3 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
              stressFlag === "urgent"
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-100 border border-indigo-100"
            }`}
          >
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>{stressFlag === "urgent" ? "Đang chọn: Cần gấp" : "Tình huống khẩn cấp"}</span>
          </button>
        </div>

        <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
          <strong>Chỉ dẫn từ La bàn:</strong>{" "}
          {ACTION_TEXT[navigationDiagnosis.action] ||
            "Chuẩn bị kỹ giấy tờ theo danh mục kiểm tra bên dưới trước khi thực hiện thao tác."}
        </div>
      </section>

      {/* Khối câu hỏi tương tác phân nhánh điều kiện */}
      {card.body.questions.length > 0 && (
        <section
          aria-label="Lựa chọn tình huống cá nhân"
          className="bg-teal-50/70 border border-teal-200 rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-teal-700 shrink-0" aria-hidden="true" />
            <h3 className="text-base font-bold text-teal-900">
              Lựa chọn tình huống thực tế của bạn để nhận hướng dẫn phù hợp
            </h3>
          </div>

          {!hasAnsweredQuestions && (
            <div className="p-3 bg-teal-100/60 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-teal-800 shrink-0" />
              <span>Hãy nhấp chọn tình huống chỗ ở hiện tại của bạn bên dưới. Hệ thống sẽ tự động điều chỉnh quy trình và bổ sung các bước xác nhận cần thiết.</span>
            </div>
          )}

          {card.body.questions.map((q) => {
            const currentVal = answers[q.id];
            return (
              <div key={q.id} className="space-y-3 bg-white p-4 rounded-xl border border-teal-100">
                <div className="font-semibold text-slate-800 text-sm">{q.prompt}</div>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => {
                    const isSelected = currentVal === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt.value)}
                        className={`touch-target px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          isSelected
                            ? "bg-teal-600 text-white shadow-sm ring-2 ring-teal-600/30"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                  {q.unknownOption && (
                    <button
                      type="button"
                      onClick={() => handleSelectOption(q.id, q.unknownOption!.value)}
                      className={`touch-target px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        currentVal === q.unknownOption.value
                          ? "bg-amber-600 text-white shadow-sm ring-2 ring-amber-600/30"
                          : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                      }`}
                    >
                      {q.unknownOption.label}
                    </button>
                  )}
                </div>

                {/* Hướng dẫn khi chọn Không rõ */}
                {q.unknownOption && currentVal === q.unknownOption.value && (
                  <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs leading-relaxed flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-800 shrink-0" />
                    <span><strong>Chỉ dẫn cho bạn:</strong> {q.unknownOption.guidance}</span>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Danh sách các bước trong luồng thủ tục */}
      <section aria-label="Các bước thủ tục chi tiết" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-slate-700 shrink-0" aria-hidden="true" />
            <span>Các bước thực hiện chi tiết ({activeSteps.length} bước)</span>
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <TextToSpeechButton
              textToRead={`${card.title}. ${card.body?.summary || ""}. ${activeSteps.map((s) => `Bước ${s.stepNumber}: ${s.title}. ${s.description}`).join(". ")}`}
              label="Nghe đọc các bước"
            />
            <PrintActionSlip card={card} />
          </div>
        </div>

        <div className="space-y-4">
          {activeSteps.map((step) => {
            const isBranchStep = step.id.includes("support") || step.id.includes("branch");

            return (
              <div
                key={step.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isBranchStep
                    ? "bg-amber-50/60 border-amber-300 ring-2 ring-amber-400/20"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 ${
                        isBranchStep ? "bg-amber-600 text-white" : "bg-teal-600 text-white"
                      }`}
                    >
                      {step.stepNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base leading-snug">
                        {step.title}
                      </h4>
                      {isBranchStep && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-semibold">
                          Nhánh điều kiện phân nhánh theo tình huống đã chọn
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-700 leading-relaxed pl-11">
                  {step.description}
                </p>

                {step.requiredDocs.length > 0 && (
                  <div className="mt-3 pl-11">
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Giấy tờ cần có ở bước này:
                    </div>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {step.requiredDocs.map((doc, idx) => (
                        <li key={idx}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Phiếu chuẩn bị hành trang có thể in/lưu */}
      <PreparationSlip
        card={card}
        activeStepIds={activeStepIds}
        answers={answers}
        onRestoreAnswers={(restored) => setAnswers(restored)}
      />
    </div>
  );
}
