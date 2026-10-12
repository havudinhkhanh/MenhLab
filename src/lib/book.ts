/**
 * "Bản luận giải trọn đời" dạng sách — dựng hoàn toàn bằng quy tắc và nội dung biên soạn sẵn.
 *
 * Mỗi cung là 5 đoạn liền mạch: ấn tượng ngoài đời → sao chính và độ sáng → các sao đi kèm (có điểm số)
 * → liên hệ với các cung khác → nguyên tắc, dấu hiệu lệch hướng, ngưỡng hành động; cuối cùng là câu hỏi tự kiểm chứng.
 * Các phần còn lại (mở đầu, liên cung, giai đoạn, năm nay, từng tháng, tổng kết, điều đặc biệt, lời nhắn)
 * ghép từ bản đọc theo quy tắc và viết lại thành văn xuôi.
 */
import { tamPhuong, type Chart, type Palace, type Star } from './engine/chart';
import type { PalaceReading, Reading } from './reading';
import { netPercentile, type LifeReport } from './lifeReport';
import { DOMAIN_TOPIC, starInDomainPlain } from './story';
import { PALACES, type DomainKey } from '@/content/palaces';
import { MAJOR } from '@/content/stars';
import { BRIGHT_STORY, HOA_STORY, MINOR_STORY, STAR_STORY } from '@/content/story';
import { DOMAIN_SIGNS, STAR_GUARD } from '@/content/report';
import { MONEY_TODO_LEAK, MONEY_TODO_SOURCE, MONTH_AVOID, MONTH_TOPIC, STAR_BODY } from '@/content/plain';
import { DOMAIN_RULE, IMPRESSION, MENH_CONTRAST, MINOR_IN, OPP_MEANING, OPP_NOTE, SELF_CHECK, THRESHOLD, TRINE_NOTE, type Group } from '@/content/book';
import { RATES, fmtPct, rate } from '@/data/rates';

export type Block = { t: 'h' | 'p' | 'li' | 'check' | 'decision'; text: string };
export interface BookSection {
  key: string;
  part: string;
  title: string;
  blocks: Block[];
}
export interface Book {
  address: { short: string; full: string; pron: string | null };
  sections: BookSection[];
  words: number;
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const upper = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const dot = (s: string) => (/[.!?…”"]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);
const noDot = (s: string) => s.trim().replace(/[.!?]+$/, '');
const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} và ${xs[xs.length - 1]}`);
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ','));

/* ----------------------------- Xưng hô ----------------------------- */

export function addressOf(chart: Chart, age: number) {
  const name = (chart.name ?? '').trim().replace(/\s+/g, ' ');
  if (!name || age < 18) return { short: 'bạn', full: name || 'bạn', pron: null as string | null };
  const pron = chart.gender === 'nam' ? 'anh' : 'chị';
  const given = name.split(' ').pop()!;
  return { short: `${pron} ${given}`, full: `${pron} ${name}`, pron };
}

/**
 * Đổi "bạn" (ngôi thứ hai) thành "anh/chị"; lần đầu trong mỗi phần dùng "anh/chị + tên".
 * Giữ nguyên "bạn bè", "bạn đời", "bạn thân", "người bạn"…
 */
export function personalizer(addr: ReturnType<typeof addressOf>) {
  let first = true;
  const fn = (s: string): string => {
    if (!addr.pron) return s;
    return s.replace(/(^|[^\p{L}])([Bb])ạn(?![\p{L}])/gu, (m, pre: string, b: string, offset: number, str: string) => {
      const after = str.slice(offset + m.length, offset + m.length + 14).toLowerCase();
      const before = str.slice(Math.max(0, offset - 14), offset + pre.length).toLowerCase();
      if (/^\s+(bè|đời|thân|đồng nghiệp|đồng niên|đồng hành|hàng|cùng|trai|gái|tình|đường|ngang|cũ|mới quen|vui|làm ăn|lâu năm)/.test(after)) return m;
      if (/(những|các|vài|mấy|nhiều|ít|một|hai|kết)\s+(người\s+)?$/.test(before)) return m;
      if (/(^|[^\p{L}])người\s+$/u.test(before) && !/con người\s+$/.test(before) && /^\s*[,.;:)]/.test(after)) return m;
      const word = first ? addr.short : addr.pron!;
      first = false;
      return pre + (b === 'B' ? upper(word) : word);
    });
  };
  fn.reset = () => {
    first = true;
  };
  return fn;
}

/* ----------------------------- Tiện ích lá số ----------------------------- */

const GROUP: Record<DomainKey, Group> = {
  menh: 'self',
  phuc: 'self',
  di: 'self',
  quan: 'work',
  tai: 'money',
  dien: 'money',
  phuthe: 'people',
  huynh: 'people',
  tutuc: 'people',
  phumau: 'people',
  no: 'people',
  tat: 'health',
};
const SELF_DOMAINS: DomainKey[] = ['menh', 'quan', 'tai', 'phuc', 'di'];
const allStars = (p: Palace) => [...p.majors, ...p.goodStars, ...p.badStars, ...p.others];
const topic = (palace: string) => (palace === 'Mệnh' ? 'bản thân bạn' : (MONTH_TOPIC[palace] ?? DOMAIN_TOPIC[PALACES[palace].domain]));

function hoaOf(chart: Chart, s: Star) {
  return ((Object.entries(chart.hoa).find(([, n]) => n === s.name)?.[0] as string | undefined) ?? s.hoa) as 'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ' | undefined;
}
function desc(p: Palace) {
  return p.majors.length ? p.majors.map((s) => s.name).join(', ') : 'không có sao chính';
}
function leadOf(chart: Chart, p: Palace) {
  return (p.majors.length ? p.majors : chart.palaces[(p.branch + 6) % 12].majors)[0];
}
const net = (r: PalaceReading) => r.support - r.challenge;

function brightConsequence(s: Star, domain: DomainKey) {
  const sc = s.brightness?.score ?? 0;
  const st = STAR_STORY[s.name];
  if (domain === 'menh' && st) return sc >= 2 ? st.bright : sc <= -1 ? st.dim : '';
  if (sc >= 2) return 'Vì vậy những nét thuận vừa kể thường thể hiện rõ, ít bị lấn át.';
  if (sc <= -1) return 'Vì vậy mặt dễ vướng vừa kể dễ lộ ra hơn — đây là chỗ nên để ý nhiều hơn người khác.';
  return '';
}

/* ----------------------------- Một cung ----------------------------- */

function palaceSection(chart: Chart, rd: Reading, r: PalaceReading, title: string): BookSection {
  const p = chart.palaces[r.branch];
  const domain = PALACES[p.name].domain;
  const group = GROUP[domain];
  const tp = tamPhuong(p.branch);
  const opp = chart.palaces[tp.opposite];
  const borrowed = !p.majors.length;
  const majors = borrowed ? opp.majors : p.majors;
  const lead = majors[0];
  const st = lead ? STAR_STORY[lead.name] : undefined;
  const blocks: Block[] = [];

  // 1. Ấn tượng ngoài đời
  if (st && lead) {
    let p1 = '';
    if (domain === 'menh') {
      p1 = `${st.seen} ${st.daily.slice(0, 2).join(' ')}`;
      const contrast = [...p.badStars, ...p.goodStars].find((s) => MENH_CONTRAST[s.name]);
      if (contrast) p1 += ` Nhưng ở cạnh đủ lâu, người ta sẽ thấy thêm một mặt khác: ${MENH_CONTRAST[contrast.name]}.`;
    } else if (domain === 'quan') p1 = st.work;
    else if (domain === 'tai') p1 = st.money;
    else if (domain === 'phuthe') p1 = st.love;
    else p1 = IMPRESSION[lead.name]?.[domain as keyof (typeof IMPRESSION)[string]] ?? '';
    if (p1) blocks.push({ t: 'p', text: p1 });
  }

  // 2. Sao chính và độ sáng
  if (!lead) {
    blocks.push({ t: 'p', text: 'Cung này và cả cung đối diện đều không có sao chính — lĩnh vực này của bạn rất linh hoạt, phụ thuộc nhiều vào hoàn cảnh và các sao phụ đi kèm.' });
  } else if (borrowed) {
    const roles = majors.map((s) => `${s.name}${s.brightness ? ` (${s.brightness.name})` : ''} — ${STAR_STORY[s.name]?.role ?? ''}`);
    let t = `Cung ${p.name} của bạn không có sao chính, sách gọi là "vô chính diệu". Khi đó Tử Vi đọc theo sao ở cung đối diện chiếu sang; với bạn là ${list(roles)}, từ cung ${opp.name}. Hiểu nôm na: ${domain === 'menh' ? 'tính cách của bạn' : `chuyện ${topic(p.name)}`} không có một "màu" cố định — dễ đổi theo hoàn cảnh và người ở cạnh — và nét của ${list(majors.map((s) => s.name))} có nhưng nhạt hơn so với khi sao nằm ngay trong cung. Đó vừa là sự linh hoạt, vừa là lý do lĩnh vực này cần một "khung" do chính bạn đặt ra.`;
    if (st) t += ` ${st.essence}`;
    const bc = lead.brightness ? brightConsequence(lead, domain === 'menh' ? 'menh' : domain) : '';
    if (lead.brightness && bc) t += ` ${lead.name} ở độ sáng ${lead.brightness.name}: ${lower(bc)}`;
    blocks.push({ t: 'p', text: t });
  } else {
    let t = `Điều này bắt nguồn từ ${lead.name}, sao chính nằm ngay trong cung ${p.name} (${lead.name} ở ${p.name}). ${st?.essence ?? MAJOR[lead.name]?.long ?? ''}`;
    if (domain !== 'tat' && lead.brightness && BRIGHT_STORY[lead.brightness.name]) {
      t += ` Trên lá số của bạn, ${lead.name} ${BRIGHT_STORY[lead.brightness.name]}. ${brightConsequence(lead, domain)}`;
    }
    const second = majors[1];
    if (second) {
      const ds = starInDomainPlain(second.name, domain);
      t += ` Đi cùng là ${second.name}${second.brightness ? ` (${second.brightness.name})` : ''} — ${STAR_STORY[second.name]?.role ?? ''}${ds ? `, thêm một sắc thái: ${lower(dot(ds))}` : '.'}`;
    }
    if (domain === 'tat') {
      const bodies = majors.map((s) => (STAR_BODY[s.name] ? `${s.name} với ${STAR_BODY[s.name].organs}` : '')).filter(Boolean);
      if (bodies.length) {
        t += ` Sách Tử Vi xưa gắn mỗi sao với một vùng cơ thể: ${list(bodies)}. Đây không phải dự báo bệnh — chưa có bằng chứng nào cho thấy lá số đoán được bệnh — mà là lời nhắc về vùng nên chăm sóc: ${STAR_BODY[lead.name]?.habit ?? 'giữ nhịp sinh hoạt đều'}.`;
      }
    }
    if (r.story.paras.some((x) => x.startsWith('Hai sao này đi cùng nhau'))) {
      t += ` ${r.story.paras.find((x) => x.startsWith('Hai sao này đi cùng nhau'))}`;
    }
    blocks.push({ t: 'p', text: t });
  }

  // 3. Các sao đi kèm
  const parts: { text: string; good: boolean }[] = [];
  const seen = new Set<string>();
  const addFrom = (pal: Palace, where: 'self' | 'opp') => {
    for (const s of allStars(pal)) {
      if (seen.has(s.name)) continue;
      const h = hoaOf(chart, s);
      const ms = MINOR_STORY[s.name];
      const strong = pal.goodStars.includes(s) || pal.badStars.includes(s);
      const isOther = !strong && !pal.majors.includes(s);
      if (!h && !ms) continue;
      if (where === 'opp' && !h && !strong) continue;
      if (domain === 'tat' && !h && !MINOR_IN[s.name]?.health && ms?.role !== 'sao giải') continue;
      seen.add(s.name);
      const loc = where === 'self' ? 'nằm ngay trong cung' : `từ cung đối diện (${pal.name}) chiếu sang`;
      const minorText = MINOR_IN[s.name]?.[group] ?? (ms ? ms.adds : '');
      if (h) {
        const hs = HOA_STORY[h];
        const hText = MINOR_IN[`Hóa ${h}`]?.[group] ?? hs.adds;
        parts.push({
          text: ms
            ? `${s.name} (${ms.role}) ${loc}, lại mang Hóa ${h} năm sinh (${hs.role}): ${minorText}; thêm vào đó, ${hText}.`
            : `${s.name} ${loc} mang Hóa ${h} năm sinh — ${hs.role}: ${hText}.`,
          good: hs.good,
        });
      } else if (ms && (strong || isOther)) {
        if (isOther && parts.filter((x) => !x.text.includes('chiếu sang')).length > 5) continue;
        parts.push({ text: `${s.name} (${ms.role}) ${loc}: ${minorText}.`, good: ms.good });
      }
    }
  };
  addFrom(p, 'self');
  addFrom(opp, 'opp');
  const good = parts.filter((x) => x.good).slice(0, 4);
  const bad = parts.filter((x) => !x.good).slice(0, 3);
  const pct = netPercentile(p.name, net(r));
  const pctText =
    pct === undefined
      ? ''
      : pct >= 0.97
        ? ', thuộc nhóm khoảng 3% lá số được nâng đỡ nhiều nhất ở cung này'
        : pct <= 0.03
          ? ', thuộc nhóm khoảng 3% lá số nhiều thử thách nhất ở cung này'
          : pct >= 0.65 ? `, cao hơn khoảng ${Math.round(pct * 100)}% số lá số` : pct <= 0.35 ? `, thấp hơn khoảng ${Math.round((1 - pct) * 100)}% số lá số` : ', ở mức trung bình so với các lá số khác';
  const n = net(r);
  const tail =
    n >= 1.5
      ? `Đây là chỗ nên dựa vào: khi việc khác khó, ${p.name === 'Mệnh' ? 'chính bản lĩnh của bạn' : `chuyện ${topic(p.name)}`} thường là điểm tựa.`
      : n <= -1.5
        ? `Điều này không có nghĩa là ${p.name === 'Mệnh' ? 'con người bạn có gì không tốt' : `chuyện ${topic(p.name)} của bạn xấu`}, mà là nó không được "dọn sẵn": điểm mạnh ở đây phải tự rèn mà có, và vì vậy nó bền.`
        : 'Kết quả ở đây phụ thuộc vào cách bạn làm nhiều hơn là vào lá số.';
  const p3: string[] = [];
  if (good.length || bad.length) p3.push('Các sao đi kèm làm bức tranh cụ thể hơn.');
  p3.push(...good.map((x) => x.text));
  if (bad.length) p3.push(`Ở phía gây khó: ${bad.map((x) => noDot(x.text)).join('; ')}.`);
  p3.push(`Cộng lại theo cách tính của MệnhLab, cung ${p.name} có ${fmt(r.support)} điểm hỗ trợ và ${fmt(r.challenge)} điểm gây khó${pctText}. ${tail}`);
  blocks.push({ t: 'p', text: p3.join(' ') });

  // 4. Liên hệ các cung khác
  const t1 = chart.palaces[tp.trine[0]];
  const t2 = chart.palaces[tp.trine[1]];
  const rOf = (pal: Palace) => rd.palaces.find((x) => x.branch === pal.branch)!;
  const trio = [opp, t1, t2].map((pal) => ({ pal, n: net(rOf(pal)) })).sort((a, b) => b.n - a.n);
  let p4 = `Cung ${p.name} không đứng một mình. ${OPP_NOTE[p.name]} (${desc(opp)}): ${lower(dot(rOf(opp).story.lead))} ${OPP_MEANING[p.name]} ${dot(TRINE_NOTE[p.name])} Trên lá số của bạn, ${[t1, t2].map((x) => (x.majors.length ? `${x.name} có ${desc(x)}` : `${x.name} không có sao chính`)).join(', ')}.`;
  if (trio[0].n - trio[2].n >= 1.5) {
    p4 += ` Trong ba cung này, ${trio[0].pal.name} là chỗ thuận nhất, còn ${trio[2].pal.name} là chỗ đòi hỏi nhiều công sức nhất — nên khi ${p.name === 'Mệnh' ? 'bạn gặp khó' : `chuyện ${topic(p.name)} gặp khó`}, hãy nhìn sang chuyện ${topic(trio[0].pal.name)} để tìm điểm tựa.`;
  }
  if (p.tuan || p.triet) {
    const w = [p.tuan && 'Tuần', p.triet && 'Triệt'].filter(Boolean).join(' và ');
    p4 += ` Cung này còn nằm dưới ${w} — một "tấm chắn" trên lá số: cả cái tốt lẫn cái khó ở đây đều nhẹ bớt, kết quả thường đến chậm hơn mong đợi${p.triet ? ', rõ nhất ở nửa đầu cuộc đời' : ''}; bù lại, nó như một cái phanh lắp sẵn, giúp tránh những cú hụt lớn do quá vội.`;
  }
  if (p.isBody && p.name !== 'Mệnh') p4 += ` Đây cũng là cung Thân của bạn — cung cho biết từ khoảng 30 tuổi người ta dồn tâm sức vào đâu — nên nửa sau cuộc đời, chuyện ${topic(p.name)} sẽ ngày càng chiếm nhiều chỗ trong suy nghĩ của bạn.`;
  else if (p.isBody) p4 += ' Cung Thân nằm cùng cung Mệnh: bạn sống khá nhất quán, tính cách lúc trẻ và lúc lớn tuổi ít khác nhau.';
  const age = rd.currentAge;
  const [a0, a1] = p.daiVan;
  if (a0 <= 95) {
    p4 +=
      age >= a0 && age <= a1
        ? ` Bạn đang ở đúng chặng 10 năm đi qua cung này (${a0}–${a1} tuổi), nên những gì viết ở đây đang nổi lên rõ nhất trong đời bạn lúc này.`
        : age < a0 && a0 <= 75
          ? ` Chặng 10 năm đi qua cung này là ${a0}–${a1} tuổi — khi đó chuyện ${topic(p.name)} sẽ trở thành chủ đề lớn của đời bạn.`
          : age < a0
            ? ''
          : ` Chặng 10 năm đi qua cung này (${a0}–${a1} tuổi) đã qua; bạn có thể nhìn lại giai đoạn đó để đối chiếu.`;
  }
  blocks.push({ t: 'p', text: p4 });

  // 5. Hành động
  const guard = lead ? STAR_GUARD[lead.name] : undefined;
  const self = SELF_DOMAINS.includes(domain);
  const rule = (self && guard ? guard.rule : DOMAIN_RULE[p.name]) ?? guard?.rule ?? r.advice[0] ?? '';
  const drift = self && guard ? guard.drift : (DOMAIN_SIGNS[p.name]?.early ?? '');
  const good5 = DOMAIN_SIGNS[p.name]?.good;
  let p5 = `Nguyên tắc nên giữ: "${noDot(rule)}." `;
  if (drift) p5 += `Dấu hiệu sớm cho thấy bạn đang lệch hướng: khi ${noDot(drift)}. `;
  if (THRESHOLD[p.name]) p5 += `Ngưỡng hành động: ${noDot(THRESHOLD[p.name])}. `;
  if (good5) p5 += `Và dấu hiệu cho thấy bạn đang đi đúng: ${noDot(good5)}.`;
  const extra = r.advice.find((a) => a !== rule);
  if (extra) p5 += ` Một việc làm được ngay: ${lower(dot(extra))}`;
  blocks.push({ t: 'decision', text: p5.trim() });

  const checks = SELF_CHECK[p.name];
  if (checks) blocks.push({ t: 'check', text: checks.join(' ') });

  return { key: `cung-${r.branch}`, part: 'Phần 2. Mười hai khía cạnh cuộc đời', title, blocks };
}

/* ----------------------------- Các phần còn lại ----------------------------- */

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

function opening(chart: Chart, rd: Reading, life: LifeReport, menhKey: string): BookSection {
  const blocks: Block[] = [{ t: 'h', text: 'Chân dung' }, ...life.portrait.map((text) => ({ t: 'p' as const, text }))];
  blocks.push({ t: 'h', text: 'Nền tảng lá số' }, ...life.foundation.map((text) => ({ t: 'p' as const, text })));
  const mr = rate(RATES.menhCombo[menhKey]);
  blocks.push({
    t: 'p',
    text: `${mr !== undefined ? `Khoảng ${fmtPct(mr)} số người có cung Mệnh với bộ sao giống bạn — nghĩa là những gì viết ở đây là xu hướng của một nhóm người, không phải điều định sẵn cho riêng ai. ` : ''}Tử Vi là một hệ thống văn hóa để tự suy ngẫm, chưa được khoa học chứng minh khả năng dự đoán. Hãy đọc bản này như một tấm gương: chỗ nào đúng, dùng nó để hiểu mình hơn; chỗ nào không đúng, cứ mạnh dạn bỏ qua.`,
  });
  return { key: 'mo-dau', part: 'Phần 1. Mở đầu', title: 'Mở đầu và nền tảng lá số', blocks };
}

function axes(life: LifeReport): BookSection {
  const blocks: Block[] = [
    {
      t: 'p',
      text: 'Đọc từng cung giống như xem từng mảnh ghép. Trong Tử Vi, các cung luôn "chiếu" vào nhau thành từng trục, và chính các trục này giải thích những điều lớn trong đời: bạn tạo ra giá trị bằng cách nào, bạn trong và ngoài khác nhau ra sao, điều gì làm bạn căng và giúp bạn hồi lại, tiền của bạn có đọng lại thành tài sản không.',
    },
  ];
  life.axes.forEach((a, i) => {
    blocks.push({ t: 'h', text: `${i + 1}. ${a.title}` }, { t: 'p', text: a.text }, { t: 'decision', text: `Quyết định nên làm: ${a.move}` });
  });
  return { key: 'lien-cung', part: 'Phần 3. Bức tranh toàn cảnh', title: 'Bốn trục liên cung', blocks };
}

function stages(rd: Reading, life: LifeReport): BookSection {
  const blocks: Block[] = [
    {
      t: 'p',
      text: `Hành trình trên lá số không phải một đường thẳng đều. Tử Vi chia đời người thành các chặng 10 năm, gọi là đại vận; mỗi chặng đi qua một cung, và chủ đề của cung đó trở thành "khí hậu" của cả chặng. Đó là lý do cùng một con người, cùng một năng lực, mà có giai đoạn mọi thứ thuận, có giai đoạn phải gồng. Bạn đang ${rd.currentAge} tuổi âm. Dưới đây là chặng vừa qua (để bạn đối chiếu), chặng hiện tại, chặng sắp tới và chặng sau nữa.`,
    },
  ];
  for (const s of life.stages) {
    blocks.push({ t: 'h', text: s.title });
    s.paras.forEach((text) => blocks.push({ t: 'p', text }));
    s.aspects.forEach((a) => blocks.push({ t: 'p', text: `${a.label}: ${a.text}` }));
    if (s.note) blocks.push({ t: 'check', text: s.note });
  }
  return { key: 'giai-doan', part: 'Phần 4. Các giai đoạn cuộc đời', title: 'Chặng vừa qua, hiện tại, sắp tới và sau nữa', blocks };
}

function yearSection(chart: Chart, rd: Reading): BookSection[] {
  const y = rd.years[0];
  if (!y) return [];
  const at = (h: string) => y.hoa.find((x) => x.hoa === h)!;
  const L = at('Lộc').landsIn;
  const Q = at('Quyền').landsIn;
  const K = at('Khoa').landsIn;
  const KY = at('Kỵ').landsIn;
  const grp = (pal: string) => (PALACES[pal] ? GROUP[PALACES[pal].domain] : 'self');
  const label = (pal: string) => (KY === pal ? 'cần làm chắc' : [L, Q, K].includes(pal) ? 'thuận lợi' : 'bình ổn');
  const blocks: Block[] = [{ t: 'h', text: 'Tổng quan năm' }, ...y.story.map((text) => ({ t: 'p' as const, text }))];
  blocks.push({ t: 'h', text: 'Bốn sao đổi màu của năm' });
  for (const h of y.hoa) {
    if (h.landsIn === '—') continue;
    blocks.push({ t: 'li', text: `${h.star} hóa ${h.hoa}, rơi vào cung ${h.landsIn} (chuyện ${topic(h.landsIn)}): ${MINOR_IN[`Hóa ${h.hoa}`]?.[grp(h.landsIn)] ?? HOA_STORY[h.hoa].adds}.` });
  }
  blocks.push({ t: 'h', text: 'Bốn khía cạnh' });
  blocks.push({ t: 'p', text: `Sự nghiệp năm nay (${label('Quan Lộc')}): ${y.work.join(' ')}` });
  blocks.push({ t: 'p', text: `Tài chính năm nay (${label('Tài Bạch')}): ${[...y.money.sources, ...y.money.leaks].join(' ')} ${y.money.todo.length ? `Nên làm: ${y.money.todo.join(' ')}` : ''}`.trim() });
  blocks.push({ t: 'p', text: `Tình cảm và gia đình (${KY === 'Phu Thê' || KY === 'Điền Trạch' ? 'cần làm chắc' : label('Phu Thê')}): ${[...y.love, ...y.family].join(' ')}` });
  blocks.push({ t: 'p', text: `Sức khỏe (${label('Tật Ách')}): ${y.health.join(' ')}` });
  const worst = y.months.filter((m) => !m.past && m.tone === 'can-trong')[0];
  blocks.push({ t: 'h', text: 'Năm việc nên làm' });
  blocks.push({ t: 'li', text: `(Cơ hội ưu tiên) ${MONEY_TODO_SOURCE[L] ?? y.actions[0]}` });
  blocks.push({ t: 'li', text: `(Nguyên tắc ra quyết định) ${MONTH_AVOID[KY] ?? y.actions[1] ?? ''}` });
  if (DOMAIN_SIGNS[KY]) blocks.push({ t: 'li', text: `(Dấu hiệu sớm cần theo dõi) Khi ${noDot(DOMAIN_SIGNS[KY].early)}, đó là lúc dừng lại xem xét.` });
  blocks.push({ t: 'li', text: `(Giới hạn bảo vệ) ${MONEY_TODO_LEAK[KY] ?? y.actions[2] ?? ''}` });
  blocks.push({
    t: 'li',
    text: worst ? `(Việc nên hoãn) Những quyết định lớn về chuyện ${topic(worst.palace)} nên tránh dồn vào ${lower(worst.label)} (${worst.from} – ${worst.to}).` : `(Việc nên hoãn) Những quyết định lớn liên quan tới chuyện ${topic(KY)} nên chờ lúc bình tĩnh, bàn kỹ với người tin cậy rồi hãy chốt.`,
  });
  const y1 = rd.years[1];
  if (y1) {
    blocks.push({ t: 'h', text: `Nhìn sang năm ${y1.canChi} (${y1.year})` }, { t: 'p', text: `${y1.summary.join(' ')} ${y1.story[1] ?? ''}`.trim() });
  }

  const m: Block[] = [
    {
      t: 'p',
      text: `${y.monthHighlights.join(' ')} Mỗi tháng âm lịch ứng với một cung trên lá số; nhịp "thuận" hay "làm chắc" là tín hiệu để sắp xếp việc cho hợp, không phải lịch định sẵn. Tháng đã qua được giữ lại để bạn đối chiếu.`,
    },
  ];
  const toneTxt = { thuan: 'thuận', binh: 'bình thường', 'can-trong': 'làm chắc' } as const;
  for (const mo of y.months) {
    const head = `${mo.label} (${mo.from} – ${mo.to}, cung ${mo.palace}, nhịp ${toneTxt[mo.tone]})${mo.current ? ' — tháng hiện tại' : ''}${mo.past ? ' — đã qua, hãy đối chiếu' : ''}:`;
    const body = mo.past
      ? `${mo.focus} Nên làm: ${mo.todo.map(noDot).join('; ')}.${mo.avoid.length ? ` Nên tránh: ${mo.avoid.map(noDot).join('; ')}.` : ''}`
      : `${mo.focus} Nên làm: ${mo.todo.map(noDot).join('; ')}.${mo.avoid.length ? ` Nên tránh: ${mo.avoid.map(noDot).join('; ')}.` : ''}${mo.money ? ` ${mo.money}` : ''}${mo.note ? ` ${mo.note}` : ''}`;
    m.push({ t: 'li', text: `${head} ${body}` });
  }
  return [
    { key: 'nam-nay', part: 'Phần 5. Năm nay', title: `Năm ${y.canChi} (${y.year}): bản đồ chi tiết`, blocks },
    { key: 'tung-thang', part: 'Phần 5. Năm nay', title: 'Từng tháng âm lịch: nên làm gì, nên tránh gì', blocks: m },
  ];
}

function summary(life: LifeReport): BookSection {
  const blocks: Block[] = [{ t: 'h', text: 'Ba đòn bẩy nên dựa vào' }];
  life.levers.forEach((l, i) =>
    blocks.push({ t: 'p', text: `${i + 1}. ${l.title}. ${dot(l.strength)} Điều kiện để phát huy: ${lower(dot(l.condition))} Việc làm đầu tiên: ${lower(dot(l.first))} Dấu hiệu đang đi đúng: ${lower(dot(l.sign))}` }),
  );
  blocks.push({ t: 'h', text: 'Ba điểm mù cần canh' });
  life.blinds.forEach((b, i) =>
    blocks.push({
      t: 'p',
      text: `${i + 1}. ${b.title}. Dễ xảy ra khi: ${lower(dot(b.trigger))} ${dot(b.reaction)} ${dot(b.consequence)} Dấu hiệu sớm: ${lower(dot(b.early))} Cách xử lý: ${lower(dot(b.fix))}`,
    }),
  );
  blocks.push({ t: 'h', text: 'Thứ tự hành động' });
  life.order.forEach((o) => blocks.push({ t: 'li', text: `${o.label}: ${o.text}` }));
  return { key: 'tong-ket', part: 'Phần 6. Tổng kết', title: 'Ba đòn bẩy, ba điểm mù, thứ tự hành động', blocks };
}

function closing(life: LifeReport, addr: ReturnType<typeof addressOf>): BookSection {
  const blocks: Block[] = [{ t: 'h', text: 'Ba điều đặc biệt nhất trong lá số' }];
  life.specials.forEach((s, i) => blocks.push({ t: 'p', text: `${i + 1}. ${s.title} (${s.rarity}). ${dot(s.text)} Cách phát huy: ${lower(dot(s.how))}` }));
  blocks.push({ t: 'h', text: 'Lời nhắn' });
  blocks.push({ t: 'p', text: `${upper(addr.short)} thân mến,` });
  life.letter.slice(1).forEach((text) => blocks.push({ t: 'p', text }));
  return { key: 'dac-biet', part: 'Phần 7. Điều đặc biệt và lời nhắn', title: 'Ba điều đặc biệt nhất và lời nhắn', blocks };
}

/* ----------------------------- Lắp ráp ----------------------------- */

export function buildBook(chart: Chart, rd: Reading, life: LifeReport, menhKey: string): Book {
  const addr = addressOf(chart, rd.currentAge);
  const sections: BookSection[] = [
    opening(chart, rd, life, menhKey),
    ...PALACE_ORDER.map(([name, title]) => palaceSection(chart, rd, rd.palaces.find((x) => x.palace === name)!, `${title} (cung ${name})`)),
    axes(life),
    stages(rd, life),
    ...yearSection(chart, rd),
    summary(life),
    closing(life, addr),
  ];
  // Cá nhân hóa: mỗi phần, lần đầu nhắc người đọc thì gọi kèm tên.
  const P = personalizer(addr);
  for (const s of sections) {
    P.reset();
    s.title = P(s.title).replace(addr.short, addr.pron ?? 'bạn');
    P.reset();
    for (const b of s.blocks) b.text = P(b.text.replace(/\s+/g, ' ').trim());
  }
  const words = sections.reduce((a, s) => a + s.blocks.reduce((x, b) => x + b.text.split(' ').length, 0), 0);
  return { address: addr, sections, words };
}
