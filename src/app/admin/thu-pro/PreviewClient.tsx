'use client';

import { useState } from 'react';
import BirthForm from '@/components/BirthForm';
import ChartReport from '@/components/ChartReport';
import type { BirthInput, Conventions } from '@/lib/engine/birth';
import type { computeReport } from '@/lib/report';

type Report = ReturnType<typeof computeReport>;

async function post<T>(body: unknown): Promise<T> {
  const res = await fetch('/api/admin/preview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Có lỗi xảy ra.');
  return data as T;
}

export default function PreviewClient({ aiEnabled }: { aiEnabled: boolean }) {
  const [draft, setDraft] = useState<{ input: BirthInput; conventions: Conventions } | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');
  const [synthesis, setSynthesis] = useState('');
  const [qa, setQa] = useState<{ q: string; a: string }[]>([]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState('');

  async function load(input: BirthInput, conventions: Conventions) {
    setError('');
    setSynthesis('');
    setQa([]);
    try {
      const r = await post<Report>({ input, conventions });
      setDraft({ input, conventions });
      setReport(r);
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi');
    }
  }

  async function ai(action: 'synthesis' | 'ask') {
    if (!draft) return;
    setError('');
    setBusy(action);
    try {
      const r = await post<{ text: string }>({ ...draft, action, question: q, history: qa });
      if (action === 'synthesis') setSynthesis(r.text);
      else {
        setQa((x) => [...x, { q, a: r.text }]);
        setQ('');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi');
    } finally {
      setBusy('');
    }
  }

  if (!report) {
    return (
      <div className="wrap narrow" style={{ padding: '32px 16px' }}>
        <h1>Xem thử bản Pro</h1>
        <p className="hero-lede">
          Nhập ngày giờ sinh bất kỳ để xem đúng giao diện và nội dung khách hàng nhận được sau khi mua Pro. Không lưu gì, không gửi email, không
          tạo đơn hàng.
        </p>
        {error && <p className="alert">{error}</p>}
        <BirthForm onPreview={load} submitLabel="Xem bản Pro" />
      </div>
    );
  }

  return (
    <>
      <div className="wrap no-print" style={{ paddingTop: 16 }}>
        <p className="note" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', margin: 0 }}>
          <span>
            <b>Bản xem thử Pro (chỉ quản trị viên thấy).</b> Khách hàng thật thấy đúng nội dung này sau khi thanh toán.
          </span>
          <button type="button" className="btn ghost" onClick={() => setReport(null)}>
            Thử lá số khác
          </button>
        </p>
      </div>
      <ChartReport
        chart={report.chart}
        reading={report.reading}
        sensitivity={report.sensitivity}
        patterns={report.patterns}
        derivation={report.derivation}
        menhKey={report.menhKey}
        isPro
        adminPreview
      />
      <div className="wrap">
        <section className="section">
          <h2>Thử AI (luận giải tổng hợp và hỏi đáp)</h2>
          {!aiEnabled ? (
            <p className="muted">
              Chưa bật: thêm biến ANTHROPIC_API_KEY trên Vercel rồi Redeploy để thử. Không bật AI thì gói Pro vẫn có đầy đủ phần luận giải theo
              quy tắc ở trên.
            </p>
          ) : (
            <>
              {synthesis ? (
                <div className="prose">
                  {synthesis.split('\n').map((line, i) =>
                    line.startsWith('## ') ? <h3 key={i}>{line.slice(3)}</h3> : line.trim() ? <p key={i}>{line}</p> : null,
                  )}
                </div>
              ) : (
                <button type="button" className="btn" onClick={() => ai('synthesis')} disabled={!!busy}>
                  {busy === 'synthesis' ? 'Đang viết (khoảng 30 giây)…' : 'Viết bản luận giải tổng hợp'}
                </button>
              )}
              <h3>Hỏi thử</h3>
              {qa.map((x, i) => (
                <div key={i} className="reading">
                  <p>
                    <b>{x.q}</b>
                  </p>
                  <div className="prose">{x.a.split('\n').map((l, j) => (l.trim() ? <p key={j}>{l}</p> : null))}</div>
                </div>
              ))}
              <div className="field">
                <label htmlFor="pq">Câu hỏi</label>
                <textarea id="pq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ví dụ: Lá số cho thấy tôi hợp môi trường làm việc nào?" />
                <div>
                  <button type="button" className="btn" onClick={() => ai('ask')} disabled={!!busy || q.trim().length < 5}>
                    {busy === 'ask' ? 'Đang trả lời…' : 'Gửi câu hỏi'}
                  </button>
                </div>
              </div>
            </>
          )}
          {error && <p className="alert">{error}</p>}
        </section>
      </div>
    </>
  );
}
