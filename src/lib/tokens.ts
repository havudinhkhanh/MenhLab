import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

const secret = () => process.env.APP_SECRET || 'dev-secret-change-me';

/** Chữ ký ngắn cho link trong email (hủy nhận, v.v.) để không ai giả mạo được. */
export function sign(purpose: string, value: string): string {
  return createHmac('sha256', secret()).update(`${purpose}:${value}`).digest('base64url').slice(0, 32);
}

export function verify(purpose: string, value: string, token: string | null | undefined): boolean {
  if (!token) return false;
  const a = Buffer.from(sign(purpose, value));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}
