/** "Bản luận giải trọn đời" dạng sách: mục lục, các phần, in/lưu PDF. Không dùng hook — dùng được ở server lẫn client. */
import type { Book } from '@/lib/book';
import { PrintButton } from './Actions';

function Blocks({ blocks }: { blocks: Book['sections'][number]['blocks'] }) {
  const out: React.ReactNode[] = [];
  let ul: string[] = [];
  const flush = (k: number) => {
    if (ul.length) {
      out.push(
        <ul key={`u${k}`} className="ai-list">
          {ul.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>,
      );
      ul = [];
    }
  };
  blocks.forEach((b, i) => {
    if (b.t === 'li') {
      ul.push(b.text);
      return;
    }
    flush(i);
    if (b.t === 'h') out.push(<h4 key={i}>{b.text}</h4>);
    else if (b.t === 'check')
      out.push(
        <p key={i} className="selfcheck">
          <b>Tự kiểm chứng:</b> {b.text}
        </p>,
      );
    else if (b.t === 'decision')
      out.push(
        <p key={i} className="decision">
          {b.text}
        </p>,
      );
    else out.push(<p key={i}>{b.text}</p>);
  });
  flush(blocks.length);
  return <>{out}</>;
}

export default function BookView({ book, name, line }: { book: Book; name: string; line: string }) {
  const parts = [...new Set(book.sections.map((s) => s.part))];
  return (
    <div className="ai-report">
      <header className="ai-cover">
        <p className="eyebrow">Bản luận giải trọn đời của MệnhLab</p>
        <h1>{name}</h1>
        <p className="muted">{line}</p>
        <p className="small muted no-print">
          {book.words.toLocaleString('vi-VN')} chữ · {book.sections.length} phần · <PrintButton />
        </p>
        <nav className="ai-toc" aria-label="Mục lục">
          {parts.map((p) => (
            <div key={p}>
              <b>{p}</b>
              <ul>
                {book.sections
                  .filter((s) => s.part === p)
                  .map((s) => (
                    <li key={s.key}>
                      <a href={`#${s.key}`}>{s.title}</a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>
        <p className="small muted">
          Mọi nhận định được dựng từ quy tắc Tử Vi áp vào đúng lá số của bạn, kèm căn cứ trong ngoặc. Căn cứ chi tiết của từng cung nằm ở mục "Vì sao lá
          số nói vậy?" trên trang lá số. Tử Vi là hệ thống văn hóa để tự suy ngẫm, chưa được khoa học chứng minh khả năng dự đoán.
        </p>
      </header>
      {parts.map((p) => (
        <section key={p} className="ai-part">
          <h2>{p}</h2>
          {book.sections
            .filter((s) => s.part === p)
            .map((s) => (
              <article key={s.key} id={s.key} className="ai-section">
                <h3>{s.title}</h3>
                <Blocks blocks={s.blocks} />
              </article>
            ))}
        </section>
      ))}
    </div>
  );
}
