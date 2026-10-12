import type { Chart } from './engine/chart';
import type { Book } from './book';

/** Tiêu đề và dòng thông tin ở bìa cuốn luận giải. */
export function bookHeader(chart: Chart, book: Book) {
  const name = chart.name ? book.address.full.charAt(0).toUpperCase() + book.address.full.slice(1) : 'Lá số Tử Vi của bạn';
  const line = `${chart.gender === 'nam' ? 'Nam' : 'Nữ'}, sinh ${chart.birth.solar.day}/${chart.birth.solar.month}/${chart.birth.solar.year} (âm lịch ${chart.birth.lunar.day}/${chart.birth.lunar.month}${chart.birth.lunar.leap ? ' nhuận' : ''} năm ${chart.canChi.year}), giờ ${chart.canChi.hour.split(' ')[1]}`;
  return { name, line };
}
