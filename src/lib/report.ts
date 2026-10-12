/** Tính toàn bộ dữ liệu cho trang lá số. Chạy được cả ở server lẫn trình duyệt. */
import { buildChart } from './engine/chart';
import { analyzeSensitivity } from './engine/sensitivity';
import type { BirthInput, Conventions } from './engine/birth';
import { buildReading, toFree } from './reading';

export function computeReport(input: BirthInput, conv: Conventions, isPro: boolean, now = new Date()) {
  const chart = buildChart(input, conv);
  const full = buildReading(chart, now);
  const sensitivity = analyzeSensitivity(input, conv, chart);
  return { chart, reading: isPro ? full : toFree(full), fullReading: full, sensitivity };
}
