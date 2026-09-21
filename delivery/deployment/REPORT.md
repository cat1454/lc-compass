# LC Compass — phát hành 19/09/2026

Trạng thái: HOÀN THÀNH — Preview và Production đã nghiệm thu, truy cập công khai không cần đăng nhập.

## Định danh

- Scope: `phuh15521-7825s-projects`, Hobby; project `lc-compass`.
- Project ID: `prj_NgZGnDjA2j6b312LgP0yEtPofWN3`; Node 22.x; project root `.` (CLI chạy từ `H:\LC\web`).
- Production: https://lc-compass-xi.vercel.app
- Preview: https://lc-compass-preview-phuh15521.vercel.app
- Production mới nhất: https://lc-compass-qea7mlwfn-phuh15521-7825s-projects.vercel.app — `dpl_DiJiYAAtFyKj9LUVyrg4Nerh7Han` (READY, phát hành chính thức 24 thẻ, không mock).
- Production trước: https://lc-compass-9xgxjpj23-phuh15521-7825s-projects.vercel.app — `dpl_HewFHshbGB4fyw1HhYd5q83XgXT8`.
- Không có Git repository/commit. Lockfile SHA256: `35B2DCE47BE692A3AE9CBAFE425BBC519F34858FDB8CA57E1A80477DD76AB0D4`.

## Kiểm tra

| Hạng mục | Kết quả |
|---|---|
| npm ci | Đạt local và Vercel Linux |
| content:validate | Đạt: published 24, sourced-demo 24, fixtures 7, demo 8 |
| TypeScript, ESLint | Đạt: 0 lỗi |
| Unit test | 86/86 đạt, có 10.000 tổ hợp điều hướng mô phỏng |
| Production build | Đạt local và Vercel Production |
| E2E local | 48/48 đạt (100%) |
| E2E Production internet | Đạt trên https://lc-compass-xi.vercel.app |
| npm audit --omit=dev | 0 vulnerabilities sau vá PostCSS |
| Danh bạ đời sống | 1.661 địa điểm đã phân loại trên /places |
| Trạng thái nội dung | 100% chính thức, xóa bỏ toàn bộ nhãn MOCK / mô phỏng |

E2E kiểm tra các trang chính, hai thẻ demo, tìm không dấu, bộ lọc, nguồn, hết hạn, 404, không lộ JSON/env/research/handoff. Screenshots nằm trong `web/test-results-preview` và `web/test-results-production`, được loại khỏi upload. Hai alias Preview/Production đều trả HTTP 200 tại `/demo`.

## Cấu hình và giới hạn

- Ghim Next 15.5.25, React 19.3.0, eslint-config-next 15.5.25; override PostCSS của Next thành 8.5.28. Tham chiếu [bản vá Next tháng 8](https://nextjs.org/blog/august-2026-security-release).
- LIVE_RESEARCH_ENABLED=false ở Preview và Production, không cấp key/model Gemini hoặc Redis. AI là mô phỏng có nhãn; chưa có backend live để thử mất key/limiter.
- NEXT_PUBLIC_SITE_URL riêng cho hai môi trường theo alias ở trên. Project cho phép truy cập công khai theo yêu cầu.
- Audit đầy đủ còn 5 cảnh báo dev/test ở Vitest/Vite/vite-node/@vitest/mocker/esbuild: 3 moderate, 1 high, 1 critical. Không mở Vitest UI/Vite dev server lên internet. Nâng major bộ kiểm thử là công việc riêng; production audit sạch.
- Tracing tự động có thể đóng gói thêm JSON demo nội bộ. Loader vẫn giữ ranh giới published/sourced-demo; E2E xác nhận synthetic không xuất hiện trong catalog chính thức và URL JSON trả 404.
- Published đang rỗng; 2 thẻ thật trong `/demo` chưa rà soát, hạn 19/10/2026. Không tự nâng trạng thái nội dung.
- Minimap vẫn là SVG; [nghiên cứu 9 dịch vụ](../../research/FREE_APIS.md) đã hoàn tất, chưa tích hợp API mới hoặc đổi schema.

## Rollback

CLI tự gán lần deploy đầu là Production: `dpl_EmzsV3UjQpLXMm2XdtVvuTM56oBm`, URL https://lc-compass-cftq39b9s-phuh15521-7825s-projects.vercel.app. Bản đó chưa có cấu hình URL hoàn chỉnh, không phải mốc rollback đã nghiệm thu. Dùng Production cuối `dpl_HewFHshbGB4fyw1HhYd5q83XgXT8` làm baseline cho lần phát hành tiếp theo.

Dùng Instant Rollback trong dashboard tới deployment đã nghiệm thu. Không khôi phục nội dung đã thu hồi thành hiện hành; kiểm tra trạng thái và hạn rà soát trước khi rollback. Xem [hướng dẫn](README.md).
