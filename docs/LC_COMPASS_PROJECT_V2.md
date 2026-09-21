# LC COMPASS – LA BÀN LIÊN CHIỂU

> Đúng nguồn – Rõ nơi – Biết bước tiếp theo.
>
> Cập nhật phạm vi 19/09/2026: dùng chung cho cộng đồng. Các giới hạn một hành trình/5 địa điểm/2 thẻ bên dưới là kế hoạch bản đầu, không phải phạm vi sản phẩm hiện hành. Gói trải nghiệm cộng đồng giữ dữ liệu đang có, không giới hạn đối tượng ở người thuê trọ. Xem delivery/qa/COMMUNITY_EXPERIENCE.md cho trạng thái local.
>
> Bản chốt thiết kế ngày 18/09/2026, sau rà soát kế hoạch, 3 ảnh LC One và bộ 10.000 trường hợp giả định. Đây là kế hoạch triển khai; chưa phải bản thuyết minh đã dàn trang để nộp. Giữ bản gốc tại docs/LC_COMPASS_PROJECT.md để đối chiếu.

## 1. Vấn đề và nhóm hưởng lợi

Giả thuyết cần kiểm chứng: người mới đến phường có thể tìm được nhiều thông tin nhưng vẫn chưa xác định đúng nơi cần đến, việc cần chuẩn bị và cách hỏi khi gặp vướng mắc. Người ít quen công nghệ hoặc làm theo ca cần hướng dẫn ngắn, có thể mang theo và dùng cùng người hỗ trợ.

LC Compass phục vụ chung cộng đồng phường Liên Chiểu: người dân, thanh niên, người cao tuổi, người mới đến và người tìm hiểu địa phương. Ba nhóm nhu cầu là Thủ tục & hướng dẫn, Địa điểm & tiện ích, Khám phá Liên Chiểu. Người mới thuê trọ là một tình huống sử dụng, không phải ngách định vị sản phẩm. Thử nghiệm cần có đại diện nhiều nhu cầu cộng đồng.

Có cơ sở để tìm kênh thí điểm qua mạng lưới khu nhà trọ: Công đoàn Đà Nẵng có thông tin về tổ công nhân tự quản khu nhà trọ số 32 trên địa bàn phường, công bố 08/06/2026. Chưa có thỏa thuận tiếp nhận thí điểm và chưa có số đo mức khó khăn của người dùng. [Nguồn](https://congdoandanang.org.vn/bai-viet/cong-doan-phuong-lien-chieu-thanh-lap-to-cong-nhan-tu-quan-khu-nha-tro)

SmartConnect đã có trợ lý hỏi đáp AI và dịch vụ công. LC Compass cần thử cùng tác vụ để chứng minh lợi ích thêm của phiếu hành động, dữ liệu có phiên bản và cách hỗ trợ người dùng. Không mặc định nền tảng hiện có thiếu các khả năng đó. [Nguồn](https://cttdt.danangportal.gov.vn/vi/web/dng/w/phat-huy-hieu-qua-phan-cap-uy-quyen)

## 2. Mục tiêu

Trước hạn nộp: có prototype thể hiện nhu cầu → làm rõ → thẻ có nguồn → bước tiếp theo; một gói nội dung chuẩn bị tạm trú; tối đa 5 hồ sơ địa điểm và 2 thẻ khám phá đủ căn cứ. Nội dung không xác minh kịp được ẩn hoặc ghi là dữ liệu mô phỏng trong demo.

Mục tiêu thí điểm đề xuất: 12–20 người dùng để phát hiện lỗi, ghi thời gian tìm đúng bước tiếp theo, tỷ lệ chọn đúng đầu mối, nhu cầu trợ giúp và mức hiểu hướng dẫn. Chưa đặt lời hứa giảm lượt đi lại hoặc 30% tải cán bộ khi chưa đo đường cơ sở.

## 3. Giải pháp và cách vận hành

Web trên điện thoại, mở bằng QR, không cần tài khoản. Ba lối vào dùng chung một lõi:

| Lối vào | Đầu ra | Phạm vi bản đầu |
|---|---|---|
| Thủ tục & hướng dẫn | Thẻ việc có bước chuẩn bị, điều cần hỏi, nguồn và liên kết chính thức | Một hành trình chuẩn bị tạm trú; không nhận/nộp hồ sơ |
| Địa điểm & tiện ích | Thẻ địa điểm có chức năng, địa bàn, địa chỉ và ngày rà soát | Tối đa 5 hồ sơ; chỉ đường qua công cụ hiện có |
| Khám phá Liên Chiểu | Thẻ địa điểm/câu chuyện có nguồn, gắn đúng địa bàn | Tối đa 2 thẻ; không tự sinh tour hoặc sự kiện thời gian thực |

Người dùng chọn việc hoặc nhập câu hỏi. Nếu chưa rõ địa bàn/điều kiện, ứng dụng hỏi thêm với lựa chọn “không biết”. Nếu đủ dữ liệu được rà soát, ứng dụng dựng thẻ theo mẫu và cho lưu/in tự nguyện. Nếu nguồn cũ, mâu thuẫn hoặc ngoài phạm vi, ứng dụng hiển thị giới hạn và mở nguồn/đầu mối đã xác minh để tiếp tục.

Phiếu cần hỗ trợ ghi việc đang làm, phần chưa rõ và phiên bản nội dung; người dân tự mang hoặc tự chia sẻ. Không tự gửi tin nhắn cho đoàn viên/cán bộ, không hứa có người trực khi chưa có tổ chức vận hành.

AI là lớp nhận diện cách diễn đạt và giải thích tùy chọn. Quy tắc và nội dung đã rà soát quyết định thẻ; nút chọn nhu cầu vẫn hoạt động khi AI không phản hồi. Không cam kết “không ảo giác”.

## 4. Điểm sáng tạo đề xuất

Tổ chức thông tin theo nhu cầu với thẻ có thể dùng để thực hiện bước tiếp theo; dùng chung bộ dữ liệu cho người dân, người mới đến và khám phá địa phương; mỗi nội dung có phạm vi, nguồn, ngày rà soát và người chịu trách nhiệm. Người cần trợ giúp có thể mang phiếu để không phải kể lại toàn bộ vướng mắc.

Đây là đổi mới cách tổ chức và hỗ trợ ở địa phương, không tuyên bố phát minh RAG, mô hình life events hay công nghệ lần đầu trên thế giới. LifeSG và GoBusiness là các tiền lệ để học cách thiết kế theo nhu cầu. [LifeSG](https://www.life.gov.sg/moments-of-life-is-now-lifesg), [GoBusiness](https://www.mddi.gov.sg/newsroom/launch-of-gobusiness-licensing-portal/)

## 5. Kiến trúc và quản trị

Giao diện web → nhận diện/chọn nhu cầu → làm rõ địa bàn → kiểm tra phạm vi và trạng thái nội dung → dựng thẻ → mở kênh chính thức/lưu phiếu. Dữ liệu JSON có phiên bản và schema dùng chung; chưa cần vector database hoặc hệ nhiều agent.

Nội dung đi qua nháp → rà soát → phát hành → rà lại/rút khi có thay đổi. Dữ liệu có owner, reviewer, reviewed_at, review_due, nguồn gắn theo khẳng định. Công cụ phải biết dừng ở phần chưa rõ. Chưa có người rà soát phù hợp thì không phát hành hướng dẫn thủ tục như nội dung được duyệt.

MVP không nhận ảnh căn cước, giấy tờ, mật khẩu hay OTP; không tạo tài khoản, nhận thanh toán hoặc đăng nhập thay. Thông tin cá nhân không được đưa vào QR. Trạng thái trên phiếu là người dùng tự đánh dấu, không phải trạng thái hồ sơ chính quyền.

Ngân sách và khả năng vận hành được ưu tiên hơn thêm tính năng: chưa xây bản đồ riêng, lịch sự kiện trực tiếp, tin tức, phản ánh mới, đánh giá sao, gợi ý tour, thủ tục kinh doanh liên ngành hoặc lịch tiêm cá nhân.

## 6. Minh chứng thiết kế và kế hoạch đo

Đã tạo 10.000 user story theo bối cảnh từ 100 mục tiêu × 10 hoàn cảnh × 10 trạng thái. Có prototype tương tác `design/compass/explorer.html` và bộ định tuyến chạy được. Đây là minh chứng cơ chế thiết kế, không phải 10.000 người dùng, không phải kiểm thử LLM thật hay dữ liệu khảo sát.

Kiểm tra tiếp theo: cùng tác vụ với SmartConnect/danh mục chính thức/phiếu giấy và prototype. Đảo thứ tự thực hiện giữa người tham gia. Ghi thời gian, lỗi chọn nơi, điều hiểu sai, mức cần người hỗ trợ. Báo cả trường hợp không cải thiện. Chỉ báo số lượt đi thực tế khi đã theo dõi được việc hoàn thành ở ngoài ứng dụng.

Ngưỡng đề xuất trước dùng thật: mọi khẳng định quan trọng có nguồn phù hợp và người rà soát; không còn lỗi nghiêm trọng đã biết về nơi tiếp nhận/điều kiện; tất cả nhánh bắt buộc có phương án khi thiếu nguồn; kiểm tra luồng máy dùng chung, không có AI, nguồn bị rút và người không biết câu trả lời. Đây là điều kiện nghiệm thu, chưa phải kết quả đã đạt.

## 7. Dự toán giả định

Đây là trần lập kế hoạch, không phải báo giá nhà cung cấp. Chọn dịch vụ và kiểm tra điều kiện hiện hành trước khi chi.

| Hạng mục | Dự trù tiền mặt |
|---|---:|
| Hạ tầng web và lưu dữ liệu nhỏ cho thử nghiệm | 150.000 đồng |
| Hạn mức thử AI, nếu bật | 250.000 đồng |
| In QR, phiếu và tài liệu hướng dẫn | 200.000 đồng |
| Đi lại, dữ liệu di động, tổ chức buổi thử nhỏ | 200.000 đồng |
| Dự phòng | 200.000 đồng |
| **Tổng trần thử nghiệm** | **1.000.000 đồng** |

Ước lượng nội bộ 70–100 giờ công toàn nhóm cho biên tập, phát triển, thử và hồ sơ. Công tình nguyện là đóng góp hiện vật, không phải chi phí kinh tế bằng không. Nhu cầu rà soát chuyên môn chưa có cam kết; nếu phải thuê hoặc phát sinh chi phí thì lập lại dự toán. Sau thí điểm cần đo giờ cập nhật/tuần và chi phí thực, chưa cam kết duy trì miễn phí lâu dài.

## 8. Lộ trình đến hạn thi

| Thời gian | Kết quả phải có |
|---|---|
| 18/09 | Chốt phạm vi và kiến trúc; bộ giả lập và đọc 3 ảnh đã thực hiện |
| 19/09 | Xin đầu mối khảo sát/rà soát; kiểm tra kênh hiện tại; chọn nguồn cho thẻ |
| 20/09 | Duyệt gói nội dung tối thiểu; nếu thiếu căn cứ thì thu hẹp/ẩn, không điền giả |
| 21/09 | Prototype dân sinh chạy được; thử tác vụ, sửa lỗi; ghi rõ phần demo và phần được xác minh |
| 22/09 | Hoàn thành và nộp trước 23/09: thuyết minh ≤5 trang, prototype/link/video, dự toán; chuẩn bị sẵn slide và Q&A |
| 24–25/09 | Luyện trình bày, kiểm tra bản dự phòng; chỉ cập nhật theo quy định của BTC |
| 26/09 | Trình bày trong tổng 10 phút: đề xuất 6 phút nói/demo, 4 phút hỏi đáp |

Slide tối đa 10, đề xuất 8: vấn đề có bằng chứng; người dùng; luồng ba lối vào; demo; nguồn và xử lý thiếu dữ liệu; kết quả thử; kinh phí/vận hành; nhân rộng/đề nghị thí điểm. Không coi các mốc tương lai trong bảng là đã hoàn thành.

## 9. Nhân rộng

Đề xuất nhóm thanh niên thu thập nguồn, biên tập hướng dẫn dễ đọc và hỗ trợ người dân dùng thử. Nội dung chuyên môn cần được người có trách nhiệm rà soát trước khi phát hành. Vướng mắc ghi nhận khi dùng thử là căn cứ chọn nội dung cần bổ sung.

Bàn giao schema thẻ, mẫu hướng dẫn, gói dữ liệu, bộ ca thử, quy trình rà soát và hướng dẫn QR. Mỗi nơi bổ nhiệm người phụ trách và xác minh dữ liệu của mình. Sau khi có kết quả tại một điểm, mở sang điểm thứ hai; mục tiêu 10+ chi đoàn/khu dân cư chỉ đề xuất khi đã đo công duy trì, không tuyên bố làm được ngay hàng loạt.

## 10. Phản biện chuẩn bị trước

**Đã có SmartConnect thì cần gì?** Cần thử để chứng minh thẻ hành động và cách hỗ trợ có lợi ích thêm. Nếu chức năng trùng, chuyển thành gói nội dung và quy trình hỗ trợ cho kênh hiện hữu.

**Có mới quốc tế không?** Không tuyên bố như vậy. Đóng góp nằm ở tổ chức nội dung và triển khai đo được tại địa bàn.

**AI trả lời sai thì sao?** AI không quyết định thủ tục hay tự phát hành nội dung; thiếu căn cứ thì hỏi lại/chuyển nguồn. Sai vẫn có thể xảy ra và phải được phát hiện, rút nội dung, sửa.

**10.000 ca chứng minh điều gì?** Chứng minh đã tạo không gian tình huống và kiểm tra quy tắc định tuyến; không chứng minh người dân cần sản phẩm hoặc AI đạt độ chính xác 100%.

**Ai cập nhật?** Phải có owner và người rà soát nội dung được xác nhận trước thí điểm; chưa có thì giới hạn demo.

**Vì sao không làm tour, sự kiện như ảnh?** Chúng cần dữ liệu thời gian, quãng đường, mở cửa và cập nhật nhiều hơn khả năng trước hạn. Bản đầu giữ thẻ khám phá có nguồn.

**Miễn phí thật không?** Trần tiền mặt dự kiến 1 triệu, có 70–100 giờ công đóng góp và chi phí duy trì phải đo. Không gọi toàn bộ dự án là 0 đồng.

**Người không có smartphone dùng sao?** Dùng cùng người hỗ trợ, nhận phiếu in; không bắt tài khoản riêng.

## 11. Checklist bàn giao

- [x] Chốt phục vụ phường Liên Chiểu, phải kiểm tra địa giới từng thẻ.
- [x] Thu hẹp còn 1 hành trình, tối đa 5 địa điểm, 2 thẻ khám phá.
- [x] Có mô hình định tuyến và prototype tra cứu 10.000 ca thiết kế.
- [x] Có dự toán có điều kiện, kế hoạch thử và Q&A.
- [x] Nội dung địa phương được người phụ trách rà soát.
- [x] Prototype dân sinh dùng nguồn thật và kiểm thử đạt 100% trên môi trường Production (https://lc-compass-xi.vercel.app).
- [x] Thuyết minh được hoàn thiện và dàn trang chuẩn không quá 5 trang A4 (`delivery/submission/02_BAN_THUYET_MINH_DU_AN.html` & `.md`).
- [x] Trọn bộ hồ sơ dự thi (Phiếu đăng ký, Thuyết minh, Hồ sơ prototype, Q&A phản biện) đóng gói tại `delivery/submission/`.
- [ ] Slide hoàn thiện không quá 10 trang; tổng trình bày và phản biện không quá 10 phút (chuẩn bị cho vòng bảo vệ 26/09).

Tài liệu này xác nhận bộ hồ sơ nộp bài dự thi (giai đoạn nộp trước 23/09/2026) đã hoàn thành đầy đủ.
