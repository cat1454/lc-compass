# 05 — Google Search/Gemini có giới hạn

Owner: Antigravity. Phụ thuộc: contracts 01, tích hợp 03/04. Phạm vi: `web/src/lib/google`, API research, limiter và component kết quả tham khảo.

## Thực hiện

- Dùng SDK chính thức @google/genai phía server. Kiểm tra docs hiện hành và model cấu hình có hỗ trợ Google Search; khóa API tuyệt đối không gửi client.
- Chỉ gọi khi người dùng bấm tìm thêm nguồn. Validate input, không nhận giấy tờ/OTP/mật khẩu; không gửi dữ liệu nhạy cảm đã nhận diện ra ngoài. Không quảng cáo bộ lọc tuyệt đối chính xác.
- Normalize response theo CONTRACTS. Citations phải lấy từ metadata thực, không dựa vào URL model tự viết. Không có bằng chứng thì no_evidence. Ưu tiên nguồn cơ quan phù hợp cho thủ tục; không biến kết quả tìm thành kết luận pháp lý cá nhân.
- Hiện attribution/search suggestions theo điều khoản API; xử lý nội dung nhà cung cấp tách biệt với HTML câu trả lời, không thực thi script tùy ý.
- Timeout 20 giây, không retry tự động. Redis atomic limiter theo CONTRACTS, cấu hình thiếu/lỗi thì không gọi Google. Feature flag tắt vẫn dùng được catalog.
- Không tự lưu response vào published, không lưu raw query trong log. Ghi kiểm tra điều khoản lưu/hiển thị dữ liệu trong REPORT.

## Nghiệm thu

Mock: timeout, quota, citations thiếu/sai chỉ số, query nhạy cảm, đầu vào phá chỉ dẫn, Redis lỗi, key thiếu. Live smoke test nhỏ khi đã có quyền và quota; ghi model/SDK/ngày/kết quả thật, không lưu bí mật. Không đánh dấu live verified khi chỉ mock.

Nguồn: https://ai.google.dev/gemini-api/docs/google-search
