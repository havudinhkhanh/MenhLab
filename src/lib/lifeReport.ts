/**
 * "Luận giải trọn đời": các phần ghép nhiều cung lại với nhau —
 * mở đầu, nền tảng lá số, bức tranh liên cung, các giai đoạn đời, đòn bẩy, điểm mù,
 * thứ tự hành động, điều đặc biệt (có số liệu độ hiếm) và lời nhắn.
 *
 * Mọi câu đều dựng từ dữ kiện lá số + nội dung đã viết sẵn; không có câu nào "bịa" ngoài căn cứ.
 */
import type { Chart, Palace } from './engine/chart';
import type { PatternHit } from './engine/patterns';
import type { DaiVanReading, PalaceReading, Reading } from './reading';
import { DOMAIN_TOPIC } from './story';
import { PALACES } from '@/content/palaces';
import { DOMAIN_CAUTION_ADVICE, MONEY_SOURCE, MONTH_AVOID, MONTH_DO, MONTH_TOPIC } from '@/content/plain';
import { STAR_STORY } from '@/content/story';
import { DOMAIN_SIGNS, STAGE_THEME, STAR_GUARD } from '@/content/report';
import { MAJOR } from '@/content/stars';
import { RATES, fmtPct, oneIn, rate } from '@/data/rates';
import profile from '@/data/rates-profile.json';

export interface Lever {
  palace: string;
  title: string;
  strength: string;
  condition: string;
  first: string;
  sign: string;
}
export interface BlindSpot {
  palace: string;
  title: string;
  trigger: string;
  reaction: string;
  consequence: string;
  early: string;
  fix: string;
}
export interface Stage {
  key: 'past' | 'current' | 'next' | 'later';
  label: string;
  title: string;
  range: [number, number];
  palace: string;
  paras: string[];
  aspects: { label: string; text: string }[];
  note?: string;
  locked?: boolean;
}
export interface Special {
  title: string;
  rarity: string;
  text: string;
  how: string;
  locked?: boolean;
}
export interface LifeReport {
  portrait: string[];
  foundation: string[];
  axes: { title: string; text: string; move: string; locked?: boolean }[];
  stages: Stage[];
  levers: Lever[];
  blinds: BlindSpot[];
  order: { label: string; text: string }[];
  specials: Special[];
  letter: string[];
  locked?: boolean;
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const upper = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const dot = (s: string) => (/[.!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);
const noDot = (s: string) => s.trim().replace(/[.!?]+$/, '');
const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} và ${xs[xs.length - 1]}`);

/* ----------------------------- Phân vị ----------------------------- */

const P = profile as { n: number; net: Record<string, Record<string, number>>; feat: Record<string, number> };

/** Tỷ lệ lá số có mức hỗ trợ ròng thấp hơn lá số này ở cùng cung (0..1). */
export function netPercentile(palace: string, net: number): number | undefined {
  const h = P.net?.[palace];
  if (!h || !P.n) return undefined;
  const x = Math.round(net * 2) / 2;
  let below = 0;
  let eq = 0;
  for (const [k, v] of Object.entries(h)) {
    const kv = Number(k);
    if (kv < x) below += v;
    else if (kv === x) eq += v;
  }
  return (below + eq / 2) / P.n;
}

const featRate = (k: string) => (P.n && P.feat?.[k] !== undefined ? P.feat[k] / P.n : undefined);

/* ----------------------------- Tiện ích ----------------------------- */

function net(r: PalaceReading) {
  return r.support - r.challenge;
}
function leadStar(chart: Chart, r: PalaceReading): string | undefined {
  const p = chart.palaces[r.branch];
  const m = p.majors.length ? p.majors : chart.palaces[(r.branch + 6) % 12].majors;
  return m[0]?.name;
}
function where(chart: Chart, star: string): Palace | undefined {
  return chart.palaces.find((p) => [...p.majors, ...p.goodStars, ...p.badStars, ...p.others].some((s) => s.name === star));
}
const topic = (palace: string) => DOMAIN_TOPIC[PALACES[palace].domain];
const fmtN = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ','));

/* ----------------------------- Các phần ----------------------------- */

function buildPortrait(chart: Chart, rd: Reading, byName: (n: string) => PalaceReading) {
  const menh = byName('Mệnh');
  const ls = leadStar(chart, menh);
  const st = ls ? STAR_STORY[ls] : undefined;
  const ranked = rd.palaces.filter((p) => p.palace !== 'Mệnh').sort((a, b) => net(b) - net(a));
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];
  const kyPal = where(chart, chart.hoa['Kỵ'])?.name;
  const locPal = where(chart, chart.hoa['Lộc'])?.name;
  const than = chart.palaces[chart.thanBranch].name;
  const cur = rd.daiVan.find((d) => d.current);
  const who = chart.name ? `${chart.name}, nếu` : 'Nếu';

  const p1 = [
    `${who} phải tóm lá số này trong vài câu: ${ls && st ? `sao chủ của bạn là ${ls} — ${st.role}, ${st.image}. Nói gọn, bạn là người ${lower(noDot(menh.story.lead)).replace(/^thiên hướng /, 'có thiên hướng ')}` : `cung Mệnh của bạn không có sao chính — ${lower(noDot(menh.story.lead))}`}.`,
    `Điểm tựa lớn nhất trên lá số nằm ở chuyện ${topic(best.palace)}: ${lower(noDot(best.story.lead))}.`,
    `Chỗ đòi hỏi bạn nhiều công sức nhất là chuyện ${topic(worst.palace)} — không phải điểm xấu, mà là nơi bạn cần chủ động hơn người khác.`,
    kyPal ? `Chuyện bạn hay bận lòng suốt đời là ${topic(kyPal)}${locPal ? `, còn cơ hội và nguồn lực hay đến với bạn từ ${MONEY_SOURCE[locPal]}` : ''}.` : '',
    than !== 'Mệnh'
      ? `Từ khoảng 30 tuổi, trọng tâm dịch dần sang chuyện ${topic(than)} (cung Thân nằm ở ${than}).`
      : 'Cung Thân trùng cung Mệnh: con người bạn lúc trẻ và lúc lớn tuổi khá nhất quán.',
  ].filter(Boolean);
  const guard = ls ? STAR_GUARD[ls] : undefined;
  const p2 = [
    cur
      ? `Hiện bạn đang ở chặng ${cur.range[0]}–${cur.range[1]} tuổi, chủ đề lớn là chuyện ${topic(cur.palace)}. ${STAGE_THEME[cur.palace]?.theme ?? ''}`
      : '',
    `Hướng đi hợp nhất với bạn: dựa vào thế mạnh ở chuyện ${topic(best.palace)} để bù cho chuyện ${topic(worst.palace)}, thay vì cố sửa mọi điểm yếu cùng lúc.`,
    guard ? `Nếu chỉ nhớ một nguyên tắc từ bản luận giải này, hãy nhớ: "${noDot(guard.rule)}".` : '',
  ].filter(Boolean);
  return [p1.join(' '), p2.join(' ')];
}

function buildFoundation(chart: Chart, rd: Reading, patterns: PatternHit[]) {
  const mc = rd.overview.find((o) => o.label === 'Mệnh – Cục');
  const du = patterns.filter((p) => p.status === 'du');
  const a = [
    `Bạn là ${chart.amDuong}, sinh năm ${chart.canChi.year}. Theo quy ước, các chặng 10 năm của bạn đi theo chiều ${chart.daiVanForward ? 'thuận' : 'nghịch'} trên lá số, và chặng đầu tiên bắt đầu từ ${chart.cuc.number} tuổi (vì Cục của bạn là ${chart.cuc.name}).`,
    chart.amDuongLy === 'thuận lý'
      ? 'Âm dương "thuận lý": tính âm/dương của năm sinh khớp với vị trí cung Mệnh — sách cổ coi là thuận, việc ít phải đi đường vòng.'
      : 'Âm dương "nghịch lý": tính âm/dương của năm sinh không khớp với vị trí cung Mệnh — sách cổ cho là hay phải đi đường vòng hơn.',
    `${mc ? `${mc.value}: ${lower(mc.explain)}` : ''}`,
  ].filter(Boolean);
  const b = [
    `Bản mệnh ${chart.banMenh.name} (hành ${chart.banMenh.element}) là thứ người Việt hay dùng để xem hợp màu, hợp tuổi. Trong luận giải Tử Vi, nó chỉ là chỉ dấu phụ — phần lớn ý nghĩa nằm ở các sao trong 12 cung mà bạn sẽ đọc dưới đây.`,
    du.length
      ? `Lá số có ${du.length} bộ sao được sách đặt tên (cách cục): ${list(du.map((p) => p.name))}. Bạn có thể xem điều kiện và độ phổ biến của từng cách ở phần Lá số gốc.`
      : 'Lá số không có cách cục nổi bật nào trong danh sách sách cổ hay nhắc — điều này rất bình thường và không nói lên tốt hay xấu.',
  ];
  return [a.join(' '), b.join(' ')];
}

function tempoOf(star?: string) {
  return star ? STAR_GUARD[star]?.tempo : undefined;
}

function buildAxes(chart: Chart, byName: (n: string) => PalaceReading) {
  const menh = byName('Mệnh');
  const quan = byName('Quan Lộc');
  const tai = byName('Tài Bạch');
  const di = byName('Thiên Di');
  const phuc = byName('Phúc Đức');
  const tat = byName('Tật Ách');
  const dien = byName('Điền Trạch');
  const ls = (r: PalaceReading) => leadStar(chart, r);

  // 1. Tam giác tạo giá trị
  const tri = [menh, quan, tai];
  const tempos = tri.map((r) => tempoOf(ls(r)));
  const dong = tempos.filter((t) => t === 'dong').length;
  const triNet = tri.reduce((s, r) => s + net(r), 0);
  const tempoText =
    dong >= 2
      ? 'Phần lớn sao chính ở ba cung này thuộc loại "động" — bạn tạo ra giá trị bằng hành động, tốc độ và dám thay đổi. Môi trường hợp nhất là nơi có nhịp nhanh, có thử thách, có chỗ cho người dám làm.'
      : dong === 0
        ? 'Sao chính ở ba cung này đều thuộc loại "tĩnh" — bạn tạo ra giá trị bằng sự bền bỉ, tính toán và hệ thống. Môi trường hợp nhất là nơi ổn định, có lộ trình rõ, đánh giá theo chất lượng lâu dài.'
        : 'Ba cung này vừa có sao "động" vừa có sao "tĩnh" — bạn vừa có tốc độ vừa có sự chắc chắn. Chìa khóa là biết lúc nào nên tăng tốc, lúc nào nên giữ nhịp.';
  const axis1 = {
    title: 'Cách bạn tạo ra giá trị: Mệnh – Quan Lộc – Tài Bạch',
    text: `Ba cung này luôn "chiếu" vào nhau nên phải đọc cùng nhau. Con người bạn: ${lower(noDot(menh.story.lead))}. Khi làm việc: ${lower(noDot(quan.story.lead))}. Khi kiếm tiền: ${lower(noDot(tai.story.lead))}. ${tempoText} ${
      triNet >= 3
        ? 'Cộng cả ba cung, mức hỗ trợ khá dày — đây là trục mạnh của lá số.'
        : triNet <= -2
          ? 'Cộng cả ba cung, thử thách nhiều hơn hỗ trợ — thành quả đến từ sự kiên trì và chọn đúng môi trường hơn là may mắn.'
          : 'Cộng cả ba cung, thuận và khó khá cân bằng.'
    }`,
    move: quan.advice[0] ?? tai.advice[0] ?? '',
  };

  // 2. Trong và ngoài
  const tM = tempoOf(ls(menh));
  const tD = tempoOf(ls(di));
  const axis2 = {
    title: 'Bên trong và bên ngoài: Mệnh đối diện Thiên Di',
    text: `Cung Mệnh là bạn khi ở "sân nhà", cung Thiên Di là bạn khi bước ra ngoài — hai cung luôn nằm đối diện nhau. ${
      tM && tD && tM !== tD
        ? tM === 'tinh'
          ? 'Ở nhà bạn trầm hơn, tính toán hơn; ra ngoài bạn chủ động, quyết liệt hơn hẳn. Người mới quen và người thân có thể thấy hai con người khác nhau — cả hai đều là bạn.'
          : 'Ở nhà bạn sôi nổi, quyết đoán; ra ngoài bạn lại điềm đạm, quan sát nhiều hơn. Người ngoài có thể đánh giá thấp sự quyết liệt thật của bạn.'
        : 'Bạn trong và ngoài khá giống nhau — người ta thấy sao thì bạn là vậy, ít "đổi vai" theo môi trường.'
    } Ra ngoài: ${lower(noDot(di.story.lead))}. ${net(di) >= 1.5 ? 'Thiên Di được hỗ trợ tốt — đi xa, đổi môi trường thường mở ra cơ hội.' : net(di) <= -1.5 ? 'Thiên Di có nhiều thử thách — khi đổi môi trường nên chuẩn bị kỹ và đi chậm.' : 'Thiên Di thuận khó đan xen — chọn lọc môi trường mới thay vì đi mọi nơi.'}`,
    move: di.advice[0] ?? '',
  };

  // 3. Áp lực và hồi phục
  const kyStar = chart.hoa['Kỵ'];
  const kyPal = where(chart, kyStar)?.name;
  const guardP = STAR_GUARD[ls(phuc) ?? ''];
  const axis3 = {
    title: 'Áp lực và cách bạn hồi phục: Phúc Đức – Tật Ách',
    text: `Điều nuôi dưỡng tinh thần bạn: ${lower(noDot(phuc.story.lead))}. Cách cơ thể và tinh thần bạn phản ứng khi quá tải: ${lower(noDot(tat.story.lead))}. ${
      kyPal ? `Chuyện dễ khiến bạn bận lòng nhất là ${topic(kyPal)} (sao ${kyStar} mang Hóa Kỵ năm sinh nằm ở cung ${kyPal}) — khi chuyện này căng, giấc ngủ và sức khỏe của bạn thường bị kéo theo.` : ''
    } Hiểu được chuỗi "điều gì làm bạn căng → cơ thể báo thế nào → điều gì giúp bạn hồi lại" là cách giữ sức bền lâu dài.`,
    move: guardP ? `Có một "nút xả" cố định mỗi tuần, chọn theo điều nuôi dưỡng bạn ở trên. ${guardP.rule}` : 'Có một "nút xả" cố định mỗi tuần: vận động, thiên nhiên, hoặc một người để nói chuyện.',
  };

  // 4. Tiền có đọng lại không
  const ltPal = where(chart, 'Lộc Tồn')?.name;
  const locPal = where(chart, chart.hoa['Lộc'])?.name;
  const axis4 = {
    title: 'Tiền có đọng lại thành tài sản không: Tài Bạch → Điền Trạch',
    text: `Cách bạn kiếm tiền: ${lower(noDot(tai.story.lead))}. Cách bạn giữ và biến tiền thành tài sản: ${lower(noDot(dien.story.lead))}. ${
      ltPal ? `Lộc Tồn — sao giữ của — nằm ở cung ${ltPal}, nên ${ltPal === 'Mệnh' ? 'bạn có bản năng tích lũy' : `tài sản dễ đọng lại qua chuyện ${topic(ltPal)}`}. ` : ''
    }${locPal ? `Hóa Lộc năm sinh ở cung ${locPal}: suốt đời, nguồn lợi hay đến từ ${MONEY_SOURCE[locPal]}. ` : ''}${
      net(tai) >= net(dien) + 1.5
        ? 'Khả năng kiếm tiền của bạn mạnh hơn khả năng giữ — chỗ cần đầu tư là kỷ luật tích lũy.'
        : net(dien) >= net(tai) + 1.5
          ? 'Khả năng giữ của bạn mạnh hơn khả năng kiếm — bạn tích lũy tốt, chỗ cần đầu tư là mở rộng nguồn thu.'
          : 'Kiếm và giữ khá cân bằng — chỗ cần đầu tư là sự đều đặn.'
    }`,
    move: 'Ngay khi tiền về, tự động chuyển một phần cố định (ví dụ 15–20%) sang tài khoản khó rút hoặc tài sản dài hạn — đừng đợi cuối tháng mới để dành phần còn lại.',
  };
  return [axis1, axis2, axis3, axis4];
}

function stageParas(chart: Chart, d: DaiVanReading, first: boolean) {
  const loc = d.hoa.find((x) => x.hoa === 'Lộc');
  const quyen = d.hoa.find((x) => x.hoa === 'Quyền');
  const ky = d.hoa.find((x) => x.hoa === 'Kỵ');
  const p = chart.palaces[d.branch];
  const out = [`${STAGE_THEME[d.palace]?.theme ?? ''} ${d.summary.replace(/^Chặng này đi qua cung [^,]*, nên chủ đề lớn của 10 năm là chuyện [^.]*\.\s*/, '')}`.trim()];
  if (loc && ky && loc.landsIn !== '—' && ky.landsIn !== '—') {
    out.push(
      `${first ? `Mỗi chặng có Can riêng (chặng này là ${p.stemName}) làm bốn sao trên lá số "đổi màu" trong suốt 10 năm đó — đây là lý do cùng một con người mà có chặng thuận chuyện này, có chặng thuận chuyện khác. ` : `Can của chặng là ${p.stemName}. `}${loc.star} mang Hóa Lộc vào cung ${loc.landsIn}: cơ hội của chặng dễ đến từ ${MONEY_SOURCE[loc.landsIn]}.${
        quyen && quyen.landsIn !== '—' ? ` ${quyen.star} mang Hóa Quyền vào cung ${quyen.landsIn}: bạn có nhiều tiếng nói hơn ở chuyện ${topic(quyen.landsIn)}.` : ''
      } ${ky.star} mang Hóa Kỵ vào cung ${ky.landsIn}: chuyện ${topic(ky.landsIn)} là chỗ cần chuẩn bị kỹ trong cả chặng.`,
    );
  }
  if (p.tuan || p.triet) out.push('Cung của chặng này nằm dưới Tuần/Triệt: kết quả thường đến chậm hơn công sức bỏ ra — kiên nhẫn là lợi thế.');
  return out;
}

function stageAspects(d: DaiVanReading) {
  const th = STAGE_THEME[d.palace];
  if (!th) return [];
  const add = (target: string, base: string) => {
    const extra = d.hoa
      .filter((x) => x.landsIn === target)
      .map((x) =>
        x.hoa === 'Kỵ'
          ? `Hóa Kỵ của chặng rơi đúng cung ${target}: đây là mặt cần làm chắc tay nhất.`
          : `Hóa ${x.hoa} của chặng rơi đúng cung ${target}: mặt này được nâng đỡ rõ.`,
      );
    return [base, ...extra].join(' ');
  };
  return [
    { label: 'Công việc', text: add('Quan Lộc', th.work) },
    { label: 'Tiền bạc', text: add('Tài Bạch', th.money) },
    { label: 'Tình cảm, gia đình', text: add('Phu Thê', th.love) },
    { label: 'Sức khỏe', text: add('Tật Ách', th.health) },
  ];
}

function buildStages(chart: Chart, rd: Reading): Stage[] {
  const dv = rd.daiVan;
  const ci = dv.findIndex((d) => d.current);
  if (ci < 0) return [];
  const pick: [Stage['key'], number, string][] = [
    ['past', ci - 1, 'Chặng vừa qua'],
    ['current', ci, 'Chặng hiện tại'],
    ['next', ci + 1, 'Chặng sắp tới'],
    ['later', ci + 2, 'Chặng sau nữa'],
  ];
  const cur = dv[ci];
  return pick
    .filter(([, i]) => i >= 0 && i < dv.length)
    .map(([key, i, label]) => {
      const d = dv[i];
      const paras = stageParas(chart, d, i === Math.max(0, ci - 1));
      if (key === 'next') {
        paras.push(
          `Khi bước sang chặng này, chủ đề chuyển từ chuyện ${topic(cur.palace)} sang chuyện ${topic(d.palace)}. Việc nên chuẩn bị từ cuối chặng hiện tại: ${lower(MONTH_DO[d.palace])}`,
        );
      }
      return {
        key,
        label,
        title: `${label}: ${d.range[0]}–${d.range[1]} tuổi, cung ${d.palace}`,
        range: d.range,
        palace: d.palace,
        paras,
        aspects: key === 'current' || key === 'next' ? stageAspects(d) : [],
        note:
          key === 'past'
            ? 'Hãy đối chiếu: nếu những nét trên khớp với những gì bạn đã trải qua, phần đọc chặng hiện tại đáng để bạn đọc chậm. Nếu không khớp chút nào, có thể giờ sinh chưa chính xác — hãy thử công cụ Tìm giờ sinh theo sự kiện đời.'
            : undefined,
      };
    });
}

function buildLevers(chart: Chart, rd: Reading): Lever[] {
  const ranked = rd.palaces.filter((p) => p.palace !== 'Tật Ách').sort((a, b) => net(b) - net(a));
  return ranked.slice(0, 3).map((r) => {
    const ls = leadStar(chart, r);
    const st = ls ? STAR_STORY[ls] : undefined;
    const pct = netPercentile(r.palace, net(r));
    const guard = ls ? STAR_GUARD[ls] : undefined;
    const self = ['menh', 'quan', 'tai', 'phuc', 'di'].includes(PALACES[r.palace].domain);
    const goods = r.story.extras.filter((e) => e.good && e.name).map((e) => e.name!).slice(0, 3);
    return {
      palace: r.palace,
      title: `${upper(topic(r.palace))}${st ? ` — ${st.role}` : ''}`,
      strength: `${
        goods.length ? `Cung ${r.palace} được nâng đỡ bởi ${list(goods)}` : `Cung ${r.palace} có nhiều yếu tố hỗ trợ hơn gây khó`
      } (hỗ trợ ${fmtN(r.support)}, gây khó ${fmtN(r.challenge)}${pct !== undefined && pct >= 0.6 ? `; cao hơn khoảng ${Math.round(pct * 100)}% số lá số` : ''}). ${dot(r.story.lead)}`,
      condition: `${self && guard ? guard.rule : (r.advice[0] ?? '')}${
        where(chart, chart.hoa['Kỵ'])?.name === r.palace ? ' Lưu ý: đây cũng là nơi Hóa Kỵ năm sinh đóng — mạnh nhưng cần rõ ràng, xem thêm ở phần điểm mù.' : ''
      }`,
      first: MONTH_DO[r.palace],
      sign: `${upper(DOMAIN_SIGNS[r.palace]?.good ?? '')}.`,
    };
  });
}

function buildBlinds(chart: Chart, rd: Reading): BlindSpot[] {
  const kyPal = where(chart, chart.hoa['Kỵ'])?.name;
  const ranked = rd.palaces.slice().sort((a, b) => net(a) - net(b));
  const chosen: PalaceReading[] = [];
  if (kyPal) chosen.push(rd.palaces.find((p) => p.palace === kyPal)!);
  for (const r of ranked) if (chosen.length < 3 && !chosen.includes(r)) chosen.push(r);
  return chosen.map((r) => {
    const ls = leadStar(chart, r);
    const m = ls ? MAJOR[ls] : undefined;
    const sign = DOMAIN_SIGNS[r.palace];
    const isKy = r.palace === kyPal;
    const self = ['menh', 'quan', 'tai', 'phuc', 'di'].includes(PALACES[r.palace].domain);
    return {
      palace: r.palace,
      title: `${r.palace === 'Mệnh' ? 'Chính bạn (cung Mệnh)' : upper(topic(r.palace))}${isKy ? ' (nơi Hóa Kỵ năm sinh đóng)' : ''}`,
      trigger: `${upper(sign?.trigger ?? '')}.`,
      reaction: m
        ? self
          ? `Bạn dễ phản ứng theo kiểu ${list(m.watch.map(lower))}.`
          : `Ở mối quan hệ này hay gặp: ${list(m.watch.map(lower))} — từ phía người kia, hoặc chính bạn bị cuốn theo.`
        : 'Dễ xoay theo hoàn cảnh, thiếu một hướng rõ.',
      consequence: `Nếu để lâu: ${sign?.consequence ?? ''}.`,
      early: `${upper(self && ls && STAR_GUARD[ls] ? STAR_GUARD[ls].drift : (sign?.early ?? ''))}.`,
      fix: [DOMAIN_CAUTION_ADVICE[PALACES[r.palace].domain], MONTH_AVOID[r.palace]].filter(Boolean).join(' '),
    };
  });
}

const FEAT_TEXT: Record<string, { title: string; text: string; how: string }> = {
  'menhHoa:Lộc': {
    title: 'Hóa Lộc nằm ngay cung Mệnh',
    text: 'Sách cổ coi đây là người "tự mang lộc": cơ hội, lời mời, sự giới thiệu hay tìm đến chính bạn. Ngoài đời, bạn thường được nhớ tới khi có việc tốt.',
    how: 'Chủ động nhận cơ hội nhưng chọn lọc: mỗi năm tự hỏi cơ hội nào thật sự đưa bạn tiến lên, và nói không với phần còn lại.',
  },
  'menhHoa:Quyền': {
    title: 'Hóa Quyền nằm ngay cung Mệnh',
    text: 'Bạn có sẵn khí chất của người nắm quyền chủ động: người khác hay để bạn quyết, và bạn cũng thích tự quyết.',
    how: 'Dùng sức ảnh hưởng để dẫn dắt, không để áp đặt — hỏi ý kiến trước khi chốt sẽ khiến người khác theo bạn lâu hơn.',
  },
  'menhHoa:Khoa': {
    title: 'Hóa Khoa nằm ngay cung Mệnh',
    text: 'Bạn có "vốn uy tín" tự nhiên: người khác dễ tin bạn, và khi gặp khó thường có người giúp.',
    how: 'Giữ uy tín như giữ tài sản: hứa ít, làm đủ; uy tín là thứ sẽ mở cửa cho bạn nhiều lần trong đời.',
  },
  'menhHoa:Kỵ': {
    title: 'Hóa Kỵ nằm ngay cung Mệnh',
    text: 'Bạn là người tự đặt áp lực lên mình nhiều, hay suy nghĩ kỹ về bản thân. Mặt tốt: bạn ít khi chủ quan.',
    how: 'Phân biệt "lo để chuẩn bị" và "lo vì thói quen": viết ra điều đang lo, cái gì làm được thì làm ngay, cái gì không thì gác lại.',
  },
  menhTuan: {
    title: 'Tuần đóng ở cung Mệnh',
    text: 'Cả điểm mạnh lẫn điểm yếu của bạn đều "nhẹ" hơn bề ngoài; nhiều người có Tuần ở Mệnh thấy mình thành công muộn hơn bạn bè nhưng bền hơn.',
    how: 'Đừng so tốc độ với người khác; đo tiến bộ của mình theo chặng 5–10 năm thay vì từng năm.',
  },
  menhTriet: {
    title: 'Triệt đóng ở cung Mệnh',
    text: 'Sách cổ cho rằng nửa đầu đời hay gặp gián đoạn, thay đổi hướng; từ khoảng 30 tuổi trở đi mới "vào guồng".',
    how: 'Coi những lần đổi hướng lúc trẻ là học phí; sau 30, chọn một hướng và đi sâu.',
  },
  menhLocTon: {
    title: 'Lộc Tồn nằm ở cung Mệnh',
    text: 'Bạn có bản năng tích lũy và giữ gìn — tiền, quan hệ, kinh nghiệm đều được bạn giữ lại lâu.',
    how: 'Biến bản năng giữ của thành hệ thống: tiết kiệm tự động, tài sản dài hạn; và nhớ rằng giữ quá chặt cũng làm mất cơ hội.',
  },
  menhMieu: {
    title: 'Sao chính ở cung Mệnh đang sáng nhất',
    text: 'Sao chủ của bạn ở vị trí "Miếu" — như cây trồng đúng đất: nét tốt của sao thể hiện trọn vẹn, ít bị méo.',
    how: 'Chọn môi trường cho phép bạn là chính mình — đó là nơi thế mạnh này sinh lời nhiều nhất.',
  },
  menhHam: {
    title: 'Sao chính ở cung Mệnh đang ở vị trí tối',
    text: 'Sao chủ của bạn ở vị trí "Hãm": nét tốt cần nhiều công hơn mới thể hiện. Nhiều người có cấu trúc này trưởng thành rất mạnh qua thử thách.',
    how: 'Rèn có chủ đích đúng mặt dễ vướng của sao (xem phần Tính cách) — đó là chỗ một chút tiến bộ đem lại thay đổi lớn nhất.',
  },
  'menhSat:2': {
    title: 'Cung Mệnh có nhiều sát tinh',
    text: 'Cung Mệnh có từ hai sát tinh trở lên — sách cổ coi là đời nhiều sóng gió; cách đọc ngày nay: bạn có sức chịu áp lực và dám đối đầu hơn nhiều người.',
    how: 'Chọn những trận đáng đánh; năng lượng mạnh cần một mục tiêu đủ lớn để không quay sang va chạm vặt.',
  },
  'menhCat:3': {
    title: 'Cung Mệnh có nhiều cát tinh',
    text: 'Cung Mệnh có từ ba cát tinh trở lên — bạn có nhiều "điểm tựa": người giúp, quý nhân, lợi thế học hành hoặc giao tiếp.',
    how: 'Đừng ngại nhờ: lợi thế này chỉ phát huy khi bạn chủ động kết nối và đáp lại người giúp mình.',
  },
};

function buildSpecials(chart: Chart, rd: Reading, patterns: PatternHit[], menhKey: string): Special[] {
  const menh = chart.palaces[chart.menhBranch];
  const all = [...menh.majors, ...menh.goodStars, ...menh.badStars, ...menh.others];
  const cands: (Special & { p: number })[] = [];
  const add = (p: number | undefined, title: string, text: string, how: string) => {
    if (p === undefined || p <= 0) return;
    cands.push({ p, title, rarity: `Khoảng ${fmtPct(p)} số lá số có điều này (${oneIn(p)}).`, text, how });
  };
  // 1. Bộ sao cung Mệnh
  const pm = rate(RATES.menhCombo[menhKey]);
  const menhR = rd.palaces.find((x) => x.palace === 'Mệnh')!;
  const ls = leadStar(chart, menhR);
  add(
    pm,
    `Bộ sao cung Mệnh: ${menhKey.replace('vcd:', 'vô chính diệu, mượn ').replace('+', ' – ')}`,
    `${dot(menhR.story.lead)} ${ls && STAR_STORY[ls] ? STAR_STORY[ls].daily[0] : ''}`,
    ls && STAR_GUARD[ls] ? STAR_GUARD[ls].rule : (menhR.advice[0] ?? ''),
  );
  // 2. Cách cục
  for (const x of patterns.filter((p) => p.status === 'du')) {
    const r = RATES.patterns[x.id];
    add(r ? rate(r.du) : undefined, `Cách cục ${x.name}`, `${dot(x.meaning)} Sách cổ xếp cách này là ${x.tone}.`, 'Đọc điều kiện cụ thể ở phần Lá số gốc; dùng cách cục như một gợi ý về thế mạnh, không phải lời hứa.');
  }
  // 3. Đặc điểm cung Mệnh
  for (const h of ['Lộc', 'Quyền', 'Khoa', 'Kỵ'] as const) {
    if (all.some((s) => s.name === chart.hoa[h])) {
      const f = FEAT_TEXT[`menhHoa:${h}`];
      add(featRate(`menhHoa:${h}`), f.title, f.text, f.how);
    }
  }
  if (menh.tuan) add(featRate('menhTuan'), FEAT_TEXT.menhTuan.title, FEAT_TEXT.menhTuan.text, FEAT_TEXT.menhTuan.how);
  if (menh.triet) add(featRate('menhTriet'), FEAT_TEXT.menhTriet.title, FEAT_TEXT.menhTriet.text, FEAT_TEXT.menhTriet.how);
  if (all.some((s) => s.name === 'Lộc Tồn')) add(featRate('menhLocTon'), FEAT_TEXT.menhLocTon.title, FEAT_TEXT.menhLocTon.text, FEAT_TEXT.menhLocTon.how);
  if (menh.majors.some((s) => (s.brightness?.score ?? 0) >= 3)) add(featRate('menhMieu'), FEAT_TEXT.menhMieu.title, FEAT_TEXT.menhMieu.text, FEAT_TEXT.menhMieu.how);
  if (menh.majors.some((s) => (s.brightness?.score ?? 0) <= -2)) add(featRate('menhHam'), FEAT_TEXT.menhHam.title, FEAT_TEXT.menhHam.text, FEAT_TEXT.menhHam.how);
  if (menh.badStars.length >= 2) {
    const k = Math.min(menh.badStars.length, 3);
    const p = (featRate('menhSat:2') ?? 0) + (featRate('menhSat:3') ?? 0);
    add(k >= 2 ? p : undefined, FEAT_TEXT['menhSat:2'].title, FEAT_TEXT['menhSat:2'].text, FEAT_TEXT['menhSat:2'].how);
  }
  if (menh.goodStars.length >= 3) {
    const p = (featRate('menhCat:3') ?? 0) + (featRate('menhCat:4') ?? 0);
    add(p, FEAT_TEXT['menhCat:3'].title, FEAT_TEXT['menhCat:3'].text, FEAT_TEXT['menhCat:3'].how);
  }
  // 4. Cung có mức hỗ trợ hoặc thử thách cực trị (so với 24.000 lá số mô phỏng)
  for (const r of rd.palaces) {
    const pct = netPercentile(r.palace, net(r));
    if (pct === undefined) continue;
    if (pct >= 0.85)
      add(
        1 - pct,
        `Cung ${r.palace}: được nâng đỡ nhiều hơn ${Math.min(99, Math.floor(pct * 100))}% số lá số`,
        `Chỉ khoảng ${fmtPct(1 - pct)} số lá số được nâng đỡ ở cung ${r.palace} nhiều như của bạn. ${dot(r.story.lead)}`,
        r.advice[0] ?? MONTH_DO[r.palace],
      );
    if (pct <= 0.12)
      add(
        pct,
        `Cung ${r.palace}: nhiều thử thách hơn ${Math.min(99, Math.floor((1 - pct) * 100))}% số lá số`,
        `Chỉ khoảng ${fmtPct(pct)} số lá số có mức thử thách ở cung ${r.palace} cao như của bạn. Đây không phải điềm xấu: đây là nơi bạn sẽ học nhiều nhất trong đời, và cũng là nơi sự chủ động tạo khác biệt rõ nhất.`,
        [DOMAIN_CAUTION_ADVICE[PALACES[r.palace].domain], r.advice[0]].filter(Boolean).join(' '),
      );
  }
  // 5. Cung Thân — luôn có, dùng khi chưa đủ ba điều
  const than = chart.palaces[chart.thanBranch].name;
  add(
    rate(RATES.thanCu[than]),
    than === 'Mệnh' ? 'Cung Thân trùng cung Mệnh' : `Cung Thân nằm ở ${than}`,
    than === 'Mệnh'
      ? 'Con người bạn lúc trẻ và lúc lớn tuổi khá nhất quán: điều bạn theo đuổi năm 20 tuổi thường vẫn là điều bạn quan tâm năm 50 tuổi.'
      : `Cung Thân cho biết từ khoảng 30 tuổi bạn dồn tâm sức vào đâu. Với bạn là chuyện ${topic(than)} — nhiều người nhận ra sau 30 tuổi mình thay đổi rõ theo hướng này.`,
    than === 'Mệnh' ? 'Đầu tư sâu vào một hướng dài hạn — sự nhất quán là lợi thế cộng dồn theo thời gian.' : `Chuẩn bị sớm cho chuyện ${topic(than)}: ${lower(MONTH_DO[than])}`,
  );
  cands.sort((a, b) => a.p - b.p);
  const seen = new Set<string>();
  const out: Special[] = [];
  for (const c of cands) {
    if (seen.has(c.title)) continue;
    seen.add(c.title);
    const { p: _p, ...rest } = c;
    void _p;
    out.push(rest);
    if (out.length === 3) break;
  }
  return out;
}

function buildOrder(rd: Reading, stages: Stage[]): { label: string; text: string }[] {
  const y = rd.years[0];
  const cur = stages.find((s) => s.key === 'current');
  const next = stages.find((s) => s.key === 'next');
  const ky = y?.hoa.find((x) => x.hoa === 'Kỵ')?.landsIn;
  return [
    {
      label: 'Làm trước',
      text: `${cur ? `Tận dụng chủ đề của chặng hiện tại (${topic(cur.palace)}): ${lower(MONTH_DO[cur.palace])}` : ''} ${y?.actions[0] ? `Trong năm ${y.canChi}: ${lower(y.actions[0])}` : ''}`.trim(),
    },
    {
      label: 'Làm tiếp',
      text: next
        ? `Chuẩn bị cho chặng ${next.range[0]}–${next.range[1]} tuổi (chủ đề ${topic(next.palace)}): ${lower(MONTH_DO[next.palace])}`
        : 'Giữ nhịp những gì đang làm tốt và rà lại mục tiêu mỗi năm một lần.',
    },
    {
      label: 'Chưa nên làm',
      text: ky && ky !== '—' ? `Trong năm nay, chưa nên quyết vội ở chuyện ${topic(ky)}. ${MONTH_AVOID[ky]}` : 'Chưa nên đưa ra quyết định lớn khi đang mệt hoặc đang bị thúc ép.',
    },
  ];
}

function buildLetter(chart: Chart, rd: Reading, levers: Lever[]) {
  const menh = rd.palaces.find((p) => p.palace === 'Mệnh')!;
  const ranked = rd.palaces.filter((p) => p.palace !== 'Mệnh').sort((a, b) => net(b) - net(a));
  const worst = ranked[ranked.length - 1];
  const cur = rd.daiVan.find((d) => d.current);
  const y = rd.years[0];
  const ls = leadStar(chart, menh);
  const guard = ls ? STAR_GUARD[ls] : undefined;
  return [
    `Gửi ${chart.name || 'bạn'},`,
    `Lá số của bạn kể về một người ${lower(noDot(menh.story.lead)).replace(/^thiên hướng /, 'có thiên hướng ')}. Thế mạnh rõ nhất nằm ở chuyện ${levers[0] ? topic(levers[0].palace) : 'bản thân'}; chỗ cần nhiều công nhất là chuyện ${topic(worst.palace)}. Không có lá số nào hoàn hảo — điều làm nên khác biệt là bạn dùng thế mạnh của mình ra sao.`,
    `${cur ? `Trong chặng ${cur.range[0]}–${cur.range[1]} tuổi này, chủ đề lớn của bạn là chuyện ${topic(cur.palace)}. ` : ''}${y ? `Năm ${y.canChi}, việc đáng làm nhất là: ${lower(noDot(y.actions[0] ?? MONTH_DO[y.thaiTue]))}. ` : ''}${guard ? `Và khi phân vân, hãy nhớ: ${lower(noDot(guard.rule))}.` : ''}`,
    'Một lời thật lòng cuối cùng: Tử Vi là tấm gương để suy ngẫm, không phải bản án. Những gì viết ở đây là xu hướng, không phải định mệnh — quyết định vẫn luôn ở trong tay bạn.',
  ];
}

export function buildLifeReport(chart: Chart, rd: Reading, patterns: PatternHit[], menhKey: string): LifeReport {
  const byName = (n: string) => rd.palaces.find((p) => p.palace === n)!;
  const stages = buildStages(chart, rd);
  const levers = buildLevers(chart, rd);
  const blinds = buildBlinds(chart, rd);
  return {
    portrait: buildPortrait(chart, rd, byName),
    foundation: buildFoundation(chart, rd, patterns),
    axes: buildAxes(chart, byName),
    stages,
    levers,
    blinds,
    order: buildOrder(rd, stages),
    specials: buildSpecials(chart, rd, patterns, menhKey),
    letter: buildLetter(chart, rd, levers),
  };
}

/** Bản Free: thấy mở đầu, nền tảng, chặng vừa qua (để tự kiểm chứng), một điều đặc biệt; phần còn lại chỉ thấy tiêu đề. */
export function lifeToFree(l: LifeReport): LifeReport {
  return {
    ...l,
    portrait: l.portrait.slice(0, 1),
    axes: l.axes.map((a) => ({ ...a, text: '', move: '', locked: true })),
    stages: l.stages.map((s) => (s.key === 'past' ? s : { ...s, paras: s.paras.slice(0, 1), aspects: [], locked: true })),
    levers: l.levers.map((x) => ({ ...x, strength: '', condition: '', first: '', sign: '' })),
    blinds: l.blinds.map((x) => ({ ...x, trigger: '', reaction: '', consequence: '', early: '', fix: '' })),
    order: [],
    // Mở miễn phí một điều đặc biệt mang tính "điểm mạnh" để người đọc thấy giá trị, không mở điểm thử thách.
    specials: (() => {
      const open = Math.max(0, l.specials.findIndex((s) => !s.title.includes('thử thách')));
      return l.specials.map((s, i) => (i === open ? s : { ...s, text: '', how: '', locked: true }));
    })(),
    letter: [],
    locked: true,
  };
}
