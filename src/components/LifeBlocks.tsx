/** Các khối của bản "Luận giải trọn đời": mở đầu, liên cung, giai đoạn, tổng kết, lời nhắn. */
import type { LifeReport } from '@/lib/lifeReport';

function ProLock({ text }: { text: string }) {
  return (
    <div className="locked" style={{ marginTop: 16 }}>
      <p style={{ marginTop: 0 }}>{text}</p>
      <a className="btn" href="#mo-khoa">
        Mở khóa bản Pro
      </a>
    </div>
  );
}

export function LifeOpening({ life }: { life: LifeReport }) {
  return (
    <>
      <div className="story-body portrait">
        {life.portrait.map((t, i) => (
          <p key={i} className={i === 0 ? 'portrait-lead' : undefined}>
            {t}
          </p>
        ))}
      </div>
      <h3 style={{ marginTop: 24 }}>Nền tảng lá số, nói bằng lời thường</h3>
      <div className="story-body">
        {life.foundation.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
      {life.locked && <ProLock text="Bản Pro có thêm đoạn chân dung thứ hai: chặng đời bạn đang đi, hướng phát triển hợp nhất và một nguyên tắc nên nhớ." />}
    </>
  );
}

export function LifeAxes({ life }: { life: LifeReport }) {
  return (
    <>
      {life.axes.map((a, i) => (
        <article key={i} className="story">
          <p className="eyebrow">Trục {i + 1}</p>
          <h3>{a.title}</h3>
          {a.locked ? (
            <p className="small muted" style={{ margin: 0 }}>
              🔒 Phần phân tích trục này có trong bản Pro.
            </p>
          ) : (
            <>
              <p className="story-body" style={{ lineHeight: 1.75 }}>
                {a.text}
              </p>
              {a.move && (
                <div className="advice-box">
                  <b>Gợi ý chiến lược</b>
                  <p style={{ margin: '6px 0 0' }}>{a.move}</p>
                </div>
              )}
            </>
          )}
        </article>
      ))}
      {life.locked && <ProLock text="Bản Pro mở cả 4 trục liên cung: cách bạn tạo ra giá trị, con người trong và ngoài, áp lực và hồi phục, tiền có đọng lại thành tài sản không." />}
    </>
  );
}

export function LifeStages({ life }: { life: LifeReport }) {
  return (
    <>
      {life.stages.map((s) => (
        <article key={s.key} className={`story stage stage-${s.key}`}>
          <p className="eyebrow">{s.label}</p>
          <h3>
            {s.range[0]}–{s.range[1]} tuổi · cung {s.palace}
          </h3>
          <div className="story-body">
            {s.paras.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
          {s.aspects.length > 0 && (
            <dl className="aspects">
              {s.aspects.map((a) => (
                <div key={a.label}>
                  <dt>{a.label}</dt>
                  <dd>{a.text}</dd>
                </div>
              ))}
            </dl>
          )}
          {s.note && <p className="verdict">{s.note}</p>}
          {s.locked && (
            <p className="small muted" style={{ margin: 0 }}>
              🔒 Phần đọc chi tiết chặng này (cơ hội, chỗ cần chuẩn bị, 4 mặt công việc – tiền – tình cảm – sức khỏe) có trong bản Pro.
            </p>
          )}
        </article>
      ))}
    </>
  );
}

export function LifeSummary({ life }: { life: LifeReport }) {
  return (
    <>
      <h3>3 đòn bẩy nên dựa vào</h3>
      <p className="small muted" style={{ marginTop: 0 }}>
        Ba lĩnh vực được lá số nâng đỡ nhiều nhất (tính theo số yếu tố hỗ trợ trừ yếu tố gây khó).
      </p>
      <ol className="levers">
        {life.levers.map((l) => (
          <li key={l.palace} className="story">
            <h4>{l.title}</h4>
            {l.strength ? (
              <dl className="aspects">
                <div>
                  <dt>Thế mạnh</dt>
                  <dd>{l.strength}</dd>
                </div>
                <div>
                  <dt>Phát huy khi</dt>
                  <dd>{l.condition}</dd>
                </div>
                <div>
                  <dt>Việc đầu tiên</dt>
                  <dd>{l.first}</dd>
                </div>
                <div>
                  <dt>Dấu hiệu đang đi đúng</dt>
                  <dd>{l.sign}</dd>
                </div>
              </dl>
            ) : (
              <p className="small muted" style={{ margin: 0 }}>
                🔒 Chi tiết có trong bản Pro.
              </p>
            )}
          </li>
        ))}
      </ol>

      <h3>3 điểm mù cần canh</h3>
      <p className="small muted" style={{ marginTop: 0 }}>
        Nơi Hóa Kỵ năm sinh đóng và những lĩnh vực có nhiều thử thách nhất. Biết trước để chủ động, không phải để lo.
      </p>
      <ol className="levers">
        {life.blinds.map((b) => (
          <li key={b.palace} className="story blind">
            <h4>{b.title}</h4>
            {b.trigger ? (
              <dl className="aspects">
                <div>
                  <dt>Khi nào dễ xảy ra</dt>
                  <dd>{b.trigger}</dd>
                </div>
                <div>
                  <dt>Bạn hay phản ứng</dt>
                  <dd>{b.reaction}</dd>
                </div>
                <div>
                  <dt>Hệ quả</dt>
                  <dd>{b.consequence}</dd>
                </div>
                <div>
                  <dt>Dấu hiệu sớm</dt>
                  <dd>{b.early}</dd>
                </div>
                <div>
                  <dt>Cách xử lý</dt>
                  <dd>{b.fix}</dd>
                </div>
              </dl>
            ) : (
              <p className="small muted" style={{ margin: 0 }}>
                🔒 Chi tiết có trong bản Pro.
              </p>
            )}
          </li>
        ))}
      </ol>

      {life.order.length > 0 && (
        <>
          <h3>Thứ tự hành động</h3>
          <ol className="order">
            {life.order.map((o) => (
              <li key={o.label}>
                <b>{o.label}:</b> {o.text}
              </li>
            ))}
          </ol>
        </>
      )}

      <h3>3 điều đặc biệt nhất trong lá số</h3>
      <p className="small muted" style={{ marginTop: 0 }}>
        Không phải khen chung chung: đây là ba đặc điểm hiếm nhất trên lá số của bạn, so với 24.000 lá số mô phỏng. Con số cho biết bao nhiêu người
        cũng có điều đó.
      </p>
      {life.specials.map((s, i) => (
        <article key={i} className="story special">
          <p className="eyebrow">Điều đặc biệt {i + 1}</p>
          <h4>{s.title}</h4>
          <p className="rarity">{s.rarity}</p>
          {s.locked ? (
            <p className="small muted" style={{ margin: 0 }}>
              🔒 Ý nghĩa và cách phát huy có trong bản Pro.
            </p>
          ) : (
            <>
              <p className="story-body">{s.text}</p>
              <p>
                <b>Cách phát huy:</b> {s.how}
              </p>
            </>
          )}
        </article>
      ))}
      {life.locked && <ProLock text="Bản Pro mở đầy đủ 3 đòn bẩy, 3 điểm mù, thứ tự hành động và ý nghĩa của 3 điều đặc biệt nhất trong lá số của bạn." />}
    </>
  );
}

export function LifeClosing({ life }: { life: LifeReport }) {
  if (!life.letter.length) return <ProLock text="Lời nhắn riêng dành cho bạn — tổng hợp thế mạnh, chặng đời hiện tại và việc đáng làm nhất năm nay — có trong bản Pro." />;
  return (
    <div className="letter">
      {life.letter.map((t, i) => (
        <p key={i} className={i === 0 ? 'letter-hi' : undefined}>
          {t}
        </p>
      ))}
    </div>
  );
}
