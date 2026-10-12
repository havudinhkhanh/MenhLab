/**
 * 12 cung: mỗi cung là một "lĩnh vực đời sống" trên lá số.
 * `modern` diễn giải theo ngôn ngữ ngày nay để người đọc không hiểu sai
 * (ví dụ "Nô Bộc" không còn nghĩa là đầy tớ, mà là đồng nghiệp, bạn bè, cộng sự).
 */
export type DomainKey = 'menh' | 'huynh' | 'phuthe' | 'tutuc' | 'tai' | 'tat' | 'di' | 'no' | 'quan' | 'dien' | 'phuc' | 'phumau';

export interface PalaceInfo {
  name: string;
  domain: DomainKey;
  short: string;
  modern: string;
  questions: string[];
}

export const PALACES: Record<string, PalaceInfo> = {
  Mệnh: {
    name: 'Mệnh',
    domain: 'menh',
    short: 'Cung trung tâm: tính cách gốc, cách bạn phản ứng với thế giới, điểm mạnh và điểm cần rèn.',
    modern: 'Hãy hiểu như "hệ điều hành mặc định" của bạn — không phải số phận cố định mà là thiên hướng ban đầu.',
    questions: ['Tôi thường hành động theo kiểu nào?', 'Điều gì tạo động lực cho tôi?', 'Mặt nào của tôi dễ gây cản trở?'],
  },
  'Huynh Đệ': {
    name: 'Huynh Đệ',
    domain: 'huynh',
    short: 'Anh chị em ruột và những người ngang hàng thân thiết.',
    modern: 'Mở rộng ra: cách bạn hợp tác với người ngang hàng, bạn đồng niên, đối tác cùng cấp.',
    questions: ['Quan hệ anh chị em thế nào?', 'Tôi hợp tác với người ngang hàng ra sao?'],
  },
  'Phu Thê': {
    name: 'Phu Thê',
    domain: 'phuthe',
    short: 'Hôn nhân và quan hệ tình cảm lâu dài; mẫu người bạn bị thu hút.',
    modern: 'Phản ánh kỳ vọng của bạn trong quan hệ đôi lứa, không quyết định bạn sẽ cưới ai hay khi nào.',
    questions: ['Tôi tìm kiếm điều gì ở người bạn đời?', 'Điểm dễ va chạm trong quan hệ là gì?'],
  },
  'Tử Tức': {
    name: 'Tử Tức',
    domain: 'tutuc',
    short: 'Con cái, học trò, và những gì bạn "nuôi dưỡng" (dự án, sáng tạo).',
    modern: 'Cách bạn chăm sóc, dạy dỗ và truyền lại. Không dùng để đoán số con hay giới tính con.',
    questions: ['Tôi là kiểu phụ huynh/người dẫn dắt nào?', 'Tôi nuôi dưỡng dự án ra sao?'],
  },
  'Tài Bạch': {
    name: 'Tài Bạch',
    domain: 'tai',
    short: 'Tiền bạc: cách kiếm, giữ, tiêu tiền và thái độ với vật chất.',
    modern: 'Đọc như "phong cách tài chính cá nhân", không phải dự báo giàu nghèo. Thu nhập thực tế phụ thuộc kỹ năng, thị trường và quyết định của bạn.',
    questions: ['Tôi kiếm tiền theo kiểu nào?', 'Thói quen chi tiêu nào cần để ý?'],
  },
  'Tật Ách': {
    name: 'Tật Ách',
    domain: 'tat',
    short: 'Sách cổ dùng để luận bệnh tật, tai ách.',
    modern:
      'MệnhLab chỉ đọc cung này như cách bạn phản ứng với áp lực và nhịp sinh hoạt. Không có bằng chứng sao trên lá số dự báo bệnh — mọi lo lắng sức khỏe hãy hỏi bác sĩ.',
    questions: ['Tôi xử lý căng thẳng thế nào?', 'Thói quen sinh hoạt nào cần chú ý?'],
  },
  'Thiên Di': {
    name: 'Thiên Di',
    domain: 'di',
    short: 'Khi ra ngoài, đi xa, môi trường xã hội: bạn trong mắt người khác.',
    modern: 'Hình ảnh xã hội, cách bạn thích nghi với môi trường mới, cơ hội đến từ bên ngoài.',
    questions: ['Người ngoài nhìn tôi thế nào?', 'Tôi có hợp môi trường mới, đi xa không?'],
  },
  'Nô Bộc': {
    name: 'Nô Bộc',
    domain: 'no',
    short: 'Xưa là kẻ giúp việc; nay là đồng nghiệp, cấp dưới, bạn bè, mạng lưới quan hệ.',
    modern: 'Nhiều sách gọi là "Giao Hữu". Phản ánh cách bạn xây và dùng mạng lưới quan hệ.',
    questions: ['Tôi hợp với kiểu đồng đội nào?', 'Tôi có dễ được giúp hay dễ bị lợi dụng?'],
  },
  'Quan Lộc': {
    name: 'Quan Lộc',
    domain: 'quan',
    short: 'Sự nghiệp, công việc, cách làm việc và con đường thăng tiến.',
    modern: 'Đọc như "phong cách làm việc và môi trường hợp với bạn", không phải tên nghề định sẵn.',
    questions: ['Tôi làm việc hiệu quả nhất trong môi trường nào?', 'Điểm mạnh nghề nghiệp của tôi là gì?'],
  },
  'Điền Trạch': {
    name: 'Điền Trạch',
    domain: 'dien',
    short: 'Nhà cửa, bất động sản, tài sản tích lũy và không khí gia đình.',
    modern: 'Thái độ với sự ổn định, tích lũy dài hạn và không gian sống.',
    questions: ['Tôi coi trọng sự ổn định đến đâu?', 'Tôi tích lũy tài sản theo cách nào?'],
  },
  'Phúc Đức': {
    name: 'Phúc Đức',
    domain: 'phuc',
    short: 'Đời sống tinh thần, niềm vui nội tâm, phúc khí dòng họ.',
    modern: 'Gần với "sức khỏe tinh thần và hệ giá trị": điều gì làm bạn thật sự an lòng.',
    questions: ['Điều gì làm tôi hạnh phúc lâu dài?', 'Tôi tự cân bằng cảm xúc thế nào?'],
  },
  'Phụ Mẫu': {
    name: 'Phụ Mẫu',
    domain: 'phumau',
    short: 'Cha mẹ, người bề trên, và quan hệ với cấp trên, thầy cô.',
    modern: 'Cách bạn tương tác với người có thẩm quyền và nền tảng giáo dục gia đình.',
    questions: ['Quan hệ với cha mẹ, cấp trên ra sao?', 'Tôi tiếp nhận sự chỉ dẫn thế nào?'],
  },
};

export const DOMAIN_LABEL: Record<DomainKey, string> = {
  menh: 'tính cách và cách hành xử',
  huynh: 'quan hệ anh chị em, người ngang hàng',
  phuthe: 'tình cảm, hôn nhân',
  tutuc: 'con cái, việc nuôi dưỡng và truyền lại',
  tai: 'tiền bạc',
  tat: 'phản ứng với áp lực, nhịp sinh hoạt',
  di: 'môi trường bên ngoài, hình ảnh xã hội',
  no: 'đồng nghiệp, bạn bè, mạng lưới',
  quan: 'công việc, sự nghiệp',
  dien: 'nhà cửa, tích lũy, sự ổn định',
  phuc: 'đời sống tinh thần',
  phumau: 'cha mẹ, cấp trên',
};
