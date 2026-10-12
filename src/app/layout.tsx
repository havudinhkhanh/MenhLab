import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';
import { config } from '@/lib/config';
import TermLayer from '@/components/TermLayer';
import AccountLink from '@/components/AccountLink';

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: { default: `${config.brand} — Lá số Tử Vi, đọc hiểu từng chữ`, template: `%s · ${config.brand}` },
  description:
    'Lập lá số Tử Vi theo lịch âm Việt Nam, hiệu chỉnh múi giờ lịch sử, giải thích mọi thuật ngữ và luận giải có dẫn chứng — minh bạch, không hù dọa.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1d1a3a' },
    { media: '(prefers-color-scheme: dark)', color: '#14101d' },
  ],
};

function Mark() {
  // Sao Bắc Cực (Tử Vi = "sao tím") trong khung 4×4 của lá số
  return (
    <svg className="logo-mark" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="1" y="1" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <rect x="7" y="7" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1" opacity=".5" />
      <path d="M12 8.2l1 2.6 2.8.2-2.2 1.7.8 2.7L12 13.9l-2.4 1.5.8-2.7-2.2-1.7 2.8-.2z" fill="#e2b93b" />
    </svg>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Literata:opsz,wght@7..72,400;7..72,600&display=swap&subset=vietnamese"
        />
      </head>
      <body>
        <header className="site-header no-print">
          <div className="wrap">
            <Link href="/" className="logo">
              <Mark />
              {config.brand}
            </Link>
            <nav className="nav" aria-label="Chính">
              <Link href="/hoc">Học đọc lá số</Link>
              <Link href="/tu-dien">Từ điển</Link>
              <Link href="/chinh-gio">Tìm giờ sinh</Link>
              <Link href="/nghien-cuu">Nghiên cứu</Link>
              <Link href="/bang-gia">Bảng giá</Link>
            </nav>
            <AccountLink />
          </div>
        </header>
        <main>{children}</main>
        <TermLayer />
        <footer className="site-footer no-print">
          <div className="wrap">
            <nav aria-label="Pháp lý">
              <Link href="/bao-mat">Chính sách bảo mật</Link>
              <Link href="/dieu-khoan">Điều khoản</Link>
              <Link href="/phuong-phap">Phương pháp</Link>
              <Link href="/nghien-cuu">Tử Vi và khoa học</Link>
              <Link href="/sao">14 chính tinh × 12 cung</Link>
              <Link href="/tai-khoan">Tài khoản</Link>
              <a href={`mailto:${config.owner.email}`}>Liên hệ</a>
            </nav>
            <p>
              Tử Vi là một hệ thống văn hóa để tự suy ngẫm, chưa được khoa học chứng minh khả năng dự đoán. {config.brand} không
              đưa ra lời khuyên y tế, pháp lý hay đầu tư.
            </p>
            <p>
              {config.owner.name}, {config.owner.address}. Lá số được an bằng thư viện mã nguồn mở iztro (MIT) kết hợp lịch âm
              Việt Nam.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
