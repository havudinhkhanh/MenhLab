import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MAJOR_STARS, slug } from '@/lib/engine/names';
import { MAJOR } from '@/content/stars';
import { CHI } from '@/lib/engine/canchi';
import { PALACE_NAMES, brightnessRows, starBySlug, starHref, starPalaceRate } from '@/lib/seo';
import { fmtPct } from '@/data/rates';

export function generateStaticParams() {
  return MAJOR_STARS.map((s) => ({ sao: slug(s) }));
}

export async function generateMetadata({ params }: { params: Promise<{ sao: string }> }): Promise<Metadata> {
  const s = starBySlug((await params).sao);
  return s ? { title: `Sao ${s}: ý nghĩa, độ sáng và 12 cung`, description: `${MAJOR[s].nickname}. ${MAJOR[s].short}` } : {};
}

export default async function StarPage({ params }: { params: Promise<{ sao: string }> }) {
  const s = starBySlug((await params).sao);
  if (!s) notFound();
  const m = MAJOR[s];
  return (
    <div className="wrap narrow" style={{ paddingTop: 32 }}>
      <p className="small">
        <Link href="/sao">14 chính tinh</Link>
      </p>
      <h1>Sao {s}</h1>
      <p className="hero-lede">
        {m.nickname}. Hành {m.element}.
      </p>
      <div className="prose">
        <p>{m.long}</p>
        <p>
          <b>Mặt mạnh:</b> {m.strengths.join('; ')}. <b>Cần để ý:</b> {m.watch.join('; ')}.
        </p>
      </div>
      <h2>{s} ở từng cung</h2>
      <table className="simple">
        <thead>
          <tr>
            <th>Cung</th>
            <th>Tỷ lệ người có</th>
          </tr>
        </thead>
        <tbody>
          {PALACE_NAMES.map((p) => (
            <tr key={p}>
              <td>
                <Link href={starHref(s, p)}>
                  {s} ở cung {p}
                </Link>
              </td>
              <td>{fmtPct(starPalaceRate(s, p))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Độ sáng theo vị trí</h2>
      <table className="simple">
        <thead>
          <tr>
            <th>Địa Chi</th>
            <th>Sách Việt</th>
            <th>Toàn Thư</th>
          </tr>
        </thead>
        <tbody>
          {brightnessRows(s).map((r) => (
            <tr key={r.branch}>
              <td>{CHI[r.branch]}</td>
              <td>{r.viet}</td>
              <td>{r.toanThu}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
