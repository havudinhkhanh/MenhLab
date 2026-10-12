import 'server-only';
import { cookies } from 'next/headers';
import { timingSafeEqual } from 'node:crypto';
import { sign } from './tokens';

export const ADMIN_COOKIE = 'menhlab_admin';

export function keyMatches(key: string | null | undefined): boolean {
  const real = process.env.ADMIN_KEY;
  if (!real || !key) return false;
  const a = Buffer.from(real);
  const b = Buffer.from(key);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const adminCookieValue = () => sign('admin', process.env.ADMIN_KEY || '');

export async function isAdminSession(): Promise<boolean> {
  if (!process.env.ADMIN_KEY) return false;
  const c = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!c && c === adminCookieValue();
}
