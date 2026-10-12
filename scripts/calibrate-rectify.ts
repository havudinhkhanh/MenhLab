/**
 * Hiệu chuẩn công cụ chỉnh giờ sinh: đo xem với dữ kiện HOÀN TOÀN NGẪU NHIÊN
 * (sự kiện bịa ra, điểm tính cách chấm bừa), khoảng cách điểm giữa ứng viên số 1 và số 2
 * lớn đến đâu. Từ đó đặt ngưỡng để công cụ hiếm khi kết luận "khá rõ" khi dữ kiện vô nghĩa.
 *
 * Chạy: npx tsx scripts/calibrate-rectify.ts  → in ra bảng ngưỡng để dán vào rectify.ts
 */
import { candidateCharts, scoreCandidates, stats, traitDescriptions, EVENT_KINDS, type EventKind, type LifeEvent } from '../src/lib/engine/rectify';
import { DEFAULT_CONVENTIONS } from '../src/lib/engine/birth';

let seed = 20261012;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const pick = <T>(a: T[]) => a[Math.floor(rand() * a.length)];
const kinds = Object.keys(EVENT_KINDS) as EventKind[];
const BIRTHS = Number(process.argv[2] || 150);
const SETS = Number(process.argv[3] || 40);
const CURRENT = 2026;

const gaps: Record<number, number[]> = {};
const t0 = Date.now();
for (let i = 0; i < BIRTHS; i++) {
  const year = 1955 + Math.floor(rand() * 48);
  const base = {
    gender: rand() < 0.5 ? 'nam' : 'nu',
    calendar: 'am',
    year,
    month: 1 + Math.floor(rand() * 12),
    day: 1 + Math.floor(rand() * 29),
    place: 'HCM',
  } as const;
  const charts = candidateCharts(base, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], DEFAULT_CONVENTIONS);
  const desc = traitDescriptions(charts);
  for (let n = 3; n <= 10; n++) {
    for (let s = 0; s < SETS; s++) {
      const events: LifeEvent[] = Array.from({ length: n }, () => ({
        kind: pick(kinds),
        year: year + 18 + Math.floor(rand() * Math.max(1, CURRENT - year - 18)),
      }));
      const ratings: Record<string, number> = {};
      for (const d of desc) ratings[d.id] = 1 + Math.floor(rand() * 5);
      const { gap } = stats(scoreCandidates(charts, events, ratings, desc));
      (gaps[n] ??= []).push(gap);
    }
  }
}

const q = (arr: number[], p: number) => {
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(p * s.length))];
};
const round = (x: number) => Math.round(x * 4) / 4;
const thresholds: Record<number, [number, number]> = {};
const quantiles: Record<number, number[]> = {};
for (let n = 3; n <= 10; n++) {
  thresholds[n] = [round(q(gaps[n], 0.8)), round(q(gaps[n], 0.95))];
  quantiles[n] = Array.from({ length: 20 }, (_, i) => Math.round(q(gaps[n], (i + 1) / 20) * 100) / 100);
}
console.error(`${BIRTHS} lá số × 8 mức số sự kiện × ${SETS} bộ dữ kiện ngẫu nhiên, ${((Date.now() - t0) / 1000).toFixed(0)} giây`);
console.log(JSON.stringify({ thresholds, quantiles }));
