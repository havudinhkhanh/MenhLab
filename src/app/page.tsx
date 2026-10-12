import Link from 'next/link';
import BirthForm from '@/components/BirthForm';
import ChartExplorer from '@/components/ChartExplorer';
import { buildChart } from '@/lib/engine/chart';
import { config, vnd } from '@/lib/config';
import { T } from '@/components/TermLayer';

// Lá số mẫu của một người giả định, để người mới bấm thử từng thuật ngữ trước khi nhập dữ liệu của mình.
const SAMPLE = buildChart({
  name: 'Lá số mẫu',
  gender: 'nu',
  calendar: 'duong',
  year: 1992,
  month: 8,
  day: 15,
  timeType: 'clock',
  hour: 10,
  minute: 30,
  certainty: 'chinh-xac',
  place: 'HCM',
});

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return (
    <div className="wrap">
      {sp['da-xoa'] === '1' && (
        <p className="note" style={{ marginTop: 16 }}>
          Dữ liệu lá số của bạn đã được xóa vĩnh viễn.
        </p>
      )}
      <section className="hero">
        <div>
          <h1>Lá số Tử Vi, đọc hiểu từng chữ.</h1>
          <p className="hero-lede">
            Phần lớn người xem lá số không hiểu <T>Tuần</T>, <T>Triệt</T>, <T name="Hóa Kỵ">Hóa Kỵ</T> hay <T name="Hãm">Hãm</T> là gì.{' '}
            {config.brand} giải thích mọi thuật ngữ, chỉ rõ căn cứ của từng nhận định, và nói thẳng điều Tử Vi không làm được.
          </p>
          <div id="lap-la-so" style={{ scrollMarginTop: 16 }}>
            <BirthForm />
          </div>
        </div>
        <div>
          <ChartExplorer chart={SAMPLE} compact />
          <p className="hero-chart-caption">
            Lá số mẫu của một người giả định. Bấm thử vào bất kỳ chữ nào — tên sao, chữ (M) hay (H) cạnh sao, dấu Tuần/Triệt màu đỏ.
          </p>
        </div>
      </section>

      <section>
        <h2>Khác gì những trang lá số khác</h2>
        <div className="principles">
          <div>
            <h3>Lịch và giờ sinh tính kỹ</h3>
            <p>
              Âm lịch theo múi giờ Việt Nam, không dùng lịch Trung Quốc. Tự hiệu chỉnh những năm miền Nam dùng giờ UTC+8 — nguyên nhân phổ
              biến khiến lá số lệch cả canh giờ.
            </p>
          </div>
          <div>
            <h3>Mỗi nhận định có "vì sao"</h3>
            <p>
              Không phán bừa. Mỗi câu luận giải ghi rõ sao nào, ở cung nào, theo quy tắc gì — để bạn tự kiểm chứng hoặc mang đi hỏi
              người khác.
            </p>
          </div>
          <div>
            <h3>Không hù dọa</h3>
            <p>
              Không "năm hạn", không đoán bệnh tật hay tai nạn, không bán lễ giải. Chúng tôi nói rõ: Tử Vi là công cụ tự suy ngẫm, chưa
              được khoa học chứng minh khả năng dự đoán.
            </p>
          </div>
        </div>
        <p style={{ marginTop: 24 }}>
          Xem miễn phí lá số và cung Mệnh. Bản Pro {vnd(config.pricePro)} một lần cho mỗi lá số. <Link href="/bang-gia">So sánh hai gói</Link>{' '}
          hoặc đọc <Link href="/phuong-phap">phương pháp</Link>.
        </p>
      </section>
    </div>
  );
}
