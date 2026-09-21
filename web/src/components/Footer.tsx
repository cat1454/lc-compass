import Link from "next/link";
import {
  Compass,
  FileText,
  Landmark,
  MapPin,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 py-10 mt-16 border-t border-slate-800">
      <div className="responsive-container space-y-8">
        <div className="flex flex-wrap justify-between gap-6">
          {/* Cột 1: Thông tin nền tảng */}
          <div className="w-full md:w-[45%] space-y-3">
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-teal-400" aria-hidden="true" />
              <span className="text-xl font-bold text-white tracking-tight">
                LC Compass — La bàn Liên Chiểu
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cổng cẩm nang số cơ sở hỗ trợ người dân, người thuê trọ mới đến và thanh niên tra cứu thủ tục hành chính, tiện ích thiết yếu và văn hóa địa phương Phường Liên Chiểu, TP. Đà Nẵng.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-950/70 border border-teal-800/80 text-teal-300 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Cổng thông tin cơ sở · Dữ liệu chuẩn hóa &amp; minh bạch</span>
            </div>
          </div>

          {/* Cột 2: Lối vào tiện ích */}
          <div className="w-full sm:w-[45%] md:w-[22%] space-y-2">
            <div className="font-semibold text-white text-sm uppercase tracking-wider">
              Lối vào tiện ích
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services"
                  className="hover:text-teal-300 transition-colors inline-flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Thủ tục hành chính công</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/places"
                  className="hover:text-teal-300 transition-colors inline-flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Danh bạ 1.660+ tiện ích</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/discover"
                  className="hover:text-teal-300 transition-colors inline-flex items-center gap-2"
                >
                  <Landmark className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Di sản văn hóa địa phương</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Đầu mối hỗ trợ công dân */}
          <div className="w-full sm:w-[45%] md:w-[26%] space-y-2">
            <div className="font-semibold text-white text-sm uppercase tracking-wider">
              Đầu mối hỗ trợ người dân
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bộ phận Tiếp nhận &amp; Trả kết quả (Một cửa): <br />
              <span className="text-white font-medium">68 Lạc Long Quân, P. Hòa Khánh Bắc, Liên Chiểu</span>
            </p>
            <div className="pt-1 text-xs text-slate-400 flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Tổng đài DVC Đà Nẵng:{" "}
                <a href="tel:02361022" className="text-amber-400 hover:underline font-bold">
                  1022 (0236 1022)
                </a>
              </span>
            </div>
            <div className="pt-0.5 text-xs text-slate-400">
              Đoàn TNCS HCM Phường:{" "}
              <span className="text-teal-300 font-medium">0905 423 233</span>
            </div>
          </div>
        </div>

        {/* Bản quyền & Khẩu hiệu */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-wrap justify-between gap-3">
          <div>
            © 2026 Phường Liên Chiểu, TP. Đà Nẵng. Bản quyền phục vụ cộng đồng địa phương.
          </div>
          <div>
            Đúng nguồn · Rõ nơi · Biết bước tiếp theo.
          </div>
        </div>
      </div>
    </footer>
  );
}
