# Sự kiện cộng đồng và bản đồ theo mẫu — 01/10/2026

## Trạng thái bàn giao

- Nền MapLibre + MapTiler Streets v2 đã tích hợp. Khóa riêng có trong cấu hình local; kiểm tra style trả HTTP 200. Không lưu giá trị khóa trong báo cáo.
- Popup có ảnh 16:9, tiêu đề serif, đơn vị tổ chức, ngày/giờ Việt Nam, địa điểm/địa chỉ, nút chỉ đường và chi tiết. Có nhãn ảnh địa điểm, nguồn ảnh và trạng thái lỗi ảnh.
- 7 sự kiện Bách khoa đã rút khỏi catalog. Hồ sơ gốc và bằng chứng vẫn ở ../2026-10-01/. Những bản Bách khoa khác cũng được đánh dấu ngoài phạm vi.
- Danh mục thật hiện có **0 sự kiện đủ điều kiện nhập**. Không thêm dữ liệu giả để làm đầy bản đồ.
- 27 hồ sơ đang theo dõi: **11 chờ xác minh, 16 loại khỏi phạm vi**, không có bản được duyệt. Có 4 đầu mối cộng đồng mới cần thông tin bổ sung.
- Chưa nghiệm thu địa giới: có ảnh bản đồ chính thức, chưa có polygon tọa độ đủ căn cứ. Lớp ranh giới sẽ chỉ bật với GeoJSON đã duyệt. Không tự vẽ từ ảnh.

## Đầu mối mới

| Hoạt động | Quyết định | Lý do |
|---|---|---|
| Ngày hội Chuyển đổi số phường Liên Chiểu | pending | Mới có lịch họp triển khai 29/09; chưa có lịch sự kiện, địa điểm, tọa độ và ảnh. |
| Hội trại cộng đồng: đoàn kết, sống số, sáng tạo, khởi nghiệp | pending | Đầu mối từ cuộc họp triển khai; không lấy ngày họp làm ngày hội trại. Thiếu lịch, địa điểm, tọa độ và ảnh. |
| Tập huấn khởi nghiệp sáng tạo trong thời đại số | pending | Thông báo đăng ký nhu cầu không xác nhận thời gian/địa điểm lớp học; thiếu tọa độ và ảnh. |
| Ra mắt mô hình an ninh trật tự với đội dân phòng | pending | Lịch đăng ký hội trường ghi 03/10 08:00; chưa có thông báo gốc chi tiết về đối tượng tham gia, ảnh và nguồn tọa độ. |
| Cầu lông các CLB phường Hải Vân mở rộng | rejected | Địa điểm Thanh Đàm 10, phường Hải Vân; ngoài địa bàn. |
| Festival chuyển đổi số trong thanh thiếu niên | rejected | Địa điểm 48 Võ An Ninh, phường Hòa Xuân; ngoài địa bàn. |
| Lễ tái khởi động Golden Hills | rejected | Lịch nguồn ghi phường Hải Vân; không suy từ tên Liên Chiểu cũ. |

Không lấy ngày họp triển khai ngày hội/hội trại (29/09) làm ngày sự kiện. Công văn tập huấn chỉ yêu cầu tổng hợp nhu cầu trước 25/09, không có lịch/địa điểm lớp học. Giải cầu lông Hải Vân và Festival Hòa Xuân có lịch nhưng ngoài phường Liên Chiểu.

## Nguồn đã kiểm tra

| Tài liệu | Kiểm tra UTC | Đọc | Kết luận |
|---|---|---|---|
| [Lịch UBND phường, 28/09–04/10/2026](https://lienchieu.danang.gov.vn/web/guest/lich-cong-tac-ubnd) | 2026-10-01T09:11:44+00:00 | read | Lịch có họp chuẩn bị ngày hội/hội trại 29/09; không phải ngày tổ chức. Cầu lông 03/10 ở Hải Vân, Festival 04/10 ở Hòa Xuân. |
| [Đăng ký nhu cầu tập huấn khởi nghiệp](https://lienchieu.danang.gov.vn/chi-tiet-tin-tuc?d=1045&c=7) | 2026-10-01T09:11:45+00:00 | read | Thông báo đăng ký nhu cầu, chưa xác định lịch/địa điểm tổ chức. |
| [Công văn 3128/UBND-VHXH](https://lienchieu.danang.gov.vn/documents/20121/46426/3128.UBND.VHXH.24.09.2026.signed.signed.signed.signed%20%281%29%20%281%29_29092026050942.pdf) | 2026-10-01T09:11:45+00:00 | read | Đã đọc PDF: hạn tổng hợp nhu cầu 25/09/2026; không phải ngày sự kiện. Không có lịch/địa điểm tập huấn cụ thể. |
| [Bản đồ hành chính phường (ảnh)](https://lienchieu.danang.gov.vn/documents/20121/42772/bandolienchieu.jpg) | 2026-10-01T09:11:45+00:00 | read | Đã xem ảnh, thể hiện phường Liên Chiểu 41,19 km². Chỉ là raster, không kèm tọa độ polygon hoặc hệ quy chiếu để nhập GeoJSON. |
| [Trang phường — tìm đầu mối](https://lienchieu.danang.gov.vn/) | 2026-10-01T09:11:46+00:00 | read | Chỉ tìm đầu mối bài và lịch, không dùng trang chủ làm minh chứng sự kiện. |
| [Thành đoàn — tìm đầu mối](https://thanhdoandanang.org.vn/) | 2026-10-01T09:11:47+00:00 | read | Không tìm được thông báo đủ ngày/địa điểm tại phường trong các trang đã đọc. |
| [Danh mục sự kiện du lịch](https://danangfantasticity.com/su-kien) | 2026-10-01T09:11:54+00:00 | read | Chưa có sự kiện địa bàn Liên Chiểu đủ điều kiện từ trang đã đọc. |

sources.json giữ ngày đăng nếu biết, thời điểm đọc và SHA-256 phản hồi. Trang chủ chỉ dùng tìm đầu mối, không dùng chứng minh sự kiện. Công cụ web search lỗi xác thực 401; đã chuyển sang đọc trực tiếp các cổng chính thức và PDF đính kèm. Kết quả không phải kiểm kê đầy đủ mọi bài mạng xã hội/sự kiện trong phường. Xem research-limits.json.

## Ảnh và địa giới

Chưa có sự kiện mới đủ lịch/địa điểm để duyệt ảnh. Bảng ảnh sự kiện nhập vì vậy đang rỗng; các ảnh UI trong kiểm thử là fixture ghi rõ KIỂM THỬ, không phải poster thật. Không dùng ảnh Bách khoa hoặc ảnh tạo bằng AI làm minh chứng. Khi nhập, bắt buộc image.src HTTPS, alt, kind event/venue, sourceUrl, credit, checkedAt; thiếu ảnh thì chờ.

Ảnh bản đồ từ cổng phường thể hiện phường Liên Chiểu 41,19 km². Ảnh không kèm tọa độ từng đỉnh/hệ quy chiếu; không thể dùng trực tiếp làm GeoJSON có độ chính xác được xác minh. boundary-review.json và web/content/data/event-boundary.json lưu trạng thái pending và FeatureCollection rỗng có chủ đích. Khi có GeoJSON đã kiểm chứng, cần sourceUrl, checkedAt, version và status verified; hệ thống mới bật tô vùng/đường viền, tên phường và ẩn lớp nhãn hành chính cũ, giữ nhãn đường/POI.

Khi chưa có ranh giới, khung nhìn chỉ là vùng Liên Chiểu tham khảo, không được coi là xác nhận phạm vi hành chính. UI hiển thị cảnh báo và link ảnh bản đồ của phường.

## Cấu hình và kiểm thử

Trong web/.env.local: NEXT_PUBLIC_MAPTILER_KEY là khóa riêng của dự án. Sau khi đổi khóa cần khởi động lại dev hoặc build lại bản production. Cấu hình miền cho phép trong MapTiler, gồm localhost khi thử và tên miền triển khai khi phát hành. Không có khóa thì hiển thị thông báo, danh sách/chi tiết vẫn dùng được và có thể chọn vệ tinh.

Lệnh từ thư mục web:

```powershell
npx tsx scripts/import-events.ts ../research/events/2026-10-01-community/candidates.json
npx tsx scripts/import-events.ts ../research/events/2026-10-01-community/candidates.json --write
npm run test
npm run typecheck
npm run lint
npm run build
npx playwright test --config playwright.events.config.ts --workers=2
```

Playwright sự kiện dùng cấu hình riêng và EVENTS_PREVIEW_CATALOG / EVENTS_PREVIEW_BOUNDARY trỏ tới tests/fixtures. Đây là biến server phục vụ xem trước local, không thêm chúng vào .env.local hoặc môi trường triển khai. UI hiện nhãn danh mục kiểm thử. Catalog thật không bị thay bằng fixture. Kiểm thử mạng mô phỏng tách khỏi kiểm tra nền MapTiler thật.

approved-events.json bằng web/content/data/events.json. import-report.json nêu lý do từng hồ sơ không nhập. Chưa triển khai hoặc lên lịch thu thập tự động. Kết quả kiểm thử và ảnh được ghi trong validation.md.
