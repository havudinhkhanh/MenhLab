import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  candidateCharts,
  rectify,
  scoreEvent,
  traitDescriptions,
  EVENT_KINDS,
  type EventKind,
  type LifeEvent,
} from '../src/lib/engine/rectify';
import { DEFAULT_CONVENTIONS } from '../src/lib/engine/birth';
import { tieuHanBranch } from '../src/lib/engine/chart';

const base = { gender: 'nu', calendar: 'duong', year: 1985, month: 6, day: 12, place: 'HCM' } as const;
const ALL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

test('Tiểu hạn kích hoạt đúng một canh giờ cho mỗi sự kiện', () => {
  const charts = candidateCharts(base, ALL, DEFAULT_CONVENTIONS);
  const e: LifeEvent = { kind: 'ket-hon', year: 2012 };
  let hits = 0;
  for (const c of charts.values()) {
    const th = c.palaces[tieuHanBranch(c, 2012 - c.birth.lunar.year + 1)];
    const r = scoreEvent(c, e);
    if (th.name === 'Phu Thê') {
      hits++;
      assert.ok(r.reasons.some((x) => x.startsWith('Tiểu hạn năm 2012 ở cung Phu Thê')));
    }
  }
  assert.equal(hits, 1);
});

test('Mô tả tính cách ẩn tên sao và phủ đủ mọi canh giờ', () => {
  const charts = candidateCharts(base, ALL, DEFAULT_CONVENTIONS);
  const d = traitDescriptions(charts);
  assert.deepEqual(d.flatMap((x) => x.branches).sort((a, b) => a - b), ALL);
  const names = ['Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh', 'Thiên Phủ', 'Thái Âm', 'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương', 'Thất Sát', 'Phá Quân'];
  for (const x of d) for (const n of names) assert.ok(!x.text.includes(n), `Lộ tên sao ${n} trong mô tả ${x.letter}`);
});

test('Sự kiện khớp quy tắc của một canh giờ → canh giờ đó đứng đầu', () => {
  const charts = candidateCharts(base, ALL, DEFAULT_CONVENTIONS);
  const truth = 7;
  const tc = charts.get(truth)!;
  const kinds = Object.keys(EVENT_KINDS) as EventKind[];
  const events: LifeEvent[] = [];
  for (let y = 2004; y <= 2025 && events.length < 8; y++) {
    for (const k of kinds) {
      if (events.length < 8 && !events.some((e) => e.year === y) && scoreEvent(tc, { kind: k, year: y }).points >= 3) events.push({ kind: k, year: y });
    }
  }
  assert.ok(events.length >= 6, `chỉ tạo được ${events.length} sự kiện`);
  const r = rectify(base, ALL, events, {}, DEFAULT_CONVENTIONS, 2026);
  assert.equal(r.candidates[0].branch, truth);
  assert.notEqual(r.verdict, 'chua-du');
});

test('Ít hơn 3 sự kiện thì không kết luận', () => {
  const r = rectify(base, ALL, [{ kind: 'ket-hon', year: 2012 }], {}, DEFAULT_CONVENTIONS, 2026);
  assert.equal(r.verdict, 'chua-du');
  assert.ok(r.warnings.length > 0);
});
