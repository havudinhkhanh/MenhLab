/**
 * Nội dung "kể chuyện": diễn giải sao bằng lời đời thường, có ví dụ, có lý do.
 * Mục tiêu: người chưa từng đọc Tử Vi đọc xong hiểu "điều này nói gì về mình"
 * thay vì chỉ thấy tên sao được nhắc lại.
 *
 * Nguyên tắc viết: nói như một người bạn hiểu chuyện; mỗi ý có "vì sao" và
 * "trong đời thường trông thế nào"; luôn có mặt mạnh lẫn mặt cần để ý;
 * không phán số phận, không đoán bệnh, tai nạn, chuyện sống chết.
 */

export interface StarStory {
  /** Vai trò, dùng trong câu: "Vũ Khúc — {role}". */
  role: string;
  /** Hình ảnh dễ nhớ. */
  image: string;
  /** Bản chất của sao, 2–3 câu. */
  essence: string;
  /** Biểu hiện đời thường khi sao ở cung Mệnh (ngôi thứ hai). */
  daily: string[];
  /** Người khác thường thấy bạn thế nào. */
  seen: string;
  /** Khi sao "sáng" (Miếu, Vượng). */
  bright: string;
  /** Khi sao "tối" (Hãm). */
  dim: string;
  work: string;
  money: string;
  love: string;
}

export const STAR_STORY: Record<string, StarStory> = {
  'Tử Vi': {
    role: 'ngôi sao của người đứng đầu',
    image: 'như người trưởng nhóm tự nhiên trong một tập thể',
    essence:
      'Tử Vi được ví như "ông vua" của lá số: tượng trưng cho nhu cầu được làm chủ, được tôn trọng và khả năng gom mọi người về một mối. Người có sao này thường có lòng tự trọng cao và một phong thái điềm tĩnh, đĩnh đạc.',
    daily: [
      'Vào một nhóm mới, bạn thường quan sát trước, rồi dần dần trở thành người được hỏi ý kiến.',
      'Bạn khó chịu khi bị ra lệnh thiếu tôn trọng, nhưng sẵn sàng gánh trách nhiệm khi được tin tưởng.',
      'Bạn để ý đến thể diện — của mình và của người thân — hơn mức bạn thừa nhận.',
    ],
    seen: 'Người ngoài thường thấy bạn đáng tin, có chính kiến, đôi khi hơi khó gần lúc đầu.',
    bright: 'Sao đang sáng nên khả năng tổ chức và uy tín của bạn dễ được người khác công nhận, nhất là khi có người giỏi đứng cạnh.',
    dim: 'Sao không ở thế mạnh nên nhu cầu được tôn trọng dễ biến thành tự ái; bạn cần chứng minh bằng việc làm hơn là vị trí.',
    work:
      'Trong công việc, bạn hợp vai trò cầm trịch: quản lý, điều phối, ra quyết định cuối cùng. Bạn làm tốt nhất ở nơi có cấu trúc rõ ràng, nơi vai trò và quyền hạn được phân định. Điểm cần để ý là bạn dễ ôm vai "người gánh" mà quên xây đội ngũ — sách cổ nói "vua cần bá quan", tức là thành tựu của bạn phụ thuộc nhiều vào việc bạn có quy tụ được người giỏi hay không.',
    money:
      'Về tiền, bạn kiếm tiền tốt nhất nhờ vị thế và uy tín: chức vụ, thương hiệu cá nhân, sự tin cậy của người khác. Bạn có xu hướng chi cho chất lượng sống và hình ảnh — đồ tốt, chỗ ở đàng hoàng, quà cáp chu đáo. Không có gì sai, chỉ cần một giới hạn rõ để phần chi cho "thể diện" không lấn sang phần tích lũy.',
    love:
      'Trong tình cảm, bạn muốn một người bạn đời mà mình tự hào và được người khác nể trọng. Bạn chu đáo, có trách nhiệm, nhưng đôi khi đưa ra quyết định thay cho cả hai. Điểm dễ va chạm là câu hỏi ngầm "ai làm chủ trong nhà" — hỏi ý kiến nửa kia nhiều hơn sẽ giúp quan hệ nhẹ nhàng hơn.',
  },
  'Thiên Cơ': {
    role: 'ngôi sao của trí óc và kế hoạch',
    image: 'như người cố vấn luôn có sẵn phương án B',
    essence:
      'Thiên Cơ tượng trưng cho bộ óc: suy tính, phân tích, nhìn ra cách làm khôn khéo hơn. Đây là sao của sự linh hoạt — giỏi xoay chuyển, nhưng cũng dễ thay đổi.',
    daily: [
      'Trước một quyết định, bạn thường nghĩ ra nhiều kịch bản và cân nhắc rất kỹ — đôi khi kỹ quá mức cần thiết.',
      'Bạn học cái mới nhanh và chán nhanh nếu việc lặp đi lặp lại.',
      'Đầu óc bạn ít khi "tắt": nằm xuống rồi vẫn nghĩ tiếp chuyện ban ngày.',
    ],
    seen: 'Người khác hay tìm bạn để xin lời khuyên vì bạn nhìn vấn đề nhiều chiều.',
    bright: 'Sao đang sáng nên trí óc nhanh nhạy là lợi thế thật sự của bạn — bạn thường đi trước người khác một bước trong tính toán.',
    dim: 'Sao không ở thế mạnh nên dễ rơi vào lo xa, nghĩ nhiều mà làm ít; đặt hạn chót cho việc suy nghĩ sẽ giúp bạn rất nhiều.',
    work:
      'Trong công việc, bạn hợp những việc dùng đầu óc: hoạch định, phân tích, kỹ thuật, tư vấn, cải tiến quy trình. Bạn làm tốt vai trò "quân sư" — người nghĩ ra cách — hơn là người phải đứng mũi chịu sào hằng ngày. Điểm cần để ý là bạn dễ đổi việc khi thấy nhàm; trước mỗi lần chuyển, hãy chắc rằng mình đang tiến lên chứ không chỉ đang tìm cái mới.',
    money:
      'Về tiền, bạn kiếm tiền bằng chuyên môn và sự tính toán; thu nhập có thể lên xuống theo mỗi lần bạn chuyển hướng. Bạn hay có nhiều ý tưởng kiếm thêm, nhưng ý tưởng chỉ ra tiền khi được làm đến nơi. Cách hợp với bạn: chọn một hai hướng, đặt mốc kiểm tra, đừng rải sức quá nhiều nơi.',
    love:
      'Trong tình cảm, bạn cần một người nói chuyện được với mình — sự đồng điệu về suy nghĩ quan trọng không kém cảm xúc. Bạn chu đáo theo kiểu lo trước mọi thứ cho đối phương. Điểm dễ va chạm là bạn hay "nghĩ thay" người kia và phân tích cảm xúc như phân tích vấn đề; đôi khi chỉ cần lắng nghe là đủ.',
  },
  'Thái Dương': {
    role: 'ngôi sao của sự cho đi và danh tiếng',
    image: 'như mặt trời: tỏa sáng và sưởi ấm người khác',
    essence:
      'Thái Dương là Mặt Trời: năng lượng hướng ra ngoài, thích làm điều có ý nghĩa và được người khác nhìn thấy. Sao này mạnh nhất ở các cung "ban ngày" và yếu dần về "ban đêm" — giống như mặt trời lúc trưa và lúc tối.',
    daily: [
      'Bạn sẵn lòng giúp người, nhiều khi giúp trước rồi mới nghĩ tới mình.',
      'Bạn thấy có động lực nhất khi việc mình làm được ghi nhận và có ích cho người khác.',
      'Bạn khó giữ im lặng trước điều mình cho là không công bằng.',
    ],
    seen: 'Người ngoài thấy bạn nhiệt tình, cởi mở và đáng tin cậy.',
    bright: 'Sao đang sáng nên sự nhiệt tình của bạn thường được đền đáp bằng uy tín và cơ hội — công sức bỏ ra được người khác nhìn thấy.',
    dim: 'Sao đang ở cung "ban đêm" nên bạn vẫn cho đi nhiều nhưng ít được thấy công; hãy học cách nói ra đóng góp của mình và biết từ chối.',
    work:
      'Trong công việc, bạn hợp những vai trò "ra mặt": giảng dạy, truyền thông, phục vụ cộng đồng, quản lý con người, công việc có tính trách nhiệm xã hội. Bạn làm tốt khi được giao sứ mệnh rõ ràng. Điểm cần để ý là bạn hay ôm việc của người khác — giỏi nhưng dễ kiệt sức.',
    money:
      'Về tiền, bạn kiếm tiền nhờ danh tiếng và sự tín nhiệm; người ta tìm đến bạn vì tin bạn. Bạn rộng rãi, hay chi cho người thân, bạn bè, việc chung. Nên tách hẳn một khoản để dành trước khi chi, vì bản tính hào phóng sẽ luôn tìm ra lý do để tiêu.',
    love:
      'Trong tình cảm, bạn cho đi nhiều, chăm lo cho người mình thương như một trách nhiệm. Bạn cần một người biết ghi nhận và đáp lại sự quan tâm đó. Điểm dễ va chạm là bạn bận rộn với "việc lớn" mà quên những điều nhỏ trong nhà.',
  },
  'Vũ Khúc': {
    role: 'ngôi sao của tiền bạc và sự quyết đoán',
    image: 'như người thủ quỹ kiêm chỉ huy: thực tế, chắc tay',
    essence:
      'Vũ Khúc là "tài tinh" — ngôi sao tiền bạc chính của Tử Vi — đồng thời mang tính chất của người lính: kỷ luật, cương quyết, làm tới cùng. Sao này nhìn mọi việc qua con số và kết quả.',
    daily: [
      'Bạn thích những việc có kết quả đo được; nói hay mà không làm được khiến bạn khó chịu.',
      'Đã quyết là làm, ít khi chần chừ; nhưng cũng ít khi giải thích nhiều cho người khác hiểu.',
      'Khi mua bán, bạn để ý giá trị thật của món đồ hơn là lời quảng cáo.',
    ],
    seen: 'Người ngoài thấy bạn cứng cỏi, đáng tin trong việc, đôi khi hơi khô khan.',
    bright: 'Sao đang sáng nên sự quyết đoán và nhạy bén với tiền của bạn là thế mạnh thật — bạn dễ được giao việc liên quan đến tiền, tài sản, kết quả kinh doanh.',
    dim: 'Sao không ở thế mạnh nên sự cương quyết dễ thành cứng nhắc; tiền bạc có lúc vất vả, cần kỷ luật chi tiêu nhiều hơn người khác.',
    work:
      'Trong công việc, bạn hợp tài chính, kinh doanh, kỹ thuật, sản xuất, những nơi cần quyết đoán và chịu trách nhiệm về con số. Bạn là kiểu người được giao chỉ tiêu thì sẽ tìm cách đạt. Điểm cần để ý là cách nói thẳng của bạn có thể làm người khác tự ái; một chút mềm mỏng giúp việc trôi hơn nhiều.',
    money:
      'Về tiền, đây là sao "hợp tiền" nhất: bạn nhạy với cơ hội kiếm tiền, biết tính lời lỗ, và thường kiếm tiền bằng chính sức lao động, sự quyết đoán của mình. Mặt trái là bạn dễ dồn hết vào công việc, coi tiền là thước đo — hãy nhớ đặt mục tiêu tài chính cụ thể để biết khi nào là "đủ".',
    love:
      'Trong tình cảm, bạn thể hiện yêu thương bằng hành động — lo cái ăn cái mặc, giải quyết việc — hơn là lời nói. Người bạn đời có thể thấy bạn ít lãng mạn, ít chia sẻ. Một lời hỏi han, một buổi đi chơi không bàn chuyện tiền sẽ có giá trị hơn bạn nghĩ.',
  },
  'Thiên Đồng': {
    role: 'ngôi sao của sự an vui',
    image: 'như người bạn hiền lành, ở cạnh thấy dễ chịu',
    essence:
      'Thiên Đồng là "phúc tinh": tượng trưng cho sự hòa nhã, biết hưởng thụ, thích cuộc sống êm đềm. Người có sao này thường dễ chịu, ít va chạm và có khả năng làm người khác thấy thoải mái.',
    daily: [
      'Bạn tránh xung đột; gặp chuyện căng thì thường chọn cách nhẹ nhàng.',
      'Bạn biết tận hưởng những niềm vui nhỏ: bữa ăn ngon, buổi cà phê, một ngày không phải vội.',
      'Bạn dễ trì hoãn việc khó cho tới khi bị dồn vào thế phải làm.',
    ],
    seen: 'Người ngoài thấy bạn dễ mến, dễ hợp tác, không có tính toán.',
    bright: 'Sao đang sáng nên tính hiền hòa trở thành lợi thế: bạn được nhiều người quý và giúp, cuộc sống ít sóng gió lớn.',
    dim: 'Sao không ở thế mạnh nên dễ thiếu động lực, ngại thay đổi; cần một mục tiêu đủ rõ để kéo mình ra khỏi vùng an toàn.',
    work:
      'Trong công việc, bạn hợp môi trường hài hòa: dịch vụ, chăm sóc khách hàng, giáo dục, nghệ thuật, công việc ổn định có nhịp đều. Bạn là chất keo của tập thể. Điểm cần để ý là bạn có thể ở lại quá lâu ở một vị trí dễ chịu; hãy tự đặt mục tiêu phát triển cho mình thay vì đợi người khác giao.',
    money:
      'Về tiền, bạn thường không quá thiếu nhưng cũng ít khi dồn sức làm giàu nhanh; tiền đến đều đặn từ công việc ổn định. Bạn dễ chi cho sự thoải mái. Một khoản tiết kiệm tự động mỗi tháng là cách hợp nhất với tính cách của bạn — không cần nghĩ nhiều mà vẫn tích lũy được.',
    love:
      'Trong tình cảm, bạn nhẹ nhàng, chiều chuộng, muốn một mái nhà êm ấm. Bạn ngại nói ra điều không vừa ý. Điểm dễ va chạm là những chuyện nhỏ bị nhịn lâu ngày thành chuyện lớn — nói sớm, nói nhẹ vẫn tốt hơn im lặng.',
  },
  'Liêm Trinh': {
    role: 'ngôi sao của nguyên tắc và đam mê',
    image: 'như người giữ luật nhưng trong lòng có lửa',
    essence:
      'Liêm Trinh mang hai mặt: một mặt là nguyên tắc, kỷ cương, tự trọng; mặt kia là cảm xúc mạnh và đam mê. Khi hai mặt hòa hợp, đây là người làm việc nghiêm túc và sống có lý tưởng.',
    daily: [
      'Bạn có những nguyên tắc riêng mà ít khi chịu nhân nhượng.',
      'Khi đã thích một việc, một người, bạn dồn hết tâm sức vào đó.',
      'Bạn để ý sự công bằng, và khó quên khi bị đối xử bất công.',
    ],
    seen: 'Người ngoài thấy bạn nghiêm túc, có lập trường, đôi khi khó đoán cảm xúc.',
    bright: 'Sao đang sáng nên tính nguyên tắc của bạn được người khác tôn trọng; bạn hợp các vị trí cần sự liêm chính.',
    dim: 'Sao không ở thế mạnh nên cảm xúc dễ lấn át lý trí; nên tránh quyết định lớn khi đang bực bội hay quá hưng phấn.',
    work:
      'Trong công việc, bạn hợp những nơi có quy chuẩn: quản lý hệ thống, pháp lý, kiểm soát, hành chính, kỹ thuật chính xác; hoặc ngược lại là những nghề cần đam mê sâu. Bạn làm việc nghiêm túc và đòi hỏi người khác cũng vậy. Điểm cần để ý là sự cứng rắn với người làm cùng — đặt chuẩn cao là tốt, nhưng nên kèm lời động viên.',
    money:
      'Về tiền, bạn kiếm tiền qua công việc có hệ thống, có quy trình; tiền bạc khá minh bạch. Mặt trái là bạn có thể chi mạnh tay cho đam mê. Hãy cho đam mê một "ngân sách riêng" để vừa được sống với nó vừa không ảnh hưởng phần còn lại.',
    love:
      'Trong tình cảm, bạn yêu sâu và nghiêm túc, nhưng cũng có cái tôi lớn. Bạn cần sự chung thủy và tôn trọng tuyệt đối. Điểm dễ va chạm là khi cảm xúc mạnh, bạn có thể nói những điều khó rút lại — hãy cho mình vài phút trước khi phản ứng.',
  },
  'Thiên Phủ': {
    role: 'ngôi sao của sự tích lũy và ổn định',
    image: 'như cái kho: chậm mà chắc, giữ được của',
    essence:
      'Thiên Phủ là "kho trời": tượng trưng cho sự tích lũy, quản lý tài nguyên và nhu cầu an toàn. Người có sao này thường chín chắn, cẩn trọng, thích mọi thứ ngăn nắp và có dự phòng.',
    daily: [
      'Bạn thích có "của để dành" — tiền, đồ dùng, kế hoạch dự phòng.',
      'Bạn ít mạo hiểm; trước khi làm thường hỏi "nếu không được thì sao".',
      'Bạn chăm lo chu đáo cho người trong nhà và giữ gìn đồ đạc kỹ.',
    ],
    seen: 'Người ngoài thấy bạn đáng tin, điềm đạm, có trước có sau.',
    bright: 'Sao đang sáng nên khả năng giữ của và quản lý của bạn rất tốt — tài sản thường tăng dần theo thời gian.',
    dim: 'Sao không ở thế mạnh nên dễ quá thận trọng, bỏ lỡ cơ hội vì sợ rủi ro; một phần nhỏ dành cho thử nghiệm sẽ có ích.',
    work:
      'Trong công việc, bạn hợp vai trò quản lý tài nguyên: tài chính, kế toán, hành chính, quản lý vận hành, ngân hàng, bất cứ nơi nào cần "giữ cho hệ thống chạy ổn". Bạn là người cấp trên yên tâm giao việc. Điểm cần để ý là bạn có thể chậm thích nghi khi môi trường thay đổi nhanh.',
    money:
      'Về tiền, đây là sao giữ tiền giỏi nhất: bạn biết tiết kiệm, biết lo xa, tài sản tích lũy theo kiểu "góp gió thành bão". Bạn hợp đầu tư dài hạn, an toàn hơn là lướt sóng. Điều duy nhất cần nhắc: đừng để nỗi lo thiếu khiến bạn không dám tiêu cho những thứ thật sự đáng.',
    love:
      'Trong tình cảm, bạn chung thủy, lo toan, muốn xây một tổ ấm vững chắc. Bạn thể hiện yêu thương qua sự chăm sóc vật chất và tinh thần đều đặn. Điểm dễ va chạm là sự kiểm soát — muốn mọi thứ theo kế hoạch của mình.',
  },
  'Thái Âm': {
    role: 'ngôi sao của sự tinh tế và tích lũy',
    image: 'như mặt trăng: dịu, sâu và bền',
    essence:
      'Thái Âm là Mặt Trăng: tượng trưng cho đời sống nội tâm, sự nhạy cảm, tinh tế và khả năng tích lũy âm thầm. Sao này sáng nhất ở các cung "ban đêm" — giống như trăng chỉ đẹp khi trời tối.',
    daily: [
      'Bạn để ý những chi tiết nhỏ mà người khác bỏ qua: một ánh mắt, một thay đổi trong giọng nói.',
      'Bạn cần thời gian ở một mình để "nạp lại năng lượng".',
      'Bạn chuẩn bị kỹ trước khi làm và thích làm âm thầm hơn là phô ra.',
    ],
    seen: 'Người ngoài thấy bạn nhẹ nhàng, chu đáo, có gu thẩm mỹ.',
    bright: 'Sao đang sáng nên sự tinh tế và khả năng tích lũy của bạn rất rõ — tiền và tài sản thường tăng đều, âm thầm.',
    dim: 'Sao không ở thế mạnh nên dễ suy nghĩ nhiều, cả nghĩ, cảm xúc lên xuống; một thói quen chăm sóc tinh thần đều đặn rất quan trọng với bạn.',
    work:
      'Trong công việc, bạn hợp những việc cần sự tỉ mỉ và cảm nhận: tài chính, kế hoạch, thiết kế, nội dung, chăm sóc, nghiên cứu, bất động sản. Bạn làm tốt ở hậu trường, nơi chất lượng quan trọng hơn sự ồn ào. Điểm cần để ý là bạn ngại tự giới thiệu mình — người khác không biết bạn giỏi nếu bạn không cho họ thấy.',
    money:
      'Về tiền, bạn giỏi tích lũy theo kiểu đều đặn, lâu dài; sách cổ gắn sao này với nhà đất và tài sản tích trữ. Bạn hợp tiết kiệm, đầu tư dài hạn, tài sản hữu hình. Hãy để ý chi tiêu theo cảm xúc — mua sắm khi buồn là "lỗ hổng" thường gặp.',
    love:
      'Trong tình cảm, bạn dịu dàng, sâu sắc, nhớ những điều nhỏ của người mình thương. Bạn cần cảm giác an toàn và được thấu hiểu. Điểm dễ va chạm là bạn hay giữ cảm xúc trong lòng, mong đối phương tự hiểu — nói ra điều mình cần sẽ đỡ hiểu lầm.',
  },
  'Tham Lang': {
    role: 'ngôi sao của ham muốn và sức hút',
    image: 'như người nghệ sĩ kiêm nhà buôn: giao thiệp giỏi, muốn trải nghiệm nhiều',
    essence:
      'Tham Lang tượng trưng cho mong muốn — muốn có, muốn trải nghiệm, muốn được yêu thích — cùng tài giao tế và sức hút với người khác. Đây là sao của sự đa tài, đa năng, nhưng cũng dễ đa đoan.',
    daily: [
      'Bạn có nhiều sở thích, dễ hứng thú với cái mới: món ăn, chuyến đi, khóa học, mối quan hệ.',
      'Bạn giao tiếp tự nhiên, dễ kết thân, biết cách làm người khác vui.',
      'Bạn có thể bắt đầu nhiều việc cùng lúc và đôi khi khó dừng một thú vui.',
    ],
    seen: 'Người ngoài thấy bạn duyên dáng, vui vẻ, có sức hút.',
    bright: 'Sao đang sáng nên tài giao tế và sự đa năng của bạn mang lại cơ hội thật — quan hệ rộng mở ra việc làm, khách hàng, nguồn thu.',
    dim: 'Sao không ở thế mạnh nên ham muốn dễ thành tiêu xài, hưởng thụ quá đà; biết đủ là kỹ năng bạn cần rèn nhất.',
    work:
      'Trong công việc, bạn hợp kinh doanh, bán hàng, quan hệ khách hàng, giải trí, ẩm thực, làm đẹp, nghệ thuật — những nơi con người và trải nghiệm là trung tâm. Bạn giỏi mở cửa, kết nối. Điểm cần để ý là sự tập trung: chọn ít việc hơn và làm tới nơi sẽ đem lại nhiều hơn rải sức.',
    money:
      'Về tiền, bạn kiếm tiền qua quan hệ và tài xoay xở; cơ hội đến nhiều. Nhưng tiền cũng đi nhanh vào ăn uống, mua sắm, vui chơi, giao tế. Quy tắc đơn giản hợp với bạn: tiền vào là trích ngay một phần sang tài khoản khó rút.',
    love:
      'Trong tình cảm, bạn lãng mạn, có sức hút, biết làm đối phương vui. Bạn cần sự mới mẻ để không thấy nhàm. Điểm dễ va chạm là sự ổn định — hãy chủ động làm mới quan hệ cùng người mình thương thay vì tìm cái mới ở nơi khác.',
  },
  'Cự Môn': {
    role: 'ngôi sao của lời nói và sự hoài nghi',
    image: 'như luật sư hoặc nhà phê bình: hỏi tới cùng',
    essence:
      'Cự Môn tượng trưng cho ngôn ngữ — lời nói, tranh luận, phân tích — và sự hoài nghi cần thiết để tìm ra sự thật. Sao này cho khả năng ăn nói sắc bén, nhưng cũng dễ sinh thị phi.',
    daily: [
      'Bạn không dễ tin; nghe điều gì cũng muốn biết bằng chứng.',
      'Trong tranh luận, bạn thường tìm ra điểm yếu của lập luận đối phương rất nhanh.',
      'Đôi khi bạn nói thẳng quá và sau đó mới nhận ra người nghe phật lòng.',
    ],
    seen: 'Người ngoài thấy bạn sắc sảo, có lý lẽ, đôi khi khó tính.',
    bright: 'Sao đang sáng nên lời nói của bạn có trọng lượng — bạn thuyết phục được người khác và có thể sống bằng nghề dùng lời.',
    dim: 'Sao không ở thế mạnh nên dễ gặp hiểu lầm, thị phi vì lời nói; nói ít hơn, viết rõ hơn là cách bảo vệ mình.',
    work:
      'Trong công việc, bạn hợp nghề dùng lời và phân tích: luật, giảng dạy, tư vấn, bán hàng, truyền thông, nghiên cứu, kiểm soát chất lượng. Bạn giỏi phát hiện vấn đề. Điểm cần để ý là khi chỉ ra lỗi, hãy kèm theo cách sửa — người ta sẽ nghe bạn hơn.',
    money:
      'Về tiền, bạn kiếm tiền bằng lời nói, kiến thức, khả năng thuyết phục. Tiền bạc dễ dính tới hợp đồng, thỏa thuận — vì vậy giấy trắng mực đen là bạn đồng hành tốt nhất của bạn. Tránh những thỏa thuận "miệng" dù với người quen.',
    love:
      'Trong tình cảm, bạn cần một người nói chuyện được và chịu được sự thẳng thắn của mình. Bạn quan tâm thật lòng nhưng hay thể hiện bằng góp ý. Điểm dễ va chạm là những cuộc cãi vã vì lời nói — đôi khi thắng tranh luận lại thua trong quan hệ.',
  },
  'Thiên Tướng': {
    role: 'ngôi sao của sự chỉn chu và công bằng',
    image: 'như con dấu: đóng vào đâu là đúng quy cách ở đó',
    essence:
      'Thiên Tướng là "ấn tinh" — ngôi sao con dấu: tượng trưng cho sự chỉn chu, công bằng, giữ lời và tinh thần giúp đỡ. Người có sao này thường đáng tin, thích làm đúng và làm đẹp.',
    daily: [
      'Bạn để ý hình thức: ăn mặc gọn gàng, đồ đạc ngăn nắp, giấy tờ rõ ràng.',
      'Thấy bất công, bạn hay đứng ra bênh vực người yếu thế.',
      'Bạn giữ lời hứa và khó chịu với người hứa suông.',
    ],
    seen: 'Người ngoài thấy bạn đứng đắn, lịch sự, có trách nhiệm.',
    bright: 'Sao đang sáng nên bạn dễ được trao vị trí cần sự tin cậy — người giữ quy trình, người phân xử.',
    dim: 'Sao không ở thế mạnh nên dễ ôm việc của người khác, bị cuốn vào chuyện không phải của mình; biết giới hạn sẽ giúp bạn nhẹ hơn.',
    work:
      'Trong công việc, bạn hợp vai trò quản lý có nguyên tắc: hành chính, nhân sự, pháp chế, dịch vụ cao cấp, công việc phục vụ người khác một cách chuyên nghiệp. Bạn là người làm việc đúng chuẩn. Điểm cần để ý là sự cầu toàn về hình thức có thể làm chậm tiến độ.',
    money:
      'Về tiền, bạn kiếm tiền ổn định qua chuyên môn và sự tín nhiệm; chi tiêu khá chừng mực, nhưng dễ chi cho hình ảnh và giúp người. Một ngân sách rõ ràng cho việc giúp đỡ người thân sẽ giúp bạn vừa tốt bụng vừa không bị thiếu.',
    love:
      'Trong tình cảm, bạn chu đáo, tôn trọng, coi trọng sự công bằng giữa hai người. Bạn cần một người biết giữ lời và lịch sự. Điểm dễ va chạm là bạn lo cho người ngoài nhiều đến mức người nhà thấy bị bỏ quên.',
  },
  'Thiên Lương': {
    role: 'ngôi sao của sự che chở',
    image: 'như người anh cả hoặc người thầy: hay khuyên, hay bảo vệ',
    essence:
      'Thiên Lương là "ấm tinh": tượng trưng cho sự che chở, lòng tốt, sự từng trải và chín chắn. Người có sao này thường có dáng dấp của người lớn — hay khuyên bảo, hay đứng ra lo cho người khác.',
    daily: [
      'Bạn hay được người khác tìm đến để kể chuyện, xin lời khuyên.',
      'Bạn có xu hướng "dạy" — giải thích, hướng dẫn — kể cả khi không ai nhờ.',
      'Bạn thường gặp chuyện khó rồi qua khỏi, và mỗi lần như thế lại chín chắn hơn.',
    ],
    seen: 'Người ngoài thấy bạn đáng tin, hiểu chuyện, có phần già dặn.',
    bright: 'Sao đang sáng nên bạn dễ có uy tín, được kính trọng, và có "phúc" kiểu gặp khó thường có lối ra.',
    dim: 'Sao không ở thế mạnh nên sự tốt bụng dễ thành ôm đồm, hoặc thành bảo thủ; nghe người trẻ hơn mình cũng là một cách học.',
    work:
      'Trong công việc, bạn hợp giáo dục, y tế, tư vấn, bảo hiểm, công tác xã hội, quản lý con người, những việc có tính bảo vệ và hướng dẫn. Bạn làm tốt vai trò người hướng dẫn, người cố vấn. Điểm cần để ý là bạn dễ bao bọc cấp dưới quá mức, khiến họ chậm lớn.',
    money:
      'Về tiền, bạn không quá đặt nặng tiền bạc; tiền đến từ chuyên môn và uy tín. Bạn dễ chi để giúp người. Nên dành tiền cho bảo hiểm và quỹ dự phòng — đúng tinh thần "che chở" nhưng cho chính mình.',
    love:
      'Trong tình cảm, bạn chăm sóc, bao dung, có chút "người lớn" trong quan hệ. Bạn cần được tôn trọng ý kiến. Điểm dễ va chạm là thói quen dạy bảo — với người bạn đời, đôi khi đồng hành tốt hơn dẫn dắt.',
  },
  'Thất Sát': {
    role: 'ngôi sao của dũng khí và hành động',
    image: 'như vị tướng: xông pha, quyết liệt, không ngại khó',
    essence:
      'Thất Sát là "tướng tinh": tượng trưng cho dũng khí, sự quyết liệt, khả năng đối đầu với khó khăn và tạo ra bước ngoặt. Đời người có sao này thường có những khúc rẽ lớn do chính mình chọn.',
    daily: [
      'Bạn thích thử thách; việc càng khó càng muốn làm cho bằng được.',
      'Bạn ra quyết định nhanh, đôi khi nhanh hơn mức người khác theo kịp.',
      'Bạn chịu được áp lực lớn, nhưng không chịu được bị gò bó.',
    ],
    seen: 'Người ngoài thấy bạn mạnh mẽ, độc lập, có khí chất.',
    bright: 'Sao đang sáng nên dũng khí của bạn mang lại thành tựu — bạn hợp đi tiên phong, mở đường, xử lý khủng hoảng.',
    dim: 'Sao không ở thế mạnh nên sự quyết liệt dễ thành nóng vội, va chạm; kế hoạch dự phòng là thứ bạn nên có trước mỗi lần "xông pha".',
    work:
      'Trong công việc, bạn hợp những nơi cần người dám làm: khởi nghiệp, kinh doanh cạnh tranh, kỹ thuật cường độ cao, quân đội, công an, xử lý dự án khó, vai trò "chữa cháy". Bạn tỏa sáng khi có mục tiêu lớn. Điểm cần để ý là sự kiên nhẫn với quy trình và với người chậm hơn mình.',
    money:
      'Về tiền, bạn kiếm tiền theo kiểu có lúc lên mạnh, có lúc xuống mạnh — thu nhập gắn với những quyết định lớn. Bạn dám đầu tư. Cách giữ tiền hợp với bạn: chia rõ phần "chiến đấu" (được phép mạo hiểm) và phần "hậu phương" (không bao giờ đụng tới).',
    love:
      'Trong tình cảm, bạn mạnh mẽ, bảo vệ người mình thương, nhưng cần không gian riêng. Bạn hợp người độc lập, không bám víu. Điểm dễ va chạm là cách nói thẳng và quyết định một mình — hỏi ý kiến trước khi làm sẽ giúp nửa kia thấy được tôn trọng.',
  },
  'Phá Quân': {
    role: 'ngôi sao của đổi mới',
    image: 'như người mở đường: phá cái cũ để dựng cái mới',
    essence:
      'Phá Quân là "hao tinh" — tên nghe đáng sợ nhưng ý nghĩa là sự đổi mới: phá bỏ cái cũ, thử cái chưa ai làm. Người có sao này không chịu được sự trì trệ và thường thay đổi môi trường sống, làm việc nhiều lần.',
    daily: [
      'Bạn chán nhanh với sự lặp lại và hay muốn "làm lại từ đầu" khi thấy cách cũ không ổn.',
      'Bạn dám nghĩ khác, dám nói khác, đôi khi đi ngược số đông.',
      'Bạn có thể bỏ ngang một việc khi mất hứng thú, kể cả khi đã đầu tư nhiều.',
    ],
    seen: 'Người ngoài thấy bạn táo bạo, cá tính, có phần khó đoán.',
    bright: 'Sao đang sáng nên khả năng đổi mới của bạn tạo ra kết quả — những lần làm lại thường đưa bạn lên một nấc mới.',
    dim: 'Sao không ở thế mạnh nên thay đổi dễ thành hao phí: làm lại nhiều lần mà không tích lũy được; trước mỗi lần "đập đi", hãy giữ lại phần đang chạy tốt.',
    work:
      'Trong công việc, bạn hợp vai trò cải tổ, khởi nghiệp, sáng tạo, công nghệ, xây dựng, xử lý tình huống — nơi được phép thay đổi. Bạn là người dám làm điều mới. Điểm cần để ý là sự bền bỉ: những thành quả lớn cần thời gian, đừng bỏ cuộc ngay trước khi nó ra quả.',
    money:
      'Về tiền, bạn dám chi, dám đầu tư cho cái mới; tiền vào ra mạnh. Đây là sao dễ "hao" nếu không có kỷ luật. Cách hợp với bạn: tách hẳn tiền thử nghiệm khỏi tiền an toàn, và chỉ dùng phần thử nghiệm cho các ý tưởng mới.',
    love:
      'Trong tình cảm, bạn mãnh liệt, thẳng thắn, cần sự mới mẻ và tự do. Quan hệ của bạn thường có những giai đoạn thay đổi lớn. Điểm dễ va chạm là quyết định vội lúc cảm xúc lên cao — cho mình thời gian trước khi nói những lời "chốt hạ".',
  },
};

/** Phụ tinh, nói rõ "sao này là gì" và "nó thêm gì cho bạn" ở cung đang xét. */
export const MINOR_STORY: Record<string, { role: string; adds: string; good: boolean }> = {
  'Tả Phù': { role: 'sao của người trợ thủ', adds: 'có người sẵn lòng đỡ việc, chung tay — chuyện này ít khi bạn phải gánh một mình', good: true },
  'Hữu Bật': { role: 'sao của người hỗ trợ', adds: 'có bạn bè, người ngang hàng hỗ trợ; làm cùng người khác thường suôn hơn làm một mình', good: true },
  'Văn Xương': { role: 'sao của học vấn và giấy tờ', adds: 'thuận về học hành, bằng cấp, văn bản — làm hồ sơ, thi cử, viết lách thường trôi chảy', good: true },
  'Văn Khúc': { role: 'sao của tài ăn nói và năng khiếu', adds: 'thêm sự khéo léo trong lời nói, năng khiếu nghệ thuật hoặc giao tiếp — dễ được cảm tình', good: true },
  'Thiên Khôi': { role: 'sao quý nhân công khai', adds: 'dễ có người có vị thế nâng đỡ — cấp trên, người lớn tuổi, người có tiếng nói giới thiệu cơ hội', good: true },
  'Thiên Việt': { role: 'sao quý nhân ngầm', adds: 'hay có sự giúp đỡ âm thầm — cơ hội đến qua giới thiệu gián tiếp, qua người quen của người quen', good: true },
  'Lộc Tồn': { role: 'sao của sự tích lũy', adds: 'thêm sự ổn định, giữ được những gì đã có — chậm mà chắc; mặt trái là dễ có người tranh phần, nên rõ ràng giấy tờ', good: true },
  'Thiên Mã': { role: 'sao của sự di chuyển', adds: 'lĩnh vực này gắn với đi lại, thay đổi, năng động — đứng yên một chỗ không hợp', good: true },
  'Kình Dương': { role: 'sao của sự cạnh tranh trực diện', adds: 'ở đây dễ có cạnh tranh, va chạm thẳng; mặt tốt là cho bạn dũng khí, mặt cần để ý là sự nóng nảy', good: false },
  'Đà La': { role: 'sao của sự dây dưa', adds: 'việc ở đây dễ kéo dài, chậm hơn dự tính, vướng thủ tục; mặt tốt là sự bền bỉ, lì đòn', good: false },
  'Hỏa Tinh': { role: 'sao của sự bùng nổ', adds: 'mọi thứ ở đây dễ đến nhanh và đi nhanh; cảm xúc dễ bốc, cần dừng một nhịp trước khi phản ứng', good: false },
  'Linh Tinh': { role: 'sao của căng thẳng âm ỉ', adds: 'áp lực ở đây dễ tích tụ trong im lặng rồi bộc phát; nên giải tỏa đều đặn thay vì dồn nén', good: false },
  'Địa Không': { role: 'sao của sự hụt hẫng và ý tưởng khác thường', adds: 'kế hoạch ở đây dễ hụt nếu quá lạc quan; nhưng cũng hay có ý tưởng khác số đông — cứ thử, miễn là có phương án dự phòng', good: false },
  'Địa Kiếp': { role: 'sao của biến động', adds: 'ở đây dễ có hao hụt bất ngờ nếu chủ quan hoặc liều; nên giữ kỷ luật và không đặt cược tất cả vào một lần', good: false },
  'Hồng Loan': { role: 'sao của duyên tình cảm', adds: 'thêm duyên, dễ được cảm tình, hay có tin vui', good: true },
  'Thiên Hỷ': { role: 'sao của tin vui', adds: 'hay có chuyện vui, tin mừng', good: true },
  'Đào Hoa': { role: 'sao của sức hút', adds: 'thêm sức hút, giao tiếp duyên dáng', good: true },
  'Thiên Riêu': { role: 'sao của sự lãng mạn', adds: 'có nét lãng mạn, ham vui; đôi khi dễ sa vào hưởng thụ', good: false },
  'Tam Thai': { role: 'sao của chỗ đứng', adds: 'có dấu hiệu được nâng lên, được trao vị trí', good: true },
  'Bát Tọa': { role: 'sao của chỗ đứng', adds: 'có dấu hiệu chỗ đứng vững vàng, được công nhận', good: true },
  'Ân Quang': { role: 'sao của ân huệ', adds: 'hay được giúp và biết đáp lại ân tình', good: true },
  'Thiên Quý': { role: 'sao của sự nâng đỡ', adds: 'có người quý mến, nâng đỡ', good: true },
  'Long Trì': { role: 'sao của tài hoa', adds: 'có gu thẩm mỹ, khéo tay, tài hoa', good: true },
  'Phượng Các': { role: 'sao của sự thanh lịch', adds: 'có nét thanh lịch, coi trọng danh dự', good: true },
  'Thai Phụ': { role: 'sao của danh dự', adds: 'dễ được giao vai trò phụ tá, được tin cậy', good: true },
  'Phong Cáo': { role: 'sao của sự công nhận', adds: 'có lợi về bằng cấp, giấy khen, sự công nhận chính thức', good: true },
  'Thiên Quan': { role: 'sao quý nhân', adds: 'dễ được người có chức vị giúp đỡ', good: true },
  'Thiên Phúc': { role: 'sao của phúc khí', adds: 'có chút may mắn nhẹ nhàng, gặp khó thường có người giúp', good: true },
  'Thiên Đức': { role: 'sao giải', adds: 'những điều khó ở đây thường được giảm nhẹ', good: true },
  'Nguyệt Đức': { role: 'sao giải', adds: 'những điều khó ở đây thường được giảm nhẹ', good: true },
  'Giải Thần': { role: 'sao giải', adds: 'vướng mắc ở đây thường có cách tháo gỡ', good: true },
  'Thiên Hình': { role: 'sao của kỷ luật', adds: 'có tính nghiêm khắc, nguyên tắc; hợp việc liên quan đến luật lệ, kỹ thuật chính xác', good: false },
  'Thiên Khốc': { role: 'sao của nỗi buồn', adds: 'dễ có những lúc buồn, lo; nên có người để chia sẻ', good: false },
  'Thiên Hư': { role: 'sao của sự trống trải', adds: 'đôi khi thấy hụt hẫng, trống trải dù mọi thứ vẫn ổn', good: false },
  'Cô Thần': { role: 'sao của sự độc lập', adds: 'thích tự lập, đôi khi thấy cô đơn ở chuyện này', good: false },
  'Quả Tú': { role: 'sao của sự độc lập', adds: 'thích tự lo liệu, ngại nhờ vả', good: false },
  'Hoa Cái': { role: 'sao của nghệ thuật và sự kiêu hãnh', adds: 'có nét nghệ sĩ, thích cái đẹp, có chút kiêu hãnh', good: true },
};

/** Tứ Hóa: "biến" một sao theo hướng nào. */
export const HOA_STORY: Record<'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ', { role: string; adds: string; good: boolean }> = {
  Lộc: { role: 'dấu hiệu của nguồn lợi', adds: 'có thêm cơ hội, nguồn lợi, mọi việc dễ hanh thông', good: true },
  Quyền: { role: 'dấu hiệu của quyền chủ động', adds: 'bạn có tiếng nói, quyền quyết định, sức ảnh hưởng', good: true },
  Khoa: { role: 'dấu hiệu của uy tín', adds: 'có uy tín, tiếng tốt, được tin cậy — và hay có người giúp khi gặp khó', good: true },
  Kỵ: { role: 'dấu hiệu của sự vướng mắc', adds: 'đây là chỗ bạn hay lo nghĩ, dễ vướng mắc, dễ hiểu lầm — cũng là chỗ bạn bỏ nhiều tâm sức nhất', good: false },
};

/** Độ sáng: giải thích một lần, dễ hiểu. */
export const BRIGHT_STORY: Record<string, string> = {
  Miếu: 'đang ở vị trí sáng nhất ("Miếu") — giống cây trồng đúng đất, những nét tốt của sao phát huy trọn vẹn',
  Vượng: 'đang ở vị trí rất sáng ("Vượng") — những nét tốt của sao thể hiện rõ',
  Đắc: 'đang ở vị trí khá thuận ("Đắc") — nét tốt thể hiện được, dù không trọn như lúc sáng nhất',
  Lợi: 'đang ở vị trí khá thuận ("Lợi") — nét tốt thể hiện được',
  Bình: 'đang ở vị trí trung bình ("Bình") — tốt hay chưa tốt tùy cách bạn dùng',
  'Bất đắc': 'đang ở vị trí kém thuận ("Bất đắc") — nét tốt cần nhiều công hơn mới thể hiện được',
  Hãm: 'đang ở vị trí tối ("Hãm") — giống cây trồng sai đất, mặt trái của sao dễ lộ ra hơn, cần rèn nhiều hơn',
};

/** Việc nên làm theo lĩnh vực (dùng cho các cung không có lời khuyên riêng theo sao). */
export const DOMAIN_DO: Partial<Record<import('./palaces').DomainKey, string>> = {
  phuc: 'Giữ một thói quen nuôi dưỡng tinh thần cố định mỗi tuần — vận động, đọc, thiền, thăm người thân — thay vì đợi lúc mệt mới tìm.',
  di: 'Khi vào môi trường mới, chủ động giới thiệu mình và tìm một người "dẫn đường"; chuẩn bị kỹ trước những chuyến đi xa.',
  dien: 'Lập danh sách tài sản và giấy tờ nhà đất; bảo trì nhà định kỳ thay vì đợi hỏng mới sửa.',
  phuthe: 'Hẹn một buổi trò chuyện thật mỗi tuần, nói về mong muốn của cả hai chứ không chỉ chuyện việc nhà.',
  tutuc: 'Hỏi nhiều hơn dặn; để con (hoặc người bạn dìu dắt) tự quyết những việc nhỏ và tự chịu kết quả.',
  phumau: 'Hỏi thăm cha mẹ đều đặn; với cấp trên, báo cáo chủ động và rõ ràng bằng văn bản.',
  huynh: 'Giữ liên lạc đều với anh chị em; chuyện tiền bạc chung luôn ghi rõ ràng, kể cả với người thân.',
  no: 'Đầu tư vào vài mối quan hệ chất lượng; tìm hiểu kỹ người hợp tác trước khi giao tiền hay việc lớn.',
};

/** Câu hỏi đời thường cho từng cung — dùng làm tiêu đề. */
export const PALACE_QUESTION: Record<string, { q: string; about: string }> = {
  Mệnh: { q: 'Bạn là người thế nào?', about: 'Cung Mệnh là ô trung tâm của lá số, cho biết tính cách gốc — cách bạn tự nhiên phản ứng khi không cố gắng thay đổi.' },
  'Phúc Đức': { q: 'Điều gì làm bạn thấy an lòng?', about: 'Cung Phúc Đức nói về đời sống tinh thần: điều gì nuôi dưỡng bạn, bạn tìm sự bình yên ở đâu, và nền nếp gia đình lớn.' },
  'Thiên Di': { q: 'Ra ngoài xã hội, bạn trông thế nào?', about: 'Cung Thiên Di nói về bạn khi ở bên ngoài: nơi làm việc xa, môi trường mới, cách người lạ nhìn thấy bạn.' },
  'Quan Lộc': { q: 'Bạn hợp làm việc kiểu nào?', about: 'Cung Quan Lộc nói về sự nghiệp: phong cách làm việc, môi trường hợp với bạn, kiểu vai trò bạn làm tốt.' },
  'Tài Bạch': { q: 'Bạn kiếm và giữ tiền ra sao?', about: 'Cung Tài Bạch nói về phong cách tài chính: tiền đến với bạn bằng cách nào, bạn hay tiêu vào đâu. Không phải dự báo giàu hay nghèo.' },
  'Điền Trạch': { q: 'Nhà cửa và tài sản tích lũy', about: 'Cung Điền Trạch nói về chỗ ở, nhà đất, tài sản lâu dài và không khí trong nhà.' },
  'Phu Thê': { q: 'Trong tình yêu, hôn nhân, bạn cần gì?', about: 'Cung Phu Thê nói về mẫu người bạn hợp và những điều dễ va chạm trong quan hệ đôi lứa. Không đoán bạn cưới ai hay khi nào.' },
  'Tử Tức': { q: 'Con cái và những gì bạn nuôi dưỡng', about: 'Cung Tử Tức nói về cách bạn chăm sóc, dạy dỗ con cái, học trò — và cả những "đứa con tinh thần" như dự án, sản phẩm.' },
  'Phụ Mẫu': { q: 'Quan hệ với cha mẹ và cấp trên', about: 'Cung Phụ Mẫu nói về quan hệ với cha mẹ, người đi trước, cấp trên, và cả chuyện giấy tờ, thủ tục.' },
  'Huynh Đệ': { q: 'Anh chị em và người cộng sự', about: 'Cung Huynh Đệ nói về anh chị em ruột và những người ngang hàng thân thiết, cộng sự cùng cấp.' },
  'Nô Bộc': { q: 'Bạn bè, đồng nghiệp, khách hàng', about: 'Cung Nô Bộc (nghĩa ngày nay: các mối quan hệ xã hội) nói về bạn bè, đồng nghiệp, cấp dưới và khách hàng.' },
  'Tật Ách': { q: 'Sức khỏe và cách bạn chịu áp lực', about: 'Cung Tật Ách theo truyền thống nói về sức khỏe. MệnhLab đọc nó như lời nhắc về nhịp sinh hoạt và cách bạn phản ứng với căng thẳng — không phải chẩn đoán.' },
};
