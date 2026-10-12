/** Tính toàn bộ dữ liệu cho trang lá số. Chạy được cả ở server lẫn trình duyệt. */
import { buildChart } from './engine/chart';
import { analyzeSensitivity } from './engine/sensitivity';
import type { BirthInput, Conventions } from './engine/birth';
import { buildReading, toFree } from './reading';
import { detectPatterns } from './engine/patterns';
import { derive } from './engine/derivation';
import { comboKey } from '@/content/blind';
import { buildLifeReport, lifeToFree } from './lifeReport';
import { buildBook } from './book';

export function computeReport(input: BirthInput, conv: Conventions, isPro: boolean, now = new Date()) {
  const chart = buildChart(input, conv);
  const full = buildReading(chart, now);
  const sensitivity = analyzeSensitivity(input, conv, chart);
  const menh = chart.palaces[chart.menhBranch];
  const menhKey = menh.majors.length
    ? comboKey(menh.majors.map((s) => s.name), false)
    : comboKey(chart.palaces[(chart.menhBranch + 6) % 12].majors.map((s) => s.name), true);
  const patterns = detectPatterns(chart);
  const life = buildLifeReport(chart, full, patterns, menhKey);
  return {
    chart,
    reading: isPro ? full : toFree(full),
    fullReading: full,
    life: isPro ? life : lifeToFree(life),
    fullLife: life,
    book: isPro ? buildBook(chart, full, life, menhKey) : undefined,
    sensitivity,
    patterns,
    derivation: derive(chart),
    menhKey,
  };
}
