import { cardStatus } from "../lib/card-status";
import { LocationPanel } from "./LocationPanel";
import { isMapAction } from "../lib/map-links";
import React from "react";
import Link from "next/link";
import {
  BookOpen,
  MapPin,
  Scroll,
  Phone,
  Globe,
  ExternalLink,
} from "lucide-react";
import type { PublicCardDTO } from "../contracts/card";

interface DiscoverDetailViewProps {
  card: PublicCardDTO;
}

export const DiscoverDetailView: React.FC<DiscoverDetailViewProps> = ({ card }) => {
  if (card.type !== "DISCOVER" || !card.body) {
    return null;
  }

  const { title, review, isSynthetic, body, actions, sources } = card;

  // Trạng thái thông tin chính thống
  const getStatusLabel = () => {
    return {
      text: cardStatus(card),
      className: "bg-emerald-100 text-emerald-800 border-emerald-300",
    };
  };

  const statusLabel = getStatusLabel();

  return (
    <div className="w-full">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
        {/* Main Content (Left Column on Desktop) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusLabel.className}`}>
                {statusLabel.text}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {review.reviewedAt ? `Rà soát: ${review.reviewedAt}` : "Chưa có ngày rà soát"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              {title}
            </h1>

            <div className="space-y-4 text-sm sm:text-base text-slate-700 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
                  <span>Câu chuyện di sản & văn hóa địa phương</span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{body.story}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
                    <span>Địa bàn xác nhận</span>
                  </div>
                  <p className="leading-relaxed">{body.locality}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <Scroll className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
                    <span>Nguồn tài liệu</span>
                  </div>
                  <p className="leading-relaxed">{body.authorOrSource}</p>
                  <div className="pt-2">
                    <span className="text-xs text-slate-500">Bản quyền & Sử dụng:</span><br/>
                    <span className="font-semibold text-slate-700">{body.mediaRights}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Claims context if available */}
          {body.claimsWithSources && body.claimsWithSources.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-lg">Thông tin thêm</h3>
              <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside">
                {body.claimsWithSources.map((claim) => (
                  <li key={claim.id}>{claim.claim}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar (Right Column on Desktop) */}
        <div className="lg:col-span-4 space-y-6 mt-8 lg:mt-0">
          <LocationPanel card={card} />
          {/* Actions Widget */}
          {actions && actions.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">
                Thao tác nhanh
              </h3>
              <div className="flex flex-col gap-3">
                {actions.map((act) => {
                  const isLink = act.type === "external_link";
                  const isPhone = act.type === "phone";
                  const isMap = isMapAction(act);
                  const href = act.url || (act.contact ? `tel:${act.contact}` : "#");

                  return (
                    <a
                      key={act.id}
                      href={href}
                      target={isLink ? "_blank" : undefined}
                      rel={isLink ? "noopener noreferrer" : undefined}
                      className="touch-target px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        {isMap && <MapPin className="w-4 h-4 shrink-0" />}
                        {isLink && !isMap && <Globe className="w-4 h-4 shrink-0" />}
                        {isPhone && <Phone className="w-4 h-4 shrink-0" />}
                        <span>{act.label}</span>
                      </span>
                      {isLink && <ExternalLink className="w-4 h-4 shrink-0 opacity-80" />}
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {/* Source/References Widget */}
          <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4 shadow-sm" aria-label="Nguồn tham khảo">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
              <span>Nguồn tham khảo</span>
            </h3>
            <div className="space-y-3">
              {sources && sources.length > 0 ? (
                sources.map((s) => (
                  <div key={s.id} className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="font-semibold text-slate-800">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-700 hover:underline inline-flex items-start gap-1"
                      >
                        <span>{s.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-60 mt-0.5" />
                      </a>
                    </div>
                    <div className="text-slate-500">
                      Cơ quan: {s.publisher}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic">Không có nguồn tham chiếu</div>
              )}
            </div>
          </section>

          {/* Need help widget */}
          <section className="bg-slate-50 rounded-3xl border border-slate-200 p-5 text-center space-y-3 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm">Bạn cần hỗ trợ thêm?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Trợ lý AI của LC Compass luôn sẵn sàng giải đáp các thắc mắc về văn hóa và di sản tại khu vực.
            </p>
            <button className="touch-target w-full px-4 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-100 transition-colors">
              Hỏi Trợ lý AI
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
