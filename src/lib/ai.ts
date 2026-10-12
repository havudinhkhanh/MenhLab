/**
 * Luận giải tổng hợp bằng AI (chỉ cho gói Pro, tùy chọn).
 * Nếu không cấu hình ANTHROPIC_API_KEY, gói Pro vẫn có đầy đủ luận giải theo quy tắc.
 *
 * AI chỉ được dùng dữ kiện có trong lá số và các nhận định đã có dẫn chứng —
 * không tự "bịa" sao hay quy tắc. Mọi câu trả lời phải dẫn căn cứ.
 */
import type { Chart } from './engine/chart';
import type { Reading } from './reading';

const SYSTEM = `Bạn là người diễn giải lá số Tử Vi cho MệnhLab — một dịch vụ theo hướng nâng cao hiểu biết, minh bạch và tỉnh táo.

Quy tắc bắt buộc:
1. Chỉ dựa vào dữ kiện lá số và các nhận định có dẫn chứng được cung cấp. Không thêm sao, cách cục hay quy tắc không có trong dữ liệu.
2. Mỗi nhận định quan trọng kèm căn cứ trong ngoặc, ví dụ: (Thiên Cơ Vượng tại Quan Lộc).
3. Dùng ngôn ngữ xu hướng: "thiên hướng", "dễ", "có thể". Không bao giờ nói "chắc chắn", "định mệnh".
4. Không chẩn đoán bệnh, không dự đoán tai nạn, tử vong, ly hôn, phá sản, ngày giờ cụ thể của sự kiện. Về sức khỏe: được nêu bộ phận cơ thể mà sách Tử Vi gắn với sao (đã có trong dữ liệu) như một lời nhắc, kèm thói quen nên giữ và khuyên khám định kỳ — không nói "bạn sẽ bị bệnh X". Không khuyên mua bán chứng khoán, tài sản cụ thể; nếu được hỏi, nói rõ cần hỏi chuyên gia.
9. Viết cụ thể, tránh chung chung: nói rõ tiền đến từ đâu, dễ hao vì đâu, nên làm gì — dựa đúng vào các mục tien_bac, cong_viec, suc_khoe trong dữ liệu. Câu ngắn, từ ngữ đời thường, không dùng thuật ngữ khi không cần.
5. Nhắc nhẹ một lần rằng Tử Vi là hệ thống văn hóa để tự suy ngẫm, chưa được khoa học kiểm chứng về khả năng dự đoán.
6. Biến mỗi điểm "cần để ý" thành một gợi ý hành động cụ thể, tích cực.
7. Viết tiếng Việt tự nhiên, ấm áp, dễ hiểu cho người chưa biết thuật ngữ; giải thích thuật ngữ khi dùng lần đầu.
8. Nếu giờ sinh không chắc chắn (độ ổn định thấp), nói rõ phần nào có thể thay đổi.`;

function facts(chart: Chart, reading: Reading, stability?: string) {
  return JSON.stringify(
    {
      gioi_tinh: chart.gender === 'nam' ? 'Nam' : 'Nữ',
      nam_sinh: chart.canChi.year,
      am_lich: chart.birth.lunar,
      gio: chart.canChi.hour,
      do_on_dinh_gio_sinh: stability,
      tong_quan: reading.overview.map((o) => `${o.label}: ${o.value}`),
      tu_hoa_nam_sinh: chart.hoa,
      cung: reading.palaces.map((p) => ({
        cung: p.palace,
        than_cu: p.isBody,
        nhan_dinh: p.paragraphs,
        dan_chung: p.evidence,
      })),
      dai_van: reading.daiVan.map((d) => ({ tuoi: d.range, cung: d.palace, hien_tai: d.current, ghi_chu: d.notes })),
      luu_nien: reading.years.map((y) => ({
        nam: y.year,
        can_chi: y.canChi,
        tom_tat: y.summary,
        tien_bac: y.money,
        cong_viec: y.work,
        tinh_cam: y.love,
        gia_dinh: y.family,
        suc_khoe: y.health,
        viec_nen_lam: y.actions,
        can_cu: y.evidence,
        tung_thang: y.months
          .filter((m) => !m.locked && !m.past)
          .map((m) => ({ thang: m.label, duong_lich: `${m.from}–${m.to}`, cung: m.palace, nhip: m.tone, nen_lam: m.todo, nen_tranh: m.avoid, tien: m.money })),
      })),
      tuoi_mu_hien_tai: reading.currentAge,
    },
    null,
    0,
  );
}

export const aiEnabled = () => !!process.env.ANTHROPIC_API_KEY;

async function call(messages: { role: 'user' | 'assistant'; content: string }[], maxTokens: number): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5',
      max_tokens: maxTokens,
      system: SYSTEM,
      messages,
    }),
  });
  if (!res.ok) throw new Error(`AI lỗi ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as { content: { type: string; text?: string }[] };
  return data.content
    .filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('\n')
    .trim();
}

export async function aiSynthesis(chart: Chart, reading: Reading, stability?: string): Promise<string> {
  return call(
    [
      {
        role: 'user',
        content: `Dữ liệu lá số (JSON):\n${facts(chart, reading, stability)}\n\nHãy viết bản luận giải tổng hợp khoảng 1000–1400 chữ, gồm các phần có tiêu đề (dòng bắt đầu bằng "## "):\n## Bạn là người thế nào\n## Công việc và cách kiếm tiền\n## Năm nay: tiền đến từ đâu, dễ hao ở đâu\n## Năm nay: công việc, tình cảm, gia đình\n## Sức khỏe: lời nhắc theo lá số\n## Các tháng tới: tháng nào nên làm gì\n## 10 năm hiện tại\n## Năm việc nên làm ngay\nKhông dùng bảng. Không dùng in đậm.`,
      },
    ],
    2500,
  );
}

export async function aiAnswer(
  chart: Chart,
  reading: Reading,
  question: string,
  history: { q: string; a: string }[],
): Promise<string> {
  const msgs: { role: 'user' | 'assistant'; content: string }[] = [
    { role: 'user', content: `Dữ liệu lá số (JSON):\n${facts(chart, reading)}\n\nTôi sẽ hỏi một số câu về lá số này.` },
    { role: 'assistant', content: 'Tôi đã đọc lá số. Bạn cứ hỏi.' },
  ];
  for (const h of history.slice(-4)) {
    msgs.push({ role: 'user', content: h.q }, { role: 'assistant', content: h.a });
  }
  msgs.push({ role: 'user', content: `${question.slice(0, 600)}\n\n(Trả lời tối đa 250 chữ, dẫn căn cứ trong ngoặc.)` });
  return call(msgs, 900);
}
