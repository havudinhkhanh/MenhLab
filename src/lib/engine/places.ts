/**
 * Nơi sinh: dùng tên 63 tỉnh/thành trước sáp nhập 2025 vì giấy tờ khai sinh
 * của đa số người dùng ghi theo tên cũ. Kinh độ lấy theo tỉnh lỵ (làm tròn 0,1°,
 * sai số < 0,5 phút giờ Mặt Trời). `vung` dùng cho múi giờ lịch sử 1955–1975:
 * 'bac' = phía bắc vĩ tuyến 17 (Việt Nam Dân chủ Cộng hòa), 'nam' = phía nam.
 */
export interface Place {
  code: string;
  name: string;
  lon: number;
  vung: 'bac' | 'nam';
}

export const PLACES: Place[] = [
  { code: 'HN', name: 'Hà Nội', lon: 105.85, vung: 'bac' },
  { code: 'HCM', name: 'TP. Hồ Chí Minh (Sài Gòn)', lon: 106.7, vung: 'nam' },
  { code: 'HP', name: 'Hải Phòng', lon: 106.68, vung: 'bac' },
  { code: 'DN', name: 'Đà Nẵng', lon: 108.22, vung: 'nam' },
  { code: 'CT', name: 'Cần Thơ', lon: 105.78, vung: 'nam' },
  { code: 'AG', name: 'An Giang', lon: 105.43, vung: 'nam' },
  { code: 'BRVT', name: 'Bà Rịa – Vũng Tàu', lon: 107.17, vung: 'nam' },
  { code: 'BG', name: 'Bắc Giang', lon: 106.2, vung: 'bac' },
  { code: 'BK', name: 'Bắc Kạn', lon: 105.83, vung: 'bac' },
  { code: 'BL', name: 'Bạc Liêu', lon: 105.72, vung: 'nam' },
  { code: 'BN', name: 'Bắc Ninh', lon: 106.07, vung: 'bac' },
  { code: 'BT', name: 'Bến Tre', lon: 106.38, vung: 'nam' },
  { code: 'BDI', name: 'Bình Định', lon: 109.22, vung: 'nam' },
  { code: 'BD', name: 'Bình Dương', lon: 106.65, vung: 'nam' },
  { code: 'BP', name: 'Bình Phước', lon: 106.9, vung: 'nam' },
  { code: 'BTH', name: 'Bình Thuận', lon: 108.1, vung: 'nam' },
  { code: 'CM', name: 'Cà Mau', lon: 105.15, vung: 'nam' },
  { code: 'CB', name: 'Cao Bằng', lon: 106.25, vung: 'bac' },
  { code: 'DL', name: 'Đắk Lắk', lon: 108.05, vung: 'nam' },
  { code: 'DNO', name: 'Đắk Nông', lon: 107.69, vung: 'nam' },
  { code: 'DB', name: 'Điện Biên', lon: 103.02, vung: 'bac' },
  { code: 'DNA', name: 'Đồng Nai', lon: 106.82, vung: 'nam' },
  { code: 'DT', name: 'Đồng Tháp', lon: 105.63, vung: 'nam' },
  { code: 'GL', name: 'Gia Lai', lon: 108.0, vung: 'nam' },
  { code: 'HG', name: 'Hà Giang', lon: 104.98, vung: 'bac' },
  { code: 'HNA', name: 'Hà Nam', lon: 105.92, vung: 'bac' },
  { code: 'HT', name: 'Hà Tĩnh', lon: 105.9, vung: 'bac' },
  { code: 'HD', name: 'Hải Dương', lon: 106.33, vung: 'bac' },
  { code: 'HGI', name: 'Hậu Giang', lon: 105.47, vung: 'nam' },
  { code: 'HB', name: 'Hòa Bình', lon: 105.34, vung: 'bac' },
  { code: 'HY', name: 'Hưng Yên', lon: 106.05, vung: 'bac' },
  { code: 'KH', name: 'Khánh Hòa', lon: 109.19, vung: 'nam' },
  { code: 'KG', name: 'Kiên Giang', lon: 105.08, vung: 'nam' },
  { code: 'KT', name: 'Kon Tum', lon: 108.0, vung: 'nam' },
  { code: 'LC', name: 'Lai Châu', lon: 103.46, vung: 'bac' },
  { code: 'LD', name: 'Lâm Đồng', lon: 108.44, vung: 'nam' },
  { code: 'LS', name: 'Lạng Sơn', lon: 106.76, vung: 'bac' },
  { code: 'LCA', name: 'Lào Cai', lon: 103.97, vung: 'bac' },
  { code: 'LA', name: 'Long An', lon: 106.41, vung: 'nam' },
  { code: 'ND', name: 'Nam Định', lon: 106.17, vung: 'bac' },
  { code: 'NA', name: 'Nghệ An', lon: 105.69, vung: 'bac' },
  { code: 'NB', name: 'Ninh Bình', lon: 105.97, vung: 'bac' },
  { code: 'NT', name: 'Ninh Thuận', lon: 108.99, vung: 'nam' },
  { code: 'PT', name: 'Phú Thọ', lon: 105.4, vung: 'bac' },
  { code: 'PY', name: 'Phú Yên', lon: 109.3, vung: 'nam' },
  { code: 'QB', name: 'Quảng Bình', lon: 106.6, vung: 'bac' },
  { code: 'QNA', name: 'Quảng Nam', lon: 108.47, vung: 'nam' },
  { code: 'QNG', name: 'Quảng Ngãi', lon: 108.8, vung: 'nam' },
  { code: 'QN', name: 'Quảng Ninh', lon: 107.08, vung: 'bac' },
  { code: 'QT', name: 'Quảng Trị', lon: 107.1, vung: 'nam' },
  { code: 'ST', name: 'Sóc Trăng', lon: 105.97, vung: 'nam' },
  { code: 'SL', name: 'Sơn La', lon: 103.9, vung: 'bac' },
  { code: 'TN', name: 'Tây Ninh', lon: 106.1, vung: 'nam' },
  { code: 'TB', name: 'Thái Bình', lon: 106.34, vung: 'bac' },
  { code: 'TNG', name: 'Thái Nguyên', lon: 105.84, vung: 'bac' },
  { code: 'TH', name: 'Thanh Hóa', lon: 105.78, vung: 'bac' },
  { code: 'TTH', name: 'Thừa Thiên Huế', lon: 107.59, vung: 'nam' },
  { code: 'TG', name: 'Tiền Giang', lon: 106.36, vung: 'nam' },
  { code: 'TV', name: 'Trà Vinh', lon: 106.34, vung: 'nam' },
  { code: 'TQ', name: 'Tuyên Quang', lon: 105.22, vung: 'bac' },
  { code: 'VL', name: 'Vĩnh Long', lon: 105.97, vung: 'nam' },
  { code: 'VP', name: 'Vĩnh Phúc', lon: 105.6, vung: 'bac' },
  { code: 'YB', name: 'Yên Bái', lon: 104.87, vung: 'bac' },
];

export const placeByCode = (code: string) => PLACES.find((p) => p.code === code);

/**
 * Múi giờ đồng hồ ở Việt Nam theo thời kỳ (theo cơ sở dữ liệu múi giờ IANA,
 * vùng Asia/Ho_Chi_Minh). Mốc tính theo giờ địa phương, đủ chính xác cho mục
 * đích chọn canh giờ (2 tiếng).
 */
interface TzPeriod {
  until: [number, number, number, number]; // y, m, d, h (giờ địa phương, không bao gồm)
  offset: number;
  label: string;
}

const COMMON_EARLY: TzPeriod[] = [
  { until: [1911, 5, 1, 0], offset: 7 + 6.5 / 60, label: 'Giờ địa phương Phù Liễn/Sài Gòn (UTC+7:06:30)' },
  { until: [1942, 12, 31, 23], offset: 7, label: 'Giờ Đông Dương (UTC+7)' },
  { until: [1945, 3, 14, 23], offset: 8, label: 'Giờ Đông Dương thời Pháp–Nhật (UTC+8)' },
  { until: [1945, 9, 2, 0], offset: 9, label: 'Giờ Tokyo thời Nhật chiếm đóng (UTC+9)' },
  { until: [1947, 4, 1, 0], offset: 7, label: 'Giờ chuẩn Việt Nam (UTC+7)' },
];

const SOUTH: TzPeriod[] = [
  ...COMMON_EARLY,
  { until: [1955, 7, 1, 1], offset: 8, label: 'Giờ vùng Pháp kiểm soát (UTC+8)' },
  { until: [1959, 12, 31, 23], offset: 7, label: 'Giờ chuẩn (UTC+7)' },
  { until: [1975, 6, 13, 0], offset: 8, label: 'Giờ Sài Gòn thời Việt Nam Cộng hòa (UTC+8)' },
  { until: [9999, 1, 1, 0], offset: 7, label: 'Giờ chuẩn Việt Nam (UTC+7)' },
];

const NORTH: TzPeriod[] = [
  ...COMMON_EARLY,
  { until: [1955, 7, 1, 1], offset: 8, label: 'Giờ vùng Pháp kiểm soát (UTC+8) — có thể khác nếu sinh ở vùng kháng chiến' },
  { until: [9999, 1, 1, 0], offset: 7, label: 'Giờ chuẩn Việt Nam (UTC+7)' },
];

export function historicalOffset(
  vung: 'bac' | 'nam',
  y: number,
  m: number,
  d: number,
  h: number,
): { offset: number; label: string } {
  const table = vung === 'nam' ? SOUTH : NORTH;
  const key = ((y * 100 + m) * 100 + d) * 100 + h;
  for (const p of table) {
    const [py, pm, pd, ph] = p.until;
    if (key < ((py * 100 + pm) * 100 + pd) * 100 + ph) return { offset: p.offset, label: p.label };
  }
  return { offset: 7, label: 'Giờ chuẩn Việt Nam (UTC+7)' };
}
