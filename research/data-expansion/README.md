# Khu nghiên cứu mở rộng dữ liệu thật

Các file rỗng ban đầu là hàng đợi công việc, không phải dữ liệu đã thu thập. Antigravity triển khai theo ../../handoff/data-expansion/TASK.md.

- candidates.json: chủ đề ứng viên, loại, intent gợi ý (phải kiểm tra lại), trạng thái và cardId nếu đã có thẻ. Chủ đề không xác nhận có địa điểm/dịch vụ thật.
- sources.json: chỉ thêm nguồn sau mở và đối chiếu; thuộc tính theo TASK.
- claim-map.json: liên kết cardId/claimId/sourceId tới fieldPaths và vị trí bằng chứng; thể hiện hạn chế cụ thể.
- decisions.json: candidateId, quyết định (accepted/pending/rejected), lý do, thiếu bằng chứng gì, ngày kiểm tra thực tế.
- drafts/: thẻ chưa đủ căn cứ hoặc chưa có intent phù hợp, không được nạp vào ứng dụng.

Không sao chép research/drafts cũ vào corpus thật. Hai thẻ sourced-demo hiện tại cần kiểm tra lại, không coi sổ nguồn cũ là bằng chứng mới.

Nguồn khởi đầu chỉ để tìm kiếm: cổng thông tin Đà Nẵng và phường, Cổng DVC Quốc gia, Bộ Công an, cơ quan y tế/giáo dục, website đơn vị quản lý và Báo Đà Nẵng. Không xây URL bài viết từ tên miền và tiêu đề suy đoán. Chưa có nguồn mới nào được xác minh trong thư mục này lúc khởi tạo.
