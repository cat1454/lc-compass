# Điểm tích hợp API trên UI — đợt 1, 19/09/2026

Trạng thái: đã sửa và kiểm thử local; chưa deploy. Không thay dữ liệu hoặc trạng thái phê duyệt thẻ. Thư mục làm việc không có Git repository nên không có diff/commit để đối chiếu.

## Đã thực hiện

- `web/src/components/LocationPanel.tsx`: khối vị trí dùng chung, địa chỉ luôn đọc được, nút tìm bản đồ theo địa chỉ, trạng thái khi thiếu đích và dữ liệu mô phỏng.
- Gắn vào `PlaceDetailView`, `DiscoverDetailView`, `CitizenServiceView` và `/demo/cards/[id]`.
- `web/src/lib/map-links.ts`: Google Maps Search URL theo tên/địa chỉ từng PLACE; không tự lấy tâm phường hoặc tọa độ chưa đối chiếu. SERVICE/DISCOVER cần action riêng.
- Thay nhận diện bản đồ bằng từ khóa trong nhãn/URL bằng kiểm tra URL HTTPS, hostname/path. Loại URL giả mạo hostname, URL website thường dù mang nhãn “Chỉ đường”, URL chứa thông tin đăng nhập.
- Không gửi vị trí GPS hoặc nội dung người dùng đến dịch vụ mới. Chỉ mở Maps khi người dùng bấm link.

Google Maps URLs không cần key; tài liệu đã đối chiếu: https://developers.google.com/maps/documentation/urls/get-started. Chi phí tích hợp đợt này: không thêm phí dịch vụ.

## Vị trí cho các đợt sau

| Dịch vụ | Vị trí UI | Điều kiện trước khi bật |
|---|---|---|
| Leaflet + OSM tiles | Bên trong `LocationPanel`, trên nút mở Maps | Có tọa độ và bằng chứng; client-only/lazy; attribution; lỗi tile vẫn đọc địa chỉ |
| Open-Meteo Weather | Sidebar `DiscoverDetailView` và chi tiết khám phá demo | Có địa điểm/tọa độ đối chiếu và nhu cầu ngoài trời; server cache 30 phút, timeout, nguồn/thời điểm |
| Open-Meteo Air Quality | Cùng khu vực thời tiết nếu cần | Ghi rõ dự báo theo vùng; ghi nguồn CAMS/Open-Meteo |
| Geoapify / Nominatim | Công cụ biên tập địa chỉ | Đối chiếu kết quả; không tự thêm autocomplete Nominatim công cộng |
| Gemini | `ExternalResearchBox` | Endpoint server, key, limiter, nguồn và kiểm thử lỗi; hiện giữ mô phỏng |
| Supabase / Turnstile | Biểu mẫu góp ý khi có luồng tiếp nhận thật | Nhu cầu ghi dữ liệu, RLS và xác thực token ở server |

Các dòng này là điểm tích hợp dự kiến, chưa phải tính năng đã nối API. Không dựng widget thời tiết giả hoặc marker giả để lấp chỗ trống.

## Kết quả kiểm thử

- `npm.cmd run typecheck -- --incremental false`: exit 0.
- `npm.cmd run lint`: exit 0.
- `npm.cmd run test -- --reporter=dot --no-cache`: 96/96, exit 0.
- `NEXT_DIST_DIR=.next-map-ui npm.cmd run build`: validation và production build đạt, exit 0.
- `NEXT_DIST_DIR=.next-map-ui PLAYWRIGHT_PORT=3112 npm.cmd run test:e2e -- tests/location-panel.spec.ts --output=test-results-map-ui`: 2/2 project desktop/mobile đạt, exit 0. Mỗi project kiểm tra 320/375/1440px, mở đúng URL qua mock và không tràn ngang; không gọi Maps thật trong test.
- Ảnh tại `web/test-results-map-ui/`; đã xem ảnh mobile 375px. Build tự thêm đường dẫn types `.next-map-ui` vào cấu hình Next/TypeScript.

Lần chạy ban đầu bị chặn ghi cache/build trong sandbox; đã dùng typecheck không incremental, Vitest không cache, rồi build/E2E local với quyền được duyệt. Chưa kiểm tra bản đồ nhúng, thời tiết, quota hoặc backend AI vì chưa triển khai các phần đó.

## Gói trải nghiệm cộng đồng — 19/09/2026

Ba mục dùng chung: Thủ tục & hướng dẫn, Địa điểm & tiện ích, Khám phá Liên Chiểu. Gói này sửa điều hướng, tìm kiếm/bộ lọc URL, chữ lớn xuyên trang và nhãn trạng thái nội dung; không tích hợp thêm API. Tra cứu mở rộng hiển thị chưa kết nối, có liên kết tìm nội bộ.

Xem báo cáo local (`delivery/qa/COMMUNITY_EXPERIENCE.md` — file chưa có trong workspace). Không suy ra trạng thái production từ các thay đổi local này. Dữ liệu published và trạng thái phê duyệt được giữ nguyên.
