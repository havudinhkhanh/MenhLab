import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import BookView from '@/components/BookView';
import { getChartRow } from '@/lib/db';
import { computeReport } from '@/lib/report';
import { bookHeader } from '@/lib/bookHeader';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bản luận giải trọn đời',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

export default async function LifeBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await getChartRow(id);
  if (!row) notFound();
  if (!row.is_pro) redirect(`/la-so/${row.id}#mo-khoa`);
  const { chart, book } = computeReport(row.birth_input, row.conventions, true);
  return (
    <div className="wrap narrow-report">
      <p className="small no-print" style={{ marginTop: 20 }}>
        <Link href={`/la-so/${row.id}`}>← Về trang lá số</Link>
      </p>
      <BookView book={book!} {...bookHeader(chart, book!)} />
    </div>
  );
}
