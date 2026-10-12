/**
 * Độ nhạy giờ sinh: lá số thay đổi thế nào nếu giờ sinh lệch vài phút, hoặc nếu
 * dùng quy ước khác (giờ đồng hồ / giờ chuẩn / giờ Mặt Trời, đổi ngày lúc 23h
 * hay 0h, cách tính tháng nhuận). Đây là cách kiểm tra "kết luận có đứng vững
 * không" — điều mà gần như không trang lá số nào làm.
 */
import { CANH_GIO, CHI } from './canchi';
import { buildChart, type Chart } from './chart';
import { resolveBirth, type BirthInput, type Conventions } from './birth';

export interface Variant {
  label: string;
  reason: 'gio' | 'quy-uoc';
  /** Tỷ lệ khoảng thời gian rơi vào biến thể này (chỉ với lệch giờ). */
  share?: number;
  menhBranch: number;
  menhMajors: string[];
  cuc: string;
  thanPalace: string;
  diffs: string[];
}

export interface Sensitivity {
  windowMinutes: number;
  /** Tỷ lệ khoảng sai số giờ sinh cho cùng chính tinh cung Mệnh với lá số chính. */
  stability: number;
  level: 'cao' | 'trung-binh' | 'thap';
  variants: Variant[];
  summary: string;
}

const sig = (c: Chart) =>
  `${c.birth.lunar.year}-${c.birth.lunar.month}-${c.birth.lunar.day}-${c.birth.lunar.leap}-${c.birth.branch}-${c.conventions.leapRule}`;

const menhMajors = (c: Chart) => {
  const p = c.palaces[c.menhBranch];
  if (p.majors.length) return p.majors.map((s) => s.name);
  return [`Vô chính diệu (mượn ${c.palaces[(c.menhBranch + 6) % 12].majors.map((s) => s.name).join(', ') || '—'})`];
};

function compare(base: Chart, other: Chart): string[] {
  const d: string[] = [];
  if (base.menhBranch !== other.menhBranch) {
    d.push(`Cung Mệnh dời từ ${CHI[base.menhBranch]} sang ${CHI[other.menhBranch]}`);
  }
  const a = menhMajors(base).join(', ');
  const b = menhMajors(other).join(', ');
  if (a !== b) d.push(`Chính tinh thủ Mệnh: ${a} → ${b}`);
  if (base.cuc.name !== other.cuc.name) d.push(`Cục: ${base.cuc.name} → ${other.cuc.name}`);
  const bt = base.palaces[base.thanBranch].name;
  const ot = other.palaces[other.thanBranch].name;
  if (bt !== ot) d.push(`Thân cư ${bt} → Thân cư ${ot}`);
  let moved = 0;
  for (let i = 0; i < 12; i++) {
    const x = base.palaces[i].majors.map((s) => s.name).join();
    const y = other.palaces[i].majors.map((s) => s.name).join();
    if (x !== y) moved++;
  }
  if (moved && base.menhBranch === other.menhBranch) d.push(`${moved}/12 cung đổi chính tinh`);
  if (!d.length) d.push('Các yếu tố chính không đổi (chỉ khác một số phụ tinh)');
  return d;
}

const toVariant = (c: Chart, base: Chart, label: string, reason: Variant['reason'], share?: number): Variant => ({
  label,
  reason,
  share,
  menhBranch: c.menhBranch,
  menhMajors: menhMajors(c),
  cuc: c.cuc.name,
  thanPalace: c.palaces[c.thanBranch].name,
  diffs: compare(base, c),
});

export function analyzeSensitivity(input: BirthInput, conv: Conventions, base: Chart): Sensitivity {
  const variants: Variant[] = [];
  const seen = new Map<string, Chart>([[sig(base), base]]);
  const chartFor = (inp: BirthInput, cv: Conventions) => {
    const r = resolveBirth(inp, cv);
    const key = `${r.lunar.year}-${r.lunar.month}-${r.lunar.day}-${r.lunar.leap}-${r.branch}-${cv.leapRule}`;
    if (!seen.has(key)) seen.set(key, buildChart(inp, cv));
    return seen.get(key)!;
  };

  // 1. Khoảng sai số giờ sinh
  let window = 0;
  let sameShare = 1;
  if (input.timeType === 'clock') {
    window = { 'chinh-xac': 15, 'khoang-30': 30, 'khoang-120': 120, 'khong-ro': 720 }[input.certainty];
    const step = window > 60 ? 10 : 5;
    const counts = new Map<string, { chart: Chart; n: number; from: number; to: number }>();
    let total = 0;
    const center = (input.hour ?? 0) * 60 + (input.minute ?? 0);
    for (let off = -window; off <= window; off += step) {
      let t = center + off;
      let dayShift = 0;
      while (t < 0) {
        t += 1440;
        dayShift--;
      }
      while (t >= 1440) {
        t -= 1440;
        dayShift++;
      }
      let inp: BirthInput = { ...input, hour: Math.floor(t / 60), minute: t % 60 };
      if (dayShift !== 0) inp = { ...inp, ...shiftDate(input, dayShift) };
      const c = chartFor(inp, conv);
      const k = sig(c);
      const e = counts.get(k) ?? { chart: c, n: 0, from: off, to: off };
      e.n++;
      e.to = off;
      counts.set(k, e);
      total++;
    }
    for (const [k, e] of counts) {
      if (k === sig(base)) {
        sameShare = e.n / total;
        continue;
      }
      const dir = e.from < 0 ? `sớm hơn từ ${Math.abs(e.to)} phút trở lên` : `muộn hơn từ ${e.from} phút trở lên`;
      variants.push(
        toVariant(e.chart, base, `Nếu sinh ${dir} (giờ ${CANH_GIO[e.chart.birth.branch].name})`, 'gio', e.n / total),
      );
    }
  } else if (input.timeType === 'branch' || input.timeType === 'unknown') {
    const b = input.branch ?? 0;
    const range =
      input.timeType === 'unknown' || input.certainty === 'khong-ro'
        ? Array.from({ length: 12 }, (_, i) => i)
        : input.certainty === 'chinh-xac'
          ? [b]
          : [(b + 11) % 12, b, (b + 1) % 12];
    window = (range.length * 120) / 2;
    let same = 0;
    for (const br of range) {
      const c = chartFor({ ...input, timeType: 'branch', branch: br }, conv);
      if (menhMajors(c).join() === menhMajors(base).join() && c.menhBranch === base.menhBranch) same++;
      if (br !== b || input.timeType === 'unknown') {
        if (sig(c) !== sig(base)) {
          variants.push(toVariant(c, base, `Nếu sinh giờ ${CANH_GIO[br].name} (${CANH_GIO[br].range})`, 'gio', 1 / range.length));
        }
      }
    }
    sameShare = same / range.length;
  }

  // 2. Quy ước tính
  const alts: [string, Conventions][] = [];
  if (input.timeType === 'clock') {
    if (conv.timeMode !== 'chuan') alts.push(['Theo giờ chuẩn (hiệu chỉnh múi giờ lịch sử)', { ...conv, timeMode: 'chuan' }]);
    if (conv.timeMode !== 'dong-ho') alts.push(['Theo nguyên giờ đồng hồ (không hiệu chỉnh)', { ...conv, timeMode: 'dong-ho' }]);
    if (conv.timeMode !== 'mat-troi') alts.push(['Theo giờ Mặt Trời thực tại nơi sinh', { ...conv, timeMode: 'mat-troi' }]);
    alts.push([
      conv.dayChange === '23h' ? 'Đổi ngày lúc 0h (giờ Tý muộn tính ngày cũ)' : 'Đổi ngày lúc 23h (giờ Tý tính ngày mới)',
      { ...conv, dayChange: conv.dayChange === '23h' ? '0h' : '23h' },
    ]);
  }
  if (base.birth.lunar.leap) {
    alts.push([
      conv.leapRule === 'tach-15' ? 'Tháng nhuận tính trọn như tháng chính' : 'Tháng nhuận tách tại ngày 15',
      { ...conv, leapRule: conv.leapRule === 'tach-15' ? 'theo-thang' : 'tach-15' },
    ]);
  }
  for (const [label, cv] of alts) {
    const c = chartFor(input, cv);
    if (sig(c) !== sig(base)) variants.push(toVariant(c, base, label, 'quy-uoc'));
  }

  const stability = sameShare;
  const level = stability >= 0.85 ? 'cao' : stability >= 0.5 ? 'trung-binh' : 'thap';
  const convChanges = variants.filter((v) => v.reason === 'quy-uoc').length;
  const summary =
    input.timeType === 'unknown'
      ? 'Bạn chưa biết giờ sinh: 12 canh giờ cho ra 12 lá số khác nhau. Hãy coi mọi luận giải về cung Mệnh là giả thuyết.'
      : `${Math.round(stability * 100)}% khoảng sai số giờ sinh (±${window} phút) cho ra đúng lá số này.` +
        (convChanges
          ? ` Có ${convChanges} quy ước tính khác cho ra lá số khác — xem chi tiết bên dưới.`
          : ' Các quy ước tính khác nhau đều cho cùng lá số.');

  return { windowMinutes: window, stability, level, variants, summary };
}

function shiftDate(input: BirthInput, days: number): Partial<BirthInput> {
  // Chỉ áp dụng cho ngày dương lịch; với âm lịch, đổi sang dương lịch trước.
  const r = resolveBirth({ ...input, timeType: 'unknown' }, { timeMode: 'dong-ho', dayChange: '0h', leapRule: 'tach-15' });
  const dt = new Date(Date.UTC(r.solar.year, r.solar.month - 1, r.solar.day + days));
  return { calendar: 'duong', year: dt.getUTCFullYear(), month: dt.getUTCMonth() + 1, day: dt.getUTCDate(), leapMonth: false };
}
