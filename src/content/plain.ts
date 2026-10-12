/**
 * Lời giải thích "nói thẳng, dễ hiểu, có việc để làm".
 * Mục tiêu: người chưa từng đọc Tử Vi đọc xong biết ngay mình nên làm gì.
 * Thuật ngữ và tên sao để ở phần "Vì sao?", không đưa vào câu chính.
 */
import type { DomainKey } from './palaces';

/** Bổ sung ý nghĩa sao theo những lĩnh vực chưa có trong stars.ts. */
export const STAR_DOMAIN_EXTRA: Record<string, Partial<Record<DomainKey, string>>> = {
  'Tử Vi': {
    huynh: 'Anh chị em hoặc bạn ngang hàng thường là người có chính kiến, có vị thế; quan hệ tốt khi hai bên tôn trọng nhau, dễ va chạm khi tranh ai quyết.',
    tutuc: 'Kỳ vọng cao vào con cái hoặc người mình dẫn dắt; dễ muốn quyết thay — nên để con tự chọn nhiều hơn.',
    tat: 'Sức bền khá tốt nhưng hay gồng mình, ít chịu nghỉ.',
    no: 'Hợp làm người đứng đầu nhóm; cần người giỏi bên cạnh — nếu chỉ toàn người "dạ vâng" thì dễ quyết sai.',
    dien: 'Coi trọng nhà cửa khang trang, có vị thế; thích sở hữu tài sản đứng tên mình.',
    phumau: 'Cha mẹ hoặc cấp trên thường nghiêm, có uy; quan hệ tốt khi bạn được tin giao việc.',
  },
  'Thiên Cơ': {
    huynh: 'Anh chị em hoặc bạn ngang hàng nhanh nhạy, hay góp ý; quan hệ thay đổi theo giai đoạn, lúc gần lúc xa.',
    tutuc: 'Con cái hoặc người được bạn dạy dỗ thường thông minh, hiếu động; hợp cách dạy bằng giải thích "vì sao".',
    tat: 'Dễ căng thẳng vì nghĩ nhiều, khó ngủ khi có chuyện chưa giải quyết.',
    no: 'Đồng nghiệp, bạn bè thay đổi khá nhiều qua các giai đoạn; bạn là người hay được hỏi ý kiến.',
    dien: 'Hay đổi chỗ ở, sửa sang, sắp xếp lại nhà; tài sản tích lũy theo kế hoạch hơn là may mắn.',
    phumau: 'Cha mẹ hoặc cấp trên là người tính toán, nhiều ý kiến; bạn học được nhiều từ họ nhưng dễ bị "quản".',
  },
  'Thái Dương': {
    huynh: 'Thường là người anh, chị gánh vác; hay giúp đỡ anh em, bạn bè — cần giữ giới hạn để không kiệt sức.',
    tutuc: 'Thương con theo kiểu cho đi nhiều; con cái hướng ngoại, thích được khen.',
    tat: 'Hay làm quá sức, nóng trong người khi căng thẳng.',
    no: 'Có nhiều bạn bè, đồng nghiệp quý mến; dễ bị nhờ vả — nên chọn lọc việc giúp.',
    dien: 'Thích nhà sáng sủa, rộng rãi, đông người; hay chi cho nhà cửa vì gia đình.',
    phuc: 'Vui khi được làm việc có ý nghĩa và được ghi nhận; buồn khi công sức bị lờ đi.',
    phumau: 'Gần gũi, chịu ảnh hưởng nhiều từ cha (hoặc người đàn ông lớn trong nhà); cấp trên thường công khai, rộng rãi.',
  },
  'Vũ Khúc': {
    huynh: 'Anh chị em hoặc bạn ngang hàng thực tế, ít nói tình cảm; quan hệ tốt khi rõ ràng chuyện tiền bạc.',
    tutuc: 'Nghiêm với con, dạy kỷ luật; nên thêm sự mềm mỏng, khen ngợi.',
    tat: 'Khỏe nhưng hay bỏ qua dấu hiệu mệt.',
    di: 'Ra ngoài làm việc hiệu quả, được đánh giá là người làm được việc; hợp công tác, làm ăn xa.',
    no: 'Hợp đồng nghiệp làm việc nghiêm túc; quan hệ dựa trên hiệu quả hơn tình cảm.',
    dien: 'Tích lũy tài sản thực tế, thích tài sản có giá trị rõ ràng (nhà, đất, vàng).',
    phuc: 'An lòng khi tài chính vững; dễ lo lắng khi tiền bạc bấp bênh.',
    phumau: 'Cha mẹ hoặc cấp trên nghiêm khắc, ít bộc lộ tình cảm nhưng lo cho bạn bằng hành động.',
  },
  'Thiên Đồng': {
    huynh: 'Anh chị em, bạn bè hòa thuận, dễ chịu; ít va chạm.',
    tutuc: 'Con cái hiền, gần gũi; gia đình vui vẻ. Cần thêm kỷ luật khi dạy con.',
    tat: 'Thể trạng ổn nhưng dễ tăng cân, lười vận động khi thoải mái.',
    di: 'Ra ngoài được quý vì dễ gần; hợp môi trường thân thiện hơn môi trường cạnh tranh gắt.',
    no: 'Có nhiều bạn bè vui vẻ; ít bạn "cùng chiến đấu" — nên chọn vài người đáng tin để hợp tác.',
    dien: 'Thích nhà ấm cúng, tiện nghi; chi cho sự thoải mái trong nhà.',
    phumau: 'Cha mẹ hiền, dễ tính; cấp trên thường thoải mái.',
  },
  'Liêm Trinh': {
    huynh: 'Quan hệ anh em, bạn ngang hàng có lúc căng do ai cũng có nguyên tắc riêng; nói rõ ràng thì êm.',
    tutuc: 'Kỳ vọng cao, dạy con theo khuôn phép; nên chừa chỗ cho con thử và sai.',
    tat: 'Căng thẳng dồn nén, dễ nóng giận.',
    di: 'Ra ngoài tạo ấn tượng mạnh; hợp môi trường có quy chế, cần minh bạch giấy tờ khi làm ăn xa.',
    no: 'Quan hệ đồng nghiệp rõ ràng trắng đen; dễ có người không ưa vì bạn nguyên tắc — vẫn nên giữ.',
    dien: 'Coi trọng giấy tờ, pháp lý nhà đất; nên kiểm tra kỹ trước giao dịch.',
    phuc: 'Nội tâm nhiều giằng co; cần một hoạt động xả căng thẳng (thể thao, nghệ thuật).',
    phumau: 'Cha mẹ hoặc cấp trên nghiêm, kỷ luật; quan hệ tốt khi bạn chứng minh bằng việc làm.',
  },
  'Thiên Phủ': {
    huynh: 'Anh chị em, bạn ngang hàng đáng tin, hay giúp nhau về vật chất.',
    tutuc: 'Chăm lo con cái chu đáo, lo xa cho con; con cái thường ổn định.',
    tat: 'Thể trạng khá bền; dễ có vấn đề do ăn uống, ít vận động.',
    phuthe: 'Coi trọng sự ổn định, chu đáo trong hôn nhân; người bạn đời thường đáng tin, biết lo.',
    di: 'Ra ngoài được tin tưởng, dễ được giao quản lý tiền bạc, tài sản.',
    no: 'Có mạng lưới quan hệ bền, ít nhưng chất; được cấp dưới nể.',
    phuc: 'An lòng khi có "của để dành"; hưởng phúc muộn, càng về sau càng nhàn.',
    phumau: 'Cha mẹ hoặc cấp trên chu đáo, hay hỗ trợ về vật chất.',
  },
  'Thái Âm': {
    huynh: 'Anh chị em, bạn bè tình cảm, tế nhị; quan hệ êm nhưng hay giữ ý.',
    tutuc: 'Gần gũi con cái, dạy con bằng tình cảm; con thường nhạy cảm.',
    tat: 'Dễ mệt khi cảm xúc không ổn, khó ngủ, ăn uống thất thường.',
    di: 'Ra ngoài kín đáo, được quý vì tinh tế; hợp làm việc ổn định hơn là xông pha.',
    no: 'Có vài người bạn thân lâu năm; hợp đồng nghiệp tinh tế, ít ồn ào.',
    phuc: 'Đời sống nội tâm phong phú; cần không gian riêng để cân bằng.',
    phumau: 'Gần gũi, chịu ảnh hưởng nhiều từ mẹ (hoặc người phụ nữ lớn trong nhà).',
  },
  'Tham Lang': {
    huynh: 'Anh chị em, bạn ngang hàng năng động, nhiều mối quan hệ; vui nhưng cần rõ ràng tiền bạc.',
    tutuc: 'Con cái hoạt bát, nhiều sở thích; cần định hướng để không dàn trải.',
    tat: 'Dễ quá đà trong ăn uống, tiệc tùng, thức khuya.',
    di: 'Ra ngoài rất được việc nhờ giao tế; nhiều cơ hội từ tiệc tùng, sự kiện, mạng lưới.',
    no: 'Bạn bè, quan hệ rất rộng; cần chọn lọc người hợp tác thật sự.',
    dien: 'Thích nhà đẹp, tiện nghi; hay thay đổi, sắm sửa.',
    phuc: 'Vui khi được trải nghiệm nhiều thứ; dễ chán, cần sở thích lâu dài.',
    phumau: 'Cha mẹ hoặc cấp trên cởi mở, xã giao rộng.',
  },
  'Cự Môn': {
    huynh: 'Anh chị em, bạn bè hay tranh luận; quan hệ ổn khi nói chuyện thẳng thắn, không để bụng.',
    tutuc: 'Hay dạy con bằng lý lẽ; nên lắng nghe con nhiều hơn.',
    tat: 'Dễ căng thẳng vì lời qua tiếng lại, hay lo nghĩ.',
    di: 'Ra ngoài nổi bật nhờ ăn nói, lý luận; cẩn thận lời nói nơi đông người.',
    no: 'Đồng nghiệp, bạn bè dễ có hiểu lầm vì lời nói; nên giữ trao đổi quan trọng bằng văn bản.',
    dien: 'Nhà cửa, tài sản dễ có chuyện cần làm rõ (ranh giới, giấy tờ, hàng xóm).',
    phuc: 'Hay suy nghĩ, hoài nghi; cần thói quen thư giãn đầu óc.',
    phumau: 'Hay bất đồng ý kiến với cha mẹ, cấp trên; quan hệ tốt khi tranh luận có tôn trọng.',
  },
  'Thiên Tướng': {
    huynh: 'Anh chị em, bạn bè tử tế, hay giúp nhau; quan hệ công bằng.',
    tutuc: 'Dạy con công bằng, nề nếp; con cái thường lễ phép.',
    tat: 'Thể trạng ổn, dễ bị ảnh hưởng bởi môi trường sống, làm việc.',
    di: 'Ra ngoài được tin cậy, hay được nhờ làm trung gian, hòa giải.',
    no: 'Đồng nghiệp, cấp dưới quý vì bạn công bằng; hợp vai trò kết nối.',
    dien: 'Nhà cửa ngăn nắp, chỉn chu; tài sản ổn định.',
    phuc: 'An lòng khi mọi thứ đúng mực, công bằng.',
    phumau: 'Cha mẹ hoặc cấp trên tử tế, hay giúp đỡ.',
  },
  'Thiên Lương': {
    huynh: 'Bạn thường là người được anh em, bạn bè tìm đến xin lời khuyên.',
    tutuc: 'Che chở con cái nhiều; nên để con tự giải quyết vấn đề nhỏ.',
    tat: 'Sức khỏe nhìn chung bền, có khả năng hồi phục tốt.',
    di: 'Ra ngoài được kính trọng, dễ gặp người lớn tuổi giúp đỡ.',
    no: 'Hợp vai trò người hướng dẫn, cố vấn trong nhóm.',
    dien: 'Nhà cửa thường được thừa hưởng hoặc có người lớn hỗ trợ.',
    phuc: 'Đời sống tinh thần vững, có niềm tin; dễ quan tâm việc thiện, tâm linh.',
    phumau: 'Cha mẹ, người lớn che chở nhiều; quan hệ với cấp trên tốt.',
  },
  'Thất Sát': {
    huynh: 'Anh chị em, bạn ngang hàng mạnh mẽ, độc lập; mỗi người một hướng.',
    tutuc: 'Con cái cá tính, độc lập sớm; dạy con bằng ví dụ hơn là ép.',
    tat: 'Hay làm hết sức rồi kiệt sức; dễ có chấn thương do vận động mạnh.',
    di: 'Ra ngoài xông xáo, hợp môi trường mới, nhiều thử thách.',
    no: 'Hợp làm việc với người thẳng thắn, có năng lực; không hợp nhóm nhiều thủ tục.',
    dien: 'Nhà cửa, tài sản có lúc thay đổi lớn (bán, mua, chuyển).',
    phuc: 'Ít khi chịu ngồi yên; cần mục tiêu để thấy sống có ý nghĩa.',
    phumau: 'Hay bất đồng với cha mẹ, cấp trên; độc lập sớm.',
  },
  'Phá Quân': {
    huynh: 'Quan hệ anh em, bạn bè có nhiều thay đổi; mỗi người một ngả.',
    tutuc: 'Con cái cá tính, thích khác biệt; cần kiên nhẫn.',
    tat: 'Sinh hoạt thất thường, hay thức khuya, ăn uống không đều.',
    di: 'Ra ngoài thích khám phá; nhiều thay đổi chỗ làm, chỗ ở.',
    no: 'Bạn bè, đồng nghiệp thay đổi nhiều; hợp nhóm khởi nghiệp, đổi mới.',
    dien: 'Nhà cửa hay thay đổi, sửa chữa, mua bán.',
    phuc: 'Không thích lối mòn; vui khi được làm điều mới.',
    phumau: 'Hay khác quan điểm với cha mẹ, cấp trên; tự lập sớm.',
  },
};

/** Lời khuyên hành động theo chính tinh (dùng cho mục "Nên làm"). */
export const STAR_ADVICE: Record<string, string> = {
  'Tử Vi': 'Tìm người giỏi hỗ trợ thay vì ôm hết việc; chủ động xin góp ý thẳng thắn từ người mà bạn tin.',
  'Thiên Cơ': 'Chọn một hướng và giữ ít nhất 6–12 tháng rồi mới đánh giá lại; viết kế hoạch ra giấy để bớt nghĩ vòng vòng.',
  'Thái Dương': 'Cho đi có giới hạn: đặt ranh giới thời gian và sức lực; ghi lại thành tích để người khác thấy công sức của bạn.',
  'Vũ Khúc': 'Mềm mỏng hơn trong cách nói; dành thời gian cho các mối quan hệ, không chỉ cho kết quả công việc.',
  'Thiên Đồng': 'Đặt mục tiêu có hạn chót rõ ràng; đừng né những cuộc nói chuyện khó.',
  'Liêm Trinh': 'Làm việc minh bạch, giấy tờ rõ ràng; có một kênh xả căng thẳng lành mạnh (thể thao, đi bộ).',
  'Thiên Phủ': 'Dành một phần nhỏ thời gian, tiền bạc để thử điều mới — đừng để thận trọng thành bỏ lỡ cơ hội.',
  'Thái Âm': 'Nói ra điều mình cần thay vì chờ người khác đoán; tích lũy đều đặn, dài hạn.',
  'Tham Lang': 'Giới hạn số việc làm cùng lúc; đặt trần chi tiêu cho ăn chơi, mua sắm.',
  'Cự Môn': 'Nghĩ kỹ trước khi nói; giữ trao đổi quan trọng bằng văn bản.',
  'Thiên Tướng': 'Tập nói "không" với việc không phải của mình; chọn môi trường tốt vì bạn dễ bị ảnh hưởng.',
  'Thiên Lương': 'Giúp khi được nhờ, tránh khuyên khi người khác chưa hỏi; giữ thời gian cho chính mình.',
  'Thất Sát': 'Có quỹ dự phòng trước khi mạo hiểm; chậm lại một ngày trước mọi quyết định lớn.',
  'Phá Quân': 'Có kế hoạch trước khi phá cái cũ; tách tiền thử nghiệm khỏi tiền an toàn.',
};

/** Phụ tinh, Tứ Hóa nói bằng lời thường. */
export const MINOR_PLAIN: Record<string, { text: string; good: boolean }> = {
  'Tả Phù': { text: 'có người giúp sức, dễ tìm được trợ thủ', good: true },
  'Hữu Bật': { text: 'có bạn bè, người ngang hàng hỗ trợ', good: true },
  'Văn Xương': { text: 'lợi thế về học hành, bằng cấp, giấy tờ', good: true },
  'Văn Khúc': { text: 'lợi thế về ăn nói, năng khiếu, sự khéo léo', good: true },
  'Thiên Khôi': { text: 'dễ gặp người có vị thế nâng đỡ', good: true },
  'Thiên Việt': { text: 'hay có người giúp âm thầm, cơ hội đến gián tiếp', good: true },
  'Lộc Tồn': { text: 'giữ được tiền, tích lũy tốt (nhưng dễ có người tranh phần)', good: true },
  'Kình Dương': { text: 'cạnh tranh, va chạm trực diện', good: false },
  'Đà La': { text: 'việc dễ kéo dài, chậm, vướng thủ tục', good: false },
  'Hỏa Tinh': { text: 'nóng vội, thay đổi đột ngột', good: false },
  'Linh Tinh': { text: 'căng thẳng âm ỉ rồi bộc phát', good: false },
  'Địa Không': { text: 'dễ hao hụt nếu liều lĩnh, kế hoạch dễ hụt', good: false },
  'Địa Kiếp': { text: 'dễ mất mát bất ngờ nếu chủ quan', good: false },
};

export const HOA_PLAIN: Record<'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ', { text: string; good: boolean }> = {
  Lộc: { text: 'thêm cơ hội, nguồn lợi', good: true },
  Quyền: { text: 'có tiếng nói, nắm quyền chủ động', good: true },
  Khoa: { text: 'được tin tưởng, có uy tín, dễ được giúp', good: true },
  Kỵ: { text: 'dễ lo nghĩ, vướng mắc, hiểu lầm', good: false },
};

/** Câu "trọng tâm năm" theo cung. */
export const FOCUS: Record<string, string> = {
  Mệnh: 'Chuyện của chính bạn — sức khỏe, hình ảnh, các quyết định cá nhân — là trọng tâm.',
  'Huynh Đệ': 'Anh chị em, bạn thân và người cộng sự ngang hàng là chủ đề lớn.',
  'Phu Thê': 'Tình cảm, hôn nhân và các mối quan hệ đối tác là chủ đề lớn.',
  'Tử Tức': 'Con cái, học trò hoặc "đứa con tinh thần" (dự án, sản phẩm) là chủ đề lớn.',
  'Tài Bạch': 'Tiền bạc — thu nhập, chi tiêu, đầu tư — là chủ đề lớn.',
  'Tật Ách': 'Sức khỏe và nhịp sinh hoạt là chủ đề lớn — nên ưu tiên chăm sóc bản thân.',
  'Thiên Di': 'Đi lại, môi trường mới, cơ hội từ bên ngoài là chủ đề lớn.',
  'Nô Bộc': 'Đồng nghiệp, bạn bè, khách hàng — mạng lưới quan hệ — là chủ đề lớn.',
  'Quan Lộc': 'Công việc, sự nghiệp là chủ đề lớn nhất.',
  'Điền Trạch': 'Nhà cửa, chỗ ở, tài sản tích lũy là chủ đề lớn.',
  'Phúc Đức': 'Đời sống tinh thần, gia đình lớn, những gì làm bạn an lòng là chủ đề lớn.',
  'Phụ Mẫu': 'Cha mẹ, cấp trên, giấy tờ hành chính là chủ đề lớn.',
};

/** Tiền đến từ đâu khi cung này được "kích hoạt tốt" (lưu Hóa Lộc, lưu Lộc Tồn). */
export const MONEY_SOURCE: Record<string, string> = {
  Mệnh: 'chính năng lực và sự chủ động của bạn: việc riêng, dịch vụ cá nhân, những gì bạn tự đứng ra làm',
  'Huynh Đệ': 'anh chị em, bạn thân hoặc người cộng sự ngang hàng (góp vốn, giới thiệu việc)',
  'Phu Thê': 'vợ/chồng hoặc đối tác hợp tác; làm ăn chung thuận lợi',
  'Tử Tức': 'đầu tư dài hạn, dự án sáng tạo, việc dạy học hoặc liên quan đến trẻ em, con cái',
  'Tài Bạch': 'thu nhập trực tiếp tăng: lương thưởng, doanh thu, khoản thu thêm',
  'Tật Ách': 'công việc chăm sóc, sức khỏe, dịch vụ cá nhân; hoặc nhờ làm việc bền bỉ',
  'Thiên Di': 'bên ngoài: khách hàng mới, đi công tác, làm ăn xa, mở rộng thị trường',
  'Nô Bộc': 'mạng lưới quan hệ: đồng nghiệp, khách hàng cũ, người quen giới thiệu',
  'Quan Lộc': 'công việc chính: tăng lương, thưởng, thăng chức, dự án mới',
  'Điền Trạch': 'nhà đất, tài sản: cho thuê, mua bán, tài sản tăng giá',
  'Phúc Đức': 'gia đình lớn, thừa hưởng, hoặc biến sở thích thành nguồn thu',
  'Phụ Mẫu': 'cấp trên, tổ chức lớn, cơ quan nhà nước, hợp đồng có giấy tờ chính thức, hoặc cha mẹ hỗ trợ',
};

/** Tiền dễ hao ở đâu khi cung này có lưu Hóa Kỵ. */
export const MONEY_LEAK: Record<string, string> = {
  Mệnh: 'quyết định tiền bạc theo cảm xúc, chi cho bản thân vượt kế hoạch',
  'Huynh Đệ': 'cho anh em, bạn bè vay hoặc góp vốn chung không rõ ràng',
  'Phu Thê': 'bất đồng chuyện tiền với vợ/chồng hoặc đối tác; hợp tác không có giấy tờ',
  'Tử Tức': 'chi cho con cái, học hành hoặc khoản đầu tư dài hạn vượt dự tính',
  'Tài Bạch': 'chi tiêu vượt thu, thu nhập chậm hoặc thất thường',
  'Tật Ách': 'chi phí sức khỏe, chăm sóc phát sinh',
  'Thiên Di': 'chi phí đi lại, làm ăn xa nhiều rủi ro hơn dự tính',
  'Nô Bộc': 'bảo lãnh, cho vay, tin nhầm đối tác hoặc nhân viên',
  'Quan Lộc': 'rắc rối giấy tờ, hợp đồng công việc; chi phí kinh doanh tăng',
  'Điền Trạch': 'sửa chữa nhà, giao dịch nhà đất vướng pháp lý',
  'Phúc Đức': 'chi cho sở thích, cảm xúc, việc họ hàng',
  'Phụ Mẫu': 'chi cho cha mẹ, thủ tục hành chính, thuế phí',
};

/** Việc nên làm để tận dụng nguồn tiền. */
export const MONEY_TODO_SOURCE: Record<string, string> = {
  Mệnh: 'Chủ động nhận thêm việc riêng hoặc dự án cá nhân; đầu tư vào kỹ năng có thể bán được.',
  'Huynh Đệ': 'Nói chuyện với anh em, bạn thân về cơ hội hợp tác — nhưng ghi rõ phần ai nấy giữ.',
  'Phu Thê': 'Cùng vợ/chồng hoặc đối tác lên kế hoạch tài chính chung; hợp tác thì làm hợp đồng.',
  'Tử Tức': 'Tận dụng cho đầu tư dài hạn (tiết kiệm định kỳ, quỹ học cho con), không lướt sóng.',
  'Tài Bạch': 'Đề xuất tăng giá/tăng lương; dành ngay 20% phần thu thêm vào tiết kiệm.',
  'Tật Ách': 'Làm đều, giữ sức khỏe để duy trì thu nhập; cân nhắc dịch vụ liên quan chăm sóc.',
  'Thiên Di': 'Mở rộng khách hàng ở nơi khác, nhận công tác, thử kênh bán hàng mới.',
  'Nô Bộc': 'Chủ động kết nối lại khách hàng cũ, nhờ giới thiệu; tham gia hội nhóm nghề nghiệp.',
  'Quan Lộc': 'Đề xuất tăng lương hoặc nhận thêm trách nhiệm; ứng tuyển vị trí cao hơn nếu đang tìm việc.',
  'Điền Trạch': 'Rà soát tài sản: cho thuê phần chưa dùng, cân nhắc mua/bán khi giá hợp lý (có người am hiểu tư vấn).',
  'Phúc Đức': 'Thử biến một sở thích thành nguồn thu nhỏ; gắn kết gia đình lớn.',
  'Phụ Mẫu': 'Làm việc với tổ chức lớn, đấu thầu, hợp đồng chính thức; giữ quan hệ tốt với cấp trên.',
};

/** Việc nên làm để chặn chỗ hao. */
export const MONEY_TODO_LEAK: Record<string, string> = {
  Mệnh: 'Đặt quy tắc chờ 48 giờ trước mọi khoản chi lớn cho bản thân.',
  'Huynh Đệ': 'Hạn chế cho vay; nếu góp vốn với người thân thì ghi giấy rõ ràng.',
  'Phu Thê': 'Thống nhất ngân sách gia đình; mọi hợp tác làm ăn đều có hợp đồng.',
  'Tử Tức': 'Đặt trần chi cho con cái, học hành; không vay để đầu tư dài hạn.',
  'Tài Bạch': 'Lập ngân sách tháng và quỹ dự phòng 3–6 tháng chi tiêu.',
  'Tật Ách': 'Mua hoặc rà soát bảo hiểm sức khỏe; khám định kỳ sớm để tránh chi lớn về sau.',
  'Thiên Di': 'Tính kỹ chi phí trước khi đi xa làm ăn; có phương án rút lui.',
  'Nô Bộc': 'Không đứng ra bảo lãnh; kiểm tra kỹ đối tác, nhân viên trước khi giao tiền.',
  'Quan Lộc': 'Đọc kỹ hợp đồng, lưu giấy tờ; kiểm soát chi phí kinh doanh hàng tháng.',
  'Điền Trạch': 'Kiểm tra pháp lý kỹ trước giao dịch nhà đất; để sẵn khoản sửa chữa nhà.',
  'Phúc Đức': 'Đặt ngân sách cố định cho sở thích và việc họ hàng.',
  'Phụ Mẫu': 'Dự trù khoản chăm lo cha mẹ; nộp thuế, phí đúng hạn.',
};

/** Chính tinh → bộ phận cơ thể mà sách Tử Vi thường gắn (lời nhắc, không phải chẩn đoán) và thói quen nên giữ. */
export const STAR_BODY: Record<string, { organs: string; habit: string }> = {
  'Tử Vi': { organs: 'dạ dày, tiêu hóa', habit: 'ăn đúng giờ, ăn chậm, hạn chế đồ cay nóng khi căng thẳng' },
  'Thiên Cơ': { organs: 'gan, mật, hệ thần kinh', habit: 'hạn chế rượu bia, ngủ trước 23 giờ, có thời gian "tắt máy" đầu óc' },
  'Thái Dương': { organs: 'tim, mắt, huyết áp', habit: 'theo dõi huyết áp, nghỉ mắt khi làm máy tính, giảm thức khuya' },
  'Vũ Khúc': { organs: 'phổi, đường hô hấp', habit: 'tránh khói thuốc, vận động ngoài trời, giữ ấm cổ họng' },
  'Thiên Đồng': { organs: 'thận, bàng quang, tai', habit: 'uống đủ nước, hạn chế muối, vận động đều để không tăng cân' },
  'Liêm Trinh': { organs: 'tim mạch, máu, huyết áp', habit: 'theo dõi huyết áp và mỡ máu, tập thở để hạ căng thẳng' },
  'Thiên Phủ': { organs: 'dạ dày, lá lách, tiêu hóa', habit: 'ăn uống điều độ, hạn chế tiệc tùng, vận động sau bữa ăn' },
  'Thái Âm': { organs: 'thận, nội tiết, mắt', habit: 'ngủ đủ, uống đủ nước, chăm sóc cảm xúc vì dễ ảnh hưởng thể chất' },
  'Tham Lang': { organs: 'gan, thận', habit: 'hạn chế rượu bia và thức khuya, chừng mực ăn uống' },
  'Cự Môn': { organs: 'dạ dày, đường tiêu hóa, miệng họng', habit: 'ăn đúng giờ, ăn chậm, khám răng miệng định kỳ' },
  'Thiên Tướng': { organs: 'da, thận', habit: 'uống đủ nước, giữ môi trường sống sạch, ít hóa chất' },
  'Thiên Lương': { organs: 'dạ dày, tỳ vị', habit: 'ăn uống điều độ, đừng ôm việc người khác đến mất ngủ' },
  'Thất Sát': { organs: 'phổi, đường hô hấp, cơ xương', habit: 'khởi động kỹ trước khi vận động mạnh, nghỉ đủ giữa các đợt làm việc' },
  'Phá Quân': { organs: 'thận, hệ tiết niệu', habit: 'sinh hoạt đều giờ, uống đủ nước, hạn chế thức khuya' },
};

/** Ngũ hành → cơ quan theo y học cổ truyền (dùng như lời nhắc, không phải chẩn đoán). */
export const ELEMENT_BODY: Record<string, { organs: string; habit: string }> = {
  Kim: { organs: 'phổi, đường hô hấp, da', habit: 'tránh khói thuốc, giữ ấm cổ họng khi trời lạnh, vận động ngoài trời' },
  Mộc: { organs: 'gan, mật, gân cơ, mắt', habit: 'hạn chế rượu bia và đồ chiên rán, ngủ trước 23 giờ' },
  Thủy: { organs: 'thận, bàng quang, tai, hệ nội tiết', habit: 'uống đủ nước, hạn chế muối, đừng nhịn tiểu' },
  Hỏa: { organs: 'tim, mạch máu, huyết áp, mắt', habit: 'theo dõi huyết áp, giảm cà phê và thức khuya, tập thở để hạ căng thẳng' },
  Thổ: { organs: 'dạ dày, lá lách, đường tiêu hóa', habit: 'ăn đúng giờ, ăn chậm, hạn chế đồ cay nóng khi căng thẳng' },
};

/** Sát tinh liên quan sức khỏe theo sách cổ → lời nhắc thực tế. */
export const BAD_STAR_HEALTH: Record<string, string> = {
  'Kình Dương': 'sách cổ gắn với va chạm, chấn thương, dao kéo — lời nhắc: cẩn thận khi lái xe, chơi thể thao, dùng dụng cụ sắc',
  'Đà La': 'sách cổ gắn với bệnh dai dẳng — lời nhắc: có triệu chứng kéo dài thì đi khám sớm, đừng tự chữa',
  'Hỏa Tinh': 'sách cổ gắn với nóng, viêm, nóng giận — lời nhắc: giữ bình tĩnh, ngủ đủ, uống đủ nước',
  'Linh Tinh': 'sách cổ gắn với căng thẳng tích tụ — lời nhắc: xả stress đều đặn, đừng dồn nén',
  'Địa Không': 'sách cổ gắn với suy nhược, mất ngủ — lời nhắc: giữ giờ ngủ cố định, giảm màn hình buổi tối',
  'Địa Kiếp': 'sách cổ gắn với hao tổn sức lực — lời nhắc: đừng làm việc liên tục không nghỉ',
};

/** Lời khuyên lĩnh vực khi cung có nhiều thử thách. */
export const DOMAIN_CAUTION_ADVICE: Partial<Record<DomainKey, string>> = {
  menh: 'Biết rõ điểm yếu của mình và có người góp ý thẳng thắn.',
  huynh: 'Rõ ràng chuyện tiền bạc và vai trò khi làm việc với anh em, bạn thân.',
  phuthe: 'Nói chuyện thẳng thắn, định kỳ với người bạn đời về kỳ vọng của hai bên.',
  tutuc: 'Dành thời gian chất lượng thay vì chỉ lo vật chất cho con.',
  tai: 'Lập ngân sách, quỹ dự phòng; tránh vay để đầu tư.',
  tat: 'Khám sức khỏe định kỳ mỗi năm; giữ giờ ngủ và vận động đều.',
  di: 'Chuẩn bị kỹ trước khi đi xa hoặc thay đổi môi trường.',
  no: 'Chọn lọc người hợp tác; không bảo lãnh, không cho vay lớn.',
  quan: 'Lưu giấy tờ, hợp đồng; chọn môi trường hợp với cách làm việc của bạn.',
  dien: 'Kiểm tra pháp lý kỹ trước mọi giao dịch nhà đất.',
  phuc: 'Có thói quen cân bằng tinh thần: thể thao, thiền, sở thích lâu dài.',
  phumau: 'Giữ liên lạc đều với cha mẹ; trao đổi rõ ràng với cấp trên.',
};

/** Lưu nguyệt rơi vào cung này → tháng nên dồn sức làm gì. */
export const MONTH_DO: Record<string, string> = {
  Mệnh: 'Ưu tiên việc của chính bạn: chốt các quyết định cá nhân đang treo, chăm chút sức khỏe và hình ảnh bản thân.',
  'Huynh Đệ': 'Gặp anh chị em, bạn thân, cộng sự; bàn chuyện hợp tác nhưng ghi rõ ai làm phần nào.',
  'Phu Thê': 'Dành thời gian cho người thương; với đối tác, rà lại thỏa thuận và cùng chốt kế hoạch.',
  'Tử Tức': 'Để tâm chuyện con cái, học hành; đẩy tiến độ dự án sáng tạo hoặc sản phẩm đang làm dở.',
  'Tài Bạch': 'Rà thu chi, thu hồi các khoản người khác còn nợ, chốt giá với khách hoặc đề xuất tăng lương.',
  'Tật Ách': 'Giảm tải, ngủ đủ, đặt lịch khám nếu đã lâu chưa khám; không nhận thêm việc quá sức.',
  'Thiên Di': 'Hợp đi công tác, gặp khách hàng mới, thử môi trường mới; chuẩn bị kỹ lịch trình.',
  'Nô Bộc': 'Kết nối lại khách hàng cũ, đồng nghiệp; nhờ người giới thiệu; sắp xếp lại người làm cùng.',
  'Quan Lộc': 'Dồn sức cho công việc chính: nhận dự án, báo cáo kết quả với cấp trên, hoàn tất việc tồn đọng.',
  'Điền Trạch': 'Lo việc nhà: sửa chữa, dọn dẹp, rà giấy tờ nhà đất; hợp đi xem nhà nếu đang định mua hoặc thuê.',
  'Phúc Đức': 'Chậm lại một chút: thăm họ hàng, nghỉ ngơi, làm điều khiến bạn an lòng; đừng xếp lịch kín mít.',
  'Phụ Mẫu': 'Thăm cha mẹ; làm các thủ tục giấy tờ, hồ sơ; giữ liên lạc tốt với cấp trên.',
};

/** Hóa Kỵ của tháng rơi vào cung này → tháng nên tránh gì. */
export const MONTH_AVOID: Record<string, string> = {
  Mệnh: 'Đừng quyết định lớn lúc đang mệt hoặc nóng giận; đừng ôm hết việc vào mình.',
  'Huynh Đệ': 'Hạn chế cho anh em, bạn bè vay khoản lớn; chuyện gì cũng nói rõ để khỏi mất lòng.',
  'Phu Thê': 'Dễ hiểu lầm với người thương hoặc đối tác — nói chuyện sớm, đừng im lặng cho qua.',
  'Tử Tức': 'Chuyện con cái hoặc dự án dễ khiến bạn lo; chưa nên đổ thêm tiền vào khoản đầu tư dài hạn còn chưa rõ.',
  'Tài Bạch': 'Không chi lớn ngoài kế hoạch, không cho vay, không đầu cơ.',
  'Tật Ách': 'Đừng gồng: thấy mệt thì nghỉ, có triệu chứng lạ thì đi khám.',
  'Thiên Di': 'Đi xa thì kiểm tra kỹ giấy tờ, lịch trình; chưa nên vội đổi môi trường.',
  'Nô Bộc': 'Kiểm tra kỹ trước khi giao tiền hoặc việc lớn cho người khác; không đứng ra bảo lãnh.',
  'Quan Lộc': 'Giữ trao đổi công việc bằng văn bản; đọc kỹ hợp đồng; đừng quyết nghỉ việc lúc bực.',
  'Điền Trạch': 'Chưa nên ký giao dịch nhà đất nếu pháp lý chưa rõ; để sẵn một khoản sửa chữa.',
  'Phúc Đức': 'Dễ suy nghĩ nhiều, khó ngủ — bớt lướt mạng ban đêm, tránh chuyện thị phi trong họ hàng.',
  'Phụ Mẫu': 'Nộp giấy tờ, thuế phí đúng hạn; nhẫn nại hơn với cấp trên và cha mẹ.',
};

/** Cách gọi ngắn, đời thường cho chủ đề của tháng theo cung. */
export const MONTH_TOPIC: Record<string, string> = {
  Mệnh: 'bản thân bạn',
  'Huynh Đệ': 'anh chị em, bạn thân, cộng sự',
  'Phu Thê': 'tình cảm, vợ chồng, đối tác',
  'Tử Tức': 'con cái, dự án riêng',
  'Tài Bạch': 'tiền bạc',
  'Tật Ách': 'sức khỏe, nhịp sinh hoạt',
  'Thiên Di': 'đi lại, môi trường bên ngoài',
  'Nô Bộc': 'đồng nghiệp, khách hàng, bạn bè',
  'Quan Lộc': 'công việc',
  'Điền Trạch': 'nhà cửa, tài sản',
  'Phúc Đức': 'tinh thần, họ hàng',
  'Phụ Mẫu': 'cha mẹ, cấp trên, giấy tờ',
};
