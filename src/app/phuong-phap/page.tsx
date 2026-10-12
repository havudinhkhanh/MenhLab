import type { Metadata } from 'next';
import Link from 'next/link';
import { config } from '@/lib/config';
import { T } from '@/components/TermLayer';

export const metadata: Metadata = {
  title: 'Phương pháp và lập trường khoa học',
  description: 'MệnhLab lập lá số thế nào, luận giải theo quy tắc nào, và vì sao chúng tôi nói thẳng giới hạn của Tử Vi.',
};

export default function Method() {
  return (
    <div className="wrap narrow" style={{ paddingTop: 32 }}>
      <h1>Phương pháp</h1>
      <div className="prose">
        <p>
          {config.brand} được xây trên một quan điểm: người xem lá số xứng đáng hiểu mình đang đọc gì, và biết điều gì là quy tắc truyền
          thống, điều gì là suy diễn, điều gì chưa ai chứng minh được.
        </p>

        <h2>Tử Vi có phải khoa học không?</h2>
        <p>
          Không. Tử Vi là hệ thống chiêm tinh phương Đông có lịch sử hàng trăm năm, mang giá trị văn hóa và có cấu trúc logic chặt chẽ —
          nhưng chưa có nghiên cứu có đối chứng nào cho thấy vị trí các "sao" trên lá số dự đoán được tính cách hay sự kiện trong đời. Các
          thí nghiệm mù về chiêm tinh phương Tây cũng không tìm thấy khả năng dự đoán vượt mức ngẫu nhiên.
        </p>
        <p>
          Vậy "khoa học nhất có thể" nghĩa là gì? Là áp dụng thái độ khoa học vào cách trình bày: minh bạch quy tắc, nói rõ độ bất định, kiểm
          tra độ nhạy của kết luận, tránh ngôn ngữ gây sợ hãi, và thu thập phản hồi để đo độ đúng thực tế thay vì tự khẳng định.
        </p>

        <h2>Năm nguyên tắc</h2>
        <h3>1. Tính lịch và giờ sinh cho đúng trước đã</h3>
        <p>
          Lỗi phổ biến nhất của lá số không nằm ở luận giải mà ở đầu vào. {config.brand} đổi âm lịch theo thuật toán thiên văn cho múi giờ
          Việt Nam (không dùng lịch Trung Quốc vốn lệch ở một số năm, như Tết 1985), và tự hiệu chỉnh <T>Múi giờ lịch sử</T>: miền Nam dùng
          UTC+8 từ cuối 1959 đến giữa 1975, cả nước từng dùng UTC+9 năm 1945. Bạn được xem từng bước hiệu chỉnh trước khi lập lá số.
        </p>
        <h3>2. Mỗi nhận định có căn cứ</h3>
        <p>
          Luận giải được sinh từ quy tắc, không phải viết tay cho từng người. Mỗi câu đi kèm phần "Vì sao?" ghi rõ sao nào, độ sáng nào, ở
          cung nào, chiếu từ đâu. Bạn có thể tra từng thuật ngữ trong <Link href="/tu-dien">Từ điển</Link>.
        </p>
        <h3>3. Kiểm tra độ nhạy</h3>
        <p>
          Giờ sinh lệch 15 phút có thể đổi cả lá số. Phần <T>Độ nhạy giờ sinh</T> tính lại lá số cho toàn bộ khoảng sai số bạn khai báo và cho
          mọi quy ước tính khác nhau (giờ đồng hồ, giờ chuẩn, giờ Mặt Trời; giờ Tý đổi ngày lúc 23h hay 0h; cách tính tháng nhuận), rồi cho
          biết kết luận nào còn đứng vững.
        </p>
        <h3>4. Ngôn ngữ xu hướng, không định mệnh</h3>
        <p>
          Chúng tôi viết "thiên hướng", "dễ", "cần để ý" — không viết "chắc chắn sẽ". Không dự đoán bệnh tật, tai nạn, tử vong, ly hôn, phá
          sản. Không có "năm hạn", không bán lễ giải. Lý do: <T>Lời tiên tri tự ứng nghiệm</T> là có thật — tin rằng năm nay xấu có thể khiến
          bạn hành động tệ đi.
        </p>
        <h3>5. Đo độ đúng bằng dữ liệu</h3>
        <p>
          Nếu bạn đồng ý, bạn có thể chấm "mô tả này đúng với tôi đến đâu" cho từng cung. Dữ liệu ẩn danh giúp chúng tôi biết nhận định nào
          thực sự phân biệt được người này với người kia, và nhận định nào chỉ là <T>Hiệu ứng Barnum</T> — đúng với ai cũng được.
        </p>

        <h2>Kỹ thuật an sao</h2>
        <p>
          Phần an sao lõi (cung Mệnh, Thân, Cục, 14 chính tinh, phụ tinh, độ sáng, Tứ Hóa, vòng Tràng Sinh, vòng Bác Sĩ, đại vận) dùng thư viện
          mã nguồn mở iztro (giấy phép MIT), đã được cộng đồng kiểm chứng; chúng tôi kiểm thử đối chiếu với tính tay. Phần đặc thù Tử Vi Việt
          Nam do {config.brand} tự tính: âm lịch UTC+7, <T>Tuần</T> và <T>Triệt</T> vẽ giữa hai cung, vòng Thái Tuế, tiểu hạn, tên gọi thuật ngữ
          Việt.
        </p>
        <h3>Độ sáng sao: hai trường phái</h3>
        <p>
          Sách Tử Vi Việt Nam dùng thang 5 mức (Miếu, Vượng, Đắc, Bình, Hãm) và xếp một số sao khác với Tử Vi Đẩu Số Toàn Thư (thang 7
          mức, có thêm Lợi và Bất đắc). Khoảng hai phần ba vị trí của 14 chính tinh được hai bảng xếp khác nhau; phần lớn chỉ lệch một bậc, nhưng có chỗ ngược hẳn: Tham Lang ở Tý, sách Việt ghi Hãm còn Toàn Thư ghi Vượng; Thất Sát ở Tuất, sách Việt ghi Hãm còn Toàn Thư ghi Miếu. Mặc định {config.brand} dùng bảng
          sách Việt (theo dữ liệu của dự án mã nguồn mở lasotuvi, giấy phép MIT); bạn có thể chọn Toàn Thư trong tùy chọn nâng cao. Thiên
          Phủ, Lộc Tồn, Tả Phù, Hữu Bật, Thiên Khôi, Thiên Việt không có trong bảng sách Việt nên giữ theo Toàn Thư. Mỗi lá số đều liệt kê
          những sao mà hai bảng xếp khác nhau — vì đây là điểm các sách chưa thống nhất, bạn nên biết chỗ nào đang tranh luận.
        </p>
        <p>
          Quy ước mặc định: năm âm lịch đổi vào Tết; tuổi mụ; giờ Tý (23:00–01:00) tính sang ngày mới; tháng nhuận tách ở ngày 15; Tứ Hóa năm
          Nhâm: Thiên Lương Lộc, Tử Vi Quyền, Tả Phù Khoa, Vũ Khúc Kỵ.
        </p>

        <h2>Cách đọc lá số cho tỉnh táo</h2>
        <ul>
          <li>Đọc như một tấm gương để đặt câu hỏi, không phải bản án.</li>
          <li>Với mỗi nhận định, tự hỏi: câu này có đúng với hầu hết mọi người không?</li>
          <li>Không đưa ra quyết định lớn (hôn nhân, đầu tư, sức khỏe, nghề nghiệp) chỉ dựa trên lá số.</li>
          <li>Nếu lá số làm bạn lo âu kéo dài, hãy dừng đọc và nói chuyện với người bạn tin cậy.</li>
        </ul>
      </div>
    </div>
  );
}
