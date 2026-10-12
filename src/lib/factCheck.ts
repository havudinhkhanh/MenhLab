/** Kiểm tra sự thật trong văn bản luận giải: "sao X ở cung Y" và độ sáng phải khớp lá số. Dùng trong test. */
import type { Chart, Palace } from './engine/chart';

const PALACE_NAMES = ['Mệnh', 'Huynh Đệ', 'Phu Thê', 'Tử Tức', 'Tài Bạch', 'Tật Ách', 'Thiên Di', 'Nô Bộc', 'Quan Lộc', 'Điền Trạch', 'Phúc Đức', 'Phụ Mẫu'];
const BRIGHT_WORDS: Record<string, string> = { miếu: 'Miếu', vượng: 'Vượng', đắc: 'Đắc', lợi: 'Lợi', bình: 'Bình', hãm: 'Hãm' };

function locate(chart: Chart, star: string): Palace[] {
  return chart.palaces.filter((p) => [...p.majors, ...p.goodStars, ...p.badStars, ...p.others].some((s) => s.name === star));
}

/**
 * Kiểm tra sự thật: "Sao X ở/tại cung Y" phải đúng vị trí trên lá số gốc; "Sao X (Hãm)" / "X hãm địa" phải đúng độ sáng.
 * Bỏ qua các câu nói về sao lưu (lưu Kình Dương, lưu Thái Tuế…) vì sao lưu nằm ở chỗ khác lá số gốc.
 */
export function factIssues(text: string, chart: Chart): string[] {
  const out = new Set<string>();
  const stars = [...new Set(chart.palaces.flatMap((p) => [...p.majors, ...p.goodStars, ...p.badStars].map((s) => s.name)))];
  const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pal = PALACE_NAMES.map(esc).join('|');
  for (const star of stars) {
    const re = new RegExp(`(lưu\\s+|Lưu\\s+)?${esc(star)}(?:\\s*\\([^)]{0,30}\\))?\\s+(?:ở|tại|tọa thủ tại|tọa tại|tọa thủ|tọa|nằm ở|nằm tại|đóng ở|đóng tại|cư)\\s+(?:cung\\s+|ngay\\s+(?:tại\\s+)?(?:cung\\s+)?)?(${pal})(?![\\p{L}])`, 'gu');
    for (const m of text.matchAll(re)) {
      if (m[1]) continue;
      const before = text.slice(Math.max(0, (m.index ?? 0) - 40), m.index ?? 0);
      if (/(lưu|năm nay|năm \d{4}|tháng|đại vận|chặng|của năm|của tháng|của chặng|hóa|Hóa)\s*[^.]{0,25}$/i.test(before) && !/năm sinh/.test(before)) continue;
      const where = locate(chart, star).map((p) => p.name);
      if (!where.includes(m[2])) out.add(`viết "${star} ở ${m[2]}" nhưng trên lá số ${star} nằm ở ${where.join(', ') || 'không có'}`);
    }
    const reB = new RegExp(`${esc(star)}\\s*(?:\\(\\s*(Miếu|Vượng|Đắc|Lợi|Bình|Hãm)[^)]{0,12}\\)|\\s(miếu|vượng|đắc|hãm)\\s+địa)`, 'gu');
    for (const m of text.matchAll(reB)) {
      const said = m[1] ?? BRIGHT_WORDS[m[2]];
      const actual = locate(chart, star)
        .flatMap((p) => [...p.majors, ...p.goodStars, ...p.badStars])
        .find((s) => s.name === star)?.brightness?.name;
      if (actual && said && !actual.startsWith(said)) out.add(`viết ${star} "${said}" nhưng trên lá số là "${actual}"`);
    }
  }
  return [...out];
}

