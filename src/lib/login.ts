/** Gửi và kiểm tra mã đăng nhập. */
import 'server-only';
import { db, hashEmail, hashIp } from './db';
import { hashCode, newCode, normEmail } from './auth';
import { emailEnabled, loginCodeEmail, sendEmail } from './email';
import { config, CONSENT_TEXT, CONSENT_VERSION } from './config';
import { devDbEnabled } from './devdb';
import { timingSafeEqual } from 'node:crypto';

const TTL_MIN = 15;
const MAX_PER_15MIN = 5;
const MAX_ATTEMPTS = 5;

export type RequestResult = { ok: true; devCode?: string } | { ok: false; error: string; status: number };

export async function requestLoginCode(rawEmail: string, opts: { next: string; ua: string | null; ip: string | null }): Promise<RequestResult> {
  const email = normEmail(rawEmail);
  const sb = db();
  const since = new Date(Date.now() - TTL_MIN * 60_000).toISOString();
  const { count } = await sb.from('login_codes').select('id', { count: 'exact', head: true }).eq('email', email).gte('created_at', since);
  if ((count ?? 0) >= MAX_PER_15MIN) return { ok: false, error: 'Bạn đã yêu cầu mã quá nhiều lần. Vui lòng đợi 15 phút rồi thử lại.', status: 429 };
  const code = newCode();
  await sb.from('login_codes').insert({ email, code_hash: hashCode(email, code), expires_at: new Date(Date.now() + TTL_MIN * 60_000).toISOString() });
  await sb.from('consent_log').insert({
    chart_id: null,
    email_hash: hashEmail(email),
    purpose: 'account',
    granted: true,
    consent_version: CONSENT_VERSION,
    consent_text: CONSENT_TEXT.account,
    user_agent: opts.ua?.slice(0, 300) ?? null,
    ip_hash: hashIp(opts.ip),
  });
  const link = `${config.siteUrl}/api/auth/link?e=${encodeURIComponent(email)}&c=${code}&next=${encodeURIComponent(opts.next)}`;
  await sendEmail({ to: email, ...loginCodeEmail(code, link), kind: 'login_code' }).catch(() => false);
  // Chạy thử trên máy (không có máy chủ email): hiện mã ngay trên màn hình.
  return { ok: true, ...(devDbEnabled() && !emailEnabled() ? { devCode: code } : {}) };
}

export async function verifyLoginCode(rawEmail: string, code: string): Promise<{ ok: true; email: string } | { ok: false; error: string }> {
  const email = normEmail(rawEmail);
  if (!/^\d{6}$/.test(code)) return { ok: false, error: 'Mã gồm 6 chữ số.' };
  const sb = db();
  const { data } = await sb
    .from('login_codes')
    .select('*')
    .eq('email', email)
    .is('used_at', null)
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  const row = data as { id: string; code_hash: string; attempts: number } | null;
  if (!row) return { ok: false, error: 'Mã đã hết hạn hoặc chưa được gửi. Bấm "Gửi lại mã".' };
  if (row.attempts >= MAX_ATTEMPTS) return { ok: false, error: 'Nhập sai quá nhiều lần. Bấm "Gửi lại mã" để nhận mã mới.' };
  const a = Buffer.from(row.code_hash);
  const b = Buffer.from(hashCode(email, code));
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    await sb.from('login_codes').update({ attempts: row.attempts + 1 }).eq('id', row.id);
    return { ok: false, error: `Mã chưa đúng. Bạn còn ${MAX_ATTEMPTS - row.attempts - 1} lần thử.` };
  }
  await sb.from('login_codes').update({ used_at: new Date().toISOString() }).eq('id', row.id);
  return { ok: true, email };
}
