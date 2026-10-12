import { NextResponse } from 'next/server';
import { db, hashEmail } from '@/lib/db';
import { clearSession, getSessionEmail } from '@/lib/auth';
import { CONSENT_VERSION } from '@/lib/config';

/** Xóa tài khoản: xóa mọi lá số gắn với email đang đăng nhập và đăng xuất. */
export async function POST() {
  const email = await getSessionEmail();
  if (!email) return NextResponse.json({ error: 'Bạn chưa đăng nhập.' }, { status: 401 });
  const sb = db();
  const { data } = await sb.from('charts').select('id').eq('email', email);
  const ids = ((data ?? []) as { id: string }[]).map((r) => r.id);
  await sb.from('consent_log').insert({
    chart_id: null,
    email_hash: hashEmail(email),
    purpose: 'account',
    granted: false,
    consent_version: CONSENT_VERSION,
    consent_text: `Người dùng xóa tài khoản và ${ids.length} lá số.`,
  });
  if (ids.length) {
    await sb.from('consent_log').update({ chart_id: null }).in('chart_id', ids);
    await sb.from('email_log').update({ chart_id: null }).in('chart_id', ids);
    await sb.from('charts').delete().eq('email', email);
  }
  await sb.from('login_codes').delete().eq('email', email);
  return clearSession(NextResponse.json({ ok: true, deleted: ids.length }));
}
