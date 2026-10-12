/**
 * Độ sáng (miếu/vượng/đắc/bình/hãm) theo hai trường phái.
 *
 * - 'toan-thu': bảng của Tử Vi Đẩu Số Toàn Thư (7 mức), do thư viện iztro cung cấp.
 * - 'viet': bảng đắc tính 5 mức (M, V, Đ, B, H) quen dùng trong sách Tử Vi Việt Nam,
 *   lấy từ dự án mã nguồn mở lasotuvi (doanguyen/lasotuvi, giấy phép MIT), khớp với
 *   cách trình bày của Thái Thứ Lang. Bảng này không có Thiên Phủ, Lộc Tồn, Tả Hữu,
 *   Khôi Việt — các sao đó giữ theo Toàn Thư.
 *
 * Mỗi mảng có 12 phần tử theo thứ tự Địa Chi: Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi.
 * null = sách Việt không ghi đắc tính ở cung đó (không hiển thị dấu).
 */
export type BrightnessSchool = 'viet' | 'toan-thu';

type Mark = 'M' | 'V' | 'Đ' | 'B' | 'H' | null;

export const VIET_BRIGHTNESS: Record<string, Mark[]> = {
  'Tử Vi': ['B', 'Đ', 'M', 'B', 'V', 'M', 'M', 'Đ', 'M', 'B', 'V', 'B'],
  'Liêm Trinh': ['V', 'Đ', 'V', 'H', 'M', 'H', 'V', 'Đ', 'V', 'H', 'M', 'H'],
  'Thiên Đồng': ['V', 'H', 'M', 'Đ', 'H', 'Đ', 'H', 'H', 'M', 'H', 'H', 'Đ'],
  'Vũ Khúc': ['V', 'M', 'V', 'Đ', 'M', 'H', 'V', 'M', 'V', 'Đ', 'M', 'H'],
  'Thái Dương': ['H', 'Đ', 'V', 'V', 'V', 'M', 'M', 'Đ', 'H', 'H', 'H', 'H'],
  'Thiên Cơ': ['Đ', 'Đ', 'H', 'M', 'M', 'V', 'Đ', 'Đ', 'V', 'M', 'M', 'H'],
  'Thái Âm': ['V', 'Đ', 'H', 'H', 'H', 'H', 'H', 'Đ', 'V', 'M', 'M', 'M'],
  'Tham Lang': ['H', 'M', 'Đ', 'H', 'V', 'H', 'H', 'M', 'Đ', 'H', 'V', 'H'],
  'Cự Môn': ['V', 'H', 'V', 'M', 'H', 'H', 'V', 'H', 'Đ', 'M', 'H', 'Đ'],
  'Thiên Tướng': ['V', 'Đ', 'M', 'H', 'V', 'Đ', 'V', 'Đ', 'M', 'H', 'V', 'Đ'],
  'Thiên Lương': ['V', 'Đ', 'V', 'V', 'M', 'H', 'M', 'Đ', 'V', 'H', 'M', 'H'],
  'Thất Sát': ['M', 'Đ', 'M', 'H', 'H', 'V', 'M', 'Đ', 'M', 'H', 'H', 'V'],
  'Phá Quân': ['M', 'V', 'H', 'H', 'Đ', 'H', 'M', 'V', 'H', 'H', 'Đ', 'H'],
  'Đà La': ['H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H'],
  'Kình Dương': ['H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H'],
  'Linh Tinh': ['H', 'H', 'Đ', 'Đ', 'Đ', 'Đ', 'Đ', 'H', 'H', 'H', 'H', 'H'],
  'Hỏa Tinh': ['H', 'H', 'Đ', 'Đ', 'Đ', 'Đ', 'Đ', 'H', 'H', 'H', 'H', 'H'],
  'Văn Xương': ['H', 'Đ', 'H', 'Đ', 'H', 'Đ', 'H', 'Đ', 'H', 'H', 'Đ', 'Đ'],
  'Văn Khúc': ['H', 'Đ', 'H', 'Đ', 'H', 'Đ', 'H', 'Đ', 'H', 'H', 'Đ', 'Đ'],
  'Địa Không': ['H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ'],
  'Địa Kiếp': ['H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ', 'H', 'H', 'Đ'],
  'Thiên Mã': [null, null, 'Đ', null, null, 'Đ', null, null, null, null, null, null],
  'Thiên Hình': [null, null, 'Đ', 'Đ', null, null, null, null, 'Đ', 'Đ', null, null],
  'Thiên Riêu': [null, null, 'Đ', 'Đ', null, null, null, null, null, 'Đ', 'Đ', null],
  'Thiên Khốc': ['Đ', 'Đ', null, 'Đ', null, null, 'Đ', 'Đ', null, 'Đ', null, null],
  'Thiên Hư': ['Đ', 'Đ', null, 'Đ', null, null, 'Đ', 'Đ', null, 'Đ', null, null],
};

const MARK_INFO: Record<Exclude<Mark, null>, { name: string; code: string; score: number }> = {
  M: { name: 'Miếu', code: 'M', score: 3 },
  V: { name: 'Vượng', code: 'V', score: 2 },
  Đ: { name: 'Đắc', code: 'Đ', score: 1 },
  B: { name: 'Bình', code: 'B', score: 0 },
  H: { name: 'Hãm', code: 'H', score: -2 },
};

/** Độ sáng theo sách Việt; `undefined` nếu sao không có trong bảng (giữ Toàn Thư). */
export function vietBrightness(star: string, branch: number): { name: string; code: string; score: number } | null | undefined {
  const row = VIET_BRIGHTNESS[star];
  if (!row) return undefined;
  const m = row[branch];
  return m ? MARK_INFO[m] : null;
}
