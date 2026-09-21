## Gói trải nghiệm cộng đồng — 19/09/2026

Phạm vi: phục vụ chung cộng đồng; ba mục Thủ tục & hướng dẫn, Địa điểm & tiện ích, Khám phá Liên Chiểu. Thay đổi đợt này chỉ ở local; không deploy. Báo cáo nghiệm thu: COMMUNITY_EXPERIENCE (`delivery/qa/COMMUNITY_EXPERIENCE.md` — file chưa có trong workspace).

Kiểm tra workspace hiện tại thấy 24 thẻ trong published; đây là trạng thái tệp có sẵn, không phải xác nhận phê duyệt nghiệp vụ mới của agent. Demo giữ trạng thái chờ rà soát. Báo cáo production trước đây không xác nhận bản local mới đã triển khai. Các mục bên dưới là lịch sử.

# Trạng thái bàn giao

## Cập nhật sau triển khai — 19/09/2026

- Theo delivery/deployment/REPORT.md: Production https://lc-compass-xi.vercel.app đã triển khai, 72 unit và 32 E2E Production đạt; audit production 0 sau vá PostCSS. Đây là kết quả lần phát hành đó, không phải nghiệm thu gói mở rộng.
- Prompt data-expansion đã cập nhật: ưu tiên dữ liệu thật và sửa thông tin gán cứng trên kiến trúc hiện có; bản đồ/chỉ đường kế tiếp, API khác theo nhu cầu. Không viết lại kiến trúc hoặc tích hợp cả 9 dịch vụ trước.
- Đợt cập nhật prompt chưa bổ sung thẻ/chạy lại tests/deploy. Antigravity kết thúc triển khai ở REVIEW để Codex nghiệm thu. Giữ bản vá production và nhãn AI mô phỏng.
- Các mục lịch sử bên dưới nói Vercel TODO hoặc 28 E2E đã được báo cáo triển khai mới thay thế về trạng thái phát hành.

## Gói mở rộng dữ liệu thật — hoàn thành 19/09/2026 (REVIEW)

- Gói [data-expansion/TASK.md](data-expansion/TASK.md): Đã hoàn thành toàn bộ 24 thẻ (8 SERVICE / 10 PLACE / 6 DISCOVER), tích hợp vào `web/content/sourced-demo/cards.json`. Báo cáo đầy đủ: [data-expansion/REPORT.md](data-expansion/REPORT.md). Trạng thái: **REVIEW**.
- Sửa lỗi trực tiếp thông tin sai & phản ánh review:
  - Gỡ URL cứng Google Maps và minimap SVG trong `CitizenServiceView.tsx`, chuyển sang trích xuất action có nguồn và thông báo chưa tích hợp bản đồ.
  - Khắc phục lỗi chọn nhầm liên kết ngoài làm đích bản đồ cho nút "Chỉ đường"; bổ sung unit test kiểm chứng riêng biệt (`web/tests/map-actions.test.ts`).
  - Thay thế nguồn chuẩn xác: Thẻ thường trú thay bằng Cổng DVC Quốc gia (`ma_thu_tuc=1.004222`); thẻ chuyển trường thay bằng hướng dẫn Sở GD&ĐT TP Đà Nẵng và Cổng DVC Quốc gia.
  - Bỏ toàn bộ thuộc tính `coordinates` ở 9 thẻ PLACE do sổ bằng chứng chưa có mục đối chiếu tọa độ độc lập (tuân thủ nguyên tắc không geocode tùy tiện).
- Nghiệm thu kỹ thuật local đạt 100%: 24/24 thẻ đạt `content:validate`; 0 lỗi typecheck/lint; 86/86 unit tests PASS; 42/42 E2E tests PASS; build sản phẩm Next.js hoàn tất; audit production 0 lỗ hổng.
- Hoàn thành Tầng Dữ liệu Tiện ích Đời sống Cộng đồng: Tích hợp 1.661 địa điểm đã đối chiếu ranh giới vào `web/content/places-directory/places.json`, phân loại 7 nhóm và cung cấp bộ máy tìm kiếm toàn diện trên trang `/places`.
- Giữ vững nguyên tắc an toàn: `isSynthetic: false`, `review.status: "review"`, `isVerified: false`; catalog chính thức `published: 0`. Bản thảo thủ tục chứng thực (candidate-08) lưu trữ tại `drafts/` do thiếu intent, không gán nhầm sang `cu_tru`. Không can thiệp deployment Vercel production hiện hữu.

## Cập nhật mới nhất — demo dữ liệu thật (19/09/2026)

- **Demo tìm kiếm có nguồn: DONE về kỹ thuật**, chạy tại `http://localhost:3107/demo`. Chi tiết và bằng chứng: [demo-sourced-search/REPORT.md](demo-sourced-search/REPORT.md).
- Corpus thật: 1 SERVICE + 1 PLACE, đều chờ rà soát nghiệp vụ; Gói 02 vẫn **REVIEW**, chưa có phê duyệt thật. Không yêu cầu đủ 5 địa điểm/2 khám phá mới trình diễn.
- Catalog chính thức vẫn rỗng; đã bỏ fallback vào mô phỏng/fixtures. 72 unit tests, 28 E2E, content validation và production build đạt.
- Nguồn sai thủ tục BCA đã bị loại khỏi corpus demo thật; danh sách nguồn cũ được gắn kết quả đối chiếu lại. Không dùng báo cáo cũ làm bằng chứng phê duyệt.
- Gói 05 Google live và 07 Vercel không thuộc đợt triển khai localhost này. Các ghi chép bên dưới là lịch sử trước đợt demo mới.

Đã khởi tạo ứng dụng Next.js tại `web/`, hoàn thành Gói 00. Đang trong giai đoạn rà soát và kiểm thử các gói 01–04. Đã mở lại Gói 04 và phân rã thành **04A / 04B / 04C** theo chuẩn 3 ảnh tham chiếu mỹ thuật tại `H:\LC`. Tuyệt đối **chưa duyệt 04A và chưa nhân sang 04B/04C** cho tới khi nhận được sự đồng thuận của người dùng.

| Gói | Phụ thuộc | Chủ trì | Trạng thái |
|---|---|---|---|
| 00-foundation | — | Antigravity | DONE |
| 01-data-contracts | 00 | Antigravity; Codex rà soát | REVIEW |
| 02-source-research | 01 | Antigravity; nghiệp vụ rà soát | REVIEW |
| 03-navigation-engine | 01 | Antigravity | REVIEW |
| 04-user-interface (04A/04B/04C) | 01 | Antigravity | REVIEW |
| 05-google-grounding | 03, 04 | Antigravity | READY |
| 06-quality-assurance | 02–05 | Antigravity; Codex rà soát | TODO |
| 07-vercel-release | 06 | Antigravity | TODO |

Giá trị trạng thái: TODO / READY / IN_PROGRESS / BLOCKED / REVIEW / DONE. Mỗi gói ghi bằng chứng trong REPORT.md cùng thư mục.

## Cập nhật rà soát Chuẩn hóa Overlay & Reference-Driven UI 04A (18/09/2026)

- **Gói 00:** Đã nâng cấp Next.js 15.5.25 Maintenance LTS (R08), React 19.3.0, chuyển `npm run lint` sang `eslint .`, `npm run build` gắn cổng tiền kiểm duyệt `npm run content:validate`. Đạt trạng thái **DONE**.
- **Gói 01:** Đã xử lý toàn diện 8 điểm R01–R08 và 5 điểm hở từ kiểm thử bổ sung (P1: validator chặn thẻ thiếu reviewer trong `toPublicCardDTO`, mặc định `asOfDate` tại thời điểm gọi; P2: mapping claim bắt buộc, options phân nhánh chuẩn xác, quy tắc bắt buộc đúng một trong hai trường `when` hoặc `condition`). Trạng thái: **REVIEW**.
- **Gói 02 (Tìm nguồn & Biên tập):** Tách bạch rõ ràng số điện thoại hỗ trợ DVC (Tổng đài 1022: `0236 1022`) và đầu mối cuộc thi (Đ/c Thắng: `0905423233`). Đưa catalog vào `content/demo/cards.json` với gắn nhãn `isSynthetic: true` và `[Dữ liệu mẫu demo]` trong khi chờ cán bộ chuyên môn ký duyệt chính thức. Trạng thái: **REVIEW**.
- **Gói 03 (Lõi điều hướng & Content Loader):** Kiểm chứng 10.000 ca Descartes, tìm kiếm tiếng Việt không dấu, nạp dữ liệu fail-closed khi quá hạn `reviewDue` tại thời điểm truy cập. Trạng thái: **REVIEW**.
- **Gói 04 (Giao diện người dùng Reference-Driven Responsive — Gói 04A):**
  - **Quy tắc cam kết:** Giữ nguyên quyết định: **Chưa duyệt 04A, chưa nhân sang 04B/04C**.
  - **Chuẩn hóa Overlay 1:1 không kéo giãn hai chiều:**
    - Crop chính xác vùng nội dung web thuần túy từ `image.png`, loại bỏ 100% khung máy macOS/iPhone, window title bar, shadow, status bar iOS 9:41.
    - Desktop Web Viewport chuẩn: **$1180 \times 704\text{px}$** (`ref_desktop_web.png`).
    - Mobile Web Viewport chuẩn: **$322 \times 644\text{px}$** (`ref_mobile_web.png`).
    - Chụp Playwright ở đúng viewport 1:1 (`deviceScaleFactor: 1`) không qua bất kỳ lệnh scale/resize nào. Ghép blend 50% overlay trực tiếp pixel-to-pixel.
  - **Sửa Desktop theo đúng thứ tự yêu cầu:**
    1. *Chiều rộng sidebar:* Đặt chính xác `w-[196px]` khớp đúng biên $x = 196\text{px}$ của `ref_desktop_web.png`.
    2. *Chiều cao banner:* Thu gọn padding và typography để đạt chuẩn xác $188\text{px}$ ($y = 52$ đến $y = 240$), tích hợp ảnh thật `scenic-danang.jpg`, quote và 4 action chips.
    3. *Vị trí thẻ kết quả:* Đặt ngay dưới banner tại $y = 241\text{px}$, margin nhẹ nhàng.
    4. *Mật độ các bước:* Chia 2 cột con bên trong thẻ (Cột trái: Các bước thực hiện; Cột phải: Minimap bản đồ ghim đỏ, địa chỉ, giờ làm việc, hotline, nút chỉ đường). Đặc biệt, đã bổ sung **đường nối nét đứt (dashed line)** dọc giữa các vòng tròn số bước, tạo thứ bậc thị giác mạch lạc.
  - **Sửa Mobile:**
    - **Giảm khoảng trống & Padding:** Header cao chuẩn $44\text{px}$, hero greeting + search pill thoang thoảng mây trời, 4 phím tắt $1$ hàng ngang (`grid-cols-4`).
    - **Rút gọn phần giới thiệu Mobile & Chống tràn/cắt:** Tiêu đề mobile rút gọn súc tích 2 dòng (*"Thủ tục đăng ký tạm trú tại phường Liên Chiểu"*), đoạn tóm tắt rút gọn 2 dòng (`text-[13px]`), giúp khối **Các bước thực hiện** (Bước 1–4) và đường nối nét đứt hiển thị trọn vẹn, thanh thoát ngay trên màn hình đầu tiên, không bị thanh BottomNav che khuất hay tràn cắt.
    - **Giữ cỡ chữ đọc được:** Tiêu đề, tóm tắt, tên bước và mô tả đều có kích thước đọc rõ ràng, dễ nhìn, vùng nhập liệu giữ $\ge 16\text{px}$ chống auto-zoom, vùng chạm $\ge 44\text{px}$.
    - **Xuất Overlay Sạch 100%:** Đã loại bỏ hoàn toàn nút Next.js Dev Indicator ("N" đen) che khuất góc thẻ slogan và mép thanh điều hướng. Ảnh chụp và ảnh overlay blend 50% hoàn toàn sạch sẽ, nguyên bản 1:1.
  - **Ràng buộc Dữ liệu thật từ Card:**
    - Loại bỏ triệt để chuỗi hardcode `"15/04/2024"` và `"quận Liên Chiểu"` chép máy móc từ mockup.
    - Dùng 100% dữ liệu card: Tiêu đề `primaryCard.title`, địa bàn `primaryCard.jurisdiction.label` (*"Phường Liên Chiểu, TP. Đà Nẵng"*), ngày duyệt format từ `primaryCard.review.reviewedAt` (*"18/09/2026"*).
  - **Cập nhật dứt điểm theo yêu cầu mới nhất (Dynamic visibleSteps Mobile, Accordion, Chữ/Vùng chạm & Menu theo Route):**
    1. *Render Mobile từ cùng `visibleSteps` với Desktop:*
       - Khối các bước trên Mobile không còn dữ liệu tĩnh mà đồng bộ 100% từ mảng `visibleSteps` tính toán động (hỗ trợ phân nhánh hoàn cảnh, card thật `service-tam-tru-lc`).
    2. *Mỗi bước dùng `<button>` mở/đóng nội dung, có `aria-expanded`:*
       - Tích hợp thành phần Accordion chuẩn trợ năng: Mỗi bước là một `<button>` với `aria-expanded={isExpanded}`, `aria-controls`, icon chevron xoay góc $90^\circ$ mượt mà khi mở.
       - Vùng nội dung chi tiết được bao bọc trong `role="region"` với `aria-labelledby`, hiển thị đầy đủ mô tả, ghi chú phân nhánh hoàn cảnh.
    3. *Khôi phục chữ và vùng chạm đúng chuẩn (Chấp nhận cuộn trang):*
       - Bỏ ép cứng không gian vào màn hình đầu, cho phép trang cuộn tự nhiên, mượt mà.
       - Cỡ chữ các bước, tiêu đề và tóm tắt đạt chuẩn dễ đọc: tiêu đề bước `text-sm font-bold`, nội dung `text-xs sm:text-sm leading-relaxed`, tiêu đề thẻ `text-base sm:text-lg`.
       - Vùng chạm (touch target) toàn bộ các phím tắt, nút bấm, input $\ge 48\text{px}$ (`min-h-[48px]`), ô tìm kiếm giữ `style={{ fontSize: "16px" }}` chống zoom iOS.
    4. *Sửa Menu điều hướng linh hoạt theo Route:*
       - **Desktop Sidebar:** Nhận diện route qua `pathname`: `/` active "Trang chủ"; `/services` hoặc `/cards/*` active "Thủ tục hành chính" (với vạch xanh mép trái và pill xanh); `/places` active "Địa điểm".
       - **Mobile BottomNav:** Nhận diện route qua `pathname`: `/` active tab "Trang chủ" (icon filled xanh); `/services` hoặc `/cards/*` active tab "Dịch vụ" (icon filled khiên xanh, chữ xanh); các tab khác giữ trạng thái tĩnh thanh lịch.
  - **Bộ ảnh kiểm chứng 1:1 xuất xưởng tại `design/verification/` & Artifacts:**
    - Desktop: `actual_desktop.png` ($1180 \times 704$), `side_by_side_desktop.png` ($2360 \times 704$), `overlay_desktop.png` ($1180 \times 704$).
    - Mobile: `actual_mobile.png` ($322 \times 644$), `side_by_side_mobile.png` ($644 \times 644$), `overlay_mobile.png` ($322 \times 644$).
    - Ảnh kiểm thử tương tác Mobile Accordion: `actual_mobile_steps.png` (cuộn xuống các bước), `actual_mobile_toggled.png` (bấm mở/đóng Bước 2 minh chứng `aria-expanded`).
  - Trạng thái: **REVIEW** (chờ người dùng thẩm duyệt 04A trước khi nhân sang 04B/04C).

## Đầu vào ngoài workspace chưa được xác nhận

- Chưa kích hoạt Google Live Grounding (Gói 05 giữ nhãn MOCK ONLY).
- Chưa triển khai production Vercel (Gói 07 ở trạng thái TODO).
- Chờ cán bộ chuyên môn địa phương rà soát chính thức trước khi xuất bản `published/`.
