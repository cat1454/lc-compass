# ĐOÀN TNCS HỒ CHÍ MINH THÀNH PHỐ ĐÀ NẴNG
### BAN CHẤP HÀNH ĐOÀN PHƯỜNG LIÊN CHIỂU
***

# HỒ SƠ MINH CHỨNG SẢN PHẨM MINH HỌA (PROTOTYPE)
## VÀ HƯỚNG DẪN TRẢI NGHIỆM ĐỐI CHỨNG DÀNH CHO BAN GIÁM KHẢO
### Dự án: **LC COMPASS – LA BÀN LIÊN CHIỂU**
### Slogan: *"Đúng nguồn – Rõ nơi – Biết bước tiếp theo"*

---

> **Mục tiêu tài liệu:**  
> Minh chứng rõ ràng cơ chế hoạt động thực tế của sản phẩm thử nghiệm (Prototype), phân định minh bạch giữa những gì đã được thẩm định và những gì đang ở mức mô phỏng kỹ thuật, giúp Ban Giám khảo trực tiếp đánh giá tính khả thi tại bàn chấm thi.

---

## 1. THÔNG TIN TRUY CẬP VÀ MÃ QR TRẢI NGHIỆM

- **Địa chỉ truy cập Internet (Production Live):**  
  **[https://lc-compass-xi.vercel.app](https://lc-compass-xi.vercel.app)**
- **Môi trường hoạt động:** Ứng dụng Web di động (Mobile-First), tương thích tốt trên các trình duyệt Safari (iOS), Chrome (Android) và máy tính để bàn.
- **Cách thức mở:** Quét mã QR hoặc truy cập đường dẫn trực tiếp, **không cần cài đặt ứng dụng từ kho tải, không yêu cầu tạo tài khoản cá nhân**.

```
       ┌──────────────────────────────────────────────────────────┐
       │                   MÃ QR TRUY CẬP TRỰC TIẾP               │
       │                                                          │
       │        Truy cập: https://lc-compass-xi.vercel.app        │
       │                                                          │
       │          [  █▀▀▀▀▀█  ▄▄▀█▄█▀█  █▀▀▀▀▀█  ]                │
       │          [  █ ███ █  ▄▀▄▀▄▀▄▀  █ ███ █  ]                │
       │          [  █ ▀▀▀ █  █▄▀█▀▄█▀  █ ▀▀▀ █  ]                │
       │          [  ▀▀▀▀▀▀▀  █ █ █ █ █  ▀▀▀▀▀▀▀  ]                │
       │          [  ▀▀█▄▄▄▀▀ ▄▄▀█▄█▀█ ▀▀█▄▄▄▀▀  ]                │
       │          [  █▀▀▀▀▀█  ▄▀▄▀▄▀▄▀  █▀▀▀▀▀█  ]                │
       │          [  █ ███ █  █▄▀█▀▄█▀  █ ███ █  ]                │
       │          [  █ ▀▀▀ █  █ █ █ █ █  █ ▀▀▀ █  ]                │
       │          [  ▀▀▀▀▀▀▀  ▀▀ ▀▀▀ ▀▀  ▀▀▀▀▀▀▀  ]                │
       │                                                          │
       │      (Sử dụng camera điện thoại để quét mã mở ngay)      │
       └──────────────────────────────────────────────────────────┘
```

---

## 2. BA TÁC VỤ TRẢI NGHIỆM THỰC TẾ DÀNH CHO BAN GIÁM KHẢO

Nhóm đề xuất 3 tác vụ cụ thể để Ban Giám khảo kiểm chứng cách hệ thống vận hành:

### Tác vụ 1: Tra cứu chuẩn bị thủ tục tạm trú với cách diễn đạt đời thường
* **Cách thử:** Trên thanh tìm kiếm, nhập câu hỏi tự nhiên hoặc tiếng địa phương:  
  *Ví dụ 1:* `"làm tạm trú không có hợp đồng thuê nhà"`  
  *Ví dụ 2:* `"mần tạm trú ở mô"` (tiếng Nghệ Tĩnh / Xứ Quảng)  
  *Ví dụ 3:* Bấm nút Micro và đọc câu hỏi tự nhiên.
* **Kết quả kiểm chứng:**
  - Hệ thống nhận diện ý định và chuẩn hóa từ ngữ địa phương.
  - Hiển thị Thẻ hướng dẫn: Nêu rõ các bước cần chuẩn bị, căn cứ pháp lý (Điều 5 Nghị định 62/2021/NĐ-CP về văn bản cam đoan khi không có hợp đồng thuê nhà bằng văn bản).
  - Có nút **"Nghe đọc các bước"** (Text-to-Speech): Đọc to tiêu đề và từng bước chuẩn bị bằng giọng đọc tiếng Việt với tốc độ chậm rãi, phục vụ người lớn tuổi hoặc người mắt yếu.
  - Có nút **"In phiếu hướng dẫn A5"**: Mở giao diện phiếu in tóm tắt nội dung có ô vuông $\square$ để người dân tự đánh dấu hoặc mang theo.

### Tác vụ 2: Tra cứu địa điểm hành chính sau sáp nhập Nghị quyết 1659
* **Cách thử:** Tìm kiếm `"UBND phường"` hoặc `"Công an phường"`.
* **Kết quả kiểm chứng:**
  - Định tuyến chính xác đến địa chỉ hiện hành: UBND Phường tại **68 Lạc Long Quân**, Công an Phường tại **66 Lạc Long Quân**.
  - Cảnh báo rõ ràng các địa danh đã chuyển địa giới (ví dụ: Làng Nam Ô sang Phường Hải Vân mới; KTX Phía Tây sang Phường Hòa Khánh mới) để người dân không bị nhầm lẫn.
  - Thẻ hiển thị ngày rà soát thông tin và liên kết mở bản đồ chỉ đường.

### Tác vụ 3: Thử nghiệm cơ chế an toàn khi thông tin chưa rõ (Fail-Closed)
* **Cách thử:** Nhập một câu hỏi ngoài phạm vi dữ liệu hoặc thủ tục chưa được rà soát (ví dụ: một câu hỏi ngẫu nhiên không có trong danh mục).
* **Kết quả kiểm chứng:**
  - Hệ thống **không tự sáng tác câu trả lời** (tránh ảo giác AI).
  - Hiển thị rõ thông báo: Chưa có dữ liệu chính thức được kiểm chứng.
  - Cung cấp nút liên hệ Tổng đài 1022 Đà Nẵng (`0236 1022`) và đầu mối cơ quan phường để người dân tiếp tục được hỗ trợ chính thức.

---

## 3. BÁO CÁO MINH CHỨNG KỸ THUẬT

Dự án áp dụng quy trình kiểm thử phần mềm tự động để đảm bảo tính ổn định:

| Nội dung kiểm thử | Phương pháp thực hiện | Kết quả thực tế | Ghi chú |
| :--- | :--- | :---: | :--- |
| **Kiểm thử đơn vị (Unit Tests)** | Vitest (16 tệp kiểm thử) | **152 / 152 bài đạt** | Kiểm tra logic chuẩn hóa phương ngữ, đối khớp thực thể và bảo mật PII |
| **Kiểm thử tự động đầu - cuối (E2E)** | Playwright Browser Engine | **52 / 52 kịch bản đạt** | Kiểm tra luồng người dùng trên trình duyệt di động |
| **Kiểm tra kiểu dữ liệu (TypeScript)** | `tsc --noEmit` | **0 lỗi** | Đảm bảo tính chặt chẽ của mã nguồn |
| **Kiểm tra chuẩn mã nguồn (Lint)** | ESLint Next.js | **0 cảnh báo** | Tuân thủ tiêu chuẩn lập trình hiện đại |
| **Hợp đồng dữ liệu (Schema Contracts)** | Zod Validation | **100% tệp đạt chuẩn** | Rà soát tính hợp lệ của các trường dữ liệu CSV/JSON |

---

## 4. MINH BẠCH VỀ GIỚI HẠN HIỆN TẠI CỦA SẢN PHẨM

Tuân thủ tinh thần trung thực và khoa học, nhóm nêu rõ ranh giới sản phẩm trong hồ sơ:
1. **Về dữ liệu:** Bản thử nghiệm hiện tích hợp 24 thẻ nghiệp vụ đã qua rà soát đối chiếu nguồn và 1.661 địa điểm đời sống phân loại sơ bộ. Các nội dung khác nếu phát sinh sẽ hiển thị thông báo chưa có dữ liệu chính thức.
2. **Về vai trò của AI:** AI chỉ hỗ trợ nhận diện câu hỏi đời thường; không tham gia vào việc quyết định nội dung pháp lý. Nếu tắt AI, ứng dụng vẫn hoạt động hoàn chỉnh qua các nút bấm nhu cầu.
3. **Về tính năng tương lai:** Bản hiện tại tập trung vào 3 lối vào cốt lõi; chưa xây dựng bản đồ riêng, chưa có tour tự sinh thời gian thực và không nhận nộp hồ sơ trực tuyến thay thế Cổng Dịch vụ công.
