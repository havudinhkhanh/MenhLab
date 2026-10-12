import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ChartReport from '@/components/ChartReport';
import { getChartRow } from '@/lib/db';
import { computeReport } from '@/lib/report';
import { aiEnabled } from '@/lib/ai';
import { config } from '@/lib/config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Lá số của bạn',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default async function SavedChartPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const row = await getChartRow(id);
  if (!row) notFound();

  const { chart, reading, sensitivity } = computeReport(row.birth_input, row.conventions, row.is_pro);

  return (
    <ChartReport
      chart={chart}
      reading={reading}
      sensitivity={sensitivity}
      isPro={row.is_pro}
      chartId={row.id}
      isNew={sp.moi === '1'}
      canRate={row.consent_research}
      paymentReturn={sp.tt === 'ok' ? 'ok' : sp.tt === 'huy' ? 'cancel' : undefined}
      ai={{
        enabled: aiEnabled(),
        synthesis: row.ai_synthesis,
        qa: (row.ai_questions ?? []).map(({ q, a }) => ({ q, a })),
        limit: config.aiQuestionsLimit,
      }}
    />
  );
}
