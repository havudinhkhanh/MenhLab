import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionEmail } from '@/lib/auth';
import { db, type ChartRow } from '@/lib/db';
import { buildChart } from '@/lib/engine/chart';
import { buildReading } from '@/lib/reading';
import { config, vnd } from '@/lib/config';
import { CopyLink, DeleteAccount, LogoutButton } from '@/components/Actions';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Tài khoản', robots: { index: false } };

/** Các trang trên MệnhLab và dùng để làm gì. */
const PAGES: { href: string; label: string; why: string }[] = [
  { href: '/#lap-la-so', label: 'Lập lá số mới', why: 'Cho bạn, người thân hay con cái. Khi đang đăng nhập, lá số tự lưu vào đây.' },
  { href: '/hoc', label: 'Học đọc lá số', why: '9 bài ngắn, từ "cung là gì" đến tự đọc được tam phương tứ chính, mỗi bài có câu hỏi ôn.' },
  { href: '/tu-dien', label: 'Từ điển', why: 'Giải nghĩa hơn 130 thuật ngữ: sao, cung, Tứ Hóa, Tuần, Triệt, độ sáng.' },
  { href: '/chinh-gio', label: 'Tìm giờ sinh', why: 'Không chắc giờ sinh? So các canh giờ với những sự kiện lớn trong đời để chọn giờ khớp nhất.' },
  { href: '/sao', label: '14 chính tinh × 12 cung', why: 'Mỗi sao chính khi đóng ở từng cung nghĩa là gì — 168 trang tra cứu.' },
  { href: '/nghien-cuu', label: 'Nghiên cứu', why: 'Lá số có mô tả đúng hơn ngẫu nhiên không? Kết quả thí nghiệm mù, công bố kể cả khi bất lợi.' },
  { href: '/phuong-phap', label: 'Phương pháp', why: 'Lịch âm, múi giờ, cách an sao và lý do MệnhLab không nói "năm hạn".' },
  { href: '/bang-gia', label: 'Bảng giá', why: `Free xem lá số và tính cách; Pro ${vnd(config.pricePro)} một lần cho mỗi lá số.` },
];

function summary(row: ChartRow, now: Date) {
  try {
    const chart = buildChart(row.birth_input, row.conventions);
    const rd = buildReading(chart, now);
    const menh = rd.palaces.find((p) => p.palace === 'Mệnh')!;
    const month = rd.years[0]?.months.find((m) => m.current);
    const dv = rd.daiVan.find((d) => d.current);
    const b = chart.birth;
    return {
      line: `${chart.gender === 'nam' ? 'Nam' : 'Nữ'}, sinh ${b.solar.day}/${b.solar.month}/${b.solar.year}, giờ ${chart.canChi.hour.split(' ')[1]} (âm lịch ${b.lunar.day}/${b.lunar.month} năm ${chart.canChi.year})`,
      menh: `${chart.palaces[chart.menhBranch].majors.map((s) => s.name).join(', ') || 'Vô chính diệu'}: ${menh.story.lead}`,
      month: month ? `${month.label} (${month.from} – ${month.to}): ${month.focus}` : undefined,
      dv: dv ? `Đang ở chặng ${dv.range[0]}–${dv.range[1]} tuổi, chủ đề lớn là cung ${dv.palace}.` : undefined,
    };
  } catch {
    return { line: 'Không đọc được thông tin sinh của lá số này.', menh: '', month: undefined, dv: undefined };
  }
}

export default async function AccountPage() {
  const email = await getSessionEmail();
  if (!email) redirect('/dang-nhap?next=/tai-khoan');
  const { data } = await db().from('charts').select('*').eq('email', email).order('created_at', { ascending: false }).limit(100);
  const rows = (data ?? []) as ChartRow[];
  const now = new Date();

  return (
    <div className="wrap account">
      <header className="account-head">
        <div>
          <h1>Lá số của bạn</h1>
          <p className="muted">
            Đang đăng nhập bằng {email}. {rows.length ? `Có ${rows.length} lá số gắn với email này.` : ''}
          </p>
        </div>
        <Link href="/#lap-la-so" className="btn">
          Lập lá số mới
        </Link>
      </header>

      <div className="account-grid">
        <section aria-label="Danh sách lá số">
          {rows.length === 0 ? (
            <div className="empty">
              <h2>Chưa có lá số nào gắn với email này</h2>
              <p>
                Lập một lá số mới khi đang đăng nhập, lá số sẽ tự hiện ở đây. Nếu trước đây bạn lưu lá số bằng email khác, hãy đăng xuất rồi đăng
                nhập bằng email đó.
              </p>
              <Link href="/#lap-la-so" className="btn">
                Lập lá số
              </Link>
            </div>
          ) : (
            rows.map((r) => {
              const s = summary(r, now);
              const base = `/la-so/${r.id}`;
              return (
                <article key={r.id} className="chart-card">
                  <div className="chart-card-head">
                    <h2>{r.display_name || 'Lá số không tên'}</h2>
                    <span className={`pill${r.is_pro ? ' pro' : ''}`}>{r.is_pro ? 'Pro' : 'Free'}</span>
                  </div>
                  <p className="muted small">
                    {s.line}. Lưu ngày {new Date(r.created_at).toLocaleDateString('vi-VN')}.
                  </p>
                  {s.menh && <p className="chart-card-menh">{s.menh}</p>}
                  {(s.month || s.dv) && (
                    <p className="small">
                      {s.month}
                      {s.month && s.dv ? ' ' : ''}
                      {s.dv}
                    </p>
                  )}
                  <ul className="link-list">
                    <li>
                      <Link href={base}>Mở lá số</Link>
                      <span>Bảng 12 cung, đọc nhanh, tính cách, công việc, tiền bạc, tình cảm, sức khỏe — chữ nào cũng chạm để xem nghĩa.</span>
                    </li>
                    <li>
                      <Link href={`${base}#thang-nay`}>Tháng này nên làm gì</Link>
                      <span>Việc nên làm, nên tránh trong tháng âm lịch hiện tại, kèm ngày dương lịch.</span>
                    </li>
                    <li>
                      <Link href={`${base}#nam-nay`}>Năm nay</Link>
                      <span>Tiền đến từ đâu, dễ hao ở đâu, công việc, tình cảm, sức khỏe và nhịp từng tháng.</span>
                    </li>
                    {r.is_pro ? (
                      <li>
                        <Link href={`${base}/luan-giai`}>Bản luận giải trọn đời</Link>
                        <span>Khoảng 14.000 chữ viết riêng cho lá số này, đọc như một cuốn sách; in hoặc lưu PDF được.</span>
                      </li>
                    ) : (
                      <li>
                        <Link href={`${base}#mo-khoa`}>Mở khóa bản Pro</Link>
                        <span>
                          {vnd(config.pricePro)} một lần: đọc đủ 12 cung, từng tháng, các chặng 10 năm và bản luận giải trọn đời.
                        </span>
                      </li>
                    )}
                    <li>
                      <Link href={`${base}#la-so`}>Lá số gốc và cách tính</Link>
                      <span>Bảng lá số truyền thống, độ nhạy giờ sinh, từng bước an sao để bạn tự kiểm tra.</span>
                    </li>
                  </ul>
                  <p className="small muted card-foot">
                    Ai có link đều xem được lá số này. <CopyLink path={base} />
                  </p>
                </article>
              );
            })
          )}
        </section>

        <aside className="account-side">
          <section>
            <h2>Các trang trên MệnhLab</h2>
            <ul className="link-list">
              {PAGES.map((p) => (
                <li key={p.href}>
                  <Link href={p.href}>{p.label}</Link>
                  <span>{p.why}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Tài khoản</h2>
            <p className="small muted">
              Tài khoản chỉ là email của bạn — không mật khẩu. Lá số nào được lưu bằng email này đều hiện ở đây. Xem cách chúng tôi giữ dữ liệu
              trong <Link href="/bao-mat">Chính sách bảo mật</Link>.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <LogoutButton />
              <DeleteAccount count={rows.length} />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
