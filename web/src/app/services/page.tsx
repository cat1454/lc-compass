import Link from "next/link";
import { CardItem } from "../../components/CardItem";
import { ExternalResearchBox } from "../../components/ExternalResearchBox";
import { loadPublicCatalog } from "../../lib/content/loader";
export const dynamic = "force-dynamic";
export default async function ServicesPage() {
  const cards = (await loadPublicCatalog()).filter(c => c.type === "SERVICE");
  return <div className="responsive-container py-8 space-y-6">
    <h1 className="text-2xl font-bold">Thủ tục &amp; hướng dẫn</h1>
    <p>Chọn việc cần làm để xem hướng dẫn, bước chuẩn bị và đầu mối phù hợp.</p>
    {cards.length ? <div className="responsive-cards grid gap-4 sm:grid-cols-2">{cards.map(card => <CardItem key={card.id} card={card} />)}</div> :
      <div className="rounded-xl border bg-white p-6 space-y-3"><p>Chưa có nội dung được phát hành trong mục này.</p><Link className="touch-target inline-flex underline" href="/">Tra cứu các mục khác</Link></div>}
    <ExternalResearchBox />
  </div>;
}
