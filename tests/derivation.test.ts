import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildChart } from '../src/lib/engine/chart';
import { derive } from '../src/lib/engine/derivation';
import { detectPatterns, PATTERN_IDS } from '../src/lib/engine/patterns';

test('Các bước an sao tính tay khớp engine trên ~1.300 lá số (kể cả tháng nhuận)', () => {
  let n = 0;
  for (let y = 1951; y <= 2010; y += 4) {
    for (let m = 1; m <= 12; m += 2) {
      for (const d of [1, 2, 9, 14, 17, 22, 29]) {
        for (const b of [0, 5, 11]) {
          const c = buildChart({ gender: y % 2 ? 'nam' : 'nu', calendar: 'am', year: y, month: m, day: d, timeType: 'branch', branch: b, certainty: 'chinh-xac', place: 'HN' });
          for (const s of derive(c)) {
            if (s.check !== undefined) assert.equal(s.check, true, `${y}-${m}-${d} giờ ${b}: bước "${s.title}" lệch engine`);
          }
          n++;
        }
      }
    }
  }
  // Tháng nhuận: 2020 nhuận tháng 4, 2023 nhuận tháng 2, 2025 nhuận tháng 6
  for (const [y, m] of [[2020, 4], [2023, 2], [2025, 6]]) {
    for (const d of [3, 15, 16, 28]) {
      for (const b of [1, 7]) {
        const c = buildChart({ gender: 'nu', calendar: 'am', year: y, month: m, day: d, leapMonth: true, timeType: 'branch', branch: b, certainty: 'chinh-xac', place: 'HN' });
        assert.equal(c.birth.lunar.leap, true);
        for (const s of derive(c)) if (s.check !== undefined) assert.equal(s.check, true, `nhuận ${y}-${m}-${d}: ${s.title}`);
        n++;
      }
    }
  }
  assert.ok(n > 1000);
});

test('Cách cục: điều kiện nhất quán', () => {
  const seen = new Set<string>();
  for (let y = 1951; y <= 2010; y += 3) {
    for (let m = 1; m <= 12; m += 1) {
      for (const b of [0, 3, 6, 9]) {
        const c = buildChart({ gender: 'nam', calendar: 'am', year: y, month: m, day: (y * m) % 29 + 1, timeType: 'branch', branch: b, certainty: 'chinh-xac', place: 'HN' });
        for (const p of detectPatterns(c)) {
          seen.add(p.id);
          if (p.status === 'du') assert.ok(p.conditions.filter((x) => !x.text.includes('tăng cường')).every((x) => x.ok), p.id);
          if (p.id === 'kinh-da-giap-menh') {
            // Kình Đà giáp Mệnh ⇔ Lộc Tồn thủ Mệnh
            assert.ok(c.palaces[c.menhBranch].goodStars.some((s) => s.name === 'Lộc Tồn'));
          }
        }
      }
    }
  }
  // Phần lớn các cách cục đều xuất hiện ít nhất một lần
  assert.ok(seen.size >= PATTERN_IDS.length - 3, `chỉ thấy ${seen.size}/${PATTERN_IDS.length}: thiếu ${PATTERN_IDS.filter((x) => !seen.has(x))}`);
});
