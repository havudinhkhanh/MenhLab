# MệnhLab

Trang lá số Tử Vi theo hướng nâng cao hiểu biết: giải thích mọi thuật ngữ, luận giải có dẫn chứng, kiểm tra độ nhạy giờ sinh, nói thẳng giới hạn khoa học của Tử Vi.

**👉 Hướng dẫn setup từng bước: [SETUP.md](SETUP.md)**

## Tính năng

- **Lá số chính xác cho người Việt:** âm lịch theo múi giờ UTC+7 (không dùng lịch Trung Quốc), tự hiệu chỉnh múi giờ lịch sử (miền Nam UTC+8 giai đoạn 1960–1975, UTC+9 năm 1945), tùy chọn giờ Mặt Trời thực, quy ước giờ Tý và tháng nhuận.
- **Làm rõ đầu vào:** khung "Hệ thống hiểu là" hiển thị từng bước hiệu chỉnh trước khi lập lá số.
- **Giải thích mọi chữ:** chạm vào tên sao, độ sáng (M/V/Đ/H), Tứ Hóa, Tuần/Triệt, vòng sao để xem giải thích; Từ điển hơn 100 thuật ngữ.
- **Luận giải có căn cứ:** mỗi nhận định kèm "Vì sao?" (sao nào, ở đâu, chiếu từ đâu), câu hỏi tự kiểm chứng, không ngôn ngữ hù dọa.
- **Độ nhạy giờ sinh:** lá số thay đổi thế nào trong khoảng sai số giờ sinh và theo từng quy ước tính.
- **Tìm giờ sinh theo sự kiện đời** (`/chinh-gio`): xếp hạng các canh giờ theo những sự kiện lớn có năm và mô tả tính cách "mù", ngưỡng kết luận hiệu chuẩn bằng dữ liệu ngẫu nhiên, chạy hoàn toàn trên trình duyệt.
- **Hai trường phái độ sáng sao:** bảng sách Việt (mặc định) hoặc Toàn Thư; mỗi lá số liệt kê các sao hai bảng xếp khác nhau.
- **Free / Pro:** Free xem lá số, tổng quan, cung Mệnh; Pro mở 11 cung còn lại, Tứ Hóa từng đại vận, lưu niên 2 năm, bản in, AI (tùy chọn).
- **Xem nhanh không lưu:** không nhập email thì lá số được tính hoàn toàn trong trình duyệt.
- **Đồng ý tách mục đích, lưu bằng chứng; email teaser có nhãn [QC], từ chối nhận một chạm; quyền xóa dữ liệu.**
- **Thanh toán VietQR:** payOS tự động hoặc chuyển khoản + xác nhận thủ công ở `/admin`.

## Công nghệ

Next.js 16 (App Router), TypeScript · Supabase (Postgres) · Resend · payOS · Claude API (tùy chọn) · an sao lõi bằng [iztro](https://github.com/SylarLong/iztro) (MIT), phần đặc thù Tử Vi Việt Nam tự tính.

## Cấu trúc

```
src/lib/engine/   lịch âm VN, giờ sinh, an sao, độ nhạy
src/lib/reading.ts luận giải theo quy tắc, teaser email
src/content/      từ điển, ý nghĩa sao và cung
src/app/          các trang và API
supabase/schema.sql cơ sở dữ liệu
tests/            kiểm thử (npm test)
```

## Lưu ý

Tử Vi là một hệ thống văn hóa để tự suy ngẫm, chưa được khoa học chứng minh khả năng dự đoán. Nội dung trang không phải lời khuyên y tế, pháp lý hay đầu tư.
