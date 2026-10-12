/** Khối hiển thị luận giải dạng dễ đọc: dùng chung cho bảng cung (ChartExplorer) và trang lá số. */
import type { PalaceReading, YearReading, DaiVanReading } from '@/lib/reading';

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

export function PalaceBody({ r }: { r: PalaceReading }) {
  return (
    <div className="plain">
      <p className="plain-summary">{r.summary}</p>
      {r.strengths.length > 0 && (
        <>
          <h4>Thuận lợi</h4>
          <List items={r.strengths} mark="+" />
        </>
      )}
      {r.cautions.length > 0 && (
        <>
          <h4>Cần để ý</h4>
          <List items={r.cautions} mark="!" />
        </>
      )}
      {r.advice.length > 0 && (
        <>
          <h4>Nên làm</h4>
          <List items={r.advice} mark="→" />
        </>
      )}
      <details className="evidence">
        <summary>Vì sao? Căn cứ trên lá số</summary>
        <ul>
          {r.evidence.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}

export function YearBody({ y }: { y: YearReading }) {
  return (
    <div className="plain">
      <div className="year-summary">
        {y.summary.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>

      <h4>Tiền bạc</h4>
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

      {y.locked ? (
        <div className="locked" style={{ marginTop: 16 }}>
          <p style={{ marginTop: 0 }}>
            🔒 Bản Pro có thêm: tiền dễ hao ở đâu và cách chặn, công việc, tình cảm, gia đình, sức khỏe, danh sách việc nên làm cho năm nay và
            năm sau.
          </p>
          <a className="btn" href="#mo-khoa">
            Mở khóa bản Pro
          </a>
        </div>
      ) : (
        <>
          <h4>Công việc</h4>
          <List items={y.work} mark="•" />
          <h4>Tình cảm</h4>
          <List items={y.love} mark="•" />
          <h4>Gia đình</h4>
          <List items={y.family} mark="•" />
          <h4>Sức khỏe</h4>
          <List items={y.health} mark="•" />
          {y.actions.length > 0 && (
            <div className="actions-box">
              <b>Việc nên làm trong năm {y.year}</b>
              <ol>
                {y.actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ol>
            </div>
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
