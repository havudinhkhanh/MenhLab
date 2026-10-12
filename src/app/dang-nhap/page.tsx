import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import { getSessionEmail, safeNext } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Đăng nhập', robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  if (await getSessionEmail()) redirect(next);
  return (
    <div className="login-page">
      <div className="wrap login-grid">
        <section className="login-why">
          <h1>Mọi lá số của bạn, ở một chỗ.</h1>
          <p>Đăng nhập bằng email bạn đã dùng khi lưu lá số. Không mật khẩu, không cần tạo tài khoản trước.</p>
          <ul>
            <li>
              <b>Xem lại mọi lá số đã lưu</b> — của bạn, người thân, con cái — không phải lục email tìm link.
            </li>
            <li>
              <b>Mở đúng phần cần đọc</b>: tháng này nên làm gì, năm nay, bản luận giải trọn đời.
            </li>
            <li>
              <b>Lá số mới tự vào tài khoản</b> khi bạn đang đăng nhập.
            </li>
            <li>
              <b>Xóa sạch khi muốn</b>: một nút xóa tài khoản cùng toàn bộ lá số.
            </li>
          </ul>
        </section>
        <LoginForm next={next} initialError={sp.loi === 'link' ? 'Link đăng nhập đã hết hạn hoặc đã dùng. Vui lòng nhận mã mới.' : undefined} />
      </div>
    </div>
  );
}
