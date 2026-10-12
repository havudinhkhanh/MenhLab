import type { Metadata } from 'next';
import Link from 'next/link';
import { MAJOR_STARS } from '@/lib/engine/names';
import { MAJOR } from '@/content/stars';
import { PALACE_NAMES, starHref } from '@/lib/seo';

export const metadata: Metadata = {
  title: '14 chính tinh trong 12 cung',
  description: 'Ý nghĩa 14 chính tinh Tử Vi ở từng cung, có căn cứ, tỷ lệ nền và so sánh hai trường phái độ sáng.',
};

export default function StarsIndex() {
  return (
    <div className="wrap" style={{ paddingTop: 32 }}>
      <h1>14 chính tinh trong 12 cung</h1>
      <p className="hero-lede" style={{ marginBottom: 24 }}>
        168 tổ hợp, mỗi trang ghi rõ sách nói gì, tỷ lệ bao nhiêu người có tổ hợp đó, sao thường đi cùng, và hai trường phái xếp độ sáng khác
        nhau ở đâu.
      </p>
      <div style={{ overflowX: 'auto' }}>
        <table className="simple" style={{ minWidth: 900 }}>
          <thead>
            <tr>
              <th>Sao</th>
              {PALACE_NAMES.map((p) => (
                <th key={p} className="small">
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MAJOR_STARS.map((s) => (
              <tr key={s}>
                <th>
                  <Link href={starHref(s)}>{s}</Link>
                  <div className="small muted" style={{ fontWeight: 400 }}>
                    {MAJOR[s].nickname.split(' — ')[0]}
                  </div>
                </th>
                {PALACE_NAMES.map((p) => (
                  <td key={p} className="small">
                    <Link href={starHref(s, p)} aria-label={`${s} ở cung ${p}`}>
                      Xem
                    </Link>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
