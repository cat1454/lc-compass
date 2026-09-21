# 06 — Nghiệm thu tích hợp

Owner: Antigravity; Codex rà soát. Phụ thuộc: 02–05. Phạm vi: tests, sửa lỗi có kiểm soát trong module liên quan, delivery/qa. Không tự sửa nhãn kỳ vọng để làm test xanh.

## Thực hiện

- Chạy lint/typecheck/content:validate/unit/build/e2e. Giữ tách biệt báo cáo logic giả lập, Google thật và người dùng thật.
- E2E ba lối vào, hỏi thêm, phiếu lưu/in/xóa, nguồn hết hạn/rút, direct URL, không có dữ liệu, AI tắt/lỗi, rate limit, thiếu citation và người dùng sửa câu trả lời.
- Mobile widths 320/360/390/430, tablet/desktop, zoom chữ 200%, ngôn ngữ dài, bàn phím, mạng chậm, thao tác không GPS/login. Kiểm CSS: layout widths là %, gap không làm tràn; không che tràn bằng overflow-x:hidden.
- Kiểm client bundle/network không chứa khóa, hồ sơ nghiên cứu hoặc bộ 10.000 ca; log không chứa raw query nhạy cảm.
- Thử với 12–20 người nếu có điều kiện thực tế; chưa có thì ghi chưa thực hiện, không giả lập thành kết quả phỏng vấn.

## Đầu ra

delivery/qa có báo cáo tổng hợp, danh sách lỗi/giới hạn, screenshot mobile/desktop và lệnh đã chạy. Các lỗi nghiêm trọng về nguồn, nơi tiếp nhận, lộ dữ liệu, mất tác vụ chính phải được sửa trước release. Bằng chứng 10.000 ca không được đổi thành tuyên bố AI chính xác 100%.
