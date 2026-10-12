'use client';

/**
 * Công cụ chỉnh giờ sinh. Toàn bộ tính toán chạy trong trình duyệt — không gửi dữ liệu lên máy chủ.
 */
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CANH_GIO } from '@/lib/engine/canchi';
import { DEFAULT_CONVENTIONS, lunarOrSolarValid } from './validate';
import {
  EVENT_KINDS,
  candidateCharts,
  rectify,
  traitDescriptions,
  type EventKind,
  type LifeEvent,
  type TraitDescription,
} from '@/lib/engine/rectify';
import { DRAFT_KEY } from '@/components/BirthForm';

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const DAY = [3, 4, 5, 6, 7, 8, 9]; // Dần → Dậu: khoảng 03:00–19:00
const NIGHT = [10, 11, 0, 1, 2]; // Tuất → Dần đầu: khoảng 19:00–05:00

type Row = { kind: EventKind | ''; year: string };

export default function RectifyTool() {
  const router = useRouter();
  const [gender, setGender] = useState<'nam' | 'nu' | ''>('');
  const [calendar, setCalendar] = useState<'duong' | 'am'>('duong');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [leapMonth, setLeapMonth] = useState(false);
  const [branches, setBranches] = useState<number[]>(range(0, 11));
  const [descs, setDescs] = useState<TraitDescription[] | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [rows, setRows] = useState<Row[]>([
    { kind: '', year: '' },
    { kind: '', year: '' },
    { kind: '', year: '' },
  ]);
  const [result, setResult] = useState<ReturnType<typeof rectify> | null>(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState<number | null>(null);

  const base = useMemo(() => {
    if (!gender || !day || !month || !year) return null;
    return { gender, calendar, day: +day, month: +month, year: +year, leapMonth: calendar === 'am' && leapMonth, place: 'HCM' } as const;
  }, [gender, calendar, day, month, year, leapMonth]);

  const toggle = (b: number) => setBranches((x) => (x.includes(b) ? x.filter((y) => y !== b) : [...x, b].sort((p, q) => p - q)));

  function step2() {
    setError('');
    setResult(null);
    if (!base) return setError('Vui lòng điền giới tính và ngày sinh.');
    const v = lunarOrSolarValid(base);
    if (v) return setError(v);
    if (branches.length < 2) return setError('Chọn ít nhất 2 canh giờ có thể.');
    setDescs(traitDescriptions(candidateCharts(base, branches, DEFAULT_CONVENTIONS)));
  }

  const events: LifeEvent[] = rows
    .filter((r) => r.kind && /^\d{4}$/.test(r.year))
    .map((r) => ({ kind: r.kind as EventKind, year: +r.year }));

  function analyze() {
    setError('');
    if (!base) return;
    if (events.length < 3) return setError('Cần ít nhất 3 sự kiện có năm. Càng nhiều sự kiện (5–8), kết quả càng đáng tin.');
    setResult(rectify(base, branches, events, ratings, DEFAULT_CONVENTIONS));
    setTimeout(() => document.getElementById('ket-qua')?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  function openChart(b: number) {
    if (!base) return;
    sessionStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        input: { ...base, timeType: 'branch', branch: b, certainty: 'khoang-120' },
        conventions: DEFAULT_CONVENTIONS,
      }),
    );
    router.push('/xem');
  }

  return (
    <div>
      <section className="panel" style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0 }}>Bước 1. Thông tin sinh bạn biết chắc</h2>
        <div className="field">
          <span className="legend" id="rg">
            Giới tính
          </span>
          <div className="seg" role="radiogroup" aria-labelledby="rg">
            {(['nam', 'nu'] as const).map((g) => (
              <label key={g}>
                <input type="radio" name="rgender" checked={gender === g} onChange={() => setGender(g)} />
                {g === 'nam' ? 'Nam' : 'Nữ'}
              </label>
            ))}
          </div>
        </div>
        <div className="field">
          <span className="legend" id="rc">
            Ngày sinh theo
          </span>
          <div className="seg" role="radiogroup" aria-labelledby="rc">
            <label>
              <input type="radio" name="rcal" checked={calendar === 'duong'} onChange={() => setCalendar('duong')} />
              Dương lịch
            </label>
            <label>
              <input type="radio" name="rcal" checked={calendar === 'am'} onChange={() => setCalendar('am')} />
              Âm lịch
            </label>
          </div>
        </div>
        <div className="row">
          <div className="field">
            <label htmlFor="rd">Ngày</label>
            <select id="rd" value={day} onChange={(e) => setDay(e.target.value)}>
              <option value="">—</option>
              {range(1, calendar === 'am' ? 30 : 31).map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="rm">Tháng</label>
            <select id="rm" value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">—</option>
              {range(1, 12).map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="ry">Năm</label>
            <input id="ry" type="number" inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value)} placeholder="1990" />
          </div>
        </div>
        {calendar === 'am' && (
          <label className="check">
            <input type="checkbox" checked={leapMonth} onChange={(e) => setLeapMonth(e.target.checked)} />
            <span>Sinh vào tháng nhuận</span>
          </label>
        )}

        <div className="field">
          <span className="legend">Những canh giờ có thể (bỏ chọn giờ chắc chắn không phải)</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <button type="button" className="btn ghost" onClick={() => setBranches(range(0, 11))}>
              Không biết gì
            </button>
            <button type="button" className="btn ghost" onClick={() => setBranches(DAY)}>
              Sinh ban ngày
            </button>
            <button type="button" className="btn ghost" onClick={() => setBranches(NIGHT)}>
              Sinh ban đêm
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 4 }}>
            {CANH_GIO.map((c) => (
              <label key={c.index} className="check" style={{ marginBottom: 4 }}>
                <input type="checkbox" checked={branches.includes(c.index)} onChange={() => toggle(c.index)} />
                <span>
                  Giờ {c.name} ({c.range})
                </span>
              </label>
            ))}
          </div>
        </div>
        <button type="button" className="btn" onClick={step2}>
          Tiếp tục
        </button>
      </section>

      {descs && (
        <>
          <section className="panel" style={{ marginBottom: 24 }}>
            <h2 style={{ marginTop: 0 }}>Bước 2. Mô tả nào giống bạn? (không bắt buộc)</h2>
            <p className="small muted">
              Mỗi mô tả ứng với cung Mệnh của một hoặc vài canh giờ. Tên sao được ẩn và thứ tự được xáo để bạn không bị dẫn dắt. Hầu hết
              mô tả nghe đều "hơi đúng" — hãy chấm <b>tương đối</b>: cái nào giống bạn hơn cái nào. Tốt nhất nhờ một người thân hiểu bạn chấm
              cùng.
            </p>
            {descs.map((d) => (
              <div key={d.id} className="reading">
                <h3>Mô tả {d.letter}</h3>
                <p className="prose" style={{ marginBottom: 8 }}>
                  {d.text}
                </p>
                <div className="rate">
                  <span>Giống bạn đến đâu?</span>
                  {['Không giống', 'Ít', 'Một phần', 'Khá giống', 'Rất giống'].map((l, i) => (
                    <button
                      key={l}
                      type="button"
                      aria-pressed={ratings[d.id] === i + 1}
                      onClick={() => setRatings((r) => ({ ...r, [d.id]: i + 1 }))}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className="panel" style={{ marginBottom: 24 }}>
            <h2 style={{ marginTop: 0 }}>Bước 3. Những sự kiện lớn trong đời và năm xảy ra</h2>
            <p className="small muted">
              Chỉ nhập sự kiện bạn nhớ chắc năm (năm dương lịch). Nhập ít nhất 3, tốt nhất 5–8. Mỗi lần sinh con, đổi việc... là một dòng
              riêng. Không cần ghi chi tiết.
            </p>
            {rows.map((r, i) => (
              <div key={i} className="row" style={{ gridTemplateColumns: 'minmax(0,3fr) minmax(0,1fr) auto', alignItems: 'end' }}>
                <div className="field">
                  <label htmlFor={`ek${i}`}>Sự kiện {i + 1}</label>
                  <select id={`ek${i}`} value={r.kind} onChange={(e) => setRows((x) => x.map((y, j) => (j === i ? { ...y, kind: e.target.value as EventKind } : y)))}>
                    <option value="">— Chọn loại sự kiện —</option>
                    {(Object.keys(EVENT_KINDS) as EventKind[]).map((k) => (
                      <option key={k} value={k}>
                        {EVENT_KINDS[k].label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor={`ey${i}`}>Năm</label>
                  <input id={`ey${i}`} type="number" inputMode="numeric" value={r.year} onChange={(e) => setRows((x) => x.map((y, j) => (j === i ? { ...y, year: e.target.value } : y)))} placeholder="2015" />
                </div>
                <div className="field">
                  <button type="button" className="btn ghost" aria-label={`Xóa sự kiện ${i + 1}`} onClick={() => setRows((x) => x.filter((_, j) => j !== i))}>
                    Xóa
                  </button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button type="button" className="btn ghost" onClick={() => setRows((x) => [...x, { kind: '', year: '' }])}>
                Thêm sự kiện
              </button>
              <button type="button" className="btn" onClick={analyze}>
                Phân tích {events.length} sự kiện
              </button>
            </div>
          </section>
        </>
      )}

      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      {result && (
        <section id="ket-qua" className="section">
          <h2>Kết quả</h2>
          {result.warnings.map((w, i) => (
            <p key={i} className="alert">
              {w}
            </p>
          ))}
          <div className={result.verdict === 'chua-du' ? 'alert' : 'note'}>
            {result.verdict === 'kha-ro' && (
              <p style={{ margin: 0 }}>
                <b>Khá rõ: {result.candidates[0].label}</b> phù hợp với dữ kiện của bạn hơn hẳn các giờ khác (hơn ứng viên thứ hai{' '}
                {result.gap.toLocaleString('vi-VN')} điểm). Với dữ kiện ngẫu nhiên, khoảng cách này chỉ xảy ra khoảng{' '}
                {Math.max(1, Math.round((Number.isNaN(result.noiseRate) ? 0.05 : result.noiseRate) * 100))}% số lần.
              </p>
            )}
            {result.verdict === 'nghieng' && (
              <p style={{ margin: 0 }}>
                <b>Nghiêng về {result.candidates[0].label}</b>, nhưng chưa tách biệt hẳn (hơn ứng viên thứ hai {result.gap.toLocaleString('vi-VN')}{' '}
                điểm). Dữ kiện ngẫu nhiên cũng cho khoảng cách như vậy khoảng{' '}
                {Math.round((Number.isNaN(result.noiseRate) ? 0.2 : result.noiseRate) * 100)}% số lần. Thêm sự kiện để chắc hơn.
              </p>
            )}
            {result.verdict === 'chua-du' && (
              <p style={{ margin: 0 }}>
                <b>Chưa đủ để phân biệt.</b> Các canh giờ có điểm quá sát nhau (chênh {result.gap.toLocaleString('vi-VN')} điểm) — mức chênh mà
                dữ kiện ngẫu nhiên cũng thường tạo ra. Hãy thêm sự kiện, bỏ bớt canh giờ chắc chắn không phải, hoặc tìm giấy tờ ghi giờ sinh.
              </p>
            )}
          </div>

          <table className="simple" style={{ marginTop: 16 }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Canh giờ</th>
                <th>Chính tinh thủ Mệnh</th>
                <th>Sự kiện</th>
                <th>Tính cách</th>
                <th>Tổng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {result.candidates.map((c, i) => (
                <tr key={c.branch}>
                  <td>{i + 1}</td>
                  <td>{c.label}</td>
                  <td>{c.menhMajors.join(', ') || '—'}</td>
                  <td>{c.eventScore.toLocaleString('vi-VN')}</td>
                  <td>{c.traitScore ? (c.traitScore > 0 ? '+' : '') + c.traitScore.toLocaleString('vi-VN') : '0'}</td>
                  <td>
                    <b>{c.total.toLocaleString('vi-VN')}</b>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button type="button" className="term small" onClick={() => setOpen(open === c.branch ? null : c.branch)}>
                      {open === c.branch ? 'Ẩn lý do' : 'Vì sao?'}
                    </button>{' '}
                    <button type="button" className="term small" onClick={() => openChart(c.branch)}>
                      Lập lá số
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {open !== null && (
            <div className="evidence" style={{ marginTop: 12 }}>
              <b>{result.candidates.find((c) => c.branch === open)!.label}: cách tính điểm</b>
              <ul>
                {result.candidates
                  .find((c) => c.branch === open)!
                  .details.map((d, i) => (
                    <li key={i}>
                      {EVENT_KINDS[d.event.kind].label} ({d.event.year}): <b>{d.points.toLocaleString('vi-VN')} điểm</b> — {d.reasons.join('; ')}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <p style={{ marginTop: 20 }}>
            <button type="button" className="btn" onClick={() => openChart(result.candidates[0].branch)}>
              Lập lá số với {result.candidates[0].label}
            </button>
          </p>
          <p className="small muted">
            Lá số sẽ ghi giờ sinh là ước lượng, và phần Độ nhạy giờ sinh sẽ cho xem cả hai canh giờ liền kề. Kết quả này là giả thuyết phù
            hợp nhất với dữ kiện theo quy tắc cổ điển — không phải bằng chứng về giờ sinh thật của bạn.
          </p>
        </section>
      )}
    </div>
  );
}
