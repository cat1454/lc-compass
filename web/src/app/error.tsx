"use client";

export default function ContentError({ reset }: { reset: () => void }) {
  return <section className="responsive-container py-10 space-y-4" role="alert">
    <h1 className="text-2xl font-bold">Chưa tải được nội dung</h1>
    <p>Dữ liệu đang được cập nhật hoặc tạm thời chưa khả dụng. Vui lòng thử lại.</p>
    <button className="touch-target rounded-lg border px-4 py-2" onClick={reset}>Thử lại</button>
  </section>;
}
