"use client";

import { ReadingPreferences } from "./ReadingPreferences";
import { BottomNavMobile } from "./BottomNavMobile";
import { DesktopTopBar } from "./DesktopTopBar";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PillarsFooter } from "./PillarsFooter";
import { SidebarDesktop } from "./SidebarDesktop";

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * Khung cấu trúc tổng thể (App Shell) hỗ trợ:
 * - Desktop (>= 1024px): Sidebar cố định bên trái, DesktopTopBar phía trên, nội dung chính giữa, PillarsFooter và Footer.
 * - Mobile (< 1024px): Header thu gọn trên cùng, nội dung chính giữa (có padding-bottom chống che), BottomNavMobile cố định ở đáy.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <ReadingPreferences><div className="min-h-screen bg-transparent text-slate-900 flex flex-col antialiased">
      {/* Top Bar trên Desktop - Phủ toàn chiều ngang theo ref_desktop_web.png */}
      <DesktopTopBar />

      {/* Header trên Mobile */}
      <Header />

      <div className="flex-1 flex w-full">
        {/* Sidebar cố định trên Desktop - Bắt đầu ngay dưới DesktopTopBar */}
        <SidebarDesktop />

        {/* Cột nội dung chính */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          {/* Vùng nội dung trang (có padding đáy trên mobile để tránh thanh BottomNav) */}
          <main className="flex-1 pb-40 lg:pb-0">{children}</main>

          {/* 3 Trụ cột cam kết từ image.png */}
          <PillarsFooter />

          {/* Footer thông tin chính thức và cơ quan */}
          <Footer />
        </div>
      </div>

      {/* Thanh điều hướng cố định ở đáy màn hình di động */}
      <BottomNavMobile />
    </div></ReadingPreferences>
  );
}
