# 07 — Triển khai Vercel

Owner: Antigravity. Phụ thuộc: 06. Phạm vi: cấu hình deploy trong web, môi trường Vercel và delivery/deployment. Không tự tạo tài nguyên trả phí hoặc nâng gói ngoài ngân sách đã được phép.

## Thực hiện

1. Ghi nhận Git repository, project/team Vercel có quyền sử dụng; chưa có thì báo blocker cụ thể và hoàn thành hướng dẫn deploy local/CLI trước.
2. Root Directory = web; framework Next.js; Node.js runtime cho API. Dùng phiên bản Node/lockfile đã kiểm ở 00. Không deploy toàn H:\LC như thư mục tĩnh.
3. Tách Development/Preview/Production. Đặt biến server theo env mẫu bằng kênh bí mật, không ghi giá trị vào REPORT. Build không gọi Gemini.
4. Deploy Preview, chạy smoke test trang/thẻ/API, trạng thái AI tắt, key/limiter thiếu, 404 và nguồn hết hạn. Xác nhận không public thư mục nghiên cứu, handoff hoặc tập mô phỏng.
5. Sau nghiệm thu, phát hành Production với miền Vercel mặc định, kiểm tra lại cấu hình Production độc lập. Không cho rằng Preview key tự chuyển sang Production.
6. Ghi URL, deployment ID, commit, ngày, model được cấu hình (không key), trạng thái feature flag, kết quả smoke, known issues và cách rollback. Demo dữ liệu chưa duyệt phải ghi rõ là demo.

## Nghiệm thu

Có URL chạy được, mobile dùng được, thông tin nguồn đúng trạng thái và cách tắt AI nhanh. Ghi deployment trước để quay lại khi lỗi; nội dung bị rút không được vô tình phục hồi như hiện hành khi rollback. Không tuyên bố đã deploy nếu chưa có URL kiểm tra được.

Nguồn: https://vercel.com/docs/frameworks/full-stack/nextjs và https://vercel.com/docs/deployments/environments
