# Tài khoản demo: database riêng

Chạy từ thư mục `Web tdtt` bằng Python 3.9 trở lên:

```powershell
python run_local.py
```

Mở `http://127.0.0.1:8000`. Không dùng `python -m http.server` cho luồng tài khoản. Không cần cài package. Máy chủ chỉ lắng nghe loopback; đây là server cục bộ cho phần tài khoản, chưa phải backend FastAPI đầy đủ trong `plan/`.

## Dữ liệu và phiên

- Database riêng: `var/demo-accounts.sqlite3`, tự tạo khi chạy. Không dùng chung file với database người dùng thật hoặc nghiệp vụ sau này. Biến môi trường `DEMO_ACCOUNTS_DB` cho phép đổi vị trí; đường dẫn tương đối tính từ gốc dự án. Không chọn file database người dùng thật cho biến này.
- Bảng `demo_accounts` chứa ID, tên hiển thị, thời điểm tạo. Tên được tạo ở server và lưu SQLite, không có tài khoản cố định, email giả hay mật khẩu nhúng trong frontend.
- Mỗi trình duyệt/phiên mới nhận một tài khoản riêng. Các tab cùng cookie dùng chung tài khoản. Vào lại trong thời hạn phiên sẽ khôi phục hồ sơ. Mở dashboard trực tiếp cũng tạo/khôi phục phiên.
- `demo_sessions` chỉ lưu SHA-256 của token ngẫu nhiên, hết hạn sau 7 ngày. Cookie `HttpOnly; SameSite=Strict`, JavaScript không đọc token. Do server local dùng HTTP loopback, chưa đặt Secure cookie; triển khai HTTPS phải bổ sung Secure.
- Sửa tên ghi vào SQLite. Thoát xóa phiên server và cookie, không xóa hồ sơ. Không có cơ chế khôi phục tài khoản cũ sau logout/hết hạn; lần vào sau tạo tài khoản mới. Chưa có đăng nhập bằng mật khẩu/đăng ký thật.
- Kế hoạch, thực đơn, tủ lạnh vẫn dùng localStorage như trước; chúng **chưa gắn quyền sở hữu theo tài khoản**. Logout không xóa chúng. Không dùng bản này như dịch vụ nhiều người dùng thật.
- Frontend chỉ nhận hồ sơ API để hiển thị trong bộ nhớ. Tên cũ trong bản lưu trình duyệt được bỏ khi nạp; tên sửa trong hồ sơ không ghi localStorage.

## API

| Method | URL | Hành vi |
| --- | --- | --- |
| POST | `/api/demo/account` | Tạo hoặc khôi phục phiên hiện có |
| GET | `/api/demo/account` | Đọc hồ sơ, trả 401 nếu chưa có phiên |
| PATCH | `/api/demo/account` | Sửa `display_name` của chính phiên hiện tại |
| DELETE | `/api/demo/account` | Thu hồi phiên và xóa cookie |

Request thay đổi cần Origin chính xác và header `X-Bep-Request: 1`. Server chỉ nhận Host `127.0.0.1:<port>`; không mở bằng `localhost`. Static chỉ phục vụ ba trang HTML và `css/`, `js/`, `assets/`. Database, backend, `.env`, `.git`, tài liệu không được phục vụ. Không đưa database vào assets hoặc dùng máy chủ static phục vụ toàn bộ gốc dự án.

`.gitignore` loại database và `var/` khỏi Git. GitHub chỉ chứa code/schema tạo database, không chứa hồ sơ hay phiên đã tạo. Sao lưu database riêng nếu cần giữ hồ sơ.

## Kiểm tra

```powershell
python -m unittest discover -s tests -p test_demo_accounts.py -v
node --test tests/demo-state.test.cjs tests/menu-planner.test.cjs
node tests/check-files.cjs
```

Integration test dùng database tạm và HTTP thật để kiểm tra hai phiên độc lập, lưu bền tên, token được băm, khôi phục phiên, logout/hết hạn, validation, chống request khác origin và chặn URL nội bộ. Không gọi provider hoặc database ngoài máy.

Đã kiểm tra ngày 09/11/2026: 3 integration test Python và 13 test Node đều qua; 47 liên kết tài nguyên hợp lệ. Chrome DevTools: nút vào demo mở dashboard, sửa tên cập nhật hồ sơ API/header, cookie không đọc được qua JavaScript; xem screenshot hồ sơ ở 1440px và 390px, không tràn ngang ở 390px. Chưa kiểm tra Safari, Firefox, thiết bị thật hoặc triển khai HTTPS. Trong khi kiểm tra đã gửi một PATCH thiếu tên và xác nhận server trả 400; đó là request kiểm tra, không phải lỗi luồng lưu tên hợp lệ.
