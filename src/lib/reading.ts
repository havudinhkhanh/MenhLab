/**
 * Luận giải theo quy tắc, có dẫn chứng.
 *
 * Nguyên tắc "khoa học nhất có thể":
 * 1. Minh bạch: mỗi nhận định ghi rõ căn cứ (sao nào, ở đâu, quy tắc gì).
 * 2. Ngôn ngữ xu hướng: "thiên hướng", "dễ", "cần để ý" — không "chắc chắn sẽ".
 * 3. Không dự đoán bệnh tật, tai nạn, tử vong, ly hôn, phá sản.
 * 4. Kèm câu hỏi tự kiểm chứng để người đọc đối chiếu với đời thực.
 */
import { CAN, CHI } from './engine/canchi';
import { leapMonthOfYear, lunarToSolar, addDays, solarToLunar } from './engine/lunar';
import {
  daiVanAt,
  tamPhuong,
  tuoiMu,
  yearlyLuck,
  type Chart,
  type Hoa,
  type Palace,
  type Star,
} from './engine/chart';
import { HOA_ORDER, TU_HOA } from './engine/names';
import { yearCanChi } from './engine/canchi';
import { DOMAIN_LABEL, PALACES, type DomainKey } from '@/content/palaces';
import {
  BAD_STAR_HEALTH,
  DOMAIN_CAUTION_ADVICE,
  STAR_BODY,
  FOCUS,
  HOA_PLAIN,
  MINOR_PLAIN,
  MONTH_AVOID,
  MONTH_DO,
  MONTH_TOPIC,
  MONEY_LEAK,
  MONEY_SOURCE,
  MONEY_TODO_LEAK,
  MONEY_TODO_SOURCE,
  STAR_ADVICE,
  STAR_DOMAIN_EXTRA,
} from '@/content/plain';
import { MAJOR, MINOR } from '@/content/stars';
import { narratePalace, type PalaceStory } from './story';
import { DOMAIN_DO, STAR_STORY } from '@/content/story';
import { DOMAIN_SIGNS } from '@/content/report';

export interface PalaceReading {
  branch: number;
  palace: string;
  isBody: boolean;
  /** Một câu dễ hiểu: "Thiên Cơ — người của kế hoạch" kiểu tiêu đề. */
  headline: string;
  /** Tóm lại bằng lời thường (1–3 câu). */
  summary: string;
  strengths: string[];
  cautions: string[];
  advice: string[];
  /** Bản gộp văn bản (dùng cho email). */
  paragraphs: string[];
  evidence: string[];
  support: number;
  challenge: number;
  questions: string[];
  teaser: string;
  /** Bản diễn giải dạng văn xuôi. */
  story: PalaceStory;
}

export interface OverviewItem {
  label: string;
  value: string;
  explain: string;
  term?: string;
}

export interface DaiVanReading {
  branch: number;
  palace: string;
  range: [number, number];
  current: boolean;
  summary: string;
  hoa: { hoa: Hoa; star: string; landsIn: string }[];
  notes: string[];
  evidence: string[];
}

export interface YearReading {
  year: number;
  canChi: string;
  age: number;
  thaiTue: string;
  tieuHan: string;
  daiVan?: string;
  hoa: { hoa: Hoa; star: string; landsIn: string }[];
  summary: string[];
  money: { sources: string[]; leaks: string[]; todo: string[] };
  work: string[];
  love: string[];
  family: string[];
  health: string[];
  actions: string[];
  evidence: string[];
  /** Bản gộp văn bản (dùng cho email). */
  paragraphs: string[];
  /** Diễn giải bằng văn xuôi: vì sao năm nay như vậy. */
  story: string[];
  /** Tứ Hóa của năm, giải nghĩa theo từng cung. */
  hoaNotes: { label: string; text: string }[];
  /** Nhãn đánh giá nhanh cho 4 mặt. */
  verdicts: { work: string; money: string; love: string; health: string };
  /** 5 lời khuyên có phân loại. */
  advice5: { kind: string; text: string }[];
  /** 12 tháng âm lịch (kèm tháng nhuận nếu có): tháng nào nên làm gì. */
  months: MonthReading[];
  /** Tóm tắt nhanh: tháng thuận nhất, tháng nên chậm lại. */
  monthHighlights: string[];
  locked?: boolean;
}

export type MonthTone = 'thuan' | 'binh' | 'can-trong';

export interface MonthReading {
  /** Tháng âm lịch 1..12. */
  month: number;
  leap: boolean;
  /** "Tháng Giêng", "Tháng Tư nhuận"... */
  label: string;
  canChi: string;
  /** Ngày dương lịch bắt đầu / kết thúc, dạng "d/m/yyyy". */
  from: string;
  to: string;
  palace: string;
  tone: MonthTone;
  score: number;
  /** Một câu: tháng này xoay quanh chuyện gì. */
  focus: string;
  todo: string[];
  avoid: string[];
  /** Cơ hội tiền trong tháng (nếu có tín hiệu). */
  money?: string;
  note?: string;
  evidence: string[];
  current?: boolean;
  past?: boolean;
  locked?: boolean;
}

export interface Reading {
  overview: OverviewItem[];
  overviewText: string[];
  palaces: PalaceReading[];
  daiVan: DaiVanReading[];
  years: YearReading[];
  currentAge: number;
}

export const COMBOS: Record<string, string> = {
  'Tử Vi+Thiên Phủ': 'Tử Phủ đồng cung: hai sao "vua" và "kho" ở cùng nhau — thiên về ổn định, vị thế và khả năng quản trị; mặt trái là khó chịu khi phải phục tùng.',
  'Tử Vi+Thất Sát': 'Tử Sát: sách cổ gọi là "hóa sát vi quyền" — sự quyết liệt được dẫn dắt thành năng lực lãnh đạo.',
  'Tử Vi+Phá Quân': 'Tử Phá: người muốn cải tổ, thay đổi trật tự cũ; nhiều bước ngoặt.',
  'Tử Vi+Tham Lang': 'Tử Tham: tài giao tế kết hợp vị thế; cần chừng mực trong hưởng thụ.',
  'Tử Vi+Thiên Tướng': 'Tử Tướng: vị thế đi cùng sự chỉn chu, hợp vai trò quản lý có nguyên tắc.',
  'Thiên Cơ+Thái Âm': 'Cơ Âm: trí óc tinh tế, nhạy cảm, hợp kế hoạch, thiết kế, tài chính.',
  'Thiên Cơ+Cự Môn': 'Cơ Cự: tư duy phân tích kết hợp lý luận sắc bén — hợp nghiên cứu, phản biện.',
  'Thiên Cơ+Thiên Lương': 'Cơ Lương: mưu trí kết hợp lòng che chở — hợp tư vấn, giảng dạy.',
  'Thái Dương+Thái Âm': 'Nhật Nguyệt đồng cung (Sửu/Mùi): hai năng lượng đối lập — dễ dao động giữa hướng ngoại và hướng nội.',
  'Thái Dương+Cự Môn': 'Cự Nhật: lời nói có sức lan tỏa — hợp nghề dùng ngôn ngữ trước công chúng.',
  'Thái Dương+Thiên Lương': 'Dương Lương: tinh thần phục vụ, giáo dục, y tế.',
  'Vũ Khúc+Thiên Phủ': 'Vũ Phủ: hai sao tài chính đi cùng — thiên về tích lũy và quản lý tiền.',
  'Vũ Khúc+Thiên Tướng': 'Vũ Tướng: thực tế và chỉn chu, hợp tài chính, quản trị.',
  'Vũ Khúc+Thất Sát': 'Vũ Sát: quyết liệt, dám làm; tài chính có thăng trầm.',
  'Vũ Khúc+Phá Quân': 'Vũ Phá: dám đầu tư, dám thay đổi; cần kỷ luật để giữ thành quả.',
  'Vũ Khúc+Tham Lang': 'Vũ Tham: sách cổ nói "Vũ Tham bất phát thiếu niên nhân" — thành tựu tài chính thường đến muộn.',
  'Thiên Đồng+Thái Âm': 'Đồng Âm: dịu dàng, tinh tế, giàu cảm xúc.',
  'Thiên Đồng+Cự Môn': 'Đồng Cự: hiền hòa bên ngoài nhưng hay suy tư, dễ phiền lòng vì lời nói.',
  'Thiên Đồng+Thiên Lương': 'Đồng Lương: hiền lành, có lòng giúp người.',
  'Liêm Trinh+Thiên Phủ': 'Liêm Phủ: nguyên tắc và ổn định — hợp quản lý hệ thống.',
  'Liêm Trinh+Thiên Tướng': 'Liêm Tướng: kỷ cương, chỉn chu.',
  'Liêm Trinh+Thất Sát': 'Liêm Sát: nhiệt huyết và quyết liệt — năng lượng mạnh, cần định hướng rõ.',
  'Liêm Trinh+Phá Quân': 'Liêm Phá: nhiều biến động, dám đổi mới; cần kiểm soát cảm xúc.',
  'Liêm Trinh+Tham Lang': 'Liêm Tham: đam mê mãnh liệt; cần chừng mực.',
};

const ofKind = (p: Palace) => [...p.majors, ...p.goodStars, ...p.badStars, ...p.others];
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const upper = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const mod12 = (n: number) => ((n % 12) + 12) % 12;
const uniq = (xs: string[]) => [...new Set(xs.filter(Boolean))];
const dot = (s: string) => (/[.!?]$/.test(s) ? s : `${s}.`);

function where(chart: Chart, starName: string): Palace | undefined {
  return chart.palaces.find((p) => ofKind(p).some((s) => s.name === starName));
}

function hoaOf(chart: Chart, star: Star): Hoa | undefined {
  return (Object.entries(chart.hoa).find(([, s]) => s === star.name)?.[0] as Hoa | undefined) ?? star.hoa;
}

function relLabel(chart: Chart, from: number, to: number): string {
  const name = chart.palaces[from].name;
  if (from === to) return 'bản cung';
  if ((from + 6) % 12 === to) return `xung chiếu từ ${name}`;
  return `tam hợp từ ${name}`;
}

/** Ý nghĩa của một chính tinh trong một lĩnh vực, bằng lời thường. */
export function starInDomain(star: string, domain: DomainKey): string {
  const m = MAJOR[star];
  return m?.domains[domain] ?? STAR_DOMAIN_EXTRA[star]?.[domain] ?? (m ? `Mang sắc thái ${lower(m.short)}` : '');
}

export function readPalace(chart: Chart, branch: number): PalaceReading {
  const p = chart.palaces[branch];
  const info = PALACES[p.name];
  const domain = info.domain;
  const tp = tamPhuong(branch);
  const evidence: string[] = [];
  const strengths: string[] = [];
  const cautions: string[] = [];
  const advice: string[] = [];

  let majors = p.majors;
  let borrowed = false;
  if (!majors.length) {
    majors = chart.palaces[tp.opposite].majors;
    borrowed = true;
    evidence.push(`Vô chính diệu tại ${p.branchName} → mượn ${majors.map((s) => s.name).join(', ') || 'không có'} từ ${chart.palaces[tp.opposite].branchName}`);
  }

  let comboForStory: string | undefined;
  const brightTraits: string[] = [];
  // Ý nghĩa chính
  const meanings = majors.map((s) => starInDomain(s.name, domain)).filter(Boolean);
  for (const s of majors) {
    evidence.push(`${s.name}${s.brightness ? ` (${s.brightness.name})` : ''} ${borrowed ? 'chiếu từ đối cung' : `tọa ${p.branchName}`}`);
    const m = MAJOR[s.name];
    if (!m || borrowed || !s.brightness) continue;
    if (s.brightness.score >= 2) brightTraits.push(...m.strengths.map(lower));
    else if (s.brightness.score <= -1) cautions.push(`Dễ vấp ở: ${m.watch.map(lower).join(', ')}.`);
  }
  if (brightTraits.length) strengths.push(`Điểm mạnh dễ phát huy: ${uniq(brightTraits).join(', ')}.`);
  if (majors.length === 2) {
    const combo = COMBOS[`${majors[0].name}+${majors[1].name}`] ?? COMBOS[`${majors[1].name}+${majors[0].name}`];
    const comboText = combo ? combo.split(': ').slice(1).join(': ') || combo : '';
    if (combo && comboText.length > 30 && !borrowed) comboForStory = comboText;
    if (combo && comboText.length > 30) {
      strengths.push(dot(upper(comboText)));
      evidence.push(`Bộ sao ${majors[0].name} – ${majors[1].name}`);
    }
  }

  // Phụ tinh và Tứ Hóa trong tam phương tứ chính
  let support = 0;
  let challenge = 0;
  const goodTxt: string[] = [];
  const badTxt: string[] = [];
  const goodEv: string[] = [];
  const badEv: string[] = [];
  for (const b of [tp.self, tp.opposite, ...tp.trine]) {
    const w = b === tp.self ? 1 : 0.5;
    const pal = chart.palaces[b];
    for (const s of [...pal.goodStars, ...pal.badStars]) {
      const pl = MINOR_PLAIN[s.name];
      if (!pl) continue;
      if (pl.good) {
        support += w;
        goodEv.push(`${s.name} (${relLabel(chart, b, branch)})`);
        if (w === 1 || b === tp.opposite) goodTxt.push(pl.text);
      } else {
        challenge += w;
        badEv.push(`${s.name} (${relLabel(chart, b, branch)})`);
        if (w === 1 || b === tp.opposite) badTxt.push(pl.text);
      }
    }
    for (const s of ofKind(pal)) {
      const h = hoaOf(chart, s);
      if (!h) continue;
      const hp = HOA_PLAIN[h];
      if (h === 'Kỵ') {
        challenge += w;
        badEv.push(`Hóa Kỵ trên ${s.name} (${relLabel(chart, b, branch)})`);
        if (w === 1) badTxt.push(hp.text);
      } else {
        support += w;
        goodEv.push(`Hóa ${h} trên ${s.name} (${relLabel(chart, b, branch)})`);
        if (w === 1 || b === tp.opposite) goodTxt.push(hp.text);
      }
    }
    if (b === tp.self) {
      for (const s of pal.majors) {
        if (s.brightness && s.brightness.score >= 2) support += 0.5;
        if (s.brightness && s.brightness.score <= -2) challenge += 0.5;
      }
    }
  }
  for (const t of uniq(goodTxt).slice(0, 4)) strengths.push(dot(upper(t)));
  for (const t of uniq(badTxt).slice(0, 4)) cautions.push(dot(upper(t)));
  if (goodEv.length) evidence.push(`Cát tinh, Hóa tốt: ${goodEv.join('; ')}`);
  if (badEv.length) evidence.push(`Sát tinh, Hóa Kỵ: ${badEv.join('; ')}`);

  if (p.tuan || p.triet) {
    const which = [p.tuan && 'Tuần', p.triet && 'Triệt'].filter(Boolean).join(' và ');
    cautions.push(
      `Cả điều thuận lẫn điều khó ở lĩnh vực này đều "nhẹ" hơn bề ngoài — kết quả thường đến chậm hơn kỳ vọng${p.triet ? ', rõ nhất trước khoảng 30 tuổi' : ''}.`,
    );
    evidence.push(`${which} án ngữ ${p.branchName}`);
  }
  if (['Tràng Sinh', 'Lâm Quan', 'Đế Vượng'].includes(p.trangSinh)) evidence.push(`Vòng Tràng Sinh: ${p.trangSinh} (sinh khí mạnh)`);
  else if (['Tuyệt', 'Tử', 'Mộ', 'Bệnh'].includes(p.trangSinh)) evidence.push(`Vòng Tràng Sinh: ${p.trangSinh} (sinh khí trầm)`);

  // Lời khuyên
  if (['menh', 'quan', 'tai'].includes(domain) && majors[0] && STAR_ADVICE[majors[0].name]) advice.push(STAR_ADVICE[majors[0].name]);
  if (DOMAIN_DO[domain]) advice.push(DOMAIN_DO[domain]!);
  const net = support - challenge;
  if (net <= -1 && DOMAIN_CAUTION_ADVICE[domain]) advice.push(DOMAIN_CAUTION_ADVICE[domain]!);
  if (domain === 'tai' && p.badStars.some((s) => s.name === 'Địa Không' || s.name === 'Địa Kiếp')) {
    advice.push('Tránh đầu cơ, lướt sóng và vay tiền để đầu tư.');
  }
  if (domain === 'tat') {
    for (const s of majors.slice(0, 2)) {
      const b = STAR_BODY[s.name];
      if (b) cautions.push(`Sách Tử Vi gắn sao ${s.name} với ${b.organs} — đây là quan niệm truyền thống, không phải chẩn đoán. Lời nhắc: ${b.habit}.`);
    }
  }
  if (domain === 'tat') advice.push('Khám sức khỏe tổng quát mỗi năm một lần — đó là cách duy nhất biết chắc cơ thể bạn đang ra sao.');

  // Tóm lại
  const tone =
    net >= 1.5
      ? 'Nhìn chung đây là mặt thuận lợi của bạn.'
      : net <= -1.5
        ? 'Đây là mặt bạn gặp nhiều thử thách hơn — cũng là nơi bạn trưởng thành nhiều nhất nếu chủ động.'
        : 'Lĩnh vực này có cả thuận lợi lẫn thử thách.';
  let summary = `${borrowed ? 'Lĩnh vực này khá linh hoạt, dễ thay đổi theo hoàn cảnh. ' : ''}${dot(meanings[0] ?? '')} ${tone}`;
  if (meanings[1]) strengths.unshift(dot(meanings[1]));
  if (p.isBody && p.name !== 'Mệnh') {
    summary += ` Cung Thân nằm ở đây: từ khoảng 30 tuổi, bạn đặt nhiều tâm sức vào ${DOMAIN_LABEL[domain]}.`;
    evidence.push(`Thân cư ${p.name}`);
  }

  const lead = majors[0] ? MAJOR[majors[0].name] : undefined;
  const headline = majors.length
    ? `${majors.map((s) => s.name).join(' – ')}${borrowed ? ' (mượn đối cung)' : ''} — ${lead ? lower(lead.nickname.split(' — ')[1] ?? lead.nickname) : ''}`
    : 'Không có chính tinh — lĩnh vực rất linh hoạt';
  const teaser = majors.length
    ? `Cung ${p.name} của bạn có ${majors.map((s) => s.name).join(' và ')}${borrowed ? ' (mượn từ đối cung)' : ''} — ${lead ? lower(lead.nickname) : ''}.`
    : `Cung ${p.name} của bạn vô chính diệu.`;

  const adv = uniq(advice).slice(0, 3);
  return {
    branch,
    palace: p.name,
    isBody: p.isBody,
    headline,
    summary,
    strengths: uniq(strengths),
    cautions: uniq(cautions),
    advice: adv,
    paragraphs: [summary, ...uniq(strengths), ...uniq(cautions), ...adv.map((a) => `Nên làm: ${a}`)],
    evidence,
    support,
    challenge,
    questions: info.questions,
    teaser,
    story: narratePalace(chart, branch, { combo: comboForStory, support, challenge }),
  };
}

function hoaLanding(chart: Chart, stem: number) {
  return HOA_ORDER.map((h, i) => {
    const star = TU_HOA[stem][i];
    const pal = where(chart, star);
    return { hoa: h, star, landsIn: pal ? pal.name : '—' };
  });
}

/** Vị trí Lộc Tồn theo Can (Giáp Dần, Ất Mão, Bính Mậu Tỵ, Đinh Kỷ Ngọ, Canh Thân, Tân Dậu, Nhâm Hợi, Quý Tý). */
const LOC_TON = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];

export const MONTH_NAMES = ['Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười Một', 'Chạp'];
const fmtD = ([d, m, y]: [number, number, number]) => `${d}/${m}/${y}`;

/**
 * Lưu nguyệt theo phép "Đẩu Quân" (Thái Thứ Lang, Tử Vi Đẩu Số Tân Biên):
 * từ cung lưu Thái Tuế của năm, đếm nghịch đến tháng sinh (Thái Tuế là tháng 1), rồi từ đó đếm thuận
 * đến giờ sinh (bắt đầu là giờ Tý) — được cung tháng Giêng. Các tháng sau đi thuận mỗi tháng một cung.
 * Can tháng theo "ngũ hổ độn" từ Can năm; Tứ Hóa của tháng theo Can tháng.
 */
export function dauQuanBranch(chart: Chart, y: number): number {
  const bm = chart.starMonth ?? chart.birth.lunar.month;
  return mod12(yearCanChi(y).chi - (bm - 1) + chart.birth.branch);
}

export function readMonths(chart: Chart, y: number, now?: Date): MonthReading[] {
  const yc = yearCanChi(y);
  const dq = dauQuanBranch(chart, y);
  const yearHoa = TU_HOA[yc.can];
  const lt = LOC_TON[yc.can];
  const leapM = leapMonthOfYear(y);
  const split = (chart.conventions?.leapRule ?? 'tach-15') === 'tach-15';
  const today = now ? solarToLunar(now.getDate(), now.getMonth() + 1, now.getFullYear()) : undefined;

  // Thứ tự các tháng trong năm âm lịch (tháng nhuận đứng sau tháng chính).
  const seq: { m: number; leap: boolean }[] = [];
  for (let m = 1; m <= 12; m++) {
    seq.push({ m, leap: false });
    if (m === leapM) seq.push({ m, leap: true });
  }
  const starts = seq.map((x) => lunarToSolar(1, x.m, y, x.leap)!);
  starts.push(lunarToSolar(1, 1, y + 1, false)!);

  return seq.map(({ m, leap }, i) => {
    const b = mod12(dq + m - 1);
    const pal = chart.palaces[b];
    const P = pal.name;
    const monthCan = ((yc.can % 5) * 2 + 2 + (m - 1)) % 10;
    const monthChi = (m + 1) % 12;
    const mh = TU_HOA[monthCan];
    const land = (star: string) => where(chart, star)?.name ?? '—';
    const [mLoc, mQuyen, mKhoa, mKy] = mh.map(land);
    const yearKy = land(yearHoa[3]);

    // Điểm: tín hiệu thuận/nghịch rơi vào cung lưu nguyệt (minh bạch, liệt kê trong "Vì sao?").
    let score = 0;
    const why: string[] = [];
    const add = (v: number, t: string) => {
      score += v;
      why.push(`${v > 0 ? '+' : ''}${v} ${t}`);
    };
    if (mLoc === P) add(2, `${mh[0]} hóa Lộc (Can tháng) rơi vào cung ${P}`);
    if (mQuyen === P) add(1, `${mh[1]} hóa Quyền (Can tháng) rơi vào cung ${P}`);
    if (mKhoa === P) add(1, `${mh[2]} hóa Khoa (Can tháng) rơi vào cung ${P}`);
    if (mKy === P) add(-2, `${mh[3]} hóa Kỵ (Can tháng) rơi vào cung ${P}`);
    yearHoa.slice(0, 3).forEach((st, k) => {
      if (land(st) === P) add(1, `${st} hóa ${HOA_ORDER[k]} của năm nằm ở cung ${P}`);
    });
    if (yearKy === P) add(-1, `${yearHoa[3]} hóa Kỵ của năm nằm ở cung ${P}`);
    if (lt === b) add(1, `Lưu Lộc Tồn của năm ở cung ${P}`);
    if (mod12(lt + 1) === b) add(-1, `Lưu Kình Dương của năm ở cung ${P}`);
    if (mod12(lt - 1) === b) add(-1, `Lưu Đà La của năm ở cung ${P}`);
    const good = pal.goodStars.length;
    const bad = pal.badStars.length;
    if (good - bad >= 2) add(1, `cung ${P} có nhiều cát tinh hơn sát tinh (${good}/${bad})`);
    if (bad - good >= 2) add(-1, `cung ${P} có nhiều sát tinh hơn cát tinh (${bad}/${good})`);
    const tone: MonthTone = score >= 2 ? 'thuan' : score <= -2 ? 'can-trong' : 'binh';

    const topic = MONTH_TOPIC[P];
    const focus =
      tone === 'thuan'
        ? `Tháng thuận cho chuyện ${topic} — nên chủ động.`
        : tone === 'can-trong'
          ? `Tháng xoay quanh chuyện ${topic} nhưng có nhiều vướng — làm chắc, đừng vội.`
          : `Tháng xoay quanh chuyện ${topic}.`;

    const chance =
      mLoc === '—'
        ? ''
        : mLoc === P
          ? 'Hóa Lộc của tháng nằm ngay ở chuyện này — cơ hội rõ nhất của tháng nằm ở đây.'
          : mLoc === 'Tài Bạch'
            ? 'Tháng có tín hiệu thu nhập tăng: lương thưởng, doanh thu, khoản thu thêm — chủ động đòi, chốt, thu về.'
            : `Cơ hội, tiền bạc trong tháng dễ đến từ ${MONEY_SOURCE[mLoc]}.`;
    const todo = uniq([
      MONTH_DO[P],
      chance,
      mQuyen === 'Quan Lộc' && P !== 'Quan Lộc' ? 'Ở công việc, hợp lên tiếng và nhận thêm phần chủ động.' : '',
      mKhoa !== P && mKhoa !== '—' && mKhoa !== mLoc
        ? mKhoa === 'Mệnh'
          ? 'Dễ được người khác tin tưởng, giúp đỡ — hợp nhờ vả, xin góp ý.'
          : `Dễ được tin tưởng, giúp đỡ ở chuyện ${MONTH_TOPIC[mKhoa]}.`
        : '',
    ]).slice(0, 3);
    const avoid = uniq([mKy !== '—' ? MONTH_AVOID[mKy] : '', mKy !== P && tone === 'can-trong' ? MONTH_AVOID[P] : '']).slice(0, 2);

    let money: string | undefined;
    if (lt === b) money = 'Lưu Lộc Tồn của năm nằm ở cung tháng: hợp thu tiền về và để dành, hơn là tiêu.';
    if (mKy === 'Tài Bạch') money = `Tiền dễ hao vì ${MONEY_LEAK['Tài Bạch']} — giữ chặt ngân sách tháng này.`;

    const label = `Tháng ${MONTH_NAMES[m - 1]}${leap ? ' nhuận' : ''}`;
    const note = leap
      ? split
        ? `Tháng nhuận: từ mùng 1 đến 15 tính như tháng ${MONTH_NAMES[m - 1]}, từ 16 trở đi tính như tháng ${MONTH_NAMES[m % 12]} (theo quy ước bạn chọn).`
        : `Tháng nhuận: tính như tháng ${MONTH_NAMES[m - 1]} (theo quy ước bạn chọn).`
      : undefined;

    const from = starts[i];
    const to = addDays(starts[i + 1][0], starts[i + 1][1], starts[i + 1][2], -1);
    let current: boolean | undefined;
    let past: boolean | undefined;
    if (today) {
      current = today.year === y && today.month === m && today.leap === leap;
      const order = (yy: number, mm: number, lp: boolean) => yy * 100 + mm * 2 + (lp ? 1 : 0);
      past = order(today.year, today.month, today.leap) > order(y, m, leap);
    }

    return {
      month: m,
      leap,
      label,
      canChi: `${CAN[monthCan]} ${CHI[monthChi]}`,
      from: fmtD(from),
      to: fmtD(to),
      palace: P,
      tone,
      score,
      focus,
      todo,
      avoid,
      money,
      note,
      current,
      past,
      evidence: [
        `Cung tháng Giêng (Đẩu Quân) năm ${CAN[yc.can]} ${CHI[yc.chi]}: ${CHI[dq]} — từ lưu Thái Tuế ${CHI[yc.chi]} đếm nghịch đến tháng sinh ${chart.starMonth ?? chart.birth.lunar.month}, rồi đếm thuận đến giờ ${CHI[chart.birth.branch]}`,
        `${label} lưu tại ${CHI[b]} (cung ${P}); Can Chi tháng ${CAN[monthCan]} ${CHI[monthChi]}`,
        `Tứ Hóa của tháng: ${mh.map((st, k) => `${st} hóa ${HOA_ORDER[k]} → ${[mLoc, mQuyen, mKhoa, mKy][k]}`).join('; ')}`,
        why.length ? `Điểm tháng ${score > 0 ? '+' : ''}${score}: ${why.join('; ')}` : 'Điểm tháng 0: không có tín hiệu thuận hay nghịch rơi vào cung lưu nguyệt',
      ],
    };
  });
}

function monthHighlights(all: MonthReading[]): string[] {
  const list = (xs: MonthReading[]) => xs.slice(0, 3).map((x) => `${x.label.replace('Tháng ', '')} (${MONTH_TOPIC[x.palace]})`).join(', ');
  const ahead = all.filter((x) => !x.past);
  const passed = all.filter((x) => x.past);
  const prefix = passed.length ? 'Các tháng còn lại — ' : '';
  const best = ahead.filter((x) => x.tone === 'thuan').sort((a, b) => b.score - a.score);
  const slow = ahead.filter((x) => x.tone === 'can-trong').sort((a, b) => a.score - b.score);
  const out: string[] = [];
  if (best.length) out.push(`${prefix}tháng thuận để chủ động: ${list(best)}.`);
  if (slow.length) out.push(`${prefix}tháng nên làm chắc, đừng vội: ${list(slow)}.`);
  if (ahead.length && !best.length && !slow.length)
    out.push(`${prefix}khá đều, không có tháng nào nổi bật hẳn — giữ nhịp ổn định, tập trung vào việc của từng tháng bên dưới.`);
  const pb = passed.filter((x) => x.tone !== 'binh');
  if (pb.length)
    out.push(
      `Đã qua: ${pb.map((x) => `${x.label.replace('Tháng ', '')} (${x.tone === 'thuan' ? 'thuận' : 'làm chắc'})`).join(', ')} — mở ra đối chiếu xem có khớp với điều đã xảy ra không.`,
    );
  return out.map(upper);
}

export function readYear(chart: Chart, y: number, now?: Date): YearReading {
  const l = yearlyLuck(chart, y);
  const pal = (b: number) => chart.palaces[mod12(b)];
  const TT = pal(l.thaiTueBranch).name;
  const TH = pal(l.tieuHan).name;
  const hoa = HOA_ORDER.map((h) => ({ hoa: h, star: l.hoa[h], landsIn: where(chart, l.hoa[h])?.name ?? '—' }));
  const at = (h: Hoa) => hoa.find((x) => x.hoa === h)!.landsIn;
  const L = at('Lộc');
  const Q = at('Quyền');
  const K = at('Khoa');
  const KY = at('Kỵ');
  const lt = LOC_TON[yearCanChi(y).can];
  const LT = pal(lt).name;
  const KINH = pal(lt + 1).name;
  const DA = pal(lt - 1).name;
  const dv = l.daiVan;
  const dvHoa = dv ? hoaLanding(chart, dv.stem) : [];
  const dvLoc = dvHoa.find((x) => x.hoa === 'Lộc')?.landsIn;
  const dvKy = dvHoa.find((x) => x.hoa === 'Kỵ')?.landsIn;
  const active = (name: string) => TT === name || TH === name;
  const dl = (name: string) => DOMAIN_LABEL[PALACES[name]?.domain ?? 'menh'];

  // Tóm tắt
  const summary = [`Chuyện được nhắc tới nhiều nhất trong năm: ${MONTH_TOPIC[TT]}.`];
  if (TH !== TT) summary.push(`Tự bạn sẽ thấy bận tâm nhiều về ${MONTH_TOPIC[TH]}.`);
  summary.push(`Thuận nhất ở chuyện ${MONTH_TOPIC[L] ?? L}; cần làm chắc tay ở chuyện ${MONTH_TOPIC[KY] ?? KY}.`);

  // Tiền bạc
  const sources = [`Nguồn chính: ${MONEY_SOURCE[L]}.`];
  if (LT !== L) sources.push(`Nguồn phụ: ${MONEY_SOURCE[LT]}.`);
  if (active('Tài Bạch')) sources.push('Tiền bạc là chủ đề lớn của năm — thu và chi đều nhiều hơn bình thường.');
  if (dvLoc && dvLoc !== L && dvLoc !== LT) sources.push(`Bối cảnh 10 năm hiện tại: tiền cũng dễ đến từ ${MONEY_SOURCE[dvLoc]}.`);
  const leaks = [`Dễ hao vì ${MONEY_LEAK[KY]}.`];
  if (KINH === 'Tài Bạch' || DA === 'Tài Bạch') leaks.push('Dễ có chi phí phát sinh hoặc tranh giành quyền lợi về tiền.');
  const tai = chart.palaces.find((p) => p.name === 'Tài Bạch')!;
  if (active('Tài Bạch') && tai.badStars.some((s) => s.name === 'Địa Không' || s.name === 'Địa Kiếp')) {
    leaks.push('Không đầu cơ, không vay để đầu tư — lá số có dấu hiệu dễ hao khi liều.');
  }
  if (dvKy && dvKy !== KY) leaks.push(`Bối cảnh 10 năm hiện tại: cũng dễ hao vì ${MONEY_LEAK[dvKy]}.`);
  const todo = uniq([MONEY_TODO_SOURCE[L], MONEY_TODO_LEAK[KY], LT !== L ? MONEY_TODO_SOURCE[LT] : '']).slice(0, 3);

  // Công việc
  const work: string[] = [];
  if (active('Quan Lộc')) work.push('Công việc là chuyện lớn của năm: dễ có thay đổi vị trí, nhiệm vụ mới hoặc áp lực tăng.');
  if (L === 'Quan Lộc') work.push('Công việc mang lại nguồn lợi rõ — năm tốt để đề xuất tăng lương hoặc nhận dự án lớn.');
  if (Q === 'Quan Lộc') work.push('Có cơ hội nắm thêm quyền, trách nhiệm — mạnh dạn nhận.');
  if (K === 'Quan Lộc') work.push('Dễ được ghi nhận; năm tốt để học thêm, lấy chứng chỉ.');
  if (KY === 'Quan Lộc') work.push('Áp lực, dễ hiểu lầm với cấp trên hoặc đồng nghiệp — giữ trao đổi bằng văn bản, đừng quyết định nghỉ việc lúc nóng giận.');
  if (active('Thiên Di') || L === 'Thiên Di') work.push('Cơ hội đến từ bên ngoài: đi công tác, khách hàng mới, đổi môi trường.');
  if (KY === 'Nô Bộc') work.push('Cẩn thận chuyện người: đồng nghiệp, cấp dưới, đối tác — kiểm tra kỹ trước khi tin giao việc lớn.');
  if (!work.length) work.push('Công việc không phải điểm nhấn lớn của năm theo lá số — hợp để làm tốt việc đang có và học thêm kỹ năng.');

  // Tình cảm
  const love: string[] = [];
  if (active('Phu Thê')) love.push('Tình cảm, hôn nhân được để tâm nhiều: người độc thân dễ có người để ý; người đã có đôi nên dành thời gian cho nhau.');
  if (L === 'Phu Thê' || K === 'Phu Thê') love.push('Quan hệ đôi lứa thuận; hợp tác làm ăn với người bạn đời dễ suôn sẻ.');
  if (KY === 'Phu Thê') love.push('Dễ hiểu lầm, bất đồng — nói chuyện thẳng thắn sớm, đừng để chuyện nhỏ thành lớn.');
  if (!love.length) love.push('Tình cảm không có biến động lớn theo lá số — giữ nhịp quan tâm đều đặn là đủ.');

  // Gia đình
  const family: string[] = [];
  if (active('Điền Trạch') || L === 'Điền Trạch') family.push('Chuyện nhà cửa nổi lên: sửa nhà, chuyển nhà, mua bán — thuận nếu chuẩn bị kỹ.');
  if (KY === 'Điền Trạch') family.push('Nhà cửa dễ phát sinh việc cần sửa hoặc giấy tờ cần làm rõ.');
  if (active('Phụ Mẫu')) family.push('Dành thêm thời gian cho cha mẹ; để ý sức khỏe của các cụ.');
  if (KY === 'Phụ Mẫu') family.push('Có thể phải lo nhiều cho cha mẹ hoặc giấy tờ hành chính.');
  if (active('Tử Tức') || L === 'Tử Tức') family.push('Con cái là mối quan tâm lớn: học hành, chuyển cấp hoặc có tin vui.');
  if (KY === 'Tử Tức') family.push('Con cái cần bạn để tâm và trò chuyện nhiều hơn.');
  if (!family.length) family.push('Gia đình không có điểm đặc biệt theo lá số.');

  // Sức khỏe
  const health: string[] = [];
  const flag =
    active('Tật Ách') || KY === 'Tật Ách' || KY === 'Mệnh' || [KINH, DA].includes('Tật Ách') || [KINH, DA].includes('Mệnh');
  health.push(
    flag
      ? 'Năm nên ưu tiên sức khỏe hơn bình thường: đừng gồng làm quá sức, khám tổng quát sớm trong năm.'
      : 'Không có dấu hiệu đặc biệt về sức khỏe theo sách — vẫn nên khám tổng quát mỗi năm một lần.',
  );
  const tat = chart.palaces.find((p) => p.name === 'Tật Ách')!;
  const tatMajors = tat.majors.length ? tat.majors : chart.palaces[mod12(tat.branch + 6)].majors;
  for (const s of tatMajors.slice(0, 2)) {
    const b = STAR_BODY[s.name];
    if (b) health.push(`Cung sức khỏe của bạn có sao ${s.name}; sách Tử Vi gắn sao này với ${b.organs}. Coi đây là lời nhắc: ${b.habit}.`);
  }
  const badHealth = uniq([
    ...tat.badStars.map((s) => s.name),
    ...(KINH === 'Tật Ách' || KINH === 'Mệnh' ? ['Kình Dương'] : []),
    ...(DA === 'Tật Ách' || DA === 'Mệnh' ? ['Đà La'] : []),
  ]);
  for (const n of badHealth.slice(0, 2)) if (BAD_STAR_HEALTH[n]) health.push(`${n}: ${BAD_STAR_HEALTH[n]}.`);
  health.push('Đây là quan niệm truyền thống, không phải chẩn đoán. Có triệu chứng bất thường hãy đi khám — lá số không thay được bác sĩ.');

  // Việc nên làm
  const actions = uniq([
    todo[0],
    todo[1],
    Q === 'Quan Lộc' ? 'Mạnh dạn nhận thêm trách nhiệm ở công việc.' : KY === 'Quan Lộc' ? 'Lưu giấy tờ công việc, tránh quyết định nghỉ việc lúc nóng giận.' : 'Học thêm một kỹ năng phục vụ công việc.',
    KY === 'Phu Thê' ? 'Dành một buổi mỗi tuần nói chuyện thật với người bạn đời.' : active('Phu Thê') ? 'Dành thời gian chất lượng cho người thương.' : '',
    flag ? 'Đặt lịch khám tổng quát trong quý đầu năm.' : 'Giữ giờ ngủ và vận động đều đặn.',
  ]).slice(0, 5);

  const evidence = [
    `Năm ${l.canChi}, ${l.age} tuổi mụ`,
    `Lưu Thái Tuế tại ${CHI[l.thaiTueBranch]} (cung ${TT}); Tiểu hạn tại cung ${TH}`,
    `Lưu Tứ Hóa (Can năm): ${hoa.map((x) => `${x.star} hóa ${x.hoa} → ${x.landsIn}`).join('; ')}`,
    `Lưu Lộc Tồn tại cung ${LT}, lưu Kình Dương tại ${KINH}, lưu Đà La tại ${DA}`,
    ...(dv ? [`Đại vận cung ${dv.name} (${dv.daiVan[0]}–${dv.daiVan[1]}), Can ${dv.stemName}: ${dvHoa.map((x) => `${x.star} hóa ${x.hoa} → ${x.landsIn}`).join('; ')}`] : []),
  ];

  const months = readMonths(chart, y, now);
  const yc = yearCanChi(y);
  const story: string[] = [
    `Năm ${l.canChi} (${y}), bạn ${l.age} tuổi âm. Cách Tử Vi xem một năm: lấy những "dấu mốc" của năm đó đặt lên lá số gốc của bạn, xem chúng rơi vào lĩnh vực nào của đời sống. Lá số gốc không đổi; cái thay đổi mỗi năm là chỗ các dấu mốc này rơi vào.`,
    `Dấu mốc chính của năm — sách gọi là Thái Tuế — rơi vào cung ${TT} của bạn, nên chuyện ${MONTH_TOPIC[TT]} sẽ là chuyện được nhắc tới nhiều nhất trong năm. Việc hợp làm nhất: ${lower(MONTH_DO[TT])}${
      TH !== TT
        ? ` Còn "hạn" theo tuổi của riêng bạn (Tiểu hạn) năm nay đi qua cung ${TH}: chuyện ${MONTH_TOPIC[TH]} là điều tự bạn sẽ thấy mình bận tâm nhiều.`
        : ' Hạn theo tuổi của riêng bạn (Tiểu hạn) cũng nằm đúng cung này, nên chủ đề đó càng rõ.'
    }`,
    `Mỗi năm, Can của năm (năm nay là ${CAN[yc.can]}) làm bốn sao trên lá số "đổi màu". Năm nay: ${hoa[0].star} được thêm nguồn lợi (Hóa Lộc) ở cung ${L} — thuận nhất ở chuyện ${MONTH_TOPIC[L] ?? L}; ${hoa[1].star} được thêm quyền chủ động (Hóa Quyền) ở cung ${Q}; ${hoa[2].star} được thêm uy tín (Hóa Khoa) ở cung ${K}; còn ${hoa[3].star} mang vướng mắc (Hóa Kỵ) ở cung ${KY} — chuyện ${MONTH_TOPIC[KY] ?? KY} là nơi cần làm chắc tay hơn.`,
    ...(dv
      ? [
          `Năm nay nằm trong chặng 10 năm ${dv.daiVan[0]}–${dv.daiVan[1]} tuổi của bạn (đi qua cung ${dv.name}), nên phông nền chung vẫn là chuyện ${MONTH_TOPIC[dv.name]}. Những gì đọc cho năm nay là "thời tiết" của một năm; chặng 10 năm mới là "khí hậu".`,
        ]
      : []),
  ];
  const hoaNotes = [
    { label: `Hóa Lộc (${hoa[0].star}) vào cung ${L}`, text: `Cơ hội, nguồn lợi năm nay dễ đến từ ${MONEY_SOURCE[L]}.` },
    { label: `Hóa Quyền (${hoa[1].star}) vào cung ${Q}`, text: `Bạn có nhiều tiếng nói, quyền chủ động hơn ở chuyện ${MONTH_TOPIC[Q]} — hợp đứng ra cầm trịch.` },
    { label: `Hóa Khoa (${hoa[2].star}) vào cung ${K}`, text: `Uy tín và sự giúp đỡ đến ở chuyện ${MONTH_TOPIC[K]}; hợp giải quyết giấy tờ, học hành, xin hỗ trợ liên quan.` },
    { label: `Hóa Kỵ (${hoa[3].star}) vào cung ${KY}`, text: `Chuyện ${MONTH_TOPIC[KY]} dễ vướng, dễ lo nghĩ. ${MONTH_AVOID[KY]}` },
  ];
  const tone = (good: boolean, bad: boolean, quiet: string) => (good && bad ? 'Có thuận có khó' : good ? 'Thuận lợi' : bad ? 'Cần làm chắc' : quiet);
  const verdicts = {
    work: tone([L, Q, K].includes('Quan Lộc') || LT === 'Quan Lộc', KY === 'Quan Lộc' || [KINH, DA].includes('Quan Lộc'), active('Quan Lộc') ? 'Nhiều thay đổi' : 'Bình ổn'),
    money: tone([L, K].includes('Tài Bạch') || LT === 'Tài Bạch', KY === 'Tài Bạch' || [KINH, DA].includes('Tài Bạch'), active('Tài Bạch') ? 'Thu chi đều lớn' : 'Bình ổn'),
    love: tone([L, Q, K].includes('Phu Thê'), KY === 'Phu Thê' || [KINH, DA].includes('Phu Thê'), active('Phu Thê') ? 'Được để tâm nhiều' : 'Bình ổn'),
    health: flag ? 'Nên ưu tiên' : 'Bình ổn',
  };
  const bestM = months.filter((m) => m.tone === 'thuan' && !m.past).map((m) => m.label.replace('Tháng ', 'tháng '));
  const slowM = months.filter((m) => m.tone === 'can-trong' && !m.past).map((m) => m.label.replace('Tháng ', 'tháng '));
  const advice5 = [
    { kind: 'Cơ hội nên ưu tiên', text: `${MONEY_TODO_SOURCE[L]}${bestM.length ? ` Thời điểm thuận để chủ động: ${bestM.slice(0, 3).join(', ')}.` : ''}` },
    { kind: 'Nguyên tắc khi ra quyết định', text: MONEY_TODO_LEAK[KY] },
    {
      kind: 'Dấu hiệu sớm cần theo dõi',
      text: flag
        ? 'Giấc ngủ chập chờn, mệt kéo dài hơn một tuần, cáu gắt vô cớ — đó là lúc dừng lại nghỉ, đừng gồng thêm. Đặt lịch khám tổng quát trong quý đầu năm.'
        : `Khi ${DOMAIN_SIGNS[TH]?.trigger ?? 'áp lực tăng'}, để ý xem mình có đang ${DOMAIN_SIGNS[TH]?.consequence ?? 'quyết vội'} không.`,
    },
    { kind: 'Giới hạn để bảo vệ mình', text: leaks.length > 1 ? `${leaks[0]} ${leaks[1]}` : `${leaks[0]} Đặt trần chi tiêu cho khoản này ngay từ đầu năm.` },
    {
      kind: 'Việc nên hoãn hoặc làm chậm',
      text: slowM.length ? `Tránh chốt việc lớn vào ${slowM.slice(0, 3).join(', ')}; nếu bắt buộc, chuẩn bị kỹ gấp đôi bình thường.` : `Không có tháng nào cần đặc biệt tránh; chỉ nên chậm lại ở chuyện ${MONTH_TOPIC[KY]}.`,
    },
  ];
  const paragraphs = [
    ...summary,
    `Tiền bạc — ${sources.join(' ')} ${leaks.join(' ')}`,
    `Công việc — ${work.join(' ')}`,
    `Tình cảm — ${love.join(' ')}`,
    `Gia đình — ${family.join(' ')}`,
    `Sức khỏe — ${health.join(' ')}`,
  ];

  return {
    year: y,
    canChi: l.canChi,
    age: l.age,
    thaiTue: TT,
    tieuHan: TH,
    daiVan: dv?.name,
    hoa,
    summary,
    money: { sources, leaks, todo },
    work,
    love,
    family,
    health,
    actions,
    evidence,
    paragraphs,
    story,
    hoaNotes,
    verdicts,
    advice5,
    months,
    monthHighlights: monthHighlights(months),
  };
}

function daiVanStory(chart: Chart, p: Palace, majors: Star[]): string {
  const dom = PALACES[p.name].domain;
  const head = `Chặng này đi qua cung ${p.name}, nên chủ đề lớn của 10 năm là chuyện ${MONTH_TOPIC[p.name]}.`;
  const m = majors[0];
  if (!m) return `${head} Cung này không có sao chính: đây là giai đoạn linh hoạt, phụ thuộc nhiều vào hoàn cảnh.`;
  const st = STAR_STORY[m.name];
  const ds = starInDomain(m.name, dom);
  return `${head} Sao chính ở đây là ${m.name}${st ? ` — ${st.role}` : ''}${p.majors.length ? '' : ' (mượn từ cung đối diện)'}; áp vào chặng này: ${lower(dot(ds))}`;
}

export function buildReading(chart: Chart, now = new Date()): Reading {
  const menh = chart.palaces[chart.menhBranch];
  const than = chart.palaces[chart.thanBranch];
  const age = tuoiMu(chart, now);

  const overview: OverviewItem[] = [
    { label: 'Năm sinh', value: `${chart.canChi.year} (${chart.amDuong})`, explain: 'Can Chi năm âm lịch và tính âm dương kết hợp giới tính — quyết định chiều chạy đại vận.', term: 'Âm Dương Nam Nữ' },
    { label: 'Bản Mệnh', value: chart.banMenh.name, explain: `Hành nạp âm của năm sinh: ${chart.banMenh.element}.`, term: 'Nạp Âm' },
    { label: 'Cục', value: chart.cuc.name, explain: `Hành ${chart.cuc.element}; đại vận đầu tiên bắt đầu ở tuổi ${chart.cuc.number}.`, term: 'Cục' },
    {
      label: 'Mệnh – Cục',
      value: { sinh: 'Cục sinh Mệnh', 'được sinh': 'Mệnh sinh Cục', khắc: 'Cục khắc Mệnh', 'bị khắc': 'Mệnh khắc Cục', hòa: 'Cục hòa Mệnh' }[chart.menhCuc],
      explain:
        {
          sinh: 'Sách cổ coi là thuận nhất: hoàn cảnh "nuôi dưỡng" bản thân.',
          'được sinh': 'Bản thân "nuôi" hoàn cảnh: sách cổ cho là hao sức hơn nhưng vẫn ổn.',
          khắc: 'Sách cổ coi là kém thuận: phải nỗ lực nhiều hơn để vượt hoàn cảnh.',
          'bị khắc': 'Bản thân chế ngự được hoàn cảnh: sách cổ cho là vất vả nhưng tự chủ.',
          hòa: 'Cùng hành: sách cổ coi là hài hòa.',
        }[chart.menhCuc] + ' Đây là chỉ dấu phụ, ảnh hưởng nhỏ so với các sao trong cung.',
      term: 'Quan hệ Mệnh – Cục',
    },
    { label: 'Âm dương', value: chart.amDuongLy === 'thuận lý' ? 'Thuận lý' : 'Nghịch lý', explain: 'Âm dương năm sinh so với vị trí cung Mệnh. Một chỉ dấu phụ.', term: 'Âm dương thuận lý / nghịch lý' },
    { label: 'Cung Mệnh', value: `${menh.branchName} — ${menh.majors.map((s) => s.name).join(', ') || 'Vô chính diệu'}`, explain: 'Ô chứa cung Mệnh và các chính tinh trong đó.', term: 'Cung Mệnh' },
    { label: 'Thân cư', value: than.name, explain: 'Cung Thân nằm chung với cung này.', term: 'Cung Thân' },
    { label: 'Mệnh chủ / Thân chủ', value: `${chart.menhChu} / ${chart.thanChu}`, explain: 'Thông tin phụ, ít ảnh hưởng luận giải.', term: 'Mệnh Chủ' },
  ];

  // Thứ tự đọc: Mệnh, rồi theo vòng ngược chiều kim đồng hồ (Huynh Đệ, Phu Thê...)
  const order = Array.from({ length: 12 }, (_, i) => mod12(chart.menhBranch - i));
  const palaces = order.map((b) => readPalace(chart, b));

  const menhR = palaces[0];
  const locPal = where(chart, chart.hoa['Lộc'])?.name ?? 'Mệnh';
  const kyPal = where(chart, chart.hoa['Kỵ'])?.name ?? 'Mệnh';
  const quan = palaces.find((p) => p.palace === 'Quan Lộc')!;
  const taiR = palaces.find((p) => p.palace === 'Tài Bạch')!;
  const overviewText = [
    `Bạn là người thế nào: ${menhR.summary}`,
    `Cách bạn làm việc: ${quan.summary.split('. ')[0]}. Cách bạn kiếm tiền: ${lower(taiR.summary.split('. ')[0])}.`,
    `Suốt đời, cơ hội và nguồn lực của bạn dễ đến từ ${MONEY_SOURCE[locPal]}. Chuyện bạn hay vướng bận, lo nghĩ nhất là ${DOMAIN_LABEL[PALACES[kyPal].domain]} — để tâm nhưng đừng để nó chi phối mọi quyết định.`,
    ...(than.name !== 'Mệnh' ? [`Từ khoảng 30 tuổi, bạn đặt nhiều tâm sức vào ${DOMAIN_LABEL[PALACES[than.name].domain]} (cung Thân nằm ở cung ${than.name}).`] : ['Cung Thân nằm cùng cung Mệnh: bạn sống khá nhất quán, ít thay đổi bản chất theo tuổi tác.']),
  ];

  const daiVan: DaiVanReading[] = chart.palaces
    .slice()
    .sort((a, b) => a.daiVan[0] - b.daiVan[0])
    .filter((p) => p.daiVan[0] <= 95)
    .map((p) => {
      const hoa = hoaLanding(chart, p.stem);
      const loc = hoa.find((x) => x.hoa === 'Lộc')!;
      const ky = hoa.find((x) => x.hoa === 'Kỵ')!;
      const notes = [
        `Cơ hội, nguồn lực dễ đến từ ${MONEY_SOURCE[loc.landsIn] ?? DOMAIN_LABEL.menh}.`,
        `Chuyện hay vướng bận: ${ky.landsIn === 'Mệnh' ? 'chính bản thân bạn — sức khỏe, cảm xúc, quyết định cá nhân' : MONTH_TOPIC[ky.landsIn] ?? ky.landsIn} — nên chuẩn bị kỹ ở mảng này.`,
      ];
      if (p.tuan || p.triet) notes.push('Kết quả của giai đoạn này thường đến chậm hơn kỳ vọng — kiên nhẫn hơn bình thường.');
      const majors = p.majors.length ? p.majors : chart.palaces[mod12(p.branch + 6)].majors;
      return {
        branch: p.branch,
        palace: p.name,
        range: p.daiVan,
        current: age >= p.daiVan[0] && age <= p.daiVan[1],
        summary: daiVanStory(chart, p, majors),
        hoa,
        notes,
        evidence: [
          `Đại vận cung ${p.name} (${p.branchName}), chính tinh ${majors.map((s) => s.name).join(', ') || '—'}${p.majors.length ? '' : ' (mượn đối cung)'}`,
          `Tứ Hóa đại vận theo Can ${p.stemName}: ${hoa.map((x) => `${x.star} hóa ${x.hoa} → ${x.landsIn}`).join('; ')}`,
          ...(p.tuan || p.triet ? [`${[p.tuan && 'Tuần', p.triet && 'Triệt'].filter(Boolean).join(', ')} tại cung đại vận`] : []),
        ],
      };
    });

  const nd = new Date(now);
  // Năm âm lịch hiện tại (trước Tết vẫn tính là năm cũ).
  const thisYear = solarToLunar(nd.getDate(), nd.getMonth() + 1, nd.getFullYear()).year;
  const years = [thisYear, thisYear + 1].map((y) => readYear(chart, y, now));

  return { overview, overviewText, palaces, daiVan, years, currentAge: age };
}

/** Một "mẩu" thông tin cho email teaser, theo bước trong chuỗi email. */
export function teaserFor(chart: Chart, step: number) {
  const r = buildReading(chart);
  const menh = r.palaces[0];
  const quan = r.palaces.find((p) => p.palace === 'Quan Lộc')!;
  const tai = r.palaces.find((p) => p.palace === 'Tài Bạch')!;
  const cur = r.daiVan.find((d) => d.current) ?? r.daiVan[0];
  const y = r.years[0];
  switch (step) {
    case 1:
      return {
        topic: 'menh',
        title: `${menh.headline.split(' — ')[0]} ở cung Mệnh của bạn nghĩa là gì?`,
        reveal: [menh.summary],
        locked: 'Phần diễn giải đầy đủ: vì sao lá số nói vậy, các sao đi kèm, việc nên làm — cho cung Mệnh và 11 cung còn lại.',
      };
    case 2:
      return {
        topic: 'quan',
        title: `Bạn hợp làm việc kiểu nào? (${quan.headline.split(' — ')[0]} ở cung Quan Lộc)`,
        reveal: [quan.summary],
        locked: `Cách bạn kiếm tiền (cung Tài Bạch: ${tai.headline.split(' — ')[0]}) và việc nên làm cụ thể nằm trong bản Pro.`,
      };
    case 3:
      return {
        topic: 'daivan',
        title: `10 năm ${cur.range[0]}–${cur.range[1]} tuổi của bạn xoay quanh chuyện gì?`,
        reveal: [cur.summary],
        locked: 'Cơ hội của giai đoạn này đến từ đâu và chuyện gì cần chuẩn bị kỹ — có trong bản Pro.',
      };
    default:
      return {
        topic: 'offer',
        title: `Năm ${y.canChi}: tiền của bạn đến từ đâu?`,
        reveal: [y.summary[0], y.money.sources[0]],
        locked: `Bản Pro: từng tháng âm lịch nên làm gì, nên tránh gì; tiền dễ hao ở đâu, công việc, tình cảm, gia đình, sức khỏe năm nay và năm sau; 12 cung đầy đủ.`,
      };
  }
}

/** Cắt bản đọc cho gói Free: đầy đủ tổng quan + cung Mệnh; năm nay chỉ phần tóm tắt và nguồn tiền chính. */
export function toFree(r: Reading): Reading & { palaces: (PalaceReading & { locked?: boolean })[] } {
  return {
    ...r,
    palaces: r.palaces.map((p, i) =>
      i === 0
        ? p
        : {
            ...p,
            summary: '',
            strengths: [],
            cautions: [],
            advice: [],
            paragraphs: [],
            evidence: [],
            support: 0,
            challenge: 0,
            story: { ...p.story, paras: [], daily: [], extras: [], verdict: '', why: [], links: '', drift: '', rule: '' },
            locked: true,
          },
    ),
    daiVan: r.daiVan.map((d) => ({ ...d, hoa: [], notes: [], evidence: [] })),
    years: r.years.slice(0, 1).map((y) => ({
      ...y,
      hoa: [],
      money: { sources: y.money.sources.slice(0, 1), leaks: [], todo: [] },
      work: [],
      love: [],
      family: [],
      health: [],
      actions: [],
      evidence: [],
      paragraphs: [...y.summary, y.money.sources[0]],
      story: y.story.slice(0, 2),
      hoaNotes: [],
      advice5: [],
      // Free: thấy nhịp cả năm (tháng thuận / cần chậm lại), chi tiết chỉ tháng hiện tại.
      months: y.months.map((m) =>
        m.current ? m : { ...m, todo: [], avoid: [], money: undefined, note: undefined, evidence: [], locked: true },
      ),
      locked: true,
    })),
  };
}

/** Mô tả ngắn phụ tinh cho tooltip. */
export function minorShort(name: string): string | undefined {
  return MINOR[name]?.short;
}
