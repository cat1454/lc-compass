import { cardStatus } from "../../../lib/card-status";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  Ban,
  ArrowLeft,
  FileText,
  MapPin,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  BookOpen,
  ExternalLink,
  Check,
  X,
} from "lucide-react";
import { CardAccessGuard } from "../../../components/CardAccessGuard";
import { InteractiveServiceFlow } from "../../../components/InteractiveServiceFlow";
import { PlaceDetailView } from "../../../components/PlaceDetailView";
import { DiscoverDetailView } from "../../../components/DiscoverDetailView";
import { getPublicCardById, loadPublicCatalog } from "../../../lib/content/loader";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CardDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getPublicCardById(id);

  if (result.availability === "not_found") {
    notFound();
  }

  // Trạng thái thẻ không khả dụng (expired hoặc withdrawn) -> Bảo vệ fail-closed
  if (result.availability !== "available" || !result.card) {
    const isExpired = result.availability === "expired";
    return (
      <div className="responsive-container py-12 max-w-2xl mx-auto space-y-6">
        <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-4">
          <div aria-hidden="true">
            {isExpired ? (
              <Clock className="w-10 h-10 text-amber-600" />
            ) : (
              <Ban className="w-10 h-10 text-rose-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold">
            {isExpired ? "Thông tin tạm ngưng do quá hạn rà soát" : "Thẻ nội dung đã được rút"}
          </h1>
          <p className="text-sm leading-relaxed text-amber-900">
            {result.message ||
              "Nội dung thẻ đã quá hạn rà soát định kỳ hoặc đã được cơ quan phụ trách rút khỏi danh mục áp dụng."}
          </p>
          <div className="pt-2 text-xs text-amber-800">
            Cơ chế bảo vệ dữ liệu tự động ngăn ngừa việc người dân tiếp cận các chỉ dẫn cũ hoặc sai lệch. Vui lòng liên hệ trực tiếp đơn vị phụ trách hoặc kiểm tra trên Cổng thông tin chính thức.
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/"
            className="touch-target px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về trang chủ tra cứu</span>
          </Link>
        </div>
      </div>
    );
  }

  const card = result.card;

  const typeConfig = {
    SERVICE: {
      label: "THỦ TỤC & HÀNH CHÍNH",
      color: "bg-blue-50 text-blue-800 border-blue-200",
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    PLACE: {
      label: "ĐỊA ĐIỂM THIẾT YẾU",
      color: "bg-teal-50 text-teal-800 border-teal-200",
      icon: <MapPin className="w-3.5 h-3.5" />,
    },
    DISCOVER: {
      label: "KHÁM PHÁ VĂN HÓA",
      color: "bg-amber-50 text-amber-800 border-amber-200",
      icon: <Compass className="w-3.5 h-3.5" />,
    },
  }[card.type];

  return (
    <CardAccessGuard card={card}>
      <div className="responsive-container py-8 max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb & Top Bar */}
      <nav aria-label="Đường dẫn trang" className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/" className="hover:text-teal-700">Trang chủ</Link>
        <span>/</span>
        <Link href={card.type === "SERVICE" ? "/services" : card.type === "PLACE" ? "/places" : "/discover"} className="hover:text-teal-700">
          {typeConfig.label}
        </Link>
        <span>/</span>
        <span className="text-slate-800 truncate">{card.title}</span>
      </nav>

      {/* Main Card Header */}
      <div className="space-y-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${typeConfig.color}`}>
              <span aria-hidden="true">{typeConfig.icon}</span>
              <span>{typeConfig.label}</span>
            </span>

            {card.review.isVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{cardStatus(card)}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{cardStatus(card)}</span>
              </span>
            )}
          </div>

          <div className="text-xs text-slate-500">
            Mã thẻ: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{card.id}</code> (v{card.version})
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
          {card.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 border-t border-b border-slate-100 py-3">
          <div className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <strong>Địa bàn:</strong> {card.jurisdiction.label}
          </div>
          <div className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <strong>Ngày rà soát:</strong> {card.review.reviewedAt || "Chưa có ngày rà soát"}
          </div>
          <div className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <strong>Hạn rà soát:</strong> {card.review.reviewDue}
          </div>
        </div>

        {/* Phạm vi áp dụng & Ngoại trừ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
          {card.applicability.length > 0 && (
            <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 space-y-1.5">
              <div className="font-bold text-teal-950 text-xs uppercase tracking-wider inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-teal-600" />
                <span>Áp dụng cho:</span>
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-1 text-xs sm:text-sm">
                {card.applicability.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {card.exclusions.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-1.5">
              <div className="font-bold text-rose-950 text-xs uppercase tracking-wider inline-flex items-center gap-1">
                <X className="w-3.5 h-3.5 text-rose-600" />
                <span>Trường hợp không áp dụng (ngoại trừ):</span>
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-1 text-xs sm:text-sm">
                {card.exclusions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Nội dung chi tiết theo từng loại thẻ */}
      {card.type === "SERVICE" && card.body && (
        <InteractiveServiceFlow card={card} />
      )}

      {card.type === "PLACE" && card.body && (
        <PlaceDetailView card={card} />
      )}

      {card.type === "DISCOVER" && card.body && (
        <DiscoverDetailView card={card} />
      )}

      {/* Danh mục trích dẫn nguồn có kiểm chứng */}
      {card.type !== "PLACE" && (
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm" aria-label="Nguồn thông tin trích dẫn">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-700 shrink-0" aria-hidden="true" />
            <span>Nguồn thông tin và cơ sở đối chiếu</span>
          </h3>

          <div className="space-y-3">
            {card.sources.map((s) => (
              <div key={s.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <div className="font-bold text-slate-800 text-sm">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{s.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </div>
                <div className="text-slate-600">
                  Đơn vị công bố: <strong>{s.publisher}</strong>
                  {s.sourceDate && ` · Ngày nguồn: ${s.sourceDate}`}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom return link */}
      <div className="pt-4">
        <Link
          href="/"
          className="touch-target px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh mục chính</span>
        </Link>
      </div>
    </div>
  </CardAccessGuard>
  );
}
