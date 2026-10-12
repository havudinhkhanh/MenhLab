/**
 * Luận giải theo quy tắc, có dẫn chứng.
 *
 * Nguyên tắc "khoa học nhất có thể":
 * 1. Minh bạch: mỗi nhận định ghi rõ căn cứ (sao nào, ở đâu, quy tắc gì).
 * 2. Ngôn ngữ xu hướng: "thiên hướng", "dễ", "cần để ý" — không "chắc chắn sẽ".
 * 3. Không dự đoán bệnh tật, tai nạn, tử vong, ly hôn, phá sản.
 * 4. Kèm câu hỏi tự kiểm chứng để người đọc đối chiếu với đời thực.
 */
import { CHI } from './engine/canchi';
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
import { DOMAIN_LABEL, PALACES } from '@/content/palaces';
import { HOA_INFO, MAJOR, MINOR } from '@/content/stars';

export interface PalaceReading {
  branch: number;
  palace: string;
  isBody: boolean;
  headline: string;
  paragraphs: string[];
  evidence: string[];
  support: number;
  challenge: number;
  questions: string[];
  teaser: string;
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
}

export interface YearReading {
  year: number;
  canChi: string;
  age: number;
  thaiTue: string;
  tieuHan: string;
  daiVan?: string;
  hoa: { hoa: Hoa; star: string; landsIn: string }[];
  paragraphs: string[];
}

export interface Reading {
  overview: OverviewItem[];
  overviewText: string[];
  palaces: PalaceReading[];
  daiVan: DaiVanReading[];
  years: YearReading[];
  currentAge: number;
}

const COMBOS: Record<string, string> = {
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

export function readPalace(chart: Chart, branch: number): PalaceReading {
  const p = chart.palaces[branch];
  const info = PALACES[p.name];
  const domain = info.domain;
  const tp = tamPhuong(branch);
  const paragraphs: string[] = [];
  const evidence: string[] = [];

  let majors = p.majors;
  let borrowed = false;
  if (!majors.length) {
    majors = chart.palaces[tp.opposite].majors;
    borrowed = true;
    paragraphs.push(
      `Cung ${p.name} không có chính tinh (vô chính diệu), nên mượn chính tinh của cung đối diện là ${chart.palaces[tp.opposite].name}. Lĩnh vực này của bạn linh hoạt và chịu ảnh hưởng nhiều từ hoàn cảnh.`,
    );
    evidence.push(`Vô chính diệu tại ${p.branchName} → mượn ${majors.map((s) => s.name).join(', ') || 'không có'} từ ${chart.palaces[tp.opposite].branchName}`);
  }

  for (const s of majors) {
    const m = MAJOR[s.name];
    if (!m) continue;
    const domainText = m.domains[domain] ?? `Trong lĩnh vực ${DOMAIN_LABEL[domain]}, ${s.name} mang sắc thái: ${lower(m.short)}`;
    let line = `${s.name}${borrowed ? ' (mượn)' : ''}: ${domainText}`;
    if (s.brightness && !borrowed) {
      if (s.brightness.score >= 2) line += ` Sao ở thế ${s.brightness.name} nên mặt mạnh — ${lower(m.strengths[0])} — dễ phát huy.`;
      else if (s.brightness.score <= -1)
        line += ` Sao ở thế ${s.brightness.name} nên cần để ý mặt ${lower(m.watch[0])}.`;
    }
    paragraphs.push(line);
    evidence.push(`${s.name}${s.brightness ? ` (${s.brightness.name})` : ''} ${borrowed ? 'chiếu từ đối cung' : `tọa ${p.branchName}`}`);
  }

  if (majors.length === 2) {
    const key1 = `${majors[0].name}+${majors[1].name}`;
    const key2 = `${majors[1].name}+${majors[0].name}`;
    const combo = COMBOS[key1] ?? COMBOS[key2];
    if (combo) {
      paragraphs.push(combo);
      evidence.push(`Bộ sao ${majors[0].name} – ${majors[1].name}`);
    }
  }

  // Tứ Hóa trong bản cung
  for (const s of ofKind(p)) {
    const h = hoaOf(chart, s);
    if (h) {
      paragraphs.push(`${s.name} hóa ${h}: ${lower(HOA_INFO[h].short.replace(/^Hóa \S+: /, ''))} Điều này rơi vào lĩnh vực ${DOMAIN_LABEL[domain]}.`);
      evidence.push(`Hóa ${h} (năm sinh) trên ${s.name} tại ${p.name}`);
    }
  }

  // Cát/sát trong tam phương tứ chính
  let support = 0;
  let challenge = 0;
  const good: string[] = [];
  const bad: string[] = [];
  for (const b of [tp.self, tp.opposite, ...tp.trine]) {
    const w = b === tp.self ? 1 : 0.5;
    const pal = chart.palaces[b];
    for (const s of [...pal.goodStars]) {
      if (s.kind === 'ma') continue;
      support += w;
      good.push(`${s.name} (${relLabel(chart, b, branch)})`);
    }
    for (const s of pal.badStars) {
      challenge += w;
      bad.push(`${s.name} (${relLabel(chart, b, branch)})`);
    }
    for (const s of ofKind(pal)) {
      const h = hoaOf(chart, s);
      if (!h) continue;
      if (h === 'Kỵ') {
        challenge += w;
        if (b !== branch) bad.push(`Hóa Kỵ trên ${s.name} (${relLabel(chart, b, branch)})`);
      } else {
        support += w;
        if (b !== branch) good.push(`Hóa ${h} trên ${s.name} (${relLabel(chart, b, branch)})`);
      }
    }
    if (b === tp.self) {
      for (const s of pal.majors) {
        if (s.brightness && s.brightness.score >= 2) support += 0.5;
        if (s.brightness && s.brightness.score <= -2) challenge += 0.5;
      }
    }
  }
  if (good.length) {
    paragraphs.push(`Yếu tố hỗ trợ trong tam phương tứ chính: ${good.join(', ')}.`);
    evidence.push(`Cát tinh: ${good.join('; ')}`);
  }
  if (bad.length) {
    paragraphs.push(
      `Yếu tố thử thách: ${bad.join(', ')}. Đây là nơi dễ có áp lực hoặc va chạm — cũng là nơi tạo sức bật nếu bạn chủ động.`,
    );
    evidence.push(`Sát tinh / Hóa Kỵ: ${bad.join('; ')}`);
  }

  if (p.tuan || p.triet) {
    const which = [p.tuan && 'Tuần', p.triet && 'Triệt'].filter(Boolean).join(' và ');
    paragraphs.push(
      `Cung này có ${which}: tác động của các sao bị giảm hoặc đổi chiều${p.triet ? ' (Triệt thường rõ ở nửa đầu đời)' : ''}. Nói cách khác, cả điều thuận lẫn điều khó ở đây đều "nhẹ" hơn bề ngoài.`,
    );
    evidence.push(`${which} án ngữ ${p.branchName}`);
  }

  if (['Tràng Sinh', 'Lâm Quan', 'Đế Vượng'].includes(p.trangSinh)) {
    evidence.push(`Vòng Tràng Sinh: ${p.trangSinh} (sinh khí mạnh)`);
  } else if (['Tuyệt', 'Tử', 'Mộ', 'Bệnh'].includes(p.trangSinh)) {
    evidence.push(`Vòng Tràng Sinh: ${p.trangSinh} (sinh khí trầm)`);
  }

  if (p.isBody && p.name !== 'Mệnh') {
    paragraphs.push(
      `Cung Thân cũng nằm ở đây (Thân cư ${p.name}): lĩnh vực ${DOMAIN_LABEL[domain]} là nơi bạn có xu hướng đặt nhiều tâm sức, nhất là từ khoảng tuổi 30 trở đi.`,
    );
    evidence.push(`Thân cư ${p.name}`);
  }

  const lead = majors[0] ? MAJOR[majors[0].name] : undefined;
  const headline = majors.length
    ? `${majors.map((s) => s.name).join(' – ')}${borrowed ? ' (mượn đối cung)' : ''}: ${lead ? lower(lead.short) : ''}`
    : 'Không có chính tinh ở cả bản cung và đối cung — lĩnh vực rất linh hoạt.';

  const teaser = majors.length
    ? `Cung ${p.name} của bạn có ${majors.map((s) => s.name).join(' và ')}${borrowed ? ' (mượn từ đối cung)' : ''} — ${lead ? lower(lead.nickname) : ''}.`
    : `Cung ${p.name} của bạn vô chính diệu.`;

  return {
    branch,
    palace: p.name,
    isBody: p.isBody,
    headline,
    paragraphs,
    evidence,
    support,
    challenge,
    questions: info.questions,
    teaser,
  };
}

function hoaLanding(chart: Chart, stem: number) {
  return HOA_ORDER.map((h, i) => {
    const star = TU_HOA[stem][i];
    const pal = where(chart, star);
    return { hoa: h, star, landsIn: pal ? pal.name : '—' };
  });
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

  const overviewText: string[] = [];
  const menhMajors = menh.majors.length ? menh.majors : chart.palaces[(chart.menhBranch + 6) % 12].majors;
  if (menhMajors.length) {
    overviewText.push(
      `Trục chính của lá số là ${menhMajors.map((s) => `${s.name} (${MAJOR[s.name]?.nickname.split(' — ')[1] ?? ''})`).join(' và ')} ở cung Mệnh${menh.majors.length ? '' : ' (mượn từ Thiên Di)'}. ${MAJOR[menhMajors[0].name]?.long ?? ''}`,
    );
  }
  const hoaLines = HOA_ORDER.map((h) => {
    const pal = where(chart, chart.hoa[h]);
    return `${chart.hoa[h]} hóa ${h} tại cung ${pal?.name ?? '—'}`;
  });
  overviewText.push(`Tứ Hóa năm ${chart.canChi.year}: ${hoaLines.join('; ')}. Hóa Lộc chỉ nơi nguồn lực đổ về; Hóa Kỵ chỉ nơi bạn hay vướng bận nhất.`);
  overviewText.push(
    `Mệnh tam hợp với Tài Bạch và Quan Lộc, xung chiếu Thiên Di — bốn cung này nên đọc cùng nhau để thấy bức tranh tính cách và cách bạn làm việc, kiếm tiền.`,
  );

  // Thứ tự đọc: Mệnh, rồi theo vòng ngược chiều kim đồng hồ (Huynh Đệ, Phu Thê...)
  const order = Array.from({ length: 12 }, (_, i) => (((chart.menhBranch - i) % 12) + 12) % 12);
  const palaces = order.map((b) => readPalace(chart, b));

  const daiVan: DaiVanReading[] = chart.palaces
    .slice()
    .sort((a, b) => a.daiVan[0] - b.daiVan[0])
    .filter((p) => p.daiVan[0] <= 95)
    .map((p) => {
      const hoa = hoaLanding(chart, p.stem);
      const notes: string[] = [];
      const loc = hoa.find((x) => x.hoa === 'Lộc')!;
      const ky = hoa.find((x) => x.hoa === 'Kỵ')!;
      notes.push(`Hóa Lộc của đại vận (theo Can ${p.stemName}) rơi vào ${loc.star} tại cung ${loc.landsIn}: nguồn lực của 10 năm này dễ đổ về lĩnh vực ${DOMAIN_LABEL[PALACES[loc.landsIn]?.domain ?? 'menh']}.`);
      notes.push(`Hóa Kỵ đại vận rơi vào ${ky.star} tại cung ${ky.landsIn}: lĩnh vực ${DOMAIN_LABEL[PALACES[ky.landsIn]?.domain ?? 'menh']} cần nhiều chú tâm hơn.`);
      if (p.tuan || p.triet) notes.push(`Cung đại vận có ${[p.tuan && 'Tuần', p.triet && 'Triệt'].filter(Boolean).join(', ')}: tác động của các sao bị giảm bớt.`);
      const majors = p.majors.length ? p.majors : chart.palaces[(p.branch + 6) % 12].majors;
      return {
        branch: p.branch,
        palace: p.name,
        range: p.daiVan,
        current: age >= p.daiVan[0] && age <= p.daiVan[1],
        summary: `Đại vận đi qua cung ${p.name} (${p.branchName}) với ${majors.map((s) => s.name).join(', ') || 'không chính tinh'}${p.majors.length ? '' : ' (mượn đối cung)'}: 10 năm có chủ đề nổi bật về ${DOMAIN_LABEL[PALACES[p.name].domain]}.`,
        hoa,
        notes,
      };
    });

  const thisYear = new Date(now).getFullYear();
  const years: YearReading[] = [thisYear, thisYear + 1].map((y) => {
    const l = yearlyLuck(chart, y);
    const tt = chart.palaces[l.thaiTueBranch];
    const th = chart.palaces[l.tieuHan];
    const hoa = HOA_ORDER.map((h) => {
      const pal = where(chart, l.hoa[h]);
      return { hoa: h, star: l.hoa[h], landsIn: pal?.name ?? '—' };
    });
    const paragraphs = [
      `Năm ${l.canChi} (${y}), bạn ${l.age} tuổi mụ. Lưu Thái Tuế ở cung ${tt.name} (${CHI[l.thaiTueBranch]}): chủ đề ${DOMAIN_LABEL[PALACES[tt.name].domain]} nổi lên trong năm.`,
      `Tiểu hạn ở cung ${th.name}: góc nhìn cá nhân của năm xoay quanh ${DOMAIN_LABEL[PALACES[th.name].domain]}.`,
      `Lưu Tứ Hóa: ${hoa.map((x) => `${x.star} hóa ${x.hoa} (cung ${x.landsIn})`).join('; ')}. Nơi có lưu Hóa Lộc là nơi dễ thuận lợi; nơi có lưu Hóa Kỵ nên chuẩn bị kỹ hơn — không phải điềm xấu.`,
    ];
    if (l.daiVan) paragraphs.push(`Năm này nằm trong đại vận cung ${l.daiVan.name} (${l.daiVan.daiVan[0]}–${l.daiVan.daiVan[1]} tuổi).`);
    return { year: y, canChi: l.canChi, age: l.age, thaiTue: tt.name, tieuHan: th.name, daiVan: l.daiVan?.name, hoa, paragraphs };
  });

  return { overview, overviewText, palaces, daiVan, years, currentAge: age };
}

/** Một "mẩu" thông tin cho email teaser, theo bước trong chuỗi email. */
export function teaserFor(chart: Chart, step: number) {
  const r = buildReading(chart);
  const menh = r.palaces[0];
  const quan = r.palaces.find((p) => p.palace === 'Quan Lộc')!;
  const tai = r.palaces.find((p) => p.palace === 'Tài Bạch')!;
  const cur = r.daiVan.find((d) => d.current) ?? r.daiVan[0];
  const kyPalace = where(chart, chart.hoa['Kỵ']);
  switch (step) {
    case 1:
      return {
        topic: 'menh',
        title: `${menh.headline.split(':')[0]} ở cung Mệnh của bạn nghĩa là gì?`,
        reveal: menh.paragraphs.slice(0, 2),
        locked: `Còn ${Math.max(0, menh.paragraphs.length - 2)} nhận định và bảng dẫn chứng chi tiết cho cung Mệnh, cùng 11 cung còn lại.`,
      };
    case 2:
      return {
        topic: 'quan',
        title: `Cung Quan Lộc: ${quan.teaser}`,
        reveal: quan.paragraphs.slice(0, 1),
        locked: `Phân tích đầy đủ cung Quan Lộc và Tài Bạch (${tai.teaser.toLowerCase()}) nằm trong bản Pro.`,
      };
    case 3:
      return {
        topic: 'daivan',
        title: `Bạn đang ở đại vận ${cur.range[0]}–${cur.range[1]} tuổi (cung ${cur.palace})`,
        reveal: [cur.summary],
        locked: `Tứ Hóa của đại vận này rơi vào đâu, và ${kyPalace ? `vì sao cung ${kyPalace.name} (nơi có Hóa Kỵ năm sinh)` : 'những cung nào'} cần để ý — có trong bản Pro.`,
      };
    default:
      return {
        topic: 'offer',
        title: `Năm ${r.years[0].canChi} với lá số của bạn`,
        reveal: r.years[0].paragraphs.slice(0, 1),
        locked: 'Bản Pro: 12 cung đầy đủ dẫn chứng, toàn bộ đại vận, lưu niên 2 năm, bản in PDF.',
      };
  }
}

/** Cắt bản đọc cho gói Free: đầy đủ tổng quan + cung Mệnh; các cung khác chỉ còn tiêu đề. */
export function toFree(r: Reading): Reading & { palaces: (PalaceReading & { locked?: boolean })[] } {
  return {
    ...r,
    palaces: r.palaces.map((p, i) =>
      i === 0 ? p : { ...p, paragraphs: [], evidence: [], support: 0, challenge: 0, locked: true },
    ),
    daiVan: r.daiVan.map((d) => ({ ...d, hoa: [], notes: [] })),
    years: r.years.slice(0, 1).map((y) => ({ ...y, hoa: [], paragraphs: y.paragraphs.slice(0, 1) })),
  };
}

/** Mô tả ngắn phụ tinh cho tooltip. */
export function minorShort(name: string): string | undefined {
  return MINOR[name]?.short;
}
