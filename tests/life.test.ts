import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeReport } from '../src/lib/report';
import type { BirthInput } from '../src/lib/engine/birth';
import { DEFAULT_CONVENTIONS } from '../src/lib/engine/birth';

const base: BirthInput = { gender: 'nu', calendar: 'duong', year: 1989, month: 7, day: 7, timeType: 'branch', branch: 4, certainty: 'chinh-xac', place: 'HCM', name: 'Nguyệt Anh' };
const now = new Date('2026-10-12T10:00:00+07:00');
const banned = /chắc chắn sẽ|tử vong|chết|ly hôn|phá sản|tai nạn|bệnh nặng|ung thư|undefined|\bNaN\b|\[object/;

function allText(l: ReturnType<typeof computeReport>['fullLife']) {
  return [
    ...l.portrait,
    ...l.foundation,
    ...l.axes.flatMap((a) => [a.title, a.text, a.move]),
    ...l.stages.flatMap((s) => [s.title, ...s.paras, ...s.aspects.map((a) => a.text), s.note ?? '']),
    ...l.levers.flatMap((x) => [x.title, x.strength, x.condition, x.first, x.sign]),
    ...l.blinds.flatMap((x) => [x.title, x.trigger, x.reaction, x.consequence, x.early, x.fix]),
    ...l.order.map((o) => o.text),
    ...l.specials.flatMap((s) => [s.title, s.rarity, s.text, s.how]),
    ...l.letter,
  ].join(' ');
}

test('Luận giải trọn đời đủ các phần, dài và cá nhân hóa', () => {
  const r = computeReport(base, DEFAULT_CONVENTIONS, true, now);
  const l = r.fullLife;
  assert.equal(l.portrait.length, 2);
  assert.ok(l.portrait[0].startsWith('Nguyệt Anh'));
  assert.equal(l.axes.length, 4);
  assert.deepEqual(
    l.stages.map((s) => s.key),
    ['past', 'current', 'next', 'later'],
  );
  assert.equal(l.levers.length, 3);
  assert.equal(l.blinds.length, 3);
  assert.equal(l.order.length, 3);
  assert.ok(l.specials.length >= 1);
  assert.equal(l.letter[0], 'Gửi Nguyệt Anh,');
  const words = allText(l).split(/\s+/).length;
  assert.ok(words > 2500, `chỉ có ${words} chữ`);
  // Khớp lá số đối chiếu (Tuvilogy): Mệnh Thiên Phủ, Thân cư Tài Bạch, Hóa Kỵ năm sinh ở Nô Bộc, chặng hiện tại Điền Trạch.
  assert.ok(l.portrait[0].includes('Thiên Phủ'));
  assert.ok(l.blinds[0].title.includes('Hóa Kỵ'));
  assert.equal(l.stages[1].palace, 'Điền Trạch');
});

test('Văn luận giải trọn đời không hù dọa, không lỗi ghép chuỗi (nhiều lá số)', () => {
  for (let y = 1958; y <= 2004; y += 4) {
    for (const g of ['nam', 'nu'] as const) {
      const r = computeReport({ ...base, name: undefined, year: y, gender: g, branch: y % 12, month: (y % 12) + 1 }, DEFAULT_CONVENTIONS, true, now);
      const t = allText(r.fullLife);
      assert.ok(!banned.test(t), `${y} ${g}: ${t.match(banned)?.[0]}`);
      assert.ok(!/\.\./.test(t.replace(/\.\.\./g, '')), `${y} ${g}: dấu chấm đôi`);
      assert.ok(r.fullLife.letter[0] === 'Gửi bạn,');
    }
  }
});

test('Bản Free chỉ lộ mở đầu, chặng vừa qua và một điều đặc biệt', () => {
  const r = computeReport(base, DEFAULT_CONVENTIONS, false, now);
  const l = r.life;
  assert.ok(l.locked);
  assert.equal(l.portrait.length, 1);
  assert.ok(l.axes.every((a) => a.locked && a.text === ''));
  assert.ok(l.stages.filter((s) => !s.locked).every((s) => s.key === 'past'));
  assert.ok(l.levers.every((x) => x.strength === ''));
  assert.equal(l.letter.length, 0);
  assert.equal(l.order.length, 0);
});
