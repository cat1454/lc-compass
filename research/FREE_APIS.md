# API miễn phí cho LC Compass

## Cập nhật triển khai UI — 19/09/2026

Đã triển khai local đợt đầu: `LocationPanel` dùng chung tại chi tiết PLACE, DISCOVER, demo và widget địa điểm dịch vụ. PLACE có địa chỉ tạo Google Maps Search URL (`api=1`, mã hóa bằng `URLSearchParams`), nhãn rõ “Tìm trên Google Maps theo địa chỉ”. Đây là liên kết mở Maps, chưa phải bản đồ nhúng/API tile. SERVICE/DISCOVER chỉ mở bản đồ khi có action bản đồ riêng; không suy địa điểm từ tên khu vực. Chưa thêm key, dependency hoặc dịch vụ trả phí.

Chi tiết điểm tích hợp, kiểm thử và phần còn lại: [UI_API_INTEGRATION.md](UI_API_INTEGRATION.md). Các đoạn “chưa triển khai” bên dưới mô tả kế hoạch nghiên cứu ban đầu; trạng thái hiện hành của đợt UI theo mục này.

Đối chiếu tài liệu nhà cung cấp ngày 19/09/2026. Đây là nghiên cứu lựa chọn, chưa tích hợp hoặc tạo tài khoản dịch vụ. Hạn mức có thể thay đổi; kiểm tra lại trước khi bật dịch vụ. Mục tiêu: prototype nhỏ, phục vụ Liên Chiểu, chi phí thấp.

| Dịch vụ | Ứng dụng trong sản phẩm | Key / hạn mức miễn phí | Điều kiện và ưu tiên |
|---|---|---|---|
| [Leaflet](https://leafletjs.com/) + [OpenStreetMap tiles](https://operations.osmfoundation.org/policies/tiles/) | Thay minimap SVG; ghim điểm tiếp nhận, địa điểm cộng đồng | Leaflet là thư viện, OSM là dịch vụ tile; không cần key, không có quota bảo đảm | Ưu tiên 1. Ghi © OpenStreetMap contributors, giữ Referer, tôn trọng cache; không tải hàng loạt/offline; không SLA |
| [Google Maps URLs](https://developers.google.com/maps/documentation/urls/get-started) | Nút chỉ đường từ thẻ địa điểm | Không cần key; là URL mở Google Maps, không phải API nhúng | Ưu tiên 1. Dùng điểm đến đã kiểm chứng; nếu chỉ có địa chỉ thì ghi rõ tìm theo địa chỉ |
| [Open-Meteo Weather](https://open-meteo.com/en/pricing) | Thời tiết ở trang Khám phá, hỗ trợ lên lịch ngoài trời | API mở không cần key; phi thương mại; 600/phút, 5.000/giờ, 10.000/ngày, 300.000/tháng | Ưu tiên 2. Cache phía server, hiển thị nguồn và thời điểm; không coi là cảnh báo thiên tai chính thức |
| [Geoapify](https://www.geoapify.com/pricing/) | Tìm địa chỉ, geocoding, POI và tile khi mở rộng bản đồ | Cần key; 3.000 credits/ngày; chi phí credits tùy API | Khi cần tìm kiếm địa điểm. Ghi nguồn theo nhà cung cấp; giới hạn key theo khả năng dịch vụ hỗ trợ |
| [Nominatim công cộng](https://operations.osmfoundation.org/policies/nominatim/) | Hỗ trợ biên tập địa chỉ thành tọa độ | Không cần key; tối đa 1 request/giây cho ứng dụng | Không dùng autocomplete, không truy vấn có hệ thống; cache kết quả, nhận diện ứng dụng; kiểm tra tọa độ thủ công |
| [Open-Meteo Air Quality](https://open-meteo.com/en/docs/air-quality-api) | Dự báo chất lượng không khí cho hoạt động cộng đồng | API mở không cần key; áp dụng điều kiện free tier của Open-Meteo | Bổ sung sau. Dữ liệu mô hình theo vùng, không phải cảm biến tại phường; ghi nguồn Open-Meteo và CAMS |
| [Gemini API](https://ai.google.dev/gemini-api/docs/pricing) | Tóm tắt và giải thích nội dung có nguồn | Cần key; free tier phụ thuộc model; xem quota thực tế trong tài khoản | Sau khi có kiểm soát nguồn, rate limit và ngân sách. Free tier có thể dùng nội dung để cải thiện sản phẩm; không gửi hồ sơ cá nhân |
| [Supabase](https://supabase.com/pricing) | Góp ý, danh mục quản trị, tài khoản biên tập | Cần project/key; free database 500 MB/project, còn quota Auth/Storage/egress | Chỉ thêm khi cần ghi dữ liệu; RLS cho bảng truy cập từ client, service-role key chỉ ở server; kiểm tra chính sách pause free project |
| [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/plans/) | Chống spam biểu mẫu hoặc lạm dụng AI | Có free plan, tối đa 20 widgets; site key và secret | Khi mở biểu mẫu. Bắt buộc xác thực token bằng Siteverify ở server, kết hợp rate limit |

## Lộ trình đề xuất (chưa triển khai)

**Thứ tự thực hiện cập nhật 19/09/2026:** trước các mục tích hợp bên dưới, hoàn thiện dữ liệu có nguồn trên kiến trúc hiện có và nghiệm thu local. Catalog hiện mới có 2 thẻ; API không thay thế bằng chứng cho nội dung. Gói data-expansion chỉ sửa đích bản đồ gán cứng/thông tin gây hiểu nhầm, chưa tích hợp API. Sau đó ưu tiên Google Maps URLs theo địa chỉ có nguồn, rồi Leaflet/OSM khi có tọa độ đủ căn cứ. Hướng dẫn thực thi: [prompt Antigravity](../docs/handoff/data-expansion/ANTIGRAVITY_PROMPT.md). Bảng ưu tiên 1/2 ở trên là thứ tự tương đối giữa các dịch vụ, không có nghĩa phải làm trước dữ liệu.

1. Minimap + nút chỉ đường: dùng component client tải lười để tương thích Next.js SSR. Chỉ ghim tọa độ đã đối chiếu, lưu nguồn tọa độ; không suy đoán cơ quan từ tên phường cũ. Thiếu tọa độ thì hiển thị địa chỉ và liên kết tìm kiếm, không tạo marker giả.
2. Thời tiết: lấy dữ liệu theo tọa độ địa điểm đã kiểm chứng, timezone Asia/Bangkok; cache 30 phút, timeout và thông báo không tải được. Không cần xin GPS để hiển thị thời tiết khu vực.
3. Chỉ thêm geocoding/POI khi danh mục đủ lớn; chỉ thêm Supabase/Turnstile khi có biểu mẫu hoặc biên tập viên thật.
4. AI: chọn model còn free tier lúc triển khai; key server-only; câu trả lời phải gắn nguồn, không tự phê duyệt thủ tục hành chính. Giữ tính năng tắt nếu thiếu key hoặc limiter.

## Điểm tích hợp trong mã hiện tại

- `CitizenServiceView`: hiện dùng `/minimap.svg`; cần loại bỏ địa điểm hard-code khi tích hợp bản đồ thật.
- `PlaceDetailView`, `DiscoverDetailView` và trang chi tiết `/demo/cards/[id]`: dùng chung component bản đồ; không chỉ tích hợp ở trang chính vì danh mục published hiện rỗng.
- `ExternalResearchBox`: hiện trả lời mô phỏng; có biến môi trường không có nghĩa backend AI đã tồn tại.
- Hiện không thay schema, thêm endpoint hay gửi dữ liệu người dùng tới dịch vụ mới.

## Chi phí và nghiệm thu cho đợt tích hợp sau

Mục tiêu chi phí dịch vụ là 0 đồng trong quota và điều kiện free tier; không cam kết miễn phí vĩnh viễn. Kiểm tra bản đồ trên mobile, marker đúng địa chỉ, attribution luôn đọc được, nút chỉ đường đúng đích, lỗi/quota không làm hỏng nội dung. Kiểm thử tự động dùng mock, không quét tile công cộng. API bản đồ/AI không thay thế nguồn chính thức xác nhận địa bàn, thẩm quyền hay thủ tục.
