import Link from "next/link";
export function ExternalResearchBox() {
  return <section id="la-ban-assistant" className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
    <h2 className="text-lg font-bold">Tra cứu nguồn thông tin mở rộng</h2>
    <p>Dịch vụ tra cứu mở rộng chưa được kết nối. Bạn có thể tìm thẻ hướng dẫn và thông tin hiện có hoặc tra cứu danh bạ tiện ích.</p>
    <div className="flex flex-wrap gap-3">
      <Link className="touch-target rounded-lg border px-4 py-2" href="/#tra-cuu">Tra cứu thẻ thông tin</Link>
      <Link className="touch-target rounded-lg border px-4 py-2" href="/places">Tra cứu danh bạ tiện ích</Link>
    </div>
  </section>;
}
