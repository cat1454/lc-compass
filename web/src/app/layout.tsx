import type { Metadata, Viewport } from "next";
import { AppShell } from "../components/AppShell";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "LC Compass — La bàn Liên Chiểu",
  description:
    "Đúng nguồn – Rõ nơi – Biết bước tiếp theo. Cẩm nang số hỗ trợ người dân, người mới đến và thanh niên phường Liên Chiểu năm 2026.",
  authors: [{ name: "Ban Chỉ đạo Chuyển đổi số Phường Liên Chiểu & Đoàn TNCS Hồ Chí Minh" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="text-slate-900 min-h-screen antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
