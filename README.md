# LC Compass — Liên Chiểu

Ứng dụng và hồ sơ dự thi Ý tưởng sáng tạo chuyển đổi số trong thanh niên Liên Chiểu 2026.

## Cấu trúc dự án

| Thư mục | Nội dung |
| --- | --- |
| `web/` | Ứng dụng Next.js, dữ liệu nội dung, kiểm thử và script của ứng dụng |
| `docs/` | Kế hoạch dự án, trạng thái, thể lệ và tài liệu bàn giao |
| `research/` | Nghiên cứu API, nguồn dữ liệu, bản nháp và hồ sơ rà soát |
| `design/` | Thiết kế giao diện, ảnh tham khảo, ảnh đối chiếu và mô phỏng Compass |
| `delivery/` | Hồ sơ nộp thi, bằng chứng QA và tài liệu triển khai |
| `scripts/` | Công cụ hỗ trợ dùng chung cho dự án |

## Bắt đầu

- [Quy định cuộc thi và hướng dẫn agent](AGENTS.md)
- [Kế hoạch dự án V2](docs/LC_COMPASS_PROJECT_V2.md)
- [Trạng thái dự án](docs/STATUS.md)
- [Hướng dẫn chạy ứng dụng](web/README.md)
- [Tài liệu tích hợp UI/API](research/UI_API_INTEGRATION.md)
- [Bàn giao triển khai](docs/handoff/START_HERE.md)
- [Hồ sơ dự thi](delivery/submission/README.md)
- [Mô phỏng thiết kế](design/compass/README.md)

```powershell
cd web
npm ci
npm run dev
```

Vercel Root Directory: `web`.

## GitHub v? tri?n khai t? ??ng

Repository: [cat1454/lc-compass](https://github.com/cat1454/lc-compass) (ri?ng t?).

Vercel project `lc-compass` d?ng th? m?c `web/`, Node.js 22.x, c?i b?ng `npm ci` v? build b?ng `npm run build`. Sau khi k?t n?i GitHub, m?i l?n push l?n `main` t?o b?n Production; nh?nh kh?c t?o b?n Preview.

```powershell
git add .
git commit -m "M? t? thay ??i"
git push origin main
```

Commit ch? n?m tr?n m?y ch?a k?ch ho?t tri?n khai; c?n push l?n GitHub. Kh?ng commit `.env.local`, kh?a API, `.vercel/` ho?c file build. C?u h?nh bi?n m?i tr??ng t?i Vercel Project Settings.


## Quy ước lưu trữ

Đường dẫn viết trong lệnh và bảng mô tả được tính từ thư mục gốc dự án, trừ khi có ghi chú khác. Liên kết Markdown được tính từ file tài liệu chứa liên kết.

Tài liệu thể lệ gốc nằm trong `docs/contest/`; ảnh gốc chưa phân loại nằm trong `design/references/originals/`. Tài liệu TASK/REPORT theo từng đợt nằm trong `docs/handoff/`; trạng thái tại đó chỉ mô tả công việc bàn giao.

Giữ dữ liệu phục vụ ứng dụng trong `web/content/`, nguồn nghiên cứu và bản nháp trong `research/`. Giữ cache, log và kết quả chạy tạm ngoài tài liệu bàn giao; `.cache/` và các thư mục kết quả kiểm thử của ứng dụng được Git bỏ qua.
