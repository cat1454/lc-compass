# 00 — Nền ứng dụng

Owner: Antigravity. Phụ thuộc: không. Phạm vi sửa: nền project trong `web`, cấu hình test/lint/build và REPORT gói này. Không sửa bộ mô phỏng hoặc kế hoạch gốc.

## Thực hiện

1. Đọc START_HERE, CONTRACTS và MOBILE_FIRST. Khởi tạo Next.js App Router + TypeScript + Tailwind + npm tại thư mục web đã có; giữ README và env mẫu. Không chạy scaffold xóa thư mục hiện có.
2. Cài Zod, Vitest, Playwright; chốt lockfile và Node LTS được Next.js/Vercel hỗ trợ. Ghi phiên bản thật vào REPORT.
3. Đặt scripts `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`, `content:validate`. Các scripts phải thực sự chạy công cụ, không echo thành công.
4. Trang nền có ba lối vào, chưa có dữ liệu thì trạng thái trống trung thực. Không cần khóa Google để dev/build.
5. Thêm ignore cho node_modules, .next, env thật, .vercel và báo cáo tạm. Không đưa credential hoặc dữ liệu nghiên cứu vào public.

## Đầu ra và nghiệm thu

App local mở được; npm build/lint/typecheck chạy qua. Scripts chưa có ca kiểm thử phải được ghi rõ, không nhận là test pass toàn sản phẩm. Cập nhật REPORT và STATUS, bàn giao nền cho 01. Không deploy ở gói này.
