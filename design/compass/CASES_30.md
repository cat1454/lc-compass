# 30 trường hợp đối chiếu thiết kế

Các mẫu này là giả định, không phải phỏng vấn. Xem toàn bộ 10.000 tổ hợp trong CSV/JSONL.

## LC-00001
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt.

- Điều kiện: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt
- Căn cứ thiết kế: Nhu cầu trong phạm vi, điều kiện mô hình đã rõ và nội dung mô hình đã duyệt.
- Hành động: Tạo phiếu chuẩn bị theo nhánh đã duyệt; thể hiện điều đã biết, điều cần hỏi, nguồn và bước tiếp theo.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: không biến phiếu chuẩn bị thành kết luận đủ điều kiện

## LC-00002
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: chỉ biết tên quận cũ, chưa xác định phường hiện tại.

- Điều kiện: chỉ biết tên quận cũ, chưa xác định phường hiện tại
- Căn cứ thiết kế: Chưa xác định địa bàn thì không áp nội dung địa phương.
- Hành động: Hỏi lại phường hiện tại hoặc hỗ trợ xác minh địa bàn; chưa xuất checklist địa phương.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: không đoán địa giới từ tên đường hoặc tên quận cũ

## LC-00003
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: xác nhận việc cần giải quyết ở ngoài phường Liên Chiểu.

- Điều kiện: xác nhận việc cần giải quyết ở ngoài phường Liên Chiểu
- Căn cứ thiết kế: Phạm vi hướng dẫn phụ thuộc địa bàn được xác nhận.
- Hành động: Thông báo ngoài địa bàn; mở danh mục chính thức để người dùng chọn nơi phù hợp.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: không áp hướng dẫn địa phương sang nơi khác

## LC-00004
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: nguồn hướng dẫn đã quá ngày rà soát quy định trong bộ dữ liệu.

- Điều kiện: nguồn hướng dẫn đã quá ngày rà soát quy định trong bộ dữ liệu
- Căn cứ thiết kế: Nguồn không đạt điều kiện phát hành hướng dẫn chi tiết.
- Hành động: Tạm ngừng chi tiết bị ảnh hưởng; hiển thị nhu cầu cần xác minh và đầu mối đã xác nhận nếu có.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: không trình bày dữ liệu cũ như đang còn hiệu lực

## LC-00005
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: hai nguồn chính thức đưa thông tin khác nhau.

- Điều kiện: hai nguồn chính thức đưa thông tin khác nhau
- Căn cứ thiết kế: Nguồn không đạt điều kiện phát hành hướng dẫn chi tiết.
- Hành động: Tạm ngừng chi tiết bị ảnh hưởng; hiển thị nhu cầu cần xác minh và đầu mối đã xác nhận nếu có.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: không tự chọn nguồn thuận tiện hoặc ghép hai phiên bản

## LC-00006
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: người dùng chưa biết một điều kiện quyết định nhánh.

- Điều kiện: người dùng chưa biết một điều kiện quyết định nhánh
- Căn cứ thiết kế: Thiếu thông tin để chọn nhánh; cần làm rõ trước.
- Hành động: Hỏi một điều kiện còn thiếu bằng lựa chọn có phương án không biết; nếu vẫn thiếu, lập phiếu câu hỏi.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: cho phép không biết; không tự điền điều kiện

## LC-00007
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: người dùng định dán ảnh căn cước hoặc mã đăng nhập vào ô hỏi.

- Điều kiện: người dùng định dán ảnh căn cước hoặc mã đăng nhập vào ô hỏi
- Căn cứ thiết kế: Đầu vào nhạy cảm không cần thiết cho nhiệm vụ chuẩn bị.
- Hành động: Không nhận ảnh giấy tờ, mật khẩu, OTP; bỏ nội dung nhạy cảm và tiếp tục bằng thông tin phân loại.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: chặn đầu vào nhạy cảm trước khi gửi ra dịch vụ ngoài

## LC-00008
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: mất mạng sau khi đã mở được phiếu, không thể kiểm tra phiên bản mới.

- Điều kiện: mất mạng sau khi đã mở được phiếu, không thể kiểm tra phiên bản mới
- Căn cứ thiết kế: Có thể xem lại phiếu, nhưng không thể xác minh tính mới khi mất mạng.
- Hành động: Xem lại phiếu và ngày rà soát đã lưu tự nguyện; chờ có mạng để xác minh tiếp, không gửi gì.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: chỉ xem lại phiếu có mốc thời gian; không khẳng định vừa xác minh

## LC-00009
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: dịch vụ AI hết hạn mức hoặc không phản hồi.

- Điều kiện: dịch vụ AI hết hạn mức hoặc không phản hồi
- Căn cứ thiết kế: Nhu cầu trong phạm vi, điều kiện mô hình đã rõ và nội dung mô hình đã duyệt.
- Hành động: Tạo phiếu chuẩn bị theo nhánh đã duyệt; thể hiện điều đã biết, điều cần hỏi, nguồn và bước tiếp theo.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: luồng lựa chọn và phiếu đã duyệt vẫn phải dùng được

## LC-00010
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: đang có nguy cơ an toàn tức thời tại nơi ở hoặc nơi người dùng hiện diện.

- Điều kiện: đang có nguy cơ an toàn tức thời tại nơi ở hoặc nơi người dùng hiện diện
- Căn cứ thiết kế: Nguy cơ tức thời được ưu tiên hơn hành trình thủ tục.
- Hành động: Dừng hành trình thủ tục; ưu tiên liên hệ trợ giúp khẩn đã xác minh hoặc người hỗ trợ tại chỗ.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: ưu tiên tìm trợ giúp khẩn phù hợp, không tiếp tục hỏi thủ tục

## LC-00011
Là người ít quen thao tác số, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt.

- Điều kiện: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt
- Căn cứ thiết kế: Nhu cầu trong phạm vi, điều kiện mô hình đã rõ và nội dung mô hình đã duyệt.
- Hành động: Tạo phiếu chuẩn bị theo nhánh đã duyệt; thể hiện điều đã biết, điều cần hỏi, nguồn và bước tiếp theo.
- Điều chỉnh giao diện: câu ngắn, lựa chọn rõ, luôn có nút nhờ hỗ trợ
- Tránh: không biến phiếu chuẩn bị thành kết luận đủ điều kiện

## LC-00021
Là người không có điện thoại thông minh, xem qua người hỗ trợ, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt.

- Điều kiện: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt
- Căn cứ thiết kế: Nhu cầu trong phạm vi, điều kiện mô hình đã rõ và nội dung mô hình đã duyệt.
- Hành động: Tạo phiếu chuẩn bị theo nhánh đã duyệt; thể hiện điều đã biết, điều cần hỏi, nguồn và bước tiếp theo.
- Điều chỉnh giao diện: phiếu in hoặc xem cùng người hỗ trợ; không ép tạo tài khoản
- Tránh: không biến phiếu chuẩn bị thành kết luận đủ điều kiện

## LC-00031
Là người làm việc theo ca, chỉ rảnh ngoài giờ, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt.

- Điều kiện: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt
- Căn cứ thiết kế: Nhu cầu trong phạm vi, điều kiện mô hình đã rõ và nội dung mô hình đã duyệt.
- Hành động: Tạo phiếu chuẩn bị theo nhánh đã duyệt; thể hiện điều đã biết, điều cần hỏi, nguồn và bước tiếp theo.
- Điều chỉnh giao diện: lưu phiếu tự nguyện; không hứa có người trực 24/7
- Tránh: không biến phiếu chuẩn bị thành kết luận đủ điều kiện

## LC-00041
Là người dùng máy dùng chung tại điểm hỗ trợ, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt.

- Điều kiện: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt
- Căn cứ thiết kế: Nhu cầu trong phạm vi, điều kiện mô hình đã rõ và nội dung mô hình đã duyệt.
- Hành động: Tạo phiếu chuẩn bị theo nhánh đã duyệt; thể hiện điều đã biết, điều cần hỏi, nguồn và bước tiếp theo.
- Điều chỉnh giao diện: không lưu bền mặc định; kết thúc phiên phải xóa dữ liệu
- Tránh: không biến phiếu chuẩn bị thành kết luận đủ điều kiện

## LC-00051
Là người khó đi lại, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt.

- Điều kiện: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt
- Căn cứ thiết kế: Nhu cầu trong phạm vi, điều kiện mô hình đã rõ và nội dung mô hình đã duyệt.
- Hành động: Tạo phiếu chuẩn bị theo nhánh đã duyệt; thể hiện điều đã biết, điều cần hỏi, nguồn và bước tiếp theo.
- Điều chỉnh giao diện: ưu tiên kênh tiếp cận từ xa đã xác minh, không hứa xử lý tại nhà
- Tránh: không biến phiếu chuẩn bị thành kết luận đủ điều kiện

## LC-00061
Là người đang hỗ trợ người thân có sự đồng ý, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt.

- Điều kiện: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt
- Căn cứ thiết kế: Nhu cầu trong phạm vi, điều kiện mô hình đã rõ và nội dung mô hình đã duyệt.
- Hành động: Tạo phiếu chuẩn bị theo nhánh đã duyệt; thể hiện điều đã biết, điều cần hỏi, nguồn và bước tiếp theo.
- Điều chỉnh giao diện: hỗ trợ thao tác không đồng nghĩa đại diện pháp lý
- Tránh: không biến phiếu chuẩn bị thành kết luận đủ điều kiện

## LC-00071
Là người muốn làm giúp nhưng chưa hỏi ý kiến người liên quan, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt.

- Điều kiện: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt
- Căn cứ thiết kế: Chưa có sự đồng ý để cá nhân hóa hoặc chia sẻ cho người được hỗ trợ.
- Hành động: Chỉ hiển thị hướng dẫn chung; không cá nhân hóa hoặc chia sẻ thông tin người khác khi chưa có đồng ý.
- Điều chỉnh giao diện: chỉ hướng dẫn chung; không tạo hoặc chia sẻ phiếu cá nhân
- Tránh: không biến phiếu chuẩn bị thành kết luận đủ điều kiện

## LC-00081
Là người đọc tiếng Việt chưa thành thạo, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt.

- Điều kiện: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt
- Căn cứ thiết kế: Khả năng hiểu nội dung phải được bảo đảm trước khi tự thực hiện.
- Hành động: Dùng hướng dẫn đơn giản và đề nghị trợ đọc; không kết luận pháp lý từ bản dịch tự động.
- Điều chỉnh giao diện: bản dịch chỉ trợ đọc; trường hợp cần hiểu chính xác phải có hỗ trợ
- Tránh: không biến phiếu chuẩn bị thành kết luận đủ điều kiện

## LC-00091
Là người quay lại sau lần trước còn vướng, tôi muốn nhận diện việc cần hỏi khi mới thuê trọ, để không nhầm nhu cầu với thủ tục khác. Bối cảnh hiện tại: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt.

- Điều kiện: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt
- Căn cứ thiết kế: Nhu cầu trong phạm vi, điều kiện mô hình đã rõ và nội dung mô hình đã duyệt.
- Hành động: Tạo phiếu chuẩn bị theo nhánh đã duyệt; thể hiện điều đã biết, điều cần hỏi, nguồn và bước tiếp theo.
- Điều chỉnh giao diện: khôi phục thông tin tự chọn và hỏi việc còn vướng, không giả định hồ sơ đã nộp
- Tránh: không biến phiếu chuẩn bị thành kết luận đủ điều kiện

## LC-00101
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn lập phiếu chuẩn bị trước khi đăng ký tạm trú, để biết điều đã rõ và điều cần xác minh. Bối cảnh hiện tại: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt.

- Điều kiện: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt
- Căn cứ thiết kế: Nhu cầu trong phạm vi, điều kiện mô hình đã rõ và nội dung mô hình đã duyệt.
- Hành động: Tạo phiếu chuẩn bị theo nhánh đã duyệt; thể hiện điều đã biết, điều cần hỏi, nguồn và bước tiếp theo.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: không biến phiếu chuẩn bị thành kết luận đủ điều kiện

## LC-00206
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn chuẩn bị câu hỏi cần trao đổi với chủ nhà, để không tự kết luận giấy tờ thay chủ nhà. Bối cảnh hiện tại: người dùng chưa biết một điều kiện quyết định nhánh.

- Điều kiện: người dùng chưa biết một điều kiện quyết định nhánh
- Căn cứ thiết kế: Thiếu thông tin để chọn nhánh; cần làm rõ trước.
- Hành động: Hỏi một điều kiện còn thiếu bằng lựa chọn có phương án không biết; nếu vẫn thiếu, lập phiếu câu hỏi.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: cho phép không biết; không tự điền điều kiện

## LC-00309
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn mở đúng kênh chính thức về đăng ký tạm trú, để tiếp tục thao tác trên kênh có thẩm quyền. Bối cảnh hiện tại: dịch vụ AI hết hạn mức hoặc không phản hồi.

- Điều kiện: dịch vụ AI hết hạn mức hoặc không phản hồi
- Căn cứ thiết kế: Nhu cầu trong phạm vi, điều kiện mô hình đã rõ và nội dung mô hình đã duyệt.
- Hành động: Tạo phiếu chuẩn bị theo nhánh đã duyệt; thể hiện điều đã biết, điều cần hỏi, nguồn và bước tiếp theo.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: luồng lựa chọn và phiếu đã duyệt vẫn phải dùng được

## LC-00407
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn tìm bước tiếp theo khi không đăng nhập được kênh cư trú, để nhận hỗ trợ mà không giao mật khẩu hay OTP. Bối cảnh hiện tại: người dùng định dán ảnh căn cước hoặc mã đăng nhập vào ô hỏi.

- Điều kiện: người dùng định dán ảnh căn cước hoặc mã đăng nhập vào ô hỏi
- Căn cứ thiết kế: Đầu vào nhạy cảm không cần thiết cho nhiệm vụ chuẩn bị.
- Hành động: Không nhận ảnh giấy tờ, mật khẩu, OTP; bỏ nội dung nhạy cảm và tiếp tục bằng thông tin phân loại.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: chặn đầu vào nhạy cảm trước khi gửi ra dịch vụ ngoài

## LC-00506
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn hiểu cần hỏi gì khi hồ sơ tạm trú được yêu cầu bổ sung, để làm rõ yêu cầu mà không tự suy đoán quyết định. Bối cảnh hiện tại: người dùng chưa biết một điều kiện quyết định nhánh.

- Điều kiện: người dùng chưa biết một điều kiện quyết định nhánh
- Căn cứ thiết kế: Thiếu thông tin để chọn nhánh; cần làm rõ trước.
- Hành động: Hỏi một điều kiện còn thiếu bằng lựa chọn có phương án không biết; nếu vẫn thiếu, lập phiếu câu hỏi.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: cho phép không biết; không tự điền điều kiện

## LC-00608
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn tiếp tục phiếu chuẩn bị tạm trú đang làm dở, để không phải kể lại toàn bộ nhu cầu. Bối cảnh hiện tại: mất mạng sau khi đã mở được phiếu, không thể kiểm tra phiên bản mới.

- Điều kiện: mất mạng sau khi đã mở được phiếu, không thể kiểm tra phiên bản mới
- Căn cứ thiết kế: Có thể xem lại phiếu, nhưng không thể xác minh tính mới khi mất mạng.
- Hành động: Xem lại phiếu và ngày rà soát đã lưu tự nguyện; chờ có mạng để xác minh tiếp, không gửi gì.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: chỉ xem lại phiếu có mốc thời gian; không khẳng định vừa xác minh

## LC-00701
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn mang phiếu vướng mắc tạm trú đến người hỗ trợ, để người hỗ trợ hiểu việc còn vướng. Bối cảnh hiện tại: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt.

- Điều kiện: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt
- Căn cứ thiết kế: Nhu cầu trong phạm vi, điều kiện mô hình đã rõ và nội dung mô hình đã duyệt.
- Hành động: Tạo phiếu chuẩn bị theo nhánh đã duyệt; thể hiện điều đã biết, điều cần hỏi, nguồn và bước tiếp theo.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: không biến phiếu chuẩn bị thành kết luận đủ điều kiện

## LC-00801
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn chuyển từ nhu cầu tạm trú sang thường trú, để được chuyển sang nguồn đúng phạm vi. Bối cảnh hiện tại: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt.

- Điều kiện: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt
- Căn cứ thiết kế: Nhu cầu này chưa nằm trong gói nội dung thí điểm.
- Hành động: Nêu rõ chưa hỗ trợ nhu cầu này; dẫn danh mục chính thức, không bịa câu trả lời để giữ người dùng.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: không biến phiếu chuẩn bị thành kết luận đủ điều kiện

## LC-01001
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn tìm hiểu trước khi mở quán ăn sáng, để biết các điều kiện cần xác minh trước khi đầu tư. Bối cảnh hiện tại: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt.

- Điều kiện: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt
- Căn cứ thiết kế: Nhu cầu này chưa nằm trong gói nội dung thí điểm.
- Hành động: Nêu rõ chưa hỗ trợ nhu cầu này; dẫn danh mục chính thức, không bịa câu trả lời để giữ người dùng.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: không biến phiếu chuẩn bị thành kết luận đủ điều kiện

## LC-02001
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn tìm trường mầm non sau khi chuyển chỗ ở, để kiểm tra thông tin tuyển sinh phù hợp. Bối cảnh hiện tại: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt.

- Điều kiện: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt
- Căn cứ thiết kế: Nhu cầu này chưa nằm trong gói nội dung thí điểm.
- Hành động: Nêu rõ chưa hỗ trợ nhu cầu này; dẫn danh mục chính thức, không bịa câu trả lời để giữ người dùng.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: không biến phiếu chuẩn bị thành kết luận đủ điều kiện

## LC-09001
Là người có thể tự thao tác trên điện thoại cá nhân, tôi muốn chọn hành trình tham quan trong hai giờ, để tính cả thời gian đi lại và điều kiện mở cửa. Bối cảnh hiện tại: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt.

- Điều kiện: thông tin tối thiểu đã rõ, nguồn và đầu mối trong mô hình đã được duyệt
- Căn cứ thiết kế: Nhu cầu này chưa nằm trong gói nội dung thí điểm.
- Hành động: Nêu rõ chưa hỗ trợ nhu cầu này; dẫn danh mục chính thức, không bịa câu trả lời để giữ người dùng.
- Điều chỉnh giao diện: hiển thị ngắn, rõ từng bước
- Tránh: không biến phiếu chuẩn bị thành kết luận đủ điều kiện
