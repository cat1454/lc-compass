# Bộ thử thiết kế LC Compass

## Mở kết quả

- `DECISION.md`: quyết định ý tưởng/phạm vi, các phương án bị loại, vòng xem xét và giới hạn kết luận.
- `ARCHITECTURE.md`: lõi dữ liệu, luồng quyết định, xử lý ngoại lệ, vận hành, nghiệm thu.
- `IMAGE_REVIEW.md`: đọc ba ảnh và truy vết thay đổi use case.
- `explorer.html`: mở trực tiếp trong trình duyệt để chọn/xem bất kỳ ca nào; cần giữ `explorer_data.js` cùng thư mục. Không gửi dữ liệu ra mạng.
- `scenarios_10000.csv`: 10.000 user story theo bối cảnh, UTF-8 BOM.
- `scenarios_10000.jsonl`: cùng 10.000 ca ở định dạng máy đọc.
- `simulation_summary.json`: thống kê và kết quả kiểm tra mô hình.
- `CASES_30.md`: 30 ví dụ tiêu biểu để đọc nhanh.
- `explorer_check.json`: kết quả kiểm tra trình duyệt; `explorer_desktop.png` và `explorer_mobile.png` là ảnh kiểm tra giao diện.
- `../../docs/LC_COMPASS_PROJECT_V2.md`: kế hoạch thay thế đề xuất; bản gốc được giữ lại.

## Tái tạo

Từ H:\LC chạy `python design/compass/simulate.py`. Python standard library, không cài thêm gói, không gọi API.

Trình tạo ghi đè các file dữ liệu do chính nó sinh trong thư mục này; không sửa kế hoạch hay ảnh. Cùng mã cho cùng dữ liệu; SHA-256 của JSONL có trong summary.

## Phương pháp

100 mục tiêu cụ thể thuộc 10 nhóm, 10 hoàn cảnh sử dụng, 10 điều kiện nguồn/hệ thống. Câu chuyện nền có 1.000 tổ hợp; mỗi câu chuyện được đặt vào 10 trạng thái, tạo 10.000 trường hợp khác nhau có ngữ cảnh và kỳ vọng xử lý.

Không phải lấy 10.000 tên người khác nhau cho cùng một nhu cầu; cũng không phải 10.000 phỏng vấn. Các thay đổi bối cảnh tác động tới việc hỏi thêm, hiển thị, chuyển nguồn, xem offline hoặc cần người hỗ trợ.

Các nhóm mục tiêu: cư trú, kinh doanh, học tập, y tế, an sinh, việc làm, môi trường, địa điểm, văn hóa, du lịch/sự kiện. Các hoàn cảnh sử dụng gồm kỹ năng số thấp, không có smartphone, làm theo ca, dùng máy chung, khó đi lại, hỗ trợ người thân, chưa có đồng ý, khó đọc tiếng Việt, quay lại sau vướng mắc và tự thao tác.

Mỗi nhóm mục tiêu/trạng thái được lấy số lượng bằng nhau để thử bao phủ thiết kế. Không dùng con số đó để suy tỷ lệ nhu cầu thật, doanh thu, hiệu quả xã hội hoặc ưu tiên ngân sách.

So sánh 5 ứng viên chỉ thay tập mục tiêu được hỗ trợ và dùng chung quy tắc bảo vệ đề xuất. Không phải chạy thử sản phẩm của đối thủ hay đo độ chính xác của một kiến trúc RAG.

## Kiểm tra đã chạy

- Đủ 10.000 ID và tổ hợp duy nhất; đúng số lượng ở mỗi trục.
- 10.000 kiểm tra bất biến của bộ định tuyến: không xuất thẻ chi tiết ở trạng thái thiếu căn cứ và ngoài nội dung hỗ trợ.
- 1.000 cặp sạch/AI ngừng cho cùng định tuyến trong mô hình.
- 14 ca nhiều điều kiện đồng thời và các ngoại lệ đồng ý đối với thông tin công khai.
- Prototype explorer đã chạy qua Chromium: chọn ca, nguồn quá hạn, AI tắt, khẩn, ngoài phạm vi, thẻ công khai, ca cuối/quay về đầu; kiểm tra số lựa chọn và không tràn ngang ở màn hình rộng 390 px. Không có lỗi JavaScript ghi nhận trong lần chạy. Đã xem ảnh desktop/mobile.

Các kiểm tra này xác minh mô hình code theo quy tắc đã viết, không xác minh dữ liệu địa phương, phân loại của AI, danh tính người dùng hoặc kết quả giải quyết thủ tục. Quy tắc kỳ vọng vẫn cần phản biện bởi người dùng và người phụ trách nội dung.

## Khoảng trống được ghi nhận

Chưa bao phủ mọi kết hợp nhiều lỗi; 14 ca bổ sung chỉ là mẫu. Chưa thử lỗi nhận diện ý định, prompt injection trên LLM thật, thay đổi địa giới theo lịch sử, xung đột nhiều hồ sơ, hoạt động dài ngày hay hệ thống chính quyền. Chưa có dữ liệu thực tế chứng minh nhóm mục tiêu nào cần trợ giúp nhất. Không tự động xem nhãn `published` hoặc `clean` của fixture là sự duyệt của cơ quan.
