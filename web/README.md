# Ứng dụng LC Compass — Khu vực triển khai Web

Ứng dụng web dân sinh thuộc Cuộc thi Ý tưởng sáng tạo chuyển đổi số thanh niên phường Liên Chiểu năm 2026.
Vercel Root Directory: `web`.

Hướng dẫn phát hành: [delivery/deployment](../delivery/deployment/README.md).
Nghiên cứu dịch vụ miễn phí: [FREE_APIS](../research/FREE_APIS.md).

## 1. Công nghệ nền tảng (Gói 00 — Foundation)

- **Framework:** Next.js 15.5.25 (App Router) + React 19.3.0
- **Ngôn ngữ:** TypeScript 5.6+
- **Styling:** Tailwind CSS 3.4 + PostCSS (tuân thủ `design/decisions/MOBILE_FIRST.md`: mobile-first, responsive width dùng %)
- **Hợp đồng & Kiểm duyệt:** Zod
- **Kiểm thử:** Vitest (Unit) & Playwright (E2E)
- **Môi trường:** Node.js LTS (v22.20.0), npm 10.9.3

## 2. Các lệnh thực thi tiêu chuẩn

Tất cả lệnh đều chạy công cụ thực tế (không dùng echo giả lập):

```powershell
# Chạy máy chủ phát triển
npm run dev

# Kiểm tra kiểu dữ liệu TypeScript
npm run typecheck

# Kiểm tra chuẩn mã nguồn
npm run lint

# Chạy kiểm thử đơn vị (Vitest)
npm run test

# Chạy kiểm thử E2E (Playwright)
npm run test:e2e

# Kiểm tra dữ liệu nội dung published & fixtures
npm run content:validate

# Biên dịch bản phát hành sản phẩm (Production build)
npm run build

# Khởi chạy bản build production
npm run start
```

## 3. Cấu trúc thư mục

- `src/app/`: App Router, layout mobile-first, styles toàn cục.
- `src/contracts/`: Hợp đồng dữ liệu Zod và TypeScript types (triển khai ở Gói 01).
- `src/components/`: Thành phần giao diện dùng chung.
- `src/features/`: Các module tính năng chuyên biệt.
- `src/lib/`: Các thư viện tiện ích và helpers.
- `content/published/`: Dữ liệu thẻ đã rà soát chính thức (Gói 02).
- `fixtures/`: Bộ dữ liệu mẫu kiểm thử độc lập.
- `scripts/`: Scripts kiểm duyệt nội dung tự động.
- `tests/`: Bộ kiểm thử tự động (smoke unit test và e2e).
- `public/`: Tài nguyên tĩnh được phép phát hành.

## 4. Quy định an toàn và bảo mật

- Không cần khóa API Google hay cấu hình Redis ngoài để phát triển/build local.
- Biến môi trường mẫu tại `.env.example`, không commit `.env.local` hoặc secret lên repository.
