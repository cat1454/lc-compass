import { HeartHandshake, ShieldCheck, Users } from "lucide-react";
import React from "react";

export function PillarsFooter() {
  const pillars = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-blue-700" />,
      title: "Thông tin chính thống",
      desc: "Từ cơ quan nhà nước & Cổng DVC",
      bgColor: "bg-blue-50 text-blue-800 border-blue-100",
    },
    {
      icon: <Users className="w-5 h-5 text-teal-700" />,
      title: "Dễ hiểu, dễ thực hiện",
      desc: "Hướng dẫn từng bước, phiếu ghi nhớ",
      bgColor: "bg-teal-50 text-teal-800 border-teal-100",
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-emerald-700" />,
      title: "Gần dân, vì người dân",
      desc: "Đồng hành cùng cộng đồng thuê trọ",
      bgColor: "bg-emerald-50 text-emerald-800 border-emerald-100",
    },
  ];

  return (
    <section
      aria-label="Ba trụ cột cam kết của LC Compass"
      className="bg-white/75 backdrop-blur-md border-t border-b border-slate-200/80 py-6 px-4"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-2xs"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 border ${p.bgColor}`}
              >
                {p.icon}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {p.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {p.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hand-lettered style tagline */}
        <div className="shrink-0 text-center md:text-right">
          <div className="text-xl md:text-2xl font-serif italic font-bold text-teal-700 tracking-tight">
            Một chạm Liên Chiểu
          </div>
          <div className="text-[10px] text-slate-400 font-sans uppercase tracking-wider">
            Gần hơn trong từng thông tin
          </div>
        </div>
      </div>
    </section>
  );
}
