# BIÊN BẢN BÀN GIAO TOÀN DỰ ÁN LIÊN CHIỂU (ANTIGRAVITY HANDOFF)
> **Dự án:** LC Compass – La bàn Liên Chiểu  
> **Thời điểm bàn giao:** 01/10/2026 | **Đơn vị thực hiện:** Antigravity AI Coding Assistant  
> **Người tiếp nhận:** Nhóm tác giả dự án & Ban Tổ chức cuộc thi  
> **Phương châm:** "Nhỏ nhưng làm được – Thiết thực – Chi phí thấp – Triển khai được ngay"

---

## I. TỔNG QUAN KẾT QUẢ CÔNG VIỆC ĐÃ HOÀN THÀNH

Toàn bộ các yêu cầu rà soát, kiểm kê, làm sạch dữ liệu và khắc phục lỗi kỹ thuật đã được thực hiện triệt để:

```
+----------------------------------------------------+--------------------------+
| Hạng mục kiểm tra                                  | Kết quả thực tế          |
+----------------------------------------------------+--------------------------+
| 1. Kiểm tra hồi quy xuất bản (publication-audit)    | 7/7 bài kiểm tra ĐẠT     |
| 2. Kiểm thử tự động Vitest (18 tệp test suites)    | 170/170 bài kiểm tra ĐẠT |
| 3. Kiểm tra kiểu tĩnh TypeScript (typecheck)       | 0 lỗi (Exit Code 0)      |
| 4. Kiểm tra chuẩn mã nguồn ESLint (lint)           | 0 lỗi (Exit Code 0)      |
| 5. Kiểm tra hợp đồng dữ liệu (content:validate)    | 100% ĐẠT hợp đồng        |
| 6. Đóng gói sản xuất Next.js (npm run build)       | Hoàn thành thành công    |
| 7. Kiểm tra E2E danh mục thật (Playwright)         | 2/2 dự án trình duyệt ĐẠT|
| 8. Lập hồ sơ kiểm kê (antigravity-audit.md)        | Đã hoàn thành            |
| 9. Lập sổ đăng ký bằng chứng (evidence-register)   | Đã hoàn thành            |
+----------------------------------------------------+--------------------------+
```

### Chi tiết các can thiệp kỹ thuật trọng tâm:
1. **Loại bỏ triệt để dữ liệu sai lệch (P0):**
   - Đã gỡ bỏ toàn bộ lịch tình nguyện bịa đặt ("19h00 - 21h30 Thứ Bảy hàng tuần"), điểm sơ tán bão lũ tự phát ("THPT Nguyễn Trãi...") trên `HomeLivingPulse.tsx`.
   - Thu hồi số điện thoại cá nhân của Ban Tổ chức cuộc thi (`0905423233`) bị gán nhầm làm hotline cứu hộ bão lũ hoặc hotline CĐS phường; thay bằng Hotline chính thức của UBND Phường Liên Chiểu: `02363 777 998` và Tổng đài DVC Đà Nẵng: `0236 1022`.
   - Loại bỏ tiêu đề mạo danh cơ quan Nhà nước trên phiếu in vướng mắc tại `UnknownCaseFeedbackCard.tsx`, đổi thành phiếu chuẩn bị câu hỏi cá nhân của người dân.
2. **Chuẩn hóa múi giờ và logic thời gian (P1):**
   - Khắc phục lỗi lệch ngày trong `eventOnDate` tại `event-dates.ts`, đảm bảo các mốc thời gian UTC (ví dụ `18:30Z`) được quy đổi chính xác theo lịch ngày Việt Nam (`Asia/Ho_Chi_Minh` UTC+7).
3. **Cơ chế phòng thủ dữ liệu kiểm thử (P0/P1):**
   - Nâng cấp `loadEventsCatalog` tại `events-loader.ts` tự động phát hiện và loại bỏ các bản ghi fixture/mô phỏng (`.invalid`, `fixture-`, `test-only`) nếu vô tình bị sao chép vào tệp danh mục thật.
   - Nâng cấp `loadEventBoundary` tại `event-boundary.ts` có cơ chế bắt lỗi an toàn (Fail-Safe), không làm sập ứng dụng khi tệp địa giới bị khuyết hoặc hỏng.
   - Thắt chặt `BoundaryRecordSchema`: cấm công nhận trạng thái `verified` đối với các tệp polygon mô phỏng hoặc dùng domain thử nghiệm.
4. **Bổ sung minh chứng cho danh bạ tiện ích đời sống (P1):**
   - Bổ sung trường `evidence` vào `CommunityPlaceItemSchema` và hàm `loadPlacesDirectory()`, chỉ rõ căn cứ đối soát ranh giới theo Nghị quyết 1659/NQ-UBTVQH15.

---

## II. VIỆC ĐANG TẠM DỪNG (BLOCKED ITEMS) VÀ LÝ DO

| Hạng mục tạm dừng | Lý do cụ thể | Điều kiện để mở khóa tiếp theo |
| :--- | :--- | :--- |
| **1. Chưa công bố 4 sự kiện cộng đồng lên bản đồ công khai** | Cả 4 đầu mối (`community-digital-day`, `community-camp`, `community-startup-training`, `community-security-model`) mới dừng ở mức lịch họp trù bị hoặc thông báo khảo sát nhu cầu; chưa có quyết định ban hành chính thức về ngày giờ, địa điểm tổ chức cụ thể, đối tượng tham gia và poster. | Nhóm tác giả phối hợp trực tiếp với BCH Đoàn phường hoặc UBND phường để tiếp nhận Thông báo / Kế hoạch chính thức khi có văn bản phát hành. |
| **2. Chưa bật lớp polygon ranh giới vector trên bản đồ** | Chưa có tệp vector (GeoJSON) chính thức được cơ quan Nhà nước có thẩm quyền đo đạc địa chính ban hành cho phường Liên Chiểu mới. Nhóm tuân thủ nguyên tắc không tự vẽ polygon giả định. | Tiếp nhận tệp ranh giới số hóa chính thức từ UBND phường hoặc Cổng dữ liệu không gian TP. Đà Nẵng. |

---

## III. BƯỚC ĐI TIẾP THEO CỤ THỂ CHO NHÓM PHÁT TRIỂN

1. **Giai đoạn trước ngày báo cáo Ban Giám khảo:**
   - Sử dụng sản phẩm đã đóng gói chuẩn với danh mục thẻ dịch vụ công và địa điểm trọng điểm đã thẩm định.
   - Giữ nguyên trạng thái rỗng an toàn của bản đồ sự kiện, giải thích với Ban Giám khảo về triết lý "Fail-Closed: Thà để trống còn hơn công bố sự kiện ảo".
2. **Kênh liên hệ phối hợp xác thực dữ liệu:**
   - Đầu mối Đoàn phường: Đ/c Nguyễn Hoàng Thắng (SĐT: `0905423233` – Email: `doanphuonglienchieu.dn@gmail.com`).
   - Văn phòng UBND Phường: Bộ phận Tiếp nhận và Trả kết quả (68 Lạc Long Quân – SĐT: `02363 777 998`).
3. **Quy trình nhập sự kiện khi có văn bản chính thức:**
   - Bước 1: Lưu tệp PDF/ảnh văn bản có dấu đỏ vào `research/events/`.
   - Bước 2: Khai báo vào `candidates.json` với đầy đủ liên kết nguồn, ngày kiểm tra, người kiểm tra.
   - Bước 3: Chạy script `web/scripts/import-events.ts` để tự động đối soát và nạp vào `web/content/data/events.json`.

---

## IV. KỊCH BẢN THUYẾT TRÌNH & DEMO TẠI BÀN CHẤM (DEMO SCRIPT)

### Kịch bản 1: Màn hình lớn (Desktop) – Hỗ trợ chuẩn bị Dịch vụ công & Trụ sở mới (Thời lượng: 3 phút)
* **Người trình bày thao tác:** Mở trang chủ `https://lc-compass-xi.vercel.app` (hoặc `localhost:3000`).
* **Hành động 1:** Nhập từ khóa phương ngữ *"nỏ biết làm tạm trú"* hoặc gõ *"tạm trú"*.
* **Điểm nhấn thuyết minh:** 
  > *"Kính thưa Ban Giám khảo, hệ thống được thiết kế bộ chuẩn hóa phương ngữ, nhận diện ngay nhu cầu đăng ký tạm trú của công nhân KCN Hòa Khánh. Khi mở thẻ, người dân thấy rõ 4 bước chuẩn bị, căn cứ Thông tư 116/2026/TT-BCA, nút nghe đọc cho người lớn tuổi và nút xuất phiếu in A5 để mang đến Một cửa."*
* **Hành động 2:** Bấm vào nút **"Xem chỉ đường trụ sở 68 Lạc Long Quân"** trên Nhịp đập Liên Chiểu hôm nay.
* **Điểm nhấn thuyết minh:** 
  > *"Sau sáp nhập theo Nghị quyết 1659, trụ sở UBND Phường dời về 68 Lạc Long Quân, Công an Phường tại 66 Lạc Long Quân. Ứng dụng điều hướng người dân đi đúng nơi, triệt tiêu nguy cơ đi nhầm trụ sở cũ."*

---

### Kịch bản 2: Điện thoại di động (Mobile) – Bản đồ Sự kiện & Nguyên tắc Trung thực dữ liệu (Thời lượng: 3 phút)
* **Người trình bày thao tác:** Chuyển sang chế độ màn hình di động (hoặc mở điện thoại thật qua mã QR). Truy cập mục **"Sự kiện"** (`/events`).
* **Điểm nhấn thuyết minh:**
  > *"Tại mục Bản đồ sự kiện, giao diện được tối ưu hóa mobile-first với MapLibre GL siêu nhẹ. Hiện tại bản đồ hiển thị trạng thái 'Chưa có sự kiện được xác minh để công bố' và cung cấp đường link xem bản đồ hành chính có nguồn từ cổng thông tin phường. Đây là điểm khác biệt cốt lõi của LC Compass: Nhóm kiên quyết không dùng sự kiện giả hay dữ liệu mô phỏng để làm đẹp giao diện, bảo vệ sự chính xác tuyệt đối cho người dân."*

---

### Kịch bản 3: Tháo gỡ tình huống chưa có dữ liệu (Edge Case & Fail-Closed) (Thời lượng: 2 phút)
* **Người trình bày thao tác:** Gõ vào ô tìm kiếm một nội dung hoàn toàn không có trong danh mục: *"tranh chấp ranh giới đất rừng"*.
* **Điểm nhấn thuyết minh:**
  > *"Khi gặp tình huống vượt thẩm quyền hoặc chưa có dữ liệu, hệ thống không để AI tự bịa câu trả lời nguy hại, mà kích hoạt ngay Thẻ tháo gỡ điểm dừng an toàn: Hướng dẫn công nhân in phiếu ghi nhận câu hỏi, cung cấp số Hotline UBND Phường 02363 777 998 và Tổng đài 1022 để người dân gặp trực tiếp chuyên viên có thẩm quyền."*

---

## V. ĐỐI CHIẾU BỘ HỒ SƠ DỰ THI VỚI YÊU CẦU AGENTS.MD

Nhóm tác giả đã tiến hành tự rà soát bộ hồ sơ dự thi theo đúng ma trận tiêu chuẩn quy định tại `AGENTS.md`:

```
+----+----------------------------------+-----------------------+--------------------+-----------------------+
| STT| Tiêu chuẩn AGENTS.md             | Quy định bắt buộc     | Hiện trạng hồ sơ   | Đánh giá tuân thủ     |
+----+----------------------------------+-----------------------+--------------------+-----------------------+
| 01 | Bản thuyết minh ý tưởng          | Tối đa 05 trang A4    | 05 trang chuẩn in  | ĐẠT 100% (file .html) |
| 02 | Số lượng slide thuyết trình      | Tối đa 10 slide       | 08 slide ảnh/PDF   | ĐẠT 100% (slide/ 1-8) |
| 03 | Sản phẩm minh họa / Prototype    | Web/App có thể chạy   | Web Next.js live   | ĐẠT 100%              |
| 04 | Dự toán kinh phí thực hiện       | Tiết kiệm, khả thi    | 1.000.000 VNĐ      | ĐẠT 100%              |
| 05 | Bộ câu hỏi phản biện giả định    | Dự đoán câu hỏi BGK   | 08 câu hỏi thực địa| ĐẠT 100% (file 04)    |
| 06 | Mốc thời gian cuộc thi           | Ghi nhận trung thực   | Mốc cũ đã qua      | ĐÃ CẬP NHẬN CHÚ THÍCH |
+----+----------------------------------+-----------------------+--------------------+-----------------------+
```

### Chi tiết đối chiếu từng hạng mục:
1. **Bản thuyết minh dự án (`delivery/submission/02_BAN_THUYET_MINH_DU_AN.html`):**
   - Đã được định dạng theo tiêu chuẩn in văn bản hành chính Việt Nam (Nghị định 30/2020/NĐ-CP).
   - Thiết lập CSS `@media print` ngắt trang chính xác **đúng 05 trang A4**, tích hợp nút bấm in/xuất file PDF trực tiếp từ trình duyệt.
   - Đầy đủ 10 mục nội dung theo đề cương của Đoàn phường (Tên ý tưởng, Vấn đề thực tế, Mục tiêu, Giải pháp, Điểm mới, Đối tượng hưởng lợi, Kinh phí, Khả năng nhân rộng, Kế hoạch triển khai, Kiến nghị).
2. **Slide thuyết trình (`slide/`):**
   - Gồm 8 tệp ảnh slide độ nét cao (`1.png` đến `8.png`) và bản PDF `lienchieu (2).pdf`.
   - Số lượng 8 slide hoàn toàn nằm trong giới hạn ≤ 10 slide của cuộc thi; tập trung vào: *Vấn đề thực tế $\rightarrow$ Giải pháp LC Compass $\rightarrow$ Độ tin cậy dữ liệu $\rightarrow$ Chi phí 1 triệu đồng $\rightarrow$ Khả năng áp dụng ngay*.
3. **Dự toán kinh phí cực kỳ tiết kiệm:**
   - Chi phí phần mềm, máy chủ, bản đồ: **0 đồng** (sử dụng tài nguyên mở Vercel Hobby, MapTiler 100.000 req/tháng miễn phí, OpenStreetMap).
   - Chi phí triển khai thực địa: **1.000.000 đồng** (in ấn 500 phiếu hướng dẫn DVC A5 và 2 băng rôn đặt tại sảnh Một cửa 68 Lạc Long Quân và KCN Hòa Khánh).
4. **Bộ câu hỏi phản biện (`04_BO_CAU_HOI_PHAN_BIEN_THUC_DIA.md`):**
   - Chuẩn bị sẵn 8 câu hỏi hóc búa nhất: so sánh với Danang Smart City, giải thích việc không dùng AI tự do, giải thích lý do để trống bản đồ sự kiện khi chưa có văn bản, và phương án bàn giao cho Đoàn phường quản trị.
5. **Ghi chú về mốc thời gian:**
   - Các mốc thời gian lịch sử ghi trong kế hoạch ban đầu (nộp trước 23/09/2026, chung kết 26/09/2026) được giữ nguyên theo văn bản gốc của Đoàn phường để đối chiếu. Tại thời điểm 01/10/2026, nhóm đã hoàn thiện trọn vẹn sản phẩm và hồ sơ, sẵn sàng tham gia thuyết trình bảo vệ khi Ban Tổ chức công bố lịch trình tiếp theo.

---

## VI. BÀN GIAO MÃ NGUỒN VÀ DỮ LIỆU

* **Thư mục ứng dụng web:** `H:\LC\web\`
* **Thư mục hồ sơ dự thi chính thức:** `H:\LC\delivery\submission\`
* **Thư mục slide thuyết trình:** `H:\LC\slide\`
* **Thư mục tài liệu kiểm kê và bằng chứng:** `H:\LC\docs\`
* **Lệnh khởi động môi trường kiểm thử cục bộ:**
  ```bash
  cd H:\LC\web
  npm test          # Chạy 170 bài kiểm tra tự động (18/18 files PASS)
  npm run typecheck # Kiểm tra an toàn kiểu dữ liệu (0 errors)
  npm run lint      # Kiểm tra chuẩn mã nguồn (0 errors)
  npm run build     # Đóng gói sản phẩm Next.js
  ```
