import Link from "next/link";
import { ArrowLeft, Calendar, Sparkles } from "lucide-react";
import { loadEventsCatalog } from "../../lib/content/events-loader";
import { EventMapView } from "../../components/events/EventMapView";
import { loadEventBoundary } from "../../lib/content/event-boundary";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sự kiện Liên Chiểu | Cầu nối Sự kiện & Bản đồ Khám phá",
  description:
    "Lịch sự kiện văn hóa, thể thao, cộng đồng và hoạt động Đoàn tại phường Liên Chiểu, có nguồn đối chiếu.",
};

export default async function EventsPage() {
  const catalog = await loadEventsCatalog();
  const boundary = loadEventBoundary();

  return (
    <div className="w-full space-y-4">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div className="min-w-0">
          <h1 className="text-[20px] sm:text-2xl font-bold text-slate-900 leading-[1.25] flex items-center gap-2 tracking-tight">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 shrink-0" aria-hidden="true" />
            <span className="truncate">Cầu nối Sự kiện Liên Chiểu</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal leading-normal">
            Khám phá sự kiện và hoạt động cộng đồng quanh Liên Chiểu.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            className="touch-target px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-medium text-xs sm:text-sm transition-colors inline-flex items-center gap-1.5"
            aria-label="Quay lại trang chủ"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">Trang chủ</span>
          </Link>
        </div>
      </div>

      {/* ── Main Map & Bottom Sheet Component ── */}
      {process.env.EVENTS_PREVIEW_CATALOG && (
        <p role="note" className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">
          Danh mục xem trước — dữ liệu kiểm thử, không phải sự kiện thật.
        </p>
      )}
      <EventMapView
        initialEvents={catalog.events}
        boundary={boundary.boundary}
        boundaryNote={boundary.note}
        boundarySource={boundary.sourceUrl}
      />
    </div>
  );
}
