/**
 * Tỷ lệ nền (base rates): trong dân số, bao nhiêu % người có một đặc điểm lá số nào đó.
 *
 * Phương pháp: mô phỏng N ngày giờ sinh ngẫu nhiên, mỗi ngày dương lịch từ 1950–2009 và
 * mỗi canh giờ có xác suất như nhau, nam/nữ 50/50. Giả định này bỏ qua mùa sinh và giờ sinh
 * thực tế không đều — sai lệch nhỏ so với mục đích "hiếm hay phổ biến".
 *
 * Chạy: npx tsx scripts/compute-base-rates.ts 24000  → ghi src/data/base-rates.json
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { buildChart } from '../src/lib/engine/chart';
import { detectPatterns } from '../src/lib/engine/patterns';
import { jdFromDate, jdToDate } from '../src/lib/engine/lunar';
import { MAJOR_STARS } from '../src/lib/engine/names';

const N = Number(process.argv[2] || 24000);
let seed = 19501;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const jd0 = jdFromDate(1, 1, 1950);
const jd1 = jdFromDate(31, 12, 2009);

const inc = (o: Record<string, number>, k: string) => (o[k] = (o[k] ?? 0) + 1);
const menhCombo: Record<string, number> = {};
const starPalace: Record<string, Record<string, number>> = {};
const companions: Record<string, Record<string, Record<string, number>>> = {};
const patterns: Record<string, { du: number; ganDu: number }> = {};
const thanCu: Record<string, number> = {};
const cuc: Record<string, number> = {};
const hoaKy: Record<string, number> = {};
const menhVcd = { n: 0 };

const t0 = Date.now();
for (let i = 0; i < N; i++) {
  const [d, m, y] = jdToDate(jd0 + Math.floor(rand() * (jd1 - jd0 + 1)));
  const c = buildChart({
    gender: rand() < 0.5 ? 'nam' : 'nu',
    calendar: 'duong',
    year: y,
    month: m,
    day: d,
    timeType: 'branch',
    branch: Math.floor(rand() * 12),
    certainty: 'chinh-xac',
    place: 'HCM',
  });
  const menh = c.palaces[c.menhBranch];
  if (menh.majors.length) inc(menhCombo, menh.majors.map((s) => s.name).join('+'));
  else {
    menhVcd.n++;
    inc(menhCombo, 'vcd:' + c.palaces[(c.menhBranch + 6) % 12].majors.map((s) => s.name).join('+'));
  }
  for (const p of c.palaces) {
    for (const s of p.majors) {
      ((starPalace[s.name] ??= {}), inc(starPalace[s.name], p.name));
      const comp = p.majors.filter((x) => x.name !== s.name).map((x) => x.name).join('+') || '';
      (((companions[s.name] ??= {})[p.name] ??= {}), inc(companions[s.name][p.name], comp));
    }
  }
  for (const p of detectPatterns(c)) {
    const e = (patterns[p.id] ??= { du: 0, ganDu: 0 });
    if (p.status === 'du') e.du++;
    else e.ganDu++;
  }
  inc(thanCu, c.palaces[c.thanBranch].name);
  inc(cuc, c.cuc.name);
  const ky = c.palaces.find((p) => [...p.majors, ...p.goodStars, ...p.badStars, ...p.others].some((s) => s.name === c.hoa['Kỵ']));
  if (ky) inc(hoaKy, ky.name);
  if (i % 2000 === 1999) console.error(`${i + 1}/${N} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}

for (const s of MAJOR_STARS) starPalace[s] ??= {};
mkdirSync('src/data', { recursive: true });
writeFileSync(
  'src/data/base-rates.json',
  JSON.stringify(
    {
      n: N,
      method:
        'Mô phỏng ngày giờ sinh ngẫu nhiên: mỗi ngày dương lịch 1950–2009 và mỗi canh giờ có xác suất như nhau, nam/nữ 50/50, quy ước mặc định của MệnhLab.',
      menhCombo,
      menhVcd: menhVcd.n,
      starPalace,
      companions,
      patterns,
      thanCu,
      cuc,
      hoaKy,
    },
    null,
    0,
  ),
);
console.error(`Xong ${N} lá số trong ${((Date.now() - t0) / 1000).toFixed(0)} giây`);
