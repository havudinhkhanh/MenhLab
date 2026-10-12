/** Ánh xạ tên Hán (đầu ra iztro, ngôn ngữ zh-CN) → thuật ngữ Tử Vi Việt Nam quen dùng. */

export const PALACE_VI: Record<string, string> = {
  命宫: 'Mệnh',
  兄弟: 'Huynh Đệ',
  夫妻: 'Phu Thê',
  子女: 'Tử Tức',
  财帛: 'Tài Bạch',
  疾厄: 'Tật Ách',
  迁移: 'Thiên Di',
  仆役: 'Nô Bộc',
  官禄: 'Quan Lộc',
  田宅: 'Điền Trạch',
  福德: 'Phúc Đức',
  父母: 'Phụ Mẫu',
};

export const STAR_VI: Record<string, string> = {
  // 14 chính tinh
  紫微: 'Tử Vi',
  天机: 'Thiên Cơ',
  太阳: 'Thái Dương',
  武曲: 'Vũ Khúc',
  天同: 'Thiên Đồng',
  廉贞: 'Liêm Trinh',
  天府: 'Thiên Phủ',
  太阴: 'Thái Âm',
  贪狼: 'Tham Lang',
  巨门: 'Cự Môn',
  天相: 'Thiên Tướng',
  天梁: 'Thiên Lương',
  七杀: 'Thất Sát',
  破军: 'Phá Quân',
  // Lục cát, Lộc, Mã
  左辅: 'Tả Phù',
  右弼: 'Hữu Bật',
  文昌: 'Văn Xương',
  文曲: 'Văn Khúc',
  天魁: 'Thiên Khôi',
  天钺: 'Thiên Việt',
  禄存: 'Lộc Tồn',
  天马: 'Thiên Mã',
  // Lục sát
  擎羊: 'Kình Dương',
  陀罗: 'Đà La',
  火星: 'Hỏa Tinh',
  铃星: 'Linh Tinh',
  地空: 'Địa Không',
  地劫: 'Địa Kiếp',
  // Phụ tinh
  红鸾: 'Hồng Loan',
  天喜: 'Thiên Hỷ',
  天姚: 'Thiên Riêu',
  咸池: 'Đào Hoa',
  天刑: 'Thiên Hình',
  解神: 'Giải Thần',
  年解: 'Niên Giải',
  天巫: 'Thiên Vu',
  天月: 'Thiên Nguyệt',
  阴煞: 'Âm Sát',
  台辅: 'Thai Phụ',
  封诰: 'Phong Cáo',
  三台: 'Tam Thai',
  八座: 'Bát Tọa',
  恩光: 'Ân Quang',
  天贵: 'Thiên Quý',
  天官: 'Thiên Quan',
  天福: 'Thiên Phúc',
  天厨: 'Thiên Trù',
  天才: 'Thiên Tài',
  天寿: 'Thiên Thọ',
  天哭: 'Thiên Khốc',
  天虚: 'Thiên Hư',
  龙池: 'Long Trì',
  凤阁: 'Phượng Các',
  孤辰: 'Cô Thần',
  寡宿: 'Quả Tú',
  破碎: 'Phá Toái',
  华盖: 'Hoa Cái',
  天德: 'Thiên Đức',
  月德: 'Nguyệt Đức',
  天空: 'Thiên Không',
  天伤: 'Thiên Thương',
  天使: 'Thiên Sứ',
};

/** Các sao iztro an nhưng trường phái Việt tính khác hoặc không dùng; MenhLab tự an lại hoặc ẩn đi. */
export const STAR_SKIP = new Set(['旬空', '截路', '空亡', '旬中', '截空', '蜚廉']);

export const BRIGHTNESS_VI: Record<string, { name: string; code: string; score: number }> = {
  庙: { name: 'Miếu', code: 'M', score: 3 },
  旺: { name: 'Vượng', code: 'V', score: 2 },
  得: { name: 'Đắc', code: 'Đ', score: 1 },
  利: { name: 'Lợi', code: 'L', score: 1 },
  平: { name: 'Bình', code: 'B', score: 0 },
  不: { name: 'Bất đắc', code: 'B', score: -1 },
  陷: { name: 'Hãm', code: 'H', score: -2 },
};

export const MUTAGEN_VI: Record<string, 'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ'> = {
  禄: 'Lộc',
  权: 'Quyền',
  科: 'Khoa',
  忌: 'Kỵ',
};

export const TRANG_SINH_VI: Record<string, string> = {
  长生: 'Tràng Sinh',
  沐浴: 'Mộc Dục',
  冠带: 'Quan Đới',
  临官: 'Lâm Quan',
  帝旺: 'Đế Vượng',
  衰: 'Suy',
  病: 'Bệnh',
  死: 'Tử',
  墓: 'Mộ',
  绝: 'Tuyệt',
  胎: 'Thai',
  养: 'Dưỡng',
};

export const BAC_SI_VI: Record<string, string> = {
  博士: 'Bác Sĩ',
  力士: 'Lực Sĩ',
  青龙: 'Thanh Long',
  小耗: 'Tiểu Hao',
  将军: 'Tướng Quân',
  奏书: 'Tấu Thư',
  飞廉: 'Phi Liêm',
  喜神: 'Hỷ Thần',
  病符: 'Bệnh Phù',
  大耗: 'Đại Hao',
  伏兵: 'Phục Binh',
  官府: 'Quan Phủ',
};

export const THAI_TUE_RING = [
  'Thái Tuế',
  'Thiếu Dương',
  'Tang Môn',
  'Thiếu Âm',
  'Quan Phù',
  'Tử Phù',
  'Tuế Phá',
  'Long Đức',
  'Bạch Hổ',
  'Phúc Đức',
  'Điếu Khách',
  'Trực Phù',
];

export const CUC_VI: Record<string, { name: string; element: 'Thủy' | 'Mộc' | 'Kim' | 'Thổ' | 'Hỏa'; number: number }> = {
  水二局: { name: 'Thủy Nhị Cục', element: 'Thủy', number: 2 },
  木三局: { name: 'Mộc Tam Cục', element: 'Mộc', number: 3 },
  金四局: { name: 'Kim Tứ Cục', element: 'Kim', number: 4 },
  土五局: { name: 'Thổ Ngũ Cục', element: 'Thổ', number: 5 },
  火六局: { name: 'Hỏa Lục Cục', element: 'Hỏa', number: 6 },
};

/** Tứ Hóa theo Thiên Can (bảng phổ biến trong sách Tử Vi Việt Nam). Thứ tự: Lộc, Quyền, Khoa, Kỵ. */
export const TU_HOA: Record<number, [string, string, string, string]> = {
  0: ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'],
  1: ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'],
  2: ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'],
  3: ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],
  4: ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'],
  5: ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'],
  6: ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'],
  7: ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'],
  8: ['Thiên Lương', 'Tử Vi', 'Tả Phù', 'Vũ Khúc'],
  9: ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang'],
};
export const HOA_ORDER = ['Lộc', 'Quyền', 'Khoa', 'Kỵ'] as const;

export const MAJOR_STARS = [
  'Tử Vi',
  'Thiên Cơ',
  'Thái Dương',
  'Vũ Khúc',
  'Thiên Đồng',
  'Liêm Trinh',
  'Thiên Phủ',
  'Thái Âm',
  'Tham Lang',
  'Cự Môn',
  'Thiên Tướng',
  'Thiên Lương',
  'Thất Sát',
  'Phá Quân',
];
export const LUC_CAT = ['Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt'];
export const LUC_SAT = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp'];

/** Bỏ dấu tiếng Việt → khóa tra từ điển, ví dụ "Thiên Cơ" → "thien-co". */
export function slug(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
