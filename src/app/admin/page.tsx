import type { Metadata } from 'next';
import { db, dbEnabled } from '@/lib/db';
import { isAdminSession } from '@/lib/admin';
import { vnd } from '@/lib/config';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Quản trị', robots: { index: false } };

export default async function Admin({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  if (!(await isAdminSession())) {
    return (
      <div className="wrap narrow" style={{ padding: '48px 16px' }}>
        <h1>Quản trị</h1>
        {sp.loi === '1' && <p className="alert">Sai mã quản trị.</p>}
        <form method="post" action="/api/admin" className="panel" style={{ maxWidth: 380 }}>
          <input type="hidden" name="action" value="login" />
          <div className="field">
            <label htmlFor="k">Mã quản trị (ADMIN_KEY)</label>
            <input id="k" name="key" type="text" autoComplete="off" />
          </div>
          <button className="btn" type="submit">
            Đăng nhập
          </button>
        </form>
      </div>
    );
  }
  if (!dbEnabled()) return <div className="wrap">Chưa cấu hình Supabase.</div>;

  const sb = db();
  const [{ data: pending }, { data: paid }, charts, pro, mkt, fb] = await Promise.all([
    sb.from('orders').select('*').eq('status', 'pending').order('created_at', { ascending: false }).limit(50),
    sb.from('orders').select('order_code,amount,paid_at,method,status').in('status', ['paid', 'manual']).order('paid_at', { ascending: false }).limit(20),
    sb.from('charts').select('id', { count: 'exact', head: true }),
    sb.from('charts').select('id', { count: 'exact', head: true }).eq('is_pro', true),
    sb.from('charts').select('id', { count: 'exact', head: true }).eq('consent_marketing', true).is('unsubscribed_at', null),
    sb.from('feedback').select('score'),
  ]);
  const scores = (fb.data ?? []).map((r) => r.score as number);
  const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : '—';

  return (
    <div className="wrap" style={{ padding: '32px 16px' }}>
      <h1>Quản trị</h1>
      {sp.ok && <p className="note">Đã xác nhận đơn #{sp.ok} và mở khóa Pro.</p>}
      <div className="overview" style={{ marginBottom: 24 }}>
        <div>
          <div className="k">Lá số đã lưu</div>
          <div className="v">{charts.count ?? 0}</div>
        </div>
        <div>
          <div className="k">Đã mua Pro</div>
          <div className="v">{pro.count ?? 0}</div>
        </div>
        <div>
          <div className="k">Đang nhận email giới thiệu</div>
          <div className="v">{mkt.count ?? 0}</div>
        </div>
        <div>
          <div className="k">Điểm "đúng với tôi" trung bình (1–5)</div>
          <div className="v">
            {avg} <span className="small muted">({scores.length} lượt)</span>
          </div>
        </div>
      </div>

      <h2>Đơn chờ thanh toán</h2>
      <p className="muted small">
        Với đơn chuyển khoản: đối chiếu nội dung "ML + mã đơn" trong sao kê ngân hàng rồi bấm xác nhận. Đơn payOS tự xác nhận qua webhook.
      </p>
      <table className="simple">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Nội dung CK</th>
            <th>Số tiền</th>
            <th>Cách</th>
            <th>Tạo lúc</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(pending ?? []).map((o) => (
            <tr key={o.order_code}>
              <td>{o.order_code}</td>
              <td>ML{o.order_code}</td>
              <td>{vnd(o.amount)}</td>
              <td>{o.method}</td>
              <td>{new Date(o.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</td>
              <td>
                <form method="post" action="/api/admin">
                  <input type="hidden" name="action" value="confirm" />
                  <input type="hidden" name="orderCode" value={o.order_code} />
                  <button className="btn ghost" type="submit">
                    Đã nhận tiền
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Đơn đã thanh toán gần đây</h2>
      <table className="simple">
        <tbody>
          {(paid ?? []).map((o) => (
            <tr key={o.order_code}>
              <td>#{o.order_code}</td>
              <td>{vnd(o.amount)}</td>
              <td>{o.method}</td>
              <td>{o.paid_at && new Date(o.paid_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form method="post" action="/api/admin" style={{ marginTop: 32 }}>
        <input type="hidden" name="action" value="logout" />
        <button className="btn ghost" type="submit">
          Đăng xuất
        </button>
      </form>
    </div>
  );
}
