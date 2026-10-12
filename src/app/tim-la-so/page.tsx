import type { Metadata } from 'next';
import { FindCharts } from '@/components/Actions';

export const metadata: Metadata = { title: 'Lá số của tôi' };

export default function Find() {
  return (
    <div className="wrap narrow" style={{ paddingTop: 32 }}>
      <h1>Lá số của tôi</h1>
      <p className="hero-lede" style={{ marginBottom: 24 }}>
        Mất link lá số? Nhập email đã dùng khi lưu, chúng tôi sẽ gửi lại toàn bộ link.
      </p>
      <FindCharts />
    </div>
  );
}
