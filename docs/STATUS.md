# Báo cáo Trạng thái Dự án LC Compass (Cập nhật 21/09/2026)

## Gói Khắc Phục Điểm Biên Chê Hệ Thống, Đa Phương Thức & Dung Lỗi Người Lớn Tuổi (21/09/2026)

Dựa trên Báo cáo Nghiên cứu Đánh giá Đa chiều và Phân tích Các Điểm Biên Chê Hệ thống của Nền tảng "LC One – Một chạm Liên Chiểu", toàn bộ 6 tử huyệt hệ thống và các yêu cầu thực tế dân sinh đã được giải quyết triệt để trên mã nguồn:

1. **Bộ Chuẩn Hóa Phương Ngữ Xứ Quảng (`dialect-normalizer.ts`):**
   - Chuyển đổi chính xác đại từ, chỉ từ (*mô, tê, răng, rứa, chi, ni, tau, mi, qua, nẫu*) và biến âm bản địa (*nác, gộ, bòong, đóa banh*) sang tiếng Việt chuẩn với Unicode property boundary regex.
2. **Bộ Sửa Lỗi Chính Tả & Viết Tắt Người Lớn Tuổi (`typo-corrector.ts`):**
   - Xử lý ma trận nhầm âm miền Trung (*tr/ch, s/x, d/gi, hỏi/ngã*) như *tạm chú*, *chứng thựt*, *khám trữa bệnh*, *xổ hộ khẩu*.
   - Mở rộng các từ viết tắt phổ biến: *đk, tt, bhyt, cccd, ubnd, ca, dvc, kcn*.
   - Bắt lỗi gõ phím telex: *tamj trus, thu tucj, phuongwf*.
3. **Bộ Đối Khớp Thực Thể Lịch Sử NQ 1659/NQ-UBTVQH15 (`entity-resolver.ts`):**
   - Định tuyến chuẩn xác danh xưng cũ/sáp nhập (*UBND/Công an/Trạm y tế Hòa Khánh Bắc*) về trụ sở mới tại 68 & 66 Lạc Long Quân, 178 Âu Cơ.
   - Cảnh báo rõ ràng thực thể đã chuyển sang phường bạn (*Làng Nam Ô sang Phường Hải Vân mới, KTX phía Tây sang Phường Hòa Khánh mới*).
4. **Cơ Chế Phòng Chống Ảo Giác AI & Human-in-the-loop (`confidence-guard.ts`):**
   - Đánh giá điểm tin cậy; nếu < 90% hoặc thủ tục pháp lý chưa ký duyệt: *Fail-closed* dừng sinh văn bản, chuyển thẳng sang nút gọi Tổng đài 1022 hoặc tiếp nhận tại Một cửa 68 Lạc Long Quân.
5. **Bộ Lọc Bảo Mật PII Phía Client (`pii-sanitizer.ts`):**
   - Tự động phát hiện và che mờ 12 số CCCD, 10 số SĐT (`048*********`) ngay trên thiết bị người dùng.
6. **Truy Cập Đa Phương Thức (Multimodal Access):**
   - **Voice Input 🎙️:** Nút thu âm Web Speech API cho người già không quen gõ bàn phím.
   - **Text-to-Speech 🔊:** Nút đọc to từng bước hướng dẫn bằng giọng nói.
   - **Phiếu In Giấy A5 🖨️:** Xuất phiếu in khổ A5 chữ to rõ ràng cho người cao tuổi không dùng smartphone.
   - **Emergency Banner 🚨:** Báo động khẩn cấp tức thời khi có từ khóa cháy, tai nạn, cấp cứu với nút gọi 113/114/115.
   - **Zero-CAC Embeddable Mode (`/embed`):** Chế độ nhúng siêu nhẹ cho Zalo Mini App và Widget cổng thông tin.
7. **Bộ Tháo Gỡ 16 Điểm Biên Dân Sinh Thực Địa (`edge-case-resolver.ts` & `EdgeCaseGuidanceCard.tsx`):**
   - Nhận diện và tháo gỡ tự động 16 tình huống biên thực tế tại Phường Liên Chiểu:
     1. `NO_CONTRACT`: Thuê trọ không hợp đồng bằng văn bản $\to$ Bản cam đoan CT01 có ý kiến chủ trọ (Điều 5 NĐ 62/2021).
     2. `OFF_HOURS`: Công nhân làm việc theo ca ngoài giờ $\to$ Nộp trực tuyến 24/7 + Nhận kết quả VNPost tại phòng trọ + Hỗ trợ Tối thứ Bảy.
     3. `ROOMMATE_SHARING`: Sinh viên ở ghép phòng trọ đông người không đứng tên hợp đồng $\to$ Phụ lục danh sách thành viên + CT01.
     4. `DISASTER_FLOOD`: Mùa bão lũ ngập úng đường Mẹ Suốt, KCN $\to$ Kích hoạt điểm sơ tán bão kiên cố (THPT Nguyễn Trãi, THCS Nguyễn Lương Bằng, Nhà văn hóa KCN).
     5. `LOST_IDENTITY`: Mất Căn cước / Chưa có VNeID mức 2 $\to$ Dùng Giấy CT07 thay thế tạm thời + cấp lại thẻ Căn cước.
     6. `MOBILITY_SENIOR`: Người già neo đơn liệt giường $\to$ Mô hình Dịch vụ công lưu động tại nhà của Đoàn Thanh niên và Tư pháp.
     7. `FEE_WAIVER`: Miễn 100% lệ phí cư trú và học phí công lập đặc thù TP. Đà Nẵng.
     8. `WARD_ADDRESS_DRIFT`: Lệch mã Tổ dân phố sau sáp nhập NQ 1659/NQ-UBTVQH15.
     9. `OFFLINE_MODE`: Khu trọ sâu mất mạng / sóng yếu $\to$ Chế độ Offline-First cache 24 thẻ + nút in/lưu PDF A5 mang theo.
     10. `REGULATORY_LAG`: Cán bộ vẫn đòi Sổ hộ khẩu giấy cũ $\to$ Căn cứ Khoản 3 Điều 38 Luật Cư trú 2020 nghiêm cấm đòi sổ giấy.
     11. `SHARED_DEVICE`: An toàn bảo mật khi dùng máy tính quán net / Kiosk Một cửa $\to$ Tự động xóa sạch phiên làm việc, chống lộ dữ liệu.
     12. `THIRD_PARTY_PROXY`: Đi nộp thay người thân nhưng thiếu Giấy ủy quyền $\to$ Phân định thẩm quyền theo Nghị định 23/2015/NĐ-CP.
     13. `REJECTED_SUPPLEMENT`: Hồ sơ trực tuyến bị trả về yêu cầu bổ sung $\to$ Hướng dẫn đọc Phiếu hướng dẫn theo NĐ 61/2018, bổ sung trong 3 ngày không mất phí.
     14. `OUT_OF_JURISDICTION`: Cảnh báo địa giới nhầm lẫn (KTX phía Tây thuộc Phường Hòa Khánh mới, Nam Ô thuộc Phường Hải Vân mới).
     15. `CHILD_SCHOOL_ADMISSION`: Tuyển sinh và chuyển trường cho con em công nhân KCN diện tạm trú vào các trường công lập.
     16. `MICRO_BUSINESS_STARTUP`: Thủ tục đăng ký hộ kinh doanh cá thể & cam kết an toàn thực phẩm 0 đồng cho thanh niên khởi nghiệp.
8. **Mở Rộng Phương Ngữ Đa Vùng Miền & Sửa Lỗi Âm Vần Bắc Bộ (`dialect-normalizer.ts`, `typo-corrector.ts`):**
   - Phục vụ 45.000+ công nhân KCN Hòa Khánh & sinh viên ĐH Bách khoa đến từ khắp các miền:
     - *Bắc Trung Bộ (Nghệ An - Hà Tĩnh)*: `nỏ`, `nỏ có`, `nỏ biết`, `nỏ chộ`, `mần răng`, `ngái`, `đọi`, `cấy`, `trốc`, `hung`, `mô tút`.
     - *Nam Trung Bộ (Quảng Ngãi, Bình Định)*: `dẫy`, `dẫy á`, `ngó`, `trỏng`, `ngoải`, `trển`.
     - *Nam Bộ / Miền Tây*: `hổng có`, `hổng biết`, `tui`, `làm sao dị`, `chừng nào`, `hồi nào`, `bịnh`, `chút xíu`.
     - *Lỗi ngữ âm Bắc Bộ (L/N, xưng hô quê quán)*: `nàm` $\to$ `làm`, `nấy` $\to$ `lấy`, `lộp` $\to$ `nộp`, `nưu trú` $\to$ `lưu trú`, `lơi cư trú` $\to$ `nơi cư trú`, `thầy bu` $\to$ `bố mẹ`, `u ở quê` $\to$ `mẹ ở quê`.
9. **Cơ Chế 4 Trụ Cột Tháo Gỡ "Điểm Biên Chưa Biết" (Unknown Unknowns & Fail-Closed Strategy):**
   - Giải quyết triệt để vấn đề "hệ thống sẽ làm gì khi gặp trường hợp hoàn toàn mới chưa có trong cơ sở dữ liệu?":
     - **Trụ cột 1 - Minh bạch không ảo giác (Zero Hallucination - Fail Closed):** Hệ thống thông báo rõ ràng "chưa có dữ liệu chính thức được phê duyệt", tuyệt đối không tự bịa đặt hay suy đoán quy định pháp luật.
     - **Trụ cột 2 - Phiếu in A5 mang theo (Printable Inquiry Slip):** Tự động xuất phiếu in khổ A5 tóm tắt câu hỏi, thời gian và ô chữ ký mang đến Bộ phận Một cửa (68 Lạc Long Quân) để cán bộ đọc ngay mà không cần công nhân/bà con phải giải thích vòng vo.
     - **Trụ cột 3 - Leo thang hỗ trợ con người (Human Escalation):** Tích hợp nút gọi trực tiếp Tổng đài 1022 Đà Nẵng (`0236 1022`) và Hotline Chuyển đổi số Phường (`0905 423 233`).
     - **Trụ cột 4 - Vòng lặp phản ánh học tập (Closed-Loop Learning):** Nút 1-chạm "Gửi phản ánh điểm biên này cho Phường" lưu trữ vào hàng đợi của Tổ công tác CĐS để thẩm định và bổ sung vào đợt cập nhật CSV tiếp theo.
10. **Hai Khối Giao Diện Sống Mới Trên Trang Chủ (`HomeStrategyBanner.tsx` & `HomeLivingPulse.tsx`):**
    - **Thanh Banner Định Vị Chiến Lược:** Thể hiện trực quan nguyên lý 2 bước: *Bước 1: Chuẩn bị giấy tờ & gỡ khó ca trọ không hợp đồng / làm ca kíp tại LC Compass $\to$ Bước 2: Nộp chính thức trên Cổng DVC / Zalo để không lo bị trả về*.
    - **Khối Nhịp Đập Liên Chiểu Hôm Nay (Living Pulse Widget):** Cung cấp dữ liệu sống thực địa tuần này do Đoàn phường cập nhật: Lịch tiếp dân của Lãnh đạo UBND Phường (Thứ Ba & Thứ Năm tại 68 Lạc Long Quân); Tối thứ Bảy hỗ trợ công nhân KCN; Cảnh báo vùng trũng thấp Mẹ Suốt & 2 điểm sơ tán kiên cố (THPT Nguyễn Trãi, THCS Nguyễn Lương Bằng).

### Kết Quả Nghiệm Thu Kỹ Thuật (100% PASS)
- **Unit Tests:** 16/16 test files PASS, 152/152 tests PASS (`npm run test`).
- **Typecheck:** 0 lỗi (`npm run typecheck`).
- **ESLint:** 0 lỗi (`npm run lint`).
- **Content Contracts:** 100% hợp đồng dữ liệu ĐẠT (`npm run content:validate`).
- **Production Build:** Build Next.js thành công 100% (`npm run build`).
- **Playwright E2E:** 52/52 tests PASS (`npm run test:e2e`).
