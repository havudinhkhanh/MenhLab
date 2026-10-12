'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CANH_GIO } from '@/lib/engine/canchi';
import { PLACES } from '@/lib/engine/places';
import { resolveBirth, BirthError, type BirthInput, type Conventions, type Certainty, type TimeMode } from '@/lib/engine/birth';
import { CONSENT_TEXT } from '@/lib/config';

export const DRAFT_KEY = 'menhlab:draft';

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

export default function BirthForm({
  onPreview,
  submitLabel,
}: {
  /** Chế độ xem thử (trang quản trị): bỏ phần email/đồng ý, trả dữ liệu cho trang gọi thay vì chuyển trang. */
  onPreview?: (input: BirthInput, conventions: Conventions) => void | Promise<void>;
  submitLabel?: string;
} = {}) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'nam' | 'nu' | ''>('');
  const [calendar, setCalendar] = useState<'duong' | 'am'>('duong');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [leapMonth, setLeapMonth] = useState(false);
  const [timeType, setTimeType] = useState<'clock' | 'branch' | 'unknown'>('clock');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('0');
  const [branch, setBranch] = useState('');
  const [certainty, setCertainty] = useState<Certainty>('chinh-xac');
  const [place, setPlace] = useState('HCM');
  const [utcOffset, setUtcOffset] = useState('7');
  const [dst, setDst] = useState(false);
  const [longitude, setLongitude] = useState('');
  const [timeMode, setTimeMode] = useState<TimeMode>('chuan');
  const [dayChange, setDayChange] = useState<'23h' | '0h'>('23h');
  const [leapRule, setLeapRule] = useState<'tach-15' | 'theo-thang'>('tach-15');
  const [brightness, setBrightness] = useState<'viet' | 'toan-thu'>('viet');
  const [email, setEmail] = useState('');
  const [cProcessing, setCProcessing] = useState(false);
  const [cMarketing, setCMarketing] = useState(false);
  const [cResearch, setCResearch] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const input: BirthInput | null = useMemo(() => {
    if (!gender || !day || !month || !year) return null;
    if (timeType === 'clock' && hour === '') return null;
    if (timeType === 'branch' && branch === '') return null;
    return {
      name: name.trim() || undefined,
      gender,
      calendar,
      day: +day,
      month: +month,
      year: +year,
      leapMonth: calendar === 'am' && leapMonth,
      timeType,
      hour: timeType === 'clock' ? +hour : undefined,
      minute: timeType === 'clock' ? +minute : undefined,
      branch: timeType === 'branch' ? +branch : undefined,
      certainty: timeType === 'unknown' ? 'khong-ro' : certainty,
      place,
      utcOffset: place === 'overseas' ? +utcOffset : undefined,
      dst: place === 'overseas' ? dst : undefined,
      longitude: place === 'overseas' && longitude !== '' ? +longitude : undefined,
    };
  }, [name, gender, calendar, day, month, year, leapMonth, timeType, hour, minute, branch, certainty, place, utcOffset, dst, longitude]);

  const conventions: Conventions = { timeMode, dayChange, leapRule, brightness };

  const preview = useMemo(() => {
    if (!input) return null;
    try {
      return { ok: true as const, r: resolveBirth(input, conventions) };
    } catch (e) {
      return { ok: false as const, msg: e instanceof BirthError ? e.message : 'Thông tin chưa hợp lệ.' };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, timeMode, dayChange, leapRule]);

  const wantsSave = !onPreview && email.trim() !== '';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!input) return setError('Vui lòng điền đủ giới tính, ngày sinh và giờ sinh (hoặc chọn "Không biết giờ").');
    if (preview && !preview.ok) return setError(preview.msg);
    if (onPreview) {
      setBusy(true);
      try {
        await onPreview(input, conventions);
      } finally {
        setBusy(false);
      }
      return;
    }
    if (wantsSave && !cProcessing)
      return setError('Để lưu lá số và gửi link qua email, vui lòng đánh dấu ô đồng ý xử lý dữ liệu. Nếu không muốn lưu, hãy xóa email.');

    if (!wantsSave) {
      // Không lưu: dữ liệu chỉ nằm trong trình duyệt của bạn
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ input, conventions }));
      router.push('/xem');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input,
          conventions,
          email: email.trim(),
          consent: { processing: cProcessing, marketing: cMarketing, research: cResearch },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Không lưu được lá số.');
      router.push(`/la-so/${data.id}?moi=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="panel" noValidate>
      <div className="field">
        <label htmlFor="name">Tên hiển thị trên lá số</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Có thể để trống hoặc dùng biệt danh" />
      </div>

      <div className="field">
        <span className="legend" id="g-l">Giới tính</span>
        <div className="seg" role="radiogroup" aria-labelledby="g-l">
          {(['nam', 'nu'] as const).map((g) => (
            <label key={g}>
              <input type="radio" name="gender" checked={gender === g} onChange={() => setGender(g)} />
              {g === 'nam' ? 'Nam' : 'Nữ'}
            </label>
          ))}
        </div>
        <span className="hint">Tử Vi dùng giới tính sinh học khi sinh để xác định chiều chạy của đại vận (thuận hay nghịch).</span>
      </div>

      <div className="field">
        <span className="legend" id="c-l">Ngày sinh theo</span>
        <div className="seg" role="radiogroup" aria-labelledby="c-l">
          <label>
            <input type="radio" name="cal" checked={calendar === 'duong'} onChange={() => setCalendar('duong')} />
            Dương lịch
          </label>
          <label>
            <input type="radio" name="cal" checked={calendar === 'am'} onChange={() => setCalendar('am')} />
            Âm lịch
          </label>
        </div>
        <span className="hint">Ghi trên giấy khai sinh/CCCD là dương lịch. Chỉ chọn âm lịch nếu gia đình ghi theo lịch âm.</span>
      </div>

      <div className="row" style={{ marginBottom: 8 }}>
        <div className="field">
          <label htmlFor="d">Ngày</label>
          <select id="d" value={day} onChange={(e) => setDay(e.target.value)}>
            <option value="">—</option>
            {range(1, calendar === 'am' ? 30 : 31).map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="m">Tháng</label>
          <select id="m" value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">—</option>
            {range(1, 12).map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="y">Năm</label>
          <input id="y" type="number" inputMode="numeric" min={1900} max={2100} value={year} onChange={(e) => setYear(e.target.value)} placeholder="1990" />
        </div>
      </div>
      {calendar === 'am' && (
        <label className="check">
          <input type="checkbox" checked={leapMonth} onChange={(e) => setLeapMonth(e.target.checked)} />
          <span>Sinh vào tháng nhuận</span>
        </label>
      )}

      <div className="field">
        <span className="legend" id="t-l">Giờ sinh</span>
        <div className="seg" role="radiogroup" aria-labelledby="t-l">
          <label>
            <input type="radio" name="tt" checked={timeType === 'clock'} onChange={() => setTimeType('clock')} />
            Biết giờ phút
          </label>
          <label>
            <input type="radio" name="tt" checked={timeType === 'branch'} onChange={() => setTimeType('branch')} />
            Chỉ biết canh giờ
          </label>
          <label>
            <input type="radio" name="tt" checked={timeType === 'unknown'} onChange={() => setTimeType('unknown')} />
            Không biết
          </label>
        </div>
      </div>
      {timeType === 'clock' && (
        <>
          <div className="row two">
            <div className="field">
              <label htmlFor="h">Giờ (0–23)</label>
              <select id="h" value={hour} onChange={(e) => setHour(e.target.value)}>
                <option value="">—</option>
                {range(0, 23).map((n) => (
                  <option key={n} value={n}>
                    {String(n).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="mi">Phút</label>
              <select id="mi" value={minute} onChange={(e) => setMinute(e.target.value)}>
                {range(0, 59).map((n) => (
                  <option key={n} value={n}>
                    {String(n).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="cert">Giờ này chắc chắn đến đâu?</label>
            <select id="cert" value={certainty} onChange={(e) => setCertainty(e.target.value as Certainty)}>
              <option value="chinh-xac">Chính xác — có ghi chép (giấy chứng sinh, sổ ghi của gia đình)</option>
              <option value="khoang-30">Khá chắc — có thể lệch khoảng 30 phút</option>
              <option value="khoang-120">Ước lượng — có thể lệch 1–2 tiếng</option>
            </select>
            <span className="hint">Giờ ghi trên giấy chứng sinh của bệnh viện thường chính xác nhất. Giờ "nhớ lại" thường được làm tròn.</span>
          </div>
        </>
      )}
      {timeType === 'branch' && (
        <>
          <div className="field">
            <label htmlFor="br">Canh giờ</label>
            <select id="br" value={branch} onChange={(e) => setBranch(e.target.value)}>
              <option value="">—</option>
              {CANH_GIO.map((c) => (
                <option key={c.index} value={c.index}>
                  Giờ {c.name} ({c.range})
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="cert2">Mức chắc chắn</label>
            <select id="cert2" value={certainty} onChange={(e) => setCertainty(e.target.value as Certainty)}>
              <option value="chinh-xac">Chắc chắn đúng canh giờ này</option>
              <option value="khoang-120">Có thể lệch sang canh giờ liền kề</option>
            </select>
          </div>
        </>
      )}
      {timeType === 'unknown' && (
        <p className="alert">
          Không có giờ sinh, cung Mệnh có thể nằm ở bất kỳ ô nào trong 12 ô. Lá số vẫn được lập (tạm theo giờ Tý) để bạn tìm hiểu, nhưng
          phần luận giải chỉ mang tính minh họa. Bạn có thể thử <a href="/chinh-gio">tìm giờ sinh theo sự kiện đời</a> trước.
        </p>
      )}

      <div className="field">
        <label htmlFor="pl">Nơi sinh</label>
        <select id="pl" value={place} onChange={(e) => setPlace(e.target.value)}>
          {PLACES.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
          <option value="overseas">Nước ngoài</option>
        </select>
        <span className="hint">Dùng tên tỉnh trên giấy khai sinh (tên cũ trước sáp nhập). Cần để hiệu chỉnh múi giờ lịch sử và giờ Mặt Trời.</span>
      </div>
      {place === 'overseas' && (
        <div className="row">
          <div className="field">
            <label htmlFor="tz">Múi giờ chuẩn (UTC)</label>
            <input id="tz" type="number" step="0.5" value={utcOffset} onChange={(e) => setUtcOffset(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="lon">Kinh độ (tùy chọn)</label>
            <input id="lon" type="number" step="0.01" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="-118.24" />
          </div>
          <label className="check" style={{ alignSelf: 'end' }}>
            <input type="checkbox" checked={dst} onChange={(e) => setDst(e.target.checked)} />
            <span>Đang giờ mùa hè</span>
          </label>
        </div>
      )}

      <details className="more">
        <summary>Tùy chọn nâng cao: quy ước tính giờ</summary>
        <div className="field">
          <span className="legend">Giờ dùng để an sao</span>
          {(
            [
              ['chuan', 'Giờ chuẩn (khuyên dùng): tự hiệu chỉnh các thời kỳ Việt Nam dùng UTC+8, UTC+9'],
              ['dong-ho', 'Giờ đồng hồ: dùng nguyên giờ ghi lại, không hiệu chỉnh'],
              ['mat-troi', 'Giờ Mặt Trời thực: theo kinh độ nơi sinh và phương trình thời gian'],
            ] as [TimeMode, string][]
          ).map(([v, l]) => (
            <label key={v} className="check">
              <input type="radio" name="tm" checked={timeMode === v} onChange={() => setTimeMode(v)} />
              <span>{l}</span>
            </label>
          ))}
        </div>
        <div className="field">
          <span className="legend">Sinh từ 23:00 đến 24:00</span>
          <label className="check">
            <input type="radio" name="dc" checked={dayChange === '23h'} onChange={() => setDayChange('23h')} />
            <span>Tính sang ngày hôm sau (phổ biến)</span>
          </label>
          <label className="check">
            <input type="radio" name="dc" checked={dayChange === '0h'} onChange={() => setDayChange('0h')} />
            <span>Vẫn tính ngày hôm đó</span>
          </label>
        </div>
        <div className="field">
          <span className="legend">Sinh tháng nhuận</span>
          <label className="check">
            <input type="radio" name="lr" checked={leapRule === 'tach-15'} onChange={() => setLeapRule('tach-15')} />
            <span>Ngày 1–15 tính tháng trước, từ 16 tính tháng sau (phổ biến)</span>
          </label>
          <label className="check">
            <input type="radio" name="lr" checked={leapRule === 'theo-thang'} onChange={() => setLeapRule('theo-thang')} />
            <span>Tính trọn như tháng chính</span>
          </label>
        </div>
        <div className="field">
          <span className="legend">Bảng độ sáng sao (Miếu, Vượng, Đắc, Hãm)</span>
          <label className="check">
            <input type="radio" name="bs" checked={brightness === 'viet'} onChange={() => setBrightness('viet')} />
            <span>Theo sách Tử Vi Việt Nam (phổ biến ở Việt Nam)</span>
          </label>
          <label className="check">
            <input type="radio" name="bs" checked={brightness === 'toan-thu'} onChange={() => setBrightness('toan-thu')} />
            <span>Theo Tử Vi Đẩu Số Toàn Thư (sách gốc Trung Hoa, 7 mức)</span>
          </label>
          <span className="hint">Lá số sẽ liệt kê những sao có độ sáng khác nhau giữa hai bảng để bạn so sánh.</span>
        </div>
      </details>

      {preview && (
        <div className={preview.ok ? 'note' : 'alert'} aria-live="polite">
          {preview.ok ? (
            <>
              <b>Hệ thống hiểu là:</b>
              <ul className="steps">
                {preview.r.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
              {preview.r.warnings.map((w, i) => (
                <p key={i} style={{ margin: '6px 0 0' }}>
                  ⚠ {w}
                </p>
              ))}
              <p style={{ margin: '6px 0 0' }}>Nếu chỗ nào chưa đúng với thông tin của bạn, hãy sửa trước khi lập lá số.</p>
            </>
          ) : (
            preview.msg
          )}
        </div>
      )}

      {!onPreview && (
      <div className="field" style={{ marginTop: 20 }}>
        <label htmlFor="em">Email (để lưu lá số)</label>
        <input id="em" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Bỏ trống nếu chỉ muốn xem nhanh" />
        <span className="hint">
          {wantsSave
            ? 'Lá số sẽ được lưu và gửi link riêng về email này.'
            : 'Bỏ trống email: lá số được tính ngay trên máy bạn, không gửi hay lưu gì lên máy chủ.'}
        </span>
      </div>
      )}

      {wantsSave && (
        <fieldset style={{ border: 0, padding: 0, margin: '0 0 8px' }}>
          <legend className="legend" style={{ marginBottom: 8 }}>
            Sự đồng ý của bạn (đánh dấu từng mục bạn đồng ý)
          </legend>
          <label className="check">
            <input type="checkbox" checked={cProcessing} onChange={(e) => setCProcessing(e.target.checked)} />
            <span>
              <b>Bắt buộc để lưu:</b> {CONSENT_TEXT.processing}
            </span>
          </label>
          <label className="check">
            <input type="checkbox" checked={cMarketing} onChange={(e) => setCMarketing(e.target.checked)} />
            <span>
              <b>Không bắt buộc:</b> {CONSENT_TEXT.marketing}
            </span>
          </label>
          <label className="check">
            <input type="checkbox" checked={cResearch} onChange={(e) => setCResearch(e.target.checked)} />
            <span>
              <b>Không bắt buộc:</b> {CONSENT_TEXT.research}
            </span>
          </label>
          <p className="hint">
            Chi tiết trong <a href="/bao-mat">Chính sách bảo mật</a>. Không đồng ý mục không bắt buộc vẫn dùng đầy đủ dịch vụ.
          </p>
        </fieldset>
      )}

      {error && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}
      <button className="btn" type="submit" disabled={busy} style={{ width: '100%' }}>
        {busy ? 'Đang lập lá số…' : submitLabel ?? (wantsSave ? 'Lập và lưu lá số' : 'Lập lá số')}
      </button>
    </form>
  );
}
