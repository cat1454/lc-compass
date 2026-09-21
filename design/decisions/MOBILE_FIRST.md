# Mobile-first và responsive theo % — yêu cầu bắt buộc

Yêu cầu của người dùng: **responsive = %**. Áp dụng cho chiều rộng trang, khối nội dung, cột, thẻ, form và ảnh; không dựng canvas desktop có chiều rộng px rồi thu nhỏ.

## Bố cục

- `box-sizing: border-box` toàn cục. Trang/khối con `width: 100%`; container nội dung `width: 92%; margin-inline: auto`.
- Điện thoại: một cột, thẻ và trường nhập rộng 100% phần nội dung; không sidebar luôn mở.
- Từ 48rem: hai cột thẻ, mỗi thẻ 49%, gap 2%.
- Từ 75rem: ba cột thẻ, mỗi thẻ 32%, gap 2%.
- Desktop có sidebar khi cần: sidebar 22%, gap 3%, nội dung 75%; container width 90%. Trang đọc chi tiết có thể thu hẹp bằng % để tránh dòng quá dài.
- Dùng `flex-wrap: wrap`, `min-width: 0` và wrap text. Không dùng hai cột 50% rồi cộng thêm gap làm tràn ngang.
- Ảnh `width: 100%; max-width: 100%; height: auto`, giữ aspect-ratio khi dùng khung ảnh. Không dùng 100vw bên trong container hoặc overflow-x:hidden để che lỗi bố cục.

Ví dụ chuẩn:

```css
*, *::before, *::after { box-sizing: border-box; }
.page { width: 100%; }
.container { width: 92%; margin-inline: auto; }
.cards { display: flex; flex-wrap: wrap; gap: 1rem 2%; }
.card { width: 100%; min-width: 0; overflow-wrap: anywhere; }
.field { width: 100%; min-width: 0; }
@media (min-width: 48rem) { .card { width: 49%; } }
@media (min-width: 75rem) { .card { width: 32%; } }
```

% không thay thế mọi đơn vị CSS: font, vùng chạm và khoảng cách dọc dùng rem; breakpoint dùng rem; viền mảnh có thể dùng px. Không dùng chiều cao % cho trang đọc có cha không xác định chiều cao. Chiều cao nội dung tự co giãn, nút tăng chiều cao khi nhãn xuống dòng.

## Sử dụng trên điện thoại

- Chữ nội dung và input từ 1rem (16px theo cỡ gốc mặc định); không vô hiệu hóa zoom. Vùng chạm tối thiểu 2.75rem × 2.75rem.
- Ba lối vào rõ ràng; bước tiếp theo và thông tin còn thiếu dễ thấy, nguồn có thể mở thêm nhưng không giấu nhãn nguồn/ngày rà soát.
- Không bắt login hoặc GPS. Menu thu gọn có nhãn và trạng thái bàn phím/focus rõ ràng.
- Bàn phím mở không che nút gửi; ưu tiên trang cuộn tự nhiên. Thành phần cố định, nếu dùng, phải chừa safe-area và không phủ nội dung.
- Không tải bộ mô phỏng, ảnh tham khảo desktop nhiều MB hoặc thư viện bản đồ nặng vào app. Ảnh sản phẩm có kích thước phù hợp và lazy-load ngoài vùng đầu.

## Nghiệm thu

Kiểm tra 320, 360, 390, 430, 768, 1024, 1440 px; xoay ngang; chữ tăng 200%; bàn phím nhập; mạng chậm; nội dung tiếng Việt dài và URL dài. Không tràn ngang, không cắt nhãn/nút/nguồn. Kiểm tra code/CSS để xác nhận width bố cục dùng %, không chỉ chụp một màn hình vừa khít.

Playwright kiểm tra không tràn ở nhiều viewport và tác vụ chính. Mô phỏng viewport không thay thế kiểm tra bàn phím trên điện thoại thật; báo phần nào chỉ kiểm tra bằng mô phỏng.
