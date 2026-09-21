# Ba ảnh bổ sung và thay đổi use case

Đã xem trực tiếp cả ba ảnh ngày 18/09/2026. Ảnh là tài liệu thiết kế do người dùng cung cấp, không phải bằng chứng dữ liệu đang đúng hoặc ứng dụng đã hoạt động.

## 1. image.png — Người dân

Quan sát: ô hỏi thủ tục tạm trú; danh sách bước; thẻ địa điểm, nguồn tham khảo, gọi hỗ trợ; giao diện desktop/mobile. Ảnh ghi “quận Liên Chiểu”, “Công an quận”, ngày cập nhật 15/04/2024, có giờ làm việc và điện thoại.

Use case giữ: hỏi bằng cách nói thường ngày → xem hướng dẫn → kiểm tra nguồn → xác định bước tiếp theo → tìm hỗ trợ. Use case bổ sung: sai cấp tiếp nhận; nguồn cũ; người cần giải thích yêu cầu bổ sung; không đăng nhập được; không có điện thoại; người giúp chưa có sự đồng ý; thiết bị dùng chung.

Đổi thiết kế: bước phải có điều kiện và nguồn; phân biệt phiếu chuẩn bị với hồ sơ chính thức; không chép thông tin cơ quan/giấy tờ/giờ làm việc từ ảnh. Nguồn Cổng DVC về đăng ký tạm trú có mục tiếp nhận tại Công an cấp xã; cần rà đúng phiên bản trước phát hành. [Nguồn để rà](https://dichvucong.bocongan.gov.vn/bocongan/bothutuc/tthc?matt=26356)

## 2. ab73d6c7-586d-4a59-88f7-1ab645444802.png — Người mới đến

Quan sát: địa điểm thiết yếu, bản đồ, “việc cần biết”, trường học, y tế, chợ, xe buýt; nhiều khoảng cách cụ thể. Có nhãn địa danh/cơ quan cần đối chiếu lại.

Use case giữ: chọn việc trước khi biết tên cơ quan; xem điểm phục vụ; lưu thông tin để đi hỏi; từ chối GPS; cần đi ngoài giờ; khó đi lại. Điểm gần nhất có thể không phụ trách trường hợp của người dùng.

Đổi thiết kế: 5 hồ sơ địa điểm tối đa, chọn khu vực thủ công; chức năng/thẩm quyền trước khoảng cách; chuyển chỉ đường ra bản đồ ngoài. Trường học gần nhà không được suy thành đúng tuyến, y tế gần nhà không được suy thành đúng nơi khám bảo hiểm. Chưa làm tìm kiếm theo khoảng cách thời gian thực.

## 3. caa7ccb9-16de-4320-a106-e7dd0f4ac1af.png — Khách tham quan

Quan sát: hỏi “Tôi có 2 giờ”, tuyến biển Nguyễn Tất Thành – Hải Vân Quan – Nam Ô; sự kiện Cầu Ngư Nam Ô 2024 nằm trong khu vực “hôm nay”; đánh giá 4.8/320 review; bản đồ và câu chuyện.

Use case giữ: khám phá một nơi, đọc câu chuyện có nguồn, lưu nơi muốn đi. Use case bổ sung: hết hạn sự kiện; thiếu thời gian di chuyển; trời mưa; người khó đi lại; địa điểm đóng cửa; giá chưa xác minh; địa điểm ngoài phường; bằng chứng review không tồn tại.

Đổi thiết kế: 2 thẻ khám phá biên tập; không tự lập tour và không chép đánh giá/lịch sự kiện/khoảng cách. Không coi Hải Vân/Nam Ô đương nhiên thuộc phường Liên Chiểu; đúng địa giới là một điều kiện dữ liệu, không phải lựa chọn trang trí.

## 4. Hệ quả chung

Ba ảnh bổ sung góc nhìn sản phẩm rộng hơn “chỉ hỏi thủ tục”. Chốt ba lối vào nhưng dùng chung metadata nguồn, địa bàn, ngày rà soát và hành động. Một người mới đến có thể đồng thời là người dân, người lao động và khách khám phá; không ép chọn vai trò cố định, không bắt đăng nhập để phân vai.

Ảnh làm thay đổi quyết định từ phương án chỉ tạm trú sang một lõi với ba mẫu thẻ hữu hạn. Chúng không làm phát sinh yêu cầu xây toàn bộ menu và tiện ích đang vẽ.
