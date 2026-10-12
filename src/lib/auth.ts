/**
 * Đăng nhập không mật khẩu: email → mã 6 số (hoặc bấm link trong email) → phiên đăng nhập 30 ngày.
 * Phiên là cookie httpOnly có chữ ký; cookie phụ "menhlab_user=1" (không chứa dữ liệu) chỉ để thanh menu biết hiện "Tài khoản".
 */
import 'server-only';
import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';
import { DAYS, makeSessionToken, readSessionToken } from './session';

export { makeSessionToken, readSessionToken, newCode, hashCode, normEmail, safeNext } from './session';

export const SESSION_COOKIE = 'menhlab_session';
export const HINT_COOKIE = 'menhlab_user';

export async function getSessionEmail(): Promise<string | null> {
  const jar = await cookies();
  return readSessionToken(jar.get(SESSION_COOKIE)?.value);
}

export function setSession(res: NextResponse, email: string) {
  const secure = process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL?.startsWith('http://');
  res.cookies.set(SESSION_COOKIE, makeSessionToken(email), { httpOnly: true, sameSite: 'lax', secure, path: '/', maxAge: DAYS * 86400 });
  res.cookies.set(HINT_COOKIE, '1', { httpOnly: false, sameSite: 'lax', secure, path: '/', maxAge: DAYS * 86400 });
  return res;
}

export function clearSession(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  res.cookies.set(HINT_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}

