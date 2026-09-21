# Nghiệm thu demo tìm kiếm dữ liệu thật — 19/09/2026

**Kết quả: đủ điều kiện trình diễn localhost trong chế độ demo có nguồn, chưa rà soát nghiệp vụ.** Server đang chạy tại http://localhost:3107/demo; bản build `.next-demo`, PID khởi chạy 27996 (chỉ có ý nghĩa trong phiên này). Không phát hành Vercel ở đợt này.

## Dữ liệu và ranh giới

- 1 SERVICE: Chuẩn bị thông tin đăng ký tạm trú, theo hướng dẫn Chính phủ tháng 7/2026.
- 1 PLACE: Trung tâm Phục vụ hành chính công phường Liên Chiểu, địa chỉ theo công bố tháng 7/2025. Giờ làm việc/điện thoại ghi chưa xác minh.
- 0 DISCOVER: chưa bổ sung khi chưa đủ bằng chứng. Bộ lọc và renderer giữ đủ 3 loại.
- 4 nguồn duy nhất trong corpus, đã mở và đối chiếu; thêm Công báo trang 49 để đối chiếu địa bàn. Chi tiết tại `research/sourced-demo/README.md` và `sources.json`.
- Cả hai thẻ giữ `review`, `isSynthetic:false`, `isVerified:false`, nhãn **Có nguồn — chưa rà soát nghiệp vụ**. Không tạo người duyệt hoặc ngày duyệt giả.
- `content/published/cards.json` vẫn rỗng. Catalog chính thức không fallback sang dữ liệu giả hoặc demo thật. Direct link chính thức đến thẻ demo trả 404.
- Tìm kiếm trong bộ dữ liệu đã tải, không gọi Gemini hoặc Google. Hết hạn: ẩn khỏi kết quả, trang chi tiết không trả body/actions; có kiểm tra lại hạn ở trình duyệt.

## Kiểm thử thực thi

| Kiểm tra | Kết quả |
|---|---|
| `npm.cmd run test -- --no-cache` | 72/72 PASS, 6 files |
| `npm.cmd run typecheck -- --incremental false` | PASS |
| `npm.cmd run lint` | PASS |
| `npm.cmd run content:validate` | PASS: 2 thẻ demo thật, 0 published; bộ mô phỏng/fixture được kiểm tra riêng |
| Build production với `NEXT_DIST_DIR=.next-demo` | PASS; `/demo` và `/demo/cards/[id]` dynamic |
| Toàn bộ Playwright với `PLAYWRIGHT_PORT=3107` | **28/28 PASS**, Mobile Chrome + Desktop Chrome, 15.2 giây |
| 320px, mobile 375×812, desktop 1440×900 | Không tràn ngang; ảnh đã lưu trong `screenshots/` |

Các ca bao gồm: tìm có/không dấu, nội dung, địa chỉ, từ khóa biên tập, không có kết quả, lọc DISCOVER rỗng, mở chi tiết SERVICE/PLACE, nhãn chờ duyệt, URL tìm kiếm, ô tìm trên thanh desktop, dữ liệu hết hạn, chặn pending/synthetic trong published kể cả khi đặt nhầm vào thư mục, và chặn direct link cũ.

Kiểm thử bấm nguồn dùng phản hồi giả lập ở URL đích để kiểm chứng tab mới/địa chỉ một cách ổn định; **không dùng test này để kết luận nội dung nguồn đúng**. Kiểm tra nội dung và khả năng mở nguồn thật được thực hiện riêng bằng công cụ web ngày 19/09/2026, có trích đoạn và vị trí trong sổ nguồn.

Đã sửa lỗi thực tế phát hiện trong E2E: tìm `tạm trú` không còn khớp rời `trung tâm … trụ sở`. Đợt thử ban đầu cổng 3000 xung đột server cũ; kết quả nghiệm thu cuối lấy từ build và server riêng 3107. Các test cũ dựa trên giả định công khai dữ liệu mô phỏng đã cập nhật; lưu bản trước tại `legacy-tests/`. Unit tests phân nhánh mô phỏng tiếp tục chạy bằng loader riêng trong tests.

## Bàn giao / bước tiếp theo

Thử truy vấn và lệnh chạy lại tại [TASK.md](TASK.md). Ảnh: [mobile](screenshots/mobile-375.png), [desktop](screenshots/desktop-1440.png), [chi tiết mobile](screenshots/mobile-detail.png), [chi tiết desktop](screenshots/desktop-detail.png).

Đã đủ cho demo kỹ thuật, chưa đủ để tuyên bố thủ tục được địa phương duyệt. Trước phát hành chính thức cần người rà soát nghiệp vụ xác nhận nội dung, địa bàn, tính cập nhật, thông tin liên hệ và ghi biên bản thật. Hạn rà soát do nhóm đặt là 19/10/2026; đây không phải hạn hiệu lực pháp luật. Google live và Vercel tiếp tục thuộc các gói sau.
