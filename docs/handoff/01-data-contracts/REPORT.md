# Báo cáo Gói 01 — Hợp đồng dữ liệu & Fixture (Data Contracts)

Trạng thái: **REVIEW** — Antigravity đã khắc phục toàn diện 8 điểm đánh giá từ Codex Review (R01–R08) và các điểm hở kỹ thuật phân nhánh/bảo vệ; bổ sung đầy đủ bộ 34 regression tests; chạy probe đạt chuẩn an toàn 10/10; sẵn sàng để Codex kiểm tra lại.

## 1. Thông tin thực hiện

- **Người thực hiện:** Antigravity (Chủ trì kỹ thuật)
- **Cơ chế nghiệm thu:** Codex rà soát hợp đồng dữ liệu trước khi các gói 02, 03, 04 triển khai đồng thời.
- **Ngày:** 18/09/2026 (Cập nhật sau khi khắc phục R01–R08 và hoàn thiện quy tắc phân nhánh XOR)
- **Files/Modules đã cập nhật:**
  - `web/src/contracts/card.ts`: Hỗ trợ ngày lịch thực tế (`isValidCalendarDate`); quy tắc phân nhánh `StepBranchSchema` bắt buộc đúng một trong hai trường `when` hoặc `condition` (`(when !== undefined) !== (condition !== undefined)`), từ chối khi có cả hai hoặc thiếu cả hai; câu hỏi `questions` trong SERVICE; `PublicCardDTOSchema` dạng `discriminatedUnion` có `superRefine` trực tiếp từ chối payload không hợp lệ (`availability !== "available"` có body/actions, hoặc `isSynthetic: true` có `isVerified: true`).
  - `web/src/contracts/research.ts`: Chuẩn hóa `ResearchResponseSchema` bắt buộc `citations` và `claims` mapping khi `status: "ok"` (`claims.length >= 1`, mọi `citationIds` phải tồn tại trong citations).
  - `web/src/contracts/validator.ts`:
    + Tích hợp tiền kiểm duyệt `validateContentCard` ngay trong `toPublicCardDTO()`; nếu vi phạm nghiệp vụ (thiếu reviewer, thiếu reviewedAt, sai hạn...) lập tức fail-closed chuyển `availability: "not_found"`, `isVerified: false`, xóa sạch `body` và `actions`.
    + Mặc định `asOfDate = new Date()` cho cả `validateContentCard()` và `toPublicCardDTO()`, chặn thẻ có ngày duyệt tương lai ngay cả khi gọi hàm mặc định không truyền options.
    + Kiểm tra phân nhánh SERVICE: từ chối nhánh có cả 2 trường `when` và `condition`; thẩm định độc lập từng trường `when`/`condition` (kiểm tra `questionId` tồn tại và giá trị `equals` phải thuộc tập hợp lựa chọn hợp lệ `options` + `unknownOption`).
    + Kiểm tra `step -> claim -> source`, yêu cầu bằng chứng cho bước procedural của thẻ published, kiểm tra thứ tự ngày và múi giờ Việt Nam (`Asia/Ho_Chi_Minh` UTC+7).
  - `web/scripts/validate-content.ts`: Quét đệ quy và phát hiện trùng lặp ID xuyên suốt toàn bộ các file trong catalog.
  - `web/fixtures/cards.fixture.json`: Làm sạch danh xưng người duyệt thành `"Người rà soát giả lập A/B"`, bổ sung branches/questions cho thẻ thủ tục tạm trú.
  - `web/tests/contracts.test.ts`: Mở rộng lên 28 unit tests đối chiếu trực tiếp các trường hợp probe của Codex, kiểm thử độc lập nhánh `condition`/`when` và từ chối khi có cả hai.
  - `web/tests/validate-content.test.ts`: Integration test kiểm tra phát hiện trùng lặp ID xuyên file và dữ liệu hỏng trong thư mục tạm.

## 2. Kết quả khắc phục các điểm Review R01–R08

| Mã | Mức độ | Vấn đề phát hiện | Giải pháp khắc phục của Antigravity | Kết quả sau sửa |
|---|:---:|---|---|:---:|
| **R01** | P1 | Trạng thái review vẫn available; Public DTO lộ body/actions của thẻ withdrawn/expired; synthetic nhận `isVerified: true` | - `calculateAvailability`: chỉ `status === "published"` mới có thể `available`; `draft` và `review` trả về `not_found`.<br>- `toPublicCardDTO`: khi `availability !== "available"`, `body` là `undefined`, `actions` rỗng, có thông báo chuyển tiếp.<br>- `isVerified` chỉ `true` khi thẻ thật (`!card.isSynthetic`), published và available. | **ĐẠT** |
| **R02** | P1 | Validator bỏ qua kiểm tra `step.claimIds`; thẻ published không có bằng chứng vẫn hợp lệ | - Kiểm tra `step.claimIds` phải tồn tại trong `claimsWithSources`.<br>- Thẻ published có bước nghiệp vụ (`stepType: "procedural"`) bắt buộc phải có ít nhất 1 `claimId` trỏ tới nguồn.<br>- Kiểm tra tính duy nhất của claim IDs và source IDs. | **ĐẠT** |
| **R03** | P1 | Ngày giả (`2026-99-99`, `2026-02-30`) qua regex và coi là còn hạn; không dùng `asOfDate` | - Bổ sung hàm `isValidCalendarDate` kiểm tra ngày lịch thực tế.<br>- Ngày không parse được hoặc sai lịch sẽ fail-closed (coi là `expired`).<br>- Tính hạn `reviewDue` theo mốc cuối ngày `23:59:59.999` giờ Việt Nam (`Asia/Ho_Chi_Minh` UTC+7).<br>- Kiểm tra thứ tự: `reviewedAt <= reviewDue` và `reviewedAt <= asOfDate`. | **ĐẠT** |
| **R04** | P1 | Trùng ID giữa các file không bị phát hiện; build chưa gắn cổng kiểm duyệt | - `validate-content.ts` thu thập toàn bộ thẻ và kiểm tra duy nhất ID xuyên suốt tất cả các file.<br>- Thêm integration test với thư mục tạm.<br>- Gắn cổng vào build: `"build": "npm run content:validate && next build"`. | **ĐẠT** |
| **R05** | P2 | Thẻ SERVICE chưa biểu diễn được phân nhánh theo điều kiện | - Mở rộng `ServiceStepSchema` hỗ trợ `branches` (với `when: { questionId, equals }` hoặc `condition` và `nextStepId`).<br>- Bổ sung danh mục `questions` trong `ServiceBodySchema`.<br>- Validator kiểm tra `questionId` và `nextStepId` của nhánh rẽ phải tồn tại. | **ĐẠT** |
| **R06** | P2 | `ResearchResponse` cho `status: "ok"` dù không có citations và không có mapping bằng chứng | - `ResearchResponseSchema` ràng buộc: khi `status === "ok"`, bắt buộc `citations.length >= 1`, `answer` không rỗng và có danh sách `claims` trỏ tới citation IDs hợp lệ. | **ĐẠT** |
| **R07** | P2 | Public DTO cho phép `type` và `body` trái nhau | - Chuyển `PublicCardDTOSchema` thành `z.discriminatedUnion("type", [...])`.<br>- Khi đổi `type` sang `PLACE` mà giữ `ServiceBody`, schema lập tức từ chối. | **ĐẠT** |
| **R08** | P2 | Next.js 14 không còn thuộc bản hỗ trợ (Unsupported) | - Đã nâng cấp lên Next.js 15.5.25 Maintenance LTS cùng React 19.3.0 và cập nhật lockfile đồng bộ.<br>- Chuyển script lint sang `eslint .`. | **ĐẠT** |

## 2.1. Kết quả khắc phục các điểm kiểm thử bổ sung (Re-test Feedback)

| Mức | Vấn đề phát hiện | Giải pháp khắc phục của Antigravity | Kết quả sau sửa |
|:---:|---|---|:---:|
| **P1** | Thẻ thiếu người duyệt bị validator từ chối, nhưng `toPublicCardDTO()` vẫn trả `isVerified: true`. | Tích hợp kiểm tra tính hợp lệ qua `validateContentCard()` ngay trong `toPublicCardDTO()`. Thẻ thiếu reviewer, thiếu reviewedAt hoặc có lỗi nghiệp vụ lập tức fail-closed: trả `availability: "not_found"`, `isVerified: false`, xóa `body` và `actions`. | **ĐẠT** |
| **P1** | Ngày duyệt `2099-01-01` vẫn qua kiểm tra mặc định và được đánh dấu xác minh do không truyền `asOfDate`. | Mặc định `asOfDate = new Date()` (thời điểm gọi hàm thực tế) tại cả `validateContentCard()` và `toPublicCardDTO()`, bảo đảm ngày duyệt tương lai bị từ chối ngay cả khi gọi hàm mặc định. | **ĐẠT** |
| **P2** | Research trả `status: "ok"` với citation nhưng không có claim mapping vẫn được chấp nhận. | Siết chặt `ResearchResponseSchema`: khi `status === "ok"`, bắt buộc `claims.length >= 1`, và kiểm tra toàn bộ `citationIds` trong từng claim phải tồn tại trong danh mục `citations`. | **ĐẠT** |
| **P2** | Phân nhánh SERVICE: Cho phép đồng thời cả `when` và `condition`, dẫn tới trường hợp `condition` trỏ câu hỏi không tồn tại bị bỏ qua; so khớp option không có. | - Bắt buộc đúng một trong hai trường ở `StepBranchSchema`: `(when !== undefined) !== (condition !== undefined)`, từ chối khi có cả hai hoặc thiếu cả hai.<br>- `validator.ts` từ chối nhánh có cả hai, đồng thời thẩm định độc lập từng trường `when`/`condition` (kiểm tra `questionId` tồn tại trong questions và `equals` khớp options hợp lệ). | **ĐẠT** |
| **P2** | `PublicCardDTOSchema` cho phép payload tự tạo chứa `isVerified: true` khi `isSynthetic: true` hoặc chứa `body`/`actions` khi không available. | Bổ sung `superRefine` trực tiếp trong `PublicCardDTOSchema` để từ chối payload ở tầng schema parser: cấm `body`/`actions`/`isVerified: true` khi `availability !== "available"`, và cấm `isVerified: true` khi `isSynthetic: true`. | **ĐẠT** |

## 3. Kết quả chạy Probe của Codex (`delivery/qa/review-00-01-probes.ts`)

Kết quả chạy thực tế với lệnh `npx tsx ../delivery/qa/review-00-01-probes.ts` từ thư mục `web/`:

```json
{
  "review_status_available": "not_found",
  "invalid_date": {
    "accepted": false,
    "availability": "expired"
  },
  "dangling_claim_accepted": false,
  "unsourced_steps_accepted": false,
  "withdrawn_public_body": false,
  "synthetic_verified": false,
  "mismatched_public_type_accepted": false,
  "ok_without_citations_accepted": false,
  "cross_file_validation_pattern": {
    "fileA": true,
    "fileB": true,
    "combined": false
  },
  "branch_field_survives_schema": true
}
```

> Toàn bộ 10 probe criteria của Codex đều ghi nhận kết quả bảo vệ hợp lệ (fail-closed, từ chối thẻ vi phạm và sanitize dữ liệu public DTO).

## 4. Dọn dẹp trước phát hành (Cleanups)

- **Làm sạch danh xưng fixture:** Đã thay thế toàn bộ tên người thật trong `fixtures/cards.fixture.json` thành `"Người rà soát giả lập A"` và `"Người rà soát giả lập B"`.
- **Làm sạch metadata tác giả:** Đã cập nhật metadata trong `src/app/layout.tsx` thành `"Nhóm tác giả Cuộc thi Sáng tạo Liên Chiểu 2026"`.

## 5. Kết quả kiểm tra & Kiểm thử tự động thực tế

| Lệnh / Tác vụ | Kết quả | Bằng chứng thực tế |
|---|:---:|---|
| `npm run typecheck` | **PASS (exit 0)** | `tsc --noEmit` đạt 0 lỗi kiểu trên toàn dự án |
| `npm run lint` | **PASS (exit 0)** | `eslint .` chạy sạch không có cảnh báo hay lỗi |
| `npm run test` | **PASS (exit 0)** | **34/34 tests passed** trên 3 test suites (`smoke`: 4, `validate-content`: 2, `contracts`: 28) |
| `npx tsx ../delivery/qa/review-00-01-probes.ts` | **PASS (exit 0)** | 10/10 probe criteria đều đạt chuẩn bảo vệ fail-closed |
| `npm run content:validate` | **PASS (exit 0)** | Quét 7 thẻ fixture đạt chuẩn; catalog published rỗng hợp lệ |
| `npm run build` | **PASS (exit 0)** | Tiền kiểm duyệt đạt + Next.js 15.5.25 biên dịch static pages thành công |
| `npm run test:e2e` | **PASS (exit 0)** | 2/2 tests passed (Mobile Chrome & Desktop Chrome) |

## 6. Bàn giao

- **Mã nguồn hoàn tất:** `web/src/contracts/`, `web/fixtures/`, `web/scripts/validate-content.ts`, `web/tests/`.
- **Trạng thái:** Giữ trạng thái **REVIEW** để Codex kiểm tra lại (Re-review).
