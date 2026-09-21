# 01 — Contracts và fixture

Owner: Antigravity; Codex rà soát. Phụ thuộc: 00. Phạm vi: `web/src/contracts`, `web/fixtures`, `web/scripts`, test schema.

## Thực hiện

- Hiện thực CONTRACTS.md bằng TypeScript + Zod. Ba loại thẻ có body phân biệt; public DTO tách hồ sơ rà soát riêng.
- Tạo fixture SERVICE/PLACE/DISCOVER ở trạng thái đủ điều kiện, thiếu dữ liệu, quá hạn, bị rút, sai địa bàn. Gắn nhãn synthetic, không cho fixture lẫn vào published.
- Validator kiểm tra ID duy nhất, URL an toàn, source references hợp lệ, reviewer/ngày đối với published, bước/nhánh dịch vụ có đích hợp lệ, version rõ ràng.
- Định nghĩa NavigationResult và ResearchResponse để UI/backend làm độc lập. Không code API Google ở đây.

## Nghiệm thu

Test validator với mẫu đúng/sai; fixture chưa được duyệt không thể xuất bản. `content:validate` báo rõ card và trường lỗi. Catalog rỗng hợp lệ cho khởi tạo nhưng không nhận là đã có dữ liệu sản phẩm. Ghi contracts/schema decisions vào REPORT để Codex rà soát trước khi các gói khác thay đổi hợp đồng.
