'use client';

/**
 * Lớp giải thích thuật ngữ dùng chung cho toàn trang.
 * Bất kỳ phần tử nào có thuộc tính data-term="Tên thuật ngữ" đều bấm được để xem giải thích.
 * Nhờ vậy cả nội dung render phía server cũng có tooltip mà không cần thêm JavaScript riêng.
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { lookup } from '@/content/glossary';

interface Pop {
  name: string;
  title: string;
  text: string;
  key?: string;
  x: number;
  y: number;
}

export default function TermLayer() {
  const [pop, setPop] = useState<Pop | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (ref.current?.contains(target)) return;
      const el = target.closest<HTMLElement>('[data-term]');
      if (!el) {
        setPop(null);
        return;
      }
      e.stopPropagation();
      const name = el.dataset.term!;
      const t = lookup(name);
      const extra = el.dataset.termExtra;
      const r = el.getBoundingClientRect();
      opener.current = el;
      setPop({
        name,
        title: t?.term ?? name,
        text: [t?.short ?? 'Chưa có giải thích cho thuật ngữ này.', extra].filter(Boolean).join(' '),
        key: t?.key,
        x: Math.min(Math.max(8, r.left), window.innerWidth - 336),
        y: r.bottom + 8 + 180 > window.innerHeight ? Math.max(8, r.top - 8 - 170) : r.bottom + 8,
      });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPop(null);
        opener.current?.focus();
      }
    };
    const onScroll = () => setPop(null);
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  if (!pop) return null;
  return (
    <div ref={ref} className="term-pop" role="dialog" aria-live="polite" aria-label={pop.title} style={{ left: pop.x, top: pop.y }}>
      <b>{pop.title}</b>
      {pop.text}
      {pop.key && (
        <div style={{ marginTop: 6 }}>
          <Link href={`/tu-dien#${pop.key}`} onClick={() => setPop(null)}>
            Đọc thêm trong Từ điển
          </Link>
        </div>
      )}
    </div>
  );
}

/** Thuật ngữ trong đoạn văn: <T>Tuần</T> hoặc <T name="Cung Thân">Thân</T>. */
export function T({ children, name }: { children: React.ReactNode; name?: string }) {
  return (
    <button type="button" className="term" data-term={name ?? String(children)}>
      {children}
    </button>
  );
}
