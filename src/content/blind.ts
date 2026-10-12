/**
 * Mô tả cung Mệnh dạng "mù" (ẩn tên sao) — dùng chung cho công cụ tìm giờ sinh và bài kiểm tra ghép cặp mù.
 * Một bộ chính tinh thủ Mệnh = một "khóa", ví dụ "Tử Vi+Thiên Phủ" hoặc "vcd:Thái Dương" (vô chính diệu, mượn đối cung).
 */
import { MAJOR } from './stars';

export function comboKey(stars: string[], borrowed: boolean) {
  return (borrowed ? 'vcd:' : '') + stars.join('+');
}

export function parseKey(key: string): { stars: string[]; borrowed: boolean } {
  const borrowed = key.startsWith('vcd:');
  const body = borrowed ? key.slice(4) : key;
  return { stars: body ? body.split('+') : [], borrowed };
}

export function blindMenhText(key: string): string {
  const { stars, borrowed } = parseKey(key);
  const parts: string[] = [];
  if (borrowed) parts.push('Tính cách khá linh hoạt, dễ thay đổi theo môi trường và những người xung quanh.');
  for (const s of stars) {
    const info = MAJOR[s];
    if (!info) continue;
    parts.push(info.domains.menh ?? info.short);
    parts.push(`Điểm mạnh: ${info.strengths.join('; ').toLowerCase()}. Điểm hay vấp: ${info.watch.join('; ').toLowerCase()}.`);
  }
  return parts.join(' ');
}
