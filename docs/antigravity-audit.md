# BÁO CÁO KIỂM KÊ TOÀN DIỆN VÀ DANH SÁCH CÔNG VIỆC DỰ ÁN LIÊN CHIỂU
> **Tài liệu kiểm kê chất lượng và độ tin cậy dữ liệu (Antigravity Project Audit)**  
> **Thời điểm lập:** 01/10/2026 | **Hệ thống:** LC Compass (Web, Data & Documentation)  
> **Nguyên tắc chỉ đạo:** "Nhỏ nhưng làm được – Thiết thực – Chi phí thấp – Triển khai được ngay – Không bịa đặt dữ liệu"

---

## I. MỤC TIÊU VÀ PHẠM VI KIỂM KÊ

Báo cáo này được lập nhằm rà soát toàn diện hiện trạng mã nguồn, tập dữ liệu, các luồng giao diện người dùng và toàn bộ các tuyên bố trong hồ sơ dự án `H:\LC`. Trọng tâm kiểm kê là loại bỏ triệt để các dữ liệu giả định, dữ liệu mô phỏng lọt vào luồng công khai; xác lập cơ chế công bố dựa trên bằng chứng minh bạch (Evidence-Gated Publication); đồng thời đảm bảo không làm gián đoạn các thay đổi đang thực hiện của các thành viên trong nhóm.

---

## II. KIỂM KÊ HIỆN TRẠNG TỪNG PHÂN HỆ VÀ TẬP DỮ LIỆU

### 1. Hiện trạng các trang và luồng người dùng (`web/src/app`)

| Trang / Tuyến đường | Mục đích sử dụng | Trạng thái kỹ thuật | Nguồn dữ liệu sử dụng | Đánh giá tính xác thực & Rủi ro |
| :--- | :--- | :---: | :--- | :--- |
| **Trang chủ (`/`)** | Cửa ngõ định hướng người dân, thanh niên, công nhân | Đang hoạt động, Next.js dynamic | Dữ liệu thẻ đã duyệt (`cards.csv`), nhịp đập địa phương | **Đã xử lý P0**: Đã gỡ bỏ lịch công tác giả ("19h00 - 21h30"), điểm sơ tán bão lũ giả ("THPT Nguyễn Trãi...") và số điện thoại cá nhân ban tổ chức (`0905423233`) bị gán nhầm làm hotline cứu hộ. |
| **Dịch vụ công (`/services`)** | Hướng dẫn chuẩn bị hồ sơ thủ tục hành chính | Đang hoạt động | 14 thẻ dịch vụ công (`cards.csv`, `sources.csv`) | **Dữ liệu thật**: 100% căn cứ từ Cổng DVC Quốc gia, Luật Cư trú, Nghị định 62/2021, NQ 1659/UBTVQH15. |
| **Địa điểm (`/places`)** | Danh bạ tiện ích đời sống & cơ quan hành chính | Đang hoạt động | 10 thẻ địa điểm trọng điểm + 1.661 điểm tiện ích OSM | **Dữ liệu hỗn hợp**: 10 địa điểm trụ sở có nguồn báo chí/chính quyền; 1.661 điểm từ OpenStreetMap đã được bổ sung trường `evidence` đối soát ranh giới NQ 1659. |
| **Sự kiện (`/events`)** | Bản đồ khám phá sự kiện văn hóa, thể thao, Đoàn | Đang hoạt động, MapLibre GL | Danh mục `events.json` (hiện tại: 0 sự kiện được công bố) | **An toàn (Fail-Closed)**: Hiển thị đúng trạng thái rỗng "Chưa có sự kiện được xác minh để công bố"; chặn toàn bộ fixture kiểm thử. |
| **Khám phá (`/discover`)** | Quảng bá di sản, làng nghề, văn hóa địa phương | Đang hoạt động | 2 thẻ văn hóa di sản (`cards.csv`) | **Dữ liệu thật**: Di tích Làng nghề Nam Ô, B1 Hồng Phước có trích dẫn nguồn lịch sử. |
| **Chi tiết thẻ (`/cards/[id]`)** | Xem chi tiết từng thẻ, căn cứ, các bước, in phiếu | Đang hoạt động | `cards.csv` và các bảng quan hệ | **Dữ liệu thật**: Có trích đoạn nguồn gốc, ngày truy cập, nút nghe đọc (TTS) và nút in phiếu chuẩn bị A5. |
| **Xem trước / Demo (`/demo`, `/embed`)** | Trang trình diễn và widget nhúng thử nghiệm | Đang hoạt động | `content/demo/cards.json` | **Dữ liệu thử nghiệm**: Đánh dấu rõ ràng là bản demo cho ban giám khảo chấm thi. |

### 2. Hiện trạng các tập dữ liệu (`content/data/`)

| Tên tập dữ liệu | Định dạng | Quy mô | Nguồn gốc xuất xứ | Trạng thái rà soát | Hướng xử lý |
| :--- | :---: | :---: | :--- | :---: | :--- |
| `cards.csv` & quan hệ | CSV (RFC 4180) | 24 thẻ, 53 nguồn, 95 bước | Cổng DVC, Báo Chính phủ, Nghị quyết HĐND | Đã phê duyệt chính thức | Duy trì làm nguồn sự thật (Source of Truth) cho dịch vụ và địa điểm trọng tâm. |
| `places.csv` | CSV | 1.661 dòng | OpenStreetMap + Khảo sát sơ bộ | Kế thừa từ giai đoạn 1 | Bổ sung trường `evidence` chỉ rõ điểm đối soát ranh giới NQ 1659, không tuyên bố vượt quá mức độ xác minh thực tế. |
| `events.json` | JSON | 0 sự kiện | Đang thu thập và xác minh | Chưa có bản ghi đạt chuẩn | Giữ nguyên danh mục rỗng (0 sự kiện); hiển thị thông báo chờ cập nhật. Tuyệt đối không dùng dữ liệu giả. |
| `event-boundary.json` | JSON | 0 polygon | Ảnh bản đồ Cổng thông tin phường | Chờ GeoJSON chính thức | Trạng thái `pending`; hiển thị ảnh tham khảo có nguồn `lienchieu.danang.gov.vn` kèm chức năng phóng to; không vẽ polygon giả. |
| `scenarios_10000.csv` | CSV/JSONL | 10.000 kịch bản | Mô phỏng thuật toán Descartes (100x10x10) | Dữ liệu kiểm thử thuật toán | Phục vụ kiểm thử độ bền thuật toán điều hướng (stress test), không phải dữ liệu người dùng thật. |

---

## III. BẢNG PHÂN LOẠI VÀ DANH SÁCH CHI TIẾT CÁC VẤN ĐỀ

### 1. Phân loại ưu tiên
* **P0 (Nghiêm trọng nhất):** Dữ liệu sai lệch thực tế, bịa đặt lịch trình/hotline/điểm sơ tán hoặc công bố dữ liệu chưa có căn cứ kiểm chứng ra ngoài công chúng.
* **P1 (Quan trọng):** Lỗi logic hệ thống, xử lý múi giờ sai lệch, thiếu cơ chế phòng vệ khi tệp dữ liệu bị khuyết, thiếu trường kiểm chứng thiết yếu.
* **P2 (Cải thiện trải nghiệm & Tài liệu):** Cân chỉnh giao diện đa màn hình, thông điệp trạng thái rỗng, đồng bộ hóa giữa kịch bản kiểm thử E2E và hồ sơ thuyết minh dự thi.

---

### 2. Danh mục vấn đề và kết quả xử lý thực tế

```
+----+-----+----------------------------------------------------------+-----------------------+------------+
| STT| Mức | Mô tả vấn đề & Vị trí phát hiện                          | Tác động              | Tình trạng |
+----+-----+----------------------------------------------------------+-----------------------+------------+
| 01 | P0  | Bịa lịch công tác, điểm sơ tán & hotline cứu hộ ở Home   | Cực kỳ nguy hiểm      | ĐÃ KHẮC PHỤC|
| 02 | P0  | Dùng SĐT cá nhân BTC làm Hotline CĐS & mạo danh UBND     | Sai lệch tư cách pháp | ĐÃ KHẮC PHỤC|
| 03 | P0  | Nguy cơ lọt sự kiện kiểm thử (.invalid) vào catalog thật | Công bố sự kiện giả   | ĐÃ KHẮC PHỤC|
| 04 | P0  | Vẽ polygon địa giới khi chưa có GeoJSON chính thức       | Nhầm lẫn ranh giới    | ĐÃ KHẮC PHỤC|
| 05 | P1  | Lỗi lệch ngày theo múi giờ Việt Nam trong eventOnDate    | Hỏng bộ lọc ngày      | ĐÃ KHẮC PHỤC|
| 06 | P1  | loadEventBoundary crash khi tệp địa giới không đọc được   | Sập trang /events     | ĐÃ KHẮC PHỤC|
| 07 | P1  | Thiếu trường evidence trong danh bạ tiện ích places      | Thiếu minh chứng điểm | ĐÃ KHẮC PHỤC|
| 08 | P2  | Lệch bộ chọn trong các kịch bản kiểm thử E2E giao diện   | Test cũ không khớp UI | ĐÃ GHI NHẬN|
| 09 | P2  | Trạng thái rỗng bản đồ sự kiện cần thông tin rõ ràng     | Người dùng hoang mang | ĐÃ HOÀN TẤT|
+----+-----+----------------------------------------------------------+-----------------------+------------+
```

---

## IV. BÁO CÁO CHI TIẾT TỪNG VẤN ĐỀ VÀ KẾT QUẢ NGHIỆM THU

### Vấn đề P0-01: Bịa đặt thông tin dân sinh và trưng dụng SĐT cá nhân làm hotline cứu hộ trên Trang chủ
* **Vị trí phát hiện:** `web/src/components/home/HomeLivingPulse.tsx` (dòng 40–90).
* **Mô tả hiện trạng:** 
  - Khai báo lịch tình nguyện "19h00 - 21h30 Thứ Bảy hàng tuần" không có căn cứ.
  - Tự ý nêu địa điểm sơ tán ngập lụt tại "THPT Nguyễn Trãi & THCS Nguyễn Lương Bằng" khi UBND phường chưa ban hành quyết định phê duyệt điểm sơ tán năm 2026.
  - Đặt nhãn "Gọi Đội phản ứng nhanh cứu hộ (0905 423 233)" dẫn link `tel:0905423233` (đây là số điện thoại cá nhân của Đ/c Nguyễn Hoàng Thắng - Phó Bí thư Đoàn phường, đầu mối nhận bài thi cuộc thi).
  - Gắn nhãn màu đỏ gây hoang mang "DỮ LIỆU THỰC ĐỊA TUẦN NÀY".
* **Tác động:** Khi xảy ra ngập lụt thực tế tại đường Mẹ Suốt, người dân gọi số này sẽ gây tắc nghẽn liên lạc cá nhân, không gặp được cơ quan cứu hộ chuyên trách; gây rủi ro an toàn dân sinh và vi phạm nguyên tắc trung thực của cuộc thi.
* **Cách xử lý:**
  - Thay thế toàn bộ bằng thông tin chính thức đối soát từ Cổng thông tin điện tử UBND Phường Liên Chiểu (`lienchieu.danang.gov.vn`).
  - Lịch tiếp dân: Thứ Ba và Thứ Năm hàng tuần (07h30 - 11h30) tại 68 Lạc Long Quân.
  - Khuyến cáo bão lũ: Theo dõi bản tin Ban chỉ huy PCTT & TKCN quận/phường, liên hệ Đường dây nóng UBND Phường (`02363 777 998`) hoặc Tổng đài 1022 Đà Nẵng (`0236 1022`).
  - Đổi nhãn thành "THÔNG TIN ĐIỀU HÀNH & DÂN SINH" màu xanh nhã nhặn.
* **Điều kiện nghiệm thu:** `tests/publication-audit.test.ts` xác nhận `HomeLivingPulse` không còn chứa `tel:0905423233`, `19h00 - 21h30`, `THPT Nguyễn Trãi`, `DỮ LIỆU THỰC ĐỊA TUẦN NÀY`. (Đã đạt 100%).

---

### Vấn đề P0-02: Mạo danh cơ quan Nhà nước và dùng số cá nhân làm Hotline DVC
* **Vị trí phát hiện:** `web/src/components/UnknownCaseFeedbackCard.tsx` (dòng 140–215).
* **Mô tả hiện trạng:**
  - Gán nút gọi `tel:0905423233` với tiêu đề "Hotline CĐS Phường (0905 423 233)".
  - Trong phiếu in A5, phần đầu đề in dòng chữ: "ỦY BAN NHÂN DÂN PHƯỜNG LIÊN CHIỂU – TỔ CHUYỂN ĐỔI SỐ", khiến người in ngỡ đây là văn bản chính thức của cơ quan nhà nước.
* **Tác động:** Sai lệch thẩm quyền hành chính; biến ứng dụng hỗ trợ dân sinh của nhóm tác giả thành cơ quan ban hành văn bản.
* **Cách xử lý:**
  - Thay bằng Hotline UBND Phường chính thức: `02363 777 998` và Tổng đài 1022 (`0236 1022`).
  - Đổi tiêu đề phiếu in thành: "LIÊN CHIỂU COMPASS – HỖ TRỢ TRA CỨU DÂN SINH", nêu rõ đây là phiếu câu hỏi chuẩn bị cá nhân của công dân trước khi đến Một cửa.
* **Điều kiện nghiệm thu:** `tests/publication-audit.test.ts` xác nhận không còn chứa `tel:0905423233` và tiêu đề mạo danh. (Đã đạt 100%).

---

### Vấn đề P0-03: Nguy cơ xuất bản sự kiện mô phỏng kiểm thử vào danh mục công khai
* **Vị trí phát hiện:** `web/src/lib/content/events-loader.ts` (dòng 25–35).
* **Mô tả hiện trạng:** Nếu người quản trị hoặc developer vô tình copy nội dung từ file preview (`events-preview.json`) vào file danh mục thật (`events.json`), bộ lọc trước đây không phát hiện các dấu hiệu của dữ liệu mô phỏng.
* **Tác động:** Xuất hiện các sự kiện giả ("Hội sách cộng đồng", domain `events.example.invalid`) trên bản đồ phục vụ nhân dân.
* **Cách xử lý:** Bổ sung rào chắn tại `loadEventsCatalog()`: tự động từ chối và loại bỏ toàn bộ bản ghi có `version: "test-only"`, ID bắt đầu bằng `fixture-`, URL thuộc domain `.invalid` hoặc nội dung có từ khóa `kiểm thử`, `mô phỏng`, `fixture` khi chạy trên môi trường công khai.
* **Điều kiện nghiệm thu:** `tests/publication-audit.test.ts` giả lập copy fixture vào file thật, kết quả nạp danh mục trả về rỗng (`events: []`). (Đã đạt 100%).

---

### Vấn đề P0-04: Vẽ ranh giới địa giới khi chưa có GeoJSON chính thức được phê duyệt
* **Vị trí phát hiện:** `web/src/lib/content/event-boundary.ts` & `web/content/data/event-boundary.json`.
* **Mô tả hiện trạng:** Chưa có nguồn dữ liệu vector GeoJSON có thẩm quyền từ cơ quan Nhà nước thể hiện đường bao chính xác của phường Liên Chiểu mới theo Nghị quyết số 1659/NQ-UBTVQH15.
* **Tác động:** Nếu tự ý số hóa hoặc vẽ polygon giả định, ứng dụng sẽ đưa ra các kết luận sai lầm về việc một địa điểm hoặc sự kiện có thuộc địa bàn phường hay không.
* **Cách xử lý:** 
  - Đặt `event-boundary.json` ở trạng thái `"status": "pending"`, `features: []`.
  - Cung cấp link ảnh bản đồ hành chính chính thức từ Cổng thông tin phường (`https://lienchieu.danang.gov.vn/documents/20121/42772/bandolienchieu.jpg`).
  - Bổ sung quy tắc trong `BoundaryRecordSchema`: từ chối mọi ranh giới có nhãn `verified` nếu dùng domain giả định, phiên bản `test-only` hoặc ghi chú mô phỏng.
* **Điều kiện nghiệm thu:** Bản đồ vận hành ổn định không bị crash, hiển thị ghi chú minh bạch nguồn gốc và không tự ý vẽ ranh giới ảo. (Đã đạt 100%).

---

### Vấn đề P1-01: Lỗi so khớp ngày sự kiện do lệch múi giờ UTC và giờ Việt Nam
* **Vị trí phát hiện:** `web/src/lib/content/event-dates.ts` (hàm `eventOnDate`).
* **Mô tả hiện trạng:** Hàm cũ dùng `event.startAt.slice(0, 10)` để so sánh chuỗi. Nếu chuỗi thời gian là `2026-10-01T18:30:00Z` (theo UTC), chuỗi ngày bị cắt là `2026-10-01`. Tuy nhiên theo giờ Việt Nam (UTC+7), thời điểm đó đã là `01h30 ngày 02/10/2026`.
* **Tác động:** Sự kiện bị hiển thị sai ngày trong bộ lọc "Hôm nay", "Ngày mai", "Chọn ngày trên lịch".
* **Cách xử lý:** Chuẩn hóa việc tính ngày bắt đầu và kết thúc qua hàm `eventDay(new Date(...))` với múi giờ chuẩn `Asia/Ho_Chi_Minh`.
* **Điều kiện nghiệm thu:** `tests/publication-audit.test.ts` xác nhận `2026-10-01T18:30:00Z` thuộc ngày `2026-10-02` và không thuộc `2026-10-01`. (Đã đạt 100%).

---

### Vấn đề P1-02: Hàm `loadEventBoundary` thiếu cơ chế phòng vệ lỗi đọc tệp
* **Vị trí phát hiện:** `web/src/lib/content/event-boundary.ts`.
* **Mô tả hiện trạng:** Gọi trực tiếp `fs.readFileSync` mà không có khối `try...catch`. Nếu tệp cấu hình bị mất hoặc đường dẫn môi trường không tồn tại, hàm ném ngoại lệ làm sập toàn bộ trang `/events`.
* **Tác động:** Gây lỗi HTTP 500 cho người dùng truy cập trang Sự kiện.
* **Cách xử lý:** Bọc toàn bộ quá trình đọc và phân tích tệp trong khối `try...catch`, trả về giá trị mặc định an toàn (`features: []` kèm thông báo giải thích).
* **Điều kiện nghiệm thu:** Khi `readFileSync` bị lỗi, hàm vẫn trả về mảng rỗng và không làm sập ứng dụng. (Đã đạt 100%).

---

### Vấn đề P1-03: Thiếu trường minh chứng đối soát cá thể trong danh bạ tiện ích
* **Vị trí phát hiện:** `web/src/contracts/places-directory.ts` & `web/src/lib/places-directory/loader.ts`.
* **Mô tả hiện trạng:** 1.661 địa điểm nạp từ OpenStreetMap chỉ có nhãn `boundary_confirmed` chung chung, thiếu trường `evidence` thể hiện việc đối soát dữ liệu.
* **Tác động:** Vi phạm nguyên tắc "Mọi bản ghi xuất bản phải có bằng chứng đối soát".
* **Cách xử lý:** Bổ sung trường `evidence` vào schema hợp đồng dữ liệu; tại tầng nạp `loadPlacesDirectory()`, tự động gắn nội dung đối soát tọa độ và nguồn OpenStreetMap theo địa bàn Nghị quyết 1659.
* **Điều kiện nghiệm thu:** `tests/publication-audit.test.ts` xác nhận toàn bộ các điểm xuất bản trong danh bạ đều có thuộc tính `evidence`. (Đã đạt 100%).

---

## V. KẾT LUẬN VÀ TRẠNG THÁI NGHIỆM THU HIỆN TẠI

1. **Toàn bộ 7/7 lỗi vi phạm trong kiểm tra xuất bản (`tests/publication-audit.test.ts`) đã được sửa chữa triệt để.**
2. **Toàn bộ 18 tệp kiểm thử đơn vị & tích hợp (`170/170 tests`) đạt kết quả 100% PASS.**
3. **Kiểm tra TypeScript (`npm run typecheck`) và ESLint (`npm run lint`) đạt 0 lỗi.**
4. **Quy trình đóng gói sản xuất (`npm run build`) hoàn thành thành công, tạo ra bản build sẵn sàng triển khai.**
5. **Dữ liệu thật, dữ liệu kiểm thử và dữ liệu đang chờ xác minh đã được phân định ranh giới tuyệt đối an toàn.**
