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
import { CheckoutButton, DeleteData, PrintButton, SaveChart } from './Actions';
import Rating from './Rating';
import { DaiVanNotes, PalaceBody, YearBody } from './ReadingBlocks';
import { T } from './TermLayer';
import BlindGate from './BlindTest';
import type { PatternHit } from '@/lib/engine/patterns';
import type { DerivationStep } from '@/lib/engine/derivation';
import { RATES, fmtPct, oneIn, rate } from '@/data/rates';
import type { LifeReport } from '@/lib/lifeReport';
import { LifeAxes, LifeClosing, LifeOpening, LifeStages, LifeSummary } from './LifeBlocks';

export interface ReportProps {
  chart: Chart;
  reading: Omit<Reading, 'palaces'> & { palaces: PalaceView[] };
  sensitivity: Sensitivity;
  isPro: boolean;
  chartId?: string;
  isNew?: boolean;
  canRate?: boolean;
  draft?: { input: BirthInput; conventions: Conventions };
  paymentReturn?: 'ok' | 'cancel';
  patterns: PatternHit[];
  derivation: DerivationStep[];
  menhKey: string;
  life: LifeReport;
  /** Hiện thí nghiệm ghép cặp mù trước khi xem lá số. */
  blindGate?: { gateKey: string; researchConsent?: boolean };
  /** Bản xem thử Pro của quản trị viên (không lưu, không có hành động mua/xóa). */
  adminPreview?: boolean;
}

const TIME_MODE: Record<string, string> = {
  chuan: 'Giờ chuẩn (đã hiệu chỉnh múi giờ lịch sử)',
  'dong-ho': 'Giờ đồng hồ (không hiệu chỉnh)',
  'mat-troi': 'Giờ Mặt Trời thực',
};

export default function ChartReport(p: ReportProps) {
  const body = <ReportBody {...p} />;
  if (!p.blindGate || !RATES.n) return body;
  return (
    <BlindGate gateKey={p.blindGate.gateKey} truth={p.menhKey} pool={RATES.menhCombo} chartId={p.chartId} researchConsent={p.blindGate.researchConsent}>
      {body}
    </BlindGate>
  );
}

const SECTIONS: { id: string; label: string; palaces?: string[]; intro?: string }[] = [
  { id: 'doc-nhanh', label: 'Đọc nhanh' },
  { id: 'mo-dau', label: 'Mở đầu' },
  {
    id: 'tinh-cach',
    label: 'Tính cách',
    palaces: ['Mệnh', 'Phúc Đức', 'Thiên Di'],
    intro:
      'Phần này ghép ba góc nhìn về con người bạn: bạn tự nhiên là người thế nào (cung Mệnh), điều gì nuôi dưỡng bạn từ bên trong (cung Phúc Đức), và khi ra ngoài người khác thấy bạn ra sao (cung Thiên Di — luôn nằm đối diện cung Mệnh).',
  },
  {
    id: 'cong-viec',
    label: 'Công việc & tiền bạc',
    palaces: ['Quan Lộc', 'Tài Bạch', 'Điền Trạch'],
    intro:
      'Trong Tử Vi, cung công việc (Quan Lộc), cung tiền (Tài Bạch) và cung Mệnh luôn được đọc cùng nhau vì chúng "chiếu" vào nhau: cách bạn làm việc quyết định cách bạn kiếm tiền, và ngược lại. Cung Điền Trạch cho biết phần tiền đó có đọng lại thành tài sản hay không.',
  },
  {
    id: 'gia-dinh',
    label: 'Tình cảm & gia đình',
    palaces: ['Phu Thê', 'Tử Tức', 'Phụ Mẫu', 'Huynh Đệ', 'Nô Bộc'],
    intro:
      'Năm cung nói về những người quanh bạn. Lưu ý cách đọc: sao ở các cung này vừa nói về cách bạn cư xử trong mối quan hệ, vừa phác họa người ở phía bên kia. Đọc như gợi ý để hiểu nhau hơn, không phải phán xét ai.',
  },
  {
    id: 'suc-khoe',
    label: 'Sức khỏe',
    palaces: ['Tật Ách'],
    intro:
      'Tử Vi xưa dùng cung Tật Ách để luận bệnh. Ngày nay chưa có bằng chứng nào cho thấy lá số đoán được bệnh, nên MệnhLab chỉ đọc cung này như lời nhắc về nhịp sinh hoạt và cách bạn chịu áp lực. Mọi lo lắng về sức khỏe hãy hỏi bác sĩ.',
  },
  { id: 'lien-cung', label: 'Bức tranh toàn cảnh' },
  { id: 'dai-van', label: 'Các giai đoạn cuộc đời' },
  { id: 'nam-nay', label: 'Năm nay & từng tháng' },
  { id: 'tong-ket', label: 'Tổng kết' },
  { id: 'loi-nhan', label: 'Lời nhắn' },
  { id: 'la-so', label: 'Lá số gốc' },
  { id: 'do-tin-cay', label: 'Độ tin cậy & cách tính' },
];

function PalaceStoryView({ r, canRate, chartId }: { r: PalaceView; canRate?: boolean; chartId?: string }) {
  const st = r.story;
  return (
    <article className="story" id={`cung-${r.branch}`}>
      <p className="eyebrow">
        <T name={`Cung ${r.palace}`}>Cung {r.palace}</T>
        {r.isBody && r.palace !== 'Mệnh' && <> · nơi cung Thân đóng</>}
      </p>
      <h3>{st.q}</h3>
      <p className="about">{st.about}</p>
      <p className="lead">{st.lead}</p>
      {r.locked ? (
        <p className="small muted" style={{ margin: 0 }}>
          🔒 Phần diễn giải đầy đủ — sao chính nói gì về bạn và vì sao, các sao đi kèm, kết luận, việc nên làm — có trong bản Pro.
        </p>
      ) : (
        <>
          <PalaceBody r={r} />
          <p className="small muted" style={{ marginTop: 12 }}>
            <b>Tự kiểm chứng:</b> {r.questions.join(' ')}
          </p>
          {canRate && chartId && <Rating chartId={chartId} section={`cung:${r.palace}`} />}
        </>
      )}
    </article>
  );
}

function ReportBody(p: ReportProps) {
  const { chart, reading, sensitivity, isPro, chartId } = p;
  const pro = (label: string) => (isPro ? null : <span className="pill pro">{label}</span>);
  const menhRate = rate(RATES.menhCombo[p.menhKey]);
  const thanName = chart.palaces[chart.thanBranch].name;
  const thanRate = rate(RATES.thanCu[thanName]);
  const byName = (n: string) => reading.palaces.find((x) => x.palace === n)!;
  const y0 = reading.years[0];
  const curMonth = y0?.months.find((m) => m.current);
  const curDv = reading.daiVan.find((d) => d.current);
  const sections = SECTIONS;

  const quick: { label: string; text: string; href: string; locked?: boolean }[] = [
    { label: 'Bạn là người', text: byName('Mệnh').story.lead, href: '#tinh-cach' },
    { label: 'Bạn làm việc tốt nhất khi', text: byName('Quan Lộc').story.lead, href: '#cong-viec', locked: byName('Quan Lộc').locked },
    { label: 'Tiền của bạn', text: byName('Tài Bạch').story.lead, href: '#cong-viec', locked: byName('Tài Bạch').locked },
    { label: 'Trong tình cảm', text: byName('Phu Thê').story.lead, href: '#gia-dinh', locked: byName('Phu Thê').locked },
    ...(y0 ? [{ label: `Năm ${y0.canChi}`, text: y0.summary.join(' '), href: '#nam-nay' }] : []),
    ...(curMonth
      ? [{ label: `${curMonth.label} (${curMonth.from.replace(/\/\d{4}$/, '')} – ${curMonth.to})`, text: `${curMonth.focus} ${curMonth.todo[0] ?? ''}`, href: '#thang-nay' }]
      : []),
    ...(curDv ? [{ label: `Chặng ${curDv.range[0]}–${curDv.range[1]} tuổi`, text: curDv.summary.split('. ')[0] + '.', href: '#dai-van' }] : []),
  ];

  return (
    <div className="wrap">
      <div style={{ padding: '28px 0 0' }}>
        <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', marginBottom: 8 }}>
          {chart.name ? `Lá số của ${chart.name}` : 'Lá số Tử Vi của bạn'}
        </h1>
        <p className="muted" style={{ marginBottom: 16 }}>
          {chart.gender === 'nam' ? 'Nam' : 'Nữ'}, sinh ngày {chart.birth.solar.day}/{chart.birth.solar.month}/{chart.birth.solar.year} dương lịch,
          tức {chart.birth.lunar.day}/{chart.birth.lunar.month}
          {chart.birth.lunar.leap ? ' (nhuận)' : ''} năm {chart.canChi.year}, giờ {chart.canChi.hour.split(' ')[1]}.{' '}
          {isPro ? <span className="pill pro">Pro</span> : <span className="pill">Free</span>}
        </p>
        {p.isNew && chartId && (
          <p className="note">Đã lưu. Link riêng của lá số này đã được gửi về email của bạn — ai có link đều xem được, hãy giữ kín.</p>
        )}
        {p.paymentReturn === 'ok' && !isPro && (
          <p className="note">Đang chờ xác nhận thanh toán. Trang sẽ mở khóa ngay khi cổng thanh toán báo về (thường dưới 1 phút) — hãy tải lại trang.</p>
        )}
        {p.paymentReturn === 'cancel' && <p className="alert">Bạn đã hủy thanh toán. Lá số vẫn được giữ nguyên.</p>}
        {!chartId && !p.adminPreview && (
          <p className="note">Chế độ xem nhanh: lá số được tính ngay trên máy bạn, không lưu gì trên máy chủ. Đóng tab là mất.</p>
        )}
        {chart.birth.warnings.map((w, i) => (
          <p key={i} className="alert">
            {w}
          </p>
        ))}
        {chart.calendarNote && <p className="alert">{chart.calendarNote}</p>}
      </div>

      <div className="report-grid">
        <nav className="toc no-print" aria-label="Mục lục">
          <b className="toc-title">Mục lục</b>
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.label}</a>
              </li>
            ))}
            {!isPro && (
              <li>
                <a href="#mo-khoa" className="toc-pro">
                  Mở khóa Pro
                </a>
              </li>
            )}
          </ol>
        </nav>

        <div className="report-main">
          <section id="doc-nhanh" className="section">
            {isPro && chartId && (
              <a className="book-cta no-print" href={`/la-so/${chartId}/luan-giai`}>
                <b>Bản luận giải trọn đời →</b>
                <span>Khoảng 14.000 chữ viết riêng cho lá số này, đọc như một cuốn sách: 12 khía cạnh, bức tranh liên cung, các giai đoạn đời, từng tháng năm nay, tổng kết và lời nhắn. In hoặc lưu PDF được.</span>
              </a>
            )}
            <h2>Đọc nhanh trong một phút</h2>
            <dl className="quick">
              {quick.map((q) => (
                <div key={q.label} className={q.locked ? 'is-locked' : undefined}>
                  <dt>{q.label}</dt>
                  <dd>
                    {q.text}{' '}
                    <a href={q.href} className="small">
                      {q.locked ? '🔒 đọc thêm' : 'đọc thêm'}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
            <details className="howto">
              <summary>Cách đọc trang này</summary>
              <ul>
                <li>Mỗi phần trả lời một câu hỏi đời thường. Câu in đậm đầu mỗi phần là câu trả lời ngắn; các đoạn bên dưới giải thích vì sao.</li>
                <li>Chữ có gạch chân chấm (ví dụ <T>Cung Mệnh</T>) có thể chạm vào để xem nghĩa.</li>
                <li>"Vì sao lá số nói vậy?" cho biết lá số căn cứ vào sao nào, ở đâu — để bạn tự kiểm tra, không phải tin suông.</li>
                <li>Tử Vi là một hệ thống văn hóa để tự suy ngẫm. Chưa có nghiên cứu nào chứng minh nó dự đoán được tương lai. Hãy đọc như một tấm gương, không phải bản án.</li>
              </ul>
            </details>
          </section>

          <section id="mo-dau" className="section">
            <h2>Mở đầu: bức chân dung</h2>
            <LifeOpening life={p.life} />
          </section>

          {SECTIONS.filter((s) => s.palaces).map((s) => (
            <section key={s.id} id={s.id} className="section">
              <h2>
                {s.label} {s.id !== 'tinh-cach' && pro('Pro')}
              </h2>
              <p className="section-intro">{s.intro}</p>
              {s.palaces!.map((n) => (
                <PalaceStoryView key={n} r={byName(n)} canRate={p.canRate} chartId={chartId} />
              ))}
              {s.palaces!.some((n) => byName(n).locked) && (
                <div className="locked" style={{ marginTop: 20 }}>
                  <p style={{ marginTop: 0 }}>
                    Bạn đang xem câu trả lời ngắn. Bản Pro mở phần diễn giải đầy đủ cho {s.palaces!.length > 1 ? `cả ${s.palaces!.length} cung` : 'cung'} ở phần
                    này: mỗi cung 4–6 đoạn giải thích bằng lời thường, kèm việc nên làm và căn cứ để bạn tự kiểm tra.
                  </p>
                  <a className="btn" href="#mo-khoa">
                    Mở khóa bản Pro
                  </a>
                </div>
              )}
            </section>
          ))}

          <section id="lien-cung" className="section">
            <h2>Bức tranh toàn cảnh: đọc các cung cùng nhau {pro('Pro')}</h2>
            <p className="section-intro">
              Đọc từng cung riêng lẻ giống như xem từng mảnh ghép. Phần này ghép các cung có liên hệ với nhau thành 4 "trục" để trả lời những câu
              hỏi lớn hơn: bạn tạo ra giá trị bằng cách nào, bạn trong và ngoài khác nhau ra sao, điều gì làm bạn căng và giúp bạn hồi lại, tiền
              của bạn có đọng lại thành tài sản không.
            </p>
            <LifeAxes life={p.life} />
          </section>

          <section id="dai-van" className="section">
            <h2>Các giai đoạn cuộc đời {pro('Pro: chặng hiện tại, sắp tới và sau nữa')}</h2>
            <p className="section-intro">
              Tử Vi chia đời người thành các chặng 10 năm (gọi là <T>Đại vận</T>). Mỗi chặng đi qua một cung trên lá số, và chủ đề của cung đó trở
              thành "khí hậu" của cả chặng. Bạn đang {reading.currentAge} tuổi âm. Với {chart.amDuong}, các chặng đi theo chiều{' '}
              {chart.daiVanForward ? 'thuận' : 'nghịch'} trên lá số.
            </p>
            <LifeStages life={p.life} />
            <details className="howto" style={{ marginTop: 24 }}>
              <summary>Xem toàn bộ các chặng 10 năm trong đời</summary>
            <ol className="timeline">
              {reading.daiVan.map((d) => (
                <li key={d.branch} className={d.current ? 'now' : ''}>
                  <div>
                    <span className="age">
                      {d.range[0]}–{d.range[1]} tuổi
                    </span>{' '}
                    · cung {d.palace} {d.current && <span className="pill">Đang ở chặng này</span>}
                  </div>
                  <p style={{ margin: '4px 0' }}>{d.summary}</p>
                  <DaiVanNotes d={d} />
                </li>
              ))}
            </ol>
            </details>
          </section>

          <section id="nam-nay" className="section">
            <h2>
              Năm nay và từng tháng {pro(`Pro: đầy đủ năm ${y0?.year} và ${y0 ? y0.year + 1 : ''}`)}
            </h2>
            {reading.years.map((y) => (
              <article key={y.year} className="story">
                <h3>
                  Năm {y.canChi} ({y.year})
                </h3>
                <YearBody y={y} />
              </article>
            ))}
            <p className="small muted">
              MệnhLab không đưa ra "năm hạn", "sao chiếu mệnh xấu" hay lời khuyên cúng giải. Xem <a href="/phuong-phap">lý do</a>.
            </p>
          </section>

          <section id="tong-ket" className="section">
            <h2>Tổng kết: dựa vào đâu, canh chừng gì, làm gì trước</h2>
            <LifeSummary life={p.life} />
          </section>

          <section id="loi-nhan" className="section">
            <h2>Lời nhắn</h2>
            <LifeClosing life={p.life} />
          </section>

          <section id="la-so" className="section">
            <h2>Lá số gốc</h2>
            <p className="section-intro">
              Đây là bảng lá số truyền thống: 12 ô là 12 cung (12 lĩnh vực đời sống), xếp quanh ô giữa ghi thông tin ngày sinh. Mỗi ô ghi tên cung,
              sao chính (chữ lớn), sao phụ, độ sáng trong ngoặc — M: sáng nhất, V: rất sáng, Đ: khá, B: trung bình, H: tối — và tuổi bắt đầu chặng
              10 năm ở góc dưới. Chạm vào một ô để đọc cung đó; chạm vào tên sao để xem nghĩa.
            </p>
            <ChartExplorer chart={chart} readings={reading.palaces} currentAge={reading.currentAge} chartId={chartId} canRate={p.canRate} />

            <h3 style={{ marginTop: 32 }}>Thông số lá số</h3>
            <div className="overview">
              {reading.overview.map((o) => (
                <div key={o.label}>
                  <div className="k">{o.term ? <T name={o.term}>{o.label}</T> : o.label}</div>
                  <div className="v">{o.value}</div>
                  <div className="e">{o.explain}</div>
                </div>
              ))}
            </div>
            {menhRate !== undefined && (
              <p className="note" style={{ marginTop: 16 }}>
                <b>Bạn có "độc nhất" không?</b> Khoảng {fmtPct(menhRate)} số người có cung Mệnh với bộ sao như bạn ({oneIn(menhRate)}); {fmtPct(thanRate)}{' '}
                có cung Thân ở {thanName}. Nghĩa là những gì viết về cung Mệnh của bạn cũng đúng cho hàng triệu người Việt khác — lá số không "độc
                nhất" như nhiều nơi quảng cáo. <a href="/nghien-cuu#ty-le-nen">Cách tính</a>.
              </p>
            )}

            <h3 style={{ marginTop: 32 }}>Cách cục: các bộ sao có tên trong sách</h3>
            <p className="muted">
              Sách cổ đặt tên cho một số bộ sao đặc biệt. Mỗi cách dưới đây ghi rõ từng điều kiện và lá số của bạn đạt điều kiện nào, kèm tỷ lệ người có
              cách đó — để bạn biết nó hiếm hay phổ biến. Việc sách xếp cách "tốt" hay "xấu" là quy ước cổ; chưa có dữ liệu cho thấy người có cách tốt
              thành công hơn.
            </p>
            {p.patterns.length === 0 ? (
              <p>
                Lá số này không có cách cục nào trong danh sách {Object.keys(RATES.patterns).length || 20} cách phổ biến MệnhLab kiểm tra. Điều đó hoàn
                toàn bình thường.
              </p>
            ) : (
              p.patterns.map((x) => {
                const r = RATES.patterns[x.id];
                const pr = r ? rate(r.du) : undefined;
                return (
                  <article key={x.id} className="reading">
                    <h3>
                      {x.name}{' '}
                      <span className={`pill${x.status === 'du' ? '' : ' pro'}`}>{x.status === 'du' ? 'Đủ điều kiện' : 'Gần đủ — thiếu 1 điều kiện'}</span>{' '}
                      <span className="small muted" style={{ fontWeight: 400 }}>
                        Sách xếp: {x.tone}
                        {pr !== undefined ? ` · có ở ${fmtPct(pr)} số lá số` : ''}
                      </span>
                    </h3>
                    <p className="prose">{x.meaning}</p>
                    <ul className="steps small">
                      {x.conditions.map((c, i) => (
                        <li key={i} style={{ listStyle: 'none', marginLeft: -20 }}>
                          {c.ok ? '✓' : '✗'} {c.text}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })
            )}
          </section>

          <section id="do-tin-cay" className="section">
            <h2>Độ tin cậy và cách tính</h2>
            <p className="section-intro">
              Hai câu hỏi một người tỉnh táo nên hỏi: nếu giờ sinh lệch một chút thì lá số có đổi không, và lá số được tính ra sao? Phần này trả lời cả
              hai.
            </p>
            <h3>Nếu giờ sinh lệch một chút thì sao?</h3>
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
            <h3 style={{ marginTop: 32 }}>Lá số của bạn được tính thế nào</h3>
            <details className="howto">
              <summary>Xem từng bước tính, dùng chính dữ liệu của bạn</summary>
        <p className="muted">
          Lá số Tử Vi là một phép tính có quy tắc — ai cũng kiểm lại được bằng giấy bút. Dưới đây là từng bước, dùng chính dữ liệu của bạn. Dấu
          ✓ nghĩa là kết quả tính tay khớp với lá số máy tính đã an.
        </p>
        <h4>Bước 0. Từ ngày giờ đồng hồ đến ngày giờ âm lịch</h4>
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
        {p.derivation.map((st, i) => (
          <div key={i}>
            <h4>
              Bước {i + 1}. {st.title} {st.check === true && <span className="pill">✓ khớp lá số</span>}
              {st.check === false && <span className="pill pro">chưa khớp — vui lòng báo lỗi</span>}
            </h4>
            <div className="prose">
              {st.lines.map((l, j) => (
                <p key={j}>{l}</p>
              ))}
            </div>
            {st.terms && (
              <p className="small muted">
                Thuật ngữ:{' '}
                {st.terms.map((t, j) => (
                  <span key={t}>
                    {j > 0 && ', '}
                    <T name={t}>{t}</T>
                  </span>
                ))}
              </p>
            )}
          </div>
        ))}
        <p className="small">
          Muốn hiểu sâu hơn? Xem loạt bài <a href="/hoc">Học đọc lá số</a>.
        </p>
        <h4>Hai trường phái độ sáng</h4>
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
            </details>
          </section>

      {!isPro && (
        <section id="mo-khoa" className="section">
          <h2>Mở khóa bản Pro</h2>
          <div className="plans">
            <div className="panel plan">
              <h3>Đang có (Free)</h3>
              <ul>
                <li>Lá số đầy đủ, giải thích mọi thuật ngữ</li>
                <li>Đọc nhanh, diễn giải đầy đủ phần tính cách (cung Mệnh); câu trả lời ngắn cho 11 cung còn lại</li>
                <li>Tóm tắt năm nay, chi tiết tháng hiện tại; các chặng 10 năm; độ nhạy giờ sinh</li>
              </ul>
            </div>
            <div className="panel plan featured">
              <h3>Pro cho lá số này</h3>
              <p className="price">{vnd(config.pricePro)}</p>
              <p className="small muted">Thanh toán một lần, không gia hạn tự động.</p>
              <ul>
                <li>Diễn giải đầy đủ 11 cung còn lại bằng lời thường: công việc, tiền bạc, tình cảm, gia đình, sức khỏe — mỗi cung kèm việc nên làm và căn cứ</li>
                <li>Từng chặng 10 năm: cơ hội đến từ đâu, chuyện gì cần chuẩn bị</li>
                <li>Năm nay và năm sau: tiền đến từ đâu, dễ hao ở đâu, sức khỏe, tình cảm — và từng tháng nên làm gì</li>
                <li>Bản luận giải trọn đời viết riêng cho bạn, đọc như một cuốn sách (in hoặc lưu PDF được)</li>
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



      <section className="section no-print" style={{ marginTop: 48, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {isPro && <PrintButton />}
        {p.adminPreview && <span className="small muted">Bản xem thử: không có nút xóa dữ liệu vì không lưu gì.</span>}
        {chartId && <DeleteData chartId={chartId} />}
      </section>
        </div>
      </div>
    </div>
  );
}
