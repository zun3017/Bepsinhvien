# Cập nhật tương tác trang chủ

Theo yêu cầu tiếp theo của người dùng, các nhãn demo, minh họa và không cần tài khoản đã được bỏ khỏi trang chủ. Dải nội dung được viết lại thành hướng dẫn và tình huống sử dụng, không trình bày như lời chứng thực khách hàng thật. Các mô tả giới hạn kỹ thuật vẫn nằm trong tài liệu phát triển thay vì giao diện người dùng.

## Biểu đồ tròn

Ba biểu đồ SVG dùng cùng bộ màu xanh/kem: quỹ còn lại 410.000đ trên 500.000đ, dự chi 48.000đ trên định mức 51.250đ, và hai ngày đã hoàn tất trong kế hoạch mười ngày. Phần trăm là số làm tròn để trình bày. Các giá trị cố định của trang giới thiệu không ghi hoặc thay đổi dữ liệu dashboard.

Rê chuột, focus bàn phím hoặc chạm chú giải sẽ đổi giá trị giữa vòng tròn. Bấm chọn giữ lựa chọn sau khi rời chuột. Có nhãn số liệu cho trình đọc màn hình và nút chú giải với aria-pressed.

## Cuộn và con trỏ

- IntersectionObserver hiện ảnh, đồ họa Premium và biểu đồ khi chúng đi vào khung nhìn. Mỗi khối hiện một lần, không ẩn lại khi cuộn ngược. Không dùng JavaScript thì nội dung vẫn hiển thị.
- Với chuột chính xác và không bật reduced-motion, ảnh/đồ họa nghiêng nhẹ tối đa khoảng 2 độ theo vị trí con trỏ. Thẻ ngân sách và biểu đồ có lớp nhấn màu tại vị trí trỏ. Xử lý con trỏ được gộp bằng requestAnimationFrame; rời chuột hoặc mất focus cửa sổ sẽ đặt lại hiệu ứng.
- Trên màn hình cảm ứng không dùng hiệu ứng nghiêng. Reduced-motion giữ nội dung hiện và tắt các chuyển động nghiêng/dịch chuyển.

## Kiểm tra Chrome DevTools MCP

Đã xem screenshot desktop 1440px và mobile 390px. Kiểm tra thêm 320px và tablet 768px: không tràn ngang, kể cả khi mở các nội dung chi tiết. Đã thử reveal khi cuộn, hover/click/focus chú giải, phản hồi độ nghiêng khi pointermove, trở về vị trí cũ khi pointerleave và chọn bằng chạm. Chế độ reduced-motion giữ các khối hiển thị và không nghiêng. Console không báo lỗi hoặc cảnh báo trong luồng kiểm tra.

Detector chạy một lần, còn cảnh báo khoảng cách dưới một mục danh sách từ hệ thống style hiện có. Bố cục thực tế đã được xem lại; mục cuối trên mobile không có đường viền dưới nên không cần khoảng đệm sau đường viền. Không dùng cảnh báo này làm lý do sửa style chung của dashboard.

Chưa kiểm tra Safari/Firefox hoặc thiết bị vật lý. Không thêm thư viện, API hay thay đổi logic ứng dụng.

## Bổ sung sau phản hồi về khu vực Premium và các thẻ tình huống

Nguyên nhân: danh sách selector ban đầu chưa gồm nutrition-visual, premium-feature và story-card. Vì vậy chỉ tờ hóa đơn trong khu vực Premium nhận hiệu ứng, còn các mục quyền lợi và thẻ tình huống chỉ có nội dung tĩnh.

Đã đưa các thẻ còn thiếu vào cơ chế con trỏ chung. Các thẻ tình huống có viền nhấn, bóng và nghiêng nhẹ; thẻ dinh dưỡng và bản xem trước hội thoại có nghiêng và nhấn màu theo vị trí trỏ. Ba quyền lợi Premium là nút thực, có hover/focus và trạng thái chọn, đổi bản xem trước giữa hội thoại, hóa đơn và dinh dưỡng. Giữ nguyên dashboard và dữ liệu.

Đã dùng công cụ hover thật của Chrome DevTools trên nút Premium và tiêu đề trong thẻ tình huống: xác nhận :hover, lớp phản hồi con trỏ, màu nền/viền và bóng thay đổi. Thử đủ ba chế độ xem trước ở desktop, mobile 390px và 320px, không tràn ngang. Reduced-motion tắt transform và console không báo lỗi. Cảnh báo khoảng cách danh sách từ style hiện có vẫn còn, không coi detector là kết quả sạch.
