import Link from "next/link";
import { ArrowLeft, MapPin, Sparkles } from "lucide-react";
import { CardItem } from "../../components/CardItem";
import { loadPublicCatalog } from "../../lib/content/loader";
import { CommunityPlacesDirectory } from "../../components/CommunityPlacesDirectory";
import { loadPlacesDirectory } from "../../lib/places-directory/loader";

export const dynamic = "force-dynamic";

export default async function PlacesPage() {
  const allCards = await loadPublicCatalog();
  const placeCards = allCards.filter((c) => c.type === "PLACE");
  const placesDir = await loadPlacesDirectory();
  const streetsSet = new Set<string>();
  placesDir.places.forEach((p) => streetsSet.add(p.street));
  const availableStreets = Array.from(streetsSet).sort();

  return (
    <div className="w-full space-y-6">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-teal-600 shrink-0" />
            Địa điểm &amp; Tiện ích
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Danh bạ{" "}
            <span className="font-semibold text-teal-700">
              {placesDir.totalPlaces.toLocaleString("vi-VN")}
            </span>{" "}
            địa điểm trong ranh giới Phường Liên Chiểu mới
          </p>
        </div>
        <Link
          href="/"
          className="touch-target shrink-0 self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors inline-flex items-center gap-1.5"
          aria-label="Quay lại trang chủ"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trang chủ</span>
        </Link>
      </div>

      {/* ── 1. Danh bạ cộng đồng: Ô tìm kiếm và bộ lọc đặt ngay sát phía trên cùng ── */}
      <CommunityPlacesDirectory
        initialPlaces={placesDir.places}
        totalCount={placesDir.totalPlaces}
        availableStreets={availableStreets}
      />

      {/* ── 2. Thẻ địa điểm hạt nhân đã thẩm định (Featured Places Cards) ── */}
      {placeCards.length > 0 && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Địa điểm trọng điểm đã thẩm định</span>
          </div>
          <div className="responsive-cards">
            {placeCards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
