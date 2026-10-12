/**
 * Nội dung cho "Bản luận giải trọn đời" (dạng sách).
 * Viết ở ngôi "bạn" — khi in sẽ tự đổi thành "anh/chị + tên" nếu khách có điền tên.
 * Nguyên tắc: mô tả hành vi đời thường, có cả mặt thuận lẫn mặt cần để ý, không phán số phận,
 * không đoán bệnh, không nêu con số tài chính cụ thể.
 */

type ImpressionDomain = 'huynh' | 'tutuc' | 'phumau' | 'dien' | 'phuc' | 'di' | 'no' | 'tat';

/** Lĩnh vực này "trông thế nào ngoài đời" khi sao chủ đạo là … (không nêu tên sao). */
export const IMPRESSION: Record<string, Record<ImpressionDomain, string>> = {
  'Tử Vi': {
    huynh: 'Giữa anh chị em và những người ngang hàng, bạn thường được coi là người đứng ra quyết, người mà mọi người hỏi ý trước khi làm việc chung. Quan hệ có sự nể trọng, nhưng cũng dễ có chuyện ai nghe ai.',
    tutuc: 'Với con cái hay những người được bạn dìu dắt, bạn đặt kỳ vọng cao và muốn họ đàng hoàng, đáng tự hào. Bạn bảo bọc chu đáo, đôi khi quyết thay cho họ nhiều hơn mức cần.',
    phumau: 'Hình ảnh cha mẹ, người đi trước trong đời bạn thường có vị thế, có tiếng nói trong gia đình hoặc ngoài xã hội. Bạn học được từ họ cách giữ thể diện và tổ chức việc nhà, nhưng cũng có lúc thấy áp lực phải xứng đáng với kỳ vọng.',
    dien: 'Bạn muốn nơi ở của mình đàng hoàng, có chỗ đứng — không cần xa hoa nhưng phải ra dáng một mái nhà. Nhà là nơi bạn làm chủ, sắp xếp theo ý mình.',
    phuc: 'Bạn thấy an lòng nhất khi được tôn trọng và tự quyết chuyện của mình. Những lúc bị coi nhẹ, bị đặt vào thế phải phục tùng là lúc bạn bứt rứt lâu nhất.',
    di: 'Ra ngoài xã hội, bạn dễ được nể, dễ gặp người có vị thế; người lạ thường đối xử với bạn khá trọng thị. Ở môi trường mới, bạn nhanh chóng tìm được chỗ đứng của mình.',
    no: 'Quanh bạn thường có những người bạn, đồng nghiệp có năng lực, có địa vị. Bạn kén bạn bè, quý người đáng tin, nhưng không dễ để người khác lấn lên mình.',
    tat: 'Bạn chịu được áp lực trách nhiệm khá tốt, nhưng hay gồng một mình vì không muốn người khác thấy mình mệt. Căng thẳng thường dồn vào bữa ăn thất thường và giấc ngủ ngắn.',
  },
  'Thiên Cơ': {
    huynh: 'Anh chị em, bạn ngang hàng của bạn thường là người lanh lợi, nhiều ý tưởng. Hai bên hay bàn chuyện, góp ý cho nhau, nhưng ý kiến cũng dễ đổi qua đổi lại.',
    tutuc: 'Con cái hay người được bạn dìu dắt thường thông minh, hiếu động, hay hỏi "vì sao". Bạn hợp cách dạy bằng giải thích hơn là ra lệnh; mặt dễ vướng là lo xa cho tương lai của họ.',
    phumau: 'Cha mẹ, cấp trên của bạn thường là người tính toán, cẩn thận, hay lo. Bạn học được từ họ cách suy nghĩ có kế hoạch, nhưng cũng dễ thấy mình bị nhắc nhở, góp ý nhiều.',
    dien: 'Bạn hay thay đổi chỗ ở, sửa sang, sắp xếp lại nhà cửa, và thích tự tay lên kế hoạch cho không gian sống. Tài sản tích lũy theo tính toán hơn là may mắn.',
    phuc: 'Đầu óc bạn ít khi được nghỉ: kể cả lúc rảnh vẫn nghĩ chuyện này chuyện kia. Bạn thấy an lòng khi hiểu rõ mọi việc và có phương án cho tình huống xấu.',
    di: 'Ra ngoài, bạn thích nghi nhanh, xoay xở giỏi ở môi trường lạ. Người mới gặp thấy bạn nhanh nhạy, khéo léo, nhiều ý tưởng.',
    no: 'Bạn bè, đồng nghiệp của bạn thường là người thông minh, linh hoạt; bạn hợp làm việc với người biết suy nghĩ. Các mối quan hệ khá động — có người đến, có người đi theo từng giai đoạn.',
    tat: 'Áp lực với bạn thường nằm trong đầu: suy nghĩ nhiều, lo trước, khó tắt máy. Mệt về tinh thần thường đến trước mệt về thể chất.',
  },
  'Thái Dương': {
    huynh: 'Bạn là người hay cho đi trong quan hệ anh chị em, bạn bè ngang hàng: giúp đỡ, đứng ra lo việc chung. Mọi người quý bạn, nhưng đôi khi bạn gánh phần nhiều hơn.',
    tutuc: 'Bạn chăm lo con cái hay người mình dìu dắt rất nhiệt tình, muốn họ có danh, có chỗ đứng. Họ thường hướng ngoại, năng động; điều họ cần ở bạn là thời gian hơn là kỳ vọng.',
    phumau: 'Hình ảnh người cha, người đàn ông lớn trong nhà, hoặc cấp trên rộng rãi có ảnh hưởng nhiều tới bạn. Quan hệ với người đi trước khá cởi mở, công khai.',
    dien: 'Nhà bạn thường sáng sủa, cửa mở, hay có người ra vào. Bạn thích một nơi ở thoáng đãng, nơi có thể tiếp đãi người thân, bạn bè.',
    phuc: 'Bạn thấy sống có ý nghĩa khi việc mình làm giúp được người khác và được ghi nhận. Những lúc cho đi mà không ai thấy là lúc bạn hụt hẫng nhất.',
    di: 'Ra ngoài, bạn nổi bật, dễ được biết tới, dễ thành người đứng ra đại diện. Bạn hợp những nơi đông người, có sân khấu để thể hiện.',
    no: 'Bạn có nhiều bạn bè, mối quan hệ rộng và thường là người khởi xướng các buổi gặp. Bạn giúp người nhiều; chỉ cần để ý chuyện cho đi mà không tính phần mình.',
    tat: 'Bạn hay làm quá sức vì trách nhiệm, ít chịu nghỉ, và dễ nóng trong người khi căng thẳng. Cơ thể thường chỉ được nghỉ khi đã mệt hẳn.',
  },
  'Vũ Khúc': {
    huynh: 'Quan hệ với anh chị em, người ngang hàng của bạn khá thực tế: giúp nhau bằng việc làm, bằng tiền bạc hơn là lời nói. Chuyện tiền chung cần rõ ràng để giữ tình cảm.',
    tutuc: 'Bạn dạy con cái hay người dưới quyền bằng kỷ luật và tấm gương làm việc. Họ thường cứng cỏi, tự lập; điều dễ thiếu là những lúc trò chuyện nhẹ nhàng.',
    phumau: 'Cha mẹ, cấp trên của bạn thường là người nghiêm khắc, thực tế, coi trọng kết quả. Bạn tự lập sớm và học được tính kỷ luật từ họ.',
    dien: 'Bạn tích lũy tài sản bằng sức lao động và tính toán chắc tay. Nhà cửa với bạn trước hết phải là tài sản có giá trị, sau mới là chỗ nghỉ ngơi.',
    phuc: 'Bạn thấy yên lòng khi có kế hoạch tài chính rõ ràng và mọi thứ trong tầm kiểm soát. Lúc rảnh, bạn vẫn hay nghĩ về công việc, về tiền.',
    di: 'Ra ngoài làm việc, bạn hiệu quả, quyết đoán và được đánh giá là người làm được việc. Bạn hợp công tác, làm ăn xa, ở những nơi cần người chốt việc.',
    no: 'Bạn bè, đồng nghiệp quanh bạn thường là người thực tế, giỏi làm ăn. Các mối quan hệ có trao đổi rõ ràng; bạn ít thân với người nói nhiều làm ít.',
    tat: 'Bạn chịu cường độ làm việc cao, ít than mệt; căng thẳng thường biểu hiện thành cứng nhắc, khó ngủ khi có việc chưa xong.',
  },
  'Thiên Đồng': {
    huynh: 'Anh chị em, bạn bè ngang hàng của bạn thường hòa thuận, dễ chịu; quan hệ ít va chạm. Mọi người vui vẻ với nhau, chỉ ít khi cùng nhau làm việc lớn.',
    tutuc: 'Bạn là kiểu phụ huynh, người dẫn dắt hiền, gần gũi, chiều chuộng. Không khí với con cái hay người dưới thường vui vẻ; mặt cần để ý là đặt giới hạn rõ ràng.',
    phumau: 'Cha mẹ, cấp trên của bạn thường hiền, dễ tính, không áp đặt. Bạn lớn lên trong không khí khá thoải mái, và quan hệ với người đi trước ít căng thẳng.',
    dien: 'Bạn thích một ngôi nhà ấm cúng, đủ tiện nghi, có chỗ để nghỉ ngơi thật sự. Bạn ít khi chạy theo nhà to, mà theo cảm giác dễ chịu.',
    phuc: 'Bạn biết hưởng những niềm vui nhỏ: bữa ăn ngon, buổi cà phê, một ngày không vội. Bạn an lòng khi mọi người quanh mình vui vẻ, không ai giận ai.',
    di: 'Ra ngoài, bạn dễ được lòng người, dễ hòa nhập. Người lạ thấy bạn thân thiện, không đề phòng.',
    no: 'Bạn có nhiều bạn bè vui vẻ, dễ kết thân; nhưng bạn "cùng chiến đấu" thì ít hơn. Chọn vài người thật đáng tin để hợp tác là điều nên làm.',
    tat: 'Bạn ít căng thẳng gay gắt, nhưng dễ buông lỏng sinh hoạt: ăn uống theo hứng, ngại vận động. Sức khỏe phụ thuộc nhiều vào thói quen hằng ngày.',
  },
  'Liêm Trinh': {
    huynh: 'Quan hệ với anh chị em, người ngang hàng của bạn có nguyên tắc rõ: thân thì rất thân, nhưng sai nguyên tắc thì khó bỏ qua. Cảm xúc giữa hai bên khá mạnh.',
    tutuc: 'Bạn dạy con cái hay người mình dìu dắt bằng nguyên tắc và sự nghiêm túc. Họ thường có cá tính mạnh; điều cần là để họ được thể hiện cảm xúc.',
    phumau: 'Cha mẹ, cấp trên của bạn thường nguyên tắc, kỷ luật, có lúc nghiêm khắc. Bạn tôn trọng họ nhưng cũng có những lần va chạm vì cái tôi hai bên đều lớn.',
    dien: 'Bạn giữ nhà cửa, tài sản có nề nếp, giấy tờ rõ ràng. Với bạn, nhà là nơi phải được giữ gìn đúng cách.',
    phuc: 'Nội tâm bạn nhiều giằng co giữa nguyên tắc và cảm xúc. Bạn cần một hoạt động để xả năng lượng — thể thao, nghệ thuật, một đam mê riêng.',
    di: 'Ra ngoài, bạn nghiêm túc, có lập trường và được tôn trọng vì sự đứng đắn. Người mới gặp đôi khi thấy bạn khó đoán, khó gần.',
    no: 'Bạn kén bạn bè, đặt nặng sự trung thực; quanh bạn là ít người nhưng chất lượng. Một lần mất lòng tin thì khó hàn gắn.',
    tat: 'Bạn dễ căng thẳng vì những chuyện trái nguyên tắc, và cảm xúc dồn nén thường biểu hiện thành mệt mỏi, nóng nảy.',
  },
  'Thiên Phủ': {
    huynh: 'Anh chị em, bạn ngang hàng của bạn thường chín chắn, biết lo; quan hệ ổn định, có trước có sau. Mọi người hay tin bạn giữ những việc cần cẩn thận.',
    tutuc: 'Bạn chăm lo con cái hay người mình dìu dắt rất chu đáo, lo xa cho tương lai của họ. Họ được sống trong sự đủ đầy; điều nên để ý là cho họ cơ hội tự xoay xở.',
    phumau: 'Cha mẹ, cấp trên của bạn thường là chỗ dựa vững, biết giữ của, lo cho con cháu. Bạn thừa hưởng từ họ sự cẩn trọng và ý thức tích lũy.',
    dien: 'Bạn có duyên với nhà cửa, tài sản lâu dài và giữ của rất tốt. Tài sản của bạn thường tăng dần, chậm mà chắc.',
    phuc: 'Bạn an lòng khi có của để dành và mọi thứ có dự phòng. Sự bất an lớn nhất của bạn là cảm giác thiếu thốn, chưa đủ an toàn.',
    di: 'Ra ngoài, bạn được tin cậy, được giao giữ những việc quan trọng. Người lạ thấy bạn điềm đạm, chắc chắn.',
    no: 'Quanh bạn thường là những người bạn, đồng nghiệp đáng tin, lâu năm. Bạn ít bạn mà bền.',
    tat: 'Sức khỏe của bạn khá ổn định, nhưng dễ lơ là vì nghĩ mình còn khỏe. Căng thẳng của bạn thường đến từ nỗi lo tiền bạc, an toàn.',
  },
  'Thái Âm': {
    huynh: 'Quan hệ với anh chị em, bạn ngang hàng của bạn nhẹ nhàng, tình cảm, hay quan tâm nhau âm thầm. Ít ồn ào nhưng gắn bó.',
    tutuc: 'Bạn chăm con cái hay người mình dìu dắt tỉ mỉ, tinh tế, để ý cả những thay đổi nhỏ trong cảm xúc của họ. Mặt cần để ý là đừng lo lắng thay họ quá nhiều.',
    phumau: 'Hình ảnh người mẹ, người phụ nữ lớn trong nhà có ảnh hưởng sâu tới bạn. Quan hệ với cha mẹ thiên về tình cảm, chăm sóc, có cả những điều ít nói ra.',
    dien: 'Bạn có duyên với nhà cửa, đất đai, và thích một không gian sống đẹp, ấm cúng. Tài sản thường tích lũy đều, âm thầm.',
    phuc: 'Bạn giàu cảm xúc, cần những khoảng yên tĩnh một mình để cân bằng. Âm nhạc, cái đẹp, một góc riêng là những thứ nuôi dưỡng bạn.',
    di: 'Ra ngoài, bạn nhẹ nhàng, khéo léo và được cảm tình; bạn làm tốt ở hậu trường hơn là đứng giữa đám đông.',
    no: 'Bạn có vài người bạn thân lâu năm; hợp với đồng nghiệp tinh tế, ít ồn ào. Bạn quý tình cảm hơn số lượng các mối quan hệ.',
    tat: 'Cảm xúc ảnh hưởng nhiều tới sức khỏe của bạn: buồn lo thường kéo theo mất ngủ, ăn uống thất thường.',
  },
  'Tham Lang': {
    huynh: 'Anh chị em, bạn ngang hàng của bạn thường năng động, ham vui, có nhiều mối quan hệ. Hai bên vui vẻ, nhưng chuyện tiền chung dễ phức tạp.',
    tutuc: 'Con cái hay người được bạn dìu dắt thường đa tài, hiếu động, nhiều sở thích. Bạn hợp vai người mở ra trải nghiệm cho họ, chỉ cần giúp họ biết chọn và theo đến cùng.',
    phumau: 'Cha mẹ, cấp trên của bạn thường năng động, giỏi giao tiếp, có nhiều mối quan hệ. Quan hệ với người đi trước có lúc rất gần, có lúc xa.',
    dien: 'Bạn thích một ngôi nhà đẹp, tiện nghi, có không gian để tiếp khách và hưởng thụ. Chi cho nhà cửa dễ vượt dự tính.',
    phuc: 'Bạn cần sự mới mẻ và những trải nghiệm thú vị để thấy sống động. Mặt cần để ý là hưởng thụ dễ thành thói quen khó dừng.',
    di: 'Ra ngoài, bạn rất được việc nhờ giao tế: nhiều cơ hội đến từ tiệc tùng, sự kiện, mạng lưới. Người lạ thấy bạn duyên dáng, dễ mến.',
    no: 'Bạn có quan hệ rộng, nhiều bạn vui; cơ hội làm ăn hay đến từ bạn bè. Điều nên làm là phân biệt bạn vui và bạn làm ăn.',
    tat: 'Bạn dễ ăn uống, sinh hoạt theo hứng, thức khuya vì vui. Sức khỏe phụ thuộc nhiều vào sự chừng mực.',
  },
  'Cự Môn': {
    huynh: 'Quan hệ với anh chị em, người ngang hàng của bạn hay có tranh luận, góp ý thẳng. Thương nhau nhưng dễ hiểu lầm vì lời nói.',
    tutuc: 'Con cái hay người được bạn dìu dắt thường có chính kiến, hay hỏi vặn, thích tranh luận. Bạn hợp cách nói chuyện có lý lẽ, tránh áp đặt.',
    phumau: 'Cha mẹ, cấp trên của bạn thường nói thẳng, kỹ tính. Bạn học được từ họ cách lập luận, nhưng cũng dễ có những lần khác quan điểm.',
    dien: 'Chuyện nhà cửa, tài sản của bạn dễ có điều cần làm rõ: ranh giới, giấy tờ, thỏa thuận với hàng xóm hay người cùng sở hữu.',
    phuc: 'Bạn hay suy tư, dễ để bụng một câu nói. Viết ra, nói ra với người tin cậy giúp bạn nhẹ lòng hơn.',
    di: 'Ra ngoài, bạn ăn nói có lý lẽ và thuyết phục được người khác; mặt cần để ý là thị phi, bị hiểu sai lời.',
    no: 'Bạn kén bạn bè, hay nghi ngờ lúc đầu nhưng đã thân thì bền. Với đồng nghiệp, nói rõ ràng bằng văn bản giúp tránh hiểu lầm.',
    tat: 'Bạn dễ căng thẳng vì lời qua tiếng lại, hay lo nghĩ; căng thẳng thường dồn vào chuyện ăn uống, giấc ngủ.',
  },
  'Thiên Tướng': {
    huynh: 'Anh chị em, bạn ngang hàng của bạn thường đàng hoàng, biết giữ lời; quan hệ công bằng, sòng phẳng. Bạn hay là người đứng ra hòa giải.',
    tutuc: 'Bạn dạy con cái hay người dưới quyền bằng sự chỉn chu, công bằng. Họ thường lễ phép, biết điều; điều cần là cho họ được sai và tự sửa.',
    phumau: 'Cha mẹ, cấp trên của bạn thường đứng đắn, giữ nề nếp, coi trọng lễ nghĩa. Bạn được nâng đỡ và dạy dỗ khá kỹ.',
    dien: 'Nhà bạn ngăn nắp, gọn gàng, giấy tờ đầy đủ. Bạn chăm chút nơi ở như chăm chút chính hình ảnh của mình.',
    phuc: 'Bạn an lòng khi sống đúng, làm đúng và mọi thứ có trật tự. Bất công, bừa bộn là những thứ làm bạn khó chịu lâu.',
    di: 'Ra ngoài, bạn lịch sự, chỉn chu, được tin cậy. Bạn hợp những vai trò cần sự đứng đắn và công bằng.',
    no: 'Bạn có nhiều người quý vì sự tử tế, công bằng; bạn hay giúp người. Chỉ cần để ý đừng ôm việc của người khác.',
    tat: 'Bạn hay để căng thẳng tích tụ vì muốn mọi thứ đúng chuẩn. Giữ nhịp sinh hoạt đều là cách tốt nhất để cơ thể bạn ổn định.',
  },
  'Thiên Lương': {
    huynh: 'Bạn thường là người anh, người chị — kể cả khi không phải con cả — hay lo, hay khuyên anh chị em, bạn bè ngang hàng.',
    tutuc: 'Bạn che chở con cái, người mình dìu dắt rất nhiều. Họ được an toàn; điều nên làm là để họ tự giải quyết những chuyện nhỏ.',
    phumau: 'Cha mẹ, cấp trên của bạn thường là người che chở, có uy tín, hay khuyên bảo. Bạn nhận được nhiều sự bảo bọc từ người đi trước.',
    dien: 'Nhà bạn thường là nơi có nề nếp, có khi là nơi người thân tìm về. Bạn hay thừa hưởng hoặc giữ gìn tài sản của gia đình.',
    phuc: 'Bạn an lòng khi giúp được người khác và sống có đạo lý. Bạn có xu hướng nghĩ về những điều lớn hơn bản thân: gia đình, cộng đồng.',
    di: 'Ra ngoài, bạn được kính trọng, hay gặp người giúp đỡ. Người lạ dễ tin tưởng bạn.',
    no: 'Bạn là người hay giúp bạn bè, đồng nghiệp; bạn được tin, được nhờ. Mặt cần để ý là ôm chuyện của người khác.',
    tat: 'Bạn bền sức, nhưng hay lo chuyện người khác quên chuyện mình. Gặp khó thường qua khỏi, miễn là bạn chịu dừng lại nghỉ.',
  },
  'Thất Sát': {
    huynh: 'Anh chị em, bạn ngang hàng của bạn thường cá tính, độc lập; mỗi người một hướng. Quan hệ có lúc xa, nhưng lúc cần vẫn có nhau.',
    tutuc: 'Con cái hay người được bạn dìu dắt thường mạnh mẽ, độc lập, có chính kiến từ sớm. Bạn hợp cách đồng hành hơn là kiểm soát.',
    phumau: 'Cha mẹ, cấp trên của bạn thường nghiêm, quyết liệt; quan hệ có giai đoạn căng. Bạn tự lập sớm và học được bản lĩnh từ đó.',
    dien: 'Nhà cửa, chỗ ở của bạn có nhiều thay đổi lớn trong đời: chuyển nơi, xây sửa, làm mới. Tài sản hình thành qua những quyết định dứt khoát.',
    phuc: 'Bạn khó ngồi yên; bạn an lòng khi đang chinh phục một mục tiêu. Những lúc không có việc để làm lại là lúc bạn bất an nhất.',
    di: 'Ra ngoài, bạn dám làm, dám đi, hợp môi trường cạnh tranh. Người lạ thấy bạn mạnh mẽ, có khí chất.',
    no: 'Bạn hợp với những người bạn, cộng sự dám làm, cùng chí hướng. Quan hệ đi kèm cạnh tranh, cần rõ ràng ngay từ đầu.',
    tat: 'Bạn chịu áp lực lớn, nhưng dễ làm quá sức trong những đợt cao điểm. Cơ thể cần những khoảng nghỉ bắt buộc sau mỗi giai đoạn "xông pha".',
  },
  'Phá Quân': {
    huynh: 'Quan hệ với anh chị em, người ngang hàng của bạn có nhiều thay đổi theo từng giai đoạn; mỗi người một cá tính mạnh. Chuyện chung nên rõ ràng từ đầu.',
    tutuc: 'Con cái hay người được bạn dìu dắt thường cá tính, thích làm khác, không theo khuôn. Bạn hợp cách cho họ thử và tự rút kinh nghiệm.',
    phumau: 'Bạn hay khác quan điểm với cha mẹ, cấp trên và tự lập sớm. Quan hệ với người đi trước tốt nhất khi mỗi bên có không gian riêng.',
    dien: 'Bạn hay thay đổi chỗ ở, sửa đi làm lại; nhà cửa là nơi bạn thích làm mới. Chi phí cho nhà dễ vượt kế hoạch.',
    phuc: 'Bạn không thích lối mòn; bạn vui khi được làm điều mới, ở môi trường mới. Sự nhàm chán là thứ làm bạn bức bối nhất.',
    di: 'Ra ngoài, bạn táo bạo, dám đổi môi trường, dám đi xa. Môi trường mới thường là nơi bạn bứt phá.',
    no: 'Các mối quan hệ của bạn thay đổi theo giai đoạn đời; ít người đi cùng bạn rất lâu. Chọn kỹ người hợp tác giúp bạn đỡ hao.',
    tat: 'Bạn hay làm việc theo đợt: lúc dồn hết sức, lúc buông hẳn. Nhịp sinh hoạt thất thường là điều cần sửa trước tiên.',
  },
};

/** Khi cung Mệnh có sao phụ nổi bật: "ở cạnh đủ lâu, người ta còn thấy…" */
export const MENH_CONTRAST: Record<string, string> = {
  'Địa Kiếp': 'thỉnh thoảng bạn đột ngột quyết một việc rất mạnh tay — bỏ một kế hoạch đang chạy, đổi hướng, dồn sức vào một ý tưởng mới — khiến người quen bất ngờ',
  'Địa Không': 'bạn hay có những ý nghĩ khác số đông, và đôi khi theo đuổi một kế hoạch mà người khác thấy khó hiểu',
  'Kình Dương': 'khi bị chạm tự ái hay bị dồn ép, bạn phản ứng rất thẳng và quyết liệt, khác hẳn vẻ bình thường',
  'Đà La': 'bạn khá lì: một khi đã quyết thì bền bỉ đến cùng, nhưng cũng có lúc chần chừ rất lâu trước khi quyết',
  'Hỏa Tinh': 'cảm xúc của bạn có thể bốc lên rất nhanh rồi nguội cũng nhanh; quyết định lúc nóng thường khác hẳn lúc bình tĩnh',
  'Linh Tinh': 'bạn hay giữ căng thẳng trong lòng một thời gian dài rồi mới bộc lộ, nên người ngoài khó biết bạn đang chịu áp lực',
  'Tả Phù': 'bạn rất hay có người sẵn lòng giúp, và bạn cũng biết cách nhờ đúng người',
  'Hữu Bật': 'bạn được bạn bè, người ngang hàng quý và hay chung tay với bạn',
  'Văn Xương': 'bạn có nét học thức, chỉn chu trong câu chữ, giấy tờ',
  'Văn Khúc': 'bạn có duyên ăn nói, có năng khiếu và sự khéo léo khiến người khác dễ có cảm tình',
  'Thiên Khôi': 'bạn hay gặp người có vị thế nâng đỡ vào những lúc quan trọng',
  'Thiên Việt': 'bạn hay được giúp đỡ một cách âm thầm, qua những lời giới thiệu không ngờ',
  'Lộc Tồn': 'bạn giữ của khá tốt, thận trọng với tiền và ít khi để mình thiếu hụt',
  'Thiên Mã': 'bạn khó ngồi yên một chỗ, luôn muốn di chuyển, thay đổi',
};

export type Group = 'self' | 'work' | 'money' | 'people' | 'health';

/** Sao phụ và Tứ Hóa: nghĩa theo từng nhóm lĩnh vực. */
export const MINOR_IN: Record<string, Partial<Record<Group, string>>> = {
  'Tả Phù': {
    self: 'bạn ít khi phải gánh một mình — luôn có người sẵn lòng đỡ việc',
    work: 'trong công việc dễ có cộng sự, cấp dưới tận tâm; việc lớn làm theo nhóm thường thành',
    money: 'tiền bạc hay đến nhờ có người giúp sức, giới thiệu, góp công',
    people: 'mối quan hệ này có sự nâng đỡ qua lại, hai bên dễ chung tay',
  },
  'Hữu Bật': {
    self: 'bạn được bạn bè, người ngang hàng quý và hay giúp',
    work: 'công việc thuận khi làm cùng người khác; bạn hợp vai trò phối hợp',
    money: 'làm ra tiền cùng người khác thường suôn hơn làm một mình',
    people: 'quan hệ có sự hỗ trợ mềm mỏng, ít va chạm',
  },
  'Văn Xương': {
    self: 'bạn có lợi thế về học vấn, câu chữ, sự chỉn chu',
    work: 'thuận về bằng cấp, hồ sơ, văn bản; việc cần chuyên môn và giấy tờ là chỗ bạn ghi điểm',
    money: 'tiền bạc gắn với hợp đồng, giấy tờ — làm rõ ràng thì có lợi',
    people: 'người trong mối quan hệ này thường có học, biết điều; trao đổi bằng chữ nghĩa thuận',
  },
  'Văn Khúc': {
    self: 'bạn có duyên ăn nói và năng khiếu, dễ được cảm tình',
    work: 'lợi thế ở giao tiếp, trình bày, thuyết phục; hợp việc cần sự khéo léo',
    money: 'tiền bạc hay đến nhờ khéo ăn nói, thương lượng',
    people: 'quan hệ có sự mềm mỏng, tình cảm; lời nói nhẹ nhàng giữ được hòa khí',
  },
  'Thiên Khôi': {
    self: 'bạn hay gặp người có vị thế nâng đỡ vào lúc quan trọng',
    work: 'dễ có cấp trên, người có tiếng nói giúp mở đường',
    money: 'cơ hội tiền bạc hay đến qua người có vị thế giới thiệu',
    people: 'người trong mối quan hệ này thường nổi bật, có chỗ đứng',
  },
  'Thiên Việt': {
    self: 'bạn hay được giúp đỡ âm thầm, gián tiếp',
    work: 'cơ hội công việc hay đến qua giới thiệu, qua người quen của người quen',
    money: 'tiền bạc có lúc đến từ nguồn không ngờ, qua một lời giới thiệu',
    people: 'quan hệ có sự quan tâm âm thầm, ít nói ra nhưng có thật',
  },
  'Lộc Tồn': {
    self: 'bạn giữ của tốt, thận trọng, ít khi để mình thiếu hụt',
    work: 'công việc mang lại thu nhập ổn định; bạn hợp việc giữ gìn, quản lý',
    money: 'giữ được tiền, tích lũy chậm mà chắc — nhưng dễ có người tranh phần, nên giấy tờ rõ ràng',
    people: 'mối quan hệ này có sự gắn bó về vật chất; rõ ràng chuyện tiền giúp giữ tình cảm',
    health: 'sức bền khá, cơ thể có "của để dành" — miễn là đừng tiêu hao quá mức',
  },
  'Thiên Mã': {
    self: 'bạn năng động, khó ngồi yên, hợp thay đổi môi trường',
    work: 'công việc gắn với đi lại, thay đổi; đứng yên một chỗ không hợp',
    money: 'tiền đi theo bước chân — càng năng động, càng mở rộng địa bàn thì cơ hội càng nhiều',
    people: 'mối quan hệ này hay gắn với đi xa, chuyển chỗ, gặp nhau theo từng giai đoạn',
  },
  'Kình Dương': {
    self: 'bạn có dũng khí và phản ứng thẳng; mặt cần để ý là sự nóng nảy',
    work: 'môi trường làm việc có cạnh tranh trực diện, đòi hỏi tốc độ và bản lĩnh',
    money: 'tiền bạc dễ có tranh giành; thỏa thuận rõ ràng từ đầu để khỏi va chạm',
    people: 'quan hệ dễ có va chạm thẳng; nói rõ ranh giới sẽ giữ được hòa khí',
    health: 'sách cổ gắn với va chạm, chấn thương nhỏ — lời nhắc cẩn thận khi lái xe, chơi thể thao, dùng dụng cụ sắc',
  },
  'Đà La': {
    self: 'bạn lì và bền, nhưng cũng hay chần chừ',
    work: 'việc dễ kéo dài, vướng thủ tục; kiên nhẫn và lưu giấy tờ là chìa khóa',
    money: 'tiền về chậm, khoản tưởng chắc có thể lùi ngày; dự trù thời gian đệm',
    people: 'quan hệ dễ có chuyện dây dưa chưa nói ra; giải quyết sớm đỡ nặng lòng',
    health: 'sách cổ gắn với những vấn đề dai dẳng — có triệu chứng kéo dài thì đi khám sớm',
  },
  'Hỏa Tinh': {
    self: 'cảm xúc bốc nhanh, nguội nhanh; dừng một nhịp trước khi phản ứng',
    work: 'công việc có những đợt gấp, nóng; dễ va chạm khi đang vội',
    money: 'tiền đến nhanh đi nhanh; quyết định lúc nóng dễ hao',
    people: 'quan hệ có lúc bùng lên vì nóng giận; chờ nguội rồi hãy nói',
    health: 'sách cổ gắn với nóng trong, viêm — lời nhắc uống đủ nước, hạn chế đồ cay nóng khi căng thẳng',
  },
  'Linh Tinh': {
    self: 'bạn hay dồn nén căng thẳng rồi mới bộc lộ',
    work: 'áp lực công việc tích tụ âm thầm; cần những khoảng xả định kỳ',
    money: 'những lo lắng về tiền dễ âm ỉ; viết ra kế hoạch giúp nhẹ đầu',
    people: 'trong quan hệ dễ có những điều để bụng; nói ra sớm tốt hơn',
    health: 'sách cổ gắn với căng thẳng tích tụ — lời nhắc xả stress đều đặn, đừng dồn nén',
  },
  'Địa Không': {
    self: 'bạn nghĩ khác số đông, có ý tưởng lạ — đi kèm rủi ro nếu quá lạc quan',
    work: 'kế hoạch công việc dễ hụt, dự án có lúc đổ ngang; luôn có phương án dự phòng',
    money: 'tiền bạc dễ hụt nếu liều; không đặt cược vào điều chưa kiểm chứng',
    people: 'quan hệ có lúc thấy trống, khó nắm bắt; đừng kỳ vọng quá mức',
    health: 'sách cổ gắn với suy nhược, mất ngủ — lời nhắc giữ giờ ngủ cố định, giảm màn hình buổi tối',
  },
  'Địa Kiếp': {
    self: 'bạn có lúc quyết định liều, mạnh tay; giữ kỷ luật thì đó là dũng khí, buông lỏng thì thành hao hụt',
    work: 'công việc có những biến động bất ngờ; đừng dồn mọi thứ vào một dự án',
    money: 'dễ có hao hụt bất ngờ khi chủ quan; không vay để đầu tư, không bảo lãnh',
    people: 'quan hệ có lúc biến động; chuyện tiền chung cần rõ ràng tuyệt đối',
    health: 'sách cổ gắn với hao tổn sức lực — lời nhắc đừng làm việc liên tục không nghỉ',
  },
  'Hóa Lộc': {
    self: 'cơ hội và nguồn lợi hay tìm đến bạn; mọi việc dễ hanh thông',
    work: 'công việc là nguồn lợi rõ; có thêm cơ hội thăng tiến, dự án',
    money: 'thêm nguồn thu, tiền bạc dễ hanh thông',
    people: 'mối quan hệ này mang lại cơ hội, nguồn lợi cho bạn',
    health: 'sức khỏe được nâng đỡ, hồi phục tốt',
  },
  'Hóa Quyền': {
    self: 'bạn có tiếng nói, quyền quyết định và sức ảnh hưởng',
    work: 'có cơ hội nắm quyền, nhận trách nhiệm lớn',
    money: 'bạn có quyền chủ động trong chuyện tiền, giỏi thương lượng',
    people: 'trong mối quan hệ này có người nắm quyền — bạn hoặc người kia; cân bằng tiếng nói là điều cần',
    health: 'sức chịu đựng cao, nhưng dễ cố quá sức',
  },
  'Hóa Khoa': {
    self: 'bạn có uy tín, tiếng tốt, được tin cậy và hay có người giúp khi gặp khó',
    work: 'dễ được ghi nhận, có danh tiếng chuyên môn',
    money: 'tiền bạc đến nhờ uy tín; gặp khó thường có người gỡ giúp',
    people: 'mối quan hệ này có sự tôn trọng, tử tế; gặp chuyện thường dễ hòa giải',
    health: 'gặp vấn đề sức khỏe thường gặp được người chữa giỏi, hồi phục tốt',
  },
  'Hóa Kỵ': {
    self: 'đây là chỗ bạn hay lo nghĩ, dễ vướng mắc — cũng là nơi bạn bỏ nhiều tâm sức nhất',
    work: 'công việc dễ có hiểu lầm, áp lực; giữ trao đổi bằng văn bản',
    money: 'tiền bạc là nỗi bận tâm; dễ hao vì vướng mắc, giấy tờ',
    people: 'mối quan hệ này dễ có hiểu lầm, vướng bận; nói rõ ràng, đừng im lặng cho qua',
    health: 'chỗ cần để ý sức khỏe hơn bình thường; khám định kỳ là cách yên tâm nhất',
  },
};

/** Nghĩa của cung đối diện với từng cung. */
export const OPP_NOTE: Record<string, string> = {
  Mệnh: 'Cung đối diện Mệnh là Thiên Di — bạn khi bước ra ngoài xã hội',
  'Thiên Di': 'Cung đối diện Thiên Di là Mệnh — con người thật của bạn khi ở "sân nhà"',
  'Huynh Đệ': 'Cung đối diện Huynh Đệ là Nô Bộc — bạn bè, đồng nghiệp, mạng lưới rộng hơn',
  'Nô Bộc': 'Cung đối diện Nô Bộc là Huynh Đệ — anh chị em, những người thân thiết nhất',
  'Phu Thê': 'Cung đối diện Phu Thê là Quan Lộc — công việc, sự nghiệp',
  'Quan Lộc': 'Cung đối diện Quan Lộc là Phu Thê — bạn đời, đối tác',
  'Tử Tức': 'Cung đối diện Tử Tức là Điền Trạch — nhà cửa, tổ ấm',
  'Điền Trạch': 'Cung đối diện Điền Trạch là Tử Tức — con cái, những gì bạn nuôi dưỡng',
  'Tài Bạch': 'Cung đối diện Tài Bạch là Phúc Đức — đời sống tinh thần, những gì làm bạn an lòng',
  'Phúc Đức': 'Cung đối diện Phúc Đức là Tài Bạch — tiền bạc',
  'Tật Ách': 'Cung đối diện Tật Ách là Phụ Mẫu — cha mẹ, cấp trên, gốc gác',
  'Phụ Mẫu': 'Cung đối diện Phụ Mẫu là Tật Ách — sức khỏe, nhịp sống',
};

/** Nghĩa của cặp đối cung: chuyện này ảnh hưởng chuyện kia ra sao. */
export const OPP_MEANING: Record<string, string> = {
  Mệnh: 'Người mới quen và người thân có thể thấy hai con người khác nhau; cả hai đều là bạn.',
  'Thiên Di': 'Bạn ở ngoài và bạn ở nhà luôn soi vào nhau: ra ngoài thuận thì về nhà vững, và ngược lại.',
  'Huynh Đệ': 'Cách bạn đối xử với người ngoài thường phản chiếu cách bạn đối xử với người thân, và ngược lại.',
  'Nô Bộc': 'Những gì học được từ anh chị em là nền cho cách bạn kết giao bên ngoài.',
  'Phu Thê': 'Chuyện tình cảm và chuyện công việc ảnh hưởng nhau rất trực tiếp: công việc căng thì ở nhà dễ căng theo.',
  'Quan Lộc': 'Người bạn đời, đối tác ảnh hưởng nhiều tới hướng đi sự nghiệp — có khi là người đẩy bạn ra khỏi vùng an toàn.',
  'Tử Tức': 'Không khí trong nhà ảnh hưởng thẳng tới con cái và những gì bạn nuôi dưỡng.',
  'Điền Trạch': 'Tài sản, nhà cửa của bạn thường gắn với con cái: lo cho con, hoặc con là người tiếp nối.',
  'Tài Bạch': 'Tiền bạc và sự bình yên trong lòng kéo nhau: tâm lý vững thì tiền giữ được, tâm lý bất an thì dễ chi theo cảm xúc.',
  'Phúc Đức': 'Chuyện tiền ảnh hưởng thẳng tới sự an lòng của bạn, và ngược lại.',
  'Tật Ách': 'Nền nếp gia đình, cách cha mẹ sống ảnh hưởng tới thói quen sức khỏe của bạn; áp lực từ cấp trên cũng hay dồn vào cơ thể.',
  'Phụ Mẫu': 'Sức khỏe của bạn và quan hệ với người đi trước kéo nhau: quan hệ căng thì cơ thể dễ mệt theo.',
};

/** Ý nghĩa nhóm tam hợp của từng cung. */
export const TRINE_NOTE: Record<string, string> = {
  Mệnh: 'Mệnh, Tài Bạch, Quan Lộc là bộ ba "con người — tiền — việc": cách bạn là ai quyết định cách bạn làm việc và kiếm tiền',
  'Tài Bạch': 'Tài Bạch đi cùng Mệnh và Quan Lộc: tiền của bạn là kết quả của con người bạn và công việc bạn chọn',
  'Quan Lộc': 'Quan Lộc đi cùng Mệnh và Tài Bạch: công việc phản ánh con người bạn và quyết định dòng tiền',
  'Huynh Đệ': 'Huynh Đệ đi cùng Tật Ách và Điền Trạch: quan hệ ruột thịt gắn với sức khỏe và nhà cửa — anh em hòa thuận thì nhà yên, người khỏe',
  'Tật Ách': 'Tật Ách đi cùng Huynh Đệ và Điền Trạch: sức khỏe gắn với không khí trong nhà và quan hệ với người thân',
  'Điền Trạch': 'Điền Trạch đi cùng Huynh Đệ và Tật Ách: nhà cửa gắn với người thân và sức khỏe',
  'Phu Thê': 'Phu Thê đi cùng Thiên Di và Phúc Đức: tình cảm gắn với cách bạn ra ngoài và đời sống tinh thần',
  'Thiên Di': 'Thiên Di đi cùng Phu Thê và Phúc Đức: cách bạn ra ngoài gắn với bạn đời và sự an lòng bên trong',
  'Phúc Đức': 'Phúc Đức đi cùng Phu Thê và Thiên Di: sự an lòng gắn với tình cảm và cách bạn sống ngoài xã hội',
  'Tử Tức': 'Tử Tức đi cùng Nô Bộc và Phụ Mẫu: những gì bạn nuôi dưỡng gắn với các mối quan hệ trên và dưới',
  'Nô Bộc': 'Nô Bộc đi cùng Tử Tức và Phụ Mẫu: các mối quan hệ xã hội nối giữa người đi trước và người đi sau',
  'Phụ Mẫu': 'Phụ Mẫu đi cùng Tử Tức và Nô Bộc: cách bạn đối với người đi trước phản chiếu cách bạn đối với người đi sau',
};

/** Nguyên tắc nên giữ cho các cung "người khác" và nhà cửa, sức khỏe. */
export const DOMAIN_RULE: Record<string, string> = {
  'Huynh Đệ': 'Thương nhau bằng tình, giúp nhau bằng việc; chuyện tiền chung thì ghi ra giấy.',
  'Phu Thê': 'Mỗi tuần một buổi nói chuyện thật, về mong muốn của cả hai chứ không chỉ việc nhà.',
  'Tử Tức': 'Hỏi nhiều hơn dặn; việc nhỏ để họ tự quyết, việc lớn thì cùng bàn.',
  'Phụ Mẫu': 'Gần gũi bằng sự quan tâm, độc lập bằng quyết định.',
  'Điền Trạch': 'Giấy tờ rõ trước, tiền trao sau; nhà cửa bảo trì định kỳ thay vì đợi hỏng mới sửa.',
  'Tật Ách': 'Nghỉ trước khi mệt, khám trước khi đau.',
  'Nô Bộc': 'Ít mà chất; tin người bằng việc nhỏ trước khi giao việc lớn.',
  'Phúc Đức': 'Mỗi tuần một "nút xả" cố định cho tinh thần, không đợi lúc kiệt sức mới tìm.',
  'Thiên Di': 'Đến nơi mới: lắng nghe trước, tìm một người dẫn đường, rồi mới thể hiện.',
};

/** Ngưỡng hành động cụ thể cho từng cung. */
export const THRESHOLD: Record<string, string> = {
  Mệnh: 'bất kỳ quyết định nào làm thay đổi công việc chính, chỗ ở hay phần tiền an toàn, hãy chờ ít nhất 72 giờ và nói ra với một người mà bạn tin trước khi làm; nếu sau 72 giờ lý do vẫn đứng vững, đó mới là quyết định thật',
  'Tài Bạch': 'mọi khoản góp vốn, cho vay hay đầu tư mà bạn chưa đọc được giấy tờ rõ ràng thì chưa chuyển tiền; với khoản lớn, chờ ít nhất ba ngày và hỏi ý kiến một người am hiểu độc lập',
  'Quan Lộc': 'khi thấy mình bực bội với công việc liên tục hơn hai tuần, hãy viết ra điều gì làm bạn bức bối và nói chuyện với cấp trên hoặc người tin cậy trước khi tính chuyện nghỉ hay đổi việc',
  'Phu Thê': 'khi một chuyện nhỏ lặp lại lần thứ ba mà chưa được nói ra, đó là lúc phải ngồi xuống nói chuyện — không đợi đến lần thứ tư',
  'Tử Tức': 'khi bạn thấy mình nhắc một điều quá ba lần mà không có hiệu quả, hãy đổi cách: hỏi họ nghĩ gì thay vì nhắc tiếp',
  'Phụ Mẫu': 'khi một cuộc tranh luận với cha mẹ hoặc cấp trên lặp lại không lối ra, hãy tạm dừng và chuyển sang trao đổi bằng việc làm hoặc bằng văn bản',
  'Điền Trạch': 'không ký, không đặt cọc bất kỳ giao dịch nhà đất nào khi pháp lý chưa được một người độc lập kiểm tra',
  'Phúc Đức': 'khi mất ngủ hoặc bồn chồn kéo dài hơn một tuần, đó là tín hiệu phải giảm tải và tìm người để chia sẻ — không đợi thêm',
  'Tật Ách': 'có triệu chứng bất thường kéo dài hơn hai tuần thì đi khám, đừng tự chữa; và khám tổng quát mỗi năm một lần dù thấy mình khỏe',
  'Thiên Di': 'trước mỗi lần chuyển môi trường lớn (chuyển việc, chuyển nơi ở, đi xa dài ngày), hãy có sẵn phương án quay lại hoặc khoản dự phòng',
  'Nô Bộc': 'không bảo lãnh, không cho vay khoản mà bạn không sẵn sàng mất; với người mới quen, chỉ giao việc lớn sau khi họ đã làm tốt vài việc nhỏ',
  'Huynh Đệ': 'chuyện tiền bạc với người thân, khoản nào lớn tới mức mất đi sẽ làm bạn phiền lòng thì phải có giấy tờ',
};

/** Câu hỏi tự kiểm chứng cụ thể hơn cho từng cung. */
export const SELF_CHECK: Record<string, string[]> = {
  Mệnh: ['Người quen cũ và người mới gặp có mô tả bạn giống nhau không?', 'Lần gần nhất bạn quyết một việc lớn, bạn quyết theo kiểu nào?'],
  'Tài Bạch': ['Những khoản tiền đáng kể nhất bạn từng kiếm được đến từ đâu?', 'Khoản hao lớn nhất của bạn đến từ chi tiêu hằng ngày hay từ một quyết định?'],
  'Quan Lộc': ['Bạn làm tốt nhất trong môi trường nào: ổn định hay nhiều áp lực?', 'Những lần bạn đổi việc có cùng một lý do không?'],
  'Phu Thê': ['Bạn hay bị thu hút bởi kiểu người nào?', 'Những lần va chạm trong tình cảm thường bắt đầu từ chuyện gì?'],
  'Tử Tức': ['Bạn nuôi dạy, dìu dắt người khác theo kiểu nào?', 'Điều gì khiến bạn lo nhất về những người được bạn nuôi dưỡng?'],
  'Phụ Mẫu': ['Bạn giống cha mẹ ở điểm nào, khác ở điểm nào?', 'Bạn làm việc với cấp trên thuận nhất khi nào?'],
  'Điền Trạch': ['Bạn đã chuyển chỗ ở bao nhiêu lần, vì lý do gì?', 'Tài sản của bạn tích lũy theo cách nào?'],
  'Phúc Đức': ['Điều gì giúp bạn hồi lại sau một tuần mệt?', 'Điều gì làm bạn bất an lâu nhất?'],
  'Tật Ách': ['Khi căng thẳng, cơ thể bạn thường báo hiệu ở đâu?', 'Lần gần nhất bạn khám tổng quát là khi nào?'],
  'Thiên Di': ['Ở môi trường mới, bạn hòa nhập nhanh hay chậm?', 'Những cơ hội lớn của bạn có đến từ bên ngoài, từ nơi xa không?'],
  'Nô Bộc': ['Những người bạn lâu năm của bạn có điểm chung gì?', 'Bạn từng thiệt vì tin người chưa? Chuyện đó bắt đầu thế nào?'],
  'Huynh Đệ': ['Quan hệ với anh chị em của bạn gần hay xa, vì sao?', 'Bạn hợp tác với người ngang hàng thuận nhất khi nào?'],
};
