/**
 * Cách cục (các bộ sao có tên) — nhận diện bằng điều kiện tường minh.
 *
 * Nguyên tắc:
 * - Mỗi cách cục liệt kê từng điều kiện và cho biết điều kiện nào đạt, điều kiện nào thiếu.
 *   Đối thủ thường chỉ nói "lá số có cách đẹp" mà không ai kiểm chứng được.
 * - Định nghĩa theo cách hiểu phổ biến trong sách Tử Vi; một số sách thêm/bớt điều kiện.
 * - Kèm tỷ lệ nền (bao nhiêu % lá số có cách này) từ mô phỏng — để người đọc biết cách đó hiếm hay phổ biến.
 * - Không có dữ liệu nào cho thấy người có "cách tốt" thành công hơn; sách cổ xếp loại, không phải kết quả nghiên cứu.
 */
import { tamPhuong, type Chart, type Hoa } from './chart';

export interface PatternCondition {
  text: string;
  ok: boolean;
}

export interface PatternHit {
  id: string;
  name: string;
  /** Sách cổ xếp loại: tốt, xấu hay trung tính. */
  tone: 'tốt' | 'xấu' | 'trung tính';
  status: 'du' | 'gan-du';
  conditions: PatternCondition[];
  meaning: string;
}

interface PatternDef {
  id: string;
  name: string;
  tone: PatternHit['tone'];
  meaning: string;
  /** Trả về danh sách điều kiện; null nếu không áp dụng (không hiện kể cả "gần đủ"). */
  check: (c: Chart) => PatternCondition[] | null;
}

const starsIn = (c: Chart, b: number) => {
  const p = c.palaces[((b % 12) + 12) % 12];
  return [...p.majors, ...p.goodStars, ...p.badStars, ...p.others].map((s) => s.name);
};
const majorsIn = (c: Chart, b: number) => c.palaces[((b % 12) + 12) % 12].majors.map((s) => s.name);
const where = (c: Chart, name: string) => c.palaces.findIndex((p) => [...p.majors, ...p.goodStars, ...p.badStars, ...p.others].some((s) => s.name === name));
const tptc = (b: number) => {
  const t = tamPhuong(b);
  return [t.self, t.opposite, ...t.trine];
};
const inTptc = (c: Chart, name: string) => tptc(c.menhBranch).includes(where(c, name));
const hoaAt = (c: Chart, h: Hoa) => where(c, c.hoa[h]);
const brightnessOf = (c: Chart, name: string) => {
  const b = where(c, name);
  return b < 0 ? undefined : c.palaces[b].majors.find((s) => s.name === name)?.brightness;
};
const neighbors = (b: number) => [(b + 1) % 12, (b + 11) % 12];
const giap = (c: Chart, a: string, z: string) => {
  const [x, y] = neighbors(c.menhBranch);
  return (starsIn(c, x).includes(a) && starsIn(c, y).includes(z)) || (starsIn(c, x).includes(z) && starsIn(c, y).includes(a));
};
const menhHas = (c: Chart, name: string) => majorsIn(c, c.menhBranch).includes(name);

const DEFS: PatternDef[] = [
  {
    id: 'sat-pha-tham',
    name: 'Sát Phá Tham',
    tone: 'trung tính',
    meaning:
      'Bộ ba Thất Sát, Phá Quân, Tham Lang luôn đứng ở thế tam hợp với nhau. Khi một trong ba thủ Mệnh, sách mô tả người thích biến động, dám khai phá, đời có nhiều bước ngoặt — thành bại đều lớn.',
    check: (c) => {
      const m = majorsIn(c, c.menhBranch);
      if (!m.some((s) => ['Thất Sát', 'Phá Quân', 'Tham Lang'].includes(s))) return null;
      return [{ text: 'Thất Sát, Phá Quân hoặc Tham Lang thủ Mệnh', ok: true }];
    },
  },
  {
    id: 'co-nguyet-dong-luong',
    name: 'Cơ Nguyệt Đồng Lương',
    tone: 'trung tính',
    meaning:
      'Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương hội ở tam phương tứ chính cung Mệnh. Sách cổ cho là hợp công việc ổn định, chuyên môn, hành chính ("Cơ Nguyệt Đồng Lương tác lại nhân") hơn là mạo hiểm.',
    check: (c) => {
      const stars = ['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'];
      const conds = stars.map((s) => ({ text: `${s} trong tam phương tứ chính cung Mệnh`, ok: inTptc(c, s) }));
      return conds.filter((x) => x.ok).length >= 3 ? conds : null;
    },
  },
  {
    id: 'tu-phu-vu-tuong',
    name: 'Tử Phủ Vũ Tướng',
    tone: 'tốt',
    meaning:
      'Tử Vi, Thiên Phủ, Vũ Khúc, Thiên Tướng hội chiếu cung Mệnh. Sách xếp vào cách ổn định, có năng lực tổ chức và quản trị.',
    check: (c) => {
      const stars = ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng'];
      const conds = stars.map((s) => ({ text: `${s} trong tam phương tứ chính cung Mệnh`, ok: inTptc(c, s) }));
      return conds.filter((x) => x.ok).length >= 3 ? conds : null;
    },
  },
  {
    id: 'tu-phu-dong-cung',
    name: 'Tử Phủ đồng cung',
    tone: 'tốt',
    meaning: 'Tử Vi và Thiên Phủ cùng thủ Mệnh (chỉ xảy ra ở Dần hoặc Thân): "vua" và "kho" cùng chỗ — thiên về vị thế, ổn định.',
    check: (c) => (menhHas(c, 'Tử Vi') && menhHas(c, 'Thiên Phủ') ? [{ text: 'Tử Vi và Thiên Phủ cùng ở cung Mệnh', ok: true }] : null),
  },
  {
    id: 'nhat-nguyet-tinh-minh',
    name: 'Nhật Nguyệt tịnh minh',
    tone: 'tốt',
    meaning: 'Thái Dương và Thái Âm cùng sáng và cùng chiếu cung Mệnh: sách cho là sáng sủa, dễ được ghi nhận.',
    check: (c) => {
      if (!inTptc(c, 'Thái Dương') || !inTptc(c, 'Thái Âm')) return null;
      const d = (brightnessOf(c, 'Thái Dương')?.score ?? 0) >= 1;
      const a = (brightnessOf(c, 'Thái Âm')?.score ?? 0) >= 1;
      return [
        { text: 'Thái Dương và Thái Âm cùng trong tam phương tứ chính cung Mệnh', ok: true },
        { text: `Thái Dương sáng (Đắc trở lên) — hiện: ${brightnessOf(c, 'Thái Dương')?.name ?? 'không ghi'}`, ok: d },
        { text: `Thái Âm sáng (Đắc trở lên) — hiện: ${brightnessOf(c, 'Thái Âm')?.name ?? 'không ghi'}`, ok: a },
      ];
    },
  },
  {
    id: 'nhat-nguyet-phan-boi',
    name: 'Nhật Nguyệt phản bối',
    tone: 'xấu',
    meaning: 'Thái Dương và Thái Âm cùng chiếu Mệnh nhưng đều hãm. Sách cho là vất vả hơn, công sức dễ bị khuất lấp.',
    check: (c) => {
      if (!inTptc(c, 'Thái Dương') || !inTptc(c, 'Thái Âm')) return null;
      const d = (brightnessOf(c, 'Thái Dương')?.score ?? 0) <= -1;
      const a = (brightnessOf(c, 'Thái Âm')?.score ?? 0) <= -1;
      if (!d && !a) return null;
      return [
        { text: 'Thái Dương và Thái Âm cùng trong tam phương tứ chính cung Mệnh', ok: true },
        { text: `Thái Dương hãm — hiện: ${brightnessOf(c, 'Thái Dương')?.name ?? 'không ghi'}`, ok: d },
        { text: `Thái Âm hãm — hiện: ${brightnessOf(c, 'Thái Âm')?.name ?? 'không ghi'}`, ok: a },
      ];
    },
  },
  {
    id: 'nhat-chieu-loi-mon',
    name: 'Nhật chiếu Lôi Môn',
    tone: 'tốt',
    meaning: 'Thái Dương thủ Mệnh ở Mão (Mão là "cửa sấm" — Lôi Môn): mặt trời lúc bình minh, sách cho là hanh thông, có danh.',
    check: (c) => (menhHas(c, 'Thái Dương') && c.menhBranch === 3 ? [{ text: 'Thái Dương thủ Mệnh tại Mão', ok: true }] : null),
  },
  {
    id: 'nguyet-lang-thien-mon',
    name: 'Nguyệt lãng Thiên Môn',
    tone: 'tốt',
    meaning: 'Thái Âm thủ Mệnh ở Hợi (Hợi là "cửa trời" — Thiên Môn): trăng sáng giữa đêm, sách cho là thanh tú, giàu cảm xúc.',
    check: (c) => (menhHas(c, 'Thái Âm') && c.menhBranch === 11 ? [{ text: 'Thái Âm thủ Mệnh tại Hợi', ok: true }] : null),
  },
  {
    id: 'minh-chau-xuat-hai',
    name: 'Minh Châu xuất hải',
    tone: 'tốt',
    meaning: 'Mệnh vô chính diệu ở Mùi, Thái Dương ở Mão và Thái Âm ở Hợi cùng chiếu về — "ngọc sáng ra biển", một cách hiếm được sách cổ đánh giá cao.',
    check: (c) => {
      if (c.menhBranch !== 7) return null;
      const conds = [
        { text: 'Cung Mệnh ở Mùi', ok: true },
        { text: 'Cung Mệnh vô chính diệu', ok: majorsIn(c, 7).length === 0 },
        { text: 'Thái Dương ở Mão', ok: where(c, 'Thái Dương') === 3 },
        { text: 'Thái Âm ở Hợi', ok: where(c, 'Thái Âm') === 11 },
      ];
      return conds.filter((x) => x.ok).length >= 3 ? conds : null;
    },
  },
  {
    id: 'thach-trung-an-ngoc',
    name: 'Thạch trung ẩn ngọc',
    tone: 'tốt',
    meaning: 'Cự Môn thủ Mệnh ở Tý hoặc Ngọ — "ngọc ẩn trong đá": tài năng lộ dần theo thời gian. Sách cho là tốt hơn nếu có Hóa Lộc, Quyền hoặc Khoa đi kèm.',
    check: (c) => {
      if (!menhHas(c, 'Cự Môn') || ![0, 6].includes(c.menhBranch)) return null;
      const hoa = (['Lộc', 'Quyền', 'Khoa'] as Hoa[]).some((h) => hoaAt(c, h) === c.menhBranch);
      return [
        { text: 'Cự Môn thủ Mệnh tại Tý hoặc Ngọ', ok: true },
        { text: 'Có Hóa Lộc, Quyền hoặc Khoa tại Mệnh (điều kiện tăng cường)', ok: hoa },
      ];
    },
  },
  {
    id: 'ta-huu-giap-menh',
    name: 'Tả Hữu giáp Mệnh',
    tone: 'tốt',
    meaning: 'Tả Phù và Hữu Bật ở hai cung kẹp hai bên cung Mệnh: sách cho là dễ có người phò trợ.',
    check: (c) => (giap(c, 'Tả Phù', 'Hữu Bật') ? [{ text: 'Tả Phù và Hữu Bật ở hai cung liền kề hai bên Mệnh', ok: true }] : null),
  },
  {
    id: 'xuong-khuc-giap-menh',
    name: 'Xương Khúc giáp Mệnh',
    tone: 'tốt',
    meaning: 'Văn Xương và Văn Khúc kẹp hai bên cung Mệnh: sách gắn với học vấn, văn chương.',
    check: (c) => (giap(c, 'Văn Xương', 'Văn Khúc') ? [{ text: 'Văn Xương và Văn Khúc ở hai cung liền kề hai bên Mệnh', ok: true }] : null),
  },
  {
    id: 'khoi-viet',
    name: 'Khôi Việt chiếu Mệnh',
    tone: 'tốt',
    meaning: 'Thiên Khôi và Thiên Việt (cặp quý nhân) cùng ở tam phương tứ chính cung Mệnh: sách cho là hay gặp người nâng đỡ.',
    check: (c) => {
      const a = inTptc(c, 'Thiên Khôi');
      const b = inTptc(c, 'Thiên Việt');
      // Chỉ một trong hai sao chiếu Mệnh xảy ra ở gần nửa số lá số → không đáng gọi là "gần đủ"
      if (!a || !b) return null;
      return [
        { text: 'Thiên Khôi trong tam phương tứ chính cung Mệnh', ok: a },
        { text: 'Thiên Việt trong tam phương tứ chính cung Mệnh', ok: b },
      ];
    },
  },
  {
    id: 'loc-ma-giao-tri',
    name: 'Lộc Mã giao trì',
    tone: 'tốt',
    meaning: 'Thiên Mã cùng cung với Lộc Tồn hoặc Hóa Lộc, và cung đó chiếu về Mệnh: sách cho là di chuyển, đi xa mang lại lợi.',
    check: (c) => {
      const ma = where(c, 'Thiên Mã');
      const loc = ma >= 0 && (starsIn(c, ma).includes('Lộc Tồn') || hoaAt(c, 'Lộc') === ma);
      if (!loc) return null;
      return [
        { text: 'Thiên Mã cùng cung với Lộc Tồn hoặc Hóa Lộc', ok: true },
        { text: 'Cung đó nằm trong tam phương tứ chính cung Mệnh', ok: tptc(c.menhBranch).includes(ma) },
      ];
    },
  },
  {
    id: 'song-loc',
    name: 'Song Lộc',
    tone: 'tốt',
    meaning: 'Lộc Tồn và Hóa Lộc cùng chiếu cung Mệnh: sách gắn với nguồn lực, tài lộc dồi dào.',
    check: (c) => {
      const a = inTptc(c, 'Lộc Tồn');
      const b = tptc(c.menhBranch).includes(hoaAt(c, 'Lộc'));
      if (!a || !b) return null; // chỉ có một Lộc chiếu Mệnh thì quá phổ biến để gọi là cách
      return [
        { text: 'Lộc Tồn trong tam phương tứ chính', ok: true },
        { text: 'Hóa Lộc trong tam phương tứ chính', ok: true },
      ];
    },
  },
  {
    id: 'tam-hoa',
    name: 'Tam Hóa hội Mệnh (Tam kỳ gia hội)',
    tone: 'tốt',
    meaning: 'Hóa Lộc, Hóa Quyền, Hóa Khoa đều ở tam phương tứ chính cung Mệnh: sách cho là một cách quý.',
    check: (c) => {
      const conds = (['Lộc', 'Quyền', 'Khoa'] as Hoa[]).map((h) => ({
        text: `Hóa ${h} (${c.hoa[h]}) trong tam phương tứ chính cung Mệnh`,
        ok: tptc(c.menhBranch).includes(hoaAt(c, h)),
      }));
      return conds.filter((x) => x.ok).length >= 2 ? conds : null;
    },
  },
  {
    id: 'kinh-da-giap-menh',
    name: 'Kình Đà giáp Mệnh',
    tone: 'xấu',
    meaning: 'Kình Dương và Đà La kẹp hai bên Mệnh — luôn xảy ra khi Lộc Tồn thủ Mệnh. Sách mô tả "có lộc nhưng bị kẹp": giữ được của nhưng chịu áp lực, cạnh tranh.',
    check: (c) => (giap(c, 'Kình Dương', 'Đà La') ? [{ text: 'Kình Dương và Đà La ở hai cung liền kề hai bên Mệnh', ok: true }] : null),
  },
  {
    id: 'khong-kiep-giap-menh',
    name: 'Không Kiếp giáp Mệnh',
    tone: 'xấu',
    meaning: 'Địa Không và Địa Kiếp kẹp hai bên Mệnh. Sách cho là dễ gặp biến động; cách hiểu ngày nay: cần kỷ luật rủi ro.',
    check: (c) => (giap(c, 'Địa Không', 'Địa Kiếp') ? [{ text: 'Địa Không và Địa Kiếp ở hai cung liền kề hai bên Mệnh', ok: true }] : null),
  },
  {
    id: 'hoa-tham',
    name: 'Hỏa Tham / Linh Tham',
    tone: 'tốt',
    meaning: 'Tham Lang đồng cung với Hỏa Tinh hoặc Linh Tinh và chiếu về Mệnh. Sách cho là có thể "phát nhanh" — nhưng cũng biến động nhanh.',
    check: (c) => {
      const t = where(c, 'Tham Lang');
      const s = starsIn(c, t);
      if (!s.includes('Hỏa Tinh') && !s.includes('Linh Tinh')) return null;
      return [
        { text: 'Tham Lang đồng cung với Hỏa Tinh hoặc Linh Tinh', ok: true },
        { text: 'Cung đó nằm trong tam phương tứ chính cung Mệnh', ok: tptc(c.menhBranch).includes(t) },
      ];
    },
  },
  {
    id: 'menh-vo-chinh-dieu',
    name: 'Mệnh vô chính diệu',
    tone: 'trung tính',
    meaning: 'Cung Mệnh không có chính tinh, đọc bằng cách mượn sao cung đối diện. Không phải xấu: thường được hiểu là tính cách linh hoạt, chịu ảnh hưởng môi trường.',
    check: (c) => (majorsIn(c, c.menhBranch).length === 0 ? [{ text: 'Cung Mệnh không có chính tinh nào', ok: true }] : null),
  },
];

export const PATTERN_IDS = DEFS.map((d) => d.id);
export const PATTERN_NAMES: Record<string, string> = Object.fromEntries(DEFS.map((d) => [d.id, d.name]));

/** Các cách cục đủ điều kiện và gần đủ (thiếu đúng một điều kiện, chỉ với cách có từ 2 điều kiện trở lên). */
export function detectPatterns(c: Chart): PatternHit[] {
  const out: PatternHit[] = [];
  for (const d of DEFS) {
    const conds = d.check(c);
    if (!conds) continue;
    const missing = conds.filter((x) => !x.ok).length;
    // "Tăng cường" không bắt buộc
    const required = conds.filter((x) => !x.text.includes('tăng cường'));
    const reqMissing = required.filter((x) => !x.ok).length;
    let status: PatternHit['status'] | null = null;
    if (reqMissing === 0) status = 'du';
    else if (reqMissing === 1 && conds.length >= 2 && missing <= 2) status = 'gan-du';
    if (!status) continue;
    out.push({ id: d.id, name: d.name, tone: d.tone, status, conditions: conds, meaning: d.meaning });
  }
  return out.sort((a, b) => (a.status === b.status ? 0 : a.status === 'du' ? -1 : 1));
}
