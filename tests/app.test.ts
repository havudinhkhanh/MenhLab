import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { computeReport } from '../src/lib/report';
import { teaserFor } from '../src/lib/reading';
import { buildChart } from '../src/lib/engine/chart';
import type { BirthInput } from '../src/lib/engine/birth';
import { DEFAULT_CONVENTIONS } from '../src/lib/engine/birth';

const input: BirthInput = {
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

test('Bản Free chỉ lộ cung Mệnh; bản Pro đủ 12 cung', () => {
  const free = computeReport(input, DEFAULT_CONVENTIONS, false).reading;
  const pro = computeReport(input, DEFAULT_CONVENTIONS, true).reading;
  assert.equal(free.palaces.filter((p) => p.paragraphs.length > 0).length, 1);
  assert.equal(free.palaces[0].palace, 'Mệnh');
  assert.ok(free.daiVan.every((d) => d.notes.length === 0));
  assert.equal(pro.palaces.filter((p) => p.paragraphs.length > 0).length, 12);
  assert.ok(pro.daiVan.every((d) => d.notes.length >= 2));
  assert.equal(pro.years.length, 2);
});

test('Không có ngôn ngữ định mệnh hay hù dọa trong luận giải', () => {
  const banned = /chắc chắn sẽ|tử vong|chết|ly hôn|phá sản|tai nạn|bệnh nặng|ung thư/i;
  for (let y = 1960; y <= 2005; y += 3) {
    for (const g of ['nam', 'nu'] as const) {
      const r = computeReport({ ...input, year: y, gender: g, hour: (y * 7) % 24 }, DEFAULT_CONVENTIONS, true).reading;
      const text = [...r.overviewText, ...r.palaces.flatMap((p) => p.paragraphs), ...r.daiVan.flatMap((d) => d.notes), ...r.years.flatMap((x) => x.paragraphs)].join(' ');
      assert.ok(!banned.test(text), `Năm ${y} ${g}: ${text.match(banned)?.[0]}`);
    }
  }
});

test('Teaser email đủ 4 bước, có nội dung', () => {
  const c = buildChart(input);
  for (const step of [1, 2, 3, 4]) {
    const t = teaserFor(c, step);
    assert.ok(t.title.length > 5);
    assert.ok(t.reveal.length >= 1 && t.reveal[0].length > 10);
    assert.ok(t.locked.length > 10);
  }
});

test('Chữ ký webhook payOS: đúng thì nhận, sửa dữ liệu thì từ chối', async () => {
  process.env.PAYOS_CHECKSUM_KEY = 'test-key';
  const { verifyWebhook } = await import('../src/lib/payos-verify');
  const data = { orderCode: 123, amount: 149000, description: 'ML123', code: '00', desc: 'success', reference: 'FT1', counterAccountName: null };
  const str = Object.keys(data)
    .sort()
    .map((k) => `${k}=${(data as Record<string, unknown>)[k] ?? ''}`)
    .join('&');
  const signature = createHmac('sha256', 'test-key').update(str).digest('hex');
  assert.equal(verifyWebhook({ data, signature }), true);
  assert.equal(verifyWebhook({ data: { ...data, amount: 1000 }, signature }), false);
});
