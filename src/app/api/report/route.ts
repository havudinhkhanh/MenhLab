/**
 * Bản luận giải trọn đời (AI, Pro).
 * GET  ?chartId=…            → các phần đã viết.
 * POST { chartId, key }      → viết một phần (nếu chưa có) và lưu.
 * POST { input, conventions, key } (phiên quản trị) → viết thử, không lưu.
 *
 * Trình duyệt gọi lần lượt từng phần (vài phần song song), nên mỗi lần gọi chỉ mất vài chục giây.
 */
import { NextResponse } from 'next/server';
import { db, getChartRow } from '@/lib/db';
import { aiEnabled, callAnthropic } from '@/lib/ai';
import { isAdminSession } from '@/lib/admin';
import { BirthError, parseBirthInput, parseConventions } from '@/lib/engine/birth';
import { computeReport } from '@/lib/report';
import { AI_SECTIONS, generateSection, type CallFn } from '@/lib/aiReport';
import { mockCall } from '@/lib/aiMock';

export const maxDuration = 300;

const useMock = () => process.env.AI_MOCK === '1';
const enabled = () => aiEnabled() || useMock();
const caller: CallFn = (system, messages, maxTokens) => (useMock() ? mockCall(messages) : callAnthropic(system, messages, maxTokens));

function ctxOf(report: ReturnType<typeof computeReport>) {
  return {
    chart: report.chart,
    reading: report.fullReading,
    life: report.fullLife,
    stability: `${Math.round(report.sensitivity.stability * 100)}% (${report.sensitivity.level})`,
    patterns: report.patterns.map((p) => ({ name: p.name, status: p.status === 'du' ? 'đủ điều kiện' : 'gần đủ', tone: p.tone })),
  };
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('chartId') ?? '';
  const row = await getChartRow(id);
  if (!row) return NextResponse.json({ error: 'Không tìm thấy lá số.' }, { status: 404 });
  if (!row.is_pro) return NextResponse.json({ error: 'Dành cho bản Pro.' }, { status: 403 });
  const { data } = await db().from('report_sections').select('key,text').eq('chart_id', row.id);
  return NextResponse.json({ enabled: enabled(), sections: Object.fromEntries((data ?? []).map((r) => [r.key, r.text])) });
}

export async function POST(req: Request) {
  if (!enabled()) return NextResponse.json({ error: 'Tính năng AI chưa được bật (thiếu ANTHROPIC_API_KEY).' }, { status: 503 });
  const b = (await req.json().catch(() => ({}))) as { chartId?: string; key?: string; input?: unknown; conventions?: unknown; force?: boolean };
  const key = b.key ?? '';
  if (!AI_SECTIONS.some((s) => s.key === key)) return NextResponse.json({ error: 'Phần không hợp lệ.' }, { status: 400 });

  // Xem thử của quản trị viên: không lưu gì.
  if (!b.chartId) {
    if (!(await isAdminSession())) return NextResponse.json({ error: 'Cần đăng nhập quản trị.' }, { status: 401 });
    let input, conv;
    try {
      input = parseBirthInput(b.input);
      conv = parseConventions(b.conventions);
    } catch (e) {
      return NextResponse.json({ error: e instanceof BirthError ? e.message : 'Thông tin sinh chưa hợp lệ.' }, { status: 400 });
    }
    try {
      const out = await generateSection(key, ctxOf(computeReport(input, conv, true)), caller);
      return NextResponse.json({ text: out.text, issues: out.check.issues, words: out.check.words });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: 'AI lỗi: ' + (e instanceof Error ? e.message.slice(0, 200) : '') }, { status: 502 });
    }
  }

  const row = await getChartRow(b.chartId);
  if (!row) return NextResponse.json({ error: 'Không tìm thấy lá số.' }, { status: 404 });
  if (!row.is_pro) return NextResponse.json({ error: 'Dành cho bản Pro.' }, { status: 403 });

  if (!b.force) {
    const { data } = await db().from('report_sections').select('text').eq('chart_id', row.id).eq('key', key).maybeSingle();
    if (data?.text) return NextResponse.json({ text: data.text, cached: true });
  } else if (!(await isAdminSession())) {
    return NextResponse.json({ error: 'Chỉ quản trị viên được viết lại.' }, { status: 403 });
  }

  try {
    const out = await generateSection(key, ctxOf(computeReport(row.birth_input, row.conventions, true)), caller);
    await db()
      .from('report_sections')
      .upsert({
        chart_id: row.id,
        key,
        text: out.text,
        words: out.check.words,
        issues: out.check.issues,
        model: useMock() ? 'mock' : process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5',
        created_at: new Date().toISOString(),
      });
    return NextResponse.json({ text: out.text });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'AI đang bận, vui lòng thử lại sau ít phút.' }, { status: 502 });
  }
}
