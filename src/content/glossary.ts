/**
 * Từ điển thuật ngữ. Mỗi mục có `short` (hiện khi chạm vào thuật ngữ trên lá số)
 * và `long` (trang Từ điển). Viết cho người chưa từng đọc sách Tử Vi.
 */
import { slug } from '@/lib/engine/names';
import { HOA_INFO, MAJOR, MINOR } from './stars';
import { PALACES } from './palaces';

export type TermGroup =
  | 'nen-tang'
  | 'cung'
  | 'chinh-tinh'
  | 'phu-tinh'
  | 'tu-hoa'
  | 'do-sang'
  | 'van-han'
  | 'vong-sao'
  | 'khoa-hoc';

export const GROUP_LABEL: Record<TermGroup, string> = {
  'nen-tang': 'Nền tảng',
  cung: '12 cung',
  'chinh-tinh': '14 chính tinh',
  'phu-tinh': 'Phụ tinh',
  'tu-hoa': 'Tứ Hóa',
  'do-sang': 'Độ sáng của sao',
  'van-han': 'Vận hạn theo thời gian',
  'vong-sao': 'Các vòng sao',
  'khoa-hoc': 'Đọc lá số cho tỉnh táo',
};

export interface Term {
  key: string;
  term: string;
  group: TermGroup;
  short: string;
  long?: string;
  example?: string;
}

const BASE: Omit<Term, 'key'>[] = [
  {
    term: 'Lá số Tử Vi',
    group: 'nen-tang',
    short: 'Bản đồ 12 ô (cung) vẽ vị trí khoảng 100 "sao" theo năm, tháng, ngày, giờ sinh âm lịch.',
    long: 'Tử Vi Đẩu Số là hệ thống chiêm tinh phương Đông hình thành khoảng thế kỷ 10–13, phổ biến ở Việt Nam qua sách của các tác giả như Thái Thứ Lang. "Sao" ở đây phần lớn là sao ảo — điểm tính toán theo quy tắc, không phải vị trí thiên thể thật trên bầu trời lúc bạn sinh (trừ Mặt Trời, Mặt Trăng trên danh nghĩa).',
  },
  {
    term: 'Thiên Can',
    group: 'nen-tang',
    short: '10 ký hiệu đánh số chu kỳ: Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý.',
    long: 'Can kết hợp với Chi tạo thành chu kỳ 60 (lục thập hoa giáp) dùng để gọi tên năm, tháng, ngày, giờ. Can năm sinh quyết định Tứ Hóa, Lộc Tồn, Kình Dương, Đà La, Triệt...',
  },
  {
    term: 'Địa Chi',
    group: 'nen-tang',
    short: '12 ký hiệu: Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi — cũng là tên 12 ô trên lá số.',
    long: 'Mỗi ô trên lá số mang tên một Địa Chi, cố định vị trí: Tý ở dưới giữa, chạy thuận chiều kim đồng hồ. Chi còn dùng đặt tên 12 con giáp và 12 canh giờ.',
  },
  {
    term: 'Can Chi',
    group: 'nen-tang',
    short: 'Cách gọi năm/tháng/ngày/giờ bằng một Can + một Chi, ví dụ năm Bính Ngọ (2026).',
  },
  {
    term: 'Ngũ Hành',
    group: 'nen-tang',
    short: 'Năm loại năng lượng: Kim, Mộc, Thủy, Hỏa, Thổ, với quan hệ sinh (nuôi dưỡng) và khắc (kiềm chế).',
    long: 'Tương sinh: Mộc → Hỏa → Thổ → Kim → Thủy → Mộc. Tương khắc: Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc. Đây là mô hình triết học cổ để phân loại, không phải hóa học.',
  },
  {
    term: 'Nạp Âm',
    group: 'nen-tang',
    short: 'Hành của cặp Can Chi năm sinh, ví dụ Canh Ngọ = Lộ Bàng Thổ (đất ven đường).',
    long: 'Mỗi cặp năm trong 60 năm được gán một hành kèm hình ảnh (Hải Trung Kim — vàng trong biển, Lư Trung Hỏa — lửa trong lò...). Đây là "Bản Mệnh" mà người Việt hay nói "mệnh Thổ, mệnh Kim".',
  },
  {
    term: 'Bản Mệnh',
    group: 'nen-tang',
    short: 'Hành nạp âm của năm sinh — cái "mệnh Kim/Mộc/Thủy/Hỏa/Thổ" thường nghe.',
  },
  {
    term: 'Cục',
    group: 'nen-tang',
    short: 'Hành của cung Mệnh (Thủy Nhị, Mộc Tam, Kim Tứ, Thổ Ngũ, Hỏa Lục). Con số là tuổi bắt đầu đại vận đầu tiên.',
    long: 'Cục tính từ Can Chi của cung Mệnh. Cục quyết định vị trí sao Tử Vi (từ đó an 13 chính tinh còn lại) và tuổi khởi đại vận: Thủy Nhị Cục khởi từ 2 tuổi, Hỏa Lục Cục từ 6 tuổi.',
  },
  {
    term: 'Quan hệ Mệnh – Cục',
    group: 'nen-tang',
    short: 'So hành của Cục với hành Bản Mệnh. Sách cổ cho rằng Cục sinh Mệnh là thuận, Cục khắc Mệnh là kém thuận.',
    long: 'Đây là một quy tắc tổng quát của sách cổ, ảnh hưởng nhỏ so với các sao trong cung. MệnhLab hiển thị để bạn biết, không dùng để kết luận tốt xấu.',
  },
  {
    term: 'Âm Dương Nam Nữ',
    group: 'nen-tang',
    short: 'Năm sinh có Can dương (Giáp, Bính, Mậu, Canh, Nhâm) hay âm, kết hợp giới tính. Quyết định chiều chạy của đại vận.',
    long: 'Dương Nam và Âm Nữ: đại vận chạy thuận chiều kim đồng hồ. Âm Nam và Dương Nữ: chạy ngược. Vì vậy giới tính là thông tin bắt buộc khi lập lá số.',
  },
  {
    term: 'Âm dương thuận lý / nghịch lý',
    group: 'nen-tang',
    short: 'Tính âm dương của năm sinh có trùng với cung Mệnh không. Trùng là thuận lý.',
  },
  {
    term: 'Cung',
    group: 'nen-tang',
    short: 'Mỗi ô trong 12 ô của lá số, đại diện một lĩnh vực đời sống (Mệnh, Tài Bạch, Quan Lộc...).',
  },
  {
    term: 'Cung Thân',
    group: 'nen-tang',
    short: 'Cung thứ hai quan trọng sau Mệnh, nói về con người bạn ở nửa sau cuộc đời. "Thân cư Quan Lộc" nghĩa là Thân nằm cùng ô với Quan Lộc.',
    long: 'Cung Thân không có ô riêng mà nằm chung với một trong sáu cung: Mệnh, Phu Thê, Tài Bạch, Thiên Di, Quan Lộc, Phúc Đức. Lĩnh vực mà Thân cư thường là nơi bạn đặt nhiều tâm sức, nhất là từ khoảng 30–35 tuổi.',
  },
  {
    term: 'Chính tinh',
    group: 'nen-tang',
    short: '14 sao chính quyết định "tính cách" của từng cung: Tử Vi, Thiên Cơ, Thái Dương, Vũ Khúc...',
  },
  {
    term: 'Phụ tinh',
    group: 'nen-tang',
    short: 'Các sao phụ bổ sung sắc thái cho cung: cát tinh (hỗ trợ), sát tinh (thử thách) và nhiều sao nhỏ khác.',
  },
  {
    term: 'Lục Cát Tinh',
    group: 'nen-tang',
    short: 'Sáu sao hỗ trợ: Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt.',
  },
  {
    term: 'Lục Sát Tinh',
    group: 'nen-tang',
    short: 'Sáu sao thử thách: Kình Dương, Đà La, Hỏa Tinh, Linh Tinh, Địa Không, Địa Kiếp.',
    long: 'Sát tinh không đồng nghĩa với tai họa. Chúng biểu thị áp lực, xung đột, biến động — cũng là nơi tạo ra sức bật. Nhiều lá số "đẹp" trên giấy lại thiếu động lực vì không có sát tinh.',
  },
  {
    term: 'Vô Chính Diệu',
    group: 'nen-tang',
    short: 'Cung không có chính tinh nào. Khi đọc, mượn chính tinh ở cung đối diện (xung chiếu).',
    long: 'Cung vô chính diệu thường được hiểu là lĩnh vực đó linh hoạt, dễ chịu ảnh hưởng hoàn cảnh. Mệnh vô chính diệu không phải xấu — chỉ là "trang giấy" dễ viết lên hơn.',
  },
  {
    term: 'Tam phương tứ chính',
    group: 'nen-tang',
    short: 'Khi đọc một cung, phải xem cả cung đối diện và hai cung tam hợp (cách 4 ô) — tổng cộng 4 cung.',
    long: 'Ví dụ cung Mệnh ở Thân thì tam phương tứ chính gồm Thân (bản cung), Dần (xung chiếu), Tý và Thìn (tam hợp). Cung Mệnh luôn tam hợp với Tài Bạch và Quan Lộc, xung chiếu Thiên Di — vì vậy bốn cung này được đọc cùng nhau.',
  },
  {
    term: 'Xung chiếu',
    group: 'nen-tang',
    short: 'Cung đối diện (cách 6 ô) chiếu ảnh hưởng thẳng vào cung đang xét.',
  },
  {
    term: 'Tam hợp',
    group: 'nen-tang',
    short: 'Hai cung cách 4 ô về hai phía, tạo tam giác hỗ trợ với cung đang xét.',
  },
  {
    term: 'Giáp cung',
    group: 'nen-tang',
    short: 'Hai cung kẹp hai bên một cung. Ví dụ "giáp Tả Hữu" là hai bên có Tả Phù và Hữu Bật.',
  },
  {
    term: 'Tuần',
    group: 'nen-tang',
    short: 'Tuần Trung Không Vong: vạch nằm giữa hai cung, làm giảm/đổi chiều tác động của sao trong hai cung đó, kéo dài suốt đời.',
    long: 'Tuần tính theo năm sinh: trong mỗi tuần 10 năm (Giáp Tý → Quý Dậu...) có hai Địa Chi bị "thiếu Can", đó là vị trí Tuần. Sao tốt gặp Tuần giảm tốt, sao xấu gặp Tuần giảm xấu. Đây là đặc trưng của Tử Vi Việt Nam: Tuần và Triệt vẽ giữa hai cung.',
  },
  {
    term: 'Triệt',
    group: 'nen-tang',
    short: 'Triệt Lộ Không Vong: như Tuần nhưng mạnh hơn và thường ảnh hưởng rõ ở nửa đầu đời (trước khoảng 30 tuổi).',
    long: 'Triệt tính theo Can năm sinh. Giáp/Kỷ: Thân–Dậu; Ất/Canh: Ngọ–Mùi; Bính/Tân: Thìn–Tỵ; Đinh/Nhâm: Dần–Mão; Mậu/Quý: Tý–Sửu.',
  },
  {
    term: 'Mệnh Chủ',
    group: 'nen-tang',
    short: 'Ngôi sao "đại diện" theo vị trí cung Mệnh — một thông tin phụ, ít ảnh hưởng luận giải.',
  },
  {
    term: 'Thân Chủ',
    group: 'nen-tang',
    short: 'Ngôi sao "đại diện" theo năm sinh — thông tin phụ.',
  },
  {
    term: 'Canh giờ',
    group: 'nen-tang',
    short: 'Một ngày chia 12 canh giờ, mỗi canh 2 tiếng. Giờ Tý: 23:00–01:00, Sửu: 01:00–03:00...',
    long: 'Chỉ cần lệch canh giờ là lá số đổi hoàn toàn (cung Mệnh dời sang ô khác). Vì vậy MệnhLab hỏi kỹ giờ sinh và có phần "Độ nhạy giờ sinh".',
  },
  {
    term: 'Giờ Tý và ranh giới ngày',
    group: 'nen-tang',
    short: 'Sinh 23:00–24:00: đa số tính sang ngày hôm sau (đổi ngày lúc 23h). Một số trường phái vẫn tính ngày cũ.',
  },
  {
    term: 'Tháng nhuận',
    group: 'nen-tang',
    short: 'Năm âm lịch có 13 tháng thì một tháng lặp lại gọi là tháng nhuận. Cách tính cho người sinh tháng nhuận có nhiều trường phái.',
    long: 'Phổ biến nhất: 15 ngày đầu tháng nhuận tính như tháng trước, từ ngày 16 tính sang tháng sau. Trường phái khác tính trọn như tháng chính. MệnhLab mặc định cách đầu và cho xem lá số theo cách thứ hai.',
  },
  {
    term: 'Múi giờ lịch sử',
    group: 'nen-tang',
    short: 'Việt Nam từng dùng UTC+8 và UTC+9. Ví dụ miền Nam 1960–1975 dùng UTC+8: giờ đồng hồ khi đó nhanh hơn giờ chuẩn 1 tiếng.',
    long: 'Người sinh ở Sài Gòn lúc 23:30 năm 1970 thực ra sinh 22:30 theo giờ chuẩn — khác canh giờ (Hợi chứ không phải Tý). Rất nhiều lá số bị lệch vì bỏ qua điều này. MệnhLab tự hiệu chỉnh theo cơ sở dữ liệu múi giờ quốc tế (IANA).',
  },
  {
    term: 'Giờ Mặt Trời thực',
    group: 'nen-tang',
    short: 'Giờ tính theo vị trí Mặt Trời tại đúng nơi sinh, khác giờ đồng hồ vài phút đến vài chục phút.',
    long: 'Múi giờ UTC+7 lấy kinh tuyến 105°Đ. Ở TP.HCM (106,7°Đ), Mặt Trời "sớm" hơn khoảng 7 phút; thêm vào đó trái đất quay quanh Mặt Trời theo quỹ đạo elip nên có "phương trình thời gian" lệch tới ±16 phút theo mùa. Một số trường phái dùng giờ này; mặc định MệnhLab dùng giờ chuẩn và cho bạn so sánh.',
  },
  {
    term: 'Lịch âm Việt Nam và Trung Quốc',
    group: 'nen-tang',
    short: 'Hai lịch tính theo hai múi giờ khác nhau nên có năm lệch ngày, thậm chí lệch tháng (ví dụ Tết 1985).',
  },
];

const VAN_HAN: Omit<Term, 'key'>[] = [
  {
    term: 'Đại vận',
    group: 'van-han',
    short: 'Giai đoạn 10 năm, mỗi giai đoạn "đi qua" một cung. Còn gọi là đại hạn.',
    long: 'Đại vận đầu tiên bắt đầu tại cung Mệnh, ở tuổi bằng số Cục. Đọc đại vận là đọc cung đó như "chủ đề" của 10 năm, kết hợp với lá số gốc.',
  },
  { term: 'Tiểu hạn', group: 'van-han', short: 'Cung đại diện cho từng năm tuổi, tính theo tuổi và giới tính.' },
  { term: 'Lưu niên', group: 'van-han', short: 'Ảnh hưởng của năm hiện tại (ví dụ năm Bính Ngọ 2026) lên lá số gốc.' },
  { term: 'Lưu Thái Tuế', group: 'van-han', short: 'Cung mang Địa Chi của năm đang xét — "trọng tâm" của năm đó.' },
  {
    term: 'Lưu Tứ Hóa',
    group: 'van-han',
    short: 'Tứ Hóa tính theo Can của năm đang xét, cho biết năm đó "kích hoạt" sao nào.',
  },
  { term: 'Tuổi mụ', group: 'van-han', short: 'Tuổi tính theo âm lịch: lúc sinh đã 1 tuổi, mỗi Tết thêm 1 tuổi. Tử Vi dùng tuổi mụ.' },
];

const VONG: Omit<Term, 'key'>[] = [
  {
    term: 'Vòng Tràng Sinh',
    group: 'vong-sao',
    short: '12 giai đoạn của một vòng đời (Tràng Sinh, Mộc Dục, Quan Đới... Tuyệt, Thai, Dưỡng) rải quanh lá số, bắt đầu theo Cục.',
    long: 'Đánh dấu "sinh khí" của mỗi cung: Tràng Sinh, Lâm Quan, Đế Vượng là giai đoạn mạnh; Suy, Bệnh, Tử, Mộ, Tuyệt là giai đoạn yếu; Thai, Dưỡng là giai đoạn ươm mầm.',
  },
  {
    term: 'Vòng Bác Sĩ',
    group: 'vong-sao',
    short: '12 sao khởi từ Lộc Tồn: Bác Sĩ, Lực Sĩ, Thanh Long, Tiểu Hao, Tướng Quân, Tấu Thư, Phi Liêm, Hỷ Thần, Bệnh Phù, Đại Hao, Phục Binh, Quan Phủ.',
  },
  {
    term: 'Vòng Thái Tuế',
    group: 'vong-sao',
    short: '12 sao khởi từ cung mang Chi năm sinh: Thái Tuế, Thiếu Dương, Tang Môn, Thiếu Âm, Quan Phù, Tử Phù, Tuế Phá, Long Đức, Bạch Hổ, Phúc Đức, Điếu Khách, Trực Phù.',
    long: 'Vòng này nói về thái độ, quan điểm sống. Bộ "Thái Tuế – Quan Phù – Bạch Hổ" tạo tam hợp thường được hiểu là người có chính kiến, lý lẽ.',
  },
];

const KHOA_HOC: Omit<Term, 'key'>[] = [
  {
    term: 'Hiệu ứng Barnum',
    group: 'khoa-hoc',
    short: 'Xu hướng thấy mô tả chung chung (ai cũng đúng) là "rất đúng với mình".',
    long: 'Năm 1948, nhà tâm lý học Bertram Forer đưa cho sinh viên một bài "phân tích tính cách" giống hệt nhau; trung bình họ chấm độ chính xác 4,3/5. Câu như "bạn có nhiều tiềm năng chưa khai thác" đúng với hầu hết mọi người. Khi đọc lá số, hãy tự hỏi: câu này có đúng với người khác không?',
  },
  {
    term: 'Thiên kiến xác nhận',
    group: 'khoa-hoc',
    short: 'Ta nhớ những lần "đoán trúng" và quên những lần đoán trật.',
  },
  {
    term: 'Lời tiên tri tự ứng nghiệm',
    group: 'khoa-hoc',
    short: 'Tin rằng năm nay xấu có thể khiến ta hành động rụt rè — và kết quả xấu thật. MệnhLab tránh mọi dự đoán gây sợ hãi vì lý do này.',
  },
  {
    term: 'Bằng chứng khoa học về chiêm tinh',
    group: 'khoa-hoc',
    short: 'Chưa có nghiên cứu có đối chứng nào chứng minh vị trí sao trên lá số dự đoán được tính cách hay sự kiện đời người.',
    long: 'Các nghiên cứu lớn về chiêm tinh phương Tây (ví dụ thí nghiệm mù của Shawn Carlson công bố trên Nature năm 1985) không tìm thấy khả năng dự đoán vượt mức ngẫu nhiên. Tử Vi chưa được kiểm định tương tự ở quy mô lớn. MệnhLab coi lá số là một hệ thống ngôn ngữ văn hóa giúp tự phản tỉnh — không phải công cụ dự báo.',
  },
  {
    term: 'Độ nhạy giờ sinh',
    group: 'khoa-hoc',
    short: 'Kiểm tra lá số thay đổi thế nào nếu giờ sinh lệch vài phút hoặc dùng quy ước tính khác.',
  },
];

const BRIGHTNESS: Omit<Term, 'key'>[] = [
  {
    term: 'Miếu',
    group: 'do-sang',
    short: 'Độ sáng cao nhất (M): sao ở vị trí phát huy tốt nhất ý nghĩa tích cực.',
    long: 'Mỗi sao có bảng vị trí "đẹp/xấu" theo 12 cung. Thang phổ biến: Miếu > Vượng > Đắc > Bình > Hãm. Sao xấu ở Miếu/Vượng cũng bớt xấu, sao tốt ở Hãm cũng kém tốt.',
  },
  { term: 'Vượng', group: 'do-sang', short: 'Độ sáng cao (V): sao phát huy tốt.' },
  { term: 'Đắc', group: 'do-sang', short: 'Đắc địa (Đ): sao ở vị trí khá, phát huy được mặt tốt.' },
  { term: 'Lợi', group: 'do-sang', short: 'Lợi địa (L): tương đương Đắc trong bảng phân loại 7 mức.' },
  { term: 'Bình', group: 'do-sang', short: 'Bình hòa (B): trung tính, ý nghĩa phụ thuộc sao đi kèm.' },
  { term: 'Bất đắc', group: 'do-sang', short: 'Bất đắc địa (B): hơi kém, gần mức Bình; trong thang 7 mức nằm giữa Bình và Hãm.' },
  { term: 'Hãm', group: 'do-sang', short: 'Hãm địa (H): sao ở vị trí kém, dễ bộc lộ mặt trái. Không có nghĩa là xấu tuyệt đối.' },
];

function build(): Term[] {
  const out: Term[] = [];
  const push = (t: Omit<Term, 'key'>) => out.push({ ...t, key: slug(t.term) });
  BASE.forEach(push);
  Object.values(PALACES).forEach((p) =>
    push({ term: `Cung ${p.name}`, group: 'cung', short: p.short, long: `${p.short} ${p.modern} Câu hỏi cung này giúp bạn suy ngẫm: ${p.questions.join(' ')}` }),
  );
  Object.values(MAJOR).forEach((s) =>
    push({
      term: s.name,
      group: 'chinh-tinh',
      short: `${s.nickname}. ${s.short}`,
      long: `${s.long} Mạnh: ${s.strengths.join('; ')}. Cần để ý: ${s.watch.join('; ')}. Hành: ${s.element}.`,
    }),
  );
  Object.values(MINOR).forEach((s) => push({ term: s.name, group: 'phu-tinh', short: s.short, long: s.long }));
  (Object.keys(HOA_INFO) as (keyof typeof HOA_INFO)[]).forEach((h) =>
    push({ term: `Hóa ${h}`, group: 'tu-hoa', short: HOA_INFO[h].short, long: HOA_INFO[h].long }),
  );
  push({
    term: 'Tứ Hóa',
    group: 'tu-hoa',
    short: 'Bốn "biến hóa" Lộc, Quyền, Khoa, Kỵ gắn vào 4 sao theo Can năm sinh — chỉ ra nơi năng lượng được kích hoạt.',
    long: 'Ví dụ sinh năm Canh: Thái Dương hóa Lộc, Vũ Khúc hóa Quyền, Thái Âm hóa Khoa, Thiên Đồng hóa Kỵ. Tứ Hóa được nhiều trường phái coi là phần quan trọng bậc nhất của lá số.',
  });
  BRIGHTNESS.forEach(push);
  VAN_HAN.forEach(push);
  VONG.forEach(push);
  KHOA_HOC.forEach(push);
  return out;
}

export const GLOSSARY: Term[] = build();
export const GLOSSARY_MAP: Record<string, Term> = Object.fromEntries(GLOSSARY.map((t) => [t.key, t]));

/** Tra nhanh mô tả ngắn theo tên hiển thị (ví dụ tên sao, "Cung Mệnh", "Tuần"). */
export function lookup(name: string): Term | undefined {
  return GLOSSARY_MAP[slug(name)] ?? GLOSSARY_MAP[slug(`Cung ${name}`)];
}
