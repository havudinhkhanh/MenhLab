/**
 * Lập lá số Tử Vi.
 *
 * - Phần an sao lõi (Mệnh, Thân, Cục, 14 chính tinh, phụ tinh, độ sáng, Tứ Hóa
 *   năm sinh, vòng Tràng Sinh, vòng Bác Sĩ, đại vận) dùng thư viện mã nguồn mở
 *   iztro (MIT) — đã được kiểm chứng bởi cộng đồng.
 * - Phần riêng của Tử Vi Việt Nam tự tính: âm lịch UTC+7, Tuần/Triệt nằm giữa
 *   hai cung, vòng Thái Tuế, tiểu hạn, tên gọi thuật ngữ Việt.
 */
import { astro } from 'iztro';
import { CAN, CHI, napAm, relation, isYang, yearCanChi, type Element, type ElementRelation } from './canchi';
import { DEFAULT_CONVENTIONS, resolveBirth, type BirthInput, type Conventions, type ResolvedBirth } from './birth';
import { jdFromDate, solarToLunar } from './lunar';
import { vietBrightness, type BrightnessSchool } from './brightness';
import {
  BAC_SI_VI,
  BRIGHTNESS_VI,
  CUC_VI,
  HOA_ORDER,
  LUC_CAT,
  LUC_SAT,
  MUTAGEN_VI,
  PALACE_VI,
  STAR_SKIP,
  STAR_VI,
  THAI_TUE_RING,
  TRANG_SINH_VI,
  TU_HOA,
  slug,
} from './names';

astro.config({
  yearDivide: 'normal', // năm âm lịch đổi vào Tết (không phải Lập Xuân) — theo thông lệ Việt Nam
  horoscopeDivide: 'normal',
  ageDivide: 'normal', // tuổi mụ
  dayDivide: 'forward',
  algorithm: 'default',
});

export type StarKind = 'chinh' | 'cat' | 'sat' | 'loc' | 'ma' | 'phu';
export type Hoa = (typeof HOA_ORDER)[number];

export interface Star {
  name: string;
  key: string;
  kind: StarKind;
  brightness?: { name: string; code: string; score: number };
  hoa?: Hoa;
}

export interface Palace {
  branch: number;
  branchName: string;
  stem: number;
  stemName: string;
  name: string;
  isBody: boolean;
  majors: Star[];
  goodStars: Star[];
  badStars: Star[];
  others: Star[];
  trangSinh: string;
  bacSi: string;
  thaiTue: string;
  daiVan: [number, number];
  tuan: boolean;
  triet: boolean;
}

export interface Chart {
  version: 1;
  name?: string;
  gender: 'nam' | 'nu';
  amDuong: string; // "Dương Nam", "Âm Nữ"...
  amDuongLy: 'thuận lý' | 'nghịch lý';
  birth: ResolvedBirth;
  conventions: Conventions;
  canChi: { year: string; month: string; day: string; hour: string };
  yearCan: number;
  yearChi: number;
  banMenh: { name: string; element: Element };
  cuc: { name: string; element: Element; number: number };
  menhCuc: ElementRelation; // quan hệ Cục đối với Bản Mệnh
  menhChu: string;
  thanChu: string;
  menhBranch: number;
  thanBranch: number;
  /** Chỉ số theo Địa Chi: palaces[0] = cung Tý. */
  palaces: Palace[];
  tuan: [number, number];
  triet: [number, number];
  /** Sao mang Tứ Hóa năm sinh. */
  hoa: Record<Hoa, string>;
  daiVanForward: boolean;
  calendarNote?: string;
  brightnessSchool: BrightnessSchool;
  /** Các sao trên lá số này có độ sáng khác nhau giữa hai trường phái. */
  brightnessDiffs: { star: string; branchName: string; toanThu: string; viet: string }[];
}

const g = (s: string) => STAR_VI[s] ?? s;

function classify(name: string): StarKind {
  if (LUC_CAT.includes(name)) return 'cat';
  if (LUC_SAT.includes(name)) return 'sat';
  if (name === 'Lộc Tồn') return 'loc';
  if (name === 'Thiên Mã') return 'ma';
  return 'phu';
}

interface IzStar {
  name: string;
  type: string;
  brightness?: string;
  mutagen?: string;
}

function toStar(s: IzStar, forceKind?: StarKind): Star {
  const name = g(s.name);
  return {
    name,
    key: slug(name),
    kind: forceKind ?? classify(name),
    brightness: s.brightness ? BRIGHTNESS_VI[s.brightness] : undefined,
    hoa: s.mutagen ? MUTAGEN_VI[s.mutagen] : undefined,
  };
}

/** Triệt Lộ Không Vong: theo Can năm sinh, nằm giữa hai cung. */
export function trietPair(yearCan: number): [number, number] {
  const map: Record<number, [number, number]> = {
    0: [8, 9], // Giáp, Kỷ: Thân – Dậu
    1: [6, 7], // Ất, Canh: Ngọ – Mùi
    2: [4, 5], // Bính, Tân: Thìn – Tỵ
    3: [2, 3], // Đinh, Nhâm: Dần – Mão
    4: [0, 1], // Mậu, Quý: Tý – Sửu
  };
  return map[yearCan % 5];
}

/** Tuần Trung Không Vong: hai Chi không có Can trong tuần giáp (10 năm) chứa năm sinh. */
export function tuanPair(yearCan: number, yearChi: number): [number, number] {
  const start = (((yearChi - yearCan) % 12) + 12) % 12;
  return [(start + 10) % 12, (start + 11) % 12];
}

function sexagenaryOfDay(d: number, m: number, y: number) {
  const jd = jdFromDate(d, m, y);
  return { can: (jd + 9) % 10, chi: (jd + 1) % 12 };
}

export function buildChart(input: BirthInput, conv: Conventions = DEFAULT_CONVENTIONS): Chart {
  conv = { ...DEFAULT_CONVENTIONS, ...conv };
  const birth = resolveBirth(input, conv);
  const { lunar, branch } = birth;
  const genderZh = input.gender === 'nam' ? '男' : '女';
  const fixLeap = conv.leapRule === 'tach-15';

  // Chuẩn hóa tháng nhuận trước (để không phụ thuộc lịch Trung Quốc có nhuận tháng đó hay không)
  let starMonth = lunar.month;
  if (lunar.leap && fixLeap && lunar.day > 15) starMonth = (lunar.month % 12) + 1;

  // iztro đổi ngày qua lịch Trung Quốc. Vị trí mọi sao chỉ phụ thuộc Can Chi năm + tháng/ngày/giờ âm lịch,
  // và Can Chi lặp lại sau 60 năm. Nếu ngày này không có trong lịch Trung Quốc năm đó (lệch lịch),
  // dùng năm cùng Can Chi cách 60/120 năm — kết quả an sao giống hệt.
  type Astro = ReturnType<typeof astro.byLunar>;
  let a: Astro | undefined;
  let calendarNote: string | undefined;
  const tryYears = [lunar.year, lunar.year - 60, lunar.year + 60, lunar.year - 120, lunar.year + 120].filter((y) => y >= 1900 && y <= 2100);
  for (const y of tryYears) {
    try {
      const cand = astro.byLunar(`${y}-${starMonth}-${lunar.day}`, branch, genderZh, false, true, 'zh-CN');
      const raw = cand.rawDates.lunarDate;
      if (raw.lunarMonth === starMonth && raw.lunarDay === lunar.day && !raw.isLeap) {
        a = cand;
        break;
      }
    } catch {
      // ngày không tồn tại trong lịch Trung Quốc năm đó — thử năm khác
    }
  }
  if (!a) {
    a = astro.byLunar(`${lunar.year}-${starMonth}-${Math.min(lunar.day, 29)}`, branch, genderZh, false, true, 'zh-CN');
    calendarNote =
      'Ngày sinh rơi vào trường hợp rất hiếm lịch âm Việt Nam và Trung Quốc lệch nhau mà thư viện an sao chưa xử lý được; lá số đã an theo ngày 29. Nên đối chiếu thêm với chuyên gia.';
  }

  const { can: yearCan, chi: yearChi } = yearCanChi(lunar.year);
  const yearYang = isYang(yearCan);
  const forward = (yearYang && input.gender === 'nam') || (!yearYang && input.gender === 'nu');

  const tuan = tuanPair(yearCan, yearChi);
  const triet = trietPair(yearCan);

  const palaces: Palace[] = new Array(12);
  let menhBranch = 0;
  let thanBranch = 0;
  for (const p of a.palaces) {
    const br = (p.index + 2) % 12;
    const name = PALACE_VI[p.name] ?? p.name;
    if (name === 'Mệnh') menhBranch = br;
    if (p.isBodyPalace) thanBranch = br;
    const majors = (p.majorStars as IzStar[]).filter((s) => s.type === 'major').map((s) => toStar(s, 'chinh'));
    // Lộc Tồn/Thiên Mã đôi khi nằm trong majorStars của iztro
    const extra = (p.majorStars as IzStar[]).filter((s) => s.type !== 'major').map((s) => toStar(s));
    const minors = [...extra, ...(p.minorStars as IzStar[]).map((s) => toStar(s))];
    const adj = (p.adjectiveStars as IzStar[]).filter((s) => !STAR_SKIP.has(s.name)).map((s) => toStar(s));
    const stemIdx = CAN.findIndex((c) => c === (({ 甲: 'Giáp', 乙: 'Ất', 丙: 'Bính', 丁: 'Đinh', 戊: 'Mậu', 己: 'Kỷ', 庚: 'Canh', 辛: 'Tân', 壬: 'Nhâm', 癸: 'Quý' }) as Record<string, string>)[p.heavenlyStem]);
    palaces[br] = {
      branch: br,
      branchName: CHI[br],
      stem: stemIdx,
      stemName: CAN[stemIdx],
      name,
      isBody: p.isBodyPalace,
      majors,
      goodStars: minors.filter((s) => s.kind === 'cat' || s.kind === 'loc' || s.kind === 'ma'),
      badStars: minors.filter((s) => s.kind === 'sat'),
      others: [...minors.filter((s) => s.kind === 'phu'), ...adj],
      trangSinh: TRANG_SINH_VI[p.changsheng12] ?? p.changsheng12,
      bacSi: BAC_SI_VI[p.boshi12] ?? p.boshi12,
      thaiTue: THAI_TUE_RING[(((br - yearChi) % 12) + 12) % 12],
      daiVan: [p.decadal.range[0], p.decadal.range[1]],
      tuan: tuan.includes(br),
      triet: triet.includes(br),
    };
  }

  // Độ sáng theo trường phái
  const school: BrightnessSchool = conv.brightness ?? 'viet';
  const brightnessDiffs: Chart['brightnessDiffs'] = [];
  for (const pal of palaces) {
    for (const s of [...pal.majors, ...pal.goodStars, ...pal.badStars, ...pal.others]) {
      const v = vietBrightness(s.name, pal.branch);
      if (v === undefined) continue; // sao không có trong bảng sách Việt
      const tt = s.brightness;
      const ttName = tt?.name ?? '—';
      const vName = v?.name ?? '—';
      const comparable = (n: string) => (n === 'Lợi' ? 'Đắc' : n === 'Bất đắc' ? 'Bình' : n);
      if (comparable(ttName) !== vName) {
        brightnessDiffs.push({ star: s.name, branchName: pal.branchName, toanThu: ttName, viet: vName });
      }
      if (school === 'viet') s.brightness = v ?? undefined;
    }
  }

  // Tứ Hóa năm sinh: lấy từ bảng và đối chiếu iztro
  const hoaNames = TU_HOA[yearCan];
  const hoa = Object.fromEntries(HOA_ORDER.map((h, i) => [h, hoaNames[i]])) as Record<Hoa, string>;

  const banMenh = napAm(yearCan, yearChi);
  const cuc = CUC_VI[a.fiveElementsClass];
  const menhYang = isYang(menhBranch);

  // Can Chi tháng / ngày / giờ (tự tính theo lịch Việt Nam)
  const monthLunar = lunar.leap && fixLeap && lunar.day > 15 ? (lunar.month % 12) + 1 : lunar.month;
  const monthCan = ((yearCan % 5) * 2 + 2 + (monthLunar - 1)) % 10;
  const monthChi = (monthLunar + 1) % 12;
  const day = sexagenaryOfDay(birth.solar.day, birth.solar.month, birth.solar.year);
  const hourCan = ((day.can % 5) * 2 + branch) % 10;

  return {
    version: 1,
    name: input.name,
    gender: input.gender,
    amDuong: `${yearYang ? 'Dương' : 'Âm'} ${input.gender === 'nam' ? 'Nam' : 'Nữ'}`,
    amDuongLy: yearYang === menhYang ? 'thuận lý' : 'nghịch lý',
    birth,
    conventions: conv,
    canChi: {
      year: `${CAN[yearCan]} ${CHI[yearChi]}`,
      month: `${CAN[monthCan]} ${CHI[monthChi]}`,
      day: `${CAN[day.can]} ${CHI[day.chi]}`,
      hour: `${CAN[hourCan]} ${CHI[branch]}`,
    },
    yearCan,
    yearChi,
    banMenh,
    cuc,
    menhCuc: relation(cuc.element, banMenh.element),
    menhChu: g(a.soul),
    thanChu: g(a.body),
    menhBranch,
    thanBranch,
    palaces,
    tuan,
    triet,
    hoa,
    daiVanForward: forward,
    calendarNote,
    brightnessSchool: school,
    brightnessDiffs,
  };
}

/* ------------------------- Vận hạn theo thời gian ------------------------- */

/** Tuổi mụ tại một ngày dương lịch. */
export function tuoiMu(chart: Chart, at: Date): number {
  const l = solarToLunar(at.getDate(), at.getMonth() + 1, at.getFullYear());
  return l.year - chart.birth.lunar.year + 1;
}

export function daiVanAt(chart: Chart, age: number): Palace | undefined {
  return chart.palaces.find((p) => age >= p.daiVan[0] && age <= p.daiVan[1]);
}

/** Tiểu hạn (theo tuổi mụ): khởi từ cung theo tam hợp tuổi, nam thuận nữ nghịch. */
export function tieuHanBranch(chart: Chart, age: number): number {
  const start: Record<number, number> = { 2: 4, 6: 4, 10: 4, 8: 10, 0: 10, 4: 10, 5: 7, 9: 7, 1: 7, 11: 1, 3: 1, 7: 1 };
  const s = start[chart.yearChi];
  const dir = chart.gender === 'nam' ? 1 : -1;
  return (((s + dir * (age - 1)) % 12) + 12) % 12;
}

export interface YearlyLuck {
  year: number;
  canChi: string;
  age: number;
  thaiTueBranch: number;
  tieuHan: number;
  daiVan?: Palace;
  hoa: Record<Hoa, string>;
}

export function yearlyLuck(chart: Chart, year: number): YearlyLuck {
  const { can, chi } = yearCanChi(year);
  const age = year - chart.birth.lunar.year + 1;
  const names = TU_HOA[can];
  return {
    year,
    canChi: `${CAN[can]} ${CHI[chi]}`,
    age,
    thaiTueBranch: chi,
    tieuHan: tieuHanBranch(chart, age),
    daiVan: daiVanAt(chart, age),
    hoa: Object.fromEntries(HOA_ORDER.map((h, i) => [h, names[i]])) as Record<Hoa, string>,
  };
}

/** Tìm cung chứa một sao. */
export function findStar(chart: Chart, name: string): Palace | undefined {
  return chart.palaces.find((p) =>
    [...p.majors, ...p.goodStars, ...p.badStars, ...p.others].some((s) => s.name === name),
  );
}

/** Tam phương tứ chính: bản cung, xung chiếu (đối cung) và hai cung tam hợp. */
export function tamPhuong(branch: number) {
  return {
    self: branch,
    opposite: (branch + 6) % 12,
    trine: [(branch + 4) % 12, (branch + 8) % 12] as [number, number],
  };
}
