# 03 — Lõi điều hướng

Owner: Antigravity. Phụ thuộc: 01. Phạm vi: `web/src/lib/navigation`, `web/src/lib/content`, test logic và adapter fixture.

## Thực hiện

- Port quy tắc trong design/compass/simulate.py sang hàm TypeScript thuần. Metadata nguồn/thời gian lấy từ content, không tin giá trị người dùng tự gửi.
- Tìm kiếm tiếng Việt có/không dấu trên catalog đã duyệt; tìm theo từ khóa và chọn nhu cầu. Mơ hồ thì hỏi, không tự ghép nhiều thủ tục.
- Xử lý nguồn cũ/mâu thuẫn, thiếu địa bàn, ngoài phạm vi, không biết điều kiện, phiên AI tắt. Thẻ địa điểm/văn hóa công khai không bị chặn vô cớ vì người xem đang giúp người khác.
- Content loader chỉ xuất public DTO, kiểm tra thời hạn tại thời điểm truy cập; đường dẫn thẻ trực tiếp cũng phải tuân thủ withdrawn/expired.
- Tạo adapter để chạy 10.000 ca với fixture rõ ràng, không đưa JSONL/CSV vào bundle trình duyệt. Ghi các thay đổi so với mô hình Python, nếu có.

## Nghiệm thu

Kiểm tra đủ 10.000 ca định tuyến, 1.000 cặp AI tắt và 14 ca phối hợp; thêm test người đổi câu trả lời, nguồn vừa hết hạn và mở link trực tiếp. Những kiểm tra này không đại diện độ chính xác NLP hoặc pháp lý. Hàm lõi không gọi mạng/Google.
