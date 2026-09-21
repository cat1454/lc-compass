import Link from "next/link";
import {
  ArrowLeft,
  Building,
  Bus,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Compass,
  Home,
  Map,
  MapPin,
} from "lucide-react";
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
      {/* Khối tiêu đề SEO */}
      <div className="sr-only">
        <h1>Địa điểm &amp; tiện ích</h1>
        <p>Cẩm nang cộng đồng - Tra cứu nhanh các cơ quan hành chính và dịch vụ thiết yếu tại Liên Chiểu</p>
      </div>

      <div className="responsive-container py-4 sm:py-8">
        {/* Layout chia 2 cột trên Desktop (giống 04A) */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* CỘT TRÁI (Main Content) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header / Hero greeting */}
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 sm:p-8 space-y-3.5 shadow-sm relative overflow-hidden">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-950 leading-tight">
                Địa điểm &amp; tiện ích
              </h2>
              <p className="text-blue-800 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Tìm cơ quan, trường học, y tế, mua sắm và các tiện ích phục vụ đời sống tại phường Liên Chiểu.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-4.5 h-4.5 text-blue-600" />
                  <span>Danh bạ phục vụ cộng đồng</span>
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tra cứu địa điểm theo nhu cầu và tuyến đường. Xem nguồn và trạng thái của từng nội dung.
              </p>

              {/* Thẻ địa điểm hạt nhân (nếu có trong catalog) */}
              {placeCards.length > 0 && (
                <div className="responsive-cards mb-8">
                  {placeCards.map((card) => (
                    <CardItem key={card.id} card={card} />
                  ))}
                </div>
              )}

              {/* Danh bạ tiện ích đời sống cộng đồng 1.000+ địa điểm */}
              <CommunityPlacesDirectory
                initialPlaces={placesDir.places}
                totalCount={placesDir.totalPlaces}
                availableStreets={availableStreets}
              />
            </div>

            {/* Back button */}
            <div className="pt-4">
              <Link
                href="/"
                className="touch-target px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại trang chủ</span>
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-4 rounded-2xl sm:rounded-3xl border bg-white/95 backdrop-blur-sm p-5 sm:p-6 space-y-3 self-start shadow-xs mt-6 lg:mt-0">
            <h2 className="font-bold text-slate-900 text-base">Thông tin cộng đồng</h2>
            <div className="space-y-2 text-sm">
              <Link className="touch-target flex items-center text-blue-600 hover:text-blue-800 underline font-medium" href="/services">
                Thủ tục &amp; hướng dẫn
              </Link>
              <Link className="touch-target flex items-center text-blue-600 hover:text-blue-800 underline font-medium" href="/discover">
                Khám phá Liên Chiểu
              </Link>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pt-1 border-t border-slate-100">
              Đối chiếu nguồn và thông tin liên hệ trước khi đến địa điểm.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
