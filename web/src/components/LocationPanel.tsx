import React from "react";
import { MapPin, ExternalLink } from "lucide-react";
import type { PublicCardDTO } from "../contracts/card";
import { getLocationLink } from "../lib/map-links";

/** Shared insertion point for a future coordinate-backed map; address remains readable. */
export function LocationPanel({ card }: { card: PublicCardDTO }) {
  if (card.availability !== "available" || !card.body) return null;
  const link = getLocationLink(card);
  const address = card.type === "PLACE" ? card.body.address :
    card.type === "DISCOVER" ? card.body.locality : "Chưa xác minh cơ quan tiếp nhận hồ sơ tại địa bàn";
  return <section aria-label="Vị trí và bản đồ" data-testid="location-panel" className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
    <h2 className="flex items-center gap-2 font-bold text-slate-900"><MapPin className="h-5 w-5 shrink-0 text-teal-700" aria-hidden="true" />Vị trí và bản đồ</h2>
    <p className="text-sm leading-relaxed break-words text-slate-700">{address}</p>
    {card.isSynthetic ? <p className="text-sm text-slate-500">Địa điểm mô phỏng, không dùng để chỉ đường.</p> : <>
      <p className="text-sm text-slate-500">{card.type === "PLACE" ? "Tìm theo địa chỉ; hãy đối chiếu địa điểm trên bản đồ trước khi di chuyển." : "Chưa có tọa độ được đối chiếu cho địa điểm này."}</p>
      {link ? <a href={link.url} target="_blank" rel="noopener noreferrer" className="touch-target min-h-[44px] flex items-center justify-between gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800">
        <span>{link.label}</span><ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
      </a> : <p className="text-sm text-slate-500">Chưa có bản đồ</p>}
    </>}
  </section>;
}
