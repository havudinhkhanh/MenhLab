/**
 * "Bản luận giải trọn đời" viết bằng AI — chia thành nhiều phần, mỗi phần một lần gọi.
 *
 * Nguyên tắc chống "bịa":
 * 1. Mỗi lần gọi chỉ đưa đúng dữ kiện cần cho phần đó (đã tính sẵn bằng máy an sao của MệnhLab),
 *    kèm nghĩa của từng sao theo từ điển MệnhLab — AI diễn đạt, không tự luận ra quy tắc mới.
 * 2. Văn bản trả về đi qua bộ kiểm tra: không nhắc sao không có trên lá số, không dùng từ hù dọa,
 *    không phán bệnh, không thuật ngữ tiếng Anh, đủ độ dài. Sai thì viết lại một lần kèm lời nhắc lỗi.
 */
import { tamPhuong, type Chart, type Palace, type Star } from './engine/chart';
import { CAN } from './engine/canchi';
import { STAR_VI } from './engine/names';
import type { Reading } from './reading';
import type { LifeReport } from './lifeReport';
import { netPercentile } from './lifeReport';
import { PALACES } from '@/content/palaces';
import { MAJOR, MINOR } from '@/content/stars';
import { BRIGHT_STORY, HOA_STORY, MINOR_STORY, STAR_STORY } from '@/content/story';
import { DOMAIN_SIGNS, STAR_GUARD } from '@/content/report';
import { STAR_BODY, BAD_STAR_HEALTH } from '@/content/plain';
import { RATES, fmtPct, rate } from '@/data/rates';
import { comboKey } from '@/content/blind';

export interface AiSectionMeta {
  key: string;
  title: string;
  /** Nhóm để hiển thị mục lục. */
  part: string;
  palace?: string;
  words: [number, number];
  maxTokens: number;
}

/** Thứ tự 12 cung theo mức người đọc quan tâm. */
const PALACE_ORDER: [string, string][] = [
  ['Mệnh', 'Con người bạn'],
  ['Tài Bạch', 'Tài chính và cách kiếm tiền'],
  ['Quan Lộc', 'Sự nghiệp và con đường công danh'],
  ['Phu Thê', 'Tình duyên và hôn nhân'],
  ['Tử Tức', 'Con cái và những gì bạn nuôi dưỡng'],
  ['Phụ Mẫu', 'Cha mẹ, cấp trên và gia đình gốc'],
  ['Điền Trạch', 'Nhà cửa và tài sản'],
  ['Phúc Đức', 'Đời sống tinh thần'],
  ['Tật Ách', 'Sức khỏe và nhịp sống'],
  ['Thiên Di', 'Ra ngoài xã hội và cơ hội bên ngoài'],
  ['Nô Bộc', 'Bạn bè, đồng nghiệp, khách hàng'],
  ['Huynh Đệ', 'Anh chị em và người cộng sự'],
];

export const palaceKey = (name: string) =>
  'cung-' +
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, '-');

export const AI_SECTIONS: AiSectionMeta[] = [
  { key: 'mo-dau', part: 'Phần 1. Mở đầu', title: 'Mở đầu và nền tảng lá số', words: [450, 650], maxTokens: 3000 },
  ...PALACE_ORDER.map(([p, t]) => ({
    key: palaceKey(p),
    part: 'Phần 2. Mười hai khía cạnh cuộc đời',
    title: `${t} (cung ${p})`,
    palace: p,
    words: [p === 'Mệnh' || p === 'Tài Bạch' || p === 'Quan Lộc' || p === 'Phu Thê' ? 520 : 420, 700] as [number, number],
    maxTokens: 3500,
  })),
  { key: 'lien-cung', part: 'Phần 3. Bức tranh toàn cảnh', title: 'Bốn trục liên cung', words: [800, 1150], maxTokens: 5000 },
  { key: 'giai-doan', part: 'Phần 4. Các giai đoạn cuộc đời', title: 'Chặng vừa qua, hiện tại, sắp tới và sau nữa', words: [1000, 1500], maxTokens: 6000 },
  { key: 'nam-nay', part: 'Phần 5. Năm nay', title: 'Tổng quan năm và bốn khía cạnh', words: [700, 1000], maxTokens: 4500 },
  { key: 'tung-thang', part: 'Phần 5. Năm nay', title: 'Từng tháng âm lịch: nên làm gì, nên tránh gì', words: [600, 950], maxTokens: 4500 },
  { key: 'tong-ket', part: 'Phần 6. Tổng kết', title: 'Ba đòn bẩy, ba điểm mù, thứ tự hành động', words: [800, 1150], maxTokens: 5000 },
  { key: 'dac-biet', part: 'Phần 7. Điều đặc biệt và lời nhắn', title: 'Ba điều đặc biệt nhất và lời nhắn', words: [550, 850], maxTokens: 4000 },
];

/* ----------------------------- Xưng hô ----------------------------- */

/** "chị Ánh", "anh Minh", hoặc "bạn". */
export function addressOf(chart: Chart, age: number): { short: string; full: string } {
  const name = (chart.name ?? '').trim().replace(/\s+/g, ' ');
  if (!name || age < 18) return { short: 'bạn', full: name || 'bạn' };
  const parts = name.split(' ');
  const given = parts[parts.length - 1];
  const pron = chart.gender === 'nam' ? 'anh' : 'chị';
  return { short: `${pron} ${given}`, full: `${pron} ${name}` };
}

/* ----------------------------- Dữ kiện ----------------------------- */

function starLine(chart: Chart, s: Star): string {
  const hoa = (Object.entries(chart.hoa).find(([, n]) => n === s.name)?.[0] as string | undefined) ?? s.hoa;
  return `${s.name}${s.brightness ? ` (${s.brightness.name})` : ''}${hoa ? ` mang Hóa ${hoa} năm sinh` : ''}`;
}

function meaning(name: string): string | undefined {
  const st = STAR_STORY[name];
  if (st) return `${st.role}; ${MAJOR[name]?.short ?? ''}`;
  const ms = MINOR_STORY[name];
  if (ms) return `${ms.role}: ${ms.adds}`;
  return MINOR[name]?.short;
}

function palaceFacts(chart: Chart, rd: Reading, p: Palace, depth: 'full' | 'brief'): Record<string, unknown> {
  const r = rd.palaces.find((x) => x.branch === p.branch)!;
  const tp = tamPhuong(p.branch);
  const base = {
    cung: p.name,
    o: `${CAN[p.stem]} ${p.branchName}`,
    sao_chinh: p.majors.length ? p.majors.map((s) => starLine(chart, s)) : ['(không có — vô chính diệu, mượn sao cung đối diện)'],
    sao_tot: p.goodStars.map((s) => starLine(chart, s)),
    sao_kho: p.badStars.map((s) => starLine(chart, s)),
  };
  if (depth === 'brief') return { ...base, cau_tra_loi_ngan: r.story.lead };
  const pct = netPercentile(p.name, r.support - r.challenge);
  return {
    ...base,
    sao_phu_khac: p.others.map((s) => s.name),
    vong_bac_si: p.bacSi,
    vong_thai_tue: p.thaiTue,
    vong_trang_sinh: p.trangSinh,
    tuan_triet: [p.tuan && 'Tuần', p.triet && 'Triệt'].filter(Boolean),
    la_cung_than: p.isBody,
    dai_van_tuoi: p.daiVan,
    diem: { ho_tro: r.support, gay_kho: r.challenge, cach_tinh: 'sao trong cung 1 điểm, ở cung đối diện và 2 cung tam hợp 0,5 điểm' },
    ...(pct !== undefined ? { phan_vi_so_voi_24000_la_so: `${Math.round(pct * 100)}%` } : {}),
    cung_doi_dien: palaceFacts(chart, rd, chart.palaces[tp.opposite], 'brief'),
    tam_hop: tp.trine.map((b) => palaceFacts(chart, rd, chart.palaces[b], 'brief')),
    nhan_dinh_theo_quy_tac_menhlab: {
      cau_tra_loi_ngan: r.story.lead,
      dien_giai: r.story.paras,
      sao_di_kem: r.story.extras.map((e) => e.text),
      ket_luan: r.story.verdict,
      nen_lam: r.advice,
      dau_hieu: r.story.drift,
      nguyen_tac: r.story.rule,
    },
  };
}

/** Từ điển nghĩa sao: chỉ những sao có trên lá số, theo cách giải thích của MệnhLab. */
function glossaryFor(chart: Chart) {
  const out: Record<string, string> = {};
  for (const p of chart.palaces) {
    for (const s of [...p.majors, ...p.goodStars, ...p.badStars, ...p.others]) {
      const m = meaning(s.name);
      if (m && !out[s.name]) out[s.name] = m;
    }
  }
  out['Hóa Lộc'] = `${HOA_STORY.Lộc.role}: ${HOA_STORY.Lộc.adds}`;
  out['Hóa Quyền'] = `${HOA_STORY.Quyền.role}: ${HOA_STORY.Quyền.adds}`;
  out['Hóa Khoa'] = `${HOA_STORY.Khoa.role}: ${HOA_STORY.Khoa.adds}`;
  out['Hóa Kỵ'] = `${HOA_STORY.Kỵ.role}: ${HOA_STORY.Kỵ.adds}`;
  out['Tuần, Triệt'] = 'hai "tấm chắn" đặt giữa hai cung: cả cái tốt lẫn cái khó ở cung bị chắn đều nhẹ bớt, kết quả thường đến chậm hơn mong đợi (Triệt rõ nhất trước khoảng 30 tuổi)';
  out['Độ sáng'] = Object.entries(BRIGHT_STORY)
    .map(([k, v]) => `${k}: ${v}`)
    .join(' | ');
  return out;
}

function coreFacts(chart: Chart, rd: Reading, age: number, stability: string) {
  const menh = chart.palaces[chart.menhBranch];
  const than = chart.palaces[chart.thanBranch];
  const cur = rd.daiVan.find((d) => d.current);
  return {
    xung_ho: addressOf(chart, age),
    gioi_tinh: chart.gender === 'nam' ? 'Nam' : 'Nữ',
    tuoi_am_hien_tai: age,
    sinh: {
      duong_lich: `${chart.birth.solar.day}/${chart.birth.solar.month}/${chart.birth.solar.year}`,
      am_lich: `${chart.birth.lunar.day}/${chart.birth.lunar.month}${chart.birth.lunar.leap ? ' nhuận' : ''} năm ${chart.canChi.year}`,
      gio: chart.canChi.hour,
    },
    am_duong: `${chart.amDuong}, ${chart.amDuongLy}`,
    ban_menh: chart.banMenh.name,
    cuc: chart.cuc.name,
    menh_cuc: { sinh: 'Cục sinh Mệnh', 'được sinh': 'Mệnh sinh Cục', khắc: 'Cục khắc Mệnh', 'bị khắc': 'Mệnh khắc Cục', hòa: 'Cục hòa Mệnh (cùng hành)' }[chart.menhCuc],
    cung_menh: `${menh.branchName}: ${menh.majors.map((s) => starLine(chart, s)).join(', ') || 'vô chính diệu'}`,
    cung_than: than.name,
    tu_hoa_nam_sinh: Object.fromEntries(
      Object.entries(chart.hoa).map(([h, s]) => [h, `${s} ở cung ${chart.palaces.find((p) => [...p.majors, ...p.goodStars, ...p.badStars, ...p.others].some((x) => x.name === s))?.name ?? '—'}`]),
    ),
    tuan: chart.tuan.map((b) => chart.palaces[b].name),
    triet: chart.triet.map((b) => chart.palaces[b].name),
    dai_van_hien_tai: cur ? `${cur.range[0]}–${cur.range[1]} tuổi, cung ${cur.palace}` : undefined,
    do_on_dinh_gio_sinh: stability,
  };
}

/** Tất cả dữ kiện cần cho một phần. */
export function sectionFacts(
  key: string,
  ctx: { chart: Chart; reading: Reading; life: LifeReport; stability: string; patterns: { name: string; status: string; tone: string }[] },
) {
  const { chart, reading: rd, life } = ctx;
  const age = rd.currentAge;
  const core = coreFacts(chart, rd, age, ctx.stability);
  const sec = AI_SECTIONS.find((s) => s.key === key);
  if (!sec) throw new Error('Phần không tồn tại');
  const glossary = glossaryFor(chart);

  if (sec.palace) {
    const p = chart.palaces.find((x) => x.name === sec.palace)!;
    const lead = (p.majors.length ? p.majors : chart.palaces[(p.branch + 6) % 12].majors)[0];
    const st = lead ? STAR_STORY[lead.name] : undefined;
    const dom = PALACES[p.name].domain;
    return {
      ...core,
      phan: sec.title,
      cung_dang_doc: palaceFacts(chart, rd, p, 'full'),
      sao_chu_dao: lead
        ? {
            ten: lead.name,
            ban_chat: st?.essence,
            hinh_anh: st?.image,
            khi_sang: st?.bright,
            khi_toi: st?.dim,
            ...(dom === 'quan' ? { cong_viec: st?.work } : {}),
            ...(dom === 'tai' ? { tien_bac: st?.money } : {}),
            ...(dom === 'phuthe' ? { tinh_cam: st?.love } : {}),
            ...(dom === 'menh' ? { bieu_hien: st?.daily, nguoi_khac_thay: st?.seen } : {}),
            ...(dom === 'tat' ? { co_the_theo_sach: STAR_BODY[lead.name] } : {}),
            ...(STAR_GUARD[lead.name] ? { dau_hieu_lech: STAR_GUARD[lead.name].drift, nguyen_tac: STAR_GUARD[lead.name].rule } : {}),
          }
        : undefined,
      dau_hieu_linh_vuc: DOMAIN_SIGNS[p.name],
      ...(dom === 'tat' ? { sat_tinh_va_suc_khoe_theo_sach: BAD_STAR_HEALTH } : {}),
      nghia_sao: glossary,
    };
  }

  const palacesBrief = rd.palaces.map((r) => ({
    cung: r.palace,
    tra_loi_ngan: r.story.lead,
    ho_tro: r.support,
    gay_kho: r.challenge,
    sao_chinh: (chart.palaces[r.branch].majors.length ? chart.palaces[r.branch].majors : []).map((s) => starLine(chart, s)),
  }));

  switch (key) {
    case 'mo-dau':
      return {
        ...core,
        chan_dung_theo_quy_tac: life.portrait,
        nen_tang_theo_quy_tac: life.foundation,
        cach_cuc: ctx.patterns,
        ty_le_nen_cung_menh: (() => {
          const r = rate(RATES.menhCombo[comboKeyOf(chart)]);
          return r !== undefined ? `${fmtPct(r)} số người có cung Mệnh với bộ sao này` : undefined;
        })(),
        tom_tat_12_cung: palacesBrief,
        nghia_sao: glossary,
      };
    case 'lien-cung':
      return { ...core, truc_lien_cung_theo_quy_tac: life.axes, tom_tat_12_cung: palacesBrief, nghia_sao: glossary };
    case 'giai-doan':
      return {
        ...core,
        giai_doan_theo_quy_tac: life.stages,
        cac_chang_10_nam: rd.daiVan.map((d) => ({ tuoi: d.range, cung: d.palace, hien_tai: d.current, tom_tat: d.summary, ghi_chu: d.notes, tu_hoa_chang: d.hoa })),
        tom_tat_12_cung: palacesBrief,
        nghia_sao: glossary,
      };
    case 'nam-nay': {
      const y = rd.years[0];
      return {
        ...core,
        nam: { nam: y.year, can_chi: y.canChi, tuoi_am: y.age, thai_tue: y.thaiTue, tieu_han: y.tieuHan, dai_van: y.daiVan, tu_hoa_luu_nien: y.hoa },
        dien_giai_theo_quy_tac: { tom_tat: y.summary, vi_sao: y.story, tien: y.money, cong_viec: y.work, tinh_cam: y.love, gia_dinh: y.family, suc_khoe: y.health, viec_nen_lam: y.actions, can_cu: y.evidence },
        tom_tat_12_cung: palacesBrief,
        nghia_sao: glossary,
      };
    }
    case 'tung-thang': {
      const y = rd.years[0];
      return {
        ...core,
        nam: `${y.canChi} (${y.year})`,
        nhip_ca_nam: y.monthHighlights,
        thang: y.months.map((m) => ({
          thang: m.label,
          duong_lich: `${m.from} – ${m.to}`,
          can_chi: m.canChi,
          cung: m.palace,
          nhip: { thuan: 'Thuận', binh: 'Bình thường', 'can-trong': 'Làm chắc' }[m.tone],
          diem: m.score,
          da_qua: !!m.past,
          thang_hien_tai: !!m.current,
          nen_lam: m.todo,
          nen_tranh: m.avoid,
          tien: m.money,
          can_cu: m.evidence,
        })),
      };
    }
    case 'tong-ket':
      return { ...core, don_bay: life.levers, diem_mu: life.blinds, thu_tu: life.order, tom_tat_12_cung: palacesBrief, nghia_sao: glossary };
    case 'dac-biet':
      return { ...core, dac_biet_co_so_lieu: life.specials, thu_theo_quy_tac: life.letter, tom_tat_12_cung: palacesBrief };
  }
  return core;
}

function comboKeyOf(chart: Chart) {
  const menh = chart.palaces[chart.menhBranch];
  return menh.majors.length
    ? comboKey(menh.majors.map((s) => s.name), false)
    : comboKey(chart.palaces[(chart.menhBranch + 6) % 12].majors.map((s) => s.name), true);
}

/* ----------------------------- Lời nhắc ----------------------------- */

export const REPORT_SYSTEM = `Bạn là người viết "Bản luận giải trọn đời" cho MệnhLab — dịch vụ Tử Vi theo hướng minh bạch, tỉnh táo, nâng cao hiểu biết. Người đọc là người bình thường, không biết thuật ngữ.

GIỌNG VĂN
- Văn xuôi liền mạch, ấm áp, sắc sảo, như một người hiểu chuyện ngồi nói chuyện riêng. Xưng hô theo trường "xung_ho" trong dữ liệu (ví dụ "chị Ánh"); gọi tên đầy đủ tối đa một lần mỗi phần, còn lại dùng "chị"/"anh"/"bạn".
- Mỗi ý đi theo chuỗi: nhận định → vì sao (căn cứ trên lá số) → ngoài đời trông ra sao (ví dụ cụ thể, tình huống quen thuộc) → nên làm gì.
- Dẫn căn cứ ngắn trong ngoặc ngay sau nhận định, ví dụ: (Thiên Phủ ở Mệnh), (Hóa Lộc năm sinh ở Thiên Di).
- Lần đầu dùng một thuật ngữ thì giải thích bằng lời thường ngay trong câu, ví dụ: "Tuần — một 'tấm chắn' làm mọi thứ chậm và nhẹ đi".
- Câu vừa phải, rõ chủ ngữ. Không sáo rỗng ("vũ trụ trao cho", "định mệnh an bài", "mã gien").

CĂN CỨ — BẮT BUỘC
- Chỉ dùng sao, vị trí, độ sáng, Tứ Hóa, số liệu có trong dữ liệu được đưa. Không nhắc tới sao không có trong dữ liệu. Không tự đổi độ sáng hay vị trí sao.
- Nghĩa của sao lấy theo trường "nghia_sao" và các nhận định có sẵn; được diễn đạt lại sinh động hơn, được liên hệ giữa các cung, nhưng không đảo nghĩa.
- Số liệu (phần trăm, độ hiếm) chỉ dùng khi có trong dữ liệu.

AN TOÀN
- Ngôn ngữ xu hướng: "thiên hướng", "dễ", "thường", "có thể". Không bao giờ: "chắc chắn", "định mệnh", "số phải".
- Không dự đoán bệnh cụ thể, tai nạn, chuyện sống chết, ly hôn, phá sản, mất việc. Về sức khỏe chỉ nói "sách Tử Vi gắn sao X với vùng Y" như lời nhắc, kèm thói quen nên giữ và khuyên khám định kỳ.
- Không khuyên mua bán chứng khoán, tài sản cụ thể; không đưa con số vay nợ, phân bổ đầu tư cụ thể; nếu cần, khuyên hỏi chuyên gia.
- Không cúng giải, không "năm hạn", không phong thủy hóa giải.
- Mỗi điểm khó phải đi kèm một hướng xử lý tích cực, cụ thể.

TRÌNH BÀY
- Chỉ văn bản thuần. Đoạn cách nhau một dòng trống. Không in đậm, không bảng, không emoji, không tiếng Anh (không "net effect", "insight", "mindset"...), không ký hiệu kiểu (A), (B), (C), không viết tắt VCD.
- Chỉ dùng tiêu đề phụ (dòng bắt đầu bằng "### ") hoặc gạch đầu dòng ("- ") khi phần yêu cầu nói rõ.
- Không mở đầu bằng lời chào, không nhắc lại tên phần, không kết bằng câu hỏi "chị có muốn…".`;

function brief(key: string, words: [number, number], addr: string): string {
  const W = `Độ dài: ${words[0]}–${words[1]} chữ.`;
  const sec = AI_SECTIONS.find((s) => s.key === key)!;
  if (sec.palace) {
    const extra =
      sec.palace === 'Tật Ách'
        ? ' Ở phần này tuyệt đối không phán bệnh: chỉ nói vùng cơ thể sách gắn với sao như lời nhắc, nhịp sinh hoạt, cách chịu áp lực, và khuyên khám định kỳ.'
        : ['Phu Thê', 'Tử Tức', 'Phụ Mẫu', 'Huynh Đệ', 'Nô Bộc'].includes(sec.palace)
          ? ' Lưu ý: sao ở cung này vừa nói về cách người xem cư xử trong quan hệ, vừa phác họa người ở phía bên kia — viết cân bằng, không phán xét người thân của họ.'
          : '';
    return `Viết phần "${sec.title}" cho ${addr}. ${W}
Gồm đúng 5 đoạn, không tiêu đề phụ:
1. Ấn tượng ngoài đời: lĩnh vực này của ${addr} trông thế nào trong đời thực — chưa nêu tên sao.
2. Sao chính và độ sáng: sao gì, nghĩa là gì, sáng hay tối ảnh hưởng thế nào; nếu cung không có sao chính thì giải thích cách mượn sao cung đối diện.
3. Các sao đi kèm: chọn 3–5 sao đáng kể nhất (cả hỗ trợ lẫn gây khó), giải nghĩa từng sao trong đúng ngữ cảnh lĩnh vực này; kết lại bằng một câu cân đối thuận – khó dựa trên điểm hỗ trợ/gây khó.
4. Liên hệ cung khác: cung đối diện và hai cung tam hợp tác động thế nào; mô thức thường gặp ngoài đời. Nếu là cung Thân hoặc có Tuần/Triệt thì nói rõ ý nghĩa.
5. Hành động: một nguyên tắc nên giữ (đặt trong ngoặc kép), một dấu hiệu sớm cho thấy đang lệch hướng, và một ngưỡng hành động cụ thể (khi nào thì dừng, đổi, hoặc nhờ người khác).
Sau 5 đoạn, thêm một dòng bắt đầu bằng "Tự kiểm chứng:" với 2 câu hỏi để ${addr} đối chiếu với đời thực.${extra}`;
  }
  switch (key) {
    case 'mo-dau':
      return `Viết "Mở đầu và nền tảng lá số" cho ${addr}. ${W}
### Chân dung
Hai đoạn: bức chân dung tổng thể — bề ngoài và bên trong khác nhau thế nào, năng lực bẩm sinh, điểm dễ lệch nhịp, hướng phát triển lớn nhất của đời. Dựa vào cung Mệnh, cung Thân, Tứ Hóa năm sinh và tóm tắt 12 cung.
### Nền tảng lá số
Hai đoạn: giải thích bằng lời thường Âm Dương, quan hệ Mệnh – Cục, Bản mệnh, cung Thân nằm ở đâu và ý nghĩa sau khoảng 30 tuổi; cách cục nếu có (nói rõ đủ hay gần đủ, sách xếp thế nào). Nói rõ đây là chỉ dấu phụ, phần chính nằm ở các sao trong 12 cung.
Cuối phần, thêm một câu nhắc nhẹ: Tử Vi là hệ thống văn hóa để tự suy ngẫm, chưa được khoa học chứng minh khả năng dự đoán.
Dùng đúng hai tiêu đề phụ trên (dòng bắt đầu "### ").`;
    case 'lien-cung':
      return `Viết "Bức tranh toàn cảnh" cho ${addr}: các cung không đứng riêng mà tạo thành trục. ${W}
Mở bằng một đoạn ngắn. Sau đó 4 trục, mỗi trục một tiêu đề phụ "### " đặt tên dễ nhớ (ví dụ "Tam giác tạo ra giá trị: Mệnh – Quan Lộc – Tài Bạch"), mỗi trục 2 đoạn: đoạn 1 giải thích cơ chế liên kết bằng căn cứ; đoạn 2 bắt đầu bằng "Quyết định nên làm:" và nêu hành động cụ thể. Bám theo 4 trục trong dữ liệu.`;
    case 'giai-doan':
      return `Viết "Các giai đoạn cuộc đời" cho ${addr}. ${W}
Mở bằng một đoạn giải thích chặng 10 năm (đại vận) là gì bằng lời thường. Sau đó 4 tiêu đề phụ "### ":
### Chặng vừa qua (ghi độ tuổi) — 2 đoạn kể lại chặng đó để người đọc đối chiếu, kết bằng câu: "Nếu những nét trên khớp với chặng đường đã qua, phần dưới đáng để đọc chậm; nếu không khớp, có thể giờ sinh chưa chính xác."
### Chặng hiện tại (ghi độ tuổi) — viết kỹ nhất: một đoạn tổng quan rồi 4 đoạn bắt đầu lần lượt bằng "Sự nghiệp:", "Tài chính:", "Tình cảm và gia đình:", "Sức khỏe và nhịp sống:"; mỗi đoạn có cơ chế, dấu hiệu sớm, cách ứng xử.
### Chặng sắp tới (ghi độ tuổi) — 2 đoạn: khác chặng hiện tại ở đâu và cần chuẩn bị gì từ bây giờ.
### Chặng sau nữa (ghi độ tuổi) — 1 đoạn.
Bỏ chặng nào không có trong dữ liệu.`;
    case 'nam-nay':
      return `Viết "Năm nay" cho ${addr}. ${W}
### Tổng quan năm — 2 đoạn: tuổi âm, Thái Tuế và Tiểu hạn rơi vào đâu, quan hệ với chặng 10 năm hiện tại.
### Bốn sao đổi màu của năm — 4 gạch đầu dòng (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ): sao nào, rơi vào cung nào, ngoài đời nghĩa là gì.
### Bốn khía cạnh — 4 đoạn bắt đầu bằng "Sự nghiệp năm nay (…):", "Tài chính năm nay (…):", "Tình cảm và gia đình (…):", "Sức khỏe (…):" — trong ngoặc là một nhãn ngắn như "thuận lợi", "cần làm chắc", "bình ổn". Mỗi đoạn có căn cứ, dấu hiệu sớm và việc nên làm.
### Năm việc nên làm — 5 gạch đầu dòng, mỗi dòng mở bằng nhãn trong ngoặc: (Cơ hội ưu tiên), (Nguyên tắc ra quyết định), (Dấu hiệu sớm cần theo dõi), (Giới hạn bảo vệ), (Việc nên hoãn).`;
    case 'tung-thang':
      return `Viết "Từng tháng âm lịch" cho ${addr}. ${W}
Mở bằng một đoạn: tháng nào thuận, tháng nào nên làm chắc (theo trường nhip_ca_nam), và nhắc đây là gợi ý sắp xếp việc, không phải lịch định sẵn.
Sau đó mỗi tháng một gạch đầu dòng, theo đúng thứ tự trong dữ liệu, dạng: "- Tháng … (ngày dương lịch, cung …, nhịp …): chiều hướng … Nên làm: … Nên tránh: …". Tháng đã qua thì viết ngắn và thêm "(đã qua — đối chiếu xem có khớp không)". Tháng hiện tại viết kỹ nhất. Chỉ dùng nội dung nen_lam, nen_tranh, can_cu của từng tháng, diễn đạt lại cho tự nhiên.`;
    case 'tong-ket':
      return `Viết "Tổng kết" cho ${addr}. ${W}
### Ba đòn bẩy nên dựa vào — mỗi đòn bẩy một đoạn mở bằng tên đòn bẩy và dấu hai chấm, trong đoạn lần lượt có: thế mạnh, điều kiện để phát huy, việc làm đầu tiên, dấu hiệu cho thấy đang đi đúng.
### Ba điểm mù cần canh — mỗi điểm một đoạn mở bằng tên và dấu hai chấm, có: khi nào dễ xảy ra, phản ứng thường gặp, hệ quả, dấu hiệu sớm, cách xử lý.
### Thứ tự hành động — 3 gạch đầu dòng mở bằng "Làm trước:", "Làm tiếp:", "Chưa nên làm:".
Bám theo dữ liệu don_bay, diem_mu, thu_tu.`;
    case 'dac-biet':
      return `Viết phần cuối cho ${addr}. ${W}
### Ba điều đặc biệt nhất trong lá số — mỗi điều một đoạn mở bằng tên và dấu hai chấm; nêu độ hiếm bằng số liệu có trong dữ liệu (ví dụ "chỉ khoảng x% lá số có…"), biểu hiện ngoài đời và cách phát huy. Không nói "độc bản", "duy nhất".
### Lời nhắn
Một lá thư ngắn 3 đoạn gửi riêng ${addr}, mở bằng "${addr.charAt(0).toUpperCase() + addr.slice(1)} thân mến,". Ấm áp, cụ thể, nhắc lại 1–2 điểm mạnh và 1 lời nhắc quan trọng nhất; kết bằng một câu khích lệ tự viết (không trích danh ngôn). Câu cuối nhắc: lá số là tấm gương để suy ngẫm, quyết định luôn nằm trong tay người đọc.`;
  }
  return W;
}

export function buildMessages(key: string, facts: unknown, addr: string, feedback?: string) {
  const sec = AI_SECTIONS.find((s) => s.key === key)!;
  const content = `Dữ liệu lá số (JSON, đã được máy an sao MệnhLab tính sẵn):\n${JSON.stringify(facts)}\n\n${brief(key, sec.words, addr)}${
    feedback ? `\n\nBản viết trước chưa đạt vì: ${feedback}. Hãy viết lại toàn bộ phần này, sửa đúng các lỗi đó.` : ''
  }`;
  return [{ role: 'user' as const, content }];
}

/* ----------------------------- Kiểm tra ----------------------------- */

const BANNED = /chắc chắn sẽ|định mệnh an bài|tử vong|qua đời|\bchết\b|ly hôn|ly dị|phá sản|tai nạn|tai họa|bệnh nặng|ung thư|đột quỵ|tai ương|cúng giải|giải hạn|năm hạn|net effect|mindset|insight|out of the box|\bVCD\b|\((A|B|C)\)/i;
const ALL_STARS = [...new Set([...Object.values(STAR_VI), ...Object.keys(MINOR), ...Object.keys(MAJOR)])].filter((n) => n.includes(' ')).sort((a, b) => b.length - a.length);

export function chartStarSet(chart: Chart): Set<string> {
  const set = new Set<string>();
  for (const p of chart.palaces) for (const s of [...p.majors, ...p.goodStars, ...p.badStars, ...p.others]) set.add(s.name);
  for (const p of chart.palaces) {
    set.add(p.trangSinh);
    set.add(p.bacSi);
    set.add(p.thaiTue);
  }
  return set;
}

export interface Check {
  ok: boolean;
  issues: string[];
  words: number;
}

/** Kiểm tra một phần do AI viết. */
export function checkSection(key: string, text: string, chart: Chart): Check {
  const sec = AI_SECTIONS.find((s) => s.key === key)!;
  const issues: string[] = [];
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words < sec.words[0] * 0.75) issues.push(`quá ngắn (${words} chữ, cần ít nhất ${sec.words[0]})`);
  if (words > sec.words[1] * 1.5) issues.push(`quá dài (${words} chữ)`);
  const m = text.match(BANNED);
  if (m) issues.push(`dùng từ không được phép: "${m[0]}"`);
  if (/\*\*|^\s*\|.*\|\s*$/m.test(text)) issues.push('dùng in đậm hoặc bảng');
  const have = chartStarSet(chart);
  const stripped = text.replace(/Lưu |lưu /g, '');
  const missing = new Set<string>();
  let scan = stripped;
  for (const n of ALL_STARS) {
    if (!scan.includes(n)) continue;
    if (!have.has(n)) missing.add(n);
    scan = scan.split(n).join(' ');
  }
  // Tên Tứ Hóa và vòng Tràng Sinh không phải "sao" cần kiểm.
  for (const ok of ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ', 'Tràng Sinh', 'Thái Tuế']) missing.delete(ok);
  if (missing.size) issues.push(`nhắc tới sao không có trên lá số này: ${[...missing].join(', ')}`);
  issues.push(...factIssues(text, chart));
  return { ok: issues.length === 0, issues, words };
}

const PALACE_NAMES = ['Mệnh', 'Huynh Đệ', 'Phu Thê', 'Tử Tức', 'Tài Bạch', 'Tật Ách', 'Thiên Di', 'Nô Bộc', 'Quan Lộc', 'Điền Trạch', 'Phúc Đức', 'Phụ Mẫu'];
const BRIGHT_WORDS: Record<string, string> = { miếu: 'Miếu', vượng: 'Vượng', đắc: 'Đắc', lợi: 'Lợi', bình: 'Bình', hãm: 'Hãm' };

function locate(chart: Chart, star: string): Palace[] {
  return chart.palaces.filter((p) => [...p.majors, ...p.goodStars, ...p.badStars, ...p.others].some((s) => s.name === star));
}

/**
 * Kiểm tra sự thật: "Sao X ở/tại cung Y" phải đúng vị trí trên lá số gốc; "Sao X (Hãm)" / "X hãm địa" phải đúng độ sáng.
 * Bỏ qua các câu nói về sao lưu (lưu Kình Dương, lưu Thái Tuế…) vì sao lưu nằm ở chỗ khác lá số gốc.
 */
export function factIssues(text: string, chart: Chart): string[] {
  const out = new Set<string>();
  const stars = [...new Set(chart.palaces.flatMap((p) => [...p.majors, ...p.goodStars, ...p.badStars].map((s) => s.name)))];
  const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pal = PALACE_NAMES.map(esc).join('|');
  for (const star of stars) {
    const re = new RegExp(`(lưu\\s+|Lưu\\s+)?${esc(star)}(?:\\s*\\([^)]{0,30}\\))?\\s+(?:ở|tại|tọa thủ tại|tọa tại|tọa thủ|tọa|nằm ở|nằm tại|đóng ở|đóng tại|cư)\\s+(?:cung\\s+|ngay\\s+(?:tại\\s+)?(?:cung\\s+)?)?(${pal})(?![\\p{L}])`, 'gu');
    for (const m of text.matchAll(re)) {
      if (m[1]) continue;
      const before = text.slice(Math.max(0, (m.index ?? 0) - 40), m.index ?? 0);
      if (/(lưu|năm nay|năm \d{4}|tháng|đại vận|chặng|của năm|của tháng|của chặng|hóa|Hóa)\s*[^.]{0,25}$/i.test(before) && !/năm sinh/.test(before)) continue;
      const where = locate(chart, star).map((p) => p.name);
      if (!where.includes(m[2])) out.add(`viết "${star} ở ${m[2]}" nhưng trên lá số ${star} nằm ở ${where.join(', ') || 'không có'}`);
    }
    const reB = new RegExp(`${esc(star)}\\s*(?:\\(\\s*(Miếu|Vượng|Đắc|Lợi|Bình|Hãm)[^)]{0,12}\\)|\\s(miếu|vượng|đắc|hãm)\\s+địa)`, 'gu');
    for (const m of text.matchAll(reB)) {
      const said = m[1] ?? BRIGHT_WORDS[m[2]];
      const actual = locate(chart, star)
        .flatMap((p) => [...p.majors, ...p.goodStars, ...p.badStars])
        .find((s) => s.name === star)?.brightness?.name;
      if (actual && said && !actual.startsWith(said)) out.add(`viết ${star} "${said}" nhưng trên lá số là "${actual}"`);
    }
  }
  return [...out];
}

/** Bỏ câu chứa từ cấm (phương án cuối nếu viết lại vẫn lỗi). */
export function scrub(text: string): string {
  return text
    .split('\n')
    .map((line) =>
      line
        .split(/(?<=[.!?])\s+/)
        .filter((s) => !BANNED.test(s))
        .join(' '),
    )
    .join('\n')
    .replace(/\*\*/g, '');
}

/* ----------------------------- Tạo một phần ----------------------------- */

export type CallFn = (system: string, messages: { role: 'user' | 'assistant'; content: string }[], maxTokens: number) => Promise<string>;

export async function generateSection(
  key: string,
  ctx: Parameters<typeof sectionFacts>[1],
  call: CallFn,
): Promise<{ text: string; check: Check; attempts: number }> {
  const sec = AI_SECTIONS.find((s) => s.key === key);
  if (!sec) throw new Error('Phần không tồn tại');
  const facts = sectionFacts(key, ctx);
  const addr = addressOf(ctx.chart, ctx.reading.currentAge).short;
  let text = (await call(REPORT_SYSTEM, buildMessages(key, facts, addr), sec.maxTokens)).trim();
  let check = checkSection(key, text, ctx.chart);
  if (check.ok) return { text, check, attempts: 1 };
  const retry = (await call(REPORT_SYSTEM, buildMessages(key, facts, addr, check.issues.join('; ')), sec.maxTokens)).trim();
  const check2 = checkSection(key, retry, ctx.chart);
  if (check2.ok || check2.issues.length <= check.issues.length) {
    text = retry;
    check = check2;
  }
  if (!check.ok) {
    text = scrub(text);
    check = checkSection(key, text, ctx.chart);
  }
  return { text, check, attempts: 2 };
}

export const TOTAL_WORDS = AI_SECTIONS.reduce((a, s) => a + s.words[0], 0);
