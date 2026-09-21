# Chốt phạm vi LC Compass sau 10.000 kịch bản và 3 ảnh

Ngày: 18/09/2026. Trạng thái: quyết định thiết kế để triển khai prototype; chưa phải xác nhận hiệu quả ngoài thực địa.

## 1. Quyết định

Giữ tên dự án **LC Compass – La bàn Liên Chiểu**; “LC One” trong ba ảnh là tên trên bản thiết kế tham khảo, không tạo thêm một sản phẩm.

**Định vị:** Giúp người dân và người mới đến tìm đúng thông tin địa phương có nguồn, hiểu việc cần làm và đi tiếp qua kênh phù hợp.

Ba lối vào: **Tôi cần làm việc – Tôi mới đến – Tôi muốn khám phá**. Chúng là ba cách diễn đạt nhu cầu, không phải ba tài khoản hay ba ứng dụng. Một người có thể dùng cả ba.

Nhóm thí điểm chính: người mới thuê trọ tại phường Liên Chiểu và thanh niên hỗ trợ họ. Người dân hiện hữu dùng lại thẻ việc và địa điểm; khách tham quan dùng một phần nội dung khám phá có biên tập.

MVP có đúng ba loại đầu ra:

1. **Thẻ việc (SERVICE):** chuẩn bị và tìm bước tiếp theo cho nhu cầu đăng ký tạm trú. Không kết luận đủ điều kiện, không nhận/nộp hồ sơ.
2. **Thẻ địa điểm (PLACE):** chức năng phục vụ, địa bàn, địa chỉ có nguồn, ngày rà soát, mở liên hệ/chỉ đường qua công cụ hiện hữu.
3. **Thẻ khám phá (DISCOVER):** một địa điểm/câu chuyện có nguồn, phạm vi địa lý rõ, hành động mở nguồn hoặc xem vị trí. Không lập tour tối ưu.

Mọi thẻ đều trả lời: **Thông tin gì? Áp dụng cho ai/ở đâu? Nguồn nào? Kiểm tra khi nào? Tiếp theo làm gì? Nếu chưa rõ thì hỏi ai?**

## 2. Phạm vi khóa cho bản thi

| Hạng mục | Làm trong MVP | Giới hạn |
|---|---|---|
| Hành trình thủ tục | 1 gói chuẩn bị tạm trú; 8 mục tiêu thao tác | Chỉ các nhánh có nội dung được rà soát; yếu tố quốc tịch, tranh chấp, thường trú chuyển nguồn chính thức |
| Địa điểm thiết yếu | Tối đa 5 hồ sơ địa điểm đã xác minh | Ưu tiên điểm hành chính, Công an phụ trách cư trú, y tế, hỗ trợ số; chưa xác nhận thì không phát hành |
| Khám phá | Tối đa 2 thẻ có tư liệu đủ dùng | Nếu không tìm được nội dung đúng địa bàn và đủ nguồn, ẩn thẻ; không lấy Nam Ô thay thế rồi gán vào phường |
| Tìm kiếm | Nút chọn nhu cầu + tìm theo tên/từ khóa | AI nhận diện ý định là lớp bổ sung, không là điều kiện để demo hoạt động |
| Tiếp tục việc đang làm | Phiếu lưu/in theo lựa chọn người dùng | Trạng thái tự đánh dấu, không phải trạng thái hồ sơ của cơ quan nhà nước |
| Nhờ hỗ trợ | Phiếu tóm tắt vướng mắc, người dân tự mang hoặc tự chia sẻ | Chưa có cơ chế người trực thì không hiện “đã chuyển”, “đã đặt lịch”, “sẽ gọi lại” |
| Kênh phát hành | Web trên điện thoại, QR tới web | Chưa cam kết tích hợp Mini App hay API chính quyền |

19 mục tiêu trong bộ thử dùng chung các thành phần này: 8 cư trú, 8 thao tác với địa điểm, 3 thao tác khám phá. **19 mục tiêu không phải 19 thủ tục hoặc 19 hệ thống.**

Hoãn: khởi sự kinh doanh nhiều ngành; trường học đúng tuyến/còn chỗ; lịch tiêm cá nhân; điều kiện trợ cấp; địa điểm đổ xà bần; xây dựng; sự kiện “hôm nay”; lịch xe thời gian thực; đánh giá sao; đặt chỗ/thanh toán; nhận giấy tờ cá nhân; tài khoản công dân; kho phản ánh mới; bản đồ/GIS riêng; tạo hành trình hai giờ tự động; agent tự duyệt nguồn và tự xuất bản.

## 3. Phép thử đã làm và giới hạn

Tạo tích Descartes **100 mục tiêu × 10 hoàn cảnh sử dụng × 10 trạng thái dữ liệu/hệ thống = 10.000 trường hợp**. Có 1.000 câu chuyện nền và 10.000 user story theo bối cảnh. Đây là các tổ hợp có cấu trúc, không phải 10.000 cuộc phỏng vấn hay 10.000 bài phân tích chuyên gia độc lập.

Mỗi dòng chứa user story, điều kiện đầu vào, hành động kỳ vọng, lý do thiết kế ngắn, điều chỉnh giao diện, lỗi cần tránh và tiêu chí chấp nhận. Dữ liệu cân bằng được tạo có chủ ý; ví dụ 1.000 ca khẩn không có nghĩa 10% nhu cầu người dân là khẩn cấp.

Đã chạy mô hình quy tắc trên cả 10.000 ca, kiểm tra bất biến, 1.000 cặp so sánh khi AI hoạt động/ngừng hoạt động và 14 ca kết hợp nhiều lỗi. **Không chạy 10.000 hội thoại trên LLM thật; không đánh giá độ đúng pháp lý; chưa thử người dùng thật.** Kết quả mô hình không thay cho những kiểm thử đó.

Các nhãn như “nguồn đã duyệt”, “có nguy cơ tức thời” được cung cấp sẵn trong mô hình. Sản phẩm thật cần kiểm tra khả năng thu thập/nhận diện nhãn và cách xử lý khi không nhận diện được. Không được quảng cáo “10.000 ca đạt ⇒ AI chính xác 100%”.

## 4. Vòng xem xét và hành động

| Vòng | Giả thuyết/quan sát | Thay đổi quyết định | Cách kiểm tra |
|---|---|---|---|
| 1 | RAG trả lời dân sinh tổng hợp có thể bao phủ nhiều việc | Tách nhu cầu tra cứu khỏi quyết định điều kiện/thẩm quyền | Đặt nguồn cũ, nguồn mâu thuẫn, địa bàn chưa rõ vào mọi nhóm nhu cầu |
| 2 | Một hành trình tạm trú dễ thu hẹp hơn các thủ tục kinh doanh liên ngành | Xem xét tạm trú làm nội dung thủ tục đầu tiên | So các nghĩa vụ duy trì dữ liệu và số nhánh cần người chuyên môn rà soát |
| 3 | 3 ảnh cho thấy người dùng còn cần tìm nơi và khám phá | Mở ba lối vào, dùng chung schema thẻ; vẫn chỉ một hành trình thủ tục | Thêm 10 nhu cầu địa điểm và 10 nhu cầu du lịch/sự kiện vào tập mục tiêu |
| 4 | Gần nhất có thể sai chức năng; dữ liệu đẹp có thể cũ | Địa bàn/chức năng trước khoảng cách; bỏ số liệu chưa có nguồn | Ca ngoài địa bàn, địa danh cũ, nguồn quá hạn, sự kiện năm 2024 |
| 5 | Quy tắc đồng ý đang chặn cả nội dung công khai | Giới hạn cá nhân hóa, vẫn cho xem thẻ địa điểm/văn hóa công khai | Số ca được hiển thị thẻ trong mô hình tăng từ 304 lên 326; thêm 2 ca kiểm tra riêng |
| 6 | Mất AI không nên làm hỏng tác vụ cơ bản | Chọn nhu cầu bằng nút và dựng thẻ từ dữ liệu là đường chính | 1.000 cặp trong mô hình cho cùng định tuyến khi AI ngừng |

Các số 304/326 là số tổ hợp đủ điều kiện theo quy tắc giả định, không phải số người phục vụ được hay tỷ lệ chuyển đổi.

## 5. So sánh phương án, không dùng tỷ lệ giả lập để xếp hạng

| Phương án | Mục tiêu trong tập thử | Lợi ích | Gánh nặng/điểm yếu | Quyết định |
|---|---:|---|---|---|
| A. Dân sinh tổng hợp | 100 | Rộng | Duy trì nhiều lĩnh vực; khó phân biệt với nền tảng hiện có | Không làm trước hạn thi |
| B. Khởi sự kinh doanh | 10 | Gắn việc làm/khởi nghiệp | Nhiều điều kiện chuyên ngành, khó duyệt kịp | Giai đoạn sau nếu có chuyên gia đồng hành |
| C. An cư + học tập + y tế | 30 | Một sự kiện đời sống hấp dẫn | Dữ liệu trường học/y tế thay đổi và dễ bị hiểu như kết luận cá nhân | Chưa mở toàn bộ |
| D. Chỉ chuẩn bị tạm trú | 8 | Gọn, dễ tổ chức thí điểm | Chưa tận dụng nhu cầu tìm nơi/khám phá từ ảnh | Phương án cắt giảm dự phòng |
| E. Ba lối vào, nội dung biên tập hữu hạn | 19 | Tái sử dụng dữ liệu, thể hiện đủ ba nhóm nhu cầu | Vẫn cần người chịu trách nhiệm nội dung; phải giới hạn số thẻ | **Chọn** |

Không có thử nghiệm để chứng minh E đạt điểm thi cao nhất. Đây là lựa chọn thiết kế theo hạn nộp, khả năng dùng chung thành phần và giới hạn nội dung. Nếu không có người rà soát thủ tục trước ngày 20/09, chỉ demo luồng giả định và thẻ công khai đã xác minh; không phát hành hướng dẫn cư trú chưa duyệt.

## 6. Phân phối và sự khác biệt cần chứng minh

Nguồn Công đoàn Đà Nẵng ngày 08/06/2026 mô tả thành lập tổ công nhân tự quản khu nhà trọ số 32 trên địa bàn phường. Điều này hỗ trợ giả thuyết có kênh tiếp cận thử nghiệm, **không chứng minh người thuê trọ đang gặp khó khăn với thủ tục hay đã đồng ý tham gia**. [Nguồn](https://congdoandanang.org.vn/bai-viet/cong-doan-phuong-lien-chieu-thanh-lap-to-cong-nhan-tu-quan-khu-nha-tro)

SmartConnect đã có dịch vụ công, phản ánh và trợ lý AI. Không tuyên bố nó thiếu hành trình/thẻ việc trước khi thử trực tiếp. [Nguồn thành phố](https://cttdt.danangportal.gov.vn/vi/web/dng/w/phat-huy-hieu-qua-phan-cap-uy-quyen)

Luận điểm sáng tạo đề xuất: **Một bộ thông tin địa phương có người chịu trách nhiệm, biến nhu cầu đời thường thành thẻ hành động mang theo được; hỗ trợ cả người tự thao tác và người cần thanh niên giúp.** Đây là giả thuyết giá trị cần thử so với kênh hiện tại.

Ba phép so sánh trước khi khẳng định khác biệt: cùng câu hỏi trên SmartConnect; cùng nhu cầu trên danh mục chính thức; cùng tác vụ với phiếu giấy/QR đơn giản. Nếu phiếu giấy cho kết quả tương đương, giữ nó như kênh sử dụng và chỉ thêm AI khi có lợi ích đo được.

## 7. Những kết luận có thể bác bỏ quyết định này

- Người dùng hiện tại tìm đúng bước tiếp theo rất nhanh bằng SmartConnect: chuyển dự án thành bộ dữ liệu/thẻ hỗ trợ kênh đó.
- Người thuê trọ ít gặp vướng mắc về tạm trú: dùng khảo sát chọn lại hành trình chính; không lấy 10.000 ca giả định để phủ nhận thực tế.
- Người rà soát không có thời gian duy trì: giảm số thẻ; tắt nội dung quá hạn và giữ danh mục nguồn.
- Thẻ khám phá không có dữ liệu đúng địa bàn: hoãn nhánh khám phá, vẫn giữ lõi và hai lối vào hữu ích.
- AI không cải thiện tìm đúng thẻ so với nút chọn: không bật AI trong bản thí điểm.

## 8. Điều kiện hoàn thành bài thi

Đã có: bộ thử 10.000 ca, mô hình định tuyến chạy được, prototype tra cứu phép thử, quyết định phạm vi, kiến trúc, dự toán giả định và câu hỏi phản biện trong bản kế hoạch V2.

Chưa có: kho nội dung địa phương được người phụ trách duyệt, thử nghiệm tại khu nhà trọ, ứng dụng dân sinh triển khai thật, thuyết minh đã dàn trang kiểm tra ≤5 trang, slide đã hoàn thành ≤10 trang. Prototype phép thử chỉ minh họa cơ chế; không đánh tráo thành sản phẩm đã phục vụ người dân.

## 9. Tài liệu quốc tế dùng để định hướng

- [LifeSG](https://www.life.gov.sg/moments-of-life-is-now-lifesg): tổ chức dịch vụ quanh sự kiện cuộc đời đã có tiền lệ; không nhận là phát minh mới.
- [GoBusiness](https://www.mddi.gov.sg/newsroom/launch-of-gobusiness-licensing-portal/): Guided Journey cho cơ sở ăn uống cho thấy khởi sự kinh doanh cũng có mô hình tương tự.
- [DC Compass](https://octo.dc.gov/release/esri-and-district-columbia-partner-launch-dcs-ai-powered-compass): dữ liệu mở/GIS; không dùng làm bằng chứng trực tiếp cho quy trình thủ tục liên ngành.
- [ALCE, EMNLP 2023](https://aclanthology.org/2023.emnlp-main.398/): kiểm tra mức hỗ trợ của nguồn đối với khẳng định, không chỉ đếm link.
- [RAGAs, EACL 2024](https://aclanthology.org/2024.eacl-demo.16/): tách chất lượng truy xuất, mức bám nguồn và chất lượng câu trả lời khi đánh giá AI sau này.
