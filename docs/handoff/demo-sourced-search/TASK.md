# Demo tìm kiếm trên dữ liệu thật — phạm vi đã triển khai

## Phân chia thư mục / trách nhiệm tiếp tục

| Phần | Nơi lưu | Công việc của Antigravity khi bổ sung |
|---|---|---|
| Nghiên cứu nguồn | `research/sourced-demo/` | Mở nguồn, lưu trích đoạn và vị trí hỗ trợ khẳng định, xác minh phường hiện tại |
| Dữ liệu demo thật | `web/content/sourced-demo/` | Giữ `isSynthetic:false`, `review.status:review`; cập nhật keywords, claims và lịch kiểm tra lại |
| Tách catalog | `web/src/lib/content/loader.ts`, `sourced-demo.ts` | Không khôi phục fallback demo/fixture vào published |
| Tìm kiếm | `web/src/lib/navigation/search.ts`, `search-preview.ts` | Tìm không dấu, tránh khớp rời từ ngắn; không sinh câu trả lời |
| Giao diện demo | `web/src/app/demo/`, `SourcedDemoSearch.tsx`, `DemoStatus.tsx` | Dùng nhãn có nguồn/chưa rà soát; giữ layout % và khung 04A |
| Kiểm thử | `web/tests/sourced-demo.*`, `ui-*.spec.ts` | Test tìm/mở/nguồn/hết hạn và không lọt vào catalog chính thức |
| Phê duyệt thật | `web/content/published/` và biên bản riêng | Chỉ đưa nội dung vào đây sau khi có người rà soát thật; agent không tự ký duyệt |

Mục tiêu hiện tại đã tách khỏi Gói 05 Google live và Gói 07 Vercel. Demo không gọi Gemini/Google mỗi lượt, không thu thập hồ sơ cá nhân. Dữ liệu có thể bổ sung dần, tối đa 5 PLACE và 2 DISCOVER theo kế hoạch; không điền cho đủ số lượng.

## Chạy lại localhost (PowerShell)

```powershell
Set-Location H:\LC\web
$env:NEXT_DIST_DIR = '.next-demo'
npm.cmd run build
npm.cmd run start -- --port 3107
```

Mở `http://localhost:3107/demo`. Thư mục build riêng tránh xung đột với server cũ cổng 3000. Dừng server demo trước khi build lại chính thư mục `.next-demo`.

Kiểm thử dùng cùng bản build:

```powershell
$env:NEXT_DIST_DIR = '.next-demo'
$env:PLAYWRIGHT_PORT = '3107'
npm.cmd run test:e2e -- --workers=2 --timeout=20000
npm.cmd run test -- --no-cache
npm.cmd run typecheck -- --incremental false
npm.cmd run lint
```

## Truy vấn trình diễn

| Nhập | Kết quả mong đợi |
|---|---|
| `tạm trú`, `tam tru` | Hướng dẫn chuẩn bị thông tin tạm trú |
| `ky tuc xa` | Thẻ tạm trú, phần sinh viên ở tập trung |
| `thue tro` | Thẻ tạm trú qua từ khóa biên tập |
| `68 lac long quan` | Trung tâm Phục vụ hành chính công |
| `một cửa`, `mot cua` | Trung tâm qua từ khóa biên tập |
| `khong-co-du-lieu-98765` | Chưa có trong bộ dữ liệu |
| Xóa truy vấn, chọn Tất cả | 2 thẻ, đều có nhãn chờ rà soát |
| Chọn Khám phá | 0 thẻ, trạng thái chưa có dữ liệu |

Mở chi tiết để xem căn cứ từng thông tin và nguồn gốc. Liên kết bên ngoài mở tab mới; cần kết nối mạng để đọc website nguồn. Tìm kiếm trong dữ liệu đã tải không cần API AI.

Các E2E cũ yêu cầu dữ liệu giả hiện công khai đã được thay bằng hành trình tương ứng với ranh giới mới. Bản nguyên trước thay đổi được lưu ở `legacy-tests/*.txt`; không chạy như bài nghiệm thu dữ liệu thật. Kiểm thử phân nhánh mô phỏng vẫn ở unit tests, với bộ nạp chỉ dành cho test (`tests/support/synthetic-catalog.ts`).
