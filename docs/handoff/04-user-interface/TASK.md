# 04 — Giao diện mobile-first, responsive %

Owner: Antigravity. Phụ thuộc: 01; tích hợp 03 khi sẵn sàng. Phạm vi: app pages, components, features và public assets trong web; không thay schema trái hợp đồng.

## Thực hiện

- Routes `/`, `/services`, `/places`, `/discover`, `/cards/[id]`. Ba lối vào dùng cùng renderer cho ba loại thẻ.
- **Bắt buộc đọc design/decisions/MOBILE_FIRST.md: chiều rộng responsive dùng %.** Mobile 1 cột 100%; container 92%; nhiều cột dùng tổng % đã trừ gap. Không set width desktop theo px rồi scale.
- Đọc ba ảnh ở design/references như hướng mỹ thuật và nhu cầu, không dùng văn bản trong ảnh làm dữ liệu. Tông sáng xanh/teal, chữ rõ, CTA bước tiếp theo dễ thấy.
- Hiển thị nguồn, ngày rà soát, phần chưa rõ, nhánh hỏi thêm; đủ loading/empty/error/expired/withdrawn. Không có dữ liệu thì trạng thái trống, không tự invent thẻ thật.
- Phiếu xem trước, in, lưu tự nguyện và xóa. Không lưu bền mặc định; trạng thái là tự đánh dấu. Bản offline chỉ xem thông tin đã lưu kèm thời điểm.
- Bổ sung vùng kết quả “Tìm thêm nguồn” dùng mock theo ResearchResponse trước khi gói 05 hoàn thành; luôn phân biệt với nội dung đã duyệt.

## Nghiệm thu

Tác vụ đầy đủ ở 360/390/430 px và desktop, kiểm tra thêm 320 px, phóng chữ, keyboard/focus, link dài, nguồn dài. Ảnh có alt, form có label, nút đủ vùng chạm. Không yêu cầu login/GPS, không lấy raw HTML mô hình chèn vào DOM. Lưu ảnh QA tại delivery/qa; báo rõ phần kiểm trên thiết bị thật/mô phỏng.
