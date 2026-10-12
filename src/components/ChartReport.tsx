/**
 * Toàn bộ trang lá số. Dùng chung cho lá số đã lưu (render phía server)
 * và chế độ xem nhanh (render trong trình duyệt). Không import gì chỉ chạy được ở server.
 */
import type { Chart } from '@/lib/engine/chart';
import type { Reading } from '@/lib/reading';
import type { Sensitivity } from '@/lib/engine/sensitivity';
import type { BirthInput, Conventions } from '@/lib/engine/birth';
import { config, vnd } from '@/lib/config';
import ChartExplorer, { type PalaceView } from './ChartExplorer';
import { AiPanel, CheckoutButton, DeleteData, PrintButton, SaveChart } from './Actions';
import Rating from './Rating';
import { T } from './TermLayer';

export interface ReportProps {
  chart: Chart;
  reading: Omit<Reading, 'palaces'> & { palaces: PalaceView[] };
  sensitivity: Sensitivity;
  isPro: boolean;
  chartId?: string;
  isNew?: boolean;
  canRate?: boolean;
  ai?: { enabled: boolean; synthesis: string | null; qa: { q: string; a: string }[]; limit: number };
  draft?: { input: BirthInput; conventions: Conventions };
  paymentReturn?: 'ok' | 'cancel';
}

const TIME_MODE: Record<string, string> = {
  chuan: 'Giờ chuẩn (đã hiệu chỉnh múi giờ lịch sử)',
  'dong-ho': 'Giờ đồng hồ (không hiệu chỉnh)',
  'mat-troi': 'Giờ Mặt Trời thực',
};

export default function ChartReport(p: ReportProps) {
  const { chart, reading, sensitivity, isPro, chartId } = p;
  const pro = (label: string) => (isPro ? null : <span className="pill pro">{label}</span>);

  return (
    <div className="wrap">
      <div style={{ padding: '28px 0 0' }}>
        <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', marginBottom: 8 }}>
          {chart.name ? `Lá số của ${chart.name}` : 'Lá số Tử Vi của bạn'}
        </h1>
        <p className="muted" style={{ marginBottom: 16 }}>
          {chart.gender === 'nam' ? 'Nam' : 'Nữ'}, sinh ngày {chart.birth.solar.day}/{chart.birth.solar.month}/{chart.birth.solar.year} dương lịch,
          tức {chart.birth.lunar.day}/{chart.birth.lunar.month}
          {chart.birth.lunar.leap ? ' (nhuận)' : ''} năm {chart.canChi.year}. {isPro ? <span className="pill pro">Pro</span> : <span className="pill">Free</span>}
        </p>
        {p.isNew && chartId && (
          <p className="note">Đã lưu. Link riêng của lá số này đã được gửi về email của bạn — ai có link đều xem được, hãy giữ kín.</p>
        )}
        {p.paymentReturn === 'ok' && !isPro && (
          <p className="note">Đang chờ xác nhận thanh toán. Trang sẽ mở khóa ngay khi cổng thanh toán báo về (thường dưới 1 phút) — hãy tải lại trang.</p>
        )}
        {p.paymentReturn === 'cancel' && <p className="alert">Bạn đã hủy thanh toán. Lá số vẫn được giữ nguyên.</p>}
        {!chartId && (
          <p className="note">Chế độ xem nhanh: lá số được tính ngay trên máy bạn, không lưu gì trên máy chủ. Đóng tab là mất.</p>
        )}
        {chart.birth.warnings.map((w, i) => (
          <p key={i} className="alert">
            {w}
          </p>
        ))}
        {chart.calendarNote && <p className="alert">{chart.calendarNote}</p>}
      </div>

      <ChartExplorer chart={chart} readings={reading.palaces} currentAge={reading.currentAge} chartId={chartId} canRate={p.canRate} />

      <nav className="tabs no-print" aria-label="Các phần của lá số">
        <a href="#tong-quan">Tổng quan</a>
        <a href="#12-cung">12 cung</a>
        <a href="#dai-van">Đại vận</a>
        <a href="#nam-nay">Năm {reading.years[0]?.year}</a>
        <a href="#do-nhay">Độ nhạy giờ sinh</a>
        <a href="#cach-tinh">Cách tính</a>
        {isPro && p.ai?.enabled && <a href="#ai">Hỏi đáp</a>}
      </nav>

      <section id="tong-quan" className="section">
        <h2>Tổng quan</h2>
        <div className="overview">
          {reading.overview.map((o) => (
            <div key={o.label}>
              <div className="k">{o.term ? <T name={o.term}>{o.label}</T> : o.label}</div>
              <div className="v">{o.value}</div>
              <div className="e">{o.explain}</div>
            </div>
          ))}
        </div>
        <div className="prose" style={{ marginTop: 20 }}>
          {reading.overviewText.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
      </section>

      <section id="12-cung" className="section">
        <h2>Đọc 12 cung {pro('Pro: 11 cung còn lại')}</h2>
        <p className="muted">
          Thứ tự đọc từ cung Mệnh đi ngược chiều kim đồng hồ. Mỗi cung đọc cùng{' '}
          <T>Tam phương tứ chính</T> của nó. Chỉ số "hỗ trợ/thử thách" là số sao tốt/xấu đếm theo quy tắc cổ điển (bản cung tính 1, cung
          chiếu tính 0,5) — không phải xác suất.
        </p>
        {reading.palaces.map((r) => (
          <article key={r.branch} className="reading">
            <h3>
              <T name={`Cung ${r.palace}`}>Cung {r.palace}</T>
              {r.isBody && r.palace !== 'Mệnh' && <span className="pill">Thân cư</span>}
            </h3>
            <p className="headline">{r.headline}</p>
            {r.locked ? (
              <p className="muted small">🔒 Phần đọc chi tiết có trong bản Pro.</p>
            ) : (
              <>
                <div className="prose">
                  {r.paragraphs.map((t, i) => (
                    <p key={i}>{t}</p>
                  ))}
                </div>
                <details className="evidence">
                  <summary>Vì sao? Căn cứ của nhận định</summary>
                  <ul>
                    {r.evidence.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </details>
                {p.canRate && chartId && <Rating chartId={chartId} section={`cung:${r.palace}`} />}
              </>
            )}
          </article>
        ))}
      </section>

      <section id="dai-van" className="section">
        <h2>
          Đại vận 10 năm {pro('Pro: Tứ Hóa từng đại vận')}
        </h2>
        <p className="muted">
          Bạn đang {reading.currentAge} tuổi mụ. Mỗi <T>Đại vận</T> là một chủ đề 10 năm, đi qua một cung. Chiều chạy:{' '}
          {chart.daiVanForward ? 'thuận' : 'nghịch'} (vì là {chart.amDuong}).
        </p>
        <ol className="timeline">
          {reading.daiVan.map((d) => (
            <li key={d.branch} className={d.current ? 'now' : ''}>
              <div>
                <span className="age">
                  {d.range[0]}–{d.range[1]} tuổi
                </span>{' '}
                · cung {d.palace} {d.current && <span className="pill">Hiện tại</span>}
              </div>
              <p style={{ margin: '4px 0' }}>{d.summary}</p>
              {d.notes.map((n, i) => (
                <p key={i} className="small" style={{ margin: '2px 0', color: 'var(--ink-2)' }}>
                  {n}
                </p>
              ))}
            </li>
          ))}
        </ol>
      </section>

      <section id="nam-nay" className="section">
        <h2>
          Lưu niên {pro(`Pro: đầy đủ năm ${reading.years[0]?.year} và ${reading.years[0] ? reading.years[0].year + 1 : ''}`)}
        </h2>
        {reading.years.map((y) => (
          <article key={y.year} className="reading">
            <h3>
              Năm {y.canChi} ({y.year})
            </h3>
            <div className="prose">
              {y.paragraphs.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
          </article>
        ))}
        <p className="small muted">
          MệnhLab không đưa ra "năm hạn", "sao chiếu mệnh xấu" hay lời khuyên cúng giải. Xem <a href="/phuong-phap">lý do</a>.
        </p>
      </section>

      <section id="do-nhay" className="section">
        <h2>Độ nhạy giờ sinh</h2>
        <p>{sensitivity.summary}</p>
        {sensitivity.level !== 'cao' && (
          <p className="note">
            Không chắc giờ sinh? Thử <a href="/chinh-gio">tìm giờ sinh theo sự kiện đời</a>: so các canh giờ có thể với những sự kiện lớn
            trong đời bạn.
          </p>
        )}
        {sensitivity.windowMinutes > 0 && (
          <>
            <div className="meter" aria-label={`Độ ổn định ${Math.round(sensitivity.stability * 100)}%`}>
              <span style={{ width: `${Math.round(sensitivity.stability * 100)}%` }} />
            </div>
            <p className="small muted">
              Độ ổn định:{' '}
              {{ cao: 'cao — các kết luận chính đứng vững', 'trung-binh': 'trung bình — nên kiểm chứng thêm', thap: 'thấp — hãy coi lá số là giả thuyết' }[sensitivity.level]}
            </p>
          </>
        )}
        {sensitivity.variants.length > 0 && (
          <div className="variants">
            {sensitivity.variants.map((v, i) => (
              <div key={i} className="variant">
                <b>{v.label}</b>
                {v.share !== undefined && <span className="muted small"> — {Math.round(v.share * 100)}% khoảng sai số</span>}
                <ul className="steps small">
                  {v.diffs.map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="cach-tinh" className="section">
        <h2>Lá số này được tính thế nào</h2>
        <ol className="steps">
          {chart.birth.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
        <p className="small muted" style={{ marginTop: 12 }}>
          Quy ước đang dùng: {TIME_MODE[chart.conventions.timeMode]}; giờ Tý {chart.conventions.dayChange === '23h' ? 'đổi ngày lúc 23h' : 'đổi ngày lúc 0h'}; tháng
          nhuận {chart.conventions.leapRule === 'tach-15' ? 'tách tại ngày 15' : 'tính như tháng chính'}; độ sáng sao theo{' '}
          {chart.brightnessSchool === 'viet' ? 'sách Tử Vi Việt Nam' : 'Tử Vi Đẩu Số Toàn Thư'}. <a href="/phuong-phap">Phương pháp chi tiết</a>.
        </p>
        <h3>Hai trường phái độ sáng</h3>
        {chart.brightnessDiffs.length === 0 ? (
          <p className="small">Trên lá số này, bảng sách Việt và bảng Toàn Thư cho cùng độ sáng ở mọi sao có trong cả hai bảng.</p>
        ) : (
          <>
            <p className="small">
              {chart.brightnessDiffs.length} sao trên lá số này được hai bảng xếp độ sáng khác nhau. Lá số đang dùng bảng{' '}
              {chart.brightnessSchool === 'viet' ? 'sách Việt' : 'Toàn Thư'}; phần luận giải thay đổi theo bảng được chọn. Dấu "—" là
              bảng đó không ghi độ sáng ở cung này.
            </p>
            <table className="simple" style={{ maxWidth: 560 }}>
              <thead>
                <tr>
                  <th>Sao</th>
                  <th>Cung</th>
                  <th>Sách Việt</th>
                  <th>Toàn Thư</th>
                </tr>
              </thead>
              <tbody>
                {chart.brightnessDiffs.map((d) => (
                  <tr key={d.star + d.branchName}>
                    <td>
                      <T name={d.star}>{d.star}</T>
                    </td>
                    <td>{d.branchName}</td>
                    <td>{d.viet}</td>
                    <td>{d.toanThu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>

      {!isPro && (
        <section id="mo-khoa" className="section">
          <h2>Mở khóa bản Pro</h2>
          <div className="plans">
            <div className="panel plan">
              <h3>Đang có (Free)</h3>
              <ul>
                <li>Lá số đầy đủ, giải thích mọi thuật ngữ</li>
                <li>Tổng quan và đọc chi tiết cung Mệnh</li>
                <li>Danh sách đại vận, độ nhạy giờ sinh</li>
              </ul>
            </div>
            <div className="panel plan featured">
              <h3>Pro cho lá số này</h3>
              <p className="price">{vnd(config.pricePro)}</p>
              <p className="small muted">Thanh toán một lần, không gia hạn tự động.</p>
              <ul>
                <li>Đọc chi tiết 11 cung còn lại, mỗi nhận định kèm căn cứ</li>
                <li>Tứ Hóa của từng đại vận: 10 năm nào nguồn lực đổ về đâu</li>
                <li>Lưu niên đầy đủ năm nay và năm sau</li>
                {p.ai?.enabled && <li>Bản luận giải tổng hợp và {p.ai.limit} câu hỏi đáp về lá số</li>}
                <li>Bản in / PDF</li>
              </ul>
              {chartId ? (
                <CheckoutButton chartId={chartId} label={`Thanh toán ${vnd(config.pricePro)}`} />
              ) : p.draft ? (
                <SaveChart input={p.draft.input} conventions={p.draft.conventions} />
              ) : null}
            </div>
          </div>
        </section>
      )}

      {isPro && p.ai?.enabled && chartId && (
        <section id="ai" className="section">
          <h2>Luận giải tổng hợp và hỏi đáp</h2>
          <p className="muted small">
            Viết bởi AI chỉ từ dữ kiện lá số và các nhận định có căn cứ ở trên. AI có thể diễn đạt chưa chuẩn — hãy đối chiếu với phần "Vì
            sao?".
          </p>
          <AiPanel chartId={chartId} initialSynthesis={p.ai.synthesis} initialQa={p.ai.qa} limit={p.ai.limit} />
        </section>
      )}

      <section className="section no-print" style={{ marginTop: 48, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {isPro && <PrintButton />}
        {chartId && <DeleteData chartId={chartId} />}
      </section>
    </div>
  );
}
