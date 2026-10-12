import type { Metadata } from 'next';
import Link from 'next/link';
import RectifyTool from './RectifyTool';
import { T } from '@/components/TermLayer';

export const metadata: Metadata = {
  title: 'Tìm giờ sinh theo sự kiện đời',
  description: 'Không biết giờ sinh? So sánh 12 canh giờ với những sự kiện lớn trong đời bạn, có hiệu chuẩn với dữ liệu ngẫu nhiên để tránh kết luận ảo.',
};

export default function RectifyPage() {
  return (
    <div className="wrap" style={{ paddingTop: 32, maxWidth: 900 }}>
      <h1>Không rõ giờ sinh?</h1>
      <p className="hero-lede" style={{ marginBottom: 16 }}>
        Công cụ này so sánh các canh giờ có thể với những sự kiện lớn trong đời bạn, theo quy tắc vận hạn cổ điển, để tìm giờ phù hợp nhất. Mọi
        tính toán chạy ngay trên máy bạn, không gửi gì lên máy chủ.
      </p>

      <div className="note">
        <b>Trước khi dùng:</b> nguồn tốt nhất vẫn là giấy tờ — giấy chứng sinh của bệnh viện, sổ khám thai, sổ ghi chép của gia đình, hoặc
        hỏi người đã có mặt lúc bạn chào đời. Một giờ sinh ghi lại thật luôn đáng tin hơn mọi phép suy đoán.
      </div>

      <details className="more" style={{ marginBottom: 24 }}>
        <summary>Công cụ hoạt động thế nào và tin được đến đâu</summary>
        <div className="prose">
          <p>
            Với mỗi canh giờ, hệ thống lập một lá số. Mỗi sự kiện bạn nhập (ví dụ kết hôn năm 2015) được chấm điểm trên từng lá số: năm đó
            <T>Tiểu hạn</T>, <T>Lưu Thái Tuế</T> hay <T>Đại vận</T> có rơi vào cung liên quan (Phu Thê) không, <T>Lưu Tứ Hóa</T> có kích hoạt
            cung đó không. Mô tả tính cách bạn chấm được cộng thêm điểm nhỏ. Canh giờ có tổng điểm cao nhất là giả thuyết phù hợp nhất.
          </p>
          <p>
            Vấn đề là: với 12 lá số để chọn, kiểu gì cũng có một lá số "trúng" vài sự kiện do tình cờ. Vì vậy chúng tôi đã chạy mô phỏng với
            hàng chục nghìn bộ sự kiện bịa ngẫu nhiên và đặt ngưỡng sao cho công cụ chỉ nói "khá rõ" khi khoảng cách điểm lớn đến mức dữ kiện
            ngẫu nhiên chỉ tạo ra được khoảng 5% số lần.
          </p>
          <p>
            Ngược lại, nếu giả định quy tắc Tử Vi đúng và sự kiện đời người khớp quy tắc, công cụ chỉ ra đúng canh giờ khoảng 85–89% số lần với
            5 sự kiện và 92–94% với 8 sự kiện (trên dữ liệu mô phỏng). Nói cách khác: công cụ đủ nhạy nếu quy tắc đúng, và đủ thận trọng nếu dữ
            kiện chỉ là nhiễu.
          </p>
          <p>
            Điều công cụ <b>không</b> làm được: chứng minh giờ sinh thật, hay chứng minh Tử Vi đúng. Hệ thống quy tắc này chưa được kiểm định
            khoa học. Hãy coi kết quả là một giả thuyết để tham khảo. Xem thêm <Link href="/phuong-phap">Phương pháp</Link>.
          </p>
        </div>
      </details>

      <RectifyTool />
    </div>
  );
}
