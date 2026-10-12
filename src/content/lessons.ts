/** Loạt bài "Học đọc lá số" — ngắn, có câu hỏi kiểm tra. Viết cho người chưa biết gì về Tử Vi. */

export interface QuizItem {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface Lesson {
  slug: string;
  title: string;
  minutes: number;
  summary: string;
  body: string[];
  terms: string[];
  quiz: QuizItem[];
}

export const LESSONS: Lesson[] = [
  {
    slug: 'la-so-la-gi',
    title: 'Lá số là gì — và không phải là gì',
    minutes: 4,
    summary: 'Lá số là một bảng tính theo quy tắc từ ngày giờ sinh âm lịch, không phải bản đồ bầu trời thật.',
    body: [
      'Lá số Tử Vi là một bảng 12 ô. Mỗi ô là một "cung", đại diện một lĩnh vực đời sống: tính cách, tiền bạc, công việc, hôn nhân... Trong các ô có khoảng một trăm "sao".',
      'Điều nhiều người không biết: phần lớn các sao này không phải ngôi sao thật trên bầu trời. Chúng là những điểm được tính theo quy tắc từ năm, tháng, ngày, giờ sinh âm lịch. Ví dụ sao Tử Vi được đặt bằng cách chia ngày sinh âm lịch cho một con số gọi là Cục.',
      'Vì là phép tính, lá số có thể kiểm tra lại bằng giấy bút. Hai trang web lập cùng một lá số mà ra khác nhau thì một trong hai đã tính sai đầu vào (thường là giờ sinh hoặc lịch âm) hoặc dùng quy ước khác.',
      'Lá số không phải là bằng chứng khoa học về số phận. Nó là một hệ thống văn hóa có cấu trúc chặt chẽ — dùng tốt nhất như một ngôn ngữ để tự đặt câu hỏi về bản thân.',
    ],
    terms: ['Lá số Tử Vi', 'Cung', 'Cục'],
    quiz: [
      {
        q: 'Sao Tử Vi trên lá số được xác định bằng cách nào?',
        options: ['Quan sát vị trí ngôi sao thật lúc bạn sinh', 'Tính theo quy tắc từ ngày sinh âm lịch và Cục', 'Thầy tử vi tự chọn theo kinh nghiệm'],
        answer: 1,
        explain: 'Tử Vi được an bằng phép tính: chia ngày sinh âm lịch cho số Cục rồi đếm từ cung Dần. Không liên quan vị trí thiên thể thật.',
      },
      {
        q: 'Hai trang lập lá số cho cùng một người mà ra khác nhau. Khả năng cao nhất là gì?',
        options: ['Số phận người đó thay đổi', 'Một bên tính sai đầu vào hoặc dùng quy ước khác', 'Cả hai đều đúng theo cách riêng'],
        answer: 1,
        explain: 'Lá số là phép tính xác định. Khác nhau nghĩa là đầu vào (giờ, lịch âm, múi giờ) hoặc quy ước (giờ Tý, tháng nhuận) khác nhau.',
      },
    ],
  },
  {
    slug: 'can-chi-am-lich',
    title: 'Can Chi, âm lịch và giờ sinh',
    minutes: 5,
    summary: 'Vì sao lệch một canh giờ là lệch cả lá số, và vì sao người sinh ở Sài Gòn trước 1975 hay bị lập sai.',
    body: [
      'Người xưa đặt tên năm, tháng, ngày, giờ bằng cặp Can Chi: 10 Thiên Can (Giáp, Ất...) ghép với 12 Địa Chi (Tý, Sửu...), lặp lại sau 60 lần. Năm 2026 là Bính Ngọ.',
      'Một ngày chia 12 canh giờ, mỗi canh 2 tiếng. Giờ Tý từ 23:00 đến 01:00. Lệch một canh giờ, cung Mệnh dời sang ô bên cạnh — gần như cả lá số thay đổi.',
      'Lịch âm Việt Nam tính theo múi giờ UTC+7, khác lịch Trung Quốc (UTC+8). Có những năm hai lịch lệch nhau cả ngày Tết. Trang lá số dùng lịch Trung Quốc sẽ lập sai cho người sinh vào những ngày đó.',
      'Đồng hồ ở Việt Nam từng chạy theo nhiều múi giờ: miền Nam dùng UTC+8 từ cuối 1959 đến giữa 1975, cả nước dùng UTC+9 năm 1945. Người sinh 23:30 ở Sài Gòn năm 1970 thực ra sinh 22:30 giờ chuẩn — giờ Hợi, không phải giờ Tý.',
    ],
    terms: ['Can Chi', 'Canh giờ', 'Múi giờ lịch sử', 'Lịch âm Việt Nam và Trung Quốc'],
    quiz: [
      {
        q: 'Một người sinh 23:30 tại Sài Gòn năm 1970 theo giờ đồng hồ. Theo giờ chuẩn UTC+7, người đó sinh giờ nào?',
        options: ['Giờ Tý (23:00–01:00)', 'Giờ Hợi (21:00–23:00)', 'Giờ Sửu (01:00–03:00)'],
        answer: 1,
        explain: 'Đồng hồ khi đó theo UTC+8, nhanh hơn giờ chuẩn 1 tiếng. 23:30 đồng hồ = 22:30 giờ chuẩn → giờ Hợi.',
      },
      {
        q: 'Vì sao lệch một canh giờ lại thay đổi gần như cả lá số?',
        options: ['Vì cung Mệnh được an theo giờ sinh, mọi cung khác xếp theo cung Mệnh', 'Vì sao Tử Vi đổi màu', 'Không đúng, giờ sinh ít quan trọng'],
        answer: 0,
        explain: 'Cung Mệnh = tháng sinh đếm thuận rồi giờ sinh đếm nghịch. Đổi giờ là đổi vị trí Mệnh, kéo theo Cục, sao Tử Vi và toàn bộ cung.',
      },
    ],
  },
  {
    slug: '12-cung',
    title: '12 cung: mỗi ô là một lĩnh vực',
    minutes: 4,
    summary: 'Mệnh, Huynh Đệ, Phu Thê... và cách đọc chúng bằng ngôn ngữ hôm nay.',
    body: [
      'Bắt đầu từ cung Mệnh, đi ngược chiều kim đồng hồ là: Huynh Đệ, Phu Thê, Tử Tức, Tài Bạch, Tật Ách, Thiên Di, Nô Bộc, Quan Lộc, Điền Trạch, Phúc Đức, Phụ Mẫu.',
      'Nhiều tên cung mang nghĩa xã hội cũ. "Nô Bộc" ngày nay nên hiểu là đồng nghiệp, bạn bè, mạng lưới quan hệ. "Tật Ách" sách cổ dùng để đoán bệnh — điều không có cơ sở; MệnhLab chỉ đọc nó như cách bạn phản ứng với áp lực.',
      'Cung Thân không có ô riêng mà nằm chung với một trong sáu cung (Mệnh, Phu Thê, Tài Bạch, Thiên Di, Quan Lộc, Phúc Đức), cho biết lĩnh vực bạn đặt nhiều tâm sức về sau.',
    ],
    terms: ['Cung Mệnh', 'Cung Thân', 'Cung Nô Bộc', 'Cung Tật Ách'],
    quiz: [
      {
        q: 'Cung Nô Bộc nên hiểu theo nghĩa nào ngày nay?',
        options: ['Người giúp việc trong nhà', 'Đồng nghiệp, bạn bè, mạng lưới quan hệ', 'Số tiền tiết kiệm'],
        answer: 1,
        explain: 'Nhiều sách hiện đại gọi là cung Giao Hữu: các mối quan hệ ngang hàng, cộng sự, cấp dưới.',
      },
      {
        q: 'Cung Thân có thể nằm chung với cung nào?',
        options: ['Bất kỳ cung nào trong 12 cung', 'Chỉ một trong sáu cung: Mệnh, Phu Thê, Tài Bạch, Thiên Di, Quan Lộc, Phúc Đức', 'Luôn nằm ở cung Mệnh'],
        answer: 1,
        explain: 'Do cách an (tháng đếm thuận, giờ đếm thuận), Thân chỉ rơi vào 6 vị trí cách Mệnh số chẵn ô.',
      },
    ],
  },
  {
    slug: 'chinh-tinh-phu-tinh',
    title: 'Chính tinh, phụ tinh, cát tinh, sát tinh',
    minutes: 5,
    summary: '14 chính tinh tạo "tính cách" của cung; phụ tinh thêm sắc thái. Sát tinh không đồng nghĩa với tai họa.',
    body: [
      '14 chính tinh (Tử Vi, Thiên Cơ, Thái Dương...) là nhân vật chính của mỗi cung. Chúng được an theo hai chòm: chòm Tử Vi đi ngược, chòm Thiên Phủ đi thuận — nên vị trí của chúng luôn có quan hệ cố định với nhau.',
      'Phụ tinh bổ sung sắc thái. Sáu cát tinh (Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt) tượng trưng sự hỗ trợ; sáu sát tinh (Kình Dương, Đà La, Hỏa Tinh, Linh Tinh, Địa Không, Địa Kiếp) tượng trưng áp lực, biến động.',
      'Sát tinh bị nhiều trang dùng để hù dọa. Thực tế, ai cũng có đủ sáu sát tinh ở đâu đó trên lá số. Câu hỏi đúng không phải "có sát tinh không" mà "chúng ở lĩnh vực nào, và tôi chuẩn bị gì".',
      'Cung không có chính tinh gọi là vô chính diệu, đọc bằng cách mượn chính tinh của cung đối diện.',
    ],
    terms: ['Chính tinh', 'Lục Cát Tinh', 'Lục Sát Tinh', 'Vô Chính Diệu'],
    quiz: [
      {
        q: 'Có bao nhiêu người có đủ sáu sát tinh trên lá số?',
        options: ['Rất ít, khoảng 1%', 'Khoảng một nửa', 'Tất cả mọi người'],
        answer: 2,
        explain: 'Sáu sát tinh luôn được an ở đâu đó trên mọi lá số. Điều khác nhau chỉ là chúng nằm ở cung nào.',
      },
      {
        q: 'Cung vô chính diệu được đọc thế nào?',
        options: ['Bỏ qua, coi như trống', 'Mượn chính tinh của cung đối diện', 'Luôn xấu'],
        answer: 1,
        explain: 'Theo quy tắc, cung vô chính diệu mượn sao ở cung xung chiếu (đối diện) để luận.',
      },
    ],
  },
  {
    slug: 'do-sang',
    title: 'Độ sáng: Miếu, Vượng, Đắc, Hãm',
    minutes: 4,
    summary: 'Cùng một sao, ở vị trí khác nhau thì phát huy khác nhau — và các sách không thống nhất.',
    body: [
      'Mỗi sao có bảng "độ sáng" theo 12 vị trí. Ở Miếu, Vượng: sao phát huy mặt tích cực. Ở Hãm: dễ bộc lộ mặt trái.',
      'Ví dụ Thái Dương (Mặt Trời) sáng ở các cung ban ngày (Dần đến Ngọ), mờ ở các cung ban đêm — logic hình ảnh rất trực quan.',
      'Điều ít trang nói ra: sách Việt và sách gốc Trung Hoa xếp độ sáng khác nhau ở khoảng hai phần ba vị trí chính tinh. Tham Lang ở Tý: sách Việt ghi Hãm, Toàn Thư ghi Vượng. Khi các sách mâu thuẫn, kết luận dựa trên độ sáng cần được đọc thận trọng.',
    ],
    terms: ['Miếu', 'Vượng', 'Đắc', 'Hãm'],
    quiz: [
      {
        q: 'Sách Việt và Toàn Thư xếp độ sáng của Tham Lang ở cung Tý thế nào?',
        options: ['Giống nhau: đều Miếu', 'Sách Việt: Hãm; Toàn Thư: Vượng', 'Cả hai đều không ghi'],
        answer: 1,
        explain: 'Đây là một trong nhiều vị trí hai trường phái xếp ngược nhau. Mỗi lá số MệnhLab đều liệt kê các chỗ lệch.',
      },
    ],
  },
  {
    slug: 'tu-hoa',
    title: 'Tứ Hóa: Lộc, Quyền, Khoa, Kỵ',
    minutes: 4,
    summary: 'Bốn "biến hóa" theo Can năm sinh — và vì sao Hóa Kỵ không phải điềm xấu.',
    body: [
      'Can của năm sinh quyết định 4 sao được "kích hoạt": một sao hóa Lộc (nguồn lực, thuận lợi), một sao hóa Quyền (chủ động, kiểm soát), một sao hóa Khoa (uy tín, học hỏi), một sao hóa Kỵ (vướng bận, chấp niệm).',
      'Ví dụ sinh năm Canh (như Canh Ngọ 1990): Thái Dương hóa Lộc, Vũ Khúc hóa Quyền, Thái Âm hóa Khoa, Thiên Đồng hóa Kỵ. Mọi người sinh năm Canh đều có bộ Tứ Hóa này — khoảng 10% dân số.',
      'Hóa Kỵ thường bị diễn giải là xui xẻo. Cách hiểu tỉnh táo hơn: đó là lĩnh vực bạn hay để tâm, lo nghĩ nhiều nhất — cũng là nơi bạn đầu tư nhiều nhất.',
    ],
    terms: ['Tứ Hóa', 'Hóa Lộc', 'Hóa Kỵ'],
    quiz: [
      {
        q: 'Bộ Tứ Hóa năm sinh của bạn được xác định bởi gì?',
        options: ['Giờ sinh', 'Can của năm sinh âm lịch', 'Tên của bạn'],
        answer: 1,
        explain: 'Tứ Hóa năm sinh chỉ phụ thuộc Can năm, nên mọi người cùng Can năm có cùng bộ Tứ Hóa (khoảng 1/10 dân số).',
      },
    ],
  },
  {
    slug: 'tam-phuong-tuan-triet',
    title: 'Tam phương tứ chính, Tuần và Triệt',
    minutes: 4,
    summary: 'Không bao giờ đọc một cung riêng lẻ — và hai vạch đỏ đặc trưng của Tử Vi Việt Nam.',
    body: [
      'Khi đọc một cung, phải xem cùng cung đối diện (xung chiếu) và hai cung tam hợp (cách 4 ô). Bốn cung này gọi là tam phương tứ chính. Cung Mệnh luôn tam hợp với Tài Bạch và Quan Lộc, xung chiếu Thiên Di.',
      'Tuần và Triệt là hai "vạch" nằm giữa hai cung, làm giảm hoặc đổi chiều tác động của sao trong hai cung đó. Cách vẽ Tuần Triệt trên ranh giới hai cung là đặc trưng của sách Tử Vi Việt Nam.',
      'Triệt tính theo Can năm sinh, Tuần tính theo cặp Can Chi năm sinh — nghĩa là mọi người sinh cùng năm có Tuần Triệt ở cùng vị trí.',
    ],
    terms: ['Tam phương tứ chính', 'Xung chiếu', 'Tuần', 'Triệt'],
    quiz: [
      {
        q: 'Cung Mệnh luôn tam hợp với hai cung nào?',
        options: ['Phu Thê và Tử Tức', 'Tài Bạch và Quan Lộc', 'Phụ Mẫu và Huynh Đệ'],
        answer: 1,
        explain: 'Đếm cách 4 ô từ Mệnh về hai phía luôn rơi vào Tài Bạch và Quan Lộc.',
      },
      {
        q: 'Ai có Tuần Triệt ở cùng vị trí với bạn?',
        options: ['Chỉ mình bạn', 'Mọi người sinh cùng năm âm lịch', 'Người cùng giờ sinh'],
        answer: 1,
        explain: 'Tuần Triệt chỉ phụ thuộc năm sinh, không phụ thuộc ngày giờ.',
      },
    ],
  },
  {
    slug: 'van-han',
    title: 'Đại vận, tiểu hạn, lưu niên',
    minutes: 4,
    summary: 'Cách Tử Vi chia thời gian — và vì sao MệnhLab không nói "năm hạn".',
    body: [
      'Đại vận chia đời người thành các giai đoạn 10 năm, mỗi giai đoạn đi qua một cung, bắt đầu từ cung Mệnh ở tuổi bằng số Cục.',
      'Tiểu hạn là cung đại diện từng năm tuổi. Lưu niên là ảnh hưởng của năm hiện tại: cung mang Chi của năm (lưu Thái Tuế) và bộ Tứ Hóa theo Can của năm (lưu Tứ Hóa).',
      'Nhiều nơi dùng vận hạn để bán "giải hạn". MệnhLab không làm vậy: tin rằng năm nay xấu có thể khiến bạn hành động rụt rè và tự tạo ra kết quả xấu — hiện tượng lời tiên tri tự ứng nghiệm.',
    ],
    terms: ['Đại vận', 'Tiểu hạn', 'Lưu niên', 'Lời tiên tri tự ứng nghiệm'],
    quiz: [
      {
        q: 'Đại vận đầu tiên bắt đầu ở tuổi nào?',
        options: ['Luôn ở tuổi 1', 'Ở tuổi bằng số Cục (2 đến 6)', 'Ở tuổi 18'],
        answer: 1,
        explain: 'Thủy Nhị Cục khởi đại vận từ 2 tuổi, Hỏa Lục Cục từ 6 tuổi.',
      },
    ],
  },
  {
    slug: 'doc-tinh-tao',
    title: 'Đọc lá số cho tỉnh táo',
    minutes: 5,
    summary: 'Hiệu ứng Barnum, tỷ lệ nền, và ba câu hỏi nên tự hỏi trước mỗi lời phán.',
    body: [
      'Năm 1948, nhà tâm lý học Bertram Forer đưa cho sinh viên một bài "phân tích tính cách" giống hệt nhau; họ chấm độ chính xác trung bình 4,3/5. Mô tả chung chung khiến ai cũng thấy "đúng quá". Đó là hiệu ứng Barnum.',
      'Tỷ lệ nền: mỗi bộ sao cung Mệnh có ở vài phần trăm dân số — hàng triệu người Việt. Lời luận về cung Mệnh của bạn cũng đúng với họ.',
      'Ba câu hỏi trước mỗi lời phán: (1) Câu này có đúng với hầu hết mọi người không? (2) Căn cứ là sao nào, ở đâu? (3) Nếu tin câu này, tôi sẽ hành động khác thế nào — và hành động đó có tốt cho tôi không?',
      'Cách kiểm chứng tốt nhất là thí nghiệm mù: chọn mô tả giống mình nhất mà không biết đâu là mô tả từ lá số của mình. MệnhLab mời mọi người làm thí nghiệm này và công bố kết quả ở trang Nghiên cứu.',
    ],
    terms: ['Hiệu ứng Barnum', 'Thiên kiến xác nhận', 'Bằng chứng khoa học về chiêm tinh'],
    quiz: [
      {
        q: 'Trong thí nghiệm năm 1948 của Forer, sinh viên chấm bài phân tích tính cách (giống hệt nhau) trung bình bao nhiêu điểm chính xác?',
        options: ['Khoảng 1,5/5', 'Khoảng 3/5', 'Khoảng 4,3/5'],
        answer: 2,
        explain: 'Dù bài phân tích giống hệt nhau, ai cũng thấy nó mô tả đúng mình — minh chứng kinh điển của hiệu ứng Barnum.',
      },
      {
        q: 'Trong thí nghiệm ghép cặp mù 4 lựa chọn, nếu mô tả từ lá số không có giá trị gì, tỷ lệ chọn đúng sẽ vào khoảng?',
        options: ['0%', '25%', '100%'],
        answer: 1,
        explain: 'Đoán mò giữa 4 lựa chọn đúng 1/4 lần. Chỉ khi tỷ lệ đúng cao hơn rõ rệt 25% mới có tín hiệu.',
      },
    ],
  },
];
