import Link from "next/link";
import { loadPublicCatalog } from "../../lib/content/loader";
import { ExternalResearchBox } from "../../components/ExternalResearchBox";
import { ServiceAccordionList } from "../../components/ServiceAccordionList";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const cards = (await loadPublicCatalog()).filter((c) => c.type === "SERVICE");

  return (
    <div className="w-full space-y-6">
      {/* Header giữ nguyên style gốc */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Thủ tục &amp; hướng dẫn</h1>
        <p className="text-slate-600 mt-1">
          Chọn thủ tục cần làm để xem hướng dẫn, bước chuẩn bị và đầu mối phù hợp.
        </p>
      </div>

      {/* Danh sách accordion: chỉ hiện tên → ấn mới bung chi tiết */}
      <ServiceAccordionList cards={cards} />

      {/* Giữ lại ExternalResearchBox như bản gốc */}
      <ExternalResearchBox />
    </div>
  );
}
