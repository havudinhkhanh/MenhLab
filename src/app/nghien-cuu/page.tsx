import type { Metadata } from 'next';
import Link from 'next/link';
import { db, dbEnabled } from '@/lib/db';
import { binomTailGE, sampleSize, wilson } from '@/lib/stats';
import { RATES, fmtPct, rate } from '@/data/rates';
import { PATTERN_NAMES } from '@/lib/engine/patterns';
import { parseKey } from '@/content/blind';
import { config } from '@/lib/config';
import { T } from '@/components/TermLayer';

export const revalidate = 600;
export const metadata: Metadata = {
  title: 'Nghiên cứu: Tử Vi có mô tả đúng con người không?',
  description:
    'Phòng thí nghiệm mở của MệnhLab: thí nghiệm ghép cặp mù đăng ký trước, số liệu công khai kể cả khi bất lợi, tỷ lệ nền của mọi đặc điểm lá số.',
};

const CHANCE = 0.25;
const TARGET_RATE = 0.31; // hiệu ứng nhỏ nhất đáng quan tâm
const TARGET_N = Math.ceil(sampleSize(CHANCE, TARGET_RATE) / 50) * 50;

async function loadLab() {
  if (!dbEnabled()) return null;
  const sb = db();
  const { data } = await sb.from('lab_results').select('correct,confidence').eq('test', 'menh-ghep-cap-mu').eq('n_options', 4).limit(100000);
  const { data: fb } = await sb.from('feedback').select('section,score').limit(100000);
  return { rows: data ?? [], feedback: fb ?? [] };
}

function Bar({ p, max = 1 }: { p: number; max?: number }) {
  return (
    <span aria-hidden="true" style={{ display: 'inline-block', width: 120, height: 8, background: 'var(--line)', borderRadius: 4, verticalAlign: 'middle', marginLeft: 8 }}>
      <span style={{ display: 'block', width: `${Math.min(100, (p / max) * 100)}%`, height: '100%', background: 'var(--tu)', borderRadius: 4 }} />
    </span>
  );
}

const pct = (x: number) => `${(x * 100).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%`;

export default async function Research() {
  const lab = await loadLab();
  const n = lab?.rows.length ?? 0;
  const k = lab?.rows.filter((r) => r.correct).length ?? 0;
  const [lo, hi] = wilson(k, n);
  const p = n ? binomTailGE(k, n, CHANCE) : 1;
  const conf = (pred: (c: number) => boolean) => {
    const rs = (lab?.rows ?? []).filter((r) => r.confidence && pred(r.confidence));
    return { n: rs.length, k: rs.filter((r) => r.correct).length };
  };
  const hiConf = conf((c) => c >= 4);
  const loConf = conf((c) => c <= 2);

  const fbBy = new Map<string, number[]>();
  for (const f of lab?.feedback ?? []) fbBy.set(f.section, [...(fbBy.get(f.section) ?? []), f.score]);

  const combos = Object.entries(RATES.menhCombo).sort((a, b) => b[1] - a[1]);
  const maxCombo = combos[0]?.[1] ?? 1;

  let verdict: string;
  if (n === 0) verdict = 'Chưa có lượt tham gia nào được ghi nhận.';
  else if (n < TARGET_N)
    verdict = `Đang thu thập dữ liệu (${n.toLocaleString('vi-VN')}/${TARGET_N} lượt). Theo kế hoạch đăng ký trước, chúng tôi chưa kết luận cho đến khi đủ cỡ mẫu — xem số liệu lúc này dễ bị nhầm bởi dao động ngẫu nhiên.`;
  else if (p < 0.05 && lo > CHANCE)
    verdict = `Tỷ lệ chọn đúng cao hơn mức đoán mò 25% một cách có ý nghĩa thống kê (p = ${p.toFixed(4)}). Đây là tín hiệu đáng nghiên cứu tiếp — nhưng một thí nghiệm chưa đủ để kết luận Tử Vi "đúng"; cần lặp lại với thiết kế chặt hơn.`;
  else
    verdict = `Tỷ lệ chọn đúng không cao hơn mức đoán mò 25% một cách có ý nghĩa thống kê (p = ${p.toFixed(3)}). Với thiết kế này, người dùng không nhận ra mô tả từ lá số của mình tốt hơn ngẫu nhiên — phù hợp với giả thuyết các mô tả chủ yếu mang tính "ai đọc cũng thấy đúng".`;

  return (
    <div className="wrap narrow" style={{ paddingTop: 32 }}>
      <h1>Phòng thí nghiệm mở</h1>
      <p className="hero-lede">
        Phần lớn trang Tử Vi tự khẳng định mình "chính xác". {config.brand} làm ngược lại: chúng tôi đo xem lá số có thực sự mô tả đúng con người
        hay không, đăng ký trước cách phân tích, và công bố mọi kết quả — kể cả khi kết quả bất lợi cho chính chúng tôi.
      </p>

      <h2 id="ghep-cap-mu">Thí nghiệm 1: Ghép cặp mù</h2>
      <h3>Thiết kế (đăng ký trước, phiên bản 1, tháng 10/2026)</h3>
      <div className="prose">
        <p>
          Ngay sau khi lập lá số và <b>trước khi nhìn thấy lá số</b>, người dùng đọc 4 đoạn mô tả tính cách đã ẩn tên sao: 1 đoạn viết từ cung Mệnh
          của chính họ, 3 đoạn từ các bộ sao khác — được chọn ngẫu nhiên theo đúng tỷ lệ các bộ sao trong dân số, để đoạn "mồi" không kém phổ
          biến hơn đoạn thật. Người dùng chọn đoạn giống mình nhất và cho biết mức chắc chắn.
        </p>
        <ul>
          <li>
            <b>Giả thuyết H1:</b> tỷ lệ chọn đúng cao hơn 25% (mức đoán mò). Giả thuyết H0: tỷ lệ đúng bằng 25%.
          </li>
          <li>
            <b>Phân tích chính:</b> kiểm định nhị thức một phía, mức ý nghĩa 0,05; báo cáo khoảng tin cậy Wilson 95%.
          </li>
          <li>
            <b>Cỡ mẫu:</b> {TARGET_N} lượt — đủ để phát hiện tỷ lệ đúng từ {pct(TARGET_RATE)} trở lên với xác suất 80%. Không kết luận trước
            khi đủ cỡ mẫu.
          </li>
          <li>
            <b>Loại trừ:</b> mỗi lá số đã lưu chỉ tính lần đầu; người đã dùng công cụ tìm giờ sinh (đã đọc mô tả) không được mời tham gia.
          </li>
          <li>
            <b>Phân tích phụ (chỉ mô tả, không kết luận):</b> tỷ lệ đúng theo mức chắc chắn.
          </li>
          <li>
            <b>Hạn chế đã biết:</b> người tham gia tự chọn (không ngẫu nhiên), có thể đã biết sẵn sao cung Mệnh của mình từ trang khác; giờ
            sinh khai báo có thể sai; mô tả do chúng tôi viết, mô tả khác có thể cho kết quả khác; mô tả của bộ hai chính tinh dài hơn bộ một
            chính tinh, độ dài có thể ảnh hưởng lựa chọn (sẽ phân tích riêng khi đủ dữ liệu).
          </li>
        </ul>
      </div>

      <h3>Kết quả hiện tại</h3>
      {!lab ? (
        <p className="muted">Cơ sở dữ liệu chưa được cấu hình trên máy chủ này.</p>
      ) : (
        <>
          <table className="simple" style={{ maxWidth: 560 }}>
            <tbody>
              <tr>
                <th>Số lượt</th>
                <td>{n.toLocaleString('vi-VN')}</td>
              </tr>
              <tr>
                <th>Chọn đúng</th>
                <td>
                  {k.toLocaleString('vi-VN')} ({n ? pct(k / n) : '—'})
                  {n > 0 && <Bar p={k / n} max={0.6} />}
                </td>
              </tr>
              <tr>
                <th>Khoảng tin cậy 95%</th>
                <td>{n ? `${pct(lo)} – ${pct(hi)}` : '—'}</td>
              </tr>
              <tr>
                <th>Mức đoán mò</th>
                <td>
                  25%
                  <Bar p={CHANCE} max={0.6} />
                </td>
              </tr>
              <tr>
                <th>p (một phía)</th>
                <td>{n ? p.toFixed(4) : '—'}</td>
              </tr>
              <tr>
                <th>Chắc chắn cao (4–5)</th>
                <td>{hiConf.n ? `${pct(hiConf.k / hiConf.n)} đúng / ${hiConf.n} lượt` : '—'}</td>
              </tr>
              <tr>
                <th>Gần như đoán mò (1–2)</th>
                <td>{loConf.n ? `${pct(loConf.k / loConf.n)} đúng / ${loConf.n} lượt` : '—'}</td>
              </tr>
            </tbody>
          </table>
          <p className="note" style={{ marginTop: 12 }}>
            {verdict}
          </p>
        </>
      )}

      <h2>Thí nghiệm 2: Người dùng tự chấm từng cung</h2>
      <p>
        Người dùng đồng ý nghiên cứu có thể chấm "mô tả này đúng với bạn đến đâu" (1–5) cho từng cung. Đây là số liệu <b>mô tả</b>, không có
        nhóm đối chứng, nên không dùng để kết luận độ chính xác — điểm cao có thể chỉ phản ánh <T>Hiệu ứng Barnum</T>. Thí nghiệm 1 mới là
        phép thử thật.
      </p>
      {fbBy.size === 0 ? (
        <p className="muted">Chưa có dữ liệu.</p>
      ) : (
        <table className="simple" style={{ maxWidth: 560 }}>
          <thead>
            <tr>
              <th>Phần</th>
              <th>Điểm trung bình</th>
              <th>Lượt</th>
            </tr>
          </thead>
          <tbody>
            {[...fbBy]
              .sort((a, b) => b[1].length - a[1].length)
              .map(([sec, xs]) => (
                <tr key={sec}>
                  <td>{sec.replace('cung:', 'Cung ')}</td>
                  <td>{(xs.reduce((a, b) => a + b, 0) / xs.length).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} / 5</td>
                  <td>{xs.length}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      <h2>Kiểm tra nội bộ</h2>
      <div className="prose">
        <ul>
          <li>Lịch âm Việt Nam: đổi qua lại dương–âm khớp 100% trên hơn 30.000 ngày (1930–2030); Tết các năm lệch lịch Trung Quốc (1985, 2007) đúng theo lịch Việt.</li>
          <li>
            An sao: các bước tính tay (cung Mệnh, Thân, Cục, Tử Vi, 14 chính tinh, Tứ Hóa, đại vận) khớp với engine trên hơn 1.300 lá số kiểm thử, kể cả
            sinh tháng nhuận. Mỗi lá số đều hiển thị các bước này để bất kỳ ai cũng kiểm lại được.
          </li>
          <li>
            Công cụ <Link href="/chinh-gio">tìm giờ sinh</Link>: với 48.000 bộ sự kiện ngẫu nhiên, công cụ chỉ nói "khá rõ" khoảng 5% số lần. Nếu
            quy tắc Tử Vi đúng, công cụ chỉ ra đúng canh giờ 85–89% số lần với 5 sự kiện, 92–94% với 8 sự kiện (dữ liệu mô phỏng).
          </li>
        </ul>
      </div>

      <h2 id="ty-le-nen">Tỷ lệ nền</h2>
      {!RATES.n ? (
        <p className="muted">Chưa có dữ liệu mô phỏng.</p>
      ) : (
        <>
          <p>
            Tỷ lệ nền trả lời câu hỏi: trong dân số, bao nhiêu người có cùng đặc điểm này? Nhiều trang lá số khiến người đọc cảm thấy lá số của
            mình "độc nhất" — thực tế mỗi bộ sao cung Mệnh có ở hàng triệu người.
          </p>
          <p className="small muted">
            Phương pháp: {RATES.method} Cỡ mẫu {RATES.n.toLocaleString('vi-VN')} lá số; sai số khoảng ±{(196 * Math.sqrt((0.08 * 0.92) / RATES.n)).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} điểm
            phần trăm với các tỷ lệ quanh 8%.
          </p>

          <h3>Bộ chính tinh thủ Mệnh</h3>
          <table className="simple">
            <thead>
              <tr>
                <th>Chính tinh cung Mệnh</th>
                <th>Tỷ lệ</th>
              </tr>
            </thead>
            <tbody>
              {combos.map(([key, c]) => {
                const { stars, borrowed } = parseKey(key);
                return (
                  <tr key={key}>
                    <td>
                      {stars.join(' – ')}
                      {borrowed && <span className="muted"> (vô chính diệu, mượn đối cung)</span>}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {fmtPct(rate(c))}
                      <Bar p={c} max={maxCombo} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h3>Cách cục</h3>
          <table className="simple">
            <thead>
              <tr>
                <th>Cách cục</th>
                <th>Đủ điều kiện</th>
                <th>Gần đủ</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(RATES.patterns)
                .sort((a, b) => b[1].du - a[1].du)
                .map(([id, v]) => (
                  <tr key={id}>
                    <td>{PATTERN_NAMES[id] ?? id}</td>
                    <td>{fmtPct(rate(v.du))}</td>
                    <td>{fmtPct(rate(v.ganDu))}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <h3>Thân cư</h3>
          <table className="simple" style={{ maxWidth: 480 }}>
            <tbody>
              {Object.entries(RATES.thanCu)
                .sort((a, b) => b[1] - a[1])
                .map(([name, c]) => (
                  <tr key={name}>
                    <td>Thân cư {name}</td>
                    <td>{fmtPct(rate(c))}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <h3>Hóa Kỵ năm sinh nằm ở cung nào</h3>
          <table className="simple" style={{ maxWidth: 480 }}>
            <tbody>
              {Object.entries(RATES.hoaKy)
                .sort((a, b) => b[1] - a[1])
                .map(([name, c]) => (
                  <tr key={name}>
                    <td>Cung {name}</td>
                    <td>{fmtPct(rate(c))}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <p className="small muted">
            Mỗi cung có Hóa Kỵ ở khoảng 1/12 số người. "Hóa Kỵ ở cung Phu Thê" nghe đáng lo, nhưng đó là đặc điểm của khoảng 8% dân số — không phải
            điều riêng có của bạn.
          </p>
        </>
      )}
    </div>
  );
}
