'use client';

/**
 * Xem nhanh không lưu: dữ liệu sinh nằm trong sessionStorage của trình duyệt,
 * lá số được tính ngay trên máy người dùng. Không có request nào chứa dữ liệu sinh.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ChartReport from '@/components/ChartReport';
import { computeReport } from '@/lib/report';
import { DRAFT_KEY } from '@/components/BirthForm';
import type { BirthInput, Conventions } from '@/lib/engine/birth';

type State =
  | { kind: 'loading' }
  | { kind: 'empty' }
  | { kind: 'error'; msg: string }
  | { kind: 'ok'; draft: { input: BirthInput; conventions: Conventions; source?: string }; data: ReturnType<typeof computeReport> };

export default function QuickView() {
  const [s, setS] = useState<State>({ kind: 'loading' });

  useEffect(() => {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return setS({ kind: 'empty' });
    try {
      const draft = JSON.parse(raw) as { input: BirthInput; conventions: Conventions; source?: string };
      setS({ kind: 'ok', draft, data: computeReport(draft.input, draft.conventions, false) });
    } catch (e) {
      setS({ kind: 'error', msg: e instanceof Error ? e.message : 'Không lập được lá số.' });
    }
  }, []);

  if (s.kind === 'loading')
    return (
      <div className="wrap" style={{ padding: '48px 16px' }}>
        <p className="muted">Đang an sao…</p>
      </div>
    );
  if (s.kind !== 'ok')
    return (
      <div className="wrap narrow" style={{ padding: '48px 16px' }}>
        <h1>Chưa có lá số</h1>
        <p>{s.kind === 'error' ? s.msg : 'Phiên xem nhanh đã kết thúc hoặc bạn chưa nhập thông tin sinh.'}</p>
        <Link className="btn" href="/#lap-la-so">
          Nhập thông tin sinh
        </Link>
      </div>
    );

  const { chart, reading, life, sensitivity, patterns, derivation, menhKey } = s.data;
  const gateKey = JSON.stringify(s.draft.input)
    .split('')
    .reduce((h, ch) => (Math.imul(h, 31) + ch.charCodeAt(0)) | 0, 7)
    .toString(36);
  return (
    <ChartReport
      chart={chart}
      reading={reading}
      sensitivity={sensitivity}
      patterns={patterns}
      derivation={derivation}
      menhKey={menhKey}
      life={life}
      blindGate={s.draft.source === 'rectify' ? undefined : { gateKey }}
      isPro={false}
      draft={s.draft}
    />
  );
}
