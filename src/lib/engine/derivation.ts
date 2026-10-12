/**
 * "Lá số của bạn được an thế nào" — diễn lại từng bước an sao bằng chính dữ liệu của người dùng.
 * Mỗi bước được tính độc lập theo quy tắc sách, rồi đối chiếu với kết quả của engine (`check`).
 * Mục đích: cho thấy lá số là phép tính có quy tắc, ai cũng kiểm lại được — không phải bí truyền.
 */
import { CAN, CANH_GIO, CHI, napAm, isYang } from './canchi';
import type { Chart } from './chart';
import { TU_HOA, HOA_ORDER } from './names';

export interface DerivationStep {
  title: string;
  lines: string[];
  /** true nếu kết quả tính tay khớp lá số; undefined nếu bước không cần đối chiếu. */
  check?: boolean;
  terms?: string[];
}

const mod = (n: number) => ((n % 12) + 12) % 12;
const walk = (from: number, steps: number, dir: 1 | -1) => Array.from({ length: steps + 1 }, (_, i) => CHI[mod(from + dir * i)]);
const where = (c: Chart, name: string) => c.palaces.findIndex((p) => p.majors.some((s) => s.name === name));
const whereAny = (c: Chart, name: string) =>
  c.palaces.findIndex((p) => [...p.majors, ...p.goodStars, ...p.badStars, ...p.others].some((s) => s.name === name));
const CUC_NUMBER: Record<string, number> = { Thủy: 2, Mộc: 3, Kim: 4, Thổ: 5, Hỏa: 6 };

export function derive(c: Chart): DerivationStep[] {
  const steps: DerivationStep[] = [];
  const { lunar } = c.birth;
  const h = c.birth.branch;

  // 1. Can Chi năm
  steps.push({
    title: 'Can Chi năm sinh',
    terms: ['Thiên Can', 'Địa Chi'],
    lines: [
      `Năm âm lịch ${lunar.year}. Can = (${lunar.year} − 4) chia 10 lấy dư = ${c.yearCan} → ${CAN[c.yearCan]}. Chi = (${lunar.year} − 4) chia 12 lấy dư = ${c.yearChi} → ${CHI[c.yearChi]}.`,
      `Năm ${c.canChi.year}, Can ${CAN[c.yearCan]} là Can ${isYang(c.yearCan) ? 'dương' : 'âm'}, kết hợp giới tính → ${c.amDuong}. Vì vậy đại vận chạy ${c.daiVanForward ? 'thuận' : 'nghịch'} chiều kim đồng hồ.`,
    ],
  });

  // 2. Cung Mệnh, cung Thân
  let month = lunar.month;
  if (lunar.leap && c.conventions.leapRule === 'tach-15' && lunar.day > 15) month = (month % 12) + 1;
  const monthPos = mod(2 + month - 1);
  const menh = mod(monthPos - h);
  const than = mod(monthPos + h);
  steps.push({
    title: 'An cung Mệnh và cung Thân',
    terms: ['Cung', 'Cung Thân', 'Canh giờ'],
    lines: [
      `Bắt đầu ở cung Dần tính là tháng Giêng, đếm thuận đến tháng ${month}${month !== lunar.month ? ' (tháng nhuận sau ngày 15 tính sang tháng sau)' : ''}: ${walk(2, month - 1, 1).join(' → ')}. Dừng ở ${CHI[monthPos]}.`,
      `Từ ${CHI[monthPos]} tính là giờ Tý, đếm NGƯỢC đến giờ sinh (giờ ${CANH_GIO[h].name}): ${walk(monthPos, h, -1).join(' → ')}. Cung Mệnh ở ${CHI[menh]}.`,
      `Cũng từ ${CHI[monthPos]}, đếm THUẬN đến giờ sinh: ${walk(monthPos, h, 1).join(' → ')}. Cung Thân ở ${CHI[than]} (Thân cư ${c.palaces[than].name}).`,
      'Vì vậy chỉ cần lệch một canh giờ, cung Mệnh đã dời sang ô bên cạnh — lý do giờ sinh quan trọng đến vậy.',
    ],
    check: menh === c.menhBranch && than === c.thanBranch,
  });

  // 3. Can của cung Mệnh (Ngũ hổ độn) và Cục
  const danStem = ((c.yearCan % 5) * 2 + 2) % 10;
  const menhStem = (danStem + mod(menh - 2)) % 10;
  const na = napAm(menhStem, menh);
  const cucNum = CUC_NUMBER[na.element];
  steps.push({
    title: 'Tìm Cục',
    terms: ['Cục', 'Nạp Âm'],
    lines: [
      `Can của cung Dần tính theo Can năm (quy tắc "ngũ hổ độn"): năm ${CAN[c.yearCan]} → Dần mang Can ${CAN[danStem]}. Đếm thuận từ Dần đến cung Mệnh ${CHI[menh]}, Can tăng dần → cung Mệnh là ${CAN[menhStem]} ${CHI[menh]}.`,
      `Nạp âm của ${CAN[menhStem]} ${CHI[menh]} là ${na.name}, hành ${na.element} → ${c.cuc.name}. Số ${cucNum} là tuổi bắt đầu đại vận đầu tiên.`,
    ],
    check: na.element === c.cuc.element && menhStem === c.palaces[menh].stem,
  });

  // 4. Sao Tử Vi
  const d = lunar.day;
  const k = Math.ceil(d / cucNum);
  const r = k * cucNum - d;
  const base = mod(2 + k - 1);
  const tuvi = r === 0 ? base : r % 2 === 1 ? mod(base - r) : mod(base + r);
  steps.push({
    title: 'An sao Tử Vi',
    terms: ['Tử Vi'],
    lines: [
      `Lấy ngày sinh âm lịch (${d}) chia cho số Cục (${cucNum}). Tìm số nhỏ nhất nhân với ${cucNum} mà ≥ ${d}: ${k} × ${cucNum} = ${k * cucNum}, phần "mượn thêm" là ${r}.`,
      `Từ Dần đếm thuận ${k} cung: ${walk(2, k - 1, 1).join(' → ')}.`,
      r === 0
        ? `Không phải mượn thêm, nên Tử Vi ở ${CHI[tuvi]}.`
        : `Số mượn ${r} là số ${r % 2 ? 'lẻ → lùi' : 'chẵn → tiến'} ${r} cung → Tử Vi ở ${CHI[tuvi]}.`,
    ],
    check: tuvi === where(c, 'Tử Vi'),
  });

  // 5. Vòng Tử Vi & Thiên Phủ
  const phu = mod(4 - tuvi);
  const tuViGroup: [string, number][] = [
    ['Thiên Cơ', -1],
    ['Thái Dương', -3],
    ['Vũ Khúc', -4],
    ['Thiên Đồng', -5],
    ['Liêm Trinh', -8],
  ];
  const phuGroup: [string, number][] = [
    ['Thái Âm', 1],
    ['Tham Lang', 2],
    ['Cự Môn', 3],
    ['Thiên Tướng', 4],
    ['Thiên Lương', 5],
    ['Thất Sát', 6],
    ['Phá Quân', 10],
  ];
  const okTv = tuViGroup.every(([s, o]) => where(c, s) === mod(tuvi + o));
  const okPhu = where(c, 'Thiên Phủ') === phu && phuGroup.every(([s, o]) => where(c, s) === mod(phu + o));
  steps.push({
    title: 'An 13 chính tinh còn lại',
    terms: ['Chính tinh'],
    lines: [
      `Chòm Tử Vi đi NGƯỢC từ Tử Vi (${CHI[tuvi]}): ${tuViGroup.map(([s, o]) => `${s} ở ${CHI[mod(tuvi + o)]}`).join(', ')} — có những cung bỏ trống xen giữa theo quy tắc.`,
      `Thiên Phủ đối xứng với Tử Vi qua trục Dần–Thân → Thiên Phủ ở ${CHI[phu]}.`,
      `Chòm Thiên Phủ đi THUẬN: ${phuGroup.map(([s, o]) => `${s} ở ${CHI[mod(phu + o)]}`).join(', ')}.`,
      'Toàn bộ 14 chính tinh chỉ phụ thuộc vào ngày sinh và Cục — nên hai người sinh cùng ngày, cùng Cục có chính tinh ở cùng vị trí.',
    ],
    check: okTv && okPhu,
  });

  // 6. Tứ Hóa
  const hoaStars = TU_HOA[c.yearCan];
  steps.push({
    title: 'Tứ Hóa theo Can năm',
    terms: ['Tứ Hóa'],
    lines: [
      `Can năm ${CAN[c.yearCan]} tra bảng Tứ Hóa: ${HOA_ORDER.map((x, i) => `${hoaStars[i]} hóa ${x}`).join(', ')}.`,
      `Các sao này đang ở: ${HOA_ORDER.map((x, i) => `${hoaStars[i]} tại cung ${c.palaces[whereAny(c, hoaStars[i])]?.name ?? '?'}`).join('; ')}.`,
    ],
    check: HOA_ORDER.every((x, i) => c.hoa[x] === hoaStars[i]),
  });

  // 7. Đại vận
  const first = c.palaces[c.menhBranch].daiVan[0];
  steps.push({
    title: 'Đại vận',
    terms: ['Đại vận'],
    lines: [
      `Đại vận đầu tiên bắt đầu tại cung Mệnh, ở tuổi bằng số Cục: ${cucNum} tuổi (${cucNum}–${cucNum + 9}).`,
      `Mỗi 10 năm chuyển sang cung kế tiếp theo chiều ${c.daiVanForward ? 'thuận' : 'nghịch'}: ${Array.from({ length: 4 }, (_, i) => {
        const b = mod(c.menhBranch + (c.daiVanForward ? i : -i));
        return `${c.palaces[b].name} (${cucNum + 10 * i}–${cucNum + 10 * i + 9})`;
      }).join(' → ')} → ...`,
    ],
    check: first === cucNum,
  });

  // 8. Tuần Triệt
  steps.push({
    title: 'Tuần và Triệt',
    terms: ['Tuần', 'Triệt'],
    lines: [
      `Triệt theo Can năm: ${CAN[c.yearCan]} → giữa ${CHI[c.triet[0]]} và ${CHI[c.triet[1]]}.`,
      `Tuần theo cặp Can Chi năm: ${c.canChi.year} thuộc tuần Giáp ${CHI[mod(c.yearChi - c.yearCan)]} (10 năm từ Giáp ${CHI[mod(c.yearChi - c.yearCan)]}). Hai Chi không có Can trong tuần đó là ${CHI[c.tuan[0]]} và ${CHI[c.tuan[1]]} → Tuần nằm giữa hai cung này.`,
    ],
  });

  return steps;
}
