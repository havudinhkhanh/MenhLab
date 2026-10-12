/**
 * Tỷ lệ nền cho phần "Điều đặc biệt trong lá số" và phân vị (percentile) mức hỗ trợ của từng cung.
 * Cùng phương pháp mô phỏng với compute-base-rates.ts (ngày 1950–2009, canh giờ đều, nam/nữ 50/50).
 *
 * Chạy: npx tsx scripts/compute-profile-rates.ts 24000  → ghi src/data/rates-profile.json
 */
import { writeFileSync } from 'node:fs';
import { buildChart } from '../src/lib/engine/chart';
import { readPalace } from '../src/lib/reading';
import { jdFromDate, jdToDate } from '../src/lib/engine/lunar';

const N = Number(process.argv[2] || 24000);
let seed = 77003;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const jd0 = jdFromDate(1, 1, 1950);
const jd1 = jdFromDate(31, 12, 2009);
const inc = (o: Record<string, number>, k: string) => (o[k] = (o[k] ?? 0) + 1);

/** Hiệu số hỗ trợ − gây khó của từng cung, làm tròn 0,5 → đếm. */
const net: Record<string, Record<string, number>> = {};
/** Số đặc điểm của cung Mệnh. */
const feat: Record<string, number> = {};

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
  for (const p of c.palaces) {
    const r = readPalace(c, p.branch);
    inc((net[p.name] ??= {}), String(Math.round((r.support - r.challenge) * 2) / 2));
  }
  const menh = c.palaces[c.menhBranch];
  const all = [...menh.majors, ...menh.goodStars, ...menh.badStars, ...menh.others];
  for (const h of ['Lộc', 'Quyền', 'Khoa', 'Kỵ'] as const) if (all.some((s) => s.name === c.hoa[h])) inc(feat, `menhHoa:${h}`);
  if (menh.tuan) inc(feat, 'menhTuan');
  if (menh.triet) inc(feat, 'menhTriet');
  if (all.some((s) => s.name === 'Lộc Tồn')) inc(feat, 'menhLocTon');
  if (menh.majors.some((s) => (s.brightness?.score ?? 0) >= 3)) inc(feat, 'menhMieu');
  if (menh.majors.some((s) => (s.brightness?.score ?? 0) <= -2)) inc(feat, 'menhHam');
  const sat = menh.badStars.length;
  inc(feat, `menhSat:${Math.min(sat, 3)}`);
  const cat = menh.goodStars.length;
  inc(feat, `menhCat:${Math.min(cat, 4)}`);
  if (c.thanBranch === c.menhBranch) inc(feat, 'thanMenh');
  if (i % 2000 === 1999) console.error(`${i + 1}/${N} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
writeFileSync('src/data/rates-profile.json', JSON.stringify({ n: N, net, feat }, null, 0));
console.error(`Xong ${N} lá số trong ${((Date.now() - t0) / 1000).toFixed(0)} giây`);
