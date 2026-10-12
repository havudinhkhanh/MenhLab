import { NextResponse } from 'next/server';
import { verifyLoginCode } from '@/lib/login';
import { safeNext, setSession } from '@/lib/auth';
import { config } from '@/lib/config';

/** Link "Đăng nhập" trong email: kiểm tra mã rồi chuyển thẳng vào tài khoản. */
export async function GET(req: Request) {
  const u = new URL(req.url);
  const r = await verifyLoginCode(u.searchParams.get('e') ?? '', u.searchParams.get('c') ?? '');
  if (!r.ok) return NextResponse.redirect(`${config.siteUrl}/dang-nhap?loi=link`);
  return setSession(NextResponse.redirect(`${config.siteUrl}${safeNext(u.searchParams.get('next'))}`), r.email);
}
