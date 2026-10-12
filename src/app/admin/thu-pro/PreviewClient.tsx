'use client';

import { useState } from 'react';
import BirthForm from '@/components/BirthForm';
import ChartReport from '@/components/ChartReport';
import type { BirthInput, Conventions } from '@/lib/engine/birth';
import type { computeReport } from '@/lib/report';
import BookView from '@/components/BookView';
import { bookHeader } from '@/lib/bookHeader';

type Report = ReturnType<typeof computeReport>;

async function post<T>(body: unknown): Promise<T> {
  const res = await fetch('/api/admin/preview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Có lỗi xảy ra.');
  return data as T;
}

export default function PreviewClient() {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');
  const [book, setBook] = useState(false);

  async function load(input: BirthInput, conventions: Conventions) {
    setError('');
    try {
      const r = await post<Report>({ input, conventions });
      setReport(r);
      setBook(false);
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi');
    }
  }

  if (!report) {
    return (
      <div className="wrap narrow" style={{ padding: '32px 16px' }}>
        <h1>Xem thử bản Pro</h1>
        <p className="hero-lede">
          Nhập ngày giờ sinh bất kỳ (nên điền cả tên để thấy cách xưng hô) để xem đúng giao diện và nội dung khách hàng nhận được sau khi mua Pro.
          Không lưu gì, không gửi email, không tạo đơn hàng.
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
          <button type="button" className="btn" onClick={() => setBook((b) => !b)}>
            {book ? 'Xem trang lá số' : 'Xem bản luận giải trọn đời'}
          </button>
          <button type="button" className="btn ghost" onClick={() => setReport(null)}>
            Thử lá số khác
          </button>
        </p>
      </div>
      {book && report.book ? (
        <div className="wrap narrow-report">
          <BookView book={report.book} {...bookHeader(report.chart, report.book)} />
        </div>
      ) : (
        <ChartReport
          chart={report.chart}
          reading={report.reading}
          sensitivity={report.sensitivity}
          patterns={report.patterns}
          derivation={report.derivation}
          menhKey={report.menhKey}
          life={report.life}
          isPro
          adminPreview
        />
      )}
    </>
  );
}
