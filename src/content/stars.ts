/**
 * Ý nghĩa sao. Viết theo hướng: giữ đúng ý nghĩa truyền thống, diễn đạt bằng
 * ngôn ngữ hành vi ngày nay, luôn nêu cả mặt mạnh lẫn mặt cần để ý, tránh
 * khẳng định định mệnh (không "chắc chắn", không đoán bệnh, tai nạn, tử vong).
 */
import type { DomainKey } from './palaces';

export interface MajorStarInfo {
  name: string;
  element: string;
  nickname: string;
  short: string;
  long: string;
  strengths: string[];
  watch: string[];
  domains: Partial<Record<DomainKey, string>>;
}

export const MAJOR: Record<string, MajorStarInfo> = {
  'Tử Vi': {
    name: 'Tử Vi',
    element: 'Thổ',
    nickname: 'Đế tinh — ngôi sao "vua"',
    short: 'Sao chủ của cả lá số: khả năng làm trung tâm, tổ chức và tự quyết.',
    long: 'Tử Vi tượng trưng cho người đứng đầu. Sách cổ nói "vua cần bá quan": Tử Vi phát huy tốt khi có cát tinh (Tả Phù, Hữu Bật, Thiên Khôi, Thiên Việt...) đi cùng; đứng một mình dễ thành "cô quân" — có vị thế nhưng thiếu người hỗ trợ.',
    strengths: ['Tự trọng và có chính kiến', 'Biết tổ chức, điều phối', 'Tạo cảm giác tin cậy cho người khác'],
    watch: ['Thích được tôn trọng, dễ tự ái', 'Đôi khi khó nhận góp ý', 'Thiếu người hỗ trợ thì dễ đơn độc'],
    domains: {
      menh: 'Thiên hướng muốn tự quyết, chú trọng thể diện và có tố chất làm "trục" cho tập thể.',
      quan: 'Hợp vai trò quản lý, điều phối, nơi có cấu trúc và thứ bậc rõ ràng.',
      tai: 'Tiền đến qua vị thế và uy tín; dễ chi cho hình ảnh, chất lượng sống.',
      phuthe: 'Kỳ vọng người bạn đời đáng tự hào, được tôn trọng; dễ có quan hệ "ai làm chủ" trong nhà.',
      di: 'Ra ngoài thường được nể trọng, dễ gặp người có vị thế.',
      phuc: 'An lòng khi cảm thấy được công nhận và có quyền chủ động.',
    },
  },
  'Thiên Cơ': {
    name: 'Thiên Cơ',
    element: 'Mộc',
    nickname: 'Thiện tinh — ngôi sao mưu trí',
    short: 'Trí óc nhanh nhạy, thích phân tích, lên kế hoạch và thay đổi.',
    long: 'Thiên Cơ là bộ óc chiến lược: nhìn ra cơ hội, xoay chuyển linh hoạt. Mặt trái là suy nghĩ quá nhiều, đổi ý thường xuyên, khó theo một việc lâu dài.',
    strengths: ['Phân tích, lập kế hoạch tốt', 'Học nhanh, thích nghi nhanh', 'Giỏi tư vấn, cố vấn'],
    watch: ['Lo xa, nghĩ nhiều', 'Dễ thay đổi, thiếu kiên định', 'Hay cầu toàn trong chi tiết'],
    domains: {
      menh: 'Thiên hướng dùng đầu óc hơn sức lực; thích hiểu "tại sao" trước khi làm.',
      quan: 'Hợp việc cần tư duy: hoạch định, phân tích, kỹ thuật, tư vấn; dễ đổi việc nếu nhàm chán.',
      tai: 'Kiếm tiền bằng chuyên môn, kế hoạch; thu nhập có thể biến động theo các lần chuyển hướng.',
      phuthe: 'Coi trọng sự đồng điệu trí tuệ; dễ "nghĩ thay" cho đối phương.',
      di: 'Ra ngoài linh hoạt, dễ thích nghi môi trường mới.',
      phuc: 'Tâm trí ít khi nghỉ; cần học cách tắt "máy suy nghĩ".',
    },
  },
  'Thái Dương': {
    name: 'Thái Dương',
    element: 'Hỏa',
    nickname: 'Quý tinh — Mặt Trời',
    short: 'Năng lượng cho đi, hướng ngoại, danh tiếng và trách nhiệm.',
    long: 'Thái Dương sáng nhất khi ở các cung ban ngày (từ Dần đến Ngọ) và mờ dần về đêm. Sáng thì rộng lượng, được ghi nhận; tối (hãm) thì vẫn cho đi nhưng vất vả hơn, ít được thấy công. Truyền thống còn dùng Thái Dương đại diện người cha, người đàn ông trong gia đình.',
    strengths: ['Hào phóng, nhiệt tình', 'Có trách nhiệm, thích giúp người', 'Dễ tạo tiếng tăm'],
    watch: ['Ôm việc, cho đi quá sức', 'Sĩ diện', 'Nóng tính khi không được ghi nhận'],
    domains: {
      menh: 'Thiên hướng hướng ngoại, muốn được làm điều có ý nghĩa và được người khác thấy.',
      quan: 'Hợp vai trò công khai, phục vụ cộng đồng, giảng dạy, truyền thông, công việc "ra mặt".',
      tai: 'Tiền đến qua danh tiếng và sự tín nhiệm; dễ chi tiêu vì người khác.',
      phuthe: 'Cho đi nhiều trong quan hệ; cần người bạn đời biết ghi nhận.',
      di: 'Ra ngoài nổi bật, dễ được biết đến.',
    },
  },
  'Vũ Khúc': {
    name: 'Vũ Khúc',
    element: 'Kim',
    nickname: 'Tài tinh — ngôi sao tiền bạc',
    short: 'Thực tế, quyết đoán, kỷ luật; gắn với tài chính.',
    long: 'Vũ Khúc là "tài tinh" chính của Tử Vi: nghiêng về hành động, con số và kết quả. Mạnh mẽ, cương nghị; mặt trái là cứng nhắc, khô khan trong cảm xúc, sách cổ gọi là "cô khắc".',
    strengths: ['Quyết đoán, làm tới cùng', 'Nhạy với tiền và hiệu quả', 'Kỷ luật'],
    watch: ['Cứng rắn, ít mềm mỏng', 'Dễ bị cho là thực dụng', 'Khó bày tỏ cảm xúc'],
    domains: {
      menh: 'Thiên hướng thực tế, nói ít làm nhiều, đánh giá mọi việc qua kết quả.',
      quan: 'Hợp tài chính, kinh doanh, kỹ thuật, quân sự — nơi cần quyết đoán và kỷ luật.',
      tai: 'Nhạy bén với tiền; giỏi kiếm và giữ nếu không gặp sát tinh làm hao.',
      phuthe: 'Thể hiện tình cảm bằng hành động hơn lời nói; dễ thiếu lãng mạn.',
    },
  },
  'Thiên Đồng': {
    name: 'Thiên Đồng',
    element: 'Thủy',
    nickname: 'Phúc tinh — ngôi sao an hưởng',
    short: 'Ôn hòa, dễ chịu, hồn nhiên, thích sự thoải mái.',
    long: 'Thiên Đồng là ngôi sao của sự bình an và hưởng thụ. Người ta hay nói "trước khó sau dễ": tuổi trẻ có thể chật vật, càng về sau càng an nhàn. Mặt trái là ngại va chạm, thiếu quyết liệt.',
    strengths: ['Hiền hòa, dễ gần', 'Biết tận hưởng cuộc sống', 'Hòa giải giỏi'],
    watch: ['Ngại khó, ngại thay đổi', 'Thiếu quyết liệt khi cần', 'Dễ ham vui'],
    domains: {
      menh: 'Thiên hướng ôn hòa, tìm sự dễ chịu, tránh xung đột.',
      quan: 'Hợp môi trường hòa thuận, dịch vụ, chăm sóc, nghệ thuật; kém hợp nơi cạnh tranh gắt.',
      tai: 'Tiền đến tương đối nhẹ nhàng; dễ chi cho hưởng thụ.',
      phuthe: 'Coi trọng sự êm ấm; cần tránh né tránh các vấn đề cần giải quyết.',
      phuc: 'Biết tìm niềm vui nhỏ — điểm mạnh lớn cho sức khỏe tinh thần.',
    },
  },
  'Liêm Trinh': {
    name: 'Liêm Trinh',
    element: 'Hỏa',
    nickname: 'Tù tinh — ngôi sao nguyên tắc và đam mê',
    short: 'Nguyên tắc, nhiệt huyết, tham vọng; nội tâm phức tạp.',
    long: 'Liêm Trinh vừa là ngôi sao của kỷ cương (liêm khiết, chính trực) vừa mang nhiệt huyết, đam mê. Đắc địa thì có tài tổ chức và tự chủ; hãm địa thì dễ cực đoan. Sách cổ gắn sao này với chuyện "quan sự, pháp luật"; cách hiểu ngày nay: cần làm việc minh bạch, đúng quy trình.',
    strengths: ['Có nguyên tắc, kỷ luật', 'Nhiệt huyết, tham vọng', 'Năng lực tổ chức'],
    watch: ['Dễ cực đoan, nóng nảy', 'Nội tâm giằng co', 'Cần minh bạch để tránh rắc rối'],
    domains: {
      menh: 'Thiên hướng sống theo nguyên tắc riêng, nhiệt tình nhưng không dễ đoán.',
      quan: 'Hợp môi trường có quy chế: hành chính, pháp lý, kỹ thuật, quản lý vận hành.',
      tai: 'Kiếm tiền qua tổ chức, hệ thống; cần minh bạch giấy tờ tài chính.',
      phuthe: 'Tình cảm mãnh liệt; cần học cách nói ra thay vì giữ trong lòng.',
    },
  },
  'Thiên Phủ': {
    name: 'Thiên Phủ',
    element: 'Thổ',
    nickname: 'Lệnh tinh — kho trời',
    short: 'Ổn định, chu đáo, giỏi quản lý và tích lũy.',
    long: 'Thiên Phủ là "kho trời": giữ, quản, tích lũy. Người có Thiên Phủ tốt thường điềm tĩnh, đáng tin, hợp vai trò quản trị nguồn lực. Mặt trái là thận trọng quá, bảo thủ. Sách cổ ưa Thiên Phủ có Lộc (Lộc Tồn, Hóa Lộc) vì "kho có của".',
    strengths: ['Điềm tĩnh, đáng tin', 'Quản lý nguồn lực giỏi', 'Chu đáo, rộng lượng'],
    watch: ['Thận trọng quá mức', 'Ngại thay đổi', 'Thích kiểm soát mọi thứ trong tầm tay'],
    domains: {
      menh: 'Thiên hướng điềm tĩnh, thích sự ổn định và trật tự.',
      quan: 'Hợp quản trị, tài chính, hành chính, ngân hàng — việc cần giữ gìn và vận hành hệ thống.',
      tai: 'Giỏi tích lũy, chi tiêu có kế hoạch.',
      dien: 'Coi trọng nhà cửa, tài sản; thích tích lũy dài hạn.',
    },
  },
  'Thái Âm': {
    name: 'Thái Âm',
    element: 'Thủy',
    nickname: 'Phú tinh — Mặt Trăng',
    short: 'Tinh tế, nhạy cảm, hướng nội; gắn với tích lũy và nhà cửa.',
    long: 'Thái Âm sáng ở các cung ban đêm (từ Thân đến Tý) và mờ ban ngày. Sáng thì tinh tế, giàu cảm xúc, giỏi tích lũy; hãm thì dễ đa sầu, lo âu. Truyền thống dùng Thái Âm đại diện người mẹ, người phụ nữ trong gia đình.',
    strengths: ['Tinh tế, có gu thẩm mỹ', 'Biết tích lũy', 'Thấu hiểu cảm xúc người khác'],
    watch: ['Đa cảm, hay giữ trong lòng', 'Thiếu chủ động', 'Dễ bị cảm xúc chi phối quyết định'],
    domains: {
      menh: 'Thiên hướng hướng nội, tinh tế, sống thiên về cảm xúc.',
      quan: 'Hợp việc cần tỉ mỉ, thẩm mỹ, chăm sóc, bất động sản, tài chính ổn định.',
      tai: 'Giỏi tích lũy dần dần; hợp tài sản tích lũy lâu dài.',
      phuthe: 'Cần sự dịu dàng và thấu hiểu; dễ tổn thương khi bị lạnh nhạt.',
      dien: 'Gắn bó với nhà cửa, coi trọng tổ ấm.',
    },
  },
  'Tham Lang': {
    name: 'Tham Lang',
    element: 'Mộc',
    nickname: 'Đào hoa tinh — ngôi sao ham muốn',
    short: 'Ham học, đa tài, giỏi giao tế; nhiều mong muốn.',
    long: 'Tham Lang là ngôi sao của khát vọng: muốn biết, muốn có, muốn trải nghiệm. Điều này tạo ra sự đa tài, sức hút và khả năng giao tế. Mặt trái là ôm đồm, thiếu chừng mực. Sách cổ cho rằng Tham Lang thường thành công muộn.',
    strengths: ['Đa tài, học hỏi nhanh', 'Giao tiếp, tạo quan hệ giỏi', 'Có sức hút'],
    watch: ['Ôm đồm nhiều việc', 'Khó chừng mực trong hưởng thụ', 'Dễ thay đổi hứng thú'],
    domains: {
      menh: 'Thiên hướng ham trải nghiệm, đa tài, có sức hút xã hội.',
      quan: 'Hợp việc cần giao tế: kinh doanh, bán hàng, quan hệ công chúng, giải trí, ẩm thực.',
      tai: 'Kiếm tiền qua quan hệ và nhiều nguồn; chi tiêu theo cảm hứng cần kiểm soát.',
      phuthe: 'Tình cảm nồng nhiệt, dễ bị thu hút; cần sự cam kết rõ ràng.',
    },
  },
  'Cự Môn': {
    name: 'Cự Môn',
    element: 'Thủy',
    nickname: 'Ám tinh — ngôi sao ngôn ngữ',
    short: 'Ngôn ngữ, lý lẽ, tư duy hoài nghi và phân tích sâu.',
    long: 'Cự Môn là "cửa lớn" của lời nói: giỏi lý luận, tranh biện, đào sâu. Người xưa gọi là ám tinh vì dễ gây thị phi, hiểu lầm. Cách hiểu ngày nay: tư duy phản biện mạnh — dùng đúng thì thành chuyên gia, dùng sai thì thành tranh cãi.',
    strengths: ['Lập luận sắc bén', 'Đào sâu, nghiên cứu', 'Ăn nói thuyết phục'],
    watch: ['Dễ thị phi, khẩu thiệt', 'Đa nghi', 'Nói thẳng gây mất lòng'],
    domains: {
      menh: 'Thiên hướng hoài nghi lành mạnh, cần lý lẽ thuyết phục mới tin.',
      quan: 'Hợp nghề dùng lời nói và lập luận: luật, giảng dạy, tư vấn, truyền thông, nghiên cứu.',
      tai: 'Kiếm tiền bằng chuyên môn, lời nói; cần cẩn thận tranh chấp tiền bạc.',
      phuthe: 'Dễ cãi vã vì lời nói; học cách lắng nghe giúp quan hệ bền hơn.',
    },
  },
  'Thiên Tướng': {
    name: 'Thiên Tướng',
    element: 'Thủy',
    nickname: 'Ấn tinh — ngôi sao con dấu',
    short: 'Công bằng, hỗ trợ, coi trọng hình ảnh và trật tự.',
    long: 'Thiên Tướng là "con dấu": người giữ ấn, phò tá, đảm bảo công bằng. Đặc điểm nổi bật là chịu ảnh hưởng mạnh của sao xung quanh — hai cung kẹp bên (giáp cung) có Hóa Lộc thì tốt (giáp Ấn), có Kình Dương/Hóa Kỵ thì chịu áp lực (giáp Hình, giáp Kỵ).',
    strengths: ['Công bằng, trọng lẽ phải', 'Phò tá, hỗ trợ tốt', 'Lịch sự, chỉn chu'],
    watch: ['Dĩ hòa vi quý quá mức', 'Dễ bị môi trường chi phối', 'Ngại nói "không"'],
    domains: {
      menh: 'Thiên hướng chỉn chu, công bằng, hợp vai trò "cánh tay phải".',
      quan: 'Hợp vị trí hỗ trợ cấp cao, nhân sự, pháp chế, dịch vụ chuyên nghiệp.',
      tai: 'Thu nhập ổn định qua công việc chuyên môn hơn là đầu cơ.',
      phuthe: 'Coi trọng sự tôn trọng và hình thức trong quan hệ.',
    },
  },
  'Thiên Lương': {
    name: 'Thiên Lương',
    element: 'Thổ',
    nickname: 'Ấm tinh — ngôi sao che chở',
    short: 'Che chở, đạo đức, tư vấn; có khả năng "giải ách".',
    long: 'Thiên Lương là ngôi sao của người lớn tuổi, thầy thuốc, người che chở. Có khả năng hóa giải khó khăn (giải ách) — sách cổ nói hay "gặp nạn rồi qua". Mặt trái: thích dạy dỗ, ôm việc người khác.',
    strengths: ['Đạo đức, có trách nhiệm', 'Che chở, nâng đỡ người khác', 'Bình tĩnh trước khó khăn'],
    watch: ['Hay dạy đời', 'Ôm chuyện thiên hạ', 'Đôi khi cứng nhắc về đạo lý'],
    domains: {
      menh: 'Thiên hướng già dặn, nguyên tắc đạo đức rõ, hay được người khác tìm đến xin lời khuyên.',
      quan: 'Hợp y tế, giáo dục, tư vấn, bảo hiểm, công tác xã hội — việc mang tính che chở.',
      tai: 'Tiền thường đến từ chuyên môn và uy tín; không hợp đầu cơ.',
      phuthe: 'Hay chăm sóc, bảo bọc người bạn đời; cần tránh thái độ "phụ huynh".',
    },
  },
  'Thất Sát': {
    name: 'Thất Sát',
    element: 'Kim',
    nickname: 'Tướng tinh — ngôi sao đại tướng',
    short: 'Quyết liệt, dám làm, độc lập, thích thử thách.',
    long: 'Thất Sát là vị tướng ra trận: can đảm, quyết liệt, độc lập. Cuộc đời thường có thăng trầm rõ vì dám đặt cược. Đi với Tử Vi được coi là "Tử Vi hóa sát vi quyền" — sức mạnh được dẫn dắt.',
    strengths: ['Can đảm, quyết đoán', 'Chịu áp lực tốt', 'Độc lập, tự lực'],
    watch: ['Nóng vội', 'Thăng trầm lớn', 'Khó chấp nhận bị chỉ huy'],
    domains: {
      menh: 'Thiên hướng hành động nhanh, thích thử thách, không ngại rủi ro.',
      quan: 'Hợp việc cần quyết đoán: khởi nghiệp, quân đội, kỹ thuật, xử lý khủng hoảng.',
      tai: 'Tiền đến theo đợt; nên có kỷ luật tài chính để vượt lúc trầm.',
      phuthe: 'Cần không gian riêng; quan hệ hợp khi hai bên độc lập.',
    },
  },
  'Phá Quân': {
    name: 'Phá Quân',
    element: 'Thủy',
    nickname: 'Hao tinh — ngôi sao tiên phong',
    short: 'Phá cũ lập mới, đổi mới, mạo hiểm.',
    long: 'Phá Quân là đội quân tiên phong: phá vỡ cái cũ để xây cái mới. Người có Phá Quân mạnh thường có nhiều bước ngoặt, thích cải cách. Mặt trái là bốc đồng, hao tổn khi chưa có kế hoạch.',
    strengths: ['Dám đổi mới', 'Không sợ bắt đầu lại', 'Tinh thần tiên phong'],
    watch: ['Bốc đồng', 'Hao tổn nguồn lực', 'Khó duy trì sau khi khởi đầu'],
    domains: {
      menh: 'Thiên hướng không thích lối mòn, đời có nhiều bước ngoặt tự chọn.',
      quan: 'Hợp việc cải tổ, khởi nghiệp, sáng tạo, môi trường biến động.',
      tai: 'Kiếm được nhưng dễ hao; nên tách quỹ an toàn khỏi quỹ thử nghiệm.',
      phuthe: 'Quan hệ nhiều biến chuyển; cần đối tác chịu được thay đổi.',
    },
  },
};

export interface MinorStarInfo {
  name: string;
  group: 'cat' | 'sat' | 'loc-ma' | 'dao-hoa' | 'quy' | 'u-buon' | 'giai' | 'khac';
  short: string;
  long?: string;
  effect: 'tốt' | 'xấu' | 'trung tính';
}

export const MINOR: Record<string, MinorStarInfo> = {
  'Tả Phù': { name: 'Tả Phù', group: 'cat', effect: 'tốt', short: 'Trợ lực: người giúp đỡ, đồng đội tận tâm.', long: 'Cùng Hữu Bật tạo cặp "Tả Hữu" — sự hỗ trợ từ người khác. Có Tả Hữu chiếu Mệnh, sách cổ cho là dễ có người phò trợ.' },
  'Hữu Bật': { name: 'Hữu Bật', group: 'cat', effect: 'tốt', short: 'Trợ lực: người giúp đỡ, khả năng hợp tác.', long: 'Cặp với Tả Phù. Hữu Bật thiên về sự giúp đỡ mềm mỏng, từ bạn bè và người ngang hàng.' },
  'Văn Xương': { name: 'Văn Xương', group: 'cat', effect: 'tốt', short: 'Học vấn, văn bản, thi cử — trí tuệ có hệ thống.', long: 'Cặp "Xương Khúc" chủ về chữ nghĩa. Văn Xương thiên về học thuật chính quy, giấy tờ, văn bản.' },
  'Văn Khúc': { name: 'Văn Khúc', group: 'cat', effect: 'tốt', short: 'Tài ăn nói, nghệ thuật, năng khiếu — trí tuệ mềm.', long: 'Văn Khúc thiên về khẩu tài, âm nhạc, nghệ thuật, sự khéo léo.' },
  'Thiên Khôi': { name: 'Thiên Khôi', group: 'cat', effect: 'tốt', short: 'Quý nhân (ban ngày): người có vị thế nâng đỡ.', long: 'Cặp "Khôi Việt" — thiên ất quý nhân. Thiên Khôi là quý nhân công khai, thường là nam giới hoặc người bề trên.' },
  'Thiên Việt': { name: 'Thiên Việt', group: 'cat', effect: 'tốt', short: 'Quý nhân (ban đêm): sự giúp đỡ âm thầm.', long: 'Thiên Việt là quý nhân ngầm, thường là nữ giới hoặc cơ hội đến gián tiếp.' },
  'Lộc Tồn': { name: 'Lộc Tồn', group: 'loc-ma', effect: 'tốt', short: 'Giữ của, tích lũy, thận trọng.', long: 'Lộc Tồn luôn bị kẹp giữa Kình Dương và Đà La — "có lộc thì có người tranh". Thiên về tích lũy bền bỉ, đôi khi bảo thủ, cô độc.' },
  'Thiên Mã': { name: 'Thiên Mã', group: 'loc-ma', effect: 'trung tính', short: 'Di chuyển, năng động, thay đổi môi trường.', long: 'Thiên Mã gặp Lộc (Lộc Mã giao trì) được coi là đi xa có lợi. Gặp sát tinh hoặc Tuần Triệt thì "ngựa què" — vất vả mà kém hiệu quả.' },
  'Kình Dương': { name: 'Kình Dương', group: 'sat', effect: 'xấu', short: 'Quyết liệt, cạnh tranh, va chạm trực diện.', long: 'Kình Dương là sát tinh "dương": nhanh, sắc, công khai. Đắc địa (ở Thìn Tuất Sửu Mùi) có thể biến thành dũng khí; hãm địa dễ xung đột, tổn thương.' },
  'Đà La': { name: 'Đà La', group: 'sat', effect: 'xấu', short: 'Trì hoãn, dai dẳng, vướng mắc kéo dài.', long: 'Đà La là sát tinh "âm": chậm, ngấm ngầm. Mặt tích cực là sự bền bỉ, kiên trì.' },
  'Hỏa Tinh': { name: 'Hỏa Tinh', group: 'sat', effect: 'xấu', short: 'Bùng nổ nhanh: nóng nảy, biến động đột ngột.', long: 'Hỏa Tinh gặp Tham Lang thành "Hỏa Tham" — sách cổ coi là có thể phát nhanh.' },
  'Linh Tinh': { name: 'Linh Tinh', group: 'sat', effect: 'xấu', short: 'Âm ỉ, bất ngờ: căng thẳng tích tụ rồi bộc phát.', long: 'Cặp "Hỏa Linh". Linh Tinh gặp Tham Lang thành "Linh Tham", ý nghĩa tương tự Hỏa Tham.' },
  'Địa Không': { name: 'Địa Không', group: 'sat', effect: 'xấu', short: 'Hư không: mất mát bất ngờ, nhưng cũng là tư duy khác thường.', long: 'Cặp "Không Kiếp" là sát tinh nặng trong sách cổ. Cách đọc ngày nay: khuynh hướng nghĩ khác số đông — dễ có ý tưởng đột phá nhưng cũng dễ rủi ro tài chính nếu liều.' },
  'Địa Kiếp': { name: 'Địa Kiếp', group: 'sat', effect: 'xấu', short: 'Biến động, hao hụt, liều lĩnh.', long: 'Cặp với Địa Không. Nhắc nhở cần có phương án dự phòng và kỷ luật rủi ro.' },
  'Hồng Loan': { name: 'Hồng Loan', group: 'dao-hoa', effect: 'tốt', short: 'Duyên tình cảm, hỷ sự, sự duyên dáng.' },
  'Thiên Hỷ': { name: 'Thiên Hỷ', group: 'dao-hoa', effect: 'tốt', short: 'Niềm vui, tin mừng, hỷ sự.' },
  'Thiên Riêu': { name: 'Thiên Riêu', group: 'dao-hoa', effect: 'trung tính', short: 'Sức hút, lãng mạn; cũng chỉ sự ham vui.' },
  'Đào Hoa': { name: 'Đào Hoa', group: 'dao-hoa', effect: 'trung tính', short: 'Sức hút với người khác, duyên giao tiếp, tình cảm.' },
  'Thiên Hình': { name: 'Thiên Hình', group: 'khac', effect: 'trung tính', short: 'Kỷ luật, nguyên tắc, pháp lý; sự nghiêm khắc.', long: 'Sách cổ gắn với hình phạt, dao kéo. Cách hiểu ngày nay: sự nghiêm khắc, tinh thần pháp lý, kỷ luật bản thân.' },
  'Tam Thai': { name: 'Tam Thai', group: 'quy', effect: 'tốt', short: 'Địa vị, sự thăng tiến (cặp với Bát Tọa).' },
  'Bát Tọa': { name: 'Bát Tọa', group: 'quy', effect: 'tốt', short: 'Địa vị, chỗ đứng vững (cặp với Tam Thai).' },
  'Ân Quang': { name: 'Ân Quang', group: 'quy', effect: 'tốt', short: 'Ân huệ, được giúp đỡ, biết ơn (cặp với Thiên Quý).' },
  'Thiên Quý': { name: 'Thiên Quý', group: 'quy', effect: 'tốt', short: 'Quý hiển, được nâng đỡ (cặp với Ân Quang).' },
  'Long Trì': { name: 'Long Trì', group: 'quy', effect: 'tốt', short: 'Tài hoa, thẩm mỹ (cặp với Phượng Các).' },
  'Phượng Các': { name: 'Phượng Các', group: 'quy', effect: 'tốt', short: 'Thanh lịch, danh dự, thẩm mỹ.' },
  'Thai Phụ': { name: 'Thai Phụ', group: 'quy', effect: 'tốt', short: 'Danh dự, chức vị phụ tá (cặp với Phong Cáo).' },
  'Phong Cáo': { name: 'Phong Cáo', group: 'quy', effect: 'tốt', short: 'Bằng cấp, sự công nhận chính thức.' },
  'Thiên Quan': { name: 'Thiên Quan', group: 'quy', effect: 'tốt', short: 'Quý nhân, sự trợ giúp từ người có chức vị.' },
  'Thiên Phúc': { name: 'Thiên Phúc', group: 'quy', effect: 'tốt', short: 'Phúc khí, sự may mắn nhẹ nhàng.' },
  'Thiên Đức': { name: 'Thiên Đức', group: 'giai', effect: 'tốt', short: 'Đức độ; giảm nhẹ điều xấu.' },
  'Nguyệt Đức': { name: 'Nguyệt Đức', group: 'giai', effect: 'tốt', short: 'Hiền lành; giảm nhẹ điều xấu.' },
  'Giải Thần': { name: 'Giải Thần', group: 'giai', effect: 'tốt', short: 'Hóa giải, tháo gỡ vướng mắc.' },
  'Niên Giải': { name: 'Niên Giải', group: 'giai', effect: 'tốt', short: 'Hóa giải theo năm sinh.' },
  'Thiên Khốc': { name: 'Thiên Khốc', group: 'u-buon', effect: 'xấu', short: 'Nỗi buồn, sự u uất (cặp với Thiên Hư).' },
  'Thiên Hư': { name: 'Thiên Hư', group: 'u-buon', effect: 'xấu', short: 'Cảm giác trống rỗng, hư hao.' },
  'Cô Thần': { name: 'Cô Thần', group: 'u-buon', effect: 'trung tính', short: 'Cô độc, độc lập (dễ gặp ở nam).' },
  'Quả Tú': { name: 'Quả Tú', group: 'u-buon', effect: 'trung tính', short: 'Cô độc, tự lập (dễ gặp ở nữ).' },
  'Phá Toái': { name: 'Phá Toái', group: 'khac', effect: 'xấu', short: 'Sự đổ vỡ nhỏ, hao tổn lặt vặt.' },
  'Hoa Cái': { name: 'Hoa Cái', group: 'khac', effect: 'trung tính', short: 'Nghệ thuật, tâm linh, sự kiêu hãnh.' },
  'Thiên Tài': { name: 'Thiên Tài', group: 'khac', effect: 'tốt', short: 'Năng khiếu, sự thông minh.' },
  'Thiên Thọ': { name: 'Thiên Thọ', group: 'khac', effect: 'tốt', short: 'Sự bền bỉ, điềm đạm.' },
  'Thiên Trù': { name: 'Thiên Trù', group: 'khac', effect: 'tốt', short: 'Ẩm thực, sự sung túc trong ăn uống.' },
  'Thiên Không': { name: 'Thiên Không', group: 'khac', effect: 'xấu', short: 'Hư không, kế hoạch dễ hụt.' },
  'Thiên Thương': { name: 'Thiên Thương', group: 'khac', effect: 'xấu', short: 'Luôn ở cung Nô Bộc: hao tổn qua quan hệ.' },
  'Thiên Sứ': { name: 'Thiên Sứ', group: 'khac', effect: 'xấu', short: 'Luôn ở cung Tật Ách: nhắc chú ý sức khỏe.' },
  'Thiên Nguyệt': { name: 'Thiên Nguyệt', group: 'khac', effect: 'xấu', short: 'Sách cổ chỉ bệnh vặt; nay đọc là nhắc giữ sức.' },
  'Âm Sát': { name: 'Âm Sát', group: 'khac', effect: 'xấu', short: 'Điều ngấm ngầm, tiểu nhân.' },
  'Thiên Vu': { name: 'Thiên Vu', group: 'khac', effect: 'trung tính', short: 'Tâm linh, sự kế thừa.' },
};

export const HOA_INFO: Record<'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ', { short: string; long: string }> = {
  Lộc: {
    short: 'Hóa Lộc: nguồn lực, sự thuận lợi, dòng chảy tài nguyên đổ vào sao này.',
    long: 'Hóa Lộc làm sao được "kích hoạt" theo hướng thuận lợi: nhiều cơ hội, tài nguyên, sự dễ dàng. Là năng lượng tốt nhất trong Tứ Hóa.',
  },
  Quyền: {
    short: 'Hóa Quyền: sự chủ động, kiểm soát, năng lực chuyên môn mạnh lên.',
    long: 'Hóa Quyền khiến sao mạnh mẽ, chủ động, muốn nắm quyền điều khiển. Tốt cho năng lực và vị thế; quá đà thành độc đoán.',
  },
  Khoa: {
    short: 'Hóa Khoa: uy tín, danh tiếng, học vấn, sự giúp đỡ nhẹ nhàng.',
    long: 'Hóa Khoa mang lại tiếng tốt, sự công nhận, khả năng học hỏi và giải quyết êm thấm.',
  },
  Kỵ: {
    short: 'Hóa Kỵ: điểm vướng mắc, sự chấp niệm — nơi cần chú ý nhiều nhất.',
    long: 'Hóa Kỵ không phải "xui xẻo" mà là nơi năng lượng bị tắc: lo lắng, ám ảnh, thiếu hụt. Cũng chính là nơi bạn đầu tư tâm sức nhiều nhất. Nhận diện đúng giúp chuyển hóa thành động lực.',
  },
};
