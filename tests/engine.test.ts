import { test } from 'node:test';
import assert from 'node:assert/strict';
import { astro } from 'iztro';
import { lunarToSolar, solarToLunar, leapMonthOfYear } from '../src/lib/engine/lunar';
import { buildChart, tuanPair, trietPair, tieuHanBranch } from '../src/lib/engine/chart';
import { resolveBirth, DEFAULT_CONVENTIONS, type BirthInput } from '../src/lib/engine/birth';
import { CHI } from '../src/lib/engine/canchi';
import { STAR_VI, MUTAGEN_VI, PALACE_VI, TU_HOA, HOA_ORDER } from '../src/lib/engine/names';

const hasHan = (s: string) => /[一-鿿]/.test(s);

test('Tết Nguyên Đán theo lịch Việt Nam', () => {
  assert.deepEqual(solarToLunar(17, 2, 2026), { day: 1, month: 1, year: 2026, leap: false });
  // Năm lịch Việt và lịch Trung Quốc lệch nhau
  assert.deepEqual(solarToLunar(21, 1, 1985), { day: 1, month: 1, year: 1985, leap: false });
  assert.deepEqual(solarToLunar(17, 2, 2007), { day: 1, month: 1, year: 2007, leap: false });
  assert.deepEqual(solarToLunar(29, 1, 2025), { day: 1, month: 1, year: 2025, leap: false });
});

test('Tháng nhuận', () => {
  assert.equal(leapMonthOfYear(2023), 2);
  assert.equal(leapMonthOfYear(2020), 4);
  assert.equal(leapMonthOfYear(2025), 6);
  assert.equal(leapMonthOfYear(2024), 0);
  assert.equal(lunarToSolar(1, 3, 2024, true), null);
});

test('Đổi qua lại dương ↔ âm khớp nhau trên 30.000 ngày', () => {
  for (let y = 1930; y <= 2030; y += 1) {
    for (let m = 1; m <= 12; m += 1) {
      for (const d of [1, 9, 17, 25]) {
        const l = solarToLunar(d, m, y);
        assert.deepEqual(lunarToSolar(l.day, l.month, l.year, l.leap), [d, m, y]);
      }
    }
  }
});

const base: BirthInput = {
  gender: 'nam',
  calendar: 'am',
  year: 1990,
  month: 2,
  day: 19,
  timeType: 'branch',
  branch: 7,
  certainty: 'chinh-xac',
  place: 'HCM',
};

test('Lá số mẫu tính tay: Canh Ngọ, tháng 2 ngày 19, giờ Mùi, nam', () => {
  const c = buildChart(base);
  assert.equal(c.canChi.year, 'Canh Ngọ');
  assert.equal(CHI[c.menhBranch], 'Thân');
  assert.equal(CHI[c.thanBranch], 'Tuất');
  assert.equal(c.cuc.name, 'Thủy Nhị Cục');
  assert.equal(c.banMenh.name, 'Lộ Bàng Thổ');
  const where = (star: string) => CHI[c.palaces.find((p) => p.majors.some((s) => s.name === star))!.branch];
  assert.equal(where('Tử Vi'), 'Tuất');
  assert.equal(where('Thiên Cơ'), 'Dậu');
  assert.equal(where('Thái Dương'), 'Mùi');
  assert.equal(where('Vũ Khúc'), 'Ngọ');
  assert.equal(where('Thiên Đồng'), 'Tỵ');
  assert.equal(where('Liêm Trinh'), 'Dần');
  // Thiên Phủ đối xứng Tử Vi qua trục Dần–Thân: Tử Vi Tuất → Thiên Phủ Ngọ
  assert.equal(where('Thiên Phủ'), 'Ngọ');
  assert.deepEqual(c.triet.map((b) => CHI[b]), ['Ngọ', 'Mùi']);
  assert.deepEqual(c.tuan.map((b) => CHI[b]), ['Tuất', 'Hợi']);
  assert.equal(c.amDuong, 'Dương Nam');
  assert.equal(c.daiVanForward, true);
  assert.deepEqual(c.palaces[c.menhBranch].daiVan, [2, 11]);
  assert.equal(c.palaces[6].thaiTue, 'Thái Tuế');
  assert.equal(c.palaces[c.menhBranch].name, 'Mệnh');
});

test('Tuần, Triệt', () => {
  assert.deepEqual(trietPair(0), [8, 9]); // Giáp → Thân Dậu
  assert.deepEqual(trietPair(9), [0, 1]); // Quý → Tý Sửu
  assert.deepEqual(tuanPair(0, 0), [10, 11]); // Giáp Tý → Tuất Hợi
  assert.deepEqual(tuanPair(0, 10), [8, 9]); // Giáp Tuất → Thân Dậu
  assert.deepEqual(tuanPair(9, 3), [4, 5]); // Quý Mão thuộc tuần Giáp Ngọ → Thìn Tỵ
});

test('Tiểu hạn: tuổi Ngọ khởi Thìn, nam thuận', () => {
  const c = buildChart(base);
  assert.equal(CHI[tieuHanBranch(c, 1)], 'Thìn');
  assert.equal(CHI[tieuHanBranch(c, 2)], 'Tỵ');
});

test('Múi giờ lịch sử: Sài Gòn 1970 (UTC+8)', () => {
  const input: BirthInput = {
    gender: 'nu',
    calendar: 'duong',
    year: 1970,
    month: 5,
    day: 10,
    timeType: 'clock',
    hour: 23,
    minute: 30,
    certainty: 'chinh-xac',
    place: 'HCM',
  };
  const std = resolveBirth(input, DEFAULT_CONVENTIONS);
  assert.equal(CHI[std.branch], 'Hợi');
  assert.equal(std.solar.day, 10);
  const clock = resolveBirth(input, { ...DEFAULT_CONVENTIONS, timeMode: 'dong-ho' });
  assert.equal(CHI[clock.branch], 'Tý');
  assert.equal(clock.solar.day, 11);
  // Hà Nội cùng thời điểm dùng UTC+7
  const hn = resolveBirth({ ...input, place: 'HN' }, DEFAULT_CONVENTIONS);
  assert.equal(CHI[hn.branch], 'Tý');
});

test('Đối chiếu với iztro trên nhiều lá số: Tứ Hóa và tên gọi Việt hóa đầy đủ', () => {
  let count = 0;
  for (let y = 1940; y <= 2020; y += 7) {
    for (let m = 1; m <= 12; m += 3) {
      for (const d of [3, 15, 28]) {
        for (let b = 0; b < 12; b += 5) {
          for (const gender of ['nam', 'nu'] as const) {
            const c = buildChart({ ...base, year: y, month: m, day: d, branch: b, gender });
            const iz = astro.byLunar(`${y}-${m}-${d}`, b, gender === 'nam' ? '男' : '女', false, true, 'zh-CN');
            // Tứ Hóa
            for (const p of iz.palaces) {
              for (const s of [...p.majorStars, ...p.minorStars]) {
                if (s.mutagen) {
                  const vi = STAR_VI[s.name];
                  const hoa = MUTAGEN_VI[s.mutagen];
                  assert.equal(c.hoa[hoa], vi, `${y}-${m}-${d}: Hóa ${hoa}`);
                }
              }
            }
            for (const p of c.palaces) {
              assert.ok(!hasHan(p.name), p.name);
              for (const s of [...p.majors, ...p.goodStars, ...p.badStars, ...p.others]) {
                assert.ok(!hasHan(s.name), `Chưa Việt hóa: ${s.name}`);
              }
              assert.ok(!hasHan(p.trangSinh) && !hasHan(p.bacSi), p.trangSinh + p.bacSi);
            }
            assert.equal(c.palaces.filter((p) => p.majors.length > 0).flatMap((p) => p.majors).length, 14);
            count++;
          }
        }
      }
    }
  }
  assert.ok(count > 500);
  assert.equal(Object.keys(PALACE_VI).length, 12);
  assert.equal(HOA_ORDER.length, 4);
  assert.equal(Object.keys(TU_HOA).length, 10);
});

test('Độ sáng theo hai trường phái', async () => {
  const { vietBrightness } = await import('../src/lib/engine/brightness');
  // Đối chiếu bảng sách Việt (Tý = 0)
  assert.equal(vietBrightness('Tử Vi', 2)?.name, 'Miếu'); // Dần
  assert.equal(vietBrightness('Tử Vi', 0)?.name, 'Bình'); // Tý
  assert.equal(vietBrightness('Thái Dương', 0)?.name, 'Hãm');
  assert.equal(vietBrightness('Tham Lang', 0)?.name, 'Hãm');
  assert.equal(vietBrightness('Thiên Phủ', 0), undefined); // không có trong bảng Việt
  assert.equal(vietBrightness('Thiên Mã', 0), null); // có trong bảng nhưng không ghi ở Tý

  const viet = buildChart(base);
  const tt = buildChart(base, { timeMode: 'chuan', dayChange: '23h', leapRule: 'tach-15', brightness: 'toan-thu' });
  assert.equal(viet.brightnessSchool, 'viet');
  assert.equal(tt.brightnessSchool, 'toan-thu');
  // Cùng cấu trúc, chỉ khác độ sáng
  assert.equal(viet.menhBranch, tt.menhBranch);
  assert.deepEqual(viet.brightnessDiffs, tt.brightnessDiffs);
  for (const d of viet.brightnessDiffs) {
    const p = viet.palaces.find((x) => x.branchName === d.branchName)!;
    const s = [...p.majors, ...p.goodStars, ...p.badStars, ...p.others].find((x) => x.name === d.star)!;
    assert.equal(s.brightness?.name ?? '—', d.viet);
  }
});
