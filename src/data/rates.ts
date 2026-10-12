/**
 * Tỷ lệ nền (bản gọn, dùng được cả trong trình duyệt). Sinh bởi scripts/compute-base-rates.ts.
 * Bản đầy đủ (sao × cung, sao đồng cung) ở base-rates.json, chỉ dùng phía server cho các trang sao × cung.
 */
import lite from './rates-lite.json';

export interface RatesLite {
  n: number;
  method: string;
  menhCombo: Record<string, number>;
  menhVcd: number;
  patterns: Record<string, { du: number; ganDu: number }>;
  thanCu: Record<string, number>;
  hoaKy: Record<string, number>;
  cuc: Record<string, number>;
}

export const RATES = lite as RatesLite;

/** Tỷ lệ (0..1); undefined khi chưa có dữ liệu mô phỏng. */
export function rate(count: number | undefined): number | undefined {
  if (!RATES.n || count === undefined) return undefined;
  return count / RATES.n;
}

export function fmtPct(p: number | undefined): string {
  if (p === undefined) return '—';
  if (p < 0.001) return 'dưới 0,1%';
  return `${(p * 100).toLocaleString('vi-VN', { maximumFractionDigits: p < 0.1 ? 1 : 0 })}%`;
}

/** "khoảng 1 trong 12 người" */
export function oneIn(p: number | undefined): string {
  if (!p) return '';
  const n = Math.round(1 / p);
  return n <= 1 ? 'gần như ai cũng có' : `khoảng 1 trong ${n.toLocaleString('vi-VN')} người`;
}
