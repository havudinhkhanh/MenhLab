import 'server-only';
import { createHash, timingSafeEqual } from 'node:crypto';

const EMAIL = 'admin@menhlab.io';
const PASS_SHA256 = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';

export const isTestEmail = (email: string | null | undefined) =>
  process.env.DISABLE_TEST_ACCOUNT !== '1' && !!email && email.trim().toLowerCase() === EMAIL;

export function checkTestPassword(email: string, password: string): boolean {
  if (!isTestEmail(email)) return false;
  const a = createHash('sha256').update(password).digest();
  return timingSafeEqual(a, Buffer.from(PASS_SHA256, 'hex'));
}

export const withTestPro = <T extends { email: string | null; is_pro: boolean }>(row: T): T =>
  isTestEmail(row.email) && !row.is_pro ? { ...row, is_pro: true } : row;
