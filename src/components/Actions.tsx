'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CONSENT_TEXT } from '@/lib/config';
import type { BirthInput, Conventions } from '@/lib/engine/birth';

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
  return data as T;
}

/* ------------------------------ Thanh toán ------------------------------ */

interface CheckoutResult {
  checkoutUrl?: string;
  bank?: { qr: string; account: string; holder: string; amount: number; content: string; bankBin: string };
  orderCode: number;
}

export function CheckoutButton({ chartId, label }: { chartId: string; label: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [bank, setBank] = useState<CheckoutResult['bank'] | null>(null);
  const [agree, setAgree] = useState(false);

  async function go() {
    setError('');
    if (!agree) return setError('Vui lòng xác nhận đã đọc điều khoản trước khi thanh toán.');
    setBusy(true);
    try {
      const r = await post<CheckoutResult>('/api/checkout', { chartId });
      if (r.checkoutUrl) window.location.href = r.checkoutUrl;
      else if (r.bank) setBank(r.bank);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi');
    } finally {
      setBusy(false);
    }
  }

  if (bank) {
    return (
      <div className="panel" style={{ maxWidth: 420 }}>
        <p>
          <b>Chuyển khoản để mở khóa</b>
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={bank.qr} alt="Mã VietQR chuyển khoản" width={280} height={280} style={{ maxWidth: '100%', height: 'auto' }} />
        <table className="simple">
          <tbody>
            <tr>
              <th>Số tài khoản</th>
              <td>{bank.account}</td>
            </tr>
            <tr>
              <th>Chủ tài khoản</th>
              <td>{bank.holder}</td>
            </tr>
            <tr>
              <th>Số tiền</th>
              <td>{bank.amount.toLocaleString('vi-VN')}₫</td>
            </tr>
            <tr>
              <th>Nội dung</th>
              <td>
                <b>{bank.content}</b>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="small muted" style={{ marginTop: 8 }}>
          Vui lòng giữ đúng nội dung chuyển khoản. Bản Pro được mở trong giờ làm việc sau khi đối soát; bạn sẽ nhận email xác nhận.
        </p>
      </div>
    );
  }

  return (
    <div>
      <label className="check">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>
          Tôi đã đọc <a href="/dieu-khoan">Điều khoản</a> và hiểu rằng nội dung là luận giải văn hóa để tham khảo, không phải dự báo hay lời
          khuyên chuyên môn.
        </span>
      </label>
      <button type="button" className="btn" onClick={go} disabled={busy}>
        {busy ? 'Đang tạo thanh toán…' : label}
      </button>
      {error && (
        <p className="alert" role="alert" style={{ marginTop: 12 }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------ Lưu lá số (từ chế độ xem nhanh) ------------------------------ */

export function SaveChart({ input, conventions }: { input: BirthInput; conventions: Conventions }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [c1, setC1] = useState(false);
  const [c2, setC2] = useState(false);
  const [c3, setC3] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!c1) return setError('Cần đồng ý mục xử lý dữ liệu để lưu lá số.');
    setBusy(true);
    try {
      const r = await post<{ id: string }>('/api/charts', {
        input,
        conventions,
        email,
        consent: { processing: c1, marketing: c2, research: c3 },
      });
      sessionStorage.removeItem('menhlab:draft');
      router.push(`/la-so/${r.id}?moi=1&tn=0#mo-khoa`); // đã xem lá số rồi → không làm thí nghiệm mù
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="panel" style={{ maxWidth: 560 }}>
      <p>Bản Pro gắn với một lá số đã lưu, để bạn mở lại được trên mọi thiết bị.</p>
      <div className="field">
        <label htmlFor="sv-em">Email</label>
        <input id="sv-em" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </div>
      <label className="check">
        <input type="checkbox" checked={c1} onChange={(e) => setC1(e.target.checked)} />
        <span>
          <b>Bắt buộc để lưu:</b> {CONSENT_TEXT.processing}
        </span>
      </label>
      <label className="check">
        <input type="checkbox" checked={c2} onChange={(e) => setC2(e.target.checked)} />
        <span>
          <b>Không bắt buộc:</b> {CONSENT_TEXT.marketing}
        </span>
      </label>
      <label className="check">
        <input type="checkbox" checked={c3} onChange={(e) => setC3(e.target.checked)} />
        <span>
          <b>Không bắt buộc:</b> {CONSENT_TEXT.research}
        </span>
      </label>
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      <button className="btn" type="submit" disabled={busy}>
        {busy ? 'Đang lưu…' : 'Lưu lá số'}
      </button>
    </form>
  );
}

/* ------------------------------ Xóa dữ liệu ------------------------------ */

export function DeleteData({ chartId }: { chartId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');

  async function del() {
    try {
      await post('/api/delete', { chartId });
      router.push('/?da-xoa=1');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi');
    }
  }

  return (
    <div>
      {step === 0 ? (
        <button type="button" className="btn danger" onClick={() => setStep(1)}>
          Xóa dữ liệu của tôi
        </button>
      ) : (
        <div className="alert">
          <p>
            Xóa vĩnh viễn lá số này, email và các phản hồi đi kèm. Bản Pro (nếu đã mua) cũng mất theo và không hoàn tác được. Đơn hàng
            chỉ còn lại số tiền và mã đơn để phục vụ kế toán.
          </p>
          <button type="button" className="btn danger" onClick={del}>
            Xóa vĩnh viễn
          </button>{' '}
          <button type="button" className="btn ghost" onClick={() => setStep(0)}>
            Giữ lại
          </button>
        </div>
      )}
      {error && <p className="alert">{error}</p>}
    </div>
  );
}

export function PrintButton() {
  return (
    <button type="button" className="btn ghost" onClick={() => window.print()}>
      In hoặc lưu PDF
    </button>
  );
}

/* ------------------------------ AI (Pro) ------------------------------ */

export function AiPanel({
  chartId,
  initialSynthesis,
  initialQa,
  limit,
}: {
  chartId: string;
  initialSynthesis: string | null;
  initialQa: { q: string; a: string }[];
  limit: number;
}) {
  const [synthesis, setSynthesis] = useState(initialSynthesis);
  const [qa, setQa] = useState(initialQa);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<'' | 'syn' | 'ask'>('');
  const [error, setError] = useState('');

  async function run(action: 'synthesis' | 'ask') {
    setError('');
    setBusy(action === 'synthesis' ? 'syn' : 'ask');
    try {
      const r = await post<{ text: string }>('/api/ai', { chartId, action, question: q });
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

  return (
    <div>
      {synthesis ? (
        <div className="prose">
          {synthesis.split('\n').map((line, i) =>
            line.startsWith('## ') ? <h3 key={i}>{line.slice(3)}</h3> : line.trim() ? <p key={i}>{line}</p> : null,
          )}
        </div>
      ) : (
        <button type="button" className="btn" onClick={() => run('synthesis')} disabled={!!busy}>
          {busy === 'syn' ? 'Đang viết (khoảng 30 giây)…' : 'Viết bản luận giải tổng hợp'}
        </button>
      )}

      <h3>Hỏi về lá số của bạn</h3>
      <p className="small muted">
        Còn {Math.max(0, limit - qa.length)}/{limit} câu hỏi. Câu trả lời luôn dẫn căn cứ trên lá số; không trả lời về sức khỏe, pháp lý,
        đầu tư cụ thể.
      </p>
      {qa.map((x, i) => (
        <div key={i} className="reading">
          <p>
            <b>{x.q}</b>
          </p>
          <div className="prose">
            {x.a.split('\n').map((l, j) => (l.trim() ? <p key={j}>{l}</p> : null))}
          </div>
        </div>
      ))}
      {qa.length < limit && (
        <div className="field">
          <label htmlFor="q">Câu hỏi</label>
          <textarea id="q" value={q} onChange={(e) => setQ(e.target.value)} maxLength={600} placeholder="Ví dụ: Lá số cho thấy tôi hợp môi trường làm việc nào?" />
          <div>
            <button type="button" className="btn" onClick={() => run('ask')} disabled={!!busy || q.trim().length < 5}>
              {busy === 'ask' ? 'Đang trả lời…' : 'Gửi câu hỏi'}
            </button>
          </div>
        </div>
      )}
      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------ Tìm lá số theo email ------------------------------ */

export function FindCharts() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await post('/api/my-charts', { email });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi');
    } finally {
      setBusy(false);
    }
  }

  if (done)
    return <p className="note">Nếu email này có lá số đã lưu, danh sách link sẽ đến hộp thư trong vài phút. Nhớ kiểm tra mục Spam/Quảng cáo.</p>;
  return (
    <form onSubmit={submit} className="panel" style={{ maxWidth: 480 }}>
      <div className="field">
        <label htmlFor="fe">Email đã dùng khi lưu lá số</label>
        <input id="fe" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </div>
      {error && <p className="alert">{error}</p>}
      <button className="btn" type="submit" disabled={busy}>
        Gửi link lá số về email
      </button>
    </form>
  );
}
