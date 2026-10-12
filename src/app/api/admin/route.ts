import { NextResponse } from 'next/server';
import { markPaid } from '@/lib/orders';
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
  if (action === 'confirm') {
    const orderCode = Number(f.get('orderCode'));
    if (!Number.isFinite(orderCode)) return back('?loi=2');
    await markPaid(orderCode, { by: 'admin', at: new Date().toISOString() }, 'manual');
    return back(`?ok=${orderCode}`);
  }
  return back();
}
