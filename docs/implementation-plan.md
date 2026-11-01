# Kế hoạch triển khai giao diện demo

Spec: ../../Ke_Hoach_Giao_Dien_Demo.md. Thư mục đích do người dùng chỉ định: Web tdtt.

- [x] Dữ liệu và thao tác mẫu tách khỏi DOM: khởi tạo kế hoạch, tính danh sách mua, cập nhật thực chi và chuyển ngày. Kiểm tra các ràng buộc có ảnh hưởng tới dữ liệu mẫu.
- [x] HTML ba trang và CSS responsive, khung dashboard sáu mục.
- [x] Tương tác, thiết lập, tài khoản mẫu, chat kịch bản, hướng dẫn và reset.
- [x] Kiểm tra desktop/mobile, các luồng chính, liên kết và lỗi console. Viết hướng dẫn chạy và nối backend.

Ruling: Làm tại thư mục người dùng chỉ định, không tạo worktree vì đây là thư mục demo mới chưa có repository hoặc code. Không triển khai hosting.
Ruling: Hệ thống mẫu có phép tính frontend để các màn hình nhất quán; không thay thế thuật toán hoặc đánh giá của đồ án hoàn chỉnh.

Kiểm tra dữ liệu: 6 bài kiểm tra Node cho ngân sách, giới hạn đầu vào, bỏ qua tồn kho hết hạn, giao dịch nguyên liệu, chống ghi hai lần, lượng mua chưa đủ và giới hạn ngày cuối.

Kiểm tra trình duyệt: mở file trực tiếp, chạy sáu mục ở 1440px và 390px, thử tạo/chỉnh kế hoạch, món không thịt, đổi món, yêu thích, cách nấu, chốt món, ghi thực chi, thêm kho, chuyển ngày, xem lịch sử, giao diện tối, chat điền form và tên hiển thị dạng văn bản. Đã sửa tràn ngang do nhãn đọc màn hình trong bảng và tăng nhãn nhỏ lên 12px. HTTP localhost bị giới hạn socket trong môi trường thực thi, nên đường chạy được kiểm tra là mở HTML trực tiếp.
