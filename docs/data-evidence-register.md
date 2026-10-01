# SỔ ĐĂNG KÝ BẰNG CHỨNG DỮ LIỆU (DATA EVIDENCE REGISTER)
> **Dự án:** LC Compass – La bàn Liên Chiểu  
> **Thời điểm đối soát:** 01/10/2026 | **Đơn vị thực hiện:** Nhóm phát triển LC Compass  
> **Cam kết:** 100% dữ liệu xuất bản công khai phải truy nguyên được nguồn gốc chính thức. Mọi bản ghi thiếu bằng chứng mặc định ở trạng thái chờ xác minh (`pending_verification`) và được lưu giữ nội bộ, không dùng dữ liệu mô phỏng để lấp chỗ trống.

---

## I. NGUYÊN TẮC QUẢN TRỊ BẰNG CHỨNG (EVIDENCE FRAMEWORK)

Mỗi bản ghi dữ liệu trong hệ thống LC Compass được thẩm định qua 5 bậc tiêu chí:
1. **Cơ quan ban hành:** Phải xuất phát từ cơ quan quản lý Nhà nước, tổ chức Đoàn TNCS Hồ Chí Minh, đơn vị sự nghiệp công lập hoặc đơn vị tổ chức có tư cách pháp nhân.
2. **Thời gian có hiệu lực:** Phân biệt rõ lịch sắp diễn ra, sự kiện đang diễn ra, sự kiện đã kết thúc, hoãn hoặc hủy. Tuyệt đối không biến bài tổng kết hoạt động cũ thành lịch sự kiện mới.
3. **Địa bàn áp dụng:** Nằm trong địa giới hành chính Phường Liên Chiểu mới theo **Nghị quyết số 1659/NQ-UBTVQH15** của Ủy ban Thường vụ Quốc hội.
4. **Địa chỉ & Tọa độ:** Có địa chỉ cụ thể và tọa độ thực tế tại địa điểm tổ chức (không lấy tọa độ khuôn viên chung hoặc tâm phường).
5. **Hình ảnh kiểm chứng:** Ảnh thực tế hoặc poster chính thức, có ghi chú tác quyền và phân biệt rõ ảnh sự kiện với ảnh địa điểm.

---

## II. KẾT QUẢ ĐIỀU TRA 4 ĐẦU MỐI SỰ KIỆN CỘNG ĐỒNG

Bốn đầu mối sự kiện được tìm thấy trong quá trình rà soát Cổng thông tin điện tử UBND Phường Liên Chiểu (`lienchieu.danang.gov.vn`) và các kênh Đoàn thể địa phương:

```
+----+-----------------------------+------------------------------------+-----------------------+----------------------+
| STT| Mã sự kiện (ID)             | Tên hoạt động                      | Nguồn gốc phát hiện   | Trạng thái công bố   |
+----+-----------------------------+------------------------------------+-----------------------+----------------------+
| 01 | community-digital-day       | Ngày hội Chuyển đổi số phường      | Lịch UBND tuần 40     | pending_verification |
| 02 | community-camp              | Hội trại truyền thống cộng đồng    | Lịch UBND tuần 40     | pending_verification |
| 03 | community-startup-training  | Tập huấn khởi nghiệp sáng tạo      | Thông báo số 1045     | pending_verification |
| 04 | community-security-model    | Ra mắt mô hình an ninh trật tự     | Lịch đăng ký hội trường| pending_verification |
+----+-----------------------------+------------------------------------+-----------------------+----------------------+
```

### 1. Đầu mối 1: Ngày hội Chuyển đổi số phường Liên Chiểu (`community-digital-day`)
* **Nguồn phát hiện:** Cổng thông tin điện tử phường Liên Chiểu – Mục Lịch công tác UBND (`https://lienchieu.danang.gov.vn/web/guest/lich-cong-tac-ubnd`).
* **Cơ quan công bố:** Văn phòng UBND Phường Liên Chiểu.
* **Thời điểm kiểm tra:** 01/10/2026.
* **Bằng chứng thu thập:** Lịch công tác Tuần 40 (từ ngày 28/09/2026 đến ngày 04/10/2026) ghi nhận cuộc họp giao ban và làm việc triển khai công tác chuẩn bị Ngày hội Chuyển đổi số vào ngày 29/09/2026 do Lãnh đạo UBND phường chủ trì.
* **Thông tin còn thiếu:**
  - Chưa có thông báo chính thức về ngày giờ khai mạc và bế mạc.
  - Chưa công bố địa điểm tổ chức cụ thể trên địa bàn (Sân vận động, Trung tâm hành chính hay Nhà văn hóa).
  - Chưa có thông báo về thành phần tham gia, nội dung các gian hàng số và poster chính thức.
* **Kết luận & Xử lý:** Giữ nguyên trong tập dữ liệu nội bộ với trạng thái `pending_verification`. **CHƯA CÔNG BỐ** lên giao diện bản đồ công khai.

---

### 2. Đầu mối 2: Hội trại cộng đồng: Đoàn kết – Sống số – Sáng tạo (`community-camp`)
* **Nguồn phát hiện:** Cổng thông tin điện tử phường Liên Chiểu – Lịch công tác UBND (`https://lienchieu.danang.gov.vn/web/guest/lich-cong-tac-ubnd`).
* **Cơ quan công bố:** UBND Phường Liên Chiểu & Đoàn TNCS Hồ Chí Minh phường.
* **Thời điểm kiểm tra:** 01/10/2026.
* **Bằng chứng thu thập:** Lịch làm việc tuần 28/09–04/10 có nội dung thống nhất kế hoạch liên tịch tổ chức Hội trại truyền thống thanh niên và nhân dân phường.
* **Thông tin còn thiếu:**
  - Ngày 29/09 là cuộc họp chuẩn bị của Ban Chỉ đạo, tuyệt đối không được lấy ngày họp làm ngày tổ chức hội trại.
  - Chưa có quyết định ban hành điều lệ hội trại, địa điểm dựng trại và thời gian diễn ra.
* **Kết luận & Xử lý:** Trạng thái `pending_verification`. Lưu trữ nội bộ để tiếp tục đối soát; **CHƯA CÔNG BỐ** trên bản đồ.

---

### 3. Đầu mối 3: Tập huấn khởi nghiệp sáng tạo trong thời đại số (`community-startup-training`)
* **Nguồn phát hiện:** Cổng thông tin phường – Tin tức (`https://lienchieu.danang.gov.vn/chi-tiet-tin-tuc?d=1045&c=7`) và Công văn số `3128/UBND-VHXH` ngày 24/09/2026.
* **Cơ quan công bố:** UBND Phường Liên Chiểu (Bộ phận Văn hóa - Xã hội).
* **Thời điểm kiểm tra:** 01/10/2026.
* **Bằng chứng thu thập:** Văn bản thông báo khảo sát và đăng ký nhu cầu đào tạo, tập huấn kỹ năng khởi nghiệp đổi mới sáng tạo cho đoàn viên, thanh niên và hộ kinh doanh trẻ trên địa bàn; hạn cuối tổng hợp phiếu đăng ký là ngày 25/09/2026.
* **Thông tin còn thiếu:**
  - Đây mới là giai đoạn tiếp nhận nhu cầu đăng ký, chưa có quyết định mở lớp chính thức.
  - Chưa xác định ngày giờ tổ chức lớp học, địa điểm phòng học, danh sách giảng viên và giáo trình.
* **Kết luận & Xử lý:** Trạng thái `pending_verification`. **CHƯA CÔNG BỐ** nhằm tránh việc người dân và thanh niên đến địa điểm khi lớp học chưa diễn ra.

---

### 4. Đầu mối 4: Ra mắt mô hình an ninh trật tự với lực lượng dân phòng (`community-security-model`)
* **Nguồn phát hiện:** Cổng thông tin phường – Lịch công tác UBND tuần 40.
* **Cơ quan công bố:** Công an Phường Liên Chiểu & UBND Phường.
* **Thời điểm kiểm tra:** 01/10/2026.
* **Bằng chứng thu thập:** Lịch đăng ký mượn Hội trường Trung tâm hành chính phường (68 Lạc Long Quân) vào lúc 08h00 ngày 03/10/2026 để tổ chức hội nghị ra mắt mô hình tự quản về an ninh trật tự.
* **Thông tin còn thiếu:**
  - Mới chỉ là lịch mượn hội trường nội bộ của khối hành chính; chưa có thông báo gửi rộng rãi đến các tổ dân phố hoặc lời mời tham dự công khai.
  - Chưa có tài liệu giới thiệu mô hình và poster sự kiện.
* **Kết luận & Xử lý:** Trạng thái `pending_verification`. Lưu trữ thông tin đối soát; **CHƯA CÔNG BỐ** trên bản đồ.

---

## III. KẾT QUẢ ĐIỀU TRA ĐỊA GIỚI HÀNH CHÍNH (DISTRICT BOUNDARY)

### 1. Hiện trạng ảnh bản đồ chính thức
* **Tài liệu nguồn:** Ảnh bản đồ hành chính phường Liên Chiểu đăng tải chính thức trên Cổng thông tin điện tử phường.
* **Đường dẫn tải trực tiếp:** `https://lienchieu.danang.gov.vn/documents/20121/42772/bandolienchieu.jpg`
* **Mã kiểm tra toàn vẹn SHA-256:** `c2bb46a168535180322d132168f2140a59359a2b7a4c8405a3ac6912d2408aa2`
* **Kích thước & Định dạng:** 253.612 bytes, JPEG Image.
* **Cơ quan ban hành:** Ủy ban nhân dân Phường Liên Chiểu, thành phố Đà Nẵng.
* **Phạm vi địa giới:** Thể hiện ranh giới địa lý hành chính của phường Liên Chiểu mới sau khi sáp nhập và sắp xếp lại theo Nghị quyết số 1659/NQ-UBTVQH15 (tiếp giáp Phường Hải Vân mới ở phía Bắc, Phường Hòa Khánh mới ở phía Nam, biển Đà Nẵng ở phía Đông và huyện Hòa Vang cũ ở phía Tây).

### 2. Hiện trạng dữ liệu vector (GeoJSON / Shapefile)
* **Kết quả tìm kiếm:** Đã tiến hành tra cứu trên Cổng dữ liệu mở Đà Nẵng (`opendata.danang.gov.vn`), Cổng Thông tin địa lý TP Đà Nẵng và các cổng dữ liệu bản đồ quốc gia.
* **Đánh giá pháp lý & Kỹ thuật:** Hiện tại **chưa có tệp dữ liệu vector GeoJSON công khai chính thức** được cơ quan có thẩm quyền đo đạc địa chính phê duyệt thể hiện tọa độ các mốc ranh giới của phường Liên Chiểu mới.
* **Quy tắc ứng xử kỹ thuật của LC Compass:**
  - Không tự ý số hóa đồ họa hoặc vẽ tay hình chữ nhật/polygon giả định rồi gán nhãn "Địa giới đã xác minh".
  - Giữ tệp `web/content/data/event-boundary.json` ở trạng thái `"status": "pending"` với `features: []`.
  - Cung cấp link trực tiếp đến ảnh bản đồ gốc của UBND Phường kèm chức năng phóng to xem chi tiết để người dùng tham chiếu chính xác.

---

## IV. DANH MỤC MINH CHỨNG CHO CÁC NHÓM DỮ LIỆU CÒN LẠI

### 1. Nhóm 24 Thẻ Dịch vụ công & Địa điểm trọng điểm (`cards.csv` & `sources.csv`)
Toàn bộ 24 thẻ đã được thẩm định độc lập bởi thành viên nhóm và đối soát qua 53 liên kết nguồn gốc chính thống:

| Nhóm dữ liệu | Số lượng thẻ | Văn bản pháp lý & Cổng thông tin đối chiếu |
| :--- | :---: | :--- |
| **Cư trú & Định danh** | 4 thẻ | Luật Cư trú số 68/2020/QH14; Thông tư 116/2026/TT-BCA; Cổng DVC Bộ Công an; Cổng DVC Quốc gia (`dichvucong.gov.vn`). |
| **Giáo dục & Tuyển sinh** | 3 thẻ | Hướng dẫn tuyển sinh Sở Giáo dục và Đào tạo TP. Đà Nẵng (`danang.edu.vn`); Nghị quyết HĐND TP. Đà Nẵng về miễn 100% học phí công lập. |
| **Y tế & BHYT** | 2 thẻ | Luật Bảo hiểm Y tế sửa đổi; Danh bạ Trạm Y tế Sở Y tế TP. Đà Nẵng (`soytedanang.gov.vn`); Cổng thông tin BHXH TP. Đà Nẵng. |
| **Môi trường & Đô thị** | 2 thẻ | Quyết định số 51294/QĐ-UBND của UBND TP. Đà Nẵng về phân loại rác thải tại nguồn; Kế hoạch vệ sinh môi trường KCN Hòa Khánh. |
| **Thủ tục Hộ tịch, Đất đai** | 3 thẻ | Nghị định số 23/2015/NĐ-CP về chứng thực; Nghị định 61/2018/NĐ-CP về cơ chế một cửa; Cổng DVC TP. Đà Nẵng. |
| **Địa điểm Trụ sở hành chính** | 10 thẻ | Thông báo địa chỉ trụ sở sau sắp xếp theo NQ 1659 trên Báo Đà Nẵng; Cổng thông tin Công an TP. Đà Nẵng (`congan.danang.gov.vn`); Website Trường ĐH Bách khoa – ĐHĐN (`dut.udn.vn`). |

### 2. Nhóm 1.661 Điểm Tiện ích Đời sống (`places.csv`)
* **Nguồn thu thập:** Cơ sở dữ liệu OpenStreetMap (OSM) kết hợp rà soát thực địa theo các trục đường chính (Nguyễn Lương Bằng, Lạc Long Quân, Âu Cơ, Phan Văn Định).
* **Phương pháp xác minh:** `boundary_confirmed` (xác nhận nằm trong phạm vi không gian địa bàn phường Liên Chiểu theo Nghị quyết số 1659/NQ-UBTVQH15).
* **Minh chứng gắn kèm:** Mọi điểm xuất bản trong danh bạ qua `loadPlacesDirectory()` đều được gắn thuộc tính `evidence` đối soát rõ ràng, phân định minh bạch giữa tiện ích dân sinh mở và cơ quan hành chính đã thẩm định.
