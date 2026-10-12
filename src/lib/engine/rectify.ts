/**
 * Chỉnh giờ sinh theo sự kiện đời (rectification) cho người không biết hoặc không chắc giờ sinh.
 *
 * Cách làm minh bạch:
 * 1. Lập lá số cho từng canh giờ ứng viên.
 * 2. Mỗi sự kiện có năm (kết hôn, sinh con, đổi việc...) được chấm theo quy tắc cổ điển:
 *    năm đó tiểu hạn, lưu Thái Tuế, đại vận, lưu Tứ Hóa có "kích hoạt" cung liên quan không.
 * 3. Người dùng chấm các mô tả tính cách cung Mệnh được trình bày "mù" (ẩn tên sao, xáo thứ tự).
 * 4. Kết luận chỉ được đưa ra khi điểm của ứng viên đầu bảng vượt xa mức mà dữ kiện NGẪU NHIÊN
 *    cũng có thể tạo ra (ngưỡng hiệu chuẩn bằng mô phỏng, xem scripts/calibrate-rectify.ts).
 *
 * Kết quả là "giả thuyết phù hợp nhất với dữ kiện theo quy tắc cổ điển", không phải bằng chứng về giờ sinh thật.
 */
import { CANH_GIO } from './canchi';
import { buildChart, yearlyLuck, type Chart, type Palace } from './chart';
import type { BirthInput, Conventions } from './birth';
import { HOA_ORDER, TU_HOA } from './names';
import { MAJOR } from '@/content/stars';

export type EventKind =
  | 'ket-hon'
  | 'chia-tay'
  | 'con-dau'
  | 'cong-viec'
  | 'nha-cua'
  | 'di-xa'
  | 'tai-chinh'
  | 'cha-me'
  | 'anh-chi-em';

export const EVENT_KINDS: Record<EventKind, { label: string; palace: string }> = {
  'ket-hon': { label: 'Kết hôn hoặc bắt đầu chung sống', palace: 'Phu Thê' },
  'chia-tay': { label: 'Kết thúc một mối quan hệ lớn', palace: 'Phu Thê' },
  'con-dau': { label: 'Sinh con (mỗi con một dòng)', palace: 'Tử Tức' },
  'cong-viec': { label: 'Bước ngoặt sự nghiệp: đổi nghề, thăng chức lớn, khởi nghiệp, mất việc', palace: 'Quan Lộc' },
  'nha-cua': { label: 'Mua nhà hoặc chuyển nhà lớn', palace: 'Điền Trạch' },
  'di-xa': { label: 'Đi xa dài hạn: du học, định cư, chuyển thành phố', palace: 'Thiên Di' },
  'tai-chinh': { label: 'Biến động tiền bạc lớn (được hoặc mất)', palace: 'Tài Bạch' },
  'cha-me': { label: 'Biến cố lớn của cha hoặc mẹ', palace: 'Phụ Mẫu' },
  'anh-chi-em': { label: 'Biến cố lớn của anh chị em', palace: 'Huynh Đệ' },
};

export interface LifeEvent {
  kind: EventKind;
  year: number;
}

export interface TraitDescription {
  id: string;
  letter: string;
  text: string;
  branches: number[];
}

export interface CandidateResult {
  branch: number;
  label: string;
  menhMajors: string[];
  cuc: string;
  eventScore: number;
  traitScore: number;
  total: number;
  details: { event: LifeEvent; points: number; reasons: string[] }[];
}

export type Verdict = 'kha-ro' | 'nghieng' | 'chua-du';

export interface RectifyResult {
  candidates: CandidateResult[];
  verdict: Verdict;
  z: number;
  gap: number;
  /** Tỷ lệ dữ kiện ngẫu nhiên vẫn cho kết luận mạnh bằng hoặc hơn (ước tính từ mô phỏng). */
  noiseRate: number;
  warnings: string[];
}

type BaseInput = Omit<BirthInput, 'timeType' | 'hour' | 'minute' | 'branch' | 'certainty'>;

export function candidateCharts(base: BaseInput, branches: number[], conv: Conventions): Map<number, Chart> {
  const out = new Map<number, Chart>();
  for (const b of branches) {
    out.set(b, buildChart({ ...base, timeType: 'branch', branch: b, certainty: 'khong-ro' } as BirthInput, conv));
  }
  return out;
}

const menhStars = (c: Chart) => {
  const p = c.palaces[c.menhBranch];
  return p.majors.length ? { stars: p.majors.map((s) => s.name), borrowed: false } : { stars: c.palaces[(c.menhBranch + 6) % 12].majors.map((s) => s.name), borrowed: true };
};

/** Hàm băm nhỏ để xáo thứ tự mô tả ổn định nhưng không theo thứ tự canh giờ. */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Mô tả tính cách cung Mệnh của các ứng viên, ẩn tên sao, gộp các canh giờ có cùng chính tinh thủ Mệnh. */
export function traitDescriptions(charts: Map<number, Chart>): TraitDescription[] {
  const groups = new Map<string, { stars: string[]; borrowed: boolean; branches: number[] }>();
  for (const [b, c] of charts) {
    const m = menhStars(c);
    const id = (m.borrowed ? 'vcd:' : '') + m.stars.join('+');
    const g = groups.get(id) ?? { ...m, branches: [] };
    g.branches.push(b);
    groups.set(id, g);
  }
  const list = [...groups].sort((a, b) => hash(a[0]) - hash(b[0]));
  return list.map(([id, g], i) => {
    const parts: string[] = [];
    if (g.borrowed) parts.push('Tính cách khá linh hoạt, dễ thay đổi theo môi trường và những người xung quanh.');
    for (const s of g.stars) {
      const info = MAJOR[s];
      if (!info) continue;
      parts.push(info.domains.menh ?? info.short);
      parts.push(`Điểm mạnh: ${info.strengths.join('; ').toLowerCase()}. Điểm hay vấp: ${info.watch.join('; ').toLowerCase()}.`);
    }
    return { id, letter: String.fromCharCode(65 + i), text: parts.join(' '), branches: g.branches };
  });
}

function palaceAt(c: Chart, branch: number): Palace {
  return c.palaces[((branch % 12) + 12) % 12];
}

function whereStar(c: Chart, name: string): Palace | undefined {
  return c.palaces.find((p) => [...p.majors, ...p.goodStars, ...p.badStars, ...p.others].some((s) => s.name === name));
}

/** Điểm của một sự kiện trên một lá số ứng viên, kèm lý do. */
export function scoreEvent(c: Chart, e: LifeEvent): { points: number; reasons: string[] } {
  const target = EVENT_KINDS[e.kind].palace;
  const luck = yearlyLuck(c, e.year);
  const reasons: string[] = [];
  let points = 0;
  if (luck.age < 1) return { points: 0, reasons: ['Năm này trước năm sinh — bỏ qua.'] };

  const th = palaceAt(c, luck.tieuHan);
  if (th.name === target) {
    points += 2;
    reasons.push(`Tiểu hạn năm ${e.year} ở cung ${target} (+2)`);
  } else if (palaceAt(c, luck.tieuHan + 6).name === target) {
    points += 0.5;
    reasons.push(`Tiểu hạn xung chiếu cung ${target} (+0,5)`);
  }
  const tt = palaceAt(c, luck.thaiTueBranch);
  if (tt.name === target) {
    points += 2;
    reasons.push(`Lưu Thái Tuế năm ${luck.canChi} ở cung ${target} (+2)`);
  } else if (palaceAt(c, luck.thaiTueBranch + 6).name === target) {
    points += 0.5;
    reasons.push(`Lưu Thái Tuế xung chiếu cung ${target} (+0,5)`);
  }
  if (luck.daiVan?.name === target) {
    points += 1.5;
    reasons.push(`Năm đó nằm trong đại vận cung ${target} (+1,5)`);
  }
  for (const h of HOA_ORDER) {
    const star = luck.hoa[h];
    if (whereStar(c, star)?.name === target) {
      const w = h === 'Lộc' || h === 'Kỵ' ? 1 : 0.5;
      points += w;
      reasons.push(`Lưu Hóa ${h} (${star}) rơi vào cung ${target} (+${String(w).replace('.', ',')})`);
    }
  }
  if (luck.daiVan) {
    const stems = TU_HOA[luck.daiVan.stem];
    for (const [i, h] of HOA_ORDER.entries()) {
      if (h !== 'Lộc' && h !== 'Kỵ') continue;
      if (whereStar(c, stems[i])?.name === target) {
        points += 0.5;
        reasons.push(`Hóa ${h} của đại vận (${stems[i]}) rơi vào cung ${target} (+0,5)`);
      }
    }
  }
  if (!reasons.length) reasons.push(`Năm đó không có yếu tố nào kích hoạt cung ${target}.`);
  return { points, reasons };
}

const TRAIT_WEIGHT = 1.5;

export function scoreCandidates(
  charts: Map<number, Chart>,
  events: LifeEvent[],
  ratings: Record<string, number>,
  descriptions: TraitDescription[],
): CandidateResult[] {
  const descOf = new Map<number, TraitDescription>();
  for (const d of descriptions) for (const b of d.branches) descOf.set(b, d);
  const out: CandidateResult[] = [];
  for (const [b, c] of charts) {
    const details = events.map((e) => ({ event: e, ...scoreEvent(c, e) }));
    const eventScore = details.reduce((a, d) => a + d.points, 0);
    const r = ratings[descOf.get(b)?.id ?? ''];
    const traitScore = r ? (r - 3) * TRAIT_WEIGHT : 0;
    out.push({
      branch: b,
      label: `Giờ ${CANH_GIO[b].name} (${CANH_GIO[b].range})`,
      menhMajors: menhStars(c).borrowed ? menhStars(c).stars.map((x) => `${x} (mượn)`) : menhStars(c).stars,
      cuc: c.cuc.name,
      eventScore,
      traitScore,
      total: eventScore + traitScore,
      details,
    });
  }
  return out.sort((a, b) => b.total - a.total || a.branch - b.branch);
}

export function stats(results: CandidateResult[]) {
  const t = results.map((r) => r.total);
  const mean = t.reduce((a, b) => a + b, 0) / t.length;
  const sd = Math.sqrt(t.reduce((a, b) => a + (b - mean) ** 2, 0) / t.length) || 1;
  const gap = t.length > 1 ? t[0] - t[1] : 0;
  return { z: (t[0] - mean) / sd, gap, mean, sd };
}

/**
 * Ngưỡng hiệu chuẩn bằng mô phỏng (scripts/calibrate-rectify.ts): với sự kiện và điểm tính cách
 * hoàn toàn ngẫu nhiên, "khá rõ" xảy ra khoảng 5% số lần, "nghiêng về" khoảng 20%.
 * Khóa = số sự kiện (giới hạn 3..10). Giá trị = [ngưỡng gap cho 'nghiêng', ngưỡng gap cho 'kha-ro'].
 */
export const GAP_THRESHOLDS: Record<number, [number, number]> = {3: [2.5, 4], 4: [2.5, 4], 5: [2.5, 4.5], 6: [3, 4.5], 7: [3, 5], 8: [3, 5], 9: [3, 5.5], 10: [3.5, 5.5]};

/** Phân vị 5%, 10%, ..., 100% của gap khi dữ kiện ngẫu nhiên (từ cùng mô phỏng), dùng ước tính noiseRate. */
export const NOISE_GAP_QUANTILES: Record<number, number[]> = {3: [0, 0, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 1, 1, 1, 1.5, 1.5, 2, 2, 2.5, 2.5, 3, 4, 9], 4: [0, 0, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 1, 1, 1.5, 1.5, 1.5, 2, 2, 2.5, 3, 3.5, 4, 10], 5: [0, 0, 0.5, 0.5, 0.5, 0.5, 1, 1, 1, 1, 1.5, 1.5, 2, 2, 2.5, 2.5, 3, 3.5, 4.5, 12.5], 6: [0, 0, 0.5, 0.5, 0.5, 0.5, 1, 1, 1, 1.5, 1.5, 1.5, 2, 2, 2.5, 3, 3, 4, 4.5, 11], 7: [0, 0, 0.5, 0.5, 0.5, 1, 1, 1, 1, 1.5, 1.5, 2, 2, 2.5, 2.5, 3, 3.5, 4, 5, 11], 8: [0, 0, 0.5, 0.5, 0.5, 1, 1, 1, 1, 1.5, 1.5, 2, 2, 2.5, 2.5, 3, 3.5, 4, 5, 12.5], 9: [0, 0, 0.5, 0.5, 0.5, 0.5, 1, 1, 1, 1.5, 1.5, 2, 2, 2.5, 3, 3, 3.5, 4.5, 5.5, 12.5], 10: [0, 0.5, 0.5, 0.5, 0.5, 1, 1, 1, 1.5, 1.5, 1.5, 2, 2, 2.5, 3, 3.5, 4, 4.5, 5.5, 12]};

export function noiseRateFor(nEvents: number, gap: number): number {
  const n = Math.max(3, Math.min(10, nEvents));
  const q = NOISE_GAP_QUANTILES[n];
  if (!q || !q.length) return NaN;
  // q là 20 điểm phân vị (5%, 10%, ..., 100%) của gap ngẫu nhiên
  let i = 0;
  while (i < q.length && q[i] < gap) i++;
  return Math.max(0, 1 - i / q.length);
}

export function rectify(
  base: BaseInput,
  branches: number[],
  events: LifeEvent[],
  ratings: Record<string, number>,
  conv: Conventions,
  currentYear = new Date().getFullYear(),
): RectifyResult & { descriptions: TraitDescription[] } {
  const charts = candidateCharts(base, branches, conv);
  const descriptions = traitDescriptions(charts);
  const valid = events.filter((e) => e.year >= base.year && e.year <= currentYear);
  const candidates = scoreCandidates(charts, valid, ratings, descriptions);
  const { z, gap } = stats(candidates);
  const warnings: string[] = [];
  if (valid.length < events.length) warnings.push('Một số sự kiện có năm trước năm sinh hoặc sau năm hiện tại đã bị bỏ qua.');
  if (valid.length < 3) warnings.push('Cần ít nhất 3 sự kiện có năm để so sánh; 5–8 sự kiện cho kết quả đáng tin hơn.');
  if (branches.length < 2) warnings.push('Chỉ có một canh giờ ứng viên — không có gì để so sánh.');

  const n = Math.max(3, Math.min(10, valid.length));
  const [tLean, tClear] = GAP_THRESHOLDS[n];
  let verdict: Verdict = 'chua-du';
  if (valid.length >= 3 && branches.length >= 2) {
    if (gap >= tClear) verdict = 'kha-ro';
    else if (gap >= tLean) verdict = 'nghieng';
  }
  return { candidates, verdict, z, gap, noiseRate: noiseRateFor(valid.length, gap), warnings, descriptions };
}
