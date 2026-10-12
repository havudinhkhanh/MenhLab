/**
 * Từ chối nhận email quảng cáo (NĐ 91/2020, Điều 20).
 * - GET (bấm link trong email): chuyển tới trang xác nhận có nút bấm, tránh bộ quét link tự động hủy nhầm.
 * - POST (nút trên trang, hoặc "one-click unsubscribe" của Gmail/Outlook): xử lý ngay.
 */
import { NextResponse } from 'next/server';
import { db, dbEnabled, getChartRow, hashEmail } from '@/lib/db';
import { verify } from '@/lib/tokens';
import { config, CONSENT_VERSION } from '@/lib/config';
import { sendEmail, unsubscribeConfirmEmail } from '@/lib/email';

export async function GET(req: Request) {
  const u = new URL(req.url);
  const id = u.searchParams.get('id') ?? '';
  const t = u.searchParams.get('t') ?? '';
  return NextResponse.redirect(`${config.siteUrl}/huy-dang-ky?id=${encodeURIComponent(id)}&t=${encodeURIComponent(t)}`, 303);
}

export async function POST(req: Request) {
  const u = new URL(req.url);
  let id = u.searchParams.get('id') ?? '';
  let t = u.searchParams.get('t') ?? '';
  const ct = req.headers.get('content-type') ?? '';
  if (ct.includes('form')) {
    const f = await req.formData();
    id = String(f.get('id') ?? id);
    t = String(f.get('t') ?? t);
  }
  const fromPage = ct.includes('form') && !u.searchParams.get('id');
  if (!verify('unsub', id, t) || !dbEnabled()) {
    return fromPage
      ? NextResponse.redirect(`${config.siteUrl}/huy-dang-ky?loi=1`, 303)
      : NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const row = await getChartRow(id);
  if (row && !row.unsubscribed_at) {
    const at = new Date();
    const sb = db();
    await sb.from('charts').update({ unsubscribed_at: at.toISOString(), consent_marketing: false }).eq('id', id);
    await sb.from('consent_log').insert({
      chart_id: id,
      email_hash: row.email ? hashEmail(row.email) : null,
      purpose: 'marketing',
      granted: false,
      consent_version: CONSENT_VERSION,
      consent_text: 'Rút lại đồng ý nhận email quảng cáo qua liên kết hủy nhận.',
    });
    if (row.email) {
      const mail = unsubscribeConfirmEmail(at);
      await sendEmail({ to: row.email, ...mail, chartId: id, kind: 'unsubscribe_confirm' }).catch(() => false);
    }
  }
  return fromPage ? NextResponse.redirect(`${config.siteUrl}/huy-dang-ky?ok=1`, 303) : NextResponse.json({ ok: true });
}
