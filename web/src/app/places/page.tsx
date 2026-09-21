import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
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
    <div className="w-full">
      {/* SEO heading — ẩn với screen, hiện với screen reader */}
      <div className="sr-only">
        <h1>Địa điểm &amp; tiện ích – Phường Liên Chiểu</h1>
        <p>
          Tra cứu nhanh cơ quan hành chính, y tế, trường học, chợ và các tiện
          ích phục vụ đời sống tại Phường Liên Chiểu, Đà Nẵng.
        </p>
      </div>

      <div className="responsive-container py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto space-y-5">

          {/* ── Page header ── */}
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight flex items-center gap-2">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 shrink-0 mt-0.5 sm:mt-0" />
                Địa điểm &amp; Tiện ích
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 ml-7">
                Danh bạ{" "}
                <span className="font-semibold text-teal-700">
                  {placesDir.totalPlaces.toLocaleString("vi-VN")}
                </span>{" "}
                địa điểm trong ranh giới Phường Liên Chiểu mới
              </p>
            </div>
            <Link
              href="/"
              className="touch-target shrink-0 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-sm transition-colors inline-flex items-center gap-1.5"
              aria-label="Quay lại trang chủ"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Trang chủ</span>
            </Link>
          </div>

          {/* ── Thẻ địa điểm hạt nhân từ catalog (nếu có) ── */}
          {placeCards.length > 0 && (
            <div className="responsive-cards">
              {placeCards.map((card) => (
                <CardItem key={card.id} card={card} />
              ))}
            </div>
          )}

          {/* ── Danh bạ cộng đồng: Search box ở đầu tiên ── */}
          <CommunityPlacesDirectory
            initialPlaces={placesDir.places}
            totalCount={placesDir.totalPlaces}
            availableStreets={availableStreets}
          />

        </div>
      </div>
    </div>
  );
}
