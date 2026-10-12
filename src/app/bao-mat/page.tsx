import type { Metadata } from 'next';
import { config, CONSENT_TEXT, CONSENT_VERSION } from '@/lib/config';

export const metadata: Metadata = { title: 'Chính sách bảo mật' };

export default function Privacy() {
  const o = config.owner;
  return (
    <div className="wrap narrow" style={{ paddingTop: 32 }}>
      <h1>Chính sách bảo mật</h1>
      <p className="muted">Phiên bản {CONSENT_VERSION}. Áp dụng theo Luật Bảo vệ dữ liệu cá nhân 2025 và Nghị định 91/2020/NĐ-CP.</p>
      <div className="prose">
        <h2>Ai xử lý dữ liệu của bạn</h2>
        <p>
          Bên kiểm soát và xử lý dữ liệu: {o.name}, {o.address}. Liên hệ: {o.email}
          {o.phone ? `, ${o.phone}` : ''}.
        </p>

        <h2>Chúng tôi thu thập gì, vì sao</h2>
        <table className="simple" style={{ fontFamily: 'var(--sans)' }}>
          <thead>
            <tr>
              <th>Dữ liệu</th>
              <th>Mục đích</th>
              <th>Khi nào</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Giới tính, ngày giờ sinh, nơi sinh, tên hiển thị (có thể là biệt danh)</td>
              <td>Lập lá số. Không có giới tính và giờ sinh thì không lập được lá số Tử Vi.</td>
              <td>
                Xem nhanh: chỉ nằm trong trình duyệt của bạn, không gửi lên máy chủ. Lưu lá số: lưu trên máy chủ khi bạn đồng ý.
              </td>
            </tr>
            <tr>
              <td>Email</td>
              <td>Gửi link lá số, biên nhận thanh toán; gửi email giới thiệu nếu bạn đồng ý riêng.</td>
              <td>Khi bạn chọn lưu lá số.</td>
            </tr>
            <tr>
              <td>Phản hồi "đúng/sai" về nhận định</td>
              <td>Thống kê ẩn danh độ chính xác của hệ thống.</td>
              <td>Chỉ khi bạn đồng ý mục nghiên cứu.</td>
            </tr>
            <tr>
              <td>Thông tin đơn hàng (mã đơn, số tiền, thời điểm)</td>
              <td>Mở khóa Pro, nghĩa vụ kế toán.</td>
              <td>Khi bạn thanh toán. Chúng tôi không nhận, không lưu thông tin thẻ hay tài khoản ngân hàng của bạn.</td>
            </tr>
          </tbody>
        </table>

        <h2>Ba sự đồng ý tách biệt</h2>
        <p>Mỗi mục đích có một ô đồng ý riêng, mặc định không được đánh dấu. Không đồng ý mục không bắt buộc vẫn dùng đầy đủ dịch vụ.</p>
        <ol>
          <li>
            <b>Xử lý dữ liệu để lập và lưu lá số (bắt buộc để lưu):</b> {CONSENT_TEXT.processing}
          </li>
          <li>
            <b>Email giới thiệu (không bắt buộc):</b> {CONSENT_TEXT.marketing}
          </li>
          <li>
            <b>Nghiên cứu ẩn danh (không bắt buộc):</b> {CONSENT_TEXT.research}
          </li>
        </ol>
        <p>
          Chúng tôi lưu bằng chứng sự đồng ý (thời điểm, nội dung văn bản đồng ý, phiên bản) kèm mã băm một chiều của email và địa chỉ IP —
          không lưu email gốc trong nhật ký đồng ý.
        </p>

        <h2>Quyền của bạn</h2>
        <ul>
          <li>
            <b>Xóa dữ liệu:</b> mở lá số → "Xóa dữ liệu của tôi". Lá số, email, phản hồi bị xóa ngay. Đơn hàng chỉ còn mã đơn và số tiền
            phục vụ kế toán.
          </li>
          <li>
            <b>Rút lại đồng ý nhận email:</b> bấm "Từ chối nhận email quảng cáo" ở cuối mỗi email. Có hiệu lực ngay, kèm một email xác nhận
            không chứa quảng cáo.
          </li>
          <li>
            <b>Xem, sửa, nhận bản sao, phản đối xử lý:</b> gửi yêu cầu đến {o.email}.
          </li>
        </ul>

        <h2>Lưu trữ và bảo vệ</h2>
        <p>
          Dữ liệu lưu trên cơ sở dữ liệu Supabase, chỉ máy chủ của {config.brand} truy cập được (trình duyệt không truy cập trực tiếp). Email gửi
          qua dịch vụ Resend; thanh toán qua payOS. Một số nhà cung cấp hạ tầng có máy chủ ở nước ngoài. Mỗi lá số có một đường link riêng khó
          đoán — ai có link đều xem được lá số, vì vậy đừng chia sẻ link nếu không muốn.
        </p>
        <p>Lá số đã lưu được giữ cho đến khi bạn xóa hoặc yêu cầu chúng tôi xóa.</p>
        <p>Nếu bạn chưa đủ 18 tuổi, vui lòng nhờ cha mẹ hoặc người giám hộ đồng ý và lập lá số giúp.</p>

        <h2>Email quảng cáo</h2>
        <p>
          Chỉ gửi khi bạn đã đồng ý; tiêu đề bắt đầu bằng nhãn [QC]; tối đa 4 email trong khoảng 10 ngày, không quá 1 email mỗi ngày; dừng ngay
          khi bạn mua Pro hoặc từ chối nhận; mỗi email có thông tin người quảng cáo, giá dịch vụ và chức năng từ chối nhận.
        </p>
      </div>
    </div>
  );
}
