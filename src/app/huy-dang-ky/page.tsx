import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Từ chối nhận email quảng cáo', robots: { index: false } };

export default async function Unsub({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return (
    <div className="wrap narrow" style={{ padding: '48px 16px' }}>
      <h1>Từ chối nhận email quảng cáo</h1>
      {sp.ok === '1' ? (
        <p className="note">Xong. Chúng tôi đã dừng gửi email giới thiệu cho bạn ngay từ bây giờ và gửi một email xác nhận. Lá số của bạn vẫn giữ nguyên.</p>
      ) : sp.loi === '1' || !sp.id ? (
        <p className="alert">Liên kết không hợp lệ hoặc đã hết hạn. Vui lòng dùng liên kết ở cuối email gần nhất, hoặc trả lời email đó.</p>
      ) : (
        <form method="post" action="/api/unsubscribe" className="panel">
          <input type="hidden" name="id" value={sp.id} />
          <input type="hidden" name="t" value={sp.t ?? ''} />
          <p>Bấm nút dưới đây để ngừng nhận mọi email giới thiệu từ chúng tôi. Có hiệu lực ngay.</p>
          <button className="btn" type="submit">
            Ngừng nhận email quảng cáo
          </button>
        </form>
      )}
    </div>
  );
}
