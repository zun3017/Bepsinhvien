# Bếp Sinh Viên — giao diện demo

Chạy `python run_local.py` trong thư mục dự án, rồi mở **http://127.0.0.1:8000**. Tài khoản demo được lưu riêng trong **var/demo-accounts.sqlite3**, frontend lấy hồ sơ qua API. Không cần cài thư viện; ảnh và font đã đặt trong assets. Mở HTML trực tiếp vẫn xem được giao diện nhưng không dùng được tài khoản.

Chi tiết database, cookie, phạm vi và kiểm tra: [docs/demo-account-database.md](docs/demo-account-database.md). Tài khoản demo là phiên không mật khẩu; đăng ký/đăng nhập bằng email chưa triển khai. Kế hoạch vẫn lưu trình duyệt, chưa gắn với tài khoản. Database cục bộ không được push lên GitHub.

Trang chủ mới có hero, nội dung lớn/nhỏ, biểu đồ hai ngày mẫu, giới thiệu Premium dự kiến và dải tình huống minh họa. Các nút trước/sau, tạm dừng/tiếp tục và xem thêm hoạt động ngay trên trình duyệt. `css/home.css` và `js/home.js` chỉ áp dụng cho trang chủ; không thay đổi dữ liệu, thuật toán hoặc luồng dashboard. Tự chuyển dải nội dung được tắt mặc định khi bật chế độ giảm chuyển động, và tạm dừng khi thao tác bằng bàn phím.

Theo yêu cầu phát triển tiếp, trang chủ không gắn nhãn demo vào nội dung người dùng nhìn thấy. `js/home-effects.js` bổ sung ba biểu đồ tròn tương tác, hiệu ứng hiện ảnh khi cuộn và phản hồi theo con trỏ; có phương án cho cảm ứng và reduced-motion. Các biểu đồ trên trang giới thiệu dùng giá trị cố định, không đồng bộ hoặc ghi vào kế hoạch. Chi tiết kiểm tra tại `docs/homepage-interactions.md`.

## Nội dung

- index.html: giới thiệu dự án.
- login.html: biểu mẫu email chưa kết nối; nút vào demo tạo/khôi phục tài khoản từ database qua server. Không lưu mật khẩu.
- dashboard.html: sáu mục, thông báo, cài đặt sáng/tối, tài khoản, hướng dẫn, chat theo kịch bản và chỗ hỗ trợ Zalo.
- css/style.css: màu, font, thành phần dùng chung và các trang công khai.
- css/dashboard.css: bố cục quản lý, bảng, biểu đồ và responsive.
- css/chatbot.css: khung chat và nút nổi.
- js/demo-data.js: dữ liệu mẫu và thao tác mô phỏng, không truy cập DOM.
- js/app.js: điều hướng, lưu trình duyệt, thiết lập, tài khoản và thành phần dùng chung.
- js/planner-ui.js: nội dung sáu mục và thao tác biểu mẫu.
- js/chatbot-ui.js: trả lời cố định và nhận diện tiền theo mẫu, không gọi AI.
- js/login.js: đổi biểu mẫu và mở phiên demo qua API.
- js/demo-account.js: client API hồ sơ; không chứa tài khoản hoặc token cố định.
- backend/demo_accounts.py: schema và lưu trữ tài khoản demo SQLite riêng.
- run_local.py: server HTTP loopback phục vụ frontend theo allowlist và API tài khoản.
- assets: ảnh minh họa, favicon SVG và font Be Vietnam Pro.

## Kịch bản thuyết trình gợi ý

1. Mở dashboard.html. Giới thiệu 500.000đ / 10 ngày, ngày 3, còn 410.000đ và định mức 51.250đ.
2. Mở Thiết lập kế hoạch để cho thấy các ô nhập và lựa chọn. Nếu tạo mới, dữ liệu cũ sẽ đặt lại sau xác nhận.
3. Mở Thực đơn, thử đổi món, yêu thích và xem cách nấu. Chốt thực đơn để chuyển qua Đi chợ.
4. So sánh cột cần dùng/có thể dùng/cần mua. Chọn cửa hàng mẫu, điều chỉnh lượng mua và thực chi rồi cập nhật.
5. Mở Tủ lạnh xem phần dư, thêm nguyên liệu và lọc hạn dùng. Chuyển ngày để xem định mức và hạn dùng đổi theo ngày mô phỏng.
6. Mở Lịch sử để xem dự chi/thực chi. Thử trợ lý với “Hôm nay tôi chi 48.000đ”; thao tác điền form không tự ghi chi tiêu.
7. Vào Cài đặt → Khôi phục dữ liệu demo để trở lại kịch bản ban đầu trước lượt trình bày tiếp theo.

## Giới hạn và cách phát triển tiếp

Đây là bản demo frontend, không phải hệ thống đầy đủ. Giá, khoảng cách cửa hàng, ảnh và công thức đều minh họa. Ngày là ngày trong kế hoạch, không dùng ngày máy tính. Có server Python và cookie phiên tài khoản demo; chưa có đăng nhập mật khẩu, Supabase, AI, thông báo hệ thống hoặc gửi phản hồi Zalo. Ngưỡng 40.000đ/ngày là quy ước của bài toán, không phải khuyến nghị dinh dưỡng.

Dữ liệu được lưu với khóa localStorage `bep-sinh-vien-demo-v1`. Nếu trình duyệt cấm lưu, ứng dụng báo và dùng bộ nhớ tạm. Mỗi trình duyệt hoặc nguồn URL có dữ liệu riêng; mở file trực tiếp và chạy qua localhost có thể không chia sẻ bản lưu. Nút Copy có phần sao chép thủ công khi trình duyệt không hỗ trợ clipboard.

Khi có backend, thay việc gọi Demo trong planner-ui.js bằng lớp api-client.js; giữ HTML/CSS và cách dựng các mục. Chuyển dữ liệu món/giá và thao tác tồn kho/thực chi sang server. Mở rộng xác thực thật ở login từ phiên demo hiện có, thay phản hồi kịch bản của chatbot-ui.js bằng API. Khóa bí mật phải nằm ở server; không đưa vào HTML hoặc JavaScript trình duyệt. Hạn dùng và dị ứng cần dữ liệu và kiểm chứng đầy đủ trước khi sử dụng thực tế.

## Kiểm tra dành cho người phát triển

Chỉ cần Node nếu muốn chạy kiểm tra dữ liệu mẫu: `node --test tests/demo-state.test.cjs`.

Để kiểm tra qua HTTP: `python run_local.py`, mở http://127.0.0.1:8000/dashboard.html. Dùng server này để bảo vệ database và sử dụng API tài khoản; không phục vụ toàn bộ gốc dự án bằng máy chủ static. Kiểm tra backend: `python -m unittest discover -s tests -p test_demo_accounts.py -v`.

Ảnh lấy từ Unsplash qua các URL ghi tại assets/SOURCES.md; các ảnh chỉ minh họa bữa ăn, không khẳng định tương ứng chính xác với món. Font theo SIL Open Font License tại assets/fonts/OFL.txt. Tên, liên hệ và thành viên thật chờ nhóm bổ sung.
