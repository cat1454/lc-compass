# Phát hành LC Compass lên Vercel

## Cấu hình

- CLI chạy tại `H:\LC\web`; triển khai trực tiếp thư mục này, không upload toàn bộ workspace.
- Nếu import Git repository gốc sau này: Root Directory = `web`. Với CLI chạy trong `web`, project root là `.`; không đặt thêm `web` lần nữa.
- Framework Next.js; Node 22.x; install `npm ci`; build `npm run build`.
- `next.config.mjs` đưa `content/published` và `content/sourced-demo` vào function bundle. Các JSON không nằm trong public.
- `.vercelignore` loại build cũ, logs, secrets và ảnh kiểm thử khỏi upload. Research/handoff/delivery nằm ngoài deployment root.
- Next.js 15.5.25, React 19.3.0 được ghim theo lockfile; override PostCSS của Next lên 8.5.28 để vá các advisory do npm audit báo. Kiểm tra lại khi nâng Next và bỏ override khi dependency upstream đã an toàn.

## Đăng nhập và Preview

Thực hiện bằng tài khoản cá nhân phù hợp [Hobby](https://vercel.com/docs/plans/hobby). Không nâng gói hoặc tạo tài nguyên trả phí.

```powershell
Set-Location H:\LC\web
npx.cmd --yes vercel@59.23.2 login
npx.cmd --yes vercel@59.23.2 whoami
npx.cmd --yes vercel@59.23.2 link
npx.cmd --yes vercel@59.23.2 deploy --target preview
```

Khi link: chọn scope cá nhân và tạo project `lc-compass` nếu chưa có; nếu tên đã tồn tại trong tài khoản, dùng `lc-compass-2026`, không ghi đè dự án không liên quan. Lưu project ID/deployment ID do CLI trả về vào REPORT; không lưu token.

Trong Project Settings > Environment Variables, cấu hình riêng Preview và Production:

| Biến | Giá trị |
|---|---|
| LIVE_RESEARCH_ENABLED | false (cũng có default trong vercel.json) |
| NEXT_PUBLIC_SITE_URL | URL HTTPS thực tế của môi trường tương ứng |

Chỉ định `--target preview`: CLI mặc định có thể gán lần deploy đầu tiên của project mới vào Production. Dùng alias Preview ổn định, lưu URL đó rồi redeploy để biến NEXT_PUBLIC có hiệu lực build. Chưa cấp Gemini/Redis key. AI hiện là mô phỏng, không có backend live; feature flag không biến mock thành AI thật.

## Kiểm tra và Production

```powershell
npm.cmd run content:validate
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
$env:PLAYWRIGHT_PORT='3106'
npm.cmd run test:e2e -- --workers=2
```

Để kiểm thử deployment, đặt `PLAYWRIGHT_TEST_BASE_URL` thành URL cần kiểm tra rồi chạy E2E. Config không khởi động local server khi có biến này. Preview có Vercel Authentication cần kiểm tra qua phiên hợp lệ; không đưa bypass secret vào báo cáo. Production phải truy cập được không đăng nhập.

Sau Preview đạt: xác nhận production domain trong dashboard, cấu hình NEXT_PUBLIC_SITE_URL theo domain đó cho Production rồi chạy:

```powershell
npx.cmd --yes vercel@59.23.2 deploy --prod
```

Kiểm tra `/`, `/services`, `/places`, `/discover`, `/demo`, hai thẻ demo, 404 và nguồn tham khảo trên mobile/desktop. Không đổi nguồn chưa duyệt thành published để làm đầy trang. Published hiện rỗng là trạng thái có chủ đích; `/demo` có 2 thẻ thật chưa rà soát.

Kiểm tra URL `/content/published/cards.json`, `/content/sourced-demo/cards.json`, `/.env`, `/research/FREE_APIS.md`, `/handoff/STATUS.md` trả 404. Không thử hiển thị secret trong log. Xác nhận bản đồ vẫn là minh họa và tính năng AI không được mô tả là live.

## Rollback và vận hành

Ghi deployment Production trước và sau mỗi lần phát hành. Khi lỗi, dùng chức năng Instant Rollback trong dashboard tới deployment đã nghiệm thu hoặc `vercel rollback <deployment-url>`. Lần phát hành đầu chưa có bản trước để rollback. Không rollback nội dung đã bị rút thành nội dung hiện hành; ưu tiên redeploy bản sửa giữ trạng thái thu hồi mới nhất. Kiểm tra lại ngày hết hạn nội dung và cấu hình AI sau rollback.

Trong ngày demo: kiểm tra các URL chính, lỗi function trong Vercel Logs và Usage của Hobby; không bật dịch vụ trả phí tự động. Ghi số lượt thử nghiệm thật riêng, không dùng lượt test làm minh chứng tác động cộng đồng.

Nguồn: [Vercel deploy](https://vercel.com/docs/cli/deploy), [Project settings](https://vercel.com/docs/project-configuration/general-settings), [Next file tracing](https://nextjs.org/docs/app/api-reference/config/next-config-js/output), [Next security August 2026](https://nextjs.org/blog/august-2026-security-release).
