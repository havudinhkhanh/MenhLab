import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LESSONS } from '@/content/lessons';
import Quiz from '@/components/Quiz';
import { T } from '@/components/TermLayer';

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = LESSONS.find((x) => x.slug === slug);
  return l ? { title: l.title, description: l.summary } : {};
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = LESSONS.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const l = LESSONS[i];
  const next = LESSONS[i + 1];
  const prev = LESSONS[i - 1];
  return (
    <div className="wrap narrow" style={{ paddingTop: 32 }}>
      <p className="small">
        <Link href="/hoc">Học đọc lá số</Link> · Bài {i + 1}/{LESSONS.length}
      </p>
      <h1>{l.title}</h1>
      <div className="prose">
        {l.body.map((p, j) => (
          <p key={j}>{p}</p>
        ))}
      </div>
      <p className="small">
        Thuật ngữ trong bài:{' '}
        {l.terms.map((t, j) => (
          <span key={t}>
            {j > 0 && ', '}
            <T name={t}>{t}</T>
          </span>
        ))}
      </p>
      <h2>Kiểm tra nhanh</h2>
      <Quiz items={l.quiz} />
      <nav style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
        {prev ? <Link href={`/hoc/${prev.slug}`}>Bài trước: {prev.title}</Link> : <span />}
        {next ? (
          <Link href={`/hoc/${next.slug}`}>Bài tiếp: {next.title}</Link>
        ) : (
          <Link href="/#lap-la-so">Lập lá số và tự đọc</Link>
        )}
      </nav>
    </div>
  );
}
