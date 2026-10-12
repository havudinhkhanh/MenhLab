import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildChart } from '../src/lib/engine/chart';
import { buildReading, dauQuanBranch, readMonths, toFree } from '../src/lib/reading';
import { jdFromDate } from '../src/lib/engine/lunar';
import type { BirthInput } from '../src/lib/engine/birth';

const input: BirthInput = {
  gender: 'nu',
  calendar: 'duong',
  year: 1990,
  month: 8,
  day: 15,
  timeType: 'clock',
  hour: 9,
  minute: 30,
  certainty: 'chinh-xac',
  place: 'HN',
};
const chart = buildChart(input);
const jd = (s: string) => {
  const [d, m, y] = s.split('/').map(Number);
  return jdFromDate(d, m, y);
};

test('Đẩu Quân: từ Thái Tuế đếm nghịch tới tháng sinh, rồi đếm thuận tới giờ sinh', () => {
  // Sinh tháng 6 âm, giờ Tỵ (5). Năm Bính Ngọ: Ngọ(6) → nghịch 5 cung = Sửu(1) → thuận 5 cung = Ngọ(6).
  assert.equal(chart.starMonth, 6);
  assert.equal(chart.birth.branch, 5);
  assert.equal(dauQuanBranch(chart, 2026), 6);
  // Năm Đinh Mùi: Mùi(7) → Dần(2) → Mùi(7).
  assert.equal(dauQuanBranch(chart, 2027), 7);
});

test('12 tháng liền mạch theo dương lịch, mỗi tháng tiến một cung', () => {
  for (const y of [2025, 2026, 2027]) {
    const ms = readMonths(chart, y);
    const leap = ms.filter((m) => m.leap).length;
    assert.equal(ms.length, 12 + leap);
    for (let i = 1; i < ms.length; i++) assert.equal(jd(ms[i].from), jd(ms[i - 1].to) + 1, `${y} ${ms[i].label}`);
    for (const m of ms) {
      const days = jd(m.to) - jd(m.from) + 1;
      assert.ok(days === 29 || days === 30, `${m.label} ${days} ngày`);
      assert.ok(m.todo.length >= 1);
      assert.ok(m.evidence.length >= 3);
    }
    const regular = ms.filter((m) => !m.leap);
    const branchOf = (p: string) => chart.palaces.findIndex((x) => x.name === p);
    for (let i = 1; i < 12; i++) assert.equal(branchOf(regular[i].palace), (branchOf(regular[i - 1].palace) + 1) % 12);
  }
  // Năm Ất Tỵ 2025 có tháng 6 nhuận theo lịch Việt Nam.
  const ms25 = readMonths(chart, 2025);
  assert.deepEqual(
    ms25.filter((m) => m.leap).map((m) => m.month),
    [6],
  );
  assert.equal(ms25.find((m) => m.month === 1)!.from, '29/1/2025');
});

test('Đánh dấu tháng hiện tại; bản Free chỉ mở chi tiết tháng hiện tại', () => {
  const r = buildReading(chart, new Date('2026-10-12T10:00:00+07:00'));
  assert.equal(r.years[0].year, 2026);
  const cur = r.years[0].months.filter((m) => m.current);
  assert.equal(cur.length, 1);
  assert.equal(cur[0].label, 'Tháng Chín');
  assert.ok(r.years[0].months.filter((m) => m.past).length === 8);
  const f = toFree(r);
  const open = f.years[0].months.filter((m) => !m.locked);
  assert.deepEqual(
    open.map((m) => m.label),
    ['Tháng Chín'],
  );
  assert.ok(f.years[0].months.every((m) => m.locked ? m.todo.length === 0 && m.evidence.length === 0 && m.focus.length > 0 : true));
});

test('Trước Tết vẫn tính là năm âm lịch cũ', () => {
  const r = buildReading(chart, new Date('2027-01-20T10:00:00+07:00'));
  assert.equal(r.years[0].year, 2026);
  assert.equal(r.years[0].months.find((m) => m.current)?.label, 'Tháng Chạp');
});

test('Lời khuyên theo tháng không dùng ngôn ngữ gây sợ', () => {
  const banned = /chắc chắn sẽ|tử vong|chết|ly hôn|phá sản|tai nạn|bệnh nặng|ung thư/i;
  for (const [d, m, y, h] of [
    [1, 1, 1970, 0],
    [12, 5, 1985, 13],
    [30, 11, 1999, 22],
    [7, 3, 2003, 6],
  ]) {
    const c = buildChart({ ...input, day: d, month: m, year: y, hour: h, gender: y % 2 ? 'nam' : 'nu' });
    for (const yy of [2026, 2027]) {
      for (const mo of readMonths(c, yy)) {
        const text = [mo.focus, ...mo.todo, ...mo.avoid, mo.money ?? '', mo.note ?? ''].join(' ');
        assert.ok(!banned.test(text), text);
      }
    }
  }
});
