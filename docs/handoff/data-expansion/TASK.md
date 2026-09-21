# DATA EXPANSION — Thu thập dữ liệu thật và tích hợp demo

Trạng thái gói: READY. Owner triển khai: Antigravity. Codex: rà soát bằng chứng, cấu trúc và nghiệm thu sau bàn giao. Người có chuyên môn: rà soát nghiệp vụ trước phát hành chính thức.

## Cập nhật sau production ngày 19/09/2026

Đọc ANTIGRAVITY_PROMPT.md cùng TASK này. Baseline mới nằm trong delivery/deployment/REPORT.md: production đã tồn tại, báo cáo 72 unit/32 E2E đạt; không dùng số 28 E2E cũ làm mốc hiện tại. Giữ bản vá PostCSS và dependency đã ghim. Thứ tự gói: dữ liệu trên kiến trúc hiện có → nghiệm thu local → REVIEW; API bản đồ/chỉ đường là gói kế tiếp, không tích hợp cả 9 dịch vụ trước.

Cho phép sửa trực tiếp thông tin gây hiểu nhầm trong luồng thật: bỏ đích Google Maps gán cứng Công an ở CitizenServiceView khi thẻ không có căn cứ, dùng action có nguồn hoặc trạng thái chưa xác minh; không trình bày minimap SVG như vị trí thật. Giữ phong cách 04A. Không triển khai lại Vercel/đổi env trong gói này; giới hạn Vercel bên dưới nghĩa là không thay deployment đã tồn tại.

## Yêu cầu người dùng đã chốt

Mở rộng LC Compass lên khoảng 20–30 thẻ thật, mục tiêu 24 thẻ tổng cộng: 8 SERVICE, 10 PLACE, 6 DISCOVER; tính cả hai thẻ cũ sau kiểm tra lại. Không bịa nội dung, không chia nhỏ cùng một hướng dẫn chỉ để đủ số lượng. Thu thập VÀ tích hợp vào /demo. Nếu thiếu bằng chứng, bàn giao số lượng thật và lý do thiếu.

Đây là phạm vi mới thay thế giới hạn 1 thủ tục/5 địa điểm/2 khám phá trong gói 02 cũ cho đợt mở rộng này. Không dùng báo cáo cũ làm bằng chứng đã duyệt.

## Đọc trước khi làm

1. H:/LC/AGENTS.md và docs/handoff/STATUS.md, ưu tiên cập nhật mới nhất.
2. docs/handoff/demo-sourced-search/REPORT.md và research/sourced-demo/README.md.
3. web/src/contracts/card.ts, validator.ts; web/src/lib/content/sourced-demo.ts.
4. web/src/lib/navigation/constants.ts, search.ts, search-preview.ts.
5. web/content/sourced-demo/cards.json, research/sourced-demo/sources.json và research/data-expansion/README.md.

Bạn không làm việc một mình: không hoàn nguyên sửa đổi của người khác; đọc lại file trước khi sửa và giữ thay đổi ngoài phạm vi. Không dừng tiến trình dựa vào PID từ báo cáo cũ.

## Quy trình bắt buộc

### 1. Khảo sát và danh sách ứng viên

- Cập nhật REPORT.md thành IN_PROGRESS, ghi thời điểm và tác nhân thực sự thực hiện.
- Đếm catalog thực tế trước thay đổi; kiểm tra source của cả hai thẻ hiện có bằng cách mở nguồn.
- Dùng candidates.json làm hàng đợi chủ đề, không coi đó là danh bạ địa điểm đã được xác minh. Có thể thay ứng viên thiếu căn cứ bằng ứng viên cùng loại hữu ích hơn; ghi lý do.
- SERVICE ưu tiên cư trú, thao tác dịch vụ công, học tập, an sinh; nghiên cứu hộ tịch/chứng thực nếu có nguồn hiện hành. PLACE ưu tiên cơ quan, y tế, giáo dục, tiện ích cộng đồng. DISCOVER ưu tiên văn hóa, di tích, không gian cộng đồng, sản phẩm địa phương.
- Đối chiếu ranh giới phường Liên Chiểu sau sắp xếp; không gộp toàn bộ quận cũ. Không tự kết luận một địa điểm thuộc phường chỉ từ địa chỉ cũ hoặc tên Liên Chiểu.

### 2. Thu thập bằng chứng thật

- Google/Gemini chỉ tìm ứng viên và hỗ trợ biên tập. Mở trang gốc, đọc đoạn liên quan; không dùng câu trả lời AI/snippet làm bằng chứng.
- Ưu tiên cổng chính quyền, cơ quan chuyên môn, đơn vị trực tiếp quản lý; báo chí bổ trợ. Với thủ tục, kiểm tra bản hiện hành, ngày áp dụng, cơ quan giải quyết và nguồn sửa đổi.
- Ghi sources.json: id, URL thực tế, title, publisher, sourceDate nếu biết, fetchedAt thực tế, relevantExcerpt ngắn, locator, accessStatus và limitations. Không tạo URL theo mẫu suy đoán.
- Ghi claim-map.json: cardId, claimId, sourceId, fieldPaths, locator, assessment và limitations. Mọi khẳng định quan trọng trong tiêu đề, mô tả, bước, địa chỉ, liên hệ, hành động đều phải được đối chiếu.
- Không sao chép toàn trang bên thứ ba; chỉ lưu trích đoạn ngắn cần thiết và ghi chú đối chiếu. Không gửi thông tin cá nhân lên dịch vụ ngoài.
- Trang không truy cập được ghi đúng lỗi; không suy ra 404. Nguồn mâu thuẫn: giữ draft phần bị ảnh hưởng, không tự ghép thành dữ kiện mới.
- URL BCA tthc?matt=26277 đã được xác định là thị thực điện tử: không dùng cho tạm trú. Các nguồn tháng 7/2026 trong corpus vẫn phải mở và kiểm tra lại, không mặc nhiên đúng vì tên URL.

### 3. Biên tập đúng hợp đồng hiện hành

- Không đổi public API/schema, không nới validator để nhận dữ liệu sai.
- Chỉ dùng intentIds có thật VÀ phù hợp ngữ nghĩa trong constants.ts. Hiện catalog chưa có intent riêng cho hộ tịch/chứng thực: lưu draft và báo thiếu mapping nếu không có intent phù hợp; không gán nhầm cu_tru. Không thêm intent trong gói này.
- Thiếu thông tin phụ: bỏ trường optional hoặc ghi Chưa xác minh. Thiếu thông tin cốt lõi: giữ draft. Không bịa tọa độ/địa chỉ/điện thoại/giờ/phí/giấy tờ/thời hạn.
- SERVICE có thể là hướng dẫn chuẩn bị nếu chỉ có căn cứ cho phạm vi đó; ghi rõ giới hạn, không tự gọi là quy trình đầy đủ. Mỗi procedural step có claimIds hợp lệ.
- PLACE cần nguồn chứng minh tên, chức năng, địa chỉ và địa bàn hiện tại. Không gán nơi tiếp nhận một thủ tục chỉ vì đó là trụ sở UBND.
- DISCOVER cần câu chuyện và địa bàn có bằng chứng; viết lại bằng lời của nhóm. mediaRights ghi rõ không sử dụng ảnh nếu chưa có quyền; bỏ imageUrl. Không dùng ảnh AI như bằng chứng địa điểm thật.
- Thẻ mới: version 1.0.0. Thẻ cũ có nội dung thay đổi: tăng patch version, giữ ID ổn định.
- isSynthetic=false; review.status=review; không reviewer/reviewedAt giả. Owner ghi nhóm biên tập LC Compass. DTO isVerified=false do loader tạo.
- Hạn kiểm tra lại mặc định 30 ngày từ ngày đối chiếu; rút ngắn khi nguồn có mốc thay đổi. Không gia hạn dữ liệu cũ chỉ vì đang bổ sung catalog.
- Keywords phản ánh đúng nội dung để tìm có/không dấu; không nhồi từ khóa không liên quan.

### 4. Tích hợp có kiểm soát

- Lưu draft tại research/data-expansion/drafts, quyết định loại/chờ tại decisions.json.
- Chỉ đưa thẻ đủ căn cứ và hợp đồng vào web/content/sourced-demo/cards.json. Không chép nguồn cũ sang sổ mới rồi ghi là vừa xác minh.
- Giữ content/published/cards.json theo trạng thái thực tế ban đầu; không tự phát hành. Không fallback sang mockdata.
- Không đổi thiết kế 04A. Chỉ sửa lỗi logic trực tiếp ngăn dữ liệu hợp lệ hoạt động, kèm bằng chứng và kiểm thử hồi quy.
- Trước thay đổi lưu bản sao catalog trong docs/handoff/data-expansion/baseline-cards.json để đối chiếu/khôi phục chọn lọc; không ghi đè thay đổi đồng thời của người khác khi rollback.

## Nghiệm thu và bằng chứng

Chạy trong H:/LC/web bằng npm.cmd:

```powershell
npm.cmd run content:validate
npm.cmd run typecheck -- --incremental false
npm.cmd run lint
npm.cmd run test -- --no-cache
$env:NEXT_DIST_DIR = '.next-data-expansion'
npm.cmd run build
```

Chạy server với cùng NEXT_DIST_DIR ở cổng trống đã kiểm tra (ưu tiên 3108); nếu dùng Playwright đặt PLAYWRIGHT_PORT tương ứng. Không đụng server demo 3107 hiện có. Dừng đúng server thuộc gói sau nghiệm thu nếu không cần giữ.

```powershell
$env:NEXT_DIST_DIR = '.next-data-expansion'
$env:PLAYWRIGHT_PORT = '3108'
npm.cmd run test:e2e -- --workers=2 --timeout=20000
```

- Kiểm tra ID/intent/source/claim tham chiếu hợp lệ, trùng nội dung, ngày thực tế, reviewDue và public DTO.
- Kiểm tra tìm có dấu/không dấu, tên/địa chỉ, lọc từng loại, chi tiết đủ ba loại nếu có thẻ đạt, không kết quả, hết hạn và nhãn chờ rà soát.
- Các test cũ giả định DISCOVER rỗng hoặc tổng số đúng 2 cần cập nhật theo corpus mở rộng; giữ các bảo đảm chặn dữ liệu chưa duyệt và dữ liệu giả. Không xóa kiểm thử để đạt PASS.
- Kiểm tra mobile 320px, 375px và desktop 1440px: không tràn ngang, thao tác mở nguồn đúng URL/tab. Lưu ảnh mới trong screenshots/; không dùng lại ảnh gói cũ.
- Mở và đọc nguồn thật riêng với tests. Mock network trong test tương tác không chứng minh nguồn thật đúng.
- REPORT ghi từng lệnh, exit code/kết quả thực tế, log/ảnh, số trước/sau theo loại, danh sách thẻ mới/sửa/loại, nguồn còn vướng, giới hạn nghiệp vụ và phần chưa làm.
- Chỉ chuyển REVIEW khi đã bàn giao để Codex review; không tự ghi Codex đã duyệt. Nếu công cụ chặn một bước, tiếp tục phần còn làm được rồi báo rõ.

## Ngoài phạm vi

Google live trong ứng dụng, API trả phí, Vercel, thay đổi thiết kế, tài khoản công dân/CMS và xuất bản chính thức. Không liên hệ/gửi tin cho cơ quan hoặc cá nhân thay người dùng.
