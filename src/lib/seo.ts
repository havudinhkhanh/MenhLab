/** Dữ liệu cho các trang kiến thức sao × cung (dựng tĩnh lúc build). */
import { MAJOR_STARS, slug } from './engine/names';
import { PALACES } from '@/content/palaces';
import { VIET_BRIGHTNESS } from './engine/brightness';
import full from '@/data/base-rates.json';
import toanThu from '@/data/brightness-toan-thu.json';

export const PALACE_NAMES = Object.keys(PALACES);
export const starBySlug = (s: string) => MAJOR_STARS.find((x) => slug(x) === s);
export const palaceBySlug = (s: string) => PALACE_NAMES.find((x) => slug(x) === s);
export const starHref = (star: string, palace?: string) => `/sao/${slug(star)}${palace ? `/${slug(palace)}` : ''}`;

interface FullRates {
  n: number;
  starPalace: Record<string, Record<string, number>>;
  companions: Record<string, Record<string, Record<string, number>>>;
}
const R = full as unknown as FullRates;

export function starPalaceRate(star: string, palace: string): number | undefined {
  if (!R.n) return undefined;
  return (R.starPalace[star]?.[palace] ?? 0) / R.n;
}

/** Khi sao ở cung này, nó đi một mình hay cùng sao nào (tỷ lệ có điều kiện). */
export function companions(star: string, palace: string): { with: string[]; share: number }[] {
  const m = R.companions[star]?.[palace];
  if (!m) return [];
  const total = Object.values(m).reduce((a, b) => a + b, 0);
  return Object.entries(m)
    .map(([k, v]) => ({ with: k ? k.split('+') : [], share: v / total }))
    .sort((a, b) => b.share - a.share);
}

export function brightnessRows(star: string) {
  const vn = VIET_BRIGHTNESS[star];
  const tt = (toanThu as Record<string, string[]>)[star];
  const MAP: Record<string, string> = { M: 'Miếu', V: 'Vượng', Đ: 'Đắc', B: 'Bình', H: 'Hãm' };
  return Array.from({ length: 12 }, (_, i) => ({
    branch: i,
    viet: vn ? (vn[i] ? MAP[vn[i] as string] : '—') : 'không ghi trong sách Việt',
    toanThu: tt?.[i] ?? '—',
  }));
}

export const RATES_N = R.n;
