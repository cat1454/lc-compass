"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, MapPin, Compass } from "lucide-react";

export function BottomNavMobile() {
  const pathname = usePathname();

  const isHomeActive = pathname === "/";
  const isServicesActive =
    pathname.startsWith("/services") || pathname.includes("/cards/service-");
  const isPlacesActive = pathname.startsWith("/places") || pathname.includes("/cards/place-");
  const isDiscoverActive = pathname.startsWith("/discover") || pathname.includes("/cards/discover-");

  const tabs = [
    {
      label: "Trang chủ",
      fullLabel: "Trang chủ",
      href: "/",
      icon: (active: boolean) => (
        <Home className={`w-5 h-5 ${active ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
      ),
      active: isHomeActive,
    },
    {
      label: "Thủ tục",
      fullLabel: "Thủ tục & hướng dẫn",
      href: "/services",
      icon: (active: boolean) => (
        <FileText className={`w-5 h-5 ${active ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
      ),
      active: isServicesActive,
    },
    {
      label: "Địa điểm",
      fullLabel: "Địa điểm & tiện ích",
      href: "/places",
      icon: (active: boolean) => (
        <MapPin className={`w-5 h-5 ${active ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
      ),
      active: isPlacesActive,
    },
    {
      label: "Khám phá",
      fullLabel: "Khám phá Liên Chiểu",
      href: "/discover",
      icon: (active: boolean) => (
        <Compass className={`w-5 h-5 ${active ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
      ),
      active: isDiscoverActive,
    },
  ];

  return (
    <nav
      aria-label="Thanh điều hướng dưới màn hình di động"
      className="fixed bottom-0 left-0 right-0 z-50 liquid-glass border-t border-slate-200/80 lg:hidden shadow-[0_-4px_20px_rgba(15,23,42,0.06)]"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 4px)" }}
    >
      <div className="flex items-center justify-around px-2 py-1 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isCurrent = tab.active;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              title={tab.fullLabel}
              aria-label={tab.fullLabel}
              aria-current={isCurrent ? "page" : undefined}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all touch-target focus:outline-none focus:ring-2 focus:ring-blue-500 relative ${
                isCurrent
                  ? "text-blue-600 font-bold bg-blue-50/80"
                  : "text-slate-500 hover:text-slate-900 font-medium hover:bg-slate-100/50"
              }`}
            >
              {isCurrent && (
                <span className="absolute top-0 inset-x-4 h-0.5 bg-blue-600 rounded-full" />
              )}
              <span
                className={`transition-transform duration-200 ${
                  isCurrent ? "scale-105 text-blue-600" : "text-slate-500"
                }`}
                aria-hidden="true"
              >
                {tab.icon(isCurrent)}
              </span>
              <span className="text-[11px] font-bold text-center tracking-tight mt-0.5 leading-tight truncate max-w-full">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
