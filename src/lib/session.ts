/** Phần thuần (không phụ thuộc Next): tạo/đọc phiên, mã đăng nhập. Tách riêng để kiểm thử được. */
import { createHash, createHmac, randomInt, timingSafeEqual } from 'node:crypto';

export const DAYS = 30;

const secret = () => process.env.APP_SECRET || 'dev-secret-change-me';

const mac = (v: string) => createHmac('sha256', secret()).update(`session:${v}`).digest('base64url');

export function makeSessionToken(email: string, now = Date.now()): string {
  const exp = Math.floor(now / 1000) + DAYS * 86400;
  const body = `${Buffer.from(email).toString('base64url')}.${exp}`;
  return `${body}.${mac(body)}`;
}

export function readSessionToken(tok: string | undefined | null, now = Date.now()): string | null {
  if (!tok) return null;
  const parts = tok.split('.');
  if (parts.length !== 3) return null;
  const body = `${parts[0]}.${parts[1]}`;
  const a = Buffer.from(mac(body));
  const b = Buffer.from(parts[2]);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(parts[1]) * 1000 < now) return null;
  return Buffer.from(parts[0], 'base64url').toString();
}

export const newCode = () => String(randomInt(0, 1_000_000)).padStart(6, '0');
export const hashCode = (email: string, code: string) => createHash('sha256').update(`${secret()}:login:${email}:${code}`).digest('hex');
export const normEmail = (e: string) => e.trim().toLowerCase();

/** Chỉ đường dẫn nội bộ mới được dùng làm "đi tiếp tới". */
export const safeNext = (n: unknown) => (typeof n === 'string' && /^\/(?!\/)[\w\-/#?=&%.]*$/.test(n) ? n : '/tai-khoan');
