# Báo cáo Gói 03 — Lõi điều hướng (Navigation Engine & Content Loader)

Trạng thái: **DONE** — Đã port toàn bộ mô hình quy tắc từ `design/compass/simulate.py` sang TypeScript thuần, hoàn thành bộ công cụ tìm kiếm tiếng Việt có/không dấu, xây dựng Content Loader bảo vệ fail-closed, và kiểm chứng thành công 10.000 ca kịch bản in-memory đạt 100% invariants.

## 1. Thông tin thực hiện

- **Người thực hiện:** Antigravity (Chủ trì kỹ thuật)
- **Ngày hoàn thành:** 18/09/2026
- **Modules đã xây dựng:**
  - `web/src/lib/navigation/types.ts`: Định nghĩa hệ thống kiểu dữ liệu cho 10 Domain, 10 ProfileMode, 10 StressFlag, 11 ActionType và 4 OutputType.
  - `web/src/lib/navigation/constants.ts`: Danh mục 100 mục tiêu (CATALOG), 10 profiles, 10 stresses, `ACTION_TEXT` và tập hợp 19 mục tiêu MVP.
  - `web/src/lib/navigation/decide.ts`: Hàm điều hướng quyết định `decideRoute()` theo đúng thứ tự ưu tiên: `urgent` → `sensitive` → `unknown_area` → `outside` → `supported` → `proxy_no` → `stale`/`conflict` → `offline` → `missing_fact` → `language` → `prepare`.
  - `web/src/lib/navigation/search.ts`: Chuẩn hóa tiếng Việt `removeVietnameseTones`, bộ lọc từ khóa theo trọng số (tiêu đề, loại thẻ, nội dung, phạm vi áp dụng) và gợi ý từ khóa thông minh.
  - `web/src/lib/content/loader.ts`: Hàm nạp và thẩm định danh mục thẻ (`loadRawCards`, `loadPublicCatalog`, `getPublicCardById`). Tự động bảo vệ fail-closed: loại bỏ `body`/`actions` và cảnh báo khi thẻ bị hết hạn (`expired`) hoặc bị rút (`withdrawn`) tại thời điểm truy cập `asOfDate`.
  - `web/tests/navigation.test.ts`: Bộ kiểm thử tự động toàn diện.

## 2. Kết quả kiểm chứng tự động

| Hạng mục kiểm thử | Quy mô | Kết quả | Bằng chứng thực tế |
|---|:---:|:---:|---|
| **Tích Descartes 100 × 10 × 10** | **10.000 ca** | **PASS** | Kiểm tra toàn bộ bất biến (invariants): PREPARE chỉ kích hoạt khi trong phạm vi MVP và dữ liệu sạch/AI tắt; cấm rò rỉ thông tin nhạy cảm; ưu tiên khẩn cấp tuyệt đối. |
| **AI Outage Equivalence** | **1.000 cặp** | **PASS** | 100 intents × 10 profiles cho kết quả định tuyến giống hệt nhau khi AI hoạt động (`clean`) và khi AI ngừng (`ai_down`). |
| **Phối hợp đa lỗi (Combined Faults)** | **14 ca** | **PASS** | Toàn bộ 14 trường hợp kết hợp nhiều lỗi đồng thời từ `simulate.py` đều ra đúng mã hành động kỳ vọng. |
| **Tìm kiếm tiếng Việt có/không dấu** | Đa dạng từ khóa | **PASS** | Tìm kiếm "tam tru", "cong an", "hoa my" đều trả về đúng thẻ tương ứng; hỗ trợ gợi ý từ khóa khi không khớp. |
| **Bảo vệ truy cập trực tiếp (Direct Link)** | Fail-closed | **PASS** | Truy cập thẻ quá hạn rà soát (`asOfDate` tương lai) hoặc thẻ bị rút tự động ẩn `body`/`actions` và trả về mã trạng thái cảnh báo an toàn. |

## 3. Hiệu năng & Tối ưu hóa bundle

- Toàn bộ 10.000 ca kịch bản được chạy in-memory trong Vitest chỉ mất **351ms**.
- Ứng dụng không đóng gói các tệp dữ liệu lớn (CSV/JSONL 10.000 dòng) vào bundle trình duyệt của người dùng; chỉ giữ lại các cấu trúc metadata nhỏ gọn phục vụ định tuyến.
- Không có bất kỳ phụ thuộc mạng hay gọi API bên ngoài nào trong hàm lõi.

## 4. Bàn giao

- Thư mục mã nguồn lõi: `web/src/lib/navigation/`, `web/src/lib/content/`.
- Thư mục kiểm thử: `web/tests/navigation.test.ts` (đạt 23/23 tests pass; tổng test suite đạt 57/57 tests pass).
