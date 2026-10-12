import type { Metadata } from 'next';
import { config, vnd } from '@/lib/config';

export const metadata: Metadata = { title: 'Điều khoản sử dụng' };

export default function Terms() {
  return (
    <div className="wrap narrow" style={{ paddingTop: 32 }}>
      <h1>Điều khoản sử dụng</h1>
      <div className="prose">
        <h2>Bản chất dịch vụ</h2>
        <p>
          {config.brand} cung cấp lá số Tử Vi và luận giải mang tính văn hóa, giải trí và tự suy ngẫm. Nội dung không phải dự báo, không phải lời
          khuyên y tế, tâm lý, pháp lý, tài chính hay đầu tư. Đừng đưa ra quyết định quan trọng chỉ dựa trên lá số.
        </p>
        <h2>Gói Pro</h2>
        <p>
          Giá {vnd(config.pricePro)} cho một lá số, thanh toán một lần, không gia hạn tự động. Pro gắn với lá số đã lưu, không chuyển sang lá số
          khác. Nội dung số được mở ngay sau thanh toán nên đơn đã mở khóa không được hoàn tiền, trừ khi lỗi kỹ thuật từ phía chúng tôi khiến bạn
          không dùng được — khi đó liên hệ {config.owner.email} trong vòng 7 ngày.
        </p>
        <p>
          Nếu bạn xóa dữ liệu lá số, bản Pro của lá số đó cũng bị xóa theo và không khôi phục được.
        </p>
        <h2>Nội dung do AI viết</h2>
        <p>
          Phần luận giải tổng hợp và hỏi đáp (nếu có) do mô hình AI viết dựa trên dữ kiện lá số. AI có thể diễn đạt chưa chính xác; phần "Vì
          sao?" của từng cung là căn cứ gốc.
        </p>
        <h2>Sử dụng hợp lý</h2>
        <p>Không dùng dịch vụ để lập lá số của người khác khi chưa có sự đồng ý của họ, hoặc để gây áp lực, phân biệt đối xử với người khác.</p>
        <h2>Liên hệ</h2>
        <p>
          {config.owner.name}, {config.owner.address}. {config.owner.email}
        </p>
      </div>
    </div>
  );
}
