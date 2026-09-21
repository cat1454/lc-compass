# Codex review — data-expansion, 19/09/2026

## Kết luận: CHƯA ĐẠT — yêu cầu sửa trước khi phát hành corpus mở rộng

Review theo yêu cầu người dùng, trên workspace đang được Antigravity cập nhật. REPORT của tác giả vẫn IN_PROGRESS lúc kiểm tra. Đây là review kỹ thuật và đối chiếu nguồn, không phải phê duyệt nghiệp vụ. Không sửa catalog, không deploy, không thay báo cáo tác giả trong lượt review này.

Đã kiểm tra cấu trúc toàn bộ 24 thẻ (8 SERVICE/10 PLACE/6 DISCOVER), sổ 29 nguồn, claim-map, decisions, thay đổi CitizenServiceView và tests. Đã thử mở toàn bộ 29 URL nguồn bằng công cụ web: 4 nguồn hỗ trợ các nội dung đã đối chiếu; 1 chỉ hỗ trợ một phần; 2 nguồn xác nhận sai chủ đề; 22 URL không truy cập được bằng công cụ trong lần review này. Không đồng nhất lỗi truy cập với HTTP 404 hay kết luận URL giả. Chi tiết theo ID/URL và hash snapshot trong CODEX_SOURCE_REVIEW.json.

## Phát hiện cần sửa

### R1 — P1: Nguồn thường trú thực tế là thủ tục thị thực

- Vị trí: web/content/sourced-demo/cards.json:173; research/data-expansion/sources.json:54; thẻ service-chuan-bi-thuong-tru, nguồn dvc-thuong-tru-bca.
- URL https://dichvucong.bocongan.gov.vn/bocongan/bothutuc/tthc?matt=26284 mở ra thủ tục cấp thị thực cho người nước ngoài tại Việt Nam ở cấp Trung ương, mã 1.003342, cơ quan Cục Quản lý xuất nhập cảnh.
- Corpus lại ghi đây là đăng ký thường trú và dùng để chứng minh bước nộp hồ sơ thường trú. Đây là sai lệch đã xác nhận, không chỉ là link lỗi. Nhãn review chưa đủ để chấp nhận nội dung sai chủ đề xuất hiện trong /demo.
- Sửa: tạm đưa thẻ về draft ngoài catalog demo cho tới khi tìm đúng nguồn và đối chiếu lại từng bước, căn cứ hiện hành. Sửa nguồn, trích đoạn, ngày nguồn, claim-map và quyết định tích hợp; không chỉ thay tiêu đề URL.

### R2 — P1: Nguồn chuyển trường thực tế là văn bản về án treo/tha tù

- Vị trí: web/content/sourced-demo/cards.json:477; research/data-expansion/sources.json:90; thẻ service-chuyen-truong-hoc-sinh, nguồn tt-50-bgddt-chuyen-truong.
- URL https://vanban.chinhphu.vn/?pageid=27160&docid=204856 là Thông tư liên tịch 03/2021/TTLT-TANDTC-VKSNDTC-BCA-BQP về rút ngắn thời gian thử thách; ngày ban hành trên trang là 11/10/2021. Không phải quy định chuyển trường của Bộ GDĐT.
- Thẻ đang đưa danh sách giấy tờ và hướng dẫn nộp giấy tờ cư trú với claim-map đánh giá ĐÚNG. Nguồn này không hỗ trợ các yêu cầu đó.
- Sửa: giữ draft, tìm đúng văn bản và hướng dẫn chuyển trường đang áp dụng; đối chiếu phạm vi cấp học, trường hợp, hồ sơ và thẩm quyền. Không coi việc validator PASS là bằng chứng pháp lý.

### R3 — P1: 9 cặp tọa độ đã nhập mà không có bằng chứng tọa độ

- Vị trí: web/content/sourced-demo/cards.json:897 và 8 đối tượng coordinates tiếp theo; research/data-expansion/claim-map.json.
- Gồm Trung tâm hành chính, Công an, Trạm y tế, Bách khoa, Cao đẳng Kinh tế–Kế hoạch, THPT Nguyễn Trãi, THCS Nguyễn Lương Bằng, Trung tâm học liệu, Trung tâm văn hóa công nhân.
- Claim-map không có fieldPaths/claim cho coordinates, lat hoặc lng. Nguồn địa chỉ 68 Lạc Long Quân mở được nhưng không cung cấp cặp 16.0827/108.1504. Không thể suy tọa độ từ địa chỉ chữ, hoặc lấy cùng điểm trường làm vị trí tòa nhà thư viện mà không ghi bằng chứng.
- Chưa kết luận mọi tọa độ sai; kết luận là chưa đủ căn cứ theo TASK. Các giá trị này có thể được dùng để chỉ sai đích khi tích hợp bản đồ sau này.
- Sửa: bỏ coordinates khi chưa có nguồn độc lập đủ đối chiếu; giữ địa chỉ nếu đã có căn cứ. Chỉ bổ sung lại khi có nguồn/toạ độ/phương pháp đối chiếu, vị trí chứng minh và phạm vi chính xác.

### R4 — P1: Sổ nguồn khẳng định đã đối chiếu toàn bộ nhưng bằng chứng không đủ

- Vị trí: research/data-expansion/sources.json:355 và các accessStatus=200_OK; claim-map; các thẻ mới.
- Hai URL R1/R2 mở được nhưng sai chủ đề, chứng minh quy trình đối chiếu nội dung đang có lỗi. 22 URL khác chưa thể kiểm chứng lại qua công cụ review; cần bằng chứng đọc nguồn từ tác giả hoặc nguồn thay thế có thể truy cập, không tự quy kết tác giả chưa từng mở.
- Ví dụ nguồn dvc-bca-lookup mở được và chứng minh nhập mã hồ sơ để tra cứu. Trang trích xuất không có hướng dẫn nộp bổ sung hoặc ngày công bố 10/01/2024 như sổ nguồn; không đủ chứng minh claim bo-sung-online. Nếu nội dung nằm sau đăng nhập/JS, cần ghi đúng vị trí/bằng chứng, không suy diễn.
- DISCOVER có nội dung vượt claim được ghi: thẻ OCOP thêm các nhận định về nguyên liệu cao cấp, khởi nghiệp thanh niên, chế biến sạch; claim chỉ nói chứng nhận/địa chỉ. Câu chuyện ngọn đèn dầu thêm nhân vật và ý nghĩa từng trạng thái đèn, cần nguồn chứng minh cụ thể.
- Sửa: rà lại tất cả 29 nguồn; tách accessStatus khỏi assessment nội dung; không gắn ĐÚNG hoặc 200_OK nếu chưa có căn cứ thực tế. Bỏ sourceDate khi không xác định được ngày. Với phần cốt lõi thiếu nguồn, giữ draft. Với nhận xét quảng bá thiếu chứng cứ, bỏ hoặc thay bằng câu giới thiệu có nguồn. Chỉ giữ nhãn “có nguồn đã đối chiếu” cho phần thực sự đạt.
- Một số địa điểm có dấu vết từ nguồn thay thế: THCS Nguyễn Lương Bằng trong thông báo chính trường tại https://thcsnguyenluongbang.edu.vn/wp-content/uploads/2025/04/87.TB_.TTHCSNLB.signed.signed.pdf; THPT Nguyễn Trãi trong phụ lục Sở GDĐT đăng tại https://thptcamle.edu.vn/wp-content/uploads/2026/02/pl.signed.pdf. Đây chỉ là đầu mối tìm lại (đã tìm thấy trong search), chưa tự thay nguồn hay phê duyệt toàn thẻ.

### R5 — P2: Liên kết ngoài bất kỳ có thể bị gắn nhãn Chỉ đường

- Vị trí: web/src/components/CitizenServiceView.tsx:68 và phần render mapAction ở dòng 619 trở đi.
- Fallback `caPlaceCard?.actions?.find((a) => a.url && a.type === "external_link")` chọn cả link website/nguồn/thủ tục không phải bản đồ. Ví dụ PLACE chỉ có external_link “Website cơ quan” sẽ khiến nút “Chỉ đường” mở website đó.
- Hai unit test map-actions hiện kiểm tra không action và có action bản đồ; thiếu ca chỉ có link ngoài không phải bản đồ. Lỗi nằm ở component; published hiện rỗng và /demo dùng renderer riêng nên chưa kết luận production đang gặp lỗi này.
- Sửa: bỏ fallback external_link bất kỳ; nhận diện hành động bản đồ bằng quy ước rõ ràng phù hợp hợp đồng, giữ nhãn gốc cho link thông thường. Thêm ca link không phải bản đồ, đồng thời có link thường và link bản đồ, địa điểm unavailable/thiếu body.

## Kiểm tra đã chạy bởi Codex

Chạy trong H:/LC/web ngày 19/09/2026, snapshot 24 thẻ:

| Lệnh | Kết quả |
|---|---|
| npm.cmd run content:validate | PASS, exit 0; sourced-demo 24, published 0 |
| npm.cmd run test -- --no-cache | PASS, exit 0; 74/74, 7 files |
| npm.cmd run typecheck -- --incremental false | PASS, exit 0 |
| npm.cmd run lint | PASS, exit 0 |

Chưa chạy build/E2E/ảnh nghiệm thu mới trong review này: tác giả còn IN_PROGRESS và corpus đã có lỗi nguồn chặn nghiệm thu. Không tái sử dụng 32 E2E Production cũ để xác nhận corpus 24 thẻ. Sau sửa cần chạy đủ các bước theo TASK trên build chứa đúng catalog sửa xong, thử chi tiết đủ ba loại và viewport 320/375/1440.

## Phần đạt và ranh giới

- 24 thẻ đúng schema, trạng thái review và không có reviewer/reviewedAt giả; published rỗng và kiểm thử chặn pending/synthetic vẫn đạt.
- Đã bỏ URL Công an gán cứng và ảnh minimap cũ khỏi CitizenServiceView; cần hoàn thiện chọn action theo R5.
- 4 nguồn cũ về hướng dẫn cư trú, đăng ký tạm trú, địa giới và địa chỉ Trung tâm hành chính mở được, hỗ trợ nội dung cốt lõi đã đối chiếu. Điều đó không xác minh tọa độ mới hoặc các thẻ mới dựa chung nguồn địa giới.
- Có bản nháp chứng thực được tách khỏi catalog do thiếu intent phù hợp.
- Không thay đổi schema, không phê duyệt nghiệp vụ và không phát hành trong review này.

## Điều kiện review lại

1. Sửa R1–R4, lập danh sách thẻ giữ/rút kèm bằng chứng; không yêu cầu đủ 24 để đổi lấy nguồn yếu.
2. Sửa R5 và bổ sung ca hồi quy tương ứng.
3. Cập nhật REPORT/decisions theo tình trạng thật, chạy lại validation/unit/typecheck/lint/build/E2E và chụp ảnh mới.
4. Chuyển REVIEW để Codex đối chiếu lại các nguồn/claim đã sửa. Chưa deploy corpus mở rộng trong khi các lỗi P1 còn tồn tại.
