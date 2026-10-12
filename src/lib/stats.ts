/** Thống kê nhỏ cho trang Nghiên cứu: khoảng tin cậy Wilson và kiểm định nhị thức một phía. */

export function wilson(k: number, n: number, z = 1.96): [number, number] {
  if (n === 0) return [0, 1];
  const p = k / n;
  const d = 1 + (z * z) / n;
  const c = p + (z * z) / (2 * n);
  const r = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
  return [Math.max(0, (c - r) / d), Math.min(1, (c + r) / d)];
}

function logFactorial(n: number): number {
  let s = 0;
  for (let i = 2; i <= n; i++) s += Math.log(i);
  return s;
}

/** P(X ≥ k) với X ~ Binomial(n, p): xác suất đạt từ k lần đúng trở lên nếu chỉ đoán ngẫu nhiên. */
export function binomTailGE(k: number, n: number, p: number): number {
  if (k <= 0) return 1;
  if (k > n) return 0;
  const lf = logFactorial(n);
  let total = 0;
  let lfi = logFactorial(k);
  let lfni = logFactorial(n - k);
  for (let i = k; i <= n; i++) {
    total += Math.exp(lf - lfi - lfni + i * Math.log(p) + (n - i) * Math.log(1 - p));
    lfi += Math.log(i + 1);
    if (n - i > 0) lfni -= Math.log(n - i);
  }
  return Math.min(1, total);
}

/** Cỡ mẫu cần để phát hiện tỷ lệ p1 so với p0 (một phía, α = 0,05, power = 0,8). */
export function sampleSize(p0: number, p1: number): number {
  const za = 1.645;
  const zb = 0.842;
  const n = ((za * Math.sqrt(p0 * (1 - p0)) + zb * Math.sqrt(p1 * (1 - p1))) / (p1 - p0)) ** 2;
  return Math.ceil(n);
}
