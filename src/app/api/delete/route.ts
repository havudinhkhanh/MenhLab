import { NextResponse } from 'next/server';
import { db, getChartRow, hashEmail } from '@/lib/db';
import { CONSENT_VERSION } from '@/lib/config';

/** Quyền xóa dữ liệu: ai có link riêng của lá số đều xóa được lá số đó. */
export async function POST(req: Request) {
  const { chartId } = (await req.json().catch(() => ({}))) as { chartId?: string };
  const row = chartId ? await getChartRow(chartId) : null;
  if (!row) return NextResponse.json({ error: 'Không tìm thấy lá số.' }, { status: 404 });
  const sb = db();
  await sb.from('consent_log').insert({
    chart_id: null,
    email_hash: row.email ? hashEmail(row.email) : null,
    purpose: 'processing',
    granted: false,
    consent_version: CONSENT_VERSION,
    consent_text: 'Người dùng yêu cầu xóa lá số và dữ liệu đi kèm.',
  });
  await sb.from('consent_log').update({ chart_id: null }).eq('chart_id', row.id);
  await sb.from('email_log').update({ chart_id: null }).eq('chart_id', row.id);
  const { error } = await sb.from('charts').delete().eq('id', row.id);
  if (error) return NextResponse.json({ error: 'Không xóa được, vui lòng liên hệ hỗ trợ.' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
