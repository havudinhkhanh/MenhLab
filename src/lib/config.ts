/** Cấu hình đọc từ biến môi trường. Xem .env.example và SETUP.md. */

export const config = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  brand: process.env.NEXT_PUBLIC_BRAND || 'MệnhLab',
  pricePro: Number(process.env.NEXT_PUBLIC_PRICE_PRO || 149000),
  /** Thông tin người quảng cáo — bắt buộc trong email quảng cáo (NĐ 91/2020, Điều 19). */
  owner: {
    name: process.env.OWNER_NAME || 'MệnhLab',
    address: process.env.OWNER_ADDRESS || 'TP. Hồ Chí Minh, Việt Nam',
    email: process.env.OWNER_EMAIL || 'hello@example.com',
    phone: process.env.OWNER_PHONE || '',
  },
  emailFrom: process.env.EMAIL_FROM || 'MệnhLab <onboarding@resend.dev>',
  /** Chuyển khoản thủ công (dự phòng khi chưa có payOS). */
  bank: {
    bin: process.env.BANK_BIN || '', // mã ngân hàng VietQR, ví dụ 970436 (Vietcombank)
    account: process.env.BANK_ACCOUNT || '',
    holder: process.env.BANK_HOLDER || '',
  },
  aiQuestionsLimit: Number(process.env.AI_QUESTIONS_LIMIT || 10),
};

/** Phiên bản văn bản đồng ý. Đổi nội dung đồng ý thì tăng phiên bản. */
export const CONSENT_VERSION = '2026-10-v1';

export const CONSENT_TEXT = {
  processing:
    'Tôi đồng ý để MệnhLab lưu và xử lý họ tên (hoặc biệt danh), giới tính, ngày giờ và nơi sinh, email của tôi nhằm mục đích duy nhất: lập, lưu và gửi lại lá số Tử Vi cho tôi. Tôi có thể yêu cầu xóa bất cứ lúc nào.',
  marketing:
    'Tôi đồng ý nhận email giới thiệu (có nhãn [QC]) về nội dung lá số của tôi và gói Pro, tối đa 4 email trong khoảng 2 tuần. Tôi có thể hủy nhận bằng một cú nhấp ở cuối mỗi email.',
  research:
    'Tôi đồng ý để phản hồi đúng/sai của tôi về các nhận định (không kèm họ tên, email) được dùng thống kê ẩn danh nhằm đánh giá độ chính xác của hệ thống.',
};

export const vnd = (n: number) => `${n.toLocaleString('vi-VN')}₫`;
