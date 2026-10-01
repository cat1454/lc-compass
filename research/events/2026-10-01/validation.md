# Kiểm tra bàn giao local — 01/10/2026

| Kiểm tra | Kết quả |
|---|---|
| Nhập thử `npx tsx scripts/import-events.ts ../research/events/2026-10-01/candidates.json` | 20 hồ sơ; nhập 7; không nhập 13; trùng 0 |
| `npm run test` | 17 tệp, 160 kiểm thử đạt; gồm 7 kiểm thử sự kiện |
| `npm run typecheck` | Đạt |
| `npm run lint` | Đạt |
| `npm run build` | Đạt, gồm content:validate và kiểm tra TypeScript của Next |
| `PLAYWRIGHT_PORT=3113 npm run test:e2e -- tests/ui-events.spec.ts --workers=2` | 24/24 đạt trên Mobile Chrome và Desktop Chrome, 41,2 giây |

Đã kiểm tra 320, 360, 390, 430, 768, 1280px; màn hình 320×700 và xoay ngang 844×390, chế độ chữ lớn. Ảnh trong `screenshots/` được chụp khi mở sự kiện thật từ danh mục mới. Chiều rộng tệp ảnh mobile lớn hơn CSS viewport vì thiết bị giả lập có deviceScaleFactor > 1.

Đối chiếu dữ liệu và UI:

- Danh mục local và approved-events.json cùng 7 bản ghi; không nhập 10 bản cũ.
- Ngày 01/10: 2 sự kiện; ngày 02/10: 2; ngày 03/10: 2; ngày 04/10: 1. Ngày 21/10 không có dấu sự kiện giả do cờ recurring.
- 7 tọa độ có cùng điểm đại diện khuôn viên; bản đồ gom thành một nhóm 7, phân trang 1/7 đến 7/7. Lọc một sự kiện còn marker GeoJSON đơn, bấm marker mở đúng sự kiện.
- Kiểm thử nguồn thiếu/không đọc được, trang chủ chung, chi phí miễn phí không có minh chứng, thiếu địa bàn/tọa độ, trùng mâu thuẫn, ngày khác nhau, ngoài phạm vi, hoãn/hủy và lịch định kỳ thiếu bằng chứng.
- Kiểm thử tìm kiếm, kết hợp danh mục, xóa tìm kiếm, chọn/xóa ngày, trạng thái rỗng, chi tiết với nguồn/ngày kiểm tra, link chỉ đường, toàn màn hình, đổi lớp nền nhiều lần, resize, rời/quay lại trang và khi WebGL không hoạt động.
- Popup không tràn ngang hoặc bị menu dưới che nút; Escape đóng lớp và trả focus.

Lần E2E đầu phát hiện selector còn bám tên sự kiện cũ và lỗi mã hóa tiếng Việt trong thao tác sửa tệp bằng PowerShell. Đã sửa encoding/selector, build lại và chạy toàn bộ 24 ca thành công. Không dùng kết quả chạy dở làm bằng chứng đạt.

Kiểm tra cấu trúc và UI không thay thế đối soát nguồn thực tế. Giới hạn nguồn/địa bàn/tọa độ nêu trong README.md. Không cài lịch thu thập tự động và chưa triển khai.
