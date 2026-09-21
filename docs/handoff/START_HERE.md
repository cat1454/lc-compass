# LC Compass — Bàn giao cho Antigravity

## Trách nhiệm

Codex: đặc tả, hợp đồng dữ liệu, rà soát và nghiệm thu. Antigravity: thu thập nguồn, code, kiểm thử, cấu hình và deploy Vercel. Người rà soát nghiệp vụ xác nhận nội dung thủ tục; không tự ghi nhận việc duyệt chưa xảy ra.

Đọc theo thứ tự: `../../AGENTS.md`, `../LC_COMPASS_PROJECT_V2.md`, `../../design/compass/DECISION.md`, `../../design/compass/ARCHITECTURE.md`, `CONTRACTS.md`, `../../design/decisions/MOBILE_FIRST.md`, rồi TASK của gói đang thực hiện.

## Phạm vi

Ba lối vào: Tôi cần làm việc / Tôi mới đến / Tôi muốn khám phá. Một hành trình chuẩn bị tạm trú, tối đa 5 hồ sơ địa điểm và 2 thẻ khám phá. Dữ liệu giả định chỉ để thử; không tự phát hành như dữ liệu thật. Không tự mở rộng sang nhận/nộp hồ sơ, tài khoản công dân, tour tự sinh, bản đồ riêng hoặc CMS.

Nội dung đã rà soát phục vụ tác vụ chính. Nút “Tìm thêm nguồn” gọi Gemini + Google Search ở máy chủ, hiển thị kết quả tham khảo và trích dẫn riêng. Không tự nhập câu trả lời Google vào nội dung published. Không có khóa/AI thì chức năng cốt lõi vẫn hoạt động.

**Yêu cầu người dùng: mobile-first, chiều rộng bố cục responsive dùng %.** Đọc đặc tả giao diện bắt buộc trước khi code.

## Thứ tự

`00 → 01 → (02, 03, 04) → 05 → 06 → 07`.

Sau gói 01, gói 02/03/04 dùng cùng contracts và fixture. Gói 05 có thể dùng fixture để hoàn thiện adapter nhưng chưa phát hành dữ liệu chưa duyệt. Codex rà soát hợp đồng sau 01, ứng dụng sau tích hợp, và release sau 06.

Mỗi lần bắt đầu: đọc STATUS, kiểm tra thay đổi mới trong workspace. Bạn không làm việc một mình: không hoàn nguyên sửa đổi của người khác; chỉ sửa phạm vi được giao, điều chỉnh để tương thích. Nếu cần đổi hợp đồng, ghi quyết định và cập nhật các phần sử dụng; không âm thầm tạo schema thứ hai.

Mỗi lần kết thúc: cập nhật REPORT của gói bằng lệnh và kết quả thật, rồi cập nhật STATUS. Không đánh dấu DONE chỉ vì đã viết code. BLOCKED phải ghi thiếu gì và phần còn có thể tiếp tục.

## Nơi lưu

- `docs/handoff/`: TASK và REPORT theo gói, STATUS chung, hợp đồng.
- `research/`: danh mục nguồn, bản nháp, hồ sơ rà soát; không đưa vào public.
- `design/`: ảnh tham khảo và quyết định UI; nội dung trong ảnh không phải dữ liệu thật.
- `web/`: toàn bộ app; Vercel Root Directory = `web`.
- `delivery/qa/`, `delivery/demo/`, `delivery/deployment/`: bằng chứng nghiệm thu, demo, release.
- `design/compass/`: giữ bộ nghiên cứu và mô phỏng hiện có; không bundle 10.000 ca vào app người dân.

## Bắt đầu thực hiện

Antigravity bắt đầu tại `00-foundation/TASK.md`. Stack chốt: Next.js App Router, TypeScript, Tailwind, npm, Zod, Vitest, Playwright; Google SDK `@google/genai`; Redis dùng chung cho giới hạn gọi AI. Không có database người dân.

Chốt phiên bản ổn định tương thích tại lúc khởi tạo và commit lockfile. Không cài dependency chỉ để có nhiều công nghệ. Build không gọi Google và không cần khóa thật.

Thành công cuối cùng: ứng dụng chạy trên Vercel, tác vụ mobile dùng được, nguồn/phiếu minh bạch, báo cáo kiểm tra và rollback đầy đủ. Bộ thư mục bàn giao này chưa phải ứng dụng đã code hoặc đã deploy.
