# Kiểm tra trang chủ ngày 01 tháng 11 năm 2026

Phạm vi triển khai: index.html, css/home.css và js/home.js. Giữ nguyên mã xử lý, dữ liệu và các màn hình dashboard. Kiểm tra tài nguyên được cập nhật để nhận diện liên kết file có fragment như dashboard.html#menu.

## Đã kiểm tra

- Chrome DevTools MCP: render và screenshot toàn trang ở desktop 1440 × 1000 và điện thoại 390 × 844; screenshot tablet 768 × 1024. Kiểm tra thêm độ rộng 320px khi mở toàn bộ phần xem thêm.
- Không tràn ngang toàn trang ở các kích thước đã kiểm tra; dải tình huống cuộn trong vùng riêng.
- Ảnh và font đóng gói tải được khi mở file HTML trực tiếp. Không thêm dependency hoặc kết nối API.
- Menu điện thoại mở/đóng, chọn liên kết sẽ đóng menu; liên kết section có đích hợp lệ.
- Dải nội dung: trước/sau, xem thêm, mũi tên bàn phím, chỉ báo khoảng thẻ đang nhìn thấy, tự chuyển sau 6,5 giây, tạm dừng giữ nguyên vị trí hơn một chu kỳ chuyển.
- Reduced-motion: không chạy animation hero và mặc định tắt tự chuyển. Thao tác xem thêm và điều hướng vẫn dùng được.
- Bảng số liệu biểu đồ và giải thích Premium mở được; nhãn dữ liệu minh họa nằm ngay tại vùng liên quan. Tình huống không giả là lời chứng thực khách hàng thật.
- Console Chrome không có lỗi hoặc cảnh báo trong luồng kiểm tra.
- Kiểm tra Node cho dữ liệu demo hiện có và kiểm tra đường dẫn tài nguyên.

## Polish và giới hạn kiểm tra

Đã rà bố cục, khoảng cách, line-height, kiểu chữ và nhãn nhỏ; sửa chữ dính khi ẩn ngắt dòng trên mobile, tăng nhãn lên tối thiểu 12px, làm rõ chỉ báo carousel và màu focus trên khu vực Premium. Detector đã chạy một lần; các cảnh báo về sắc chữ và bóng đã xử lý bằng màu xanh nhạt có chủ đích và bóng trung tính. Đã thêm khoảng cách dưới nhãn biểu đồ và các mục quy trình. Không coi kết quả detector là bằng chứng thay thế cho xem bản render.

Chưa kiểm tra Safari/Firefox, thiết bị vật lý, trình đọc màn hình thực hoặc các dịch vụ AI/OCR/thanh toán. Phần Premium chỉ là nội dung giới thiệu tính năng dự kiến. Màu chữ trên ảnh đã xem qua bản render, chưa đo contrast ở mọi pixel của ảnh.

PRODUCT.md và sidecar Impeccable dùng schema cũ đã có từ trước. Không tự nâng schema trong đợt làm trang chủ này; các lệnh init/document có thể được dùng riêng nếu người dùng muốn cập nhật ngữ cảnh công cụ.

Bản nháp Premium của yêu cầu trước vẫn được giữ trong Git stash; không áp dụng hoặc xóa trong đợt này.
