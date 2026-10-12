import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeReport } from '../src/lib/report';
import { AI_SECTIONS, addressOf, buildMessages, checkSection, factIssues, generateSection, sectionFacts } from '../src/lib/aiReport';
import { mockCall } from '../src/lib/aiMock';
import type { BirthInput } from '../src/lib/engine/birth';

const input = { gender: 'nu', calendar: 'duong', day: 7, month: 7, year: 1989, timeType: 'branch', branch: 4, place: 'HCM', certainty: 'chinh-xac', name: 'Phùng Trần Nguyệt Ánh' } as BirthInput;
const now = new Date('2026-10-12T10:00:00+07:00');
const rep = computeReport(input, {} as never, true, now);
const ctx = {
  chart: rep.chart,
  reading: rep.fullReading,
  life: rep.fullLife,
  stability: '90% (cao)',
  patterns: rep.patterns.map((p) => ({ name: p.name, status: p.status, tone: p.tone })),
};

test('Xưng hô theo tên và giới tính', () => {
  assert.equal(addressOf(rep.chart, 38).short, 'chị Ánh');
  assert.equal(addressOf(rep.chart, 38).full, 'chị Phùng Trần Nguyệt Ánh');
  assert.equal(addressOf({ ...rep.chart, name: undefined }, 38).short, 'bạn');
  assert.equal(addressOf(rep.chart, 15).short, 'bạn');
});

test('Đủ 19 phần; dữ kiện mỗi phần dựng được và không quá lớn', () => {
  assert.equal(AI_SECTIONS.length, 19);
  for (const s of AI_SECTIONS) {
    const f = sectionFacts(s.key, ctx);
    const json = JSON.stringify(f);
    assert.ok(json.length > 500, s.key);
    assert.ok(json.length < 60000, `${s.key}: ${json.length}`);
    const msg = buildMessages(s.key, f, 'chị Ánh')[0].content;
    assert.ok(msg.includes('Độ dài'), s.key);
  }
  const menh = sectionFacts("cung-menh", ctx) as unknown as { cung_dang_doc: { sao_chinh: string[] } };
  assert.ok(menh.cung_dang_doc.sao_chinh[0].startsWith('Thiên Phủ'));
});

test('Bộ kiểm tra bắt sai vị trí sao, sai độ sáng, từ cấm, bài quá ngắn', () => {
  // Trên lá số này Thiên Phủ ở Mệnh, Thái Âm ở Phụ Mẫu.
  assert.deepEqual(factIssues('Nền tảng là Thiên Phủ ở cung Mệnh.', rep.chart), []);
  assert.equal(factIssues('Thiên Phủ tại Quan Lộc khiến chị…', rep.chart).length, 1);
  assert.deepEqual(factIssues('Năm nay lưu Kình Dương tại Điền Trạch.', rep.chart), []);
  const thaiAm = rep.chart.palaces.flatMap((p) => p.majors).find((s) => s.name === 'Thái Âm')!.brightness!.name;
  const wrong = thaiAm === 'Hãm' ? 'Miếu' : 'Hãm';
  assert.equal(factIssues(`Thái Âm (${wrong}) ở Phụ Mẫu`, rep.chart).length, 1);
  const long = 'Chị là người điềm tĩnh. '.repeat(120);
  assert.ok(checkSection('cung-menh', long, rep.chart).ok);
  assert.ok(!checkSection('cung-menh', long + ' Năm sau chị chắc chắn sẽ giàu.', rep.chart).ok);
  assert.ok(!checkSection('cung-menh', long + ' Net effect là tốt.', rep.chart).ok);
  assert.ok(!checkSection('cung-menh', 'Ngắn quá.', rep.chart).ok);
});

test('Tạo một phần: viết lại khi lần đầu lỗi', async () => {
  let n = 0;
  const call = async () => {
    n++;
    return n === 1 ? 'Chị chắc chắn sẽ phá sản.' : 'Chị là người điềm tĩnh, thích sự ổn định (Thiên Phủ ở Mệnh). '.repeat(60);
  };
  const out = await generateSection('cung-menh', ctx, call);
  assert.equal(n, 2);
  assert.ok(out.check.ok, out.check.issues.join('; '));
});

test('Chế độ giả lập trả về văn bản có nội dung cho mọi phần', async () => {
  for (const s of AI_SECTIONS) {
    const f = sectionFacts(s.key, ctx);
    const t = await mockCall(buildMessages(s.key, f, 'chị Ánh'));
    assert.ok(t.length > 200, s.key);
  }
});
