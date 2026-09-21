"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";

export function Header() {
  return (
    <header className="w-full h-[52px] liquid-glass sticky top-0 z-40 lg:hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center transition-all">
      <div className="w-full px-3.5 flex items-center justify-between">
        {/* Brand: Logo + Title + Status Beacon */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
          aria-label="LC Compass - Về trang chủ"
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden relative shrink-0 shadow-2xs bg-blue-900 flex items-center justify-center p-0.5">
            <Image
              src="/logo.svg"
              alt="Logo LC Compass"
              width={30}
              height={30}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="font-black text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
              <span>LC Compass</span>
              {/* Dấu ấn đặc biệt: Beacon trạng thái trực tuyến Một cửa & 1022 */}
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-emerald-50 border border-emerald-200/80 text-[9.5px] text-emerald-700 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Trực tuyến</span>
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium tracking-tight">
              Cổng cẩm nang số Phường Liên Chiểu
            </div>
          </div>
        </Link>

        {/* Right: Notification Bell + Compact Citizen Profile */}
        <div className="flex items-center gap-2">
          <Link
            href="/services"
            aria-label="Thông báo và nhắc việc"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
          >
            <Bell className="w-4.5 h-4.5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </Link>

          <div
            className="w-7 h-7 rounded-lg overflow-hidden border border-slate-200/90 shadow-2xs shrink-0"
            title="Nguyễn Văn An (Người dân)"
          >
            <Image
              src="/avatar-an.jpg"
              alt="Avatar Nguyễn Văn An"
              width={28}
              height={28}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
