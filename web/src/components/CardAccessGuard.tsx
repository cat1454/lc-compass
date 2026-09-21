"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { PublicCardDTO } from "../contracts/card";

interface CardAccessGuardProps {
  card: PublicCardDTO;
  children: React.ReactNode;
}

/**
 * Kiểm tra tính hiệu lực của thẻ tại đúng thời điểm người dùng truy cập trên trình duyệt (Client Access Time)
 * Nếu thẻ đã quá hạn reviewDue tính đến thời điểm hiện tại của máy người dùng,
 * kích hoạt cơ chế bảo vệ fail-closed, ẩn toàn bộ nội dung hướng dẫn và hiển thị cảnh báo an toàn.
 */
export function CardAccessGuard({ card, children }: CardAccessGuardProps) {
  const [isAccessExpired, setIsAccessExpired] = useState(false);
  const [accessDateStr, setAccessDateStr] = useState<string>("");

  useEffect(() => {
    const check = () => {
      const now = new Date();
      setAccessDateStr(now.toLocaleDateString("vi-VN"));
      const dueTime = new Date(`${card.review.reviewDue}T23:59:59.999+07:00`).getTime();
      setIsAccessExpired(!Number.isFinite(dueTime) || now.getTime() > dueTime);
    };
    check();
    const timer = window.setInterval(check, 1000);
    return () => window.clearInterval(timer);
  }, [card.review.reviewDue]);

  if (isAccessExpired) {
    return (
      <div className="responsive-container py-12 max-w-2xl mx-auto space-y-6">
        <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-4">
          <div className="text-3xl" aria-hidden="true">
            ⏳
          </div>
          <h1 className="text-2xl font-bold">
            Thông tin tạm ngưng do quá hạn rà soát tại thời điểm truy cập
          </h1>
          <p className="text-sm leading-relaxed text-amber-900">
            Nội dung thẻ &ldquo;{card.title}&rdquo; có hạn rà soát định kỳ là <strong>{card.review.reviewDue}</strong>. Tính đến thời điểm bạn truy cập ({accessDateStr}), nội dung này đã quá hạn và tạm thời ngừng cung cấp chi tiết để bảo đảm an toàn thông tin pháp lý.
          </p>
          <div className="pt-2 text-xs text-amber-800">
            Cơ chế bảo vệ dữ liệu tự động (fail-closed) ngăn ngừa việc người dân tiếp cận các chỉ dẫn cũ hoặc chưa được cập nhật. Vui lòng liên hệ trực tiếp đơn vị phụ trách hoặc kiểm tra trên Cổng Dịch vụ công chính thức.
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/"
            className="touch-target px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors"
          >
            ← Về trang chủ tra cứu
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
