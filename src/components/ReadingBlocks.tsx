/** Khối hiển thị luận giải dạng dễ đọc: dùng chung cho bảng cung (ChartExplorer) và trang lá số. */
import type { PalaceReading, YearReading, DaiVanReading, MonthReading } from '@/lib/reading';

function List({ items, mark }: { items: string[]; mark: string }) {
  if (!items.length) return null;
  return (
    <ul className="plain-list">
      {items.map((t, i) => (
        <li key={i}>
          <span aria-hidden="true" className="mark">
            {mark}
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Phần thân của một cung: văn xuôi diễn giải → biểu hiện đời thường → yếu tố đi kèm → kết luận → nên làm → vì sao. */
export function PalaceBody({ r, compact }: { r: PalaceReading; compact?: boolean }) {
  const st = r.story;
  return (
    <div className="plain story-body">
      {st.paras.map((t, i) => (
        <p key={i} className={i === 0 ? 'story-first' : undefined}>
          {t}
        </p>
      ))}
      {st.daily.length > 0 && (
        <div className="daily">
          <b>Có thể bạn nhận ra mình ở những điều này:</b>
          <List items={st.daily} mark="·" />
        </div>
      )}
      {st.extras.length > 0 && (
        <>
          <h4>Những sao đi kèm nói thêm gì</h4>
          {!compact && (
            <p className="small muted" style={{ marginTop: 0 }}>
              Ngoài sao chính, mỗi cung còn có các sao phụ — như gia vị làm rõ thêm bức tranh. Dấu + là yếu tố hỗ trợ, dấu − là yếu tố cần để ý.
            </p>
          )}
          <ul className="plain-list extras">
            {st.extras.map((e, i) => (
              <li key={i} className={e.good ? 'good' : 'bad'}>
                <span aria-hidden="true" className="mark">
                  {e.good ? '+' : '−'}
                </span>
                {e.text}
              </li>
            ))}
          </ul>
        </>
      )}
      {st.verdict && <p className="verdict">{st.verdict}</p>}
      {r.advice.length > 0 && (
        <div className="advice-box">
          <b>Nên làm</b>
          <List items={r.advice} mark="→" />
        </div>
      )}
      <details className="evidence">
        <summary>Vì sao lá số nói vậy?</summary>
        <ul>
          {st.why.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
        {r.evidence.length > 0 && (
          <p className="small muted" style={{ margin: '8px 0 0' }}>
            Ký hiệu kỹ thuật: {r.evidence.join(' · ')}
          </p>
        )}
      </details>
    </div>
  );
}

const TONE: Record<MonthReading['tone'], { label: string; cls: string }> = {
  thuan: { label: 'Thuận', cls: 'tone-thuan' },
  binh: { label: 'Bình thường', cls: 'tone-binh' },
  'can-trong': { label: 'Làm chắc', cls: 'tone-can' },
};

function MonthCard({ m }: { m: MonthReading }) {
  const t = TONE[m.tone];
  const head = (
    <div className="month-head">
      <span className="month-name">{m.label}</span>
      <span className="month-date">
        {m.from.replace(/\/\d{4}$/, '')} – {m.to}
      </span>
      <span className={`tone ${t.cls}`}>{t.label}</span>
      {m.current && <span className="tone tone-now">Tháng này</span>}
    </div>
  );
  if (m.locked) {
    return (
      <div className={`month-card locked-month${m.past ? ' past' : ''}`}>
        {head}
        <p className="small muted" style={{ margin: '6px 0 0' }}>
          {m.focus} 🔒 Việc nên làm, nên tránh của tháng có trong bản Pro.
        </p>
      </div>
    );
  }
  const body = (
    <>
      <p className="month-focus">{m.focus}</p>
      {m.todo.length > 0 && (
        <>
          <b className="small">Nên làm</b>
          <List items={m.todo} mark="→" />
        </>
      )}
      {m.avoid.length > 0 && (
        <>
          <b className="small">Nên tránh</b>
          <List items={m.avoid} mark="−" />
        </>
      )}
      {m.money && <p className="small month-money">💰 {m.money}</p>}
      {m.note && <p className="small muted">{m.note}</p>}
      {m.evidence.length > 0 && (
        <details className="evidence">
          <summary>Vì sao?</summary>
          <ul>
            {m.evidence.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
  if (m.past) {
    return (
      <details className="month-card past">
        <summary>
          {head}
          <span className="small muted">Đã qua — mở ra để đối chiếu với điều đã xảy ra</span>
        </summary>
        {body}
      </details>
    );
  }
  return (
    <div className={`month-card${m.current ? ' current' : ''}`} id={m.current ? 'thang-nay' : undefined}>
      {head}
      {body}
    </div>
  );
}

export function MonthsBlock({ y }: { y: YearReading }) {
  if (!y.months?.length) return null;
  return (
    <div className="months">
      <h4>Tháng nào nên làm gì (năm {y.canChi}, theo tháng âm lịch)</h4>
      <div className="year-summary" style={{ marginBottom: 12 }}>
        {y.monthHighlights.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
      <p className="small muted" style={{ marginTop: 0 }}>
        Mỗi tháng âm lịch ứng với một cung trên lá số (
        <button type="button" className="term" data-term="Lưu nguyệt">
          lưu nguyệt
        </button>
        ). "Thuận" nghĩa là có nhiều tín hiệu hỗ trợ rơi vào cung đó; "Làm chắc"
        nghĩa là có tín hiệu vướng mắc — không phải điềm xấu, chỉ là nên chuẩn bị kỹ hơn. Bấm "Vì sao?" để xem cách tính điểm.
      </p>
      <details className="howto" style={{ margin: '0 0 12px' }} open>
        <summary>Bảng tra nhanh 12 tháng</summary>
        <div className="table-scroll">
          <table className="simple month-table">
            <thead>
              <tr>
                <th>Tháng</th>
                <th>Dương lịch</th>
                <th>Nhịp</th>
                <th>Chủ đề và việc nên làm</th>
              </tr>
            </thead>
            <tbody>
              {y.months.map((m) => (
                <tr key={`${m.month}${m.leap ? 'n' : ''}`} className={m.current ? 'is-current' : m.past ? 'is-past' : undefined}>
                  <td>{m.label.replace('Tháng ', '')}</td>
                  <td>
                    {m.from.replace(/\/\d{4}$/, '')}–{m.to.replace(/\/\d{4}$/, '')}
                  </td>
                  <td>
                    <span className={`tone ${TONE[m.tone].cls}`}>{TONE[m.tone].label}</span>
                  </td>
                  <td>
                    {m.focus.replace(/^Tháng (xoay quanh chuyện|thuận cho chuyện) /, '').replace(/ — .*$| nhưng .*$/, '').replace(/\.$/, '')}
                    {m.todo[0] ? ` — ${m.todo[0].split(':')[0].split(';')[0].replace(/\.$/, '')}` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <div className="month-grid">
        {y.months.map((m) => (
          <MonthCard key={`${m.month}${m.leap ? 'n' : ''}`} m={m} />
        ))}
      </div>
    </div>
  );
}

function Verdict({ v }: { v?: string }) {
  if (!v) return null;
  const cls = v === 'Thuận lợi' ? 'tone-thuan' : v === 'Cần làm chắc' || v === 'Nên ưu tiên' ? 'tone-can' : 'tone-binh';
  return <span className={`tone ${cls}`}>{v}</span>;
}

export function YearBody({ y }: { y: YearReading }) {
  return (
    <div className="plain">
      <div className="year-summary">
        {y.summary.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>

      {y.story.length > 0 && (
        <div className="story-body" style={{ marginTop: 12 }}>
          {y.story.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
      )}

      {y.hoaNotes?.length > 0 && (
        <>
          <h4>Bốn sao "đổi màu" trong năm và ý nghĩa với bạn</h4>
          <ul className="plain-list hoa-notes">
            {y.hoaNotes.map((h, i) => (
              <li key={i}>
                <span aria-hidden="true" className="mark">
                  {i === 3 ? '−' : '+'}
                </span>
                <span>
                  <b>{h.label}:</b> {h.text}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <h4>
        Tiền bạc năm nay <Verdict v={y.verdicts?.money} />
      </h4>
      <div className="money-grid">
        <div>
          <b>Tiền đến từ đâu</b>
          <List items={y.money.sources} mark="+" />
        </div>
        {y.money.leaks.length > 0 && (
          <div>
            <b>Dễ hao ở đâu</b>
            <List items={y.money.leaks} mark="−" />
          </div>
        )}
      </div>
      {y.money.todo.length > 0 && (
        <>
          <b>Nên làm với tiền</b>
          <List items={y.money.todo} mark="→" />
        </>
      )}

      <MonthsBlock y={y} />

      {y.locked ? (
        <div className="locked" style={{ marginTop: 16 }}>
          <p style={{ marginTop: 0 }}>
            🔒 Bản Pro có thêm: việc nên làm và nên tránh cho từng tháng, tiền dễ hao ở đâu và cách chặn, công việc, tình cảm, gia đình, sức
            khỏe, danh sách việc nên làm cho năm nay và năm sau.
          </p>
          <a className="btn" href="#mo-khoa">
            Mở khóa bản Pro
          </a>
        </div>
      ) : (
        <>
          <h4>
            Công việc <Verdict v={y.verdicts?.work} />
          </h4>
          <List items={y.work} mark="•" />
          <h4>
            Tình cảm <Verdict v={y.verdicts?.love} />
          </h4>
          <List items={y.love} mark="•" />
          <h4>Gia đình</h4>
          <List items={y.family} mark="•" />
          <h4>
            Sức khỏe <Verdict v={y.verdicts?.health} />
          </h4>
          <List items={y.health} mark="•" />
          {y.advice5?.length ? (
            <div className="actions-box">
              <b>5 lời khuyên cho năm {y.canChi}</b>
              <ol>
                {y.advice5.map((a, i) => (
                  <li key={i}>
                    <b>{a.kind}:</b> {a.text}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            y.actions.length > 0 && (
              <div className="actions-box">
                <b>Việc nên làm trong năm {y.year}</b>
                <ol>
                  {y.actions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ol>
              </div>
            )
          )}
          <details className="evidence">
            <summary>Vì sao? Căn cứ trên lá số</summary>
            <ul>
              {y.evidence.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </details>
        </>
      )}
    </div>
  );
}

export function DaiVanNotes({ d }: { d: DaiVanReading }) {
  if (!d.notes.length) return null;
  return (
    <>
      <List items={d.notes} mark="•" />
      {d.evidence.length > 0 && (
        <details className="evidence">
          <summary>Vì sao?</summary>
          <ul>
            {d.evidence.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}
