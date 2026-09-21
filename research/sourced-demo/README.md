# Dữ liệu thật cho demo — 19/09/2026

Hai thẻ tại `web/content/sourced-demo/cards.json`, trạng thái `review`, `isSynthetic: false`. Chưa có phê duyệt nghiệp vụ; không có reviewer/reviewedAt. Không sao chép dữ liệu từ ảnh thiết kế.

| Thẻ | Phạm vi đã có căn cứ | Giới hạn |
|---|---|---|
| service-chuan-bi-tam-tru | Chuẩn bị thông tin; đối chiếu dữ liệu đã chia sẻ; sinh viên ở ký túc xá; giữ mã hồ sơ | Không phải checklist hoàn chỉnh; chưa xác minh địa chỉ, giờ, số điện thoại nơi tiếp nhận tại phường |
| place-trung-tam-hanh-chinh-lien-chieu | Địa chỉ Trung tâm và UBND tại 68 Lạc Long Quân theo công bố 14/07/2025 | Giờ và điện thoại: chưa xác minh; địa phương chưa rà soát lại; không gán thành nơi nhận hồ sơ tạm trú |

`sources.json` lưu URL, đơn vị công bố, ngày truy cập, trích đoạn ngắn và vị trí hỗ trợ từng khẳng định. Các đoạn có […] là trích lược không liên tục. fetchedAt dùng mốc đầu ngày truy cập, không đại diện giờ tải trang chính xác. Hạn 19/10/2026 là lịch nhóm cần kiểm tra lại, không phải ngày hết hiệu lực văn bản.

Địa bàn đối chiếu Điều 1 khoản 9–10 Nghị quyết 1659: Hòa Khánh Bắc cũ và phần Hòa Liên còn lại sau điều chỉnh sang Hải Vân. Không gộp cả quận cũ. Trang đăng lại nghị quyết có dòng số văn bản trong bảng ghi 1655, không khớp tiêu đề 1659. Đã đối chiếu thêm [bản Công báo số 801–802, trang 49](https://congbao.cdnchinhphu.vn/CongBaoCP/CongBao/2025/6/45107/56815-1-801-802.pdf#page=49) ngày 19/09/2026: khoản 9–10 xác nhận cùng nội dung địa bàn; Nghị quyết 1659 bắt đầu tại trang 48. Đây là kiểm tra tài liệu bởi agent, không phải phê duyệt nghiệp vụ.

Nguồn cư trú tháng 4/2026 được tìm thấy nhưng không dùng làm checklist CT01 hiện hành vì đã có hướng dẫn mới tháng 7/2026. Chỉ biên tập các nội dung được nguồn mới hỗ trợ; không tự thêm phí, thời hạn hoặc giấy tờ bắt buộc.

Không bổ sung thẻ khám phá trong đợt này vì chưa hoàn tất bằng chứng địa bàn và nội dung. UI và hợp đồng vẫn hỗ trợ DISCOVER.

## Kiểm tra lại nguồn cũ

| URL / mục nguồn cũ | Kết quả mở trang 19/09/2026 | Xử lý |
|---|---|---|
| BCA `tthc?matt=26277` | Nội dung thị thực điện tử, mã 1.002757 | Loại khỏi nguồn tạm trú |
| DVC `dvc-tthc-quy-dinh-phap-luat.html` | Đường dẫn danh mục, không định danh điều luật | Không dùng làm căn cứ điều 27/28 |
| lienchieu…/dich-vu-cong-mot-cua | Công cụ không truy cập được | Không dùng; không kết luận 404 |
| lienchieu…/an-ninh-trat-tu-cong-an-phuong | Công cụ không truy cập được | Không dùng |
| soyte…/chi-tiet-co-so-y-te/tram-y-te-phuong-lien-chieu | Công cụ không truy cập được | Không dùng |
| congdoandanang…/cong-doan-phuong-lien-chieu-thanh-lap-to-cong-nhan-tu-quan-khu-nha-tro | Mở được; bài 08/06/2026 về tổ tự quản Quang Thành 3A1 | Chứng minh hoạt động tổ, không chứng minh thẩm quyền xác nhận chỗ ở hay xử lý thiếu hợp đồng |
| danangfantasticity…/di-tich-dinh-lang-hoa-my-da-nang | Công cụ không truy cập được | Không dùng |
| lienchieu…/chuyen-doi-so-thanh-nien | Công cụ không truy cập được | Không dùng |

Thư mục `research/drafts`, dữ liệu `web/content/demo` và các báo cáo cũ là di sản mô phỏng, không phải bộ dữ liệu demo thật này. Dữ liệu mới không dùng các URL bị loại ở trên. Việc mở trang xác nhận khả năng truy cập tại thời điểm nghiên cứu, không bảo đảm website bên ngoài luôn sẵn sàng.
