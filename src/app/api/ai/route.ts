import { NextResponse } from 'next/server';
import { db, getChartRow } from '@/lib/db';
import { aiAnswer, aiEnabled, aiSynthesis } from '@/lib/ai';
import { computeReport } from '@/lib/report';
import { config } from '@/lib/config';

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!aiEnabled()) return NextResponse.json({ error: 'Tính năng AI chưa được bật.' }, { status: 503 });
  const { chartId, action, question } = (await req.json().catch(() => ({}))) as {
    chartId?: string;
    action?: string;
    question?: string;
  };
  const row = chartId ? await getChartRow(chartId) : null;
  if (!row) return NextResponse.json({ error: 'Không tìm thấy lá số.' }, { status: 404 });
  if (!row.is_pro) return NextResponse.json({ error: 'Tính năng này dành cho bản Pro.' }, { status: 403 });

  const { chart, fullReading, sensitivity } = computeReport(row.birth_input, row.conventions, true);
  const stability = `${Math.round(sensitivity.stability * 100)}% (${sensitivity.level})`;

  try {
    if (action === 'synthesis') {
      if (row.ai_synthesis) return NextResponse.json({ text: row.ai_synthesis });
      const text = await aiSynthesis(chart, fullReading, stability);
      await db().from('charts').update({ ai_synthesis: text }).eq('id', row.id);
      return NextResponse.json({ text });
    }
    if (action === 'ask') {
      const q = (question ?? '').trim();
      if (q.length < 5) return NextResponse.json({ error: 'Câu hỏi quá ngắn.' }, { status: 400 });
      const history = row.ai_questions ?? [];
      if (history.length >= config.aiQuestionsLimit) {
        return NextResponse.json({ error: 'Bạn đã dùng hết lượt hỏi cho lá số này.' }, { status: 400 });
      }
      const text = await aiAnswer(chart, fullReading, q, history);
      await db()
        .from('charts')
        .update({ ai_questions: [...history, { q: q.slice(0, 600), a: text, at: new Date().toISOString() }] })
        .eq('id', row.id);
      return NextResponse.json({ text });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'AI đang bận, vui lòng thử lại sau ít phút.' }, { status: 502 });
  }
  return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 400 });
}
