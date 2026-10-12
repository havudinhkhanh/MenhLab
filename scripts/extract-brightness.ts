/** Trích bảng độ sáng Toàn Thư (từ iztro) của 14 chính tinh theo 12 Địa Chi → src/data/brightness-toan-thu.json */
import { writeFileSync } from 'node:fs';
import { buildChart } from '../src/lib/engine/chart';
import { MAJOR_STARS } from '../src/lib/engine/names';

const table: Record<string, (string | null)[]> = Object.fromEntries(MAJOR_STARS.map((s) => [s, Array(12).fill(null)]));
outer: for (let y = 1950; y < 2010; y++) {
  for (const m of [1, 3, 5, 7, 9, 11]) {
    for (const b of [0, 2, 4, 6, 8, 10]) {
      const c = buildChart({ gender: 'nam', calendar: 'am', year: y, month: m, day: (y % 29) + 1, timeType: 'branch', branch: b, certainty: 'chinh-xac', place: 'HN' }, { timeMode: 'chuan', dayChange: '23h', leapRule: 'tach-15', brightness: 'toan-thu' });
      for (const p of c.palaces) for (const s of p.majors) table[s.name][p.branch] = s.brightness?.name ?? '—';
      if (Object.values(table).every((r) => r.every((x) => x !== null))) break outer;
    }
  }
}
const missing = Object.entries(table).flatMap(([s, r]) => r.map((x, i) => (x === null ? `${s}@${i}` : null)).filter(Boolean));
if (missing.length) throw new Error('Thiếu: ' + missing.join(', '));
writeFileSync('src/data/brightness-toan-thu.json', JSON.stringify(table));
console.log('OK');
