'use client';

import { useState } from 'react';

/** "Nhận định này đúng với bạn đến đâu?" — dữ liệu để đo độ chính xác thực tế (chỉ khi người dùng đồng ý). */
export default function Rating({ chartId, section }: { chartId: string; section: string }) {
  const [sent, setSent] = useState<Record<string, number>>({});
  const current = sent[section] ?? null;

  async function rate(n: number) {
    setSent((s) => ({ ...s, [section]: n }));
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chartId, section, score: n }),
    }).catch(() => undefined);
  }

  const labels = ['Sai hẳn', 'Khá sai', 'Nửa đúng', 'Khá đúng', 'Rất đúng'];
  return (
    <div className="rate">
      <span>Mô tả này đúng với bạn đến đâu?</span>
      {labels.map((l, i) => (
        <button key={l} type="button" aria-pressed={current === i + 1} onClick={() => rate(i + 1)}>
          {l}
        </button>
      ))}
    </div>
  );
}
