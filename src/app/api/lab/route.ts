/**
 * Ghi kết quả bài kiểm tra ghép cặp mù. Chỉ lưu đúng/sai — không lưu dữ liệu sinh.
 * - Lá số đã lưu và người dùng đã đồng ý mục đích nghiên cứu: máy chủ tự xác định đáp án đúng từ lá số.
 * - Chế độ xem nhanh: người dùng phải đánh dấu đồng ý gửi ẩn danh; máy chủ chỉ nhận đúng/sai.
 */
import { NextResponse } from 'next/server';
import { db, dbEnabled, getChartRow } from '@/lib/db';
import { buildChart } from '@/lib/engine/chart';
import { comboKey } from '@/content/blind';

export async function POST(req: Request) {
  if (!dbEnabled()) return NextResponse.json({ ok: false });
  const b = (await req.json().catch(() => ({}))) as {
    chartId?: string;
    options?: string[];
    picked?: string;
    truth?: string;
    confidence?: number;
    consent?: boolean;
  };
  const options = Array.isArray(b.options) ? b.options.slice(0, 6).map(String) : [];
  if (options.length < 2 || typeof b.picked !== 'string' || !options.includes(b.picked)) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  const confidence = Number.isInteger(b.confidence) && b.confidence! >= 1 && b.confidence! <= 5 ? b.confidence! : null;

  let truth: string | undefined;
  let chartId: string | null = null;
  if (b.chartId) {
    const row = await getChartRow(b.chartId);
    if (!row || !row.consent_research) return NextResponse.json({ ok: false, reason: 'no-consent' });
    const c = buildChart(row.birth_input, row.conventions);
    const m = c.palaces[c.menhBranch];
    truth = m.majors.length
      ? comboKey(m.majors.map((s) => s.name), false)
      : comboKey(c.palaces[(c.menhBranch + 6) % 12].majors.map((s) => s.name), true);
    chartId = row.id;
  } else {
    if (b.consent !== true) return NextResponse.json({ ok: false, reason: 'no-consent' });
    truth = typeof b.truth === 'string' ? b.truth : undefined;
  }
  if (!truth || !options.includes(truth)) return NextResponse.json({ error: 'invalid' }, { status: 400 });

  const { error } = await db()
    .from('lab_results')
    .insert({ test: 'menh-ghep-cap-mu', n_options: options.length, correct: b.picked === truth, confidence, chart_id: chartId });
  // Đã làm bài với lá số này rồi thì bỏ qua (chỉ tính lần đầu)
  if (error && !String(error.message).includes('duplicate')) return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true });
}
