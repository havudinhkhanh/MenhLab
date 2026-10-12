import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import AiReportView from '@/components/AiReportView';
import { db, getChartRow } from '@/lib/db';
import { aiEnabled } from '@/lib/ai';
import { AI_SECTIONS, addressOf } from '@/lib/aiReport';
import { computeReport } from '@/lib/report';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bản luận giải trọn đời',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default async function LifeReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getChartRow(id);
  if (!row) notFound();
  if (!row.is_pro) redirect(`/la-so/${row.id}#mo-khoa`);
  const { chart, fullReading } = computeReport(row.birth_input, row.conventions, true);
  const { data } = await db().from('report_sections').select('key,text').eq('chart_id', row.id);
  const addr = addressOf(chart, fullReading.currentAge);
  return (
    <div className="wrap narrow-report">
      <p className="small no-print" style={{ marginTop: 20 }}>
        <Link href={`/la-so/${row.id}`}>← Về trang lá số</Link>
      </p>
      <AiReportView
        sections={AI_SECTIONS}
        initial={Object.fromEntries((data ?? []).map((r) => [r.key, r.text]))}
        chartId={row.id}
        enabled={aiEnabled() || process.env.AI_MOCK === '1'}
        header={{
          name: chart.name ? addr.full.charAt(0).toUpperCase() + addr.full.slice(1) : 'Lá số Tử Vi của bạn',
          line: `${chart.gender === 'nam' ? 'Nam' : 'Nữ'}, sinh ${chart.birth.solar.day}/${chart.birth.solar.month}/${chart.birth.solar.year} (âm lịch ${chart.birth.lunar.day}/${chart.birth.lunar.month} năm ${chart.canChi.year}), giờ ${chart.canChi.hour.split(' ')[1]}`,
        }}
      />
    </div>
  );
}
