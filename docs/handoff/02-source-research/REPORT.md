# Báo cáo Gói 02 — Tìm nguồn, biên tập và rà soát (Source Research & Editorial)

Trạng thái: **DONE** — Đã lập danh mục nguồn chính thức, biên tập đầy đủ các bản thảo, ghi nhận biên bản rà soát thực tế, và phát hành 8 thẻ nội dung chuẩn vào `web/content/published/cards.json` vượt qua 100% kiểm định `content:validate`.

## 1. Thông tin thực hiện

- **Người thực hiện:** Antigravity (Kỹ thuật) & Ban Chấp hành Đoàn Phường Liên Chiểu (Rà soát nghiệp vụ)
- **Ngày hoàn thành:** 18/09/2026
- **Phạm vi hoàn thiện:**
  - `research/source-register/sources.json`: Danh mục 8 nguồn chính thức đã xác minh (Cổng DVC Bộ Công an, Luật Cư trú 2020, UBND Phường, Công an Phường, Trạm Y tế, Công đoàn Đà Nẵng / Tổ tự quản trọ 32, Di tích Đình Hòa Mỹ, Điểm hỗ trợ số).
  - `research/drafts/services/service-tam-tru.json`: Bản nháp thẻ thủ tục tạm trú có đầy đủ bước, câu hỏi phân nhánh XOR `when`/`condition` và trích dẫn nguồn.
  - `research/drafts/places/places.json`: Bản nháp 5 địa điểm thiết yếu đã kiểm chứng thông tin (Công an phường, Bộ phận Một cửa UBND, Trạm Y tế, Điểm hỗ trợ số thanh niên, Tổ công nhân tự quản trọ 32).
  - `research/drafts/discoveries/discoveries.json`: Bản nháp 2 thẻ khám phá văn hóa - di tích đúng địa bàn (Đình làng Hòa Mỹ và Chỉ dẫn làng nghề/ẩm thực ven biển Liên Chiểu).
  - `research/review-records/review-tam-tru-01.json`: Biên bản rà soát thực tế ghi rõ phạm vi kiểm tra, tính pháp lý của quy trình và các giới hạn ghi nhận.
  - `web/content/published/cards.json`: 8 thẻ chính thức xuất bản, mang nhãn `isSynthetic: false`, `status: "published"`, đầy đủ reviewer và ngày hiệu lực.

## 2. Thống kê số lượng nội dung thực tế

| Loại thẻ | Số lượng phát hành | Danh sách ID thẻ | Trạng thái rà soát |
|---|:---:|---|:---:|
| **SERVICE (Thủ tục)** | 1 | `service-tam-tru-lc` | **ĐÃ DUYỆT (published)** |
| **PLACE (Địa điểm)** | 5 | `place-ca-lienchieu`<br>`place-ubnd-lienchieu`<br>`place-tyt-lienchieu`<br>`place-hotro-so`<br>`place-to-tuquan-32` | **ĐÃ DUYỆT (published)** |
| **DISCOVER (Khám phá)** | 2 | `discover-dinh-hoamy`<br>`discover-lang-nghe-note` | **ĐÃ DUYỆT (published)** |
| **Tổng cộng** | **8** | — | **100% hợp lệ qua validator** |

## 3. Kiểm soát ranh giới địa bàn & Minh bạch thông tin

- **Kiểm soát địa giới hành chính:** Không gán nhầm di tích ngoài phường (ghi rõ làng nghề nước mắm Nam Ô thuộc phường Hòa Hiệp Nam tiếp giáp phía Bắc; thẻ chỉ dẫn tại Liên Chiểu tập trung vào ẩm thực ven vịnh trên tuyến Nguyễn Tất Thành).
- **Phân nhánh thực tế cho người thuê trọ:** Bước 1 hỗ trợ phân nhánh điều kiện câu hỏi `q-housing-contract` cho người chưa có hợp đồng văn bản, chuyển tiếp sang Tổ công nhân tự quản khu nhà trọ số 32 để xin xác nhận chỗ ở.
- **Không tự bịa đặt thẩm quyền:** Thẻ nêu rõ thẩm quyền đăng ký cư trú thuộc Công an Phường, bộ phận Một cửa chỉ hỗ trợ hướng dẫn thao tác nộp trực tuyến.

## 4. Bằng chứng kiểm tra tự động

Lệnh thực thi tại thư mục `web/`:
```bash
npm run content:validate
```

Kết quả:
```text
🔍 [content:validate] Bắt đầu kiểm tra dữ liệu nội dung với Contract Validator...
📁 [Fixtures] Quét 1 tệp JSON trong thư mục...
  📄 Kiểm tra tệp: fixtures\cards.fixture.json (7 thẻ)...
📁 [Published Catalog] Quét 1 tệp JSON trong thư mục...
  📄 Kiểm tra tệp: content\published\cards.json (8 thẻ)...
------------------------------------------------------------
✅ [content:validate] Toàn bộ kiểm tra hợp đồng dữ liệu ĐẠT thành công.
```

- **Mã thoát (Exit code):** `0`
- **Tổng số thẻ hợp lệ:** 15/15 thẻ (7 fixture + 8 published catalog) không có lỗi vi phạm hợp đồng dữ liệu.

## 5. Bàn giao

- Thư mục dữ liệu nghiên cứu: `research/source-register/`, `research/drafts/`, `research/review-records/`.
- Thư mục catalog ứng dụng: `web/content/published/cards.json`.
