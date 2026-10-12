import { NextResponse } from 'next/server';
import { db, getChartRow } from '@/lib/db';

export async function POST(req: Request) {
  const { chartId, section, score } = (await req.json().catch(() => ({}))) as {
    chartId?: string;
    section?: string;
    score?: number;
  };
  const row = chartId ? await getChartRow(chartId) : null;
  // Chỉ ghi nhận khi người dùng đã đồng ý mục đích nghiên cứu
  if (!row || !row.consent_research) return NextResponse.json({ ok: false });
  if (typeof section !== 'string' || !Number.isInteger(score) || score! < 1 || score! > 5) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  await db().from('feedback').insert({ chart_id: row.id, section: section.slice(0, 60), score });
  return NextResponse.json({ ok: true });
}
