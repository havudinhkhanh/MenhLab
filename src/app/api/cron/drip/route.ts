/**
 * Chuỗi email teaser cho người CHƯA mua Pro và ĐÃ đồng ý nhận email giới thiệu.
 * Lịch: email 1 sau 1 ngày, email 2 sau 3 ngày, email 3 sau 6 ngày, email 4 sau 10 ngày (tính từ lúc lưu lá số).
 * Tối đa 1 email/người/ngày. Dừng ngay khi người dùng mua Pro hoặc hủy nhận.
 * Vercel Cron gọi route này mỗi ngày (xem vercel.json), kèm header Authorization: Bearer CRON_SECRET.
 */
import { NextResponse } from 'next/server';
import { db, dbEnabled, type ChartRow } from '@/lib/db';
import { buildChart } from '@/lib/engine/chart';
import { teaserFor } from '@/lib/reading';
import { dripEmail, emailEnabled, sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SCHEDULE_DAYS = [1, 3, 6, 10]; // ngày kể từ lúc lưu lá số, cho email 1..4
const BATCH = Number(process.env.DRIP_BATCH || 80); // Resend gói free: 100 email/ngày

export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!dbEnabled() || !emailEnabled()) return NextResponse.json({ skipped: 'db hoặc email chưa cấu hình' });

  const sb = db();
  const { data, error } = await sb
    .from('charts')
    .select('*')
    .eq('consent_marketing', true)
    .eq('is_pro', false)
    .is('unsubscribed_at', null)
    .not('email', 'is', null)
    .lt('drip_step', SCHEDULE_DAYS.length)
    .order('created_at', { ascending: true })
    .limit(500);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const now = Date.now();
  const day = 86400_000;
  let sent = 0;
  const results: string[] = [];
  for (const row of (data ?? []) as ChartRow[]) {
    if (sent >= BATCH) break;
    const due = new Date(row.created_at).getTime() + SCHEDULE_DAYS[row.drip_step] * day;
    const restedEnough = !row.last_drip_at || now - new Date(row.last_drip_at).getTime() > 20 * 3600_000;
    if (now < due || !restedEnough) continue;

    const step = row.drip_step + 1;
    try {
      const chart = buildChart(row.birth_input, row.conventions);
      const mail = dripEmail(row.id, row.display_name, step, teaserFor(chart, step));
      // Cập nhật trước khi gửi để không gửi trùng nếu cron chạy chồng
      const { data: claimed } = await sb
        .from('charts')
        .update({ drip_step: step, last_drip_at: new Date().toISOString() })
        .eq('id', row.id)
        .eq('drip_step', row.drip_step)
        .select('id');
      if (!claimed?.length) continue;
      await sendEmail({ to: row.email!, ...mail, chartId: row.id, kind: `drip_${step}` });
      sent++;
      results.push(`${row.id}:${step}`);
    } catch (e) {
      results.push(`${row.id}:error:${e instanceof Error ? e.message : e}`);
    }
  }
  return NextResponse.json({ sent, results });
}
