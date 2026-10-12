'use client';

/**
 * Thí nghiệm ghép cặp mù, hiện TRƯỚC khi người dùng thấy lá số.
 * 4 mô tả cung Mệnh (ẩn tên sao): 1 của chính họ, 3 của bộ sao khác, chọn theo đúng tỷ lệ trong dân số.
 * Nếu Tử Vi không mô tả được ai, tỷ lệ chọn đúng trên toàn bộ người tham gia sẽ quanh 25%.
 */
import { useEffect, useState } from 'react';
import { blindMenhText } from '@/content/blind';

const N_OPTIONS = 4;

function pickDecoys(truth: string, pool: Record<string, number>): string[] {
  const entries = Object.entries(pool).filter(([k]) => k !== truth && blindMenhText(k) !== blindMenhText(truth));
  const chosen: string[] = [];
  while (chosen.length < N_OPTIONS - 1 && entries.length) {
    const total = entries.reduce((a, [, w]) => a + w, 0);
    let r = Math.random() * total;
    const i = entries.findIndex(([, w]) => (r -= w) < 0);
    chosen.push(entries.splice(i < 0 ? 0 : i, 1)[0][0]);
  }
  const all = [truth, ...chosen];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

export default function BlindGate({
  gateKey,
  truth,
  pool,
  chartId,
  researchConsent,
  children,
}: {
  gateKey: string;
  truth: string;
  pool: Record<string, number>;
  chartId?: string;
  researchConsent?: boolean;
  children: React.ReactNode;
}) {
  const storeKey = `menhlab:blind:${gateKey}`;
  const [phase, setPhase] = useState<'checking' | 'test' | 'reveal' | 'done'>('checking');
  const [options, setOptions] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(3);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    let done = false;
    try {
      done = !!localStorage.getItem(storeKey);
    } catch {
      /* trình duyệt chặn lưu trữ */
    }
    if (done) setPhase('done');
    else {
      setOptions(pickDecoys(truth, pool));
      setPhase('test');
    }
  }, [storeKey, truth, pool]);

  const finish = () => {
    try {
      localStorage.setItem(storeKey, '1');
    } catch {
      /* bỏ qua */
    }
    setPhase('done');
    window.scrollTo({ top: 0 });
  };

  async function submit() {
    if (!picked) return;
    setPhase('reveal');
    const send = chartId ? researchConsent : consent;
    if (send) {
      await fetch('/api/lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chartId: researchConsent ? chartId : undefined, options, picked, truth: chartId ? undefined : truth, confidence, consent }),
      }).catch(() => undefined);
    }
  }

  if (phase === 'done') return <>{children}</>;
  if (phase === 'checking') return <div className="wrap" style={{ minHeight: '60vh' }} />;

  const letter = (k: string) => String.fromCharCode(65 + options.indexOf(k));

  return (
    <div className="wrap narrow" style={{ padding: '32px 16px' }}>
      <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)' }}>Một thí nghiệm nhỏ trước khi xem lá số</h1>
      {phase === 'test' && (
        <>
          <p className="hero-lede">
            Dưới đây là {N_OPTIONS} đoạn mô tả tính cách. <b>Một đoạn</b> được viết từ cung Mệnh trên lá số của bạn, ba đoạn còn lại từ lá số
            của người khác. Tên sao đã được ẩn. Bạn thấy đoạn nào giống mình nhất?
          </p>
          <p className="small muted">
            Nếu chỉ đoán mò, khả năng chọn đúng là 25%. Khi hàng nghìn người cùng làm, tỷ lệ chọn đúng sẽ cho biết mô tả từ lá số có thực sự
            "trúng" hơn ngẫu nhiên hay không. Kết quả tổng hợp được công bố ở trang <a href="/nghien-cuu">Nghiên cứu</a>.
          </p>
          <div role="radiogroup" aria-label="Chọn mô tả giống bạn nhất" style={{ display: 'grid', gap: 12, margin: '20px 0' }}>
            {options.map((k, i) => (
              <label key={k} className="panel" style={{ display: 'flex', gap: 12, cursor: 'pointer', borderColor: picked === k ? 'var(--tu)' : undefined, borderWidth: picked === k ? 2 : 1 }}>
                <input type="radio" name="blind" checked={picked === k} onChange={() => setPicked(k)} style={{ marginTop: 6, accentColor: 'var(--tu)' }} />
                <span>
                  <b>Mô tả {String.fromCharCode(65 + i)}</b>
                  <span className="prose" style={{ display: 'block', marginTop: 4 }}>
                    {blindMenhText(k)}
                  </span>
                </span>
              </label>
            ))}
          </div>
          <div className="field">
            <label htmlFor="conf">Bạn chắc chắn đến đâu?</label>
            <select id="conf" value={confidence} onChange={(e) => setConfidence(+e.target.value)} style={{ maxWidth: 320 }}>
              <option value={1}>Gần như đoán mò</option>
              <option value={2}>Hơi nghiêng về đoạn này</option>
              <option value={3}>Khá chắc</option>
              <option value={4}>Chắc</option>
              <option value={5}>Rất chắc</option>
            </select>
          </div>
          {chartId && researchConsent ? (
            <p className="small muted">Kết quả (chỉ đúng hoặc sai) được ghi nhận ẩn danh theo sự đồng ý nghiên cứu bạn đã chọn khi lưu lá số.</p>
          ) : (
            <label className="check">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              <span>Gửi kết quả ẩn danh (chỉ ghi đúng hay sai, không kèm ngày giờ sinh, tên hay email) cho thống kê công khai.</span>
            </label>
          )}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
            <button type="button" className="btn" disabled={!picked} onClick={submit}>
              Xem đáp án
            </button>
            <button type="button" className="btn ghost" onClick={finish}>
              Bỏ qua, xem lá số ngay
            </button>
          </div>
        </>
      )}
      {phase === 'reveal' && picked && (
        <>
          <p className={picked === truth ? 'note' : 'alert'} style={{ fontSize: '1.05rem' }}>
            Đoạn viết từ lá số của bạn là <b>Mô tả {letter(truth)}</b>. Bạn đã chọn <b>Mô tả {letter(picked)}</b> —{' '}
            {picked === truth ? 'trùng khớp.' : 'không trùng.'}
          </p>
          <div className="prose">
            <p>
              Một lần đúng hay sai chưa nói lên điều gì: đoán mò cũng đúng 1 trên 4 lần. Ý nghĩa nằm ở con số của hàng nghìn người. Nếu tỷ lệ
              chọn đúng chỉ quanh 25%, các mô tả từ lá số chủ yếu là kiểu "ai đọc cũng thấy đúng" (<button type="button" className="term" data-term="Hiệu ứng Barnum">hiệu ứng Barnum</button>). Nếu cao hơn rõ rệt, đó là tín hiệu đáng nghiên cứu tiếp.
            </p>
            <p>
              Khi đọc lá số bên dưới, hãy nhớ trải nghiệm này: cảm giác "đúng quá" không phải lúc nào cũng là bằng chứng.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button type="button" className="btn" onClick={finish}>
              Xem lá số của tôi
            </button>
            <a className="btn ghost" href="/nghien-cuu">
              Xem kết quả tổng hợp
            </a>
          </div>
        </>
      )}
    </div>
  );
}
