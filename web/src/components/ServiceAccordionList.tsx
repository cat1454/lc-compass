"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileText,
  MapPin,
} from "lucide-react";
import { PublicCardDTO } from "../contracts/card";
import { cardStatus } from "../lib/card-status";

interface Props {
  cards: PublicCardDTO[];
}

export function ServiceAccordionList({ cards }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  if (cards.length === 0) {
    return (
      <div className="responsive-card liquid-glass-card rounded-xl border border-slate-200/90 shadow-2xs p-8 text-center space-y-3">
        <FileText className="w-10 h-10 text-slate-300 mx-auto" />
        <p className="text-slate-600 font-medium">Chưa có thủ tục nào được phát hành.</p>
        <Link
          href="/"
          className="touch-target inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-900 underline text-sm font-semibold"
        >
          Quay về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cards.map((card) => {
        const isOpen = openId === card.id;
        const verified = card.review.isVerified;
        const summary =
          card.type === "SERVICE" && card.body ? card.body.summary : null;
        const steps =
          card.type === "SERVICE" && card.body ? card.body.steps : [];
        const primarySource = card.sources[0];

        return (
          <article
            key={card.id}
            className="responsive-card liquid-glass-card rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all overflow-hidden"
          >
            {/* ── Header row: luôn hiển thị, bấm để bung/thu ── */}
            <button
              type="button"
              onClick={() => toggle(card.id)}
              aria-expanded={isOpen}
              aria-controls={`detail-${card.id}`}
              className="w-full flex items-center gap-3 p-4 sm:p-5 text-left group"
            >
              {/* Icon */}
              <span
                className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <FileText className="w-4.5 h-4.5 text-blue-600" />
              </span>

              {/* Title + badges */}
              <div className="flex-1 min-w-0 space-y-1">
                <h3
                  className="font-bold text-slate-900 text-base sm:text-lg leading-snug group-hover:text-teal-700 transition-colors"
                  style={{ overflowWrap: "break-word" }}
                >
                  {card.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[200px]">{card.jurisdiction.label}</span>
                  </span>
                  {verified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {cardStatus(card)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      {cardStatus(card)}
                    </span>
                  )}
                </div>
              </div>

              {/* Chevron xoay khi mở */}
              <ChevronDown
                className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-teal-600" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {/* ── Chi tiết (bung khi ấn) ── */}
            {isOpen && (
              <div
                id={`detail-${card.id}`}
                className="px-4 sm:px-5 pb-5 border-t border-slate-100 space-y-4 pt-4"
              >
                {/* Tóm tắt */}
                {summary && (
                  <p className="text-sm text-slate-600 leading-relaxed">{summary}</p>
                )}

                {/* Preview bước thực hiện */}
                {steps.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Các bước thực hiện
                    </p>
                    <ol className="space-y-2">
                      {steps.slice(0, 4).map((step) => (
                        <li key={step.id} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {step.stepNumber}
                          </span>
                          <span className="leading-snug" style={{ overflowWrap: "break-word" }}>
                            {step.title}
                          </span>
                        </li>
                      ))}
                      {steps.length > 4 && (
                        <li className="text-xs text-slate-400 pl-7">
                          + {steps.length - 4} bước tiếp theo trong hướng dẫn đầy đủ…
                        </li>
                      )}
                    </ol>
                  </div>
                )}

                {/* Nguồn */}
                {primarySource && (
                  <p className="text-xs text-slate-400 border-t border-slate-100 pt-3">
                    <span className="font-semibold text-slate-500">Nguồn:</span>{" "}
                    {primarySource.publisher}
                    {primarySource.sourceDate && ` (${primarySource.sourceDate})`}
                  </p>
                )}

                {/* CTA — giữ nguyên style teal của dự án */}
                <Link
                  href={`/cards/${card.id}`}
                  className="touch-target px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700
                             text-white font-semibold text-sm transition-colors shadow-2xs
                             inline-flex items-center gap-2"
                >
                  <span>Xem hướng dẫn &amp; Chuẩn bị</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
