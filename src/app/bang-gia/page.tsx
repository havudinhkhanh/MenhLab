import type { Metadata } from 'next';
import Link from 'next/link';
import { config, vnd } from '@/lib/config';

export const metadata: Metadata = { title: 'Bảng giá' };

export default function Pricing() {
  return (
    <div className="wrap" style={{ paddingTop: 32 }}>
      <h1>Bảng giá</h1>
      <p className="hero-lede" style={{ marginBottom: 32 }}>
        Xem lá số và hiểu thuật ngữ luôn miễn phí. Trả tiền khi bạn muốn đọc sâu một lá số cụ thể — một lần, không gia hạn tự động.
      </p>
      <div className="plans">
        <div className="panel plan">
          <h3>Free</h3>
          <p className="price">0₫</p>
          <ul>
            <li>Lá số đầy đủ 12 cung, hơn 100 sao</li>
            <li>Giải thích mọi thuật ngữ ngay trên lá số</li>
            <li>Tổng quan: Bản Mệnh, Cục, Tứ Hóa năm sinh</li>
            <li>Diễn giải đầy đủ phần tính cách (cung Mệnh); câu trả lời ngắn cho 11 cung còn lại</li>
            <li>Các chặng 10 năm, tóm tắt năm nay, chi tiết tháng hiện tại</li>
            <li>Độ nhạy giờ sinh, các bước hiệu chỉnh giờ</li>
            <li>Xem nhanh không cần email, không lưu dữ liệu</li>
          </ul>
          <Link className="btn ghost" href="/#lap-la-so">
            Lập lá số miễn phí
          </Link>
        </div>
        <div className="panel plan featured">
          <h3>Pro — cho một lá số</h3>
          <p className="price">{vnd(config.pricePro)}</p>
          <ul>
            <li>Mọi thứ trong Free</li>
            <li>Diễn giải đầy đủ 11 cung còn lại bằng lời thường: công việc, tiền bạc, tình cảm, gia đình, sức khỏe — mỗi cung kèm việc nên làm và căn cứ</li>
            <li>Từng chặng 10 năm: cơ hội đến từ đâu, chuyện gì cần chuẩn bị</li>
            <li>Năm nay và năm sau: tiền đến từ đâu, dễ hao ở đâu, sức khỏe, tình cảm — và từng tháng nên làm gì</li>
            <li>Bản luận giải trọn đời viết riêng, đọc như một cuốn sách (in hoặc lưu PDF được)</li>
            <li>Bản in, lưu PDF</li>
          </ul>
          <p className="small muted">
            Thanh toán bằng chuyển khoản/VietQR. Mua Pro ngay trên trang lá số đã lưu. Vì nội dung số được mở ngay sau thanh toán, đơn đã mở khóa
            không hoàn tiền, trừ trường hợp lỗi kỹ thuật từ phía chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
}
