'use client';

/**
 * Bản luận giải trọn đời (AI): tự viết các phần còn thiếu (vài phần song song), hiện dần khi xong.
 * Dùng cho lá số đã lưu (Pro) và bản xem thử của quản trị viên.
 */
import { useEffect, useRef, useState } from 'react';
import type { AiSectionMeta } from '@/lib/aiReport';
import type { BirthInput, Conventions } from '@/lib/engine/birth';

type State = Record<string, { text?: string; error?: string; busy?: boolean }>;

function Body({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  const out: React.ReactNode[] = [];
  blocks.forEach((b, i) => {
    const lines = b.split('\n').filter((l) => l.trim());
    if (!lines.length) return;
    if (lines[0].startsWith('### ')) {
      out.push(<h4 key={`h${i}`}>{lines[0].slice(4)}</h4>);
      lines.shift();
      if (!lines.length) return;
    }
    if (lines.every((l) => /^\s*-\s+/.test(l))) {
      out.push(
        <ul key={`u${i}`} className="ai-list">
          {lines.map((l, j) => (
            <li key={j}>{l.replace(/^\s*-\s+/, '')}</li>
          ))}
        </ul>,
      );
      return;
    }
    const t = lines.join(' ');
    if (t.startsWith('Tự kiểm chứng:'))
      out.push(
        <p key={`s${i}`} className="selfcheck">
          <b>Tự kiểm chứng:</b> {t.slice('Tự kiểm chứng:'.length).trim()}
        </p>,
      );
    else if (t.startsWith('Quyết định nên làm:'))
      out.push(
        <p key={`q${i}`} className="decision">
          <b>Quyết định nên làm:</b> {t.slice('Quyết định nên làm:'.length).trim()}
        </p>,
      );
    else out.push(<p key={`p${i}`}>{t}</p>);
  });
  return <>{out}</>;
}

export default function AiReportView({
  sections,
  initial,
  chartId,
  preview,
  enabled,
  header,
}: {
  sections: AiSectionMeta[];
  initial: Record<string, string>;
  chartId?: string;
  preview?: { input: BirthInput; conventions: Conventions };
  enabled: boolean;
  header: { name: string; line: string };
}) {
  const [st, setSt] = useState<State>(() => Object.fromEntries(Object.entries(initial).map(([k, text]) => [k, { text }])));
  const started = useRef(false);

  async function gen(key: string) {
    setSt((s) => ({ ...s, [key]: { busy: true } }));
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chartId ? { chartId, key } : { ...preview, key }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Có lỗi xảy ra.');
      setSt((s) => ({ ...s, [key]: { text: data.text } }));
    } catch (e) {
      setSt((s) => ({ ...s, [key]: { error: e instanceof Error ? e.message : 'Lỗi' } }));
    }
  }

  async function runMissing(keys: string[]) {
    const queue = [...keys];
    const worker = async () => {
      while (queue.length) await gen(queue.shift()!);
    };
    await Promise.all(Array.from({ length: Math.min(4, queue.length) }, worker));
  }

  useEffect(() => {
    if (started.current || !enabled) return;
    started.current = true;
    const missing = sections.map((s) => s.key).filter((k) => !initial[k]);
    if (missing.length) void runMissing(missing);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = sections.filter((s) => st[s.key]?.text).length;
  const words = sections.reduce((a, s) => a + (st[s.key]?.text?.split(/\s+/).length ?? 0), 0);
  const failed = sections.filter((s) => st[s.key]?.error).map((s) => s.key);
  const parts = [...new Set(sections.map((s) => s.part))];

  return (
    <div className="ai-report">
      <header className="ai-cover">
        <p className="eyebrow">Bản luận giải trọn đời · MệnhLab</p>
        <h1>{header.name}</h1>
        <p className="muted">{header.line}</p>
        {!enabled ? (
          <p className="alert">Tính năng viết bằng AI chưa được bật trên máy chủ (thiếu ANTHROPIC_API_KEY).</p>
        ) : done < sections.length ? (
          <div className="no-print">
            <div className="meter" aria-label={`Đã viết ${done}/${sections.length} phần`}>
              <span style={{ width: `${Math.round((done / sections.length) * 100)}%` }} />
            </div>
            <p className="small muted">
              Đang viết riêng cho bạn: {done}/{sections.length} phần ({words.toLocaleString('vi-VN')} chữ). Lần đầu mất khoảng 2–4 phút; phần nào xong sẽ
              hiện ngay, lần sau mở lại là có sẵn.
            </p>
            {failed.length > 0 && (
              <button type="button" className="btn ghost" onClick={() => void runMissing(failed)}>
                Thử viết lại {failed.length} phần bị lỗi
              </button>
            )}
          </div>
        ) : (
          <p className="small muted no-print">
            {words.toLocaleString('vi-VN')} chữ · {sections.length} phần.{' '}
            <button type="button" className="btn ghost" onClick={() => window.print()}>
              In hoặc lưu PDF
            </button>
          </p>
        )}
        <nav className="ai-toc no-print" aria-label="Mục lục">
          {parts.map((p) => (
            <div key={p}>
              <b>{p}</b>
              <ul>
                {sections
                  .filter((s) => s.part === p)
                  .map((s) => (
                    <li key={s.key}>
                      <a href={`#${s.key}`}>{s.title}</a> {st[s.key]?.text ? '' : st[s.key]?.busy ? '· đang viết…' : st[s.key]?.error ? '· lỗi' : '· chờ'}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>
        <p className="small muted">
          Bản này do AI viết dựa trên đúng dữ kiện lá số MệnhLab đã tính, và được máy kiểm tra trước khi hiện ra: không nhắc sao không có trên lá
          số, không dùng ngôn ngữ hù dọa hay phán bệnh. Căn cứ chi tiết của từng nhận định nằm ở mục "Vì sao lá số nói vậy?" trên trang lá số. Tử
          Vi là hệ thống văn hóa để tự suy ngẫm, chưa được khoa học chứng minh khả năng dự đoán.
        </p>
      </header>

      {parts.map((p) => (
        <section key={p} className="ai-part">
          <h2>{p}</h2>
          {sections
            .filter((s) => s.part === p)
            .map((s) => (
              <article key={s.key} id={s.key} className="ai-section">
                <h3>{s.title}</h3>
                {st[s.key]?.text ? (
                  <Body text={st[s.key]!.text!} />
                ) : st[s.key]?.error ? (
                  <p className="alert">
                    {st[s.key]!.error}{' '}
                    <button type="button" className="btn ghost" onClick={() => void gen(s.key)}>
                      Thử lại
                    </button>
                  </p>
                ) : (
                  <p className="muted small">{st[s.key]?.busy ? 'Đang viết…' : 'Đang chờ đến lượt…'}</p>
                )}
              </article>
            ))}
        </section>
      ))}
    </div>
  );
}
