"use client";

import { cardStatus } from "../lib/card-status";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Landmark,
  MapPin,
} from "lucide-react";
import React from "react";
import { PublicCardDTO } from "../contracts/card";

interface CardItemProps {
  card: PublicCardDTO;
}

export function CardItem({ card }: CardItemProps) {
  const typeConfig = {
    SERVICE: {
      label: "THỦ TỤC",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <FileText className="w-3.5 h-3.5" />,
      entryLink: "/services",
    },
    PLACE: {
      label: "ĐỊA ĐIỂM",
      color: "bg-teal-50 text-teal-700 border-teal-200",
      icon: <MapPin className="w-3.5 h-3.5" />,
      entryLink: "/places",
    },
    DISCOVER: {
      label: "KHÁM PHÁ",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Landmark className="w-3.5 h-3.5" />,
      entryLink: "/discover",
    },
  }[card.type];

  const primarySource = card.sources[0];

  return (
    <article className="responsive-card liquid-glass-card rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all p-4 sm:p-5 flex flex-col justify-between h-full">
      <div className="space-y-3 flex-1 flex flex-col">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-bold border whitespace-nowrap shrink-0 ${typeConfig.color}`}
          >
            {typeConfig.icon}
            <span>{typeConfig.label}</span>
          </span>

          {card.review.isVerified ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 whitespace-nowrap shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{cardStatus(card)}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-semibold border border-amber-200 whitespace-nowrap shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{cardStatus(card)}</span>
            </span>
          )}
        </div>

        {/* Card Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          <Link
            href={`/cards/${card.id}`}
            className="hover:text-teal-700 transition-colors focus:outline-none focus:underline"
          >
            {card.title}
          </Link>
        </h3>

        {/* Jurisdiction */}
        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{card.jurisdiction.label}</span>
        </div>

        {/* Body Overview based on Type */}
        <div className="text-sm text-slate-600 leading-relaxed pt-1 flex-1">
          {card.type === "SERVICE" && card.body && (
            <p className="line-clamp-3">{card.body.summary}</p>
          )}
          {card.type === "PLACE" && card.body && (
            <div className="space-y-1">
              <p className="line-clamp-2">
                <strong>Chức năng:</strong> {card.body.function}
              </p>
              <p className="text-xs text-slate-500 line-clamp-1">
                <strong>Địa chỉ:</strong> {card.body.address}
              </p>
            </div>
          )}
          {card.type === "DISCOVER" && card.body && (
            <div className="space-y-1">
              <p className="line-clamp-3">{card.body.story}</p>
              <p className="text-xs text-slate-500">
                <strong>Địa bàn:</strong> {card.body.locality}
              </p>
            </div>
          )}
        </div>

        {/* Source citation summary */}
        {primarySource && (
          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Nguồn:</span> {primarySource.publisher}
            {primarySource.sourceDate && ` (${primarySource.sourceDate})`}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 mt-auto border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          href={`/cards/${card.id}`}
          className="touch-target px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors text-center w-full shadow-2xs inline-flex items-center justify-center gap-1.5"
        >
          <span>{card.type === "SERVICE" ? "Xem hướng dẫn & Chuẩn bị" : "Xem chi tiết thẻ"}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
