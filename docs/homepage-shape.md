# Đề xuất thiết kế trang chủ Bếp Sinh Viên

Trạng thái: người dùng đã duyệt bằng “oke”; đã triển khai và kiểm tra ngày 01/11/2026.

## Mục tiêu và phạm vi

Trang chủ là index.html: giới thiệu sản phẩm cho sinh viên, đồng thời đủ rõ để trình bày với giảng viên. CTA chính mở bản demo dashboard hiện có. Chỉ thay frontend trang chủ và tương tác trình diễn; giữ nguyên dữ liệu, thuật toán và luồng của dashboard. HTML/CSS/JavaScript thuần; không thêm thư viện.

## Hướng đề xuất Một ngày ăn uống có kế hoạch

Giữ nhận diện xanh lá, trắng ngà và font Be Vietnam Pro. Bố cục kể chuyện qua ngân sách, bữa ăn và nguyên liệu còn lại. Chiều sâu đến từ ảnh món ăn lớn, mặt phẳng màu có phân cấp, chồng lớp có kiểm soát và sự tương phản giữa vùng đặc/rỗng; không dùng một lưới thẻ đồng kích thước cho toàn trang.

1. Hero: tiêu đề Ăn đủ bữa vừa túi tiền; ảnh món ăn lớn; một tóm tắt kế hoạch mẫu 500.000đ trong 10 ngày; CTA Khám phá bản demo và liên kết Xem cách hoạt động. Trên mobile, tiêu đề và CTA xuất hiện trước ảnh.
2. Một ngày ở Bếp: một thẻ thực đơn lớn; một vùng ngân sách và biểu đồ cột dự chi/thực chi; một danh sách nguyên liệu nên dùng sớm. Chênh lệch kích thước bám mức độ quan trọng của nội dung. Biểu đồ có chú giải, số liệu đọc được và bảng/text thay thế; nhãn Dữ liệu minh họa ngay cạnh biểu đồ.
3. Ba thao tác có liên kết: Đặt kế hoạch, Chọn món và đi chợ, Cập nhật và tận dụng phần dư. Hiển thị như một luồng, không lặp ba thẻ marketing giống nhau. Các nút dẫn vào các mục hiện có của dashboard, không ghi lại dữ liệu.
4. Premium: một vùng xanh đậm giới thiệu quyền lợi dự kiến AI không giới hạn lượt hỏi, quét hóa đơn và giải thích dinh dưỡng theo món yêu thích. Ghi rõ giao diện mô phỏng; chưa có API, OCR, thanh toán hoặc giá chính thức. Phần giới thiệu không giả các chức năng đã hoạt động thật.
5. Góc nhìn trải nghiệm: tiêu đề và nhãn Nội dung minh họa đặt ngay tại section. Dải thẻ ghi rõ tình huống giả định sinh viên, không dùng tên/ảnh khách hàng thật hoặc số sao như chứng thực. Có trước/sau, tạm dừng/tiếp tục, chỉ báo vị trí và xem thêm nội dung. Không phát lại tự động khi người dùng đã tạm dừng; reduced-motion mặc định tắt tự chạy.
6. CTA cuối trang và footer gọn: dẫn vào bản demo, giải thích giới hạn dữ liệu mẫu và liên kết điều hướng thiết yếu.

## Hai hướng thay thế

- Bố cục biên tập: ảnh món ăn và typography chiếm trọng tâm; thông tin theo khối lớn nhỏ như một bài giới thiệu. Mạnh về hình ảnh, cần thêm thao tác để xem đủ tính năng.
- Bố cục thiên về công cụ: màn hình minh họa ngân sách/thực đơn là trọng tâm; ảnh món ăn đóng vai trò phụ. Rõ chức năng, ít cảm giác trải nghiệm ẩm thực hơn.

## Tương tác và kiểm tra sau khi duyệt

Hiệu ứng nhẹ cho hover, đổi trạng thái và chuyển nội dung; không bắt buộc chạy hiệu ứng để đọc trang. Focus rõ, điều khiển tối thiểu 44px, cỡ chữ nội dung 15–16px. Bố cục một cột trên điện thoại, phân vùng trên tablet và bất đối xứng trên desktop. Carousel không cướp focus, dừng khi thao tác bàn phím hoặc hover.

Triển khai lần lượt hero, khu vực nội dung và biểu đồ, luồng sử dụng, Premium, đánh giá minh họa, CTA/footer. Dùng Chrome DevTools MCP kiểm tra render và screenshot ở desktop, tablet và điện thoại; thử điều hướng, carousel, tạm dừng, xem thêm, focus và reduced-motion. Kết thúc bằng polish, báo riêng những gì đã và chưa kiểm tra.

Các thay đổi Premium trước yêu cầu trang chủ đã được giữ trong Git stash mang tên WIP premium UI - paused for homepage shape approval. Chưa hoàn thành, chưa push. Không coi bản nháp này là chức năng đang có của sản phẩm.
