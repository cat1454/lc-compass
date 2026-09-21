# Prompt Antigravity — dữ liệu trước, tích hợp API theo nhu cầu

Làm việc trong H:/LC, ứng dụng Next.js tại H:/LC/web. Thực hiện gói dữ liệu và các sửa lỗi trực tiếp được nêu bên dưới; không chỉ trả lại kế hoạch. Bản prompt này cập nhật sau khi production đã được triển khai ngày 19/09/2026.

## 1. Đọc và xác nhận hiện trạng

Đọc lần lượt:
- AGENTS.md.
- delivery/deployment/REPORT.md — baseline triển khai mới hơn báo cáo localhost cũ.
- docs/handoff/STATUS.md và docs/handoff/data-expansion/TASK.md.
- research/FREE_APIS.md.
- design/compass/ARCHITECTURE.md — định hướng; đối chiếu với mã, không coi mọi mục là đã triển khai.
- Các contracts, validator, loader, intent catalog và search được chỉ ra trong TASK.

Theo báo cáo triển khai: production https://lc-compass-xi.vercel.app, demo /demo có 2 thẻ có nguồn chưa rà soát nghiệp vụ; 72 unit test và 32 E2E Production đạt ở lần triển khai trước. Đây không phải kết quả kiểm thử cho thay đổi sắp làm. Giữ Next/React đã ghim, Node 22, override PostCSS và cấu hình bảo vệ tệp nội bộ; không khôi phục lockfile/dependency cũ. Production audit được báo cáo 0 lỗ hổng; 5 cảnh báo dev/test còn lại thuộc gói nâng công cụ riêng.

Bạn không làm việc một mình: kiểm tra thay đổi hiện có, không hoàn nguyên công việc người khác. Nếu gói đã IN_PROGRESS bởi phiên khác thì không tạo phiên triển khai trùng. Khi tiếp nhận thực sự, cập nhật REPORT.md với trạng thái và thời điểm thật.

## 2. Thứ tự ưu tiên đã điều chỉnh

1. Kiểm tra luồng dữ liệu hiện có và sửa chỗ trực tiếp gây thông tin sai.
2. Thu thập, đối chiếu và tích hợp bộ dữ liệu thật, sau đó nghiệm thu trên local.
3. Bàn giao REVIEW cho Codex, kèm đề xuất gói bản đồ/chỉ đường kế tiếp.
4. API thời tiết, AI, geocoding và backend lưu dữ liệu chỉ là các gói sau; không triển khai trong lượt này.

Kiến trúc JSON có phiên bản → validator → loader/DTO → search → renderer đã tồn tại. Tiếp tục dùng kiến trúc đó; không viết lại hệ thống, không thêm CMS/database/vector database hoặc lớp provider tổng quát chỉ để chuẩn bị cho API chưa dùng. Không cần hoàn thiện cả 9 dịch vụ trong nghiên cứu API trước khi có dữ liệu hữu ích.

## 3. Thực hiện ngay: corpus thật và tính đúng của giao diện

- Làm đầy đủ TASK.md, mục tiêu 24 thẻ tổng: 8 SERVICE, 10 PLACE, 6 DISCOVER; hai thẻ hiện có phải kiểm tra lại nguồn. Chia thành lô nhỏ đủ bằng chứng để kiểm tra sớm, không chờ đủ 24 mới thử trên /demo.
- candidates.json chỉ là hàng đợi chủ đề. Không biến tên chủ đề thành địa điểm/dịch vụ giả. Không chia một thủ tục thành nhiều thẻ trùng ý để đạt chỉ tiêu.
- Mở nguồn gốc, xác minh địa giới hiện tại, tính cập nhật và từng claim; lưu sources, claim-map, decisions và drafts theo TASK. HTTP 200, tên miền chính thức và kết quả AI không tự chứng minh nội dung đúng.
- Giữ schema/public API hiện tại. Dùng intent đúng nghĩa đã tồn tại; hộ tịch/chứng thực chưa có intent phù hợp thì giữ draft và báo thiếu, không gán nhầm intent cư trú.
- review.status=review, isSynthetic=false; không tạo reviewer/reviewedAt. DTO tiếp tục isVerified=false. Không tự chuyển sang published.
- Thu thập tọa độ nếu có bằng chứng độc lập đủ để đối chiếu đúng địa điểm; ghi nguồn vào claim-map. Thiếu tọa độ thì bỏ trường, không geocode tự động hoặc lấy tâm phường thay thế. Không để việc thiếu tọa độ cản một PLACE có địa chỉ đã đủ căn cứ.
- Kiểm tra CitizenServiceView: hiện có URL gán cứng `maps.google.com/?q=Cong+an+phuong+Lien+Chieu+Da+Nang` và `/minimap.svg`. Gỡ đích gán cứng khỏi luồng hiển thị nội dung thật; chỉ dùng action đã có nguồn trên thẻ, nếu chưa có thì hiện chưa xác minh/ẩn hành động. Không lấy địa chỉ Trung tâm hành chính làm nơi nhận hồ sơ cư trú khi chưa có căn cứ.
- Không trình bày minimap SVG như bản đồ xác định vị trí thật: trong luồng dữ liệu thật, thay bằng địa chỉ đã có nguồn và trạng thái chưa có bản đồ nếu chưa tích hợp. Không thay phong cách 04A hoặc thiết kế lại bố cục.
- Giữ nhãn mô phỏng của AI, LIVE_RESEARCH_ENABLED=false; không làm giao diện khiến người dùng tưởng đã hỏi AI trực tiếp.

## 4. Chuẩn bị gói kế tiếp — chưa triển khai API trong lượt này

Trong báo cáo, ghi backlog bản đồ/chỉ đường theo dữ liệu thực tế đã thu được:

- Ưu tiên Google Maps URLs trước: không cần key, không phải API nhúng. Chỉ tạo URL từ tên/địa chỉ hoặc tọa độ có nguồn; dùng `api=1` và URLSearchParams. Chỉ có địa chỉ thì nhãn “Tìm trên Google Maps theo địa chỉ”; không hứa marker đúng tuyệt đối hoặc tự tính quãng đường/thời gian.
- Tiếp theo Leaflet + OSM: component dùng chung, client-only/tải lười; chỉ ghim tọa độ đã đối chiếu. Thiếu tọa độ hoặc tile lỗi vẫn đọc được địa chỉ và nguồn. Không tự nối SERVICE/DISCOVER với một PLACE khi chưa có liên kết có căn cứ.
- Trước triển khai tile đọc lại chính sách: attribution luôn hiện, tuân thủ cache/Referer, không tải hàng loạt/offline, tests không quét tile công cộng. Leaflet là thư viện; OSM tile không có SLA.
- Thời tiết chỉ thêm khi có tác vụ khám phá cụ thể; Gemini chỉ sau khi có nguồn, kiểm soát đầu vào, endpoint server, limiter và kiểm thử lỗi. Không chọn cả hai chỉ để tăng số API.
- Supabase/Turnstile chỉ khi có nhu cầu ghi dữ liệu hoặc biểu mẫu thật; geocoding chỉ hỗ trợ biên tập và phải đối chiếu kết quả.

Nguồn tham chiếu đã mở khi cập nhật prompt: https://developers.google.com/maps/documentation/urls/get-started và https://operations.osmfoundation.org/policies/tiles/. Kiểm tra lại trước gói tích hợp thực tế.

## 5. Nghiệm thu và kết thúc gói

- Chạy content validation, typecheck, lint, unit tests, build và E2E theo TASK; cập nhật test giả định corpus chỉ có 2 thẻ/DISCOVER rỗng nhưng giữ các bảo đảm về nguồn, hạn và ranh giới catalog.
- Thêm kiểm thử có ý nghĩa cho sửa lỗi đích bản đồ: thẻ chưa có địa điểm tiếp nhận được xác minh không hiển thị liên kết Công an gán cứng; thẻ có action đúng vẫn mở đúng URL.
- Kiểm tra tìm có/không dấu, địa chỉ, chi tiết ba loại có dữ liệu, nhãn chờ rà soát, hết hạn, không kết quả; ảnh mobile 320/375px và desktop 1440px.
- Chạy audit production và ghi kết quả mới; không dùng `npm audit fix --force` hoặc nâng major bộ kiểm thử trong gói này. Nếu có vấn đề mới liên quan dependency thì báo rõ phạm vi.
- Ghi kết quả thật vào REPORT: số thẻ trước/sau, ID mới/sửa/loại, nguồn, hạn chế, lệnh và exit code, ảnh, thay đổi logic, backlog bản đồ và phần chưa làm. Nếu thiếu bằng chứng không đủ 24, báo số đạt và lý do; không bịa để vượt nghiệm thu.
- Kết thúc ở REVIEW để Codex kiểm tra. Không tự ghi Codex/người nghiệp vụ đã duyệt.
- Production đã tồn tại: không tạo lại project Vercel, không đổi env hoặc deploy lại trong gói này. Bàn giao local đã kiểm thử và danh sách thay đổi phục vụ lần phát hành tiếp theo. Không ghi “Vercel chưa triển khai” như tài liệu cũ.
