# Kiểm tra local — sự kiện cộng đồng và MapTiler

| Hạng mục | Kết quả |
|---|---|
| Nhập danh mục cộng đồng | 27 hồ sơ, 0 nhập, 11 chờ, 16 loại; 7 sự kiện Bách khoa đợt trước không còn hiển thị |
| `npm run test` | 163/163 ca đạt trong 17 tệp, gồm 10 ca sự kiện |
| `npm run typecheck` | Đạt |
| `npm run lint` | Đạt |
| `npm run build` | Đạt, có content:validate và kiểm tra TypeScript |
| Playwright cấu hình `playwright.events.config.ts` | 28/28 ca trên Mobile Chrome và Desktop Chrome |
| Playwright `ui-events-catalog.spec.ts` | 2/2 ca trên danh mục thật; không xuất hiện fixture |
| MapTiler Streets v2 với khóa dự án | Style HTTP 200; tile thật HTTP 200 trên mobile 390px và desktop 1280px |

Kiểm thử UI dùng cấu hình server xem trước riêng và nguồn mạng mô phỏng để tái hiện cả lỗi ảnh/403. Không dùng fixture trong catalog thật. Bộ `test:e2e` chung bỏ qua tệp cần fixture; chạy riêng bằng `npx playwright test --config playwright.events.config.ts --workers=2 --output=test-results-events`.

Đã kiểm tra 320, 360, 390, 430, 768, 1280px; màn hình 320×700, xoay ngang 844×390 và chữ lớn. Các ca bao gồm ảnh 16:9, ngày/giờ, địa chỉ, ảnh địa điểm có nhãn, ảnh lỗi vẫn mở chi tiết, nguồn ảnh, tìm kiếm/bộ lọc, lịch, marker thật qua GeoJSON, nhóm cùng tọa độ, đổi nền nhiều lần, WebGL không khả dụng, MapTiler trả 403, Escape và trả focus.

Kiểm thử dữ liệu chặn ảnh thiếu, hoạt động Bách khoa, tọa độ đại diện campus, nguồn thiếu/không đọc được, thiếu bằng chứng địa bàn, miễn phí không có nguồn, sự kiện ngoài ngày, hoãn/hủy, lịch định kỳ thiếu bằng chứng và bản trùng mâu thuẫn. GeoJSON địa giới chỉ được bật khi trạng thái verified có nguồn, phiên bản, ngày kiểm tra và vòng polygon khép kín. Kiểm thử mô phỏng việc ẩn nhãn hành chính cũ, giữ nhãn đường.

`live-map-check.json` ghi kiểm tra trình duyệt dùng MapTiler thật: có tile phản hồi thành công, không tràn ngang ở mobile/desktop. Đã chờ tải mạng và khung render trước khi chụp. Không lưu khóa API trong nhật ký này.

Ảnh bàn giao:

- `screenshots/actual-catalog-live-maptiler-390.png` và `...-1280.png`: nền thật, danh mục thật rỗng, thông báo địa giới chưa đủ dữ liệu.
- `screenshots/preview-popup-live-maptiler-390.png` và `...-1280.png`: nền MapTiler thật, popup dùng dữ liệu và ảnh **KIỂM THỬ**, không phải sự kiện thật.
- `screenshots/fixture-layout-*.png`: kiểm thử bố cục 6 chiều rộng, cả nền và dữ liệu được mô phỏng.

Giới hạn nghiệm thu: chưa có sự kiện cộng đồng mới đủ bằng chứng để nhập; chưa có GeoJSON địa giới hiện hành được đối soát. Ảnh bản đồ của cổng phường chỉ dùng tham khảo và dẫn nguồn, không giả thành polygon. Không tuyên bố đã cập nhật toàn bộ nhãn địa giới của nhà cung cấp. Chưa triển khai, chưa có lịch thu thập tự động.

Bản local thật: `http://localhost:3120/events`. Bản xem trước popup: `http://localhost:3121/events`, được đánh dấu dữ liệu kiểm thử. Hai server này chỉ phục vụ kiểm tra trong phiên làm việc.
