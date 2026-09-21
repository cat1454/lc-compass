# Codex review gói 00–01 — 18/09/2026

## Kết luận

**Chưa duyệt chuyển sang triển khai dựa trên contracts gói 01.** Gói 00 chạy/build được và đạt bố cục % ở các viewport đã kiểm tra; cần sửa lựa chọn Next.js không còn được hỗ trợ. Gói 01 có lỗi chức năng tái hiện được dù 19 test hiện có đều qua.

Chỉ thêm tài liệu/probe review và cập nhật trạng thái rà soát; không sửa source ứng dụng của Antigravity. Giữ báo cáo Antigravity nguyên trạng để đối chiếu.

## Kết quả kiểm tra thực tế

| Kiểm tra | Kết quả |
|---|---|
| npm.cmd run typecheck | PASS |
| npm.cmd run lint | PASS khi chạy ngoài sandbox |
| npm.cmd run test -- --no-cache | PASS 19/19 |
| npm.cmd run content:validate | PASS 7 fixture, catalog thật rỗng |
| npm.cmd run build | PASS, Next.js thực tế 14.2.35 |
| npm.cmd run test:e2e | PASS 2/2 smoke desktop/mobile |
| Kiểm bản build trên cổng riêng 4317 | Không tràn ngang ở 320/360/390/430/768/1024/1440; chữ nội dung 16px, nút cao 44px |
| Probe các trường hợp thiếu trong tests | Tái hiện các lỗi dưới đây |

PowerShell chặn npm.ps1 nên dùng npm.cmd. Lần đầu lint/test gặp EPERM ghi cache; test chạy lại với --no-cache, lint/build chạy ngoài sandbox. Build trong sandbox bị treo đã được dừng trước khi chạy lại thành công. Đây là hạn chế môi trường kiểm tra, không tính là lỗi ứng dụng.

UI hiện chỉ là khung, nút chưa điều hướng; đây là công việc gói 04, không yêu cầu gói 00 phải hoàn thành tác vụ dân sinh. Chưa kiểm điện thoại thật, phóng chữ 200%, Google thật hoặc người dùng thật. Không có API key nào được đọc/ghi trong review.

## R01 — P1: Trạng thái review vẫn khả dụng; public DTO chưa chặn nội dung không được phát hành

Vị trí: `web/src/contracts/validator.ts:128`, `:171`, `:173`.

`calculateAvailability` chỉ chặn draft/withdrawn; thẻ `status: review`, không reviewer/reviewedAt, reviewDue tương lai trả `available`. `toPublicCardDTO` vẫn đưa body/actions của thẻ withdrawn (và draft/expired) ra DTO công khai. Fixture synthetic published còn được gắn `isVerified: true`.

Tác động: các gói UI/loader sắp tới có thể dùng DTO này và hiển thị thông tin chưa duyệt/đã rút hoặc nhãn xác minh sai. Chưa có route nội dung thật nên chưa kết luận dữ liệu đã bị công khai trên ứng dụng hiện tại.

Sửa: chỉ published thật, validation đạt và còn hạn được trả nội dung chi tiết. Draft/review không khả dụng; expired/withdrawn trả trạng thái và thông tin chuyển hướng tối thiểu, không body/actions cũ. Fixture không bao giờ có nhãn verified thật. Nếu cần xem fixture, dùng chế độ preview nội bộ tách biệt.

Nghiệm thu: ma trận draft/review/published/withdrawn × synthetic/real × còn hạn/quá hạn; kiểm DTO và hành vi link trực tiếp. Không chỉ kiểm `isVerified` mà bỏ qua body.

## R02 — P1: Bỏ qua kiểm tra bước tham chiếu khẳng định và cho published không có bằng chứng cho bước

Vị trí: `web/src/contracts/validator.ts:74`, `:99`; `web/src/contracts/card.ts:76`, `:90`.

Probe thay `steps[0].claimIds` thành `['does-not-exist']`: validator vẫn trả true. Xóa toàn bộ claims và claimIds của các bước: thẻ có requiredDocs/hướng dẫn nghiệp vụ vẫn hợp lệ. Chỉ kiểm claim → source, chưa kiểm step → claim và không yêu cầu bằng chứng cho bước nghiệp vụ quan trọng.

Sửa: kiểm tồn tại/duy nhất claim IDs và source IDs; liên kết từng bước/khẳng định quan trọng với nguồn. Bước thuần UI có thể miễn bằng chứng bằng trường phân loại rõ ràng; không bắt mọi câu trang trí có trích dẫn. Không cho checklist nghiệp vụ published lách bằng mảng rỗng.

Nghiệm thu: claim không tồn tại, claim/source trùng ID, bước nghiệp vụ không có nguồn bị từ chối; bước UI được phân loại đúng vẫn hợp lệ.

## R03 — P1: Ngày giả được chấp nhận và coi là còn hạn

Vị trí: `web/src/contracts/card.ts:31`; `web/src/contracts/validator.ts:133`.

`reviewDue = '2026-99-99'` qua regex và validation; parse Date ra NaN, phép so sánh false, cuối cùng trả available. `fetchedAt` chỉ cần chuỗi không rỗng; chưa kiểm ngày có thật/thứ tự ngày.

Sửa: dùng kiểm tra ngày lịch thực; ngày không parse được phải fail closed. Kiểm reviewedAt không sau reviewDue; định nghĩa rõ hạn hết ngày theo múi giờ nghiệp vụ Asia/Ho_Chi_Minh. Không cho reviewedAt tương lai được coi đã rà soát ở asOfDate. `asOfDate` hiện được nhận nhưng chưa dùng ở validator.

Nghiệm thu: tháng 99, 30/02, năm nhuận, ngày đảo thứ tự, mốc cuối ngày và ngày tương lai. Không phải mọi sourceDate tương lai đều là lỗi nếu đó là thông báo sự kiện; áp đúng trường.

## R04 — P1: ID trùng giữa các file không bị phát hiện; build chưa gắn cổng kiểm tra nội dung

Vị trí: `web/scripts/validate-content.ts:60`, `:68`; `web/package.json` scripts.build.

CLI gọi validateCardCollection riêng từng file nên seenIds được đặt lại. Probe hai file logic với cùng ID: mỗi file đạt, gộp lại mới fail. Script cũng chỉ quét JSON tầng đầu. `npm run build` chỉ gọi next build, không chạy content:validate; dữ liệu lỗi có thể không làm build thất bại như CONTRACTS yêu cầu.

Sửa: thu thập toàn catalog published trước khi kiểm uniqueness, giữ file path để báo lỗi. Quy định chỉ cho file tầng đầu và báo lỗi khi có JSON trong thư mục con, hoặc hỗ trợ quét đệ quy rõ ràng. Gắn content validation vào build/prebuild. Giữ catalog rỗng hợp lệ; expired hợp lệ về schema nhưng không xuất chi tiết.

Nghiệm thu: integration test CLI dùng 2 file trùng ID phải exit khác 0; JSON hỏng/source tham chiếu sai cũng phải làm production build dừng. Test dùng thư mục tạm, không để dữ liệu lỗi trong catalog thật.

## R05 — P2: SERVICE chưa biểu diễn được nhánh theo điều kiện

Vị trí: `web/src/contracts/card.ts:70` và `:82`.

Hiện chỉ có nextStepId đơn, missingQuestions là string[] và một unknownOption chung. Không có liên kết giữa câu trả lời và bước tiếp theo. Probe thêm branches vào bước bị Zod bỏ mất. Gói 03 sẽ phải tự phát minh schema riêng hoặc chỉ làm checklist tuyến tính, trái kiến trúc đã chốt.

Sửa ở gói 01: chốt cấu trúc question ID / option / điều kiện / đích bước, có nhánh không biết; kiểm mọi đích và câu hỏi được tham chiếu tồn tại. Không cần một workflow engine tổng quát. Ghi cách mapping NavigationResult mới với mô hình Python để các gói không diễn giải khác nhau.

Nghiệm thu: fixture có ít nhất 2 câu trả lời dẫn tới 2 bước khác nhau và nhánh unknown; validator phát hiện đích/câu hỏi hỏng.

## R06 — P2: ResearchResponse cho ok dù không có citation; không giữ mapping khẳng định–nguồn

Vị trí: `web/src/contracts/research.ts:7`, `:48`.

Probe `{status:'ok', answer:'unsupported answer', retrievedAt:...}` qua schema và tự được điền citations=[]; Citation chỉ có URL/title/snippet, không có đoạn trả lời được hỗ trợ. Gói 05 không có hợp đồng để giữ metadata grounding đúng yêu cầu.

Sửa: phân biệt response ok có answer/citations và mapping hỗ trợ hợp lệ; không có bằng chứng trả no_evidence. Thêm cấu trúc liên kết đoạn/khẳng định với citation IDs; normalize metadata Google trong adapter. Link tồn tại không chứng minh nội dung đúng — review chỉ yêu cầu schema không đánh mất bằng chứng.

Nghiệm thu: ok rỗng/no citation bị từ chối; no_evidence hợp lệ; citation ID và đoạn tham chiếu không tồn tại bị phát hiện; attribution vẫn giữ theo nhà cung cấp.

## R07 — P2: Public DTO cho phép type và body trái nhau

Vị trí: `web/src/contracts/card.ts:195`, `:218`.

PublicCardDTOSchema dùng type enum độc lập với z.union(body). Đổi DTO SERVICE thành type PLACE nhưng giữ ServiceBody vẫn parse thành công. UI switch theo type không có discriminated type để bảo đảm trường body tương ứng.

Sửa: public DTO cũng là discriminatedUnion theo type, và trường availability phải chi phối việc có body như R01. Không dùng any để che lỗi của renderer.

Nghiệm thu: ba cặp type/body đúng pass; các cặp trái type fail và TypeScript narrowing sử dụng được.

## R08 — P2, gói 00: Next.js 14 không còn thuộc phiên bản được hỗ trợ

Vị trí: `web/package.json:16`, package-lock.json.

Build thực tế là Next.js 14.2.35. Chính sách chính thức đang liệt kê 16.x Active LTS, 15.x Maintenance LTS và 14.x Unsupported: https://nextjs.org/support-policy (kiểm tra 18/09/2026).

Đây không phải kết luận có CVE cụ thể đã được khai thác. Tuy nhiên lựa chọn bản không được hỗ trợ không phù hợp yêu cầu khởi tạo nền ổn định hiện hành để deploy mới.

Sửa: nâng lên bản stable được hỗ trợ, ưu tiên Active LTS; đồng bộ React/eslint/config/Node theo tài liệu chính thức và lockfile. Kiểm lại lint script khi nâng major; không giữ next lint nếu major mới không hỗ trợ. Chạy lại bộ checks sau nâng, ghi phiên bản resolved thật thay vì lẫn range package với bản engine.

## Cần dọn trước phát hành

- Fixture dùng tên/chức vụ người thật làm reviewer (`fixtures/cards.fixture.json:42`, `:144`...). Dù có isSynthetic, nên thay bằng “Người rà soát giả lập A”, không gán xác nhận chưa xảy ra cho đầu mối cuộc thi.
- metadata authors trong layout đang gán Đoàn phường; chưa có căn cứ đơn vị này là tác giả/chủ quản của app. Đổi thành nhóm dự thi hoặc để trống đến khi xác nhận.
- Trang người dân đang hiển thị tên package/framework và API key; chuyển sang thông báo người dùng hiểu được khi làm gói 04. Không tính là lỗi blocker của khung gói 00.
- Ba unit smoke test chỉ kiểm tra hằng số/phép tính, không kiểm source ứng dụng. E2E hiện chỉ kiểm heading; không coi 2 pass là tác vụ đã hoạt động.

## Giao Antigravity sửa

1. Sửa R01–R04 trước; thêm regression test đúng tình huống tái hiện.
2. Chốt R05–R07 trước khi các gói 03/04/05 dùng hợp đồng.
3. Nâng nền theo R08, dọn fixture/metadata gán tên thật.
4. Chạy lại typecheck/lint/unit/content/build/E2E, cập nhật REPORT 00/01 và trả về REVIEW.

Gói 02 có thể tiếp tục tìm nguồn và giữ draft; chưa xuất published theo contracts chưa duyệt. Không tự thay các test thành kỳ vọng chấp nhận lỗi.

## Tái hiện

Từ web chạy `node_modules/.bin/tsx.cmd ../delivery/qa/review-00-01-probes.ts`. Probe chỉ đọc fixture/source, in kết quả hiện tại; không ghi nội dung sản phẩm. Các giá trị true trong probe thể hiện trường hợp lỗi được chấp nhận, không phải PASS chất lượng.

`review-00-01-browser.cjs` mở riêng bản build ở cổng 4317 để kiểm layout, không dùng lại server dev bất kỳ. Bằng chứng: `review-00-01-browser.json`, `review-00-01-mobile.png`.
