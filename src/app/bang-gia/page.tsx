import type { Metadata } from 'next';
import Link from 'next/link';
import { config, vnd } from '@/lib/config';

export const metadata: Metadata = { title: 'Bảng giá' };

export default function Pricing() {
  const ai = !!process.env.ANTHROPIC_API_KEY;
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
            <li>Đọc chi tiết cung Mệnh, kèm căn cứ</li>
            <li>Danh sách đại vận, tóm tắt năm nay</li>
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
            <li>Đọc chi tiết 11 cung còn lại, mỗi nhận định kèm căn cứ</li>
            <li>Tứ Hóa của từng đại vận 10 năm</li>
            <li>Lưu niên đầy đủ năm nay và năm sau</li>
            {ai && <li>Bản luận giải tổng hợp và {config.aiQuestionsLimit} câu hỏi đáp về lá số (AI, có dẫn căn cứ)</li>}
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
