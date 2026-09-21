# Dữ liệu chính thức LC Compass

Ứng dụng đọc trực tiếp CSV tại thư mục này. **Không sửa JSON cũ để cập nhật website.** Các JSON còn lại là bản lịch sử và dữ liệu kiểm thử, không được nạp vào giao diện chính thức. Nội dung hiện tại đã được người dùng xác nhận duyệt trong phiên làm việc 19/09/2026.

## Sửa nội dung ở đâu?

| Tệp | Nội dung | Cột hay sửa |
|---|---|---|
| `cards.csv` | 24 thẻ thủ tục, địa điểm, khám phá | `title`, `keywords`, `body.summary`, `body.address`, `body.openingHours`, `body.contactPhone`, `body.story` |
| `places.csv` | Danh bạ 1.661 tiện ích | `name`, `address`, `street`, `category`, `categoryLabel`, `notes`, `source` |
| `steps.csv` | Mỗi dòng là một bước hướng dẫn | `card_id`, `stepNumber`, `title`, `description`, `requiredDocs` |
| `sources.csv` | Nguồn tham khảo của từng thẻ | `card_id`, `id`, `url`, `title`, `publisher`, `fetchedAt` |
| `claims.csv` | Thông tin gắn với nguồn | `card_id`, `claim`, `sourceId` |
| `actions.csv` | Liên kết hoặc đầu mối hành động | `card_id`, `type`, `label`, `url`, `contact` |
| `questions.csv` | Câu hỏi phân nhánh (hiện chưa có dòng) | `card_id`, `id`, `prompt`, `options`, `unknownOption.guidance` |
| `directory.csv` | Thông tin chung của danh bạ | `version`, `asOfDate` |

Ví dụ: đổi tên địa điểm trong cột `name` của `places.csv`, lưu file rồi tải lại `/places`. Đổi tiêu đề một thẻ tại cột `title` của `cards.csv`, tải lại trang danh mục hoặc `/cards/<id>`.

## Cách lưu và cập nhật

1. Mở CSV bằng trình soạn thảo hoặc Excel **Data → From Text/CSV**, chọn UTF-8, dấu phân cách dấu phẩy. Trong Excel đặt ID, số điện thoại và ngày thành **Text** để giữ số 0 đầu và định dạng gốc.
2. Sửa ô, lưu **CSV UTF-8**, giữ nguyên tên cột. Dấu phẩy, dấu ngoặc kép và xuống dòng trong ô được hỗ trợ theo định dạng CSV.
3. Tại thư mục `web`, chạy `npm.cmd run content:validate`. Lỗi được báo theo tệp, bản ghi/cột hoặc ID thẻ. Không triển khai khi kiểm tra báo lỗi.
4. Local: tải lại trang; không cần sinh lại JSON hoặc khởi động lại server. Production Vercel: build/deploy lại để bản phát hành chứa CSV mới. CSV trên máy không tự đồng bộ lên Vercel.

## Quy tắc nhập liệu

- Giữ `id` ổn định và duy nhất. Các bảng con dùng `card_id` trùng `id` trong `cards.csv`; `sourceId` của khẳng định phải trùng `id` nguồn của cùng thẻ.
- `type`: `SERVICE`, `PLACE`, `DISCOVER`. Giữ các cột của loại khác trống; không chuyển loại thẻ nếu chưa sửa đủ cấu trúc nội dung.
- Ngày rà soát: `YYYY-MM-DD`; `fetchedAt` giữ chuỗi thời gian ISO đang có. `isSynthetic` dùng `false` cho dữ liệu thật.
- `review.status`: `published` hiển thị; `draft`/`review` chưa hiển thị; `withdrawn` rút nội dung. Thẻ quá `review.reviewDue` tự ngưng hiển thị chi tiết. Không tự gia hạn khi chưa rà lại nội dung.
- `intentIds`, `keywords`, `applicability`, `exclusions`, `requiredDocs`, `claimIds`, `body.missingQuestions`: mỗi giá trị nằm trên một dòng **trong cùng ô** (Alt+Enter trong Excel).
- `options` và `branches` là cấu hình nâng cao dạng mảng JSON, ví dụ `[{"value":"yes","label":"Có"}]`. Nội dung thường ngày không cần sửa các ô này. Giữ `[]` nếu chưa có nhánh. Có thể thêm cột `nextStepId` vào `steps.csv` theo schema hiện có.
- Danh bạ `category`: `market`, `park`, `healthcare`, `education`, `living_service`, `food`, `community`. Số lượng tổng và theo nhóm tự tính từ dòng CSV, không nhập tay.
- Dữ liệu danh bạ đã đối chiếu ranh giới; duyệt nội dung không đồng nghĩa đã xác minh hoạt động thực địa của từng cơ sở. Giữ diễn đạt đúng nguồn.
- Khi xóa thẻ, xóa các dòng tương ứng trong bảng con để không còn `card_id` mồ côi. Tạm ngưng thẻ bằng `review.status=withdrawn` sẽ giữ được lịch sử và URL thông báo.

Các route `/demo` đã bị xóa. Chỉ có một bản ứng dụng: `/`, `/services`, `/places`, `/discover`, `/cards/<id>`.
