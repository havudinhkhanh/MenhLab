/**
 * Chuẩn hóa thông tin sinh → (ngày âm lịch, canh giờ) dùng để an sao.
 * Mọi bước hiệu chỉnh đều được ghi lại trong `steps` để hiển thị minh bạch.
 */
import { CANH_GIO, hourToBranch } from './canchi';
import { addDays, jdFromDate, lunarToSolar, solarToLunar, type LunarDate } from './lunar';
import { historicalOffset, placeByCode } from './places';

export type TimeMode = 'chuan' | 'dong-ho' | 'mat-troi';
export type DayChange = '23h' | '0h';
export type LeapRule = 'tach-15' | 'theo-thang';
export type Certainty = 'chinh-xac' | 'khoang-30' | 'khoang-120' | 'khong-ro';

export interface BirthInput {
  name?: string;
  gender: 'nam' | 'nu';
  calendar: 'duong' | 'am';
  year: number;
  month: number;
  day: number;
  /** Chỉ dùng khi nhập âm lịch. */
  leapMonth?: boolean;
  /** 'clock' = nhập giờ phút đồng hồ; 'branch' = chọn thẳng canh giờ; 'unknown' = không biết. */
  timeType: 'clock' | 'branch' | 'unknown';
  hour?: number;
  minute?: number;
  branch?: number;
  certainty: Certainty;
  /** Mã tỉnh (xem places.ts) hoặc 'overseas'. */
  place: string;
  /** Nước ngoài: múi giờ chuẩn (không tính giờ mùa hè), ví dụ -8 cho California. */
  utcOffset?: number;
  dst?: boolean;
  longitude?: number;
}

export interface Conventions {
  timeMode: TimeMode;
  dayChange: DayChange;
  leapRule: LeapRule;
}

export const DEFAULT_CONVENTIONS: Conventions = { timeMode: 'chuan', dayChange: '23h', leapRule: 'tach-15' };

export interface ResolvedBirth {
  solar: { day: number; month: number; year: number };
  lunar: LunarDate;
  branch: number;
  /** Giờ (thập phân) đã hiệu chỉnh, null nếu chọn thẳng canh giờ / không rõ. */
  effectiveHour: number | null;
  steps: string[];
  warnings: string[];
}

const fmtHM = (h: number) => {
  const total = Math.round(((h % 24) + 24) % 24 * 60);
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};
const fmtDate = (d: number, m: number, y: number) => `${d}/${m}/${y}`;

/** Phương trình thời gian (phút): giờ Mặt Trời thực − giờ Mặt Trời trung bình. Sai số ~1 phút. */
export function equationOfTime(d: number, m: number, y: number): number {
  const n = jdFromDate(d, m, y) - jdFromDate(1, 1, y) + 1;
  const B = (2 * Math.PI * (n - 81)) / 364;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

export class BirthError extends Error {}

export function resolveBirth(input: BirthInput, conv: Conventions = DEFAULT_CONVENTIONS): ResolvedBirth {
  const steps: string[] = [];
  const warnings: string[] = [];

  // 1. Ngày dương lịch theo đồng hồ nơi sinh
  let sd: number, sm: number, sy: number;
  if (input.calendar === 'am') {
    const s = lunarToSolar(input.day, input.month, input.year, !!input.leapMonth);
    if (!s) {
      throw new BirthError(
        input.leapMonth
          ? `Năm âm lịch ${input.year} không có tháng ${input.month} nhuận. Vui lòng kiểm tra lại.`
          : `Ngày ${input.day}/${input.month} âm lịch năm ${input.year} không tồn tại (tháng này chỉ có 29 ngày).`,
      );
    }
    [sd, sm, sy] = s;
    steps.push(
      `Ngày âm lịch ${input.day}/${input.month}${input.leapMonth ? ' (nhuận)' : ''}/${input.year} tương ứng dương lịch ${fmtDate(sd, sm, sy)} (lịch Việt Nam, UTC+7).`,
    );
  } else {
    [sd, sm, sy] = [input.day, input.month, input.year];
    const check = addDays(sd, sm, sy, 0);
    if (check[0] !== sd || check[1] !== sm) throw new BirthError('Ngày dương lịch không hợp lệ.');
  }
  if (sy < 1900 || sy > 2100) throw new BirthError('Hiện hỗ trợ năm sinh từ 1900 đến 2100.');

  let branch: number;
  let effectiveHour: number | null = null;

  if (input.timeType === 'clock') {
    const clock = (input.hour ?? 0) + (input.minute ?? 0) / 60;
    // 2. Múi giờ đồng hồ tại thời điểm sinh
    let clockOffset: number;
    let standardOffset: number;
    let lon: number | undefined;
    if (input.place === 'overseas') {
      standardOffset = input.utcOffset ?? 7;
      clockOffset = standardOffset + (input.dst ? 1 : 0);
      lon = input.longitude;
      steps.push(
        `Sinh ở nước ngoài: múi giờ UTC${standardOffset >= 0 ? '+' : ''}${standardOffset}${input.dst ? ', đang áp dụng giờ mùa hè (+1)' : ''}.`,
      );
    } else {
      const place = placeByCode(input.place);
      if (!place) throw new BirthError('Vui lòng chọn nơi sinh.');
      const h = historicalOffset(place.vung, sy, sm, sd, Math.floor(clock));
      clockOffset = h.offset;
      standardOffset = 7;
      lon = place.lon;
      steps.push(`Nơi sinh ${place.name}; đồng hồ khi đó theo ${h.label}.`);
      if (Math.abs(clockOffset - 7) > 0.01) {
        warnings.push(
          `Đồng hồ thời điểm đó chạy theo UTC+${clockOffset.toFixed(clockOffset % 1 ? 2 : 0)}, lệch giờ chuẩn Việt Nam hiện nay. Nhiều lá số bị lệch canh giờ vì bỏ sót điều này.`,
        );
      }
    }

    // 3. Giờ dùng để an sao
    let eff: number;
    if (conv.timeMode === 'dong-ho') {
      eff = clock;
      steps.push(`Quy ước "giờ đồng hồ": dùng nguyên ${fmtHM(clock)}, không hiệu chỉnh.`);
    } else if (conv.timeMode === 'chuan') {
      eff = clock - clockOffset + standardOffset;
      steps.push(
        Math.abs(eff - clock) < 0.01
          ? `Quy ước "giờ chuẩn": ${fmtHM(clock)} đã là giờ chuẩn, không cần chỉnh.`
          : `Quy ước "giờ chuẩn": ${fmtHM(clock)} đồng hồ → ${fmtHM(eff)} giờ chuẩn UTC+${standardOffset}.`,
      );
    } else {
      if (lon === undefined) {
        lon = standardOffset * 15;
        warnings.push('Chưa có kinh độ nơi sinh nên giờ Mặt Trời được ước tính theo kinh tuyến giữa múi giờ.');
      }
      const utc = clock - clockOffset;
      const meanSolar = utc + lon / 15;
      const eot = equationOfTime(sd, sm, sy);
      eff = meanSolar + eot / 60;
      steps.push(
        `Quy ước "giờ Mặt Trời thực": kinh độ ${lon.toFixed(2)}°Đ → giờ Mặt Trời trung bình ${fmtHM(meanSolar)}, cộng phương trình thời gian ${eot >= 0 ? '+' : ''}${eot.toFixed(1)} phút → ${fmtHM(eff)}.`,
      );
    }

    // Hiệu chỉnh có thể làm lùi/tiến qua nửa đêm
    if (eff < 0) {
      eff += 24;
      [sd, sm, sy] = addDays(sd, sm, sy, -1);
      steps.push(`Sau hiệu chỉnh, thời điểm sinh lùi sang ngày ${fmtDate(sd, sm, sy)}.`);
    } else if (eff >= 24) {
      eff -= 24;
      [sd, sm, sy] = addDays(sd, sm, sy, 1);
      steps.push(`Sau hiệu chỉnh, thời điểm sinh sang ngày ${fmtDate(sd, sm, sy)}.`);
    }
    effectiveHour = eff;
    branch = hourToBranch(eff);

    // 4. Giờ Tý và ranh giới ngày
    if (eff >= 23 && conv.dayChange === '23h') {
      [sd, sm, sy] = addDays(sd, sm, sy, 1);
      steps.push(`Sinh sau 23:00 (đầu giờ Tý): theo quy ước phổ biến, tính sang ngày ${fmtDate(sd, sm, sy)}.`);
    } else if (eff >= 23) {
      steps.push('Sinh sau 23:00 (giờ Tý muộn): theo quy ước "đổi ngày lúc 0h", vẫn tính ngày hiện tại.');
    }

    const distanceToEdge = Math.min(((eff + 1) % 2) * 60, (2 - ((eff + 1) % 2)) * 60);
    if (distanceToEdge < 15) {
      warnings.push(
        `Giờ sinh chỉ cách ranh giới canh giờ khoảng ${Math.round(distanceToEdge)} phút. Lá số rất nhạy với vài phút sai lệch — xem phần "Độ nhạy giờ sinh".`,
      );
    }
    steps.push(`Canh giờ: ${CANH_GIO[branch].name} (${CANH_GIO[branch].range}).`);
  } else if (input.timeType === 'branch') {
    branch = input.branch ?? 0;
    steps.push(`Bạn chọn trực tiếp giờ ${CANH_GIO[branch].name}; không áp dụng hiệu chỉnh múi giờ.`);
    if (sy >= 1942 && sy <= 1975) {
      warnings.push(
        'Bạn sinh trong giai đoạn Việt Nam từng dùng múi giờ UTC+8/UTC+9. Nếu canh giờ được suy ra từ giờ đồng hồ, hãy nhập giờ phút cụ thể để hệ thống tự hiệu chỉnh.',
      );
    }
  } else {
    branch = 0;
    warnings.push(
      'Không rõ giờ sinh: lá số tạm an theo giờ Tý. Vị trí cung Mệnh, Thân, Cục và gần như mọi sao đều phụ thuộc giờ sinh, vì vậy phần luận giải chỉ mang tính tham khảo rất hạn chế.',
    );
  }

  // 5. Âm lịch Việt Nam
  const lunar = solarToLunar(sd, sm, sy);
  steps.push(
    `Âm lịch (lịch Việt Nam): ngày ${lunar.day} tháng ${lunar.month}${lunar.leap ? ' nhuận' : ''} năm ${lunar.year}.`,
  );
  if (lunar.leap) {
    steps.push(
      conv.leapRule === 'tach-15'
        ? 'Sinh tháng nhuận: theo quy ước "tách ngày 15", nửa đầu tính tháng chính, từ ngày 16 tính sang tháng sau.'
        : 'Sinh tháng nhuận: theo quy ước "theo tháng", tính như tháng chính.',
    );
  }

  if (input.certainty === 'khoang-30' || input.certainty === 'khoang-120') {
    warnings.push('Giờ sinh là ước lượng. Hãy xem phần "Độ nhạy giờ sinh" để biết những kết luận nào vẫn đứng vững.');
  }

  return { solar: { day: sd, month: sm, year: sy }, lunar, branch, effectiveHour, steps, warnings };
}

/** Kiểm tra dữ liệu đầu vào thô (từ form/API). Trả về BirthInput sạch hoặc ném lỗi. */
export function parseBirthInput(raw: unknown): BirthInput {
  const r = (raw ?? {}) as Record<string, unknown>;
  const num = (v: unknown, name: string, min: number, max: number) => {
    const n = Number(v);
    if (!Number.isFinite(n) || n < min || n > max) throw new BirthError(`Giá trị "${name}" không hợp lệ.`);
    return n;
  };
  const gender = r.gender === 'nu' ? 'nu' : r.gender === 'nam' ? 'nam' : null;
  if (!gender) throw new BirthError('Vui lòng chọn giới tính (dùng để xác định chiều đại vận).');
  const calendar = r.calendar === 'am' ? 'am' : 'duong';
  const timeType = r.timeType === 'branch' || r.timeType === 'unknown' ? r.timeType : 'clock';
  const certainty = (['chinh-xac', 'khoang-30', 'khoang-120', 'khong-ro'] as const).includes(r.certainty as Certainty)
    ? (r.certainty as Certainty)
    : timeType === 'unknown'
      ? 'khong-ro'
      : 'chinh-xac';
  const input: BirthInput = {
    name: typeof r.name === 'string' ? r.name.trim().slice(0, 60) : undefined,
    gender,
    calendar,
    year: num(r.year, 'năm', 1900, 2100),
    month: num(r.month, 'tháng', 1, 12),
    day: num(r.day, 'ngày', 1, 31),
    leapMonth: calendar === 'am' && !!r.leapMonth,
    timeType,
    certainty,
    place: typeof r.place === 'string' ? r.place : 'HCM',
  };
  if (timeType === 'clock') {
    input.hour = num(r.hour, 'giờ', 0, 23);
    input.minute = num(r.minute ?? 0, 'phút', 0, 59);
  }
  if (timeType === 'branch') input.branch = num(r.branch, 'canh giờ', 0, 11);
  if (input.place === 'overseas') {
    input.utcOffset = num(r.utcOffset ?? 7, 'múi giờ', -12, 14);
    input.dst = !!r.dst;
    if (r.longitude !== undefined && r.longitude !== '' && r.longitude !== null) {
      input.longitude = num(r.longitude, 'kinh độ', -180, 180);
    }
  } else if (!placeByCode(input.place)) {
    throw new BirthError('Vui lòng chọn nơi sinh.');
  }
  return input;
}

export function parseConventions(raw: unknown): Conventions {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    timeMode: r.timeMode === 'dong-ho' || r.timeMode === 'mat-troi' ? r.timeMode : 'chuan',
    dayChange: r.dayChange === '0h' ? '0h' : '23h',
    leapRule: r.leapRule === 'theo-thang' ? 'theo-thang' : 'tach-15',
  };
}
