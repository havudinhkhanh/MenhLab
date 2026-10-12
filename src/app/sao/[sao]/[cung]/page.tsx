import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MAJOR_STARS, slug } from '@/lib/engine/names';
import { MAJOR } from '@/content/stars';
import { DOMAIN_LABEL, PALACES } from '@/content/palaces';
import { CHI } from '@/lib/engine/canchi';
import { COMBOS } from '@/lib/reading';
import { PALACE_NAMES, brightnessRows, companions, palaceBySlug, starBySlug, starHref, starPalaceRate, RATES_N } from '@/lib/seo';
import { fmtPct, oneIn } from '@/data/rates';
import { T } from '@/components/TermLayer';

export function generateStaticParams() {
  return MAJOR_STARS.flatMap((s) => PALACE_NAMES.map((p) => ({ sao: slug(s), cung: slug(p) })));
}

async function resolve(params: Promise<{ sao: string; cung: string }>) {
  const { sao, cung } = await params;
  const s = starBySlug(sao);
  const p = palaceBySlug(cung);
  return s && p ? { s, p } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ sao: string; cung: string }> }): Promise<Metadata> {
  const r = await resolve(params);
  if (!r) return {};
  const rate = starPalaceRate(r.s, r.p);
  return {
    title: `${r.s} ở cung ${r.p}: ý nghĩa, căn cứ và tỷ lệ`,
    description: `${r.s} (${MAJOR[r.s].nickname.split(' — ')[1] ?? ''}) tại cung ${r.p} — lĩnh vực ${DOMAIN_LABEL[PALACES[r.p].domain]}. ${rate !== undefined ? `Khoảng ${fmtPct(rate)} số người có tổ hợp này. ` : ''}Giải thích dễ hiểu, có căn cứ, không phán chung chung.`,
    alternates: { canonical: starHref(r.s, r.p) },
  };
}

const lower = (x: string) => x.charAt(0).toLowerCase() + x.slice(1);

export default async function StarPalacePage({ params }: { params: Promise<{ sao: string; cung: string }> }) {
  const r = await resolve(params);
  if (!r) notFound();
  const { s, p } = r;
  const m = MAJOR[s];
  const info = PALACES[p];
  const domain = DOMAIN_LABEL[info.domain];
  const rate = starPalaceRate(s, p);
  const comp = companions(s, p);
  const rows = brightnessRows(s);
  const disagree = rows.filter((x) => {
    const n = (v: string) => (v === 'Lợi' ? 'Đắc' : v === 'Bất đắc' ? 'Bình' : v);
    return !x.viet.startsWith('không') && n(x.toanThu) !== x.viet;
  }).length;
  const domainText = m.domains[info.domain] ?? `Trong lĩnh vực ${domain}, ${s} mang sắc thái: ${lower(m.short)}`;

  return (
    <div className="wrap narrow" style={{ paddingTop: 32 }}>
      <p className="small">
        <Link href="/sao">14 chính tinh</Link> › <Link href={starHref(s)}>{s}</Link>
      </p>
      <h1>
        {s} ở cung {p}
      </h1>
      <p className="hero-lede">
        <T name={s}>{s}</T> là {lower(m.nickname)}. <T name={`Cung ${p}`}>Cung {p}</T> nói về {domain}. Trang này giải thích tổ hợp đó theo sách,
        kèm căn cứ và số liệu — không phán chung chung.
      </p>

      <h2>Sách nói gì</h2>
      <div className="prose">
        <p>{domainText}</p>
        <p>{info.modern}</p>
        <p>
          Khi {s} phát huy tốt (độ sáng cao, có cát tinh hỗ trợ), sách nhấn mạnh: {m.strengths.map(lower).join('; ')}. Khi {s} hãm địa hoặc gặp
          sát tinh, mặt cần để ý: {m.watch.map(lower).join('; ')}.
        </p>
        <p className="small muted">
          Cách đọc đúng: một cung không bao giờ đọc riêng lẻ — phải xem cùng <T>Tam phương tứ chính</T>, độ sáng, <T>Tứ Hóa</T> và{' '}
          <T>Tuần</T>/<T>Triệt</T>. Những gì viết ở đây là xu hướng chung của tổ hợp, không phải lời phán cho một người cụ thể.
        </p>
      </div>

      {comp.length > 0 && (
        <>
          <h2>{s} ở cung {p} thường đi cùng sao nào</h2>
          <p>Khi {s} nằm ở cung {p}, chính tinh cùng cung (đồng cung) phân bố như sau:</p>
          <table className="simple">
            <tbody>
              {comp.map((c) => {
                const key1 = [s, ...c.with].join('+');
                const key2 = [...c.with, s].join('+');
                const note = c.with.length === 1 ? COMBOS[key1] ?? COMBOS[key2] : undefined;
                return (
                  <tr key={c.with.join('+') || 'alone'}>
                    <td style={{ width: '38%' }}>
                      {c.with.length === 0 ? (
                        `${s} đứng một mình`
                      ) : (
                        <>
                          Cùng{' '}
                          {c.with.map((w, i) => (
                            <span key={w}>
                              {i > 0 && ', '}
                              <Link href={starHref(w, p)}>{w}</Link>
                            </span>
                          ))}
                        </>
                      )}
                      <div className="small muted">{fmtPct(c.share)} các trường hợp</div>
                    </td>
                    <td className="small">{note ?? (c.with.length === 0 ? `Ý nghĩa chủ yếu do ${s} quyết định, cộng với phụ tinh trong cung.` : '')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      <h2>Độ sáng: phụ thuộc cung nằm ở Địa Chi nào</h2>
      <p>
        Cung {p} có thể nằm ở bất kỳ ô nào trong 12 ô, tùy ngày giờ sinh. Vì vậy độ sáng của {s} ở cung {p} khác nhau giữa người này và người
        khác. Hai trường phái xếp khác nhau ở {disagree}/12 vị trí của sao này.
      </p>
      <table className="simple">
        <thead>
          <tr>
            <th>Địa Chi</th>
            <th>
              <T name="Miếu">Sách Việt</T>
            </th>
            <th>Toàn Thư</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((x) => (
            <tr key={x.branch}>
              <td>{CHI[x.branch]}</td>
              <td>{x.viet}</td>
              <td>{x.toanThu}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {rate !== undefined && (
        <>
          <h2>Bao nhiêu người có {s} ở cung {p}?</h2>
          <p>
            Khoảng <b>{fmtPct(rate)}</b> số người ({oneIn(rate)}) — mức trung bình nếu chia đều 12 cung là 8,3%. Ở Việt Nam, đó là hàng triệu
            người. Nếu một trang nào đó nói tổ hợp này là "hiếm" hay "số đặc biệt", bạn đã biết cách kiểm tra.
          </p>
          <p className="small muted">
            Mô phỏng {RATES_N.toLocaleString('vi-VN')} ngày giờ sinh ngẫu nhiên 1950–2009. <Link href="/nghien-cuu#ty-le-nen">Phương pháp</Link>.
          </p>
        </>
      )}

      <h2>Câu hỏi để tự kiểm chứng</h2>
      <ul>
        {info.questions.map((q) => (
          <li key={q}>{q}</li>
        ))}
        <li>Mô tả ở trên có đúng với hầu hết mọi người bạn quen không? Nếu có, đó là dấu hiệu của <T>Hiệu ứng Barnum</T>.</li>
      </ul>

      <div className="panel" style={{ margin: '32px 0' }}>
        <p style={{ marginTop: 0 }}>
          <b>Cung {p} của bạn có sao gì?</b> Lập lá số miễn phí — mọi thuật ngữ đều được giải thích, mọi nhận định có căn cứ.
        </p>
        <Link className="btn" href="/#lap-la-so">
          Lập lá số miễn phí
        </Link>
      </div>

      <h2>Xem thêm</h2>
      <p className="small">
        <b>{s} ở cung khác:</b>{' '}
        {PALACE_NAMES.filter((x) => x !== p).map((x, i) => (
          <span key={x}>
            {i > 0 && ' · '}
            <Link href={starHref(s, x)}>{x}</Link>
          </span>
        ))}
      </p>
      <p className="small">
        <b>Sao khác ở cung {p}:</b>{' '}
        {MAJOR_STARS.filter((x) => x !== s).map((x, i) => (
          <span key={x}>
            {i > 0 && ' · '}
            <Link href={starHref(x, p)}>{x}</Link>
          </span>
        ))}
      </p>
    </div>
  );
}
