import type { Metadata } from 'next';
import { GLOSSARY, GROUP_LABEL, type TermGroup } from '@/content/glossary';

export const metadata: Metadata = {
  title: 'Từ điển thuật ngữ Tử Vi',
  description: 'Giải thích dễ hiểu mọi thuật ngữ trên lá số Tử Vi: Cục, Tuần, Triệt, Tứ Hóa, Miếu Vượng Đắc Hãm, 14 chính tinh, 12 cung...',
};

export default function Glossary() {
  const groups = Object.keys(GROUP_LABEL) as TermGroup[];
  return (
    <div className="wrap" style={{ paddingTop: 32 }}>
      <h1>Từ điển Tử Vi</h1>
      <p className="hero-lede" style={{ marginBottom: 32 }}>
        {GLOSSARY.length} thuật ngữ, viết cho người chưa từng đọc sách Tử Vi. Trên lá số, bạn có thể chạm vào bất kỳ thuật ngữ nào để xem bản
        ngắn.
      </p>
      <div className="gloss">
        <nav className="gloss-nav" aria-label="Nhóm thuật ngữ">
          {groups.map((g) => (
            <a key={g} href={`#nhom-${g}`}>
              {GROUP_LABEL[g]}
            </a>
          ))}
        </nav>
        <div>
          {groups.map((g) => (
            <section key={g} id={`nhom-${g}`} style={{ scrollMarginTop: 16 }}>
              <h2 style={{ marginTop: 0, paddingTop: 8 }}>{GROUP_LABEL[g]}</h2>
              <dl>
                {GLOSSARY.filter((t) => t.group === g).map((t) => (
                  <div key={t.key}>
                    <dt id={t.key}>{t.term}</dt>
                    <dd>{t.long ?? t.short}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
