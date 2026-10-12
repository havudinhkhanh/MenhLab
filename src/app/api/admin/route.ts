import { NextResponse } from 'next/server';
import { markPaid } from '@/lib/orders';
import { db, dbEnabled, getChartRow } from '@/lib/db';
import { newOrderCode } from '@/lib/payos';
import { config } from '@/lib/config';
import { ADMIN_COOKIE, adminCookieValue, isAdminSession, keyMatches } from '@/lib/admin';

/** Đăng nhập quản trị, đăng xuất, và xác nhận thủ công đơn chuyển khoản. */
export async function POST(req: Request) {
  const f = await req.formData();
  const action = String(f.get('action') ?? '');
  const back = (q = '') => NextResponse.redirect(`${config.siteUrl}/admin${q}`, 303);

  if (action === 'login') {
    if (!keyMatches(String(f.get('key') ?? ''))) return back('?loi=1');
    const res = back();
    res.cookies.set(ADMIN_COOKIE, adminCookieValue(), { httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: 8 * 3600 });
    return res;
  }
  if (action === 'logout') {
    const res = back();
    res.cookies.delete(ADMIN_COOKIE);
    return res;
  }
  if (!(await isAdminSession())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (action === 'grant') {
    // Mở Pro miễn phí cho một lá số đã lưu (để thử nghiệm hoặc tặng). Ghi một đơn 0₫ để có dấu vết.
    if (!dbEnabled()) return back('?loi=3');
    const raw = String(f.get('chart') ?? '');
    const id = raw.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0];
    const row = id ? await getChartRow(id) : null;
    if (!row) return back('?loi=4');
    const now = new Date().toISOString();
    await db().from('charts').update({ is_pro: true, pro_at: now }).eq('id', row.id);
    await db()
      .from('orders')
      .insert({ order_code: newOrderCode(), chart_id: row.id, amount: 0, status: 'manual', method: 'gift', paid_at: now, raw: { by: 'admin', note: String(f.get('note') ?? '').slice(0, 200) } });
    return back(`?tang=${row.id}`);
  }
  if (action === 'confirm') {
    const orderCode = Number(f.get('orderCode'));
    if (!Number.isFinite(orderCode)) return back('?loi=2');
    await markPaid(orderCode, { by: 'admin', at: new Date().toISOString() }, 'manual');
    return back(`?ok=${orderCode}`);
  }
  return back();
}
