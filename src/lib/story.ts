/**
 * Bộ "kể chuyện": biến dữ kiện lá số thành đoạn văn có lý do và ví dụ.
 * Mỗi câu trả lời 3 điều: sao này là gì → áp vào lĩnh vực này nghĩa là gì → trong đời thường trông ra sao.
 */
import { tamPhuong, type Chart, type Hoa, type Palace, type Star } from './engine/chart';
import { PALACES, type DomainKey } from '@/content/palaces';
import { MAJOR } from '@/content/stars';
import { BAD_STAR_HEALTH, STAR_BODY, STAR_DOMAIN_EXTRA } from '@/content/plain';
import { BRIGHT_STORY, HOA_STORY, MINOR_STORY, PALACE_QUESTION, STAR_STORY } from '@/content/story';
import { DOMAIN_SIGNS, STAR_GUARD } from '@/content/report';
import { slug } from './engine/names';

export interface StoryExtra {
  text: string;
  good: boolean;
  /** Tên sao (kèm Hóa nếu có), dùng để tóm tắt. */
  name?: string;
}

export interface PalaceStory {
  /** Câu hỏi đời thường làm tiêu đề. */
  q: string;
  /** Cung này nói về điều gì. */
  about: string;
  /** Câu trả lời ngắn (1 câu). */
  lead: string;
  /** Các đoạn diễn giải. */
  paras: string[];
  /** Biểu hiện đời thường (chủ yếu cho cung Mệnh). */
  daily: string[];
  /** Các yếu tố đi kèm, mỗi yếu tố đã được giải nghĩa. */
  extras: StoryExtra[];
  /** Kết luận: cộng lại thì sao. */
  verdict: string;
  /** "Vì sao lá số nói vậy", bằng lời thường. */
  why: string[];
  /** Cung này liên hệ với các cung khác thế nào. */
  links: string;
  /** Dấu hiệu bạn đang lệch hướng ở lĩnh vực này. */
  drift: string;
  /** Nguyên tắc nên giữ (chỉ ở các cung nói về chính bạn). */
  rule: string;
  /** Bài đọc thêm trong Kho kiến thức. */
  readMore: { label: string; href: string }[];
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const upper = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const dot = (s: string) => (/[.!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);
const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} và ${xs[xs.length - 1]}`);

/** Chủ đề đời thường của từng lĩnh vực, dùng trong câu "áp vào chuyện …". */
export const DOMAIN_TOPIC: Record<DomainKey, string> = {
  menh: 'tính cách',
  huynh: 'quan hệ anh chị em, người cộng sự',
  phuthe: 'tình cảm, hôn nhân',
  tutuc: 'con cái và những gì bạn nuôi dưỡng',
  tai: 'tiền bạc',
  tat: 'sức khỏe',
  di: 'cách bạn ra ngoài xã hội',
  no: 'bạn bè, đồng nghiệp, khách hàng',
  quan: 'công việc',
  dien: 'nhà cửa, tài sản',
  phuc: 'đời sống tinh thần',
  phumau: 'quan hệ với cha mẹ, cấp trên',
};

export function starInDomainPlain(star: string, domain: DomainKey): string {
  return domainSentence(star, domain);
}

function domainSentence(star: string, domain: DomainKey): string {
  return MAJOR[star]?.domains[domain] ?? STAR_DOMAIN_EXTRA[star]?.[domain] ?? '';
}

/** Câu giải thích độ sáng, nói đúng theo lĩnh vực đang đọc. */
function brightLine(s: Star, domain: DomainKey): string {
  if (!s.brightness) return '';
  const st = STAR_STORY[s.name];
  const b = BRIGHT_STORY[s.brightness.name];
  if (!b) return '';
  let t = `Về độ sáng: ${s.name} ${b}.`;
  const sc = s.brightness.score;
  if (domain === 'menh' && st) {
    if (sc >= 2) t += ` ${st.bright}`;
    else if (sc <= -1) t += ` ${st.dim}`;
  } else if (sc >= 2) t += ' Vì vậy những mặt thuận nói ở trên dễ thể hiện hơn mặt dễ vướng.';
  else if (sc <= -1) t += ' Vì vậy mặt dễ vướng nói ở trên dễ lộ ra hơn — đây là chỗ nên để ý nhiều hơn người khác.';
  return t;
}

function hoaOn(chart: Chart, s: Star): Hoa | undefined {
  return (Object.entries(chart.hoa).find(([, n]) => n === s.name)?.[0] as Hoa | undefined) ?? s.hoa;
}

/** Ở các cung "người khác", sao trên cung phác họa người ở phía bên kia hoặc không khí mối quan hệ. */
const OTHER_PEOPLE: Partial<Record<DomainKey, string>> = {
  huynh: 'anh chị em, người cộng sự của bạn',
  tutuc: 'con cái (hoặc học trò, những người được bạn dìu dắt)',
  no: 'bạn bè, đồng nghiệp, khách hàng quanh bạn',
  phumau: 'cha mẹ, cấp trên của bạn',
};

/** Đoạn "áp vào lĩnh vực" cho chính tinh chủ. */
function domainParagraph(star: Star, domain: DomainKey): string[] {
  const st = STAR_STORY[star.name];
  const m = MAJOR[star.name];
  if (!st || !m) return [];
  const ds = domainSentence(star.name, domain);
  const good = list(m.strengths.map(lower));
  const watch = list(m.watch.map((w) => lower(w).replace(/^đôi khi /, '')));
  switch (domain) {
    case 'menh':
      return [`${st.essence} Áp vào bạn: ${lower(dot(ds))} ${st.seen}`];
    case 'quan':
      return [st.work];
    case 'tai':
      return [st.money];
    case 'phuthe':
      return [
        st.love,
        `Theo cách đọc truyền thống, sao ở cung Phu Thê cũng phác họa kiểu người bạn hay bị thu hút: người có nét ${good}. Mặt bạn nên chuẩn bị tinh thần là ${watch}.`,
      ];
    case 'tat': {
      const b = STAR_BODY[star.name];
      return b
        ? [
            `Sách Tử Vi xưa gắn mỗi sao với một vùng cơ thể; ${star.name} được gắn với ${b.organs}. Đây không phải dự báo bạn sẽ bị bệnh gì — chưa có bằng chứng nào cho thấy lá số đoán được bệnh. Hãy đọc như một lời nhắc nhẹ về vùng nên chăm sóc: ${b.habit}.`,
          ]
        : [];
    }
    case 'di':
      return [`Khi bạn ở ngoài — đi làm xa, gặp người lạ, vào môi trường mới — nét người khác dễ thấy ở bạn là ${good}. Mặt dễ lộ ra khi xa nhà là ${watch}.`];
    case 'dien':
      return [`Không khí trong nhà và cách bạn lo chuyện nhà cửa mang màu sắc của ${star.name}: ${good}; nhưng cũng dễ có lúc ${watch}.`];
    case 'phuc':
      return [`Điều nuôi dưỡng tinh thần bạn mang màu sắc của ${star.name}: ${good}. Điều dễ làm bạn bất an từ bên trong: ${watch}.`];
    default: {
      const who = OTHER_PEOPLE[domain];
      return [
        `Theo cách đọc truyền thống, sao ở cung này phác họa ${who ?? 'người ở phía bên kia'} và không khí của mối quan hệ: thường ${good}; đôi khi ${watch}. Bạn có thể đối chiếu xem điều này đúng tới đâu.`,
      ];
    }
  }
}

/** Phụ tinh nào đáng nói ở từng lĩnh vực (Tật Ách chỉ nói sao liên quan sức khỏe). */
const HEALTH_RELEVANT = new Set(['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp', 'Thiên Đức', 'Nguyệt Đức', 'Giải Thần', 'Thiên Phúc', 'Thiên Hình']);

export function narratePalace(
  chart: Chart,
  branch: number,
  ctx: { combo?: string; support: number; challenge: number },
): PalaceStory {
  const p = chart.palaces[branch];
  const info = PALACES[p.name];
  const domain = info.domain;
  const pq = PALACE_QUESTION[p.name];
  const tp = tamPhuong(branch);
  const opp = chart.palaces[tp.opposite];
  const borrowed = p.majors.length === 0;
  const majors = borrowed ? opp.majors : p.majors;
  const lead0 = majors[0];
  const paras: string[] = [];
  const why: string[] = [];

  // 1. Sao chính là gì
  const brights: string[] = [];
  if (!majors.length) {
    paras.push('Cung này và cả cung đối diện đều không có sao chính — lĩnh vực này của bạn rất linh hoạt, phụ thuộc nhiều vào hoàn cảnh và các sao phụ đi kèm.');
  } else if (borrowed) {
    const names = majors.map((s) => s.name);
    const withRole = majors.map((s) => (STAR_STORY[s.name] ? `${s.name} (${STAR_STORY[s.name].role})` : s.name));
    paras.push(
      `Cung ${p.name} của bạn không có sao chính (sách gọi là "vô chính diệu"). Khi đó, Tử Vi đọc theo sao ở cung đối diện chiếu sang — với bạn là ${list(withRole)}. Hiểu nôm na: ${domain === 'menh' ? 'tính cách của bạn' : 'lĩnh vực này'} không có một "màu" cố định, nó dễ thay đổi theo hoàn cảnh và người ở cạnh bạn; nét của ${list(names)} có nhưng nhạt hơn so với khi sao nằm ngay trong cung.`,
    );
  } else {
    const parts = majors.map((s) => {
      const st = STAR_STORY[s.name];
      return st ? `${s.name} — ${st.role}, ${st.image}` : s.name;
    });
    paras.push(`Ở cung ${p.name} của bạn có ${majors.length === 2 ? 'hai sao chính' : 'sao chính'}: ${parts.join('; và ')}.`);
    for (const s of domain === 'tat' ? [] : majors) {
      const bl = brightLine(s, domain);
      if (bl) brights.push(bl);
    }
  }

  // 2. Áp vào lĩnh vực
  if (lead0) paras.push(...domainParagraph(lead0, domain));
  if (majors[1] && domain !== 'tat') {
    const ds = domainSentence(majors[1].name, domain);
    const st2 = STAR_STORY[majors[1].name];
    if (ds && st2) paras.push(`Đi cùng là ${majors[1].name} (${st2.role}), thêm một sắc thái: ${lower(dot(ds))}`);
  }
  if (domain === 'tat' && majors[1]) {
    const b = STAR_BODY[majors[1].name];
    if (b) paras.push(`${majors[1].name} được gắn với ${b.organs} — lời nhắc: ${b.habit}.`);
  }
  if (ctx.combo && ['menh', 'quan', 'tai', 'di'].includes(domain)) paras.push(`Hai sao này đi cùng nhau là một bộ quen thuộc trong sách: ${lower(dot(ctx.combo))}`);
  paras.push(...brights);

  // 3. Các yếu tố đi kèm (trong cung và từ cung đối diện), mỗi sao một dòng đã giải nghĩa.
  const extras: StoryExtra[] = [];
  const seen = new Set<string>();
  const addFrom = (pal: Palace, from: 'self' | 'opp') => {
    const prefix = from === 'self' ? '' : `Từ cung đối diện (${pal.name}) chiếu sang: `;
    for (const s of [...pal.majors, ...pal.goodStars, ...pal.badStars, ...pal.others]) {
      if (seen.has(s.name)) continue;
      const h = hoaOn(chart, s);
      const ms = MINOR_STORY[s.name];
      const strongMinor = pal.goodStars.includes(s) || pal.badStars.includes(s);
      const useMinor = !!ms && (from === 'self' || strongMinor) && (domain !== 'tat' || HEALTH_RELEVANT.has(s.name));
      if (!h && !useMinor) continue;
      seen.add(s.name);
      if (domain === 'tat' && useMinor && !ms!.good && BAD_STAR_HEALTH[s.name]) {
        extras.push({ text: `${prefix}${s.name} (${ms!.role}): ${BAD_STAR_HEALTH[s.name]}.`, good: false, name: s.name });
        continue;
      }
      if (h && useMinor) {
        const hs = HOA_STORY[h];
        extras.push({ text: `${prefix}${s.name} (${ms!.role}) lại mang Hóa ${h} (${hs.role}): ${ms!.adds}; thêm vào đó, ${hs.adds}.`, good: hs.good, name: `${s.name} hóa ${h}` });
      } else if (h) {
        const hs = HOA_STORY[h];
        extras.push({ text: `${prefix}${s.name} mang Hóa ${h} (${hs.role}): ${domain === 'menh' ? 'với bản thân bạn' : `ở chuyện ${DOMAIN_TOPIC[domain]}`}, ${hs.adds}.`, good: hs.good, name: `${s.name} hóa ${h}` });
      } else {
        extras.push({ text: `${prefix}${s.name} (${ms!.role}): ${ms!.adds}.`, good: ms!.good, name: s.name });
      }
    }
  };
  addFrom(p, 'self');
  addFrom(opp, 'opp');
  const extrasShown = [...extras.filter((e) => e.good).slice(0, 5), ...extras.filter((e) => !e.good).slice(0, 4)];

  // 4. Kết luận
  const net = ctx.support - ctx.challenge;
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ','));
  const subject = domain === 'menh' ? 'cung Mệnh của bạn' : `chuyện ${DOMAIN_TOPIC[domain]}`;
  let verdict =
    net >= 1.5
      ? domain === 'menh'
        ? `Cộng lại, cung Mệnh của bạn được nâng đỡ tốt: yếu tố hỗ trợ (${fmt(ctx.support)}) nhiều hơn rõ yếu tố gây khó (${fmt(ctx.challenge)}). Nói cách khác, bạn có sẵn nhiều điểm tựa — người giúp, uy tín, cơ hội — để phát huy tính cách này.`
        : `Cộng lại, ${subject} là mặt thuận lợi của bạn: yếu tố hỗ trợ (${fmt(ctx.support)}) nhiều hơn rõ yếu tố gây khó (${fmt(ctx.challenge)}). Đây là chỗ nên dựa vào.`
      : net <= -1.5
        ? `Cộng lại, ${subject} là nơi bạn gặp nhiều thử thách hơn: yếu tố gây khó (${fmt(ctx.challenge)}) nhiều hơn yếu tố hỗ trợ (${fmt(ctx.support)}). Không có nghĩa là xấu — đây thường là chỗ bạn phải chủ động hơn người, và cũng là chỗ bạn trưởng thành nhiều nhất.`
        : `Cộng lại, ${subject} có thuận có khó khá cân bằng (hỗ trợ ${fmt(ctx.support)}, gây khó ${fmt(ctx.challenge)}): kết quả phụ thuộc vào cách bạn làm nhiều hơn là vào lá số.`;
  if (p.tuan || p.triet) {
    const which = [p.tuan && 'Tuần', p.triet && 'Triệt'].filter(Boolean).join(' và ');
    verdict += ` Cung này còn nằm dưới ${which} — một "tấm chắn" trên lá số: cả cái tốt lẫn cái khó ở đây đều nhẹ bớt, kết quả thường đến chậm hơn mong đợi${p.triet ? ' (rõ nhất trước khoảng 30 tuổi)' : ''}.`;
  }
  if (p.isBody && p.name !== 'Mệnh') {
    verdict += ` Cung Thân của bạn cũng nằm ở đây: từ khoảng 30 tuổi trở đi, ${DOMAIN_TOPIC[domain]} là chuyện bạn dồn nhiều tâm sức nhất.`;
  } else if (p.isBody) {
    verdict += ' Cung Thân nằm cùng cung Mệnh: bạn sống khá nhất quán, tính cách lúc trẻ và lúc lớn tuổi ít khác nhau.';
  }

  // Câu trả lời ngắn
  let lead: string;
  if (!lead0) lead = 'Lĩnh vực linh hoạt, phụ thuộc nhiều vào hoàn cảnh.';
  else {
    const ds = domainSentence(lead0.name, domain);
    lead = ds ? dot(upper(ds)) : dot(upper(STAR_STORY[lead0.name]?.role ?? ''));
    if (borrowed) lead = `Khá linh hoạt, dễ đổi theo hoàn cảnh. ${lead}`;
  }

  // Vì sao — lời thường
  why.push(`Cung ${p.name} nằm ở ô ${p.branchName} trên bảng lá số.`);
  if (majors.length) {
    why.push(
      borrowed
        ? `Ô này không có sao chính nên mượn sao từ ô đối diện (${opp.branchName}): ${majors.map((s) => s.name).join(', ')}.`
        : `Sao chính trong ô: ${majors.map((s) => `${s.name}${s.brightness ? ` — độ sáng ${s.brightness.name}` : ''}`).join('; ')}.`,
    );
  }
  why.push(
    `Tử Vi không đọc một ô riêng lẻ mà đọc cùng ô đối diện (${opp.name}) và hai ô "tam hợp" (${chart.palaces[tp.trine[0]].name}, ${chart.palaces[tp.trine[1]].name}). Sao tốt, sao khó trong cung tính 1 điểm; ở ba cung kia tính nửa điểm. Tổng: hỗ trợ ${fmt(ctx.support)}, gây khó ${fmt(ctx.challenge)}.`,
  );
  if (p.tuan || p.triet) why.push(`${[p.tuan && 'Tuần', p.triet && 'Triệt'].filter(Boolean).join(', ')} nằm ở cạnh ô này.`);

  // Liên hệ với các cung khác
  const desc = (pal: Palace) =>
    pal.majors.length
      ? `${pal.majors.map((x) => x.name).join(', ')} — ${STAR_STORY[pal.majors[0].name]?.role ?? ''}`
      : 'không có sao chính';
  const t1 = chart.palaces[tp.trine[0]];
  const t2 = chart.palaces[tp.trine[1]];
  const topicOf = (pal: Palace) => DOMAIN_TOPIC[PALACES[pal.name].domain];
  const links = `Trong Tử Vi, không cung nào đứng một mình. ${domain === 'menh' ? 'Con người bạn' : `Chuyện ${DOMAIN_TOPIC[domain]}`} còn chịu ảnh hưởng từ cung đối diện — ${opp.name} (${desc(opp)}) — và hai cung "tam hợp": ${t1.name} (${desc(t1)}) và ${t2.name} (${desc(t2)}). Nói đơn giản: ${domain === 'menh' ? 'con người bạn' : `chuyện ${DOMAIN_TOPIC[domain]}`} thường gắn với ${topicOf(opp)}, ${topicOf(t1)} và ${topicOf(t2)}; khi một trong ba chuyện đó thay đổi, chuyện này cũng dễ đổi theo.`;

  // Dấu hiệu lệch hướng và nguyên tắc
  const self = ['menh', 'quan', 'tai', 'phuc', 'di'].includes(domain);
  const guard = lead0 ? STAR_GUARD[lead0.name] : undefined;
  const sign = DOMAIN_SIGNS[p.name];
  const drift =
    self && guard
      ? `Dấu hiệu bạn đang lệch hướng: khi ${guard.drift}. Lúc đó hãy dừng lại một nhịp và xem lại.`
      : sign
        ? `Dấu hiệu cần để ý: khi ${sign.trigger}, bạn dễ ${sign.consequence}. Nhận ra sớm là đã tránh được một nửa.`
        : '';
  const rule = self && guard ? guard.rule : '';
  const readMore = [
    { label: `Cung ${p.name} là gì?`, href: `/tu-dien#${slug(`Cung ${p.name}`)}` },
    ...majors.slice(0, 2).map((x) => ({ label: `Sao ${x.name} ở cung ${p.name}`, href: `/sao/${slug(x.name)}/${slug(p.name)}` })),
    ...(p.tuan || p.triet ? [{ label: 'Tuần, Triệt là gì?', href: '/hoc/tam-phuong-tuan-triet' }] : []),
    ...(extras.some((e) => e.text.includes('Hóa ')) ? [{ label: 'Tứ Hóa là gì?', href: '/hoc/tu-hoa' }] : []),
  ].slice(0, 4);

  return {
    links,
    drift,
    rule,
    readMore,
    q: pq?.q ?? `Cung ${p.name}`,
    about: pq?.about ?? info.short,
    lead,
    paras: paras.filter(Boolean),
    daily: domain === 'menh' && lead0 ? (STAR_STORY[lead0.name]?.daily ?? []) : [],
    extras: extrasShown,
    verdict,
    why,
  };
}
