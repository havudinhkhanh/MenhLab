import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildChart } from '../src/lib/engine/chart';
import { buildReading, toFree } from '../src/lib/reading';
import type { BirthInput } from '../src/lib/engine/birth';
import { STAR_STORY } from '../src/content/story';
import { MAJOR } from '../src/content/stars';

const base: BirthInput = {
  gender: 'nam',
  calendar: 'duong',
  year: 1988,
  month: 9,
  day: 3,
  timeType: 'clock',
  hour: 8,
  minute: 20,
  certainty: 'chinh-xac',
  place: 'HN',
};
const banned = /chắc chắn sẽ|tử vong|chết|ly hôn|phá sản|tai nạn|bệnh nặng|ung thư|undefined|NaN/i;

test('Đủ nội dung kể chuyện cho cả 14 chính tinh', () => {
  for (const s of Object.keys(MAJOR)) {
    const st = STAR_STORY[s];
    assert.ok(st, s);
    for (const k of ['essence', 'work', 'money', 'love'] as const) assert.ok(st[k].length > 120, `${s}.${k}`);
    assert.equal(st.daily.length, 3, s);
  }
});

test('Mỗi cung có câu hỏi, câu trả lời ngắn, ít nhất 2 đoạn diễn giải và lý do', () => {
  const r = buildReading(buildChart(base), new Date('2026-10-12T10:00:00+07:00'));
  for (const p of r.palaces) {
    assert.ok(p.story.q.length > 5, p.palace);
    assert.ok(p.story.lead.length > 15, p.palace);
    assert.ok(p.story.paras.length >= 2, `${p.palace}: ${p.story.paras.length} đoạn`);
    assert.ok(p.story.verdict.startsWith('Cộng lại'), p.palace);
    assert.ok(p.story.why.length >= 3, p.palace);
  }
  const menh = r.palaces[0];
  assert.ok(menh.story.daily.length === 3);
  assert.ok(r.years[0].story.length >= 3);
});

test('Văn diễn giải không có ngôn ngữ hù dọa, không lỗi ghép chuỗi', () => {
  for (let y = 1955; y <= 2006; y += 3) {
    for (const g of ['nam', 'nu'] as const) {
      const r = buildReading(buildChart({ ...base, year: y, gender: g, hour: (y * 5) % 24, month: (y % 12) + 1 }), new Date('2026-10-12T10:00:00+07:00'));
      const text = [
        ...r.palaces.flatMap((p) => [p.story.lead, ...p.story.paras, ...p.story.daily, ...p.story.extras.map((e) => e.text), p.story.verdict, ...p.story.why]),
        ...r.years.flatMap((x) => x.story),
        ...r.daiVan.map((d) => d.summary),
      ].join(' ');
      assert.ok(!banned.test(text), `Năm ${y} ${g}: ${text.match(banned)?.[0]}`);
      assert.ok(!/\.\./.test(text.replace(/\.\.\./g, '')), `Năm ${y} ${g}: dấu chấm đôi`);
    }
  }
});

test('Bản Free: cung Mệnh đầy đủ; cung khác chỉ có câu hỏi và câu trả lời ngắn', () => {
  const f = toFree(buildReading(buildChart(base), new Date('2026-10-12T10:00:00+07:00')));
  assert.ok(f.palaces[0].story.paras.length >= 2);
  for (const p of f.palaces.slice(1)) {
    assert.ok((p as { locked?: boolean }).locked);
    assert.ok(p.story.lead.length > 0);
    assert.equal(p.story.paras.length, 0);
    assert.equal(p.story.extras.length, 0);
  }
});
