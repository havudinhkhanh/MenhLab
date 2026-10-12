/** Thiên Can, Địa Chi, Nạp Âm, Ngũ Hành. Chỉ số bắt đầu từ 0 (Giáp = 0, Tý = 0). */

export const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'] as const;
export const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const;
export const CON_GIAP = ['Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Heo'] as const;

export type Element = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

/** Khung giờ của 12 canh giờ (giờ địa phương sau hiệu chỉnh). */
export const CANH_GIO = CHI.map((name, i) => {
  const start = (i * 2 + 23) % 24;
  const end = (start + 2) % 24;
  const pad = (n: number) => String(n).padStart(2, '0');
  return { index: i, name, range: `${pad(start)}:00–${pad(end)}:00` };
});

export const CHI_ELEMENT: Element[] = ['Thủy', 'Thổ', 'Mộc', 'Mộc', 'Thổ', 'Hỏa', 'Hỏa', 'Thổ', 'Kim', 'Kim', 'Thổ', 'Thủy'];
export const CAN_ELEMENT: Element[] = ['Mộc', 'Mộc', 'Hỏa', 'Hỏa', 'Thổ', 'Thổ', 'Kim', 'Kim', 'Thủy', 'Thủy'];

/** Âm Dương của Can/Chi: chỉ số chẵn là Dương. */
export const isYang = (i: number) => i % 2 === 0;

/** Nạp âm 60 hoa giáp, theo cặp (Giáp Tý–Ất Sửu là cặp 0). */
const NAP_AM: [string, Element][] = [
  ['Hải Trung Kim', 'Kim'],
  ['Lư Trung Hỏa', 'Hỏa'],
  ['Đại Lâm Mộc', 'Mộc'],
  ['Lộ Bàng Thổ', 'Thổ'],
  ['Kiếm Phong Kim', 'Kim'],
  ['Sơn Đầu Hỏa', 'Hỏa'],
  ['Giản Hạ Thủy', 'Thủy'],
  ['Thành Đầu Thổ', 'Thổ'],
  ['Bạch Lạp Kim', 'Kim'],
  ['Dương Liễu Mộc', 'Mộc'],
  ['Tuyền Trung Thủy', 'Thủy'],
  ['Ốc Thượng Thổ', 'Thổ'],
  ['Tích Lịch Hỏa', 'Hỏa'],
  ['Tùng Bách Mộc', 'Mộc'],
  ['Trường Lưu Thủy', 'Thủy'],
  ['Sa Trung Kim', 'Kim'],
  ['Sơn Hạ Hỏa', 'Hỏa'],
  ['Bình Địa Mộc', 'Mộc'],
  ['Bích Thượng Thổ', 'Thổ'],
  ['Kim Bạch Kim', 'Kim'],
  ['Phú Đăng Hỏa', 'Hỏa'],
  ['Thiên Hà Thủy', 'Thủy'],
  ['Đại Trạch Thổ', 'Thổ'],
  ['Thoa Xuyến Kim', 'Kim'],
  ['Tang Đố Mộc', 'Mộc'],
  ['Đại Khê Thủy', 'Thủy'],
  ['Sa Trung Thổ', 'Thổ'],
  ['Thiên Thượng Hỏa', 'Hỏa'],
  ['Thạch Lựu Mộc', 'Mộc'],
  ['Đại Hải Thủy', 'Thủy'],
];

/** Vị trí trong 60 hoa giáp (0 = Giáp Tý) từ chỉ số Can và Chi. */
export function sexagenaryIndex(can: number, chi: number): number {
  for (let i = 0; i < 60; i++) if (i % 10 === can && i % 12 === chi) return i;
  throw new Error(`Can ${can} và Chi ${chi} không ghép được (khác tính âm dương)`);
}

export function napAm(can: number, chi: number): { name: string; element: Element } {
  const [name, element] = NAP_AM[Math.floor(sexagenaryIndex(can, chi) / 2)];
  return { name, element };
}

export function yearCanChi(lunarYear: number): { can: number; chi: number } {
  return { can: (((lunarYear - 4) % 10) + 10) % 10, chi: (((lunarYear - 4) % 12) + 12) % 12 };
}

/** Quan hệ ngũ hành: a đối với b. */
export type ElementRelation = 'sinh' | 'được sinh' | 'khắc' | 'bị khắc' | 'hòa';
const GENERATES: Record<Element, Element> = { Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim', Kim: 'Thủy', Thủy: 'Mộc' };
const CONTROLS: Record<Element, Element> = { Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc' };

export function relation(a: Element, b: Element): ElementRelation {
  if (a === b) return 'hòa';
  if (GENERATES[a] === b) return 'sinh';
  if (GENERATES[b] === a) return 'được sinh';
  if (CONTROLS[a] === b) return 'khắc';
  return 'bị khắc';
}

/** Chuyển giờ (thập phân, 0–24) sang chỉ số canh giờ: 23–1 = Tý (0). */
export function hourToBranch(hour: number): number {
  return Math.floor(((hour + 1) % 24) / 2);
}
