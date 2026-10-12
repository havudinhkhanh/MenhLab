/**
 * Xem thử bản Pro cho quản trị viên: tính lá số đầy đủ ngay trên máy chủ, không lưu gì, không cần cơ sở dữ liệu.
 * Có thể thử cả AI (luận giải tổng hợp, hỏi đáp) nếu đã cấu hình ANTHROPIC_API_KEY.
 */
import { NextResponse } from 'next/server';
import { isAdminSession } from '@/lib/admin';
import { BirthError, parseBirthInput, parseConventions } from '@/lib/engine/birth';
import { computeReport } from '@/lib/report';
import { aiAnswer, aiEnabled, aiSynthesis } from '@/lib/ai';

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: 'Phiên quản trị đã hết hạn — vui lòng đăng nhập lại ở /admin.' }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as {
    input?: unknown;
    conventions?: unknown;
    action?: 'report' | 'synthesis' | 'ask';
    question?: string;
    history?: { q: string; a: string }[];
  };
  let input, conv;
  try {
    input = parseBirthInput(b.input);
    conv = parseConventions(b.conventions);
  } catch (e) {
    return NextResponse.json({ error: e instanceof BirthError ? e.message : 'Thông tin sinh chưa hợp lệ.' }, { status: 400 });
  }
  const report = computeReport(input, conv, true);
  if (!b.action || b.action === 'report') return NextResponse.json(report);

  if (!aiEnabled()) return NextResponse.json({ error: 'Chưa cấu hình ANTHROPIC_API_KEY.' }, { status: 503 });
  const stability = `${Math.round(report.sensitivity.stability * 100)}% (${report.sensitivity.level})`;
  try {
    if (b.action === 'synthesis') return NextResponse.json({ text: await aiSynthesis(report.chart, report.fullReading, stability) });
    const q = (b.question ?? '').trim();
    if (q.length < 5) return NextResponse.json({ error: 'Câu hỏi quá ngắn.' }, { status: 400 });
    return NextResponse.json({ text: await aiAnswer(report.chart, report.fullReading, q, (b.history ?? []).slice(-4)) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'AI lỗi: ' + (e instanceof Error ? e.message.slice(0, 200) : '') }, { status: 502 });
  }
}
