"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  ShieldCheck,
  FileText,
  MapPin,
  Compass,
  Newspaper,
  MessageSquareText,
  Grid,
} from "lucide-react";

export function SidebarDesktop() {
  const pathname = usePathname();

  const isHomeActive = pathname === "/";
  const isServicesActive =
    pathname.startsWith("/services") || pathname.includes("/cards/service-");
  const isPlacesActive =
    pathname.startsWith("/places") || pathname.includes("place-");

  const navItems = [
    {
      label: "Trang chủ",
      href: "/",
      icon: <Home className="w-5 h-5" />,
      active: isHomeActive,
    },
    {
      label: "Tìm kiếm",
      href: "/#tra-cuu",
      icon: <Search className="w-5 h-5" />,
      active: false,
    },
    {
      label: "Dịch vụ công",
      href: "https://dichvucong.bocongan.gov.vn",
      icon: <ShieldCheck className="w-5 h-5" />,
      external: true,
    },
    {
      label: "Thủ tục & hướng dẫn",
      href: "/services",
      icon: <FileText className="w-5 h-5" />,
      active: isServicesActive,
    },
    {
      label: "Địa điểm & tiện ích",
      href: "/places",
      icon: <MapPin className="w-5 h-5" />,
      active: pathname.startsWith("/places") || pathname.includes("place-"),
    },
    {
      label: "Khám phá Liên Chiểu",
      href: "/discover",
      icon: <Compass className="w-5 h-5" />,
      active: pathname.startsWith("/discover") || pathname.includes("/cards/discover-"),
    },
    {
      label: "Tin tức",
      href: "https://lienchieu.danang.gov.vn",
      icon: <Newspaper className="w-5 h-5" />,
      external: true,
    },
    {
      label: "Phản ánh hiện trường",
      href: "https://1022.danang.gov.vn",
      icon: <MessageSquareText className="w-5 h-5" />,
      external: true,
    },
  ];

  return (
    <aside
      aria-label="Thanh điều hướng chính màn hình lớn"
      className="hidden lg:flex flex-col justify-between w-[196px] shrink-0 bg-white/80 backdrop-blur-md border-r border-slate-200/80 px-2 py-2.5 sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto shadow-[1px_0_4px_rgba(0,0,0,0.02)] select-none"
    >
      <div className="space-y-2">
        {/* Navigation List - Bắt đầu ngay dưới TopBar theo đúng chuẩn ref_desktop_web.png */}
        <nav aria-label="Menu chính" className="space-y-0.5">
          {navItems.map((item) => {
            const isCurrent = item.active;
            const itemIcon = item.icon;

            const content = (
              <span
                className={`relative touch-target min-h-[38px] flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent
                    ? "bg-blue-50/90 text-blue-700 font-bold before:absolute before:-left-2 before:top-2 before:bottom-2 before:w-1 before:bg-blue-600 before:rounded-r-full"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span
                  className={`shrink-0 transition-colors ${
                    isCurrent ? "text-blue-600" : "text-slate-400 group-hover:text-slate-700"
                  }`}
                  aria-hidden="true"
                >
                  {itemIcon}
                </span>
                <span className="truncate">{item.label}</span>
              </span>
            );

            return item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                {content}
              </a>
            ) : (
              <Link key={item.label} href={item.href} className="block group">
                {content}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Graphic Slogan Card at bottom of sidebar matching ref_desktop_web.png */}
      <div className="pt-3 border-t border-slate-100">
        <div className="rounded-xl bg-gradient-to-br from-blue-700 via-sky-700 to-teal-800 text-white p-3 shadow-xs relative overflow-hidden">
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-white/10 rounded-full blur-lg pointer-events-none" />
          <div className="relative z-10 space-y-1">
            <div className="text-[8.5px] uppercase font-bold tracking-widest text-sky-200">
              Đoàn TNCS Liên Chiểu
            </div>
            <div className="text-[11px] font-black leading-tight text-white">
              Vì một Liên Chiểu văn minh, hiện đại, nghĩa tình
            </div>
            <div className="text-[9px] text-sky-100 leading-tight pt-0.5 opacity-90">
              Cẩm nang số kết nối người dân với chính quyền cơ sở năm 2026.
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
