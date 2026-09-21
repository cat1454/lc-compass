# Hợp đồng tối thiểu cho các gói

Nguồn chuẩn sau khi code: `web/src/contracts/`. TypeScript và Zod cùng mô tả một hợp đồng; không tạo bản schema riêng trong từng feature.

## Nội dung

`ContentCard`: `id`, `version`, `type` (SERVICE/PLACE/DISCOVER), `title`, `intentIds`, `jurisdiction`, `applicability`, `exclusions`, `sources`, `review`, `actions`, `body` theo type.

`Source`: ID, URL https, tiêu đề, đơn vị công bố, ngày nguồn nếu biết, ngày truy cập. Các khẳng định quan trọng trong body tham chiếu source ID hỗ trợ; không chỉ có link chung ở cuối thẻ.

`review`: status draft/review/published/withdrawn; owner, reviewer, reviewedAt, reviewDue. Draft cho phép thiếu người duyệt; published bắt buộc đủ. reviewDue là mốc nội bộ, không phải ngày hết hiệu lực pháp luật. Người duyệt lấy từ bản ghi thật. Public DTO bỏ ghi chú riêng và danh tính reviewer; giữ ngày rà soát và nhãn nguồn phù hợp.

SERVICE: các bước/điều kiện đã biên tập, câu hỏi còn thiếu, nhánh “không biết”. PLACE: chức năng, địa chỉ có nguồn, tọa độ/giờ mở cửa tùy chọn; không suy ra thẩm quyền từ gần nhất. DISCOVER: mô tả có nguồn, địa bàn và quyền sử dụng ảnh. Actions chỉ dùng URL/đầu mối được xác minh, không do model sinh.

`ContentAvailability`: available / expired / withdrawn / not_found. Kiểm tra cả trang trực tiếp `/cards/[id]`; không chỉ lúc tìm kiếm. Link public cũ không được lộ lại hướng dẫn đã rút. Dữ liệu published hỏng schema làm build thất bại; hết hạn được loại khỏi chi tiết và hiển thị hướng chuyển nguồn, không gây sập toàn bộ build.

`NavigationResult`: action, reasonCode, cardIds, missingQuestions, nextAction. Dùng mô hình hiện có làm tham chiếu và ghi rõ thay đổi có chủ ý. PREPARE là nhãn fixture đủ điều kiện hiển thị, không phải xác nhận hồ sơ thật.

## Tìm nguồn trực tiếp

`POST /api/research`: body `{query, entry, jurisdiction?}`; query trim, 1–1000 ký tự, entry = services/places/discover. Không nhận file, ảnh giấy tờ, tài khoản hoặc lịch sử hội thoại dài.

`ResearchResponse`: `{status, answer, citations, attribution, retrievedAt}`. Status = ok/no_evidence/disabled/rate_limited/unavailable. Citation chứa ID, URL, tiêu đề và liên kết đoạn trả lời theo metadata của nhà cung cấp. Adapter chuẩn hóa citations/attribution, UI không đọc thẳng cấu trúc Google.

Input sai trả 400; vượt hạn 429; upstream lỗi/timeout 503. Trạng thái disabled/no_evidence trả phản hồi có cấu trúc để UI giữ lại tác vụ chính. Không trả lỗi chứa khóa/token hoặc raw request.

Không có citation hỗ trợ thì no_evidence. Kết quả thủ tục tìm trực tiếp không tự tạo checklist đã duyệt. Hiển thị kết quả tham khảo tách biệt, cho mở nguồn; không ghi vào published. Tuân thủ attribution/suggestions và điều kiện sử dụng của API/model đã chọn. Không lưu hàng loạt raw Google response vào repository.

## Môi trường và rate limit

Server-only: GEMINI_API_KEY, GEMINI_MODEL, LIVE_RESEARCH_ENABLED, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, RATE_LIMIT_HMAC_SECRET. NEXT_PUBLIC_SITE_URL chỉ chứa URL công khai.

Live research mặc định false. Bật chỉ khi cấu hình Google và limiter đầy đủ; không có cấu hình hoặc Redis lỗi thì không gọi AI. Dùng Redis atomic counter với TTL: 5 request/phút/IP và 100 request/ngày toàn app, ngày UTC. Khóa IP là HMAC; chỉ lấy địa chỉ từ header đáng tin của nền tảng triển khai. Không dùng bộ nhớ process làm rate limit trên serverless.

Timeout upstream 20 giây, không retry tự động. Model ID lấy từ env, gói 05 phải kiểm tra khả năng Search bằng smoke test thật trước bật. Log chỉ request ID, status, latency, số call; không ghi raw query/response hoặc bí mật.

## Trạng thái người dùng

Mặc định phiên nằm trong bộ nhớ; lưu phiếu trên thiết bị phải chủ động chọn, có xem trước và xóa. Phiếu chỉ ghi nhu cầu, bước tự đánh dấu, phần cần hỏi, card ID/version và ngày rà soát. Không giả thành trạng thái cơ quan tiếp nhận.

QR/URL không chứa dữ liệu cá nhân. Offline chỉ đọc phiếu người dùng đã lưu và mốc thời gian; không giả định vừa xác minh. Không cache câu trả lời live research như nội dung đã duyệt.
