import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Handshake,
  Landmark,
  Library,
  Tag,
  Waves,
} from "lucide-react";
import { CardItem } from "../../components/CardItem";
import { ScenicBanner } from "../../components/ScenicBanner";
import { loadPublicCatalog } from "../../lib/content/loader";

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const allCards = await loadPublicCatalog();
  const discoverCards = allCards.filter((c) => c.type === "DISCOVER");

  return (
    <div className="w-full">
      {/* Khối tiêu đề SEO */}
      <div className="sr-only">
        <h1>Khám phá Liên Chiểu</h1>
        <p>Lối vào 3: Khám phá Liên Chiểu - Di tích và tư liệu lịch sử được kiểm chứng tại Liên Chiểu</p>
      </div>

      <ScenicBanner quoteText="Vùng đất của những di sản và văn hóa lâu đời" />

      <div className="responsive-container py-4 sm:py-8">
        {/* Layout chia 2 cột trên Desktop (giống 04A) */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* CỘT TRÁI (Main Content) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header / Hero greeting */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 sm:p-8 space-y-3.5 shadow-sm relative overflow-hidden">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-950 leading-tight">
                Khám phá Liên Chiểu
              </h2>
              <p className="text-amber-900 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Khám phá bề dày văn hóa, lịch sử và những nét đặc trưng chỉ có tại Liên Chiểu qua lăng kính thông tin có nguồn tham khảo.
              </p>

              {/* Quick links */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1 sm:flex-wrap relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-amber-700 text-xs font-semibold shadow-xs border border-amber-100 shrink-0 whitespace-nowrap">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>Câu chuyện văn hóa</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 text-amber-800 text-xs font-medium border border-amber-100 shrink-0 whitespace-nowrap">
                  <Landmark className="w-3.5 h-3.5 text-amber-600" />
                  <span>Di tích lịch sử</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 text-amber-800 text-xs font-medium border border-amber-100 shrink-0 whitespace-nowrap">
                  <Waves className="w-3.5 h-3.5 text-amber-600" />
                  <span>Nhịp sống ven biển</span>
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Library className="w-4.5 h-4.5 text-amber-600" />
                  <span>Tư liệu di sản &amp; văn hóa</span>
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tuyển tập các câu chuyện, tư liệu và di tích tại Liên Chiểu được tổng hợp từ nguồn chính thống.
              </p>

              {/* Cards list */}
              <div className="responsive-cards">
                {discoverCards.length === 0 && <p className="text-sm text-slate-600">Chưa có nội dung được phát hành trong mục này.</p>}
                {discoverCards.map((card) => (
                  <CardItem key={card.id} card={card} />
                ))}
              </div>
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
            <h2 className="font-bold text-slate-900 text-base">Tiếp tục khám phá</h2>
            <div className="space-y-2 text-sm">
              <Link className="touch-target flex items-center text-blue-600 hover:text-blue-800 underline font-medium" href="/places?category=food">
                Ẩm thực &amp; quán ăn
              </Link>
              <Link className="touch-target flex items-center text-blue-600 hover:text-blue-800 underline font-medium" href="/places?category=park">
                Công viên &amp; không gian xanh
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
