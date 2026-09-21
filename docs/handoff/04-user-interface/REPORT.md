# Báo cáo Gói 04 — Giao diện người dùng Mobile-First Responsive

Trạng thái: **IN_PROGRESS / REVIEW** — Phân rã Gói 04 thành **04A / 04B / 04C** theo 3 ảnh chuẩn tham chiếu mỹ thuật (`image.png`, `ab73d6c7...png`, `caa7ccb9...png`). Giai đoạn **04A** (Trang Người dân theo `image.png` trên cả Mobile và Desktop) đã hoàn thành xuất sắc và sẵn sàng cho người dùng duyệt phong cách thị giác trước khi áp dụng cho 04B và 04C.

---

## 1. Thông tin thực hiện & Lộ trình phân rã

- **Người thực hiện:** Antigravity (Chủ trì kỹ thuật)
- **Ngày cập nhật:** 18/09/2026
- **Căn cứ thiết kế:** 
  - Ảnh chuẩn tham chiếu mỹ thuật và bố cục: [image.png](file:///H:/LC/design/references/originals/image.png) (Trang Người dân), [ab73d6c7...png](file:///H:/LC/design/references/originals/ab73d6c7-586d-4a59-88f7-1ab645444802.png) (Trang Người mới đến), [caa7ccb9...png](file:///H:/LC/design/references/originals/caa7ccb9-16de-4320-a106-e7dd0f4ac1af.png) (Trang Khám phá).
  - Yêu cầu người dùng: Bám nền trắng–xanh, banner phong cảnh, thẻ bo góc, icon màu, sidebar desktop và điều hướng dưới trên mobile. Mobile-first, responsive theo %. Giữ phạm vi MVP hiện tại, giữ tên LC Compass trước mắt.
- **Phân kỳ Gói 04:**
  - **Gói 04A (Hiện tại - Đã xong):** Dựng trang Người dân (`/services`) theo `image.png` ở mobile và desktop để người dùng duyệt phong cách.
  - **Gói 04B (Kế tiếp sau duyệt):** Áp dụng phong cách cho Người mới đến (`/places` theo ảnh thứ hai).
  - **Gói 04C (Tổng kết):** Áp dụng phong cách cho Khám phá di sản (`/discover` theo ảnh thứ ba) và nghiệm thu toàn diện Gói 04.

---

## 2. Các thành phần & Modules đã phát triển trong Gói 04A

### 2.1. Khung cấu trúc tổng thể (App Shell)
- `SidebarDesktop.tsx`: Cột điều hướng bên trái cố định cho màn hình lớn ($\ge 1024\text{px}$), bao gồm:
  - Logo thương hiệu LC Compass (biểu tượng thuyền buồm và mặt trời trên vịnh Đà Nẵng).
  - Menu điều hướng dọc với huy hiệu phân loại lối vào (Trang chủ, Dịch vụ & Thủ tục [Active], Địa điểm thiết yếu, Khám phá di sản, Trợ lý La bàn, Phản ánh kiến nghị 1022).
  - Thẻ chân trang đồ họa phong cảnh *"Vì một Liên Chiểu văn minh, hiện đại, nghĩa tình"*.
- `DesktopTopBar.tsx`: Thanh công cụ phía trên cho desktop với ô tìm kiếm nhanh hỗ trợ phím tắt `⌘K`, nút gọi hotline DVC 1022, chuông thông báo và thông tin người dùng.
- `BottomNavMobile.tsx`: Thanh điều hướng chân trang cố định cho thiết bị di động ($< 1024\text{px}$) gồm 4 tab (Trang chủ, Thủ tục, Địa điểm, Khám phá), có vùng đệm an toàn `env(safe-area-inset-bottom)` không che khuất nội dung.
- `AppShell.tsx`: Hợp nhất hiển thị linh hoạt giữa desktop và mobile, đảm bảo vùng nội dung chính có padding đáy thích ứng.

### 2.2. Trang "Nhu cầu 1 — Người dân" (`/services`) theo chuẩn `image.png`
- `ScenicBanner.tsx`: Dải banner phong cảnh vịnh biển và núi Hải Vân Liên Chiểu với câu trích dẫn *"Liên Chiểu: Nơi con người, thiên nhiên và cơ hội cùng vươn xa"*, lời chào *"Xin chào! Bạn cần tìm thông tin gì về Liên Chiểu?"*, và ô tìm kiếm lớn với nút submit xanh nổi bật.
- **Hàng 4 phím tắt nhanh (Quick Action Chips):**
  - [Tím] 📋 Dịch vụ công trực tuyến (Liên kết Cổng BCA).
  - [Xanh dương] 📝 Thủ tục chi tiết (Cuộn nhanh đến các bước và phiếu).
  - [Teal] 📍 Địa điểm gần bạn (Chuyển nhanh đến danh mục địa điểm).
  - [Cam] 🧭 Hỏi La bàn AI (Khu vực tư vấn định tuyến hoàn cảnh).
- **Lưới 2 cột Desktop / 1 cột Mobile:**
  - **Cột chính (66% chiều rộng):**
    - Thẻ thủ tục "Hướng dẫn chuẩn bị hồ sơ đăng ký tạm trú tại phường Liên Chiểu" (`service-tam-tru-lc`), badge "✓ Thông tin chính thống".
    - Khối lựa chọn hoàn cảnh thực tế (phân nhánh điều kiện động): Khi người dùng chọn *"Chưa có hợp đồng văn bản (đang ở trọ/ở nhờ)"*, Bước bổ trợ xin xác nhận từ Tổ tự quản 32/Chủ trọ lập tức xuất hiện trong quy trình.
    - Danh sách các bước 1-2-3-4 đánh số màu nổi bật theo chuẩn `image.png`.
    - Phiếu chuẩn bị hành trang mang theo (`PreparationSlip`): Checkbox từng đầu mục giấy tờ, nút In phiếu, nút Lưu phiếu vào localStorage kèm banner phát hiện ngoại tuyến (offline).
    - Trợ lý La bàn (Navigation Engine): Tư vấn theo đối tượng (Tự làm, Công nhân ca kíp, Làm hộ, Khẩn cấp).
  - **Cột phụ bên phải (34% chiều rộng):**
    - Thẻ *Địa điểm thực hiện*: Trụ sở Công an Phường Liên Chiểu, bản đồ vector mini (`/minimap.svg`), địa chỉ, giờ tiếp công dân, số hotline Tổng đài 1022, nút chỉ đường.
    - Thẻ *Nguồn tham khảo chính thống*: Cổng DVC Bộ Công an, Cổng TTĐT Liên Chiểu, Luật Cư trú 2020, Tổ công nhân tự quản 32.
    - Thẻ *Bạn cần hỗ trợ thêm?*: Nút kích hoạt Trợ lý La bàn và gọi Tổng đài 1022.
- `PillarsFooter.tsx`: Dải 3 trụ cột cam kết *"Thông tin chính thống (Từ cơ quan nhà nước)"*, *"Dễ hiểu, dễ thực hiện (Hướng dẫn từng bước)"*, *"Gần dân, vì người dân (Đồng hành cùng cộng đồng thuê trọ)"* kèm khẩu hiệu *"Một chạm Liên Chiểu"*.

---

## 3. Kết quả Kiểm chứng Kỹ thuật & Bằng chứng

| Lệnh thực thi | Mục đích kiểm tra | Kết quả | Chi tiết / Bằng chứng |
|---|---|:---:|---|
| `npm run typecheck` | Kiểm tra tính nhất quán TypeScript | **PASS** | `tsc --noEmit` đạt 0 lỗi. |
| `npm run lint` | Kiểm tra định dạng mã nguồn ESLint | **PASS** | `eslint .` đạt 0 lỗi, 0 cảnh báo. |
| `npm run content:validate` | Thẩm định hợp đồng dữ liệu nội dung | **PASS** | 100% hợp lệ trên cả 3 catalog (Fixtures, Demo, Published). |
| `npm run test` | Kiểm thử đơn vị & Lõi điều hướng (Vitest) | **PASS** | **65/65 tests passed** trên 5 test suites (~1.7s). |
| `npm run build` | Biên dịch Production & Static Prerendering | **PASS** | 15/15 static pages prerendered thành công. |
| `npm run test:e2e` | Kiểm thử E2E đầu cuối (Playwright) | **PASS** | **12/12 tests passed** (7.4s) trên cả Mobile Chrome và Desktop Chrome. |

### Chi tiết 12 ca kiểm thử E2E Playwright:
1. `Mobile Chrome: Trang chủ tải được và hiển thị đúng 3 lối vào` — PASS (1.1s)
2. `Desktop Chrome: Trang chủ tải được và hiển thị đúng 3 lối vào` — PASS (984ms)
3. `Mobile Chrome: Tìm kiếm tiếng Việt không dấu trên trang chủ lọc chính xác` — PASS (1.2s)
4. `Desktop Chrome: Tìm kiếm tiếng Việt không dấu trên trang chủ lọc chính xác` — PASS (708ms)
5. `Mobile Chrome: Hiển thị responsive không tràn ngang ở 320px` — PASS (1.2s)
6. `Desktop Chrome: Hiển thị responsive không tràn ngang ở 320px` — PASS (498ms)
7. `Mobile Chrome: Hành trình tương tác (Trang chủ -> Lối vào 1 -> Thẻ tạm trú -> Phân nhánh câu hỏi -> Phiếu chuẩn bị)` — PASS (2.9s)
8. `Desktop Chrome: Hành trình tương tác (Trang chủ -> Lối vào 1 -> Thẻ tạm trú -> Phân nhánh câu hỏi -> Phiếu chuẩn bị)` — PASS (2.7s)
9. `Mobile Chrome: Gói 04A: Kiểm tra cấu trúc trang Người dân (/services) theo chuẩn image.png` — PASS (1.3s)
10. `Desktop Chrome: Gói 04A: Kiểm tra cấu trúc trang Người dân (/services) theo chuẩn image.png` — PASS (815ms)
11. `Mobile Chrome: Gói 04A: Kiểm tra AppShell - Sidebar Desktop và Bottom Nav Mobile hiển thị theo kích thước màn hình` — PASS (1.1s)
12. `Desktop Chrome: Gói 04A: Kiểm tra AppShell - Sidebar Desktop và Bottom Nav Mobile hiển thị theo kích thước màn hình` — PASS (751ms)

---

## 4. Bằng chứng Hình ảnh Nghiệm thu Trực quan (Screenshots)

Các ảnh chụp màn hình thực tế được ghi lại tại thư mục [web/tests/screenshots](file:///H:/LC/web/tests/screenshots/):
1. **Desktop Toàn cảnh (1440x900):** [desktop-services-full.png](file:///H:/LC/web/tests/screenshots/desktop-services-full.png)
2. **Desktop sau khi bấm Phân nhánh điều kiện (Hiển thị Bước bổ trợ Tổ 32):** [desktop-services-branched.png](file:///H:/LC/web/tests/screenshots/desktop-services-branched.png)
3. **Mobile Khung nhìn chuẩn (375x812 - iPhone):** [mobile-services-viewport.png](file:///H:/LC/web/tests/screenshots/mobile-services-viewport.png)
4. **Mobile Toàn cảnh cuộn trang:** [mobile-services-full.png](file:///H:/LC/web/tests/screenshots/mobile-services-full.png)
