# Báo cáo Gói 00 — Nền ứng dụng (Foundation)

Trạng thái: **DONE** — Đã hoàn thành khởi tạo toàn bộ nền tảng, mã nguồn, cấu hình kiểm thử và nghiệm thu thực tế; đã cập nhật theo yêu cầu Codex Review (R08).

## 1. Thông tin thực hiện

- **Người thực hiện:** Antigravity
- **Ngày:** 18/09/2026 (Cập nhật sau Codex Review)
- **Môi trường & Phiên bản thực tế đã nâng cấp (R08):**
  - Node.js LTS: `v22.20.0`
  - npm: `10.9.3`
  - Next.js: `15.5.25` (Maintenance LTS — nâng cấp từ 14.x theo khuyến nghị Codex R08; Next.js 16 là Active LTS, 15 là Maintenance LTS)
  - React / React DOM: `19.3.0`
  - TypeScript: `5.6.3`
  - Tailwind CSS: `3.4.14`
  - Zod: `3.23.8`
  - Vitest: `2.1.9`
  - Playwright: `1.48.2` (Chromium testing build `1243`)

## 2. Phần đã làm & Cải tiến sau Codex Review

1. **Khởi tạo dự án Next.js tại `web/` an toàn:**
   - Bảo tồn nguyên vẹn các file và thư mục có sẵn (`.env.example`, `README.md`, `content/`, `fixtures/`, `src/`, `tests/`, `scripts/`).
   - Cấu hình file `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `next.config.mjs`, `.eslintrc.json`.
   - Cập nhật `.gitignore` loại trừ triệt để artifacts build (`.next/`, `node_modules/`, `coverage/`, `.env*`, `.vercel/`).

2. **Thiết lập 8 npm scripts tiêu chuẩn (chạy công cụ thực tế, gắn cổng bảo vệ):**
   - `npm run dev`: Khởi chạy Next.js development server.
   - `npm run build`: Gắn cổng kiểm duyệt `npm run content:validate && next build` (R04: đảm bảo dữ liệu hỏng làm dừng build).
   - `npm run start`: Khởi động máy chủ production.
   - `npm run lint`: Chuyển sang `eslint .` (tránh cảnh báo deprecation của `next lint` trong Next.js 15).
   - `npm run typecheck`: Kiểm tra tĩnh kiểu dữ liệu với `tsc --noEmit`.
   - `npm run test`: Chạy unit tests với Vitest.
   - `npm run test:e2e`: Chạy end-to-end tests với Playwright (Mobile & Desktop).
   - `npm run content:validate`: Quét kiểm tra tính toàn vẹn và duy nhất ID của dữ liệu JSON.

3. **Giao diện & Bố cục Mobile-First theo chuẩn `MOBILE_FIRST.md`:**
   - Toàn bộ layout áp dụng `box-sizing: border-box`.
   - Chiều rộng trang và các khối dùng đơn vị `%`: container rộng `92%` (tối đa `75rem`), lưới thẻ responsive (`100%` trên mobile, `49%` từ `48rem`, `32%` từ `75rem`, gap `2%`).
   - Vùng chạm tối thiểu `2.75rem × 2.75rem` (44px), cỡ chữ nội dung từ `1rem` (16px).
   - Trang chủ hiển thị rõ ràng 3 lối vào (*Tôi cần làm việc*, *Tôi mới đến*, *Tôi muốn khám phá*).
   - Đã làm sạch metadata authors trong `layout.tsx` thành `[{ name: "Nhóm tác giả Cuộc thi Sáng tạo Liên Chiểu 2026" }]`.

4. **Kiểm thử tự động:**
   - Cập nhật unit smoke test `web/tests/smoke.test.ts` kiểm tra trực tiếp mã nguồn ứng dụng (Root Layout metadata, viewport, EntryPointSchema, HomePage component).
   - Playwright E2E test `web/tests/smoke.spec.ts` kiểm tra giao diện trên Mobile Chrome và Desktop Chrome.

## 3. Kiểm tra thực tế

| Lệnh / Tác vụ | Kết quả | Bằng chứng thực tế |
|---|---|---|
| `npm run typecheck` | **PASS (exit 0)** | `tsc --noEmit` hoàn thành không có lỗi kiểu |
| `npm run lint` | **PASS (exit 0)** | `eslint .` chạy sạch 0 lỗi, 0 cảnh báo |
| `npm run test` | **PASS (exit 0)** | Vitest chạy 4/4 smoke tests passed (kiểm tra trực tiếp mã nguồn) |
| `npm run content:validate` | **PASS (exit 0)** | Báo cáo cấu trúc `content/published` và `fixtures/` hợp lệ |
| `npm run build` | **PASS (exit 0)** | Next.js 15.5.25 compiled successfully, tiền kiểm duyệt đạt |
| `npm run test:e2e` | **PASS (exit 0)** | 2/2 tests passed: Mobile Chrome (357ms) & Desktop Chrome (336ms) |

## 4. Giới hạn / Blocker ghi nhận

- Đã giải quyết triệt để vấn đề phiên bản Next.js 14 không còn hỗ trợ (R08) bằng cách nâng cấp lên Next.js 15.5.25 Maintenance LTS.
- Thư mục `web/content/published/` rỗng hợp lệ (sẽ tiếp nhận nội dung đã duyệt tại Gói 02).
- Không có API key nào bị đọc/ghi hoặc yêu cầu trong quá trình build/test.

## 5. Bàn giao

- **Sản phẩm bàn giao:** Toàn bộ thư mục `web/` đã nâng cấp Next.js 15 LTS, cấu hình lockfile đồng bộ, scripts gắn cổng kiểm tra.
- **Tài liệu cập nhật:** [web/README.md](file:///h:/LC/web/README.md), [docs/handoff/00-foundation/REPORT.md](file:///h:/LC/docs/handoff/00-foundation/REPORT.md), [docs/handoff/STATUS.md](file:///h:/LC/docs/handoff/STATUS.md).
