/**
 * Nội dung cho bản "Luận giải trọn đời": nguyên tắc, dấu hiệu lệch hướng, chặng đời, đòn bẩy, điểm mù.
 * Viết cụ thể, có hành động, không phán số phận, không chẩn đoán bệnh.
 */

/** Theo từng chính tinh: dấu hiệu bạn đang dùng quá đà mặt trái của sao, và nguyên tắc một câu để giữ. */
export const STAR_GUARD: Record<string, { drift: string; rule: string; tempo: 'dong' | 'tinh' }> = {
  'Tử Vi': {
    drift: 'bạn bắt đầu tự làm hết vì "người khác làm không vừa ý", hoặc thấy khó chịu kéo dài khi ý kiến của mình không được nghe',
    rule: 'Giữ vai người cầm lái, nhưng giao bớt tay chèo: việc nào người khác làm được 80% như mình thì giao.',
    tempo: 'tinh',
  },
  'Thiên Cơ': {
    drift: 'bạn đã nghĩ về cùng một quyết định hơn hai tuần mà vẫn chưa làm bước nhỏ nào, hoặc đổi kế hoạch liên tục trước khi kịp thấy kết quả',
    rule: 'Suy nghĩ có hạn chót: đặt ngày quyết định, đến ngày thì chọn phương án tốt nhất đang có và làm thử.',
    tempo: 'tinh',
  },
  'Thái Dương': {
    drift: 'lịch của bạn kín việc của người khác, bạn mệt mà vẫn nhận thêm, và thấy tủi khi không ai ghi nhận',
    rule: 'Cho đi có ngân sách: mỗi tuần dành một khoảng cố định để giúp người, ngoài khoảng đó thì biết nói "để mình xem lại".',
    tempo: 'dong',
  },
  'Vũ Khúc': {
    drift: 'mọi cuộc nói chuyện trong nhà đều quay về tiền và việc, và người thân bắt đầu ngại chia sẻ với bạn',
    rule: 'Đo bằng kết quả ở chỗ làm, đo bằng thời gian ở trong nhà: mỗi tuần có ít nhất một buổi không bàn chuyện tiền.',
    tempo: 'dong',
  },
  'Thiên Đồng': {
    drift: 'bạn hoãn một việc khó quá ba lần, hoặc chọn "thôi kệ" cho một chuyện mà trong lòng vẫn còn bận tâm',
    rule: 'Việc khó làm trước 10 giờ sáng; chuyện không vừa ý thì nói trong vòng một tuần, nói nhẹ cũng được nhưng phải nói.',
    tempo: 'tinh',
  },
  'Liêm Trinh': {
    drift: 'bạn đưa ra quyết định lớn ngay lúc đang giận hoặc đang quá hưng phấn, hoặc cắt đứt một mối quan hệ chỉ vì một lần thất vọng',
    rule: 'Cảm xúc mạnh thì chờ một đêm: không gửi tin nhắn, không ký, không nghỉ việc trong 24 giờ đầu.',
    tempo: 'dong',
  },
  'Thiên Phủ': {
    drift: 'bạn từ chối một cơ hội tốt chỉ vì nó chưa chắc chắn trăm phần trăm, hoặc giữ tiền nhàn rỗi quá lâu vì sợ',
    rule: 'Chia tiền làm ba phần: an toàn, tăng trưởng, thử nghiệm nhỏ — phần thử nghiệm nhỏ là để bạn không bỏ lỡ cơ hội vì quá thận trọng.',
    tempo: 'tinh',
  },
  'Thái Âm': {
    drift: 'bạn mua sắm nhiều hơn khi buồn, hoặc giữ một nỗi khó chịu trong lòng nhiều ngày mà không nói với ai',
    rule: 'Cảm xúc cần lối ra đều đặn: viết, đi bộ, hoặc nói với một người tin cậy mỗi tuần — đừng để dồn lại thành quyết định.',
    tempo: 'tinh',
  },
  'Tham Lang': {
    drift: 'bạn đang cùng lúc theo đuổi bốn, năm việc mới mà chưa việc nào xong, hoặc chi tiêu cho vui chơi vượt kế hoạch hai tháng liền',
    rule: 'Mỗi lúc chỉ ba ưu tiên: muốn thêm việc mới thì phải bỏ hoặc xong một việc cũ.',
    tempo: 'dong',
  },
  'Cự Môn': {
    drift: 'bạn thắng nhiều cuộc tranh luận nhưng người xung quanh bắt đầu tránh nói chuyện thật với bạn, hoặc một lời nói của bạn bị truyền đi sai ý',
    rule: 'Góp ý kèm cách sửa; chuyện quan trọng thì viết ra thay vì chỉ nói miệng.',
    tempo: 'dong',
  },
  'Thiên Tướng': {
    drift: 'bạn ôm việc của người khác vì "thấy không công bằng", hoặc dành quá nhiều công sức cho hình thức mà trễ tiến độ',
    rule: 'Giúp người nhưng không gánh thay; xong trước, đẹp sau.',
    tempo: 'tinh',
  },
  'Thiên Lương': {
    drift: 'bạn hay nói "để anh/chị chỉ cho" kể cả khi không ai hỏi, hoặc lo thay cho người khác đến mức họ không tự làm nữa',
    rule: 'Chỉ khuyên khi được hỏi; giúp bằng cách dạy cách làm, không làm thay.',
    tempo: 'tinh',
  },
  'Thất Sát': {
    drift: 'bạn ra một quyết định lớn chỉ trong vài ngày, hoặc va chạm với cấp trên, đối tác nhiều lần trong một tháng',
    rule: 'Dám làm, nhưng luôn có đường lùi: trước mỗi bước lớn, viết ra kế hoạch B và khoản tiền tối đa chấp nhận mất.',
    tempo: 'dong',
  },
  'Phá Quân': {
    drift: 'bạn muốn bỏ một việc ngay trước lúc nó sắp ra kết quả, hoặc làm lại từ đầu lần thứ ba mà không giữ lại được gì',
    rule: 'Trước khi đập đi, liệt kê ba thứ đang chạy tốt và giữ chúng lại; chỉ thay phần thật sự hỏng.',
    tempo: 'dong',
  },
};

/** Theo từng cung (lĩnh vực): dấu hiệu bạn đang đi đúng hướng, tình huống kích hoạt điểm mù, hệ quả nếu để lâu. */
export const DOMAIN_SIGNS: Record<string, { good: string; trigger: string; consequence: string; early: string }> = {
  Mệnh: {
    good: 'người khác tìm đến bạn vì đúng thế mạnh của bạn, và bạn thấy mình là chính mình khi làm việc',
    trigger: 'giai đoạn áp lực cao, phải đưa ra nhiều quyết định cá nhân cùng lúc',
    consequence: 'quyết định theo thói quen cũ thay vì theo điều mình thật sự cần, rồi mất thời gian sửa lại',
    early: 'bạn thấy mình phản ứng giống hệt lần trước dù kết quả lần trước không tốt',
  },
  'Huynh Đệ': {
    good: 'anh chị em, bạn thân và cộng sự cùng cấp vừa thân vừa rõ ràng — giúp nhau mà không ai thấy thiệt',
    trigger: 'chuyện tiền bạc chung, góp vốn, chia tài sản hoặc làm ăn với người thân',
    consequence: 'mất lòng nhau vì những điều chưa nói rõ từ đầu',
    early: 'có người thân rủ góp vốn hoặc hỏi vay mà chưa ai nói tới giấy tờ',
  },
  'Phu Thê': {
    good: 'hai người nói được chuyện khó mà không thành cãi vã, và mỗi người vẫn có khoảng riêng',
    trigger: 'lúc công việc hoặc tiền bạc căng thẳng, mang áp lực về nhà',
    consequence: 'những chuyện nhỏ chưa nói tích lại thành khoảng cách',
    early: 'hai người nói chuyện ít dần, chỉ còn trao đổi việc nhà và lịch đưa đón',
  },
  'Tử Tức': {
    good: 'con cái (hoặc người được bạn dìu dắt, dự án của bạn) lớn lên theo cách riêng mà vẫn gần bạn',
    trigger: 'các mốc chuyển cấp, chọn trường, chọn nghề của con; hoặc lúc dự án gặp khó',
    consequence: 'kiểm soát quá nhiều khiến người kia (hoặc dự án) mất tự chủ',
    early: 'bạn biết ít hơn trước về những gì con (hoặc người được bạn dìu dắt) đang nghĩ',
  },
  'Tài Bạch': {
    good: 'thu nhập tăng đều, có quỹ dự phòng, và bạn biết rõ tiền mỗi tháng đi đâu',
    trigger: 'có cơ hội "kiếm nhanh", hoặc thu nhập đột ngột tăng hay giảm',
    consequence: 'chi trước nghĩ sau, hoặc đặt quá nhiều tiền vào một chỗ',
    early: 'cuối tháng bạn không nói được chính xác tiền đã đi đâu',
  },
  'Tật Ách': {
    good: 'ngủ đủ, có thói quen vận động, và bạn nhận ra cơ thể mệt trước khi nó buộc bạn phải dừng',
    trigger: 'những đợt cao điểm công việc kéo dài, ngủ ít liên tục',
    consequence: 'gồng lâu ngày rồi phải nghỉ dài hơn mức cần thiết',
    early: 'ngủ dậy vẫn mệt, hay cáu, hoặc cần cà phê nhiều hơn để làm việc',
  },
  'Thiên Di': {
    good: 'ở môi trường mới, bạn nhanh chóng có chỗ đứng và có người giới thiệu cơ hội',
    trigger: 'chuyển chỗ làm, đi xa, gặp đối tác mới',
    consequence: 'vội vàng tin hoặc vội vàng va chạm khi chưa hiểu luật chơi',
    early: 'bạn đồng ý một việc ở môi trường mới trước khi kịp hỏi rõ luật chơi',
  },
  'Nô Bộc': {
    good: 'bạn có vài cộng sự, khách hàng trung thành và tin được, công việc vẫn chạy khi bạn vắng mặt',
    trigger: 'giao việc lớn, giao tiền, bảo lãnh, hoặc tuyển người gấp',
    consequence: 'tin nhầm hoặc nể nang nên không kiểm tra, rồi phải gánh hậu quả',
    early: 'bạn giao việc hoặc tiền mà ngại hỏi lại tiến độ vì sợ mất lòng',
  },
  'Quan Lộc': {
    good: 'người khác giao cho bạn đúng loại việc bạn giỏi, và thành tích của bạn được nhìn thấy',
    trigger: 'giai đoạn tái cơ cấu, đổi sếp, nhận vai trò mới',
    consequence: 'làm nhiều mà không đúng chỗ, hoặc nghỉ việc lúc nóng giận',
    early: 'bạn bận rộn cả tuần nhưng không chỉ ra được việc nào thật sự quan trọng đã xong',
  },
  'Điền Trạch': {
    good: 'chỗ ở ổn định, giấy tờ nhà đất rõ ràng, tài sản tăng dần theo thời gian',
    trigger: 'mua bán, sửa nhà, chuyển nhà, ký hợp đồng dài hạn',
    consequence: 'vướng giấy tờ hoặc tốn chi phí phát sinh lớn',
    early: 'có giấy tờ nhà đất bạn định làm rõ "khi nào rảnh" đã hơn ba tháng',
  },
  'Phúc Đức': {
    good: 'bạn có những thói quen giúp mình bình tâm, và ngủ ngon sau những ngày khó',
    trigger: 'vừa đạt được một mục tiêu lớn, hoặc có chuyện trong họ hàng, gia đình lớn',
    consequence: 'bồn chồn kéo dài, khó tận hưởng những gì đã có',
    early: 'bạn khó ngủ vì nghĩ đi nghĩ lại một chuyện, hoặc vừa đạt mục tiêu đã thấy trống rỗng',
  },
  'Phụ Mẫu': {
    good: 'quan hệ với cha mẹ, cấp trên rõ ràng và tôn trọng; giấy tờ, thủ tục của bạn gọn gàng',
    trigger: 'bất đồng quan điểm với cha mẹ hoặc cấp trên về một quyết định quan trọng của bạn',
    consequence: 'căng thẳng kéo dài hoặc trễ hạn thủ tục',
    early: 'một thủ tục, giấy tờ bị trễ hạn, hoặc bạn tránh nói chuyện với cha mẹ, cấp trên về một quyết định',
  },
};

/** Chặng 10 năm đi qua cung nào thì đời sống thường xoay quanh điều gì — theo 4 mặt. */
export const STAGE_THEME: Record<string, { theme: string; work: string; money: string; love: string; health: string }> = {
  Mệnh: {
    theme: 'Đây là chặng "định hình bản thân": bạn tìm hiểu mình là ai, muốn gì, và tạo dấu ấn cá nhân.',
    work: 'Công việc gắn chặt với năng lực cá nhân — những gì bạn tự đứng ra làm được ghi nhận rõ nhất.',
    money: 'Tiền đến từ chính sức mình; hợp đầu tư vào kỹ năng hơn là tài sản.',
    love: 'Bạn bận với việc của mình nhiều, nên quan hệ cần được chủ động chăm sóc.',
    health: 'Thói quen tạo dựng trong chặng này theo bạn rất lâu — đáng đầu tư.',
  },
  'Huynh Đệ': {
    theme: 'Chặng này nổi bật vai trò của anh chị em, bạn thân và những người cộng sự ngang hàng.',
    work: 'Hợp làm việc nhóm, hợp tác ngang hàng; người cùng cấp có thể là đòn bẩy hoặc đối thủ.',
    money: 'Tiền bạc dễ dính tới góp vốn, vay mượn với người thân — cần rõ ràng giấy tờ.',
    love: 'Bạn bè và anh em ảnh hưởng nhiều đến chuyện tình cảm, có khi là người giới thiệu.',
    health: 'Nhịp sinh hoạt chịu ảnh hưởng nhiều từ nhóm bạn — chọn nhóm có thói quen tốt.',
  },
  'Phu Thê': {
    theme: 'Chặng này các mối quan hệ đôi — hôn nhân, đối tác — là trung tâm.',
    work: 'Đối tác và người đồng hành ảnh hưởng lớn đến hướng đi công việc.',
    money: 'Tài chính gắn với người bạn đời hoặc đối tác; quyết định chung cần thống nhất.',
    love: 'Là chặng của cam kết: kết hôn, xây tổ ấm, hoặc định nghĩa lại quan hệ.',
    health: 'Không khí trong quan hệ ảnh hưởng trực tiếp đến giấc ngủ và tinh thần.',
  },
  'Tử Tức': {
    theme: 'Chặng này bạn "nuôi dưỡng" nhiều: con cái, học trò, dự án, sản phẩm của mình.',
    work: 'Hợp xây dựng thứ gì đó của riêng mình, đào tạo người kế cận.',
    money: 'Chi cho con cái, học hành, đầu tư dài hạn tăng — nên có kế hoạch riêng.',
    love: 'Gia đình nhỏ và con cái là tâm điểm; vợ chồng cần thời gian riêng cho nhau.',
    health: 'Bận lo cho người khác dễ quên mình — giữ lịch khám định kỳ.',
  },
  'Tài Bạch': {
    theme: 'Chặng này tiền bạc là chủ đề lớn: kiếm, giữ, và học cách quản lý.',
    work: 'Bạn chọn việc theo thu nhập nhiều hơn; hợp kinh doanh, bán hàng, tài chính.',
    money: 'Thu và chi đều lớn hơn trước; kỷ luật tài chính quyết định bạn giữ lại được bao nhiêu.',
    love: 'Chuyện tiền dễ thành chuyện của hai người — minh bạch giúp quan hệ nhẹ hơn.',
    health: 'Áp lực tiền bạc dễ thành áp lực sức khỏe — đừng đánh đổi giấc ngủ lấy thu nhập.',
  },
  'Tật Ách': {
    theme: 'Chặng này nhắc bạn chăm lo nền tảng: sức khỏe, nhịp sống, cách chịu áp lực.',
    work: 'Hợp làm việc bền bỉ, ổn định hơn là bứt tốc liên tục.',
    money: 'Nên dành một phần cho bảo hiểm và quỹ sức khỏe.',
    love: 'Người thân là chỗ dựa quan trọng; chia sẻ khi mệt thay vì gồng một mình.',
    health: 'Là chặng nên đặt sức khỏe lên ưu tiên số một: khám định kỳ, vận động, ngủ đủ.',
  },
  'Thiên Di': {
    theme: 'Chặng này cơ hội đến từ bên ngoài: đi xa, đổi môi trường, mở rộng quan hệ.',
    work: 'Hợp công tác, mở thị trường mới, làm việc với người ở nơi khác.',
    money: 'Tiền đến từ bên ngoài nhưng chi phí đi lại, giao tế cũng tăng.',
    love: 'Dễ gặp người mới; người đã có đôi nên giữ liên lạc đều khi xa nhà.',
    health: 'Đi lại nhiều — giữ nhịp ngủ và ăn uống khi thay đổi môi trường.',
  },
  'Nô Bộc': {
    theme: 'Chặng này mạng lưới quan hệ — đồng nghiệp, khách hàng, cấp dưới, bạn bè — quyết định nhiều điều.',
    work: 'Thành công đến từ việc chọn đúng người và dẫn dắt đội ngũ.',
    money: 'Tiền đến qua quan hệ; rủi ro cũng đến từ quan hệ — kiểm tra kỹ trước khi giao tiền.',
    love: 'Bạn bè chiếm nhiều thời gian; cân bằng với gia đình.',
    health: 'Tiệc tùng, giao tế nhiều — chú ý ăn uống và giấc ngủ.',
  },
  'Quan Lộc': {
    theme: 'Chặng này sự nghiệp là trung tâm: vị trí, trách nhiệm, thành tựu nghề nghiệp.',
    work: 'Thời điểm để lên vị trí, nhận trách nhiệm lớn hoặc khẳng định chuyên môn.',
    money: 'Thu nhập gắn chặt với vị trí công việc; đầu tư vào chuyên môn sinh lời nhất.',
    love: 'Công việc dễ lấn thời gian gia đình — đặt lịch cố định cho người thân.',
    health: 'Áp lực công việc là nguồn mệt chính — học cách ủy quyền.',
  },
  'Điền Trạch': {
    theme: 'Chặng này xoay quanh nhà cửa, tài sản và sự ổn định lâu dài.',
    work: 'Hợp xây nền: ổn định vị trí, làm việc liên quan tài sản, bất động sản, vận hành.',
    money: 'Thời điểm biến thu nhập thành tài sản; giấy tờ, pháp lý là chỗ cần chặt chẽ.',
    love: 'Tổ ấm, chỗ ở chung là chủ đề lớn của hai người.',
    health: 'Không gian sống ảnh hưởng nhiều đến sức khỏe — đầu tư cho chỗ ở thoáng, yên.',
  },
  'Phúc Đức': {
    theme: 'Chặng này hướng vào bên trong: đời sống tinh thần, giá trị sống, gia đình lớn.',
    work: 'Bạn chọn việc theo ý nghĩa nhiều hơn theo danh vọng.',
    money: 'Chi cho sở thích, gia đình lớn, việc thiện tăng — nên có ngân sách riêng.',
    love: 'Tìm sự đồng điệu về giá trị sống hơn là sự sôi nổi.',
    health: 'Tinh thần quyết định thể chất — thiền, vận động nhẹ, nghỉ ngơi có chủ đích.',
  },
  'Phụ Mẫu': {
    theme: 'Chặng này nổi bật quan hệ với cha mẹ, người đi trước, cấp trên và chuyện học hành, giấy tờ.',
    work: 'Hợp học hỏi từ người giỏi hơn, làm trong tổ chức có cấu trúc.',
    money: 'Có thể được hỗ trợ từ gia đình, hoặc phải lo cho cha mẹ nhiều hơn.',
    love: 'Ý kiến của gia đình có trọng lượng trong chuyện tình cảm.',
    health: 'Để ý sức khỏe của cha mẹ cũng như của chính mình.',
  },
};
