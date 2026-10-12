import Link from 'next/link';
import BirthForm from '@/components/BirthForm';
import ChartExplorer from '@/components/ChartExplorer';
import { buildChart } from '@/lib/engine/chart';
import { config, vnd } from '@/lib/config';
import { T } from '@/components/TermLayer';
import { getSessionEmail } from '@/lib/auth';

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
  const email = await getSessionEmail();
  return (
    <>
      <section className="night">
        <div className="wrap hero">
          <div className="hero-copy">
            {sp['da-xoa'] === '1' && <p className="note night-note">Dữ liệu của bạn đã được xóa vĩnh viễn.</p>}
            <h1>Lá số Tử Vi, đọc hiểu từng chữ.</h1>
            <p className="hero-lede">
              Phần lớn người xem lá số không hiểu <T>Tuần</T>, <T>Triệt</T>, <T name="Hóa Kỵ">Hóa Kỵ</T> hay <T name="Hãm">Hãm</T> là gì.{' '}
              {config.brand} giải thích mọi thuật ngữ, chỉ rõ căn cứ của từng nhận định, và nói thẳng điều Tử Vi không làm được.
            </p>
            <div className="hero-actions">
              <a className="btn star" href="#lap-la-so">
                Lập lá số của bạn
              </a>
              <Link className="btn on-night" href={email ? '/tai-khoan' : '/dang-nhap'}>
                {email ? 'Xem lá số đã lưu' : 'Đăng nhập để xem lá số đã lưu'}
              </Link>
            </div>
            <p className="hero-note">Lá số bên cạnh là của một người giả định. Bấm thử vào tên sao, chữ (M) hay (H), dấu Tuần, Triệt màu đỏ.</p>
          </div>
          <figure className="hero-board">
            <ChartExplorer chart={SAMPLE} compact />
          </figure>
        </div>
      </section>

      <div className="wrap">
        <section id="lap-la-so" className="form-section">
          <div className="form-intro">
            <h2>Lập lá số</h2>
            <p>Bốn bước, khoảng một phút. Bạn cần ngày sinh, giờ sinh (nếu biết) và nơi sinh.</p>
            <ol className="what-next">
              <li>
                <b>Thấy ngay lá số</b> đủ 12 cung và phần đọc nhanh, miễn phí.
              </li>
              <li>
                <b>Đọc phần tính cách</b> đầy đủ, có căn cứ cho từng nhận định.
              </li>
              <li>
                <b>Nếu muốn đọc sâu</b>, mở bản Pro {vnd(config.pricePro)} một lần: 12 cung, năm nay, từng tháng, các chặng 10 năm và bản luận giải
                trọn đời.
              </li>
            </ol>
            <p className="small muted">
              Không nhập email thì lá số chỉ được tính trên máy bạn, không lưu gì. Nhập email để lưu, rồi đăng nhập bằng email đó để xem lại.
            </p>
          </div>
          <BirthForm accountEmail={email ?? undefined} />
        </section>

      <section>
        <h2>Khác gì những trang lá số khác</h2>
        <div className="principles" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
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
            <h3>Tự kiểm chứng, công bố công khai</h3>
            <p>
              Chúng tôi làm thí nghiệm mù để đo xem lá số có mô tả đúng con người hơn mức ngẫu nhiên không, và công bố kết quả kể cả khi bất lợi.{' '}
              <Link href="/nghien-cuu">Xem Phòng thí nghiệm mở</Link>.
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
    </>
  );
}
