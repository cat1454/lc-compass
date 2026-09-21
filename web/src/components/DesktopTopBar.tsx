"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Search, ChevronDown } from "lucide-react";

export function DesktopTopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchVal, setSearchVal] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  // Hỗ trợ phím tắt ⌘K hoặc Ctrl+K để nhảy vào ô tìm kiếm
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const el = document.getElementById("desktop-global-search");
        if (el) el.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header
      aria-label="Thanh công cụ trên cùng"
      className="hidden lg:flex items-center justify-between gap-4 px-4 h-[52px] bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
    >
      {/* Brand Header on Left matching ref_desktop_web.png */}
      <div className="w-[180px] shrink-0 flex items-center gap-2 pr-2">
        <Link
          href="/"
          className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl p-0.5"
        >
          <div className="w-8 h-8 relative shrink-0 drop-shadow-2xs transition-transform group-hover:scale-105">
            <Image
              src="/logo.svg"
              alt="Logo LC Compass"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1 leading-tight">
              <span>LC Compass</span>
            </div>
            <div className="text-[9px] text-slate-500 truncate font-medium">
              Trợ lý thông tin địa phương
            </div>
          </div>
        </Link>
      </div>

      {/* Search Input with ⌘K matching ref_desktop_window.png */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative">
        <span
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        >
          <Search className="w-4 h-4 text-slate-400" />
        </span>
        <input
          id="desktop-global-search"
          type="search"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Tìm dịch vụ, thủ tục, địa điểm, thông tin Liên Chiểu..."
          style={{ fontSize: "16px" }}
          className="w-full pl-10 pr-16 py-2 bg-slate-50/80 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
          aria-label="Tìm kiếm toàn hệ thống"
        />
        <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10.5px] font-mono bg-white border border-slate-300 rounded text-slate-400 shadow-2xs select-none">
          ⌘ K
        </kbd>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-5 shrink-0">
        {/* Notifications Icon */}
        <button
          type="button"
          aria-label="Thông báo hệ thống"
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Profile Avatar Pill matching ref_desktop_window.png */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 cursor-pointer group">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shadow-2xs shrink-0">
            <Image
              src="/avatar-an.jpg"
              alt="Avatar Nguyễn Văn An"
              width={32}
              height={32}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="text-left leading-tight">
            <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
              Nguyễn Văn An
            </div>
            <div className="text-[10px] text-slate-500">Người dân</div>
          </div>
          <span className="text-slate-400 group-hover:text-slate-600 transition-colors">
            <ChevronDown className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </header>
  );
}
