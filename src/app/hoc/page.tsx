import type { Metadata } from 'next';
import Link from 'next/link';
import { LESSONS } from '@/content/lessons';

export const metadata: Metadata = {
  title: 'Học đọc lá số Tử Vi',
  description: 'Loạt bài ngắn giúp bạn tự đọc lá số Tử Vi: Can Chi, 12 cung, chính tinh, độ sáng, Tứ Hóa, vận hạn — kèm câu hỏi kiểm tra.',
};

export default function Learn() {
  const total = LESSONS.reduce((a, l) => a + l.minutes, 0);
  return (
    <div className="wrap narrow" style={{ paddingTop: 32 }}>
      <h1>Học đọc lá số</h1>
      <p className="hero-lede">
        {LESSONS.length} bài, tổng khoảng {total} phút. Đọc xong, bạn tự hiểu được mọi chữ trên lá số — và biết cách phân biệt lời luận có căn cứ
        với lời phán chung chung.
      </p>
      <p className="small muted" style={{ marginBottom: 24 }}>
        Mẹo: mở lá số của bạn, kéo xuống phần "Lá số của bạn được an thế nào" để thấy từng quy tắc áp dụng lên chính ngày giờ sinh của mình.
      </p>
      <ol className="timeline">
        {LESSONS.map((l, i) => (
          <li key={l.slug}>
            <Link href={`/hoc/${l.slug}`}>
              <b>
                Bài {i + 1}. {l.title}
              </b>
            </Link>
            <p style={{ margin: '4px 0' }}>{l.summary}</p>
            <span className="small muted">{l.minutes} phút · {l.quiz.length} câu hỏi</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
