/**
 * Chế độ giả lập AI (AI_MOCK=1) để thử giao diện khi chưa có ANTHROPIC_API_KEY.
 * Ghép lại các nhận định theo quy tắc có trong dữ liệu — KHÔNG phải chất lượng thật của AI.
 */
type Msg = { role: 'user' | 'assistant'; content: string };

function collect(v: unknown, out: string[]) {
  if (typeof v === 'string') {
    if (v.length > 40) out.push(v);
  } else if (Array.isArray(v)) v.forEach((x) => collect(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => collect(x, out));
}

export async function mockCall(messages: Msg[]): Promise<string> {
  const content = messages[messages.length - 1].content;
  const json = content.slice(content.indexOf('{'), content.lastIndexOf('}\n\n') + 1);
  let facts: Record<string, unknown> = {};
  try {
    facts = JSON.parse(json);
  } catch {
    /* bỏ qua */
  }
  const pool: string[] = [];
  const { nghia_sao: _g, ...rest } = facts;
  void _g;
  collect(rest, pool);
  const uniq = [...new Set(pool)];
  const heads = [...content.matchAll(/^### (.+)$/gm)].map((m) => m[1]);
  const paras: string[] = ['[Bản giả lập — bật ANTHROPIC_API_KEY để AI viết thật.]'];
  const per = Math.max(2, Math.ceil(uniq.length / Math.max(1, heads.length || 5)));
  if (heads.length) {
    heads.forEach((h, i) => {
      paras.push(`### ${h.replace(/ — .*/, '')}`);
      paras.push(uniq.slice(i * per, i * per + per).join(' ') || '…');
    });
  } else {
    for (let i = 0; i < 5; i++) paras.push(uniq.slice(i * per, i * per + per).join(' ') || '…');
    if (content.includes('Tự kiểm chứng')) paras.push('Tự kiểm chứng: Điều này có đúng với bạn không? Lần gần nhất bạn thấy rõ điều này là khi nào?');
  }
  return paras.join('\n\n');
}
