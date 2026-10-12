import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeReport } from '../src/lib/report';
import { factIssues } from '../src/lib/factCheck';
import type { BirthInput } from '../src/lib/engine/birth';

const now = new Date('2026-10-12T10:00:00+07:00');
const make = (y: number, g: 'nam' | 'nu', name?: string) =>
  computeReport({ gender: g, calendar: 'duong', day: (y % 27) + 1, month: (y % 12) + 1, year: y, timeType: 'branch', branch: y % 12, place: 'HN', certainty: 'chinh-xac', name } as BirthInput, {} as never, true, now);
const banned = /chắc chắn sẽ|tử vong|chết|ly hôn|phá sản|tai nạn|bệnh nặng|ung thư|undefined|\bNaN\b|\[object|\bAI\b/;

test('Bản luận giải trọn đời: 19 phần, đủ dài, mỗi cung 5 đoạn + tự kiểm chứng', () => {
  const r = make(1989, 'nu', 'Phùng Trần Nguyệt Ánh');
  const b = r.book!;
  assert.equal(b.sections.length, 19);
  assert.ok(b.words > 11000, `${b.words} chữ`);
  const palaces = b.sections.filter((s) => s.key.startsWith('cung-'));
  assert.equal(palaces.length, 12);
  for (const s of palaces) {
    assert.ok(s.blocks.filter((x) => x.t === 'p').length >= 3, s.title);
    assert.ok(s.blocks.some((x) => x.t === 'decision'), s.title);
    assert.ok(s.blocks.some((x) => x.t === 'check'), s.title);
    const words = s.blocks.reduce((a, x) => a + x.text.split(' ').length, 0);
    assert.ok(words > 380, `${s.title}: ${words} chữ`);
  }
  assert.equal(b.address.short, 'chị Ánh');
});

test('Xưng hô: mỗi phần gọi tên một lần, không còn "bạn" ở ngôi thứ hai', () => {
  const b = make(1985, 'nam', 'Nguyễn Văn Minh').book!;
  for (const s of b.sections.filter((x) => x.key.startsWith('cung-'))) {
    const t = s.blocks.map((x) => x.text).join(' ');
    assert.ok(t.includes('anh Minh') || t.includes('Anh Minh'), s.title);
    const stray = [...t.matchAll(/(^|[^\p{L}])[Bb]ạn(?![\p{L}])(\s+\S+)?/gu)]
      .map((m) => m[0])
      .filter((x) => !/bạn\s+(bè|đời|thân|đồng|hàng|cùng|ngang|cũ|vui|lâu|"cùng)/i.test(x) && !/bạn[,.;:)]/.test(x));
    assert.deepEqual(stray, [], s.title);
  }
  // Không tên → giữ "bạn".
  assert.equal(make(1985, 'nam').book!.address.short, 'bạn');
});

test('Không ngôn ngữ hù dọa, không lỗi ghép chuỗi, không ghi sai vị trí hay độ sáng sao', () => {
  for (let y = 1960; y <= 2004; y += 4) {
    for (const g of ['nam', 'nu'] as const) {
      const r = make(y, g, g === 'nam' ? 'Lê Hoàng Nam' : 'Võ Thị Hoa');
      const text = r.book!.sections.flatMap((s) => [s.title, ...s.blocks.map((x) => x.text)]).join('\n');
      assert.ok(!banned.test(text), `${y} ${g}: ${text.match(banned)?.[0]}`);
      assert.ok(!/\s,|\.\.(?!\.)|\(\s*\)/.test(text), `${y} ${g}: ${text.match(/.{30}(\s,|\.\.(?!\.)|\(\s*\)).{20}/)?.[0]}`);
      assert.deepEqual(factIssues(text, r.chart), [], `${y} ${g}`);
    }
  }
});

test('Bản Free không có sách', () => {
  const f = computeReport({ gender: 'nam', calendar: 'duong', day: 1, month: 1, year: 1990, timeType: 'branch', branch: 3, place: 'HN', certainty: 'chinh-xac' } as BirthInput, {} as never, false, now);
  assert.equal(f.book, undefined);
});
