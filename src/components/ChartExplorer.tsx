'use client';

/**
 * Lá số dạng lưới 4×4 truyền thống + bảng đọc cung đang chọn.
 * Chạm vào ô để chọn cung (tam phương tứ chính được tô sáng); chạm vào tên sao để xem giải thích.
 */
import { useState } from 'react';
import type { Chart, Palace, Star } from '@/lib/engine/chart';
import type { PalaceReading } from '@/lib/reading';
import { CANH_GIO } from '@/lib/engine/canchi';
import Rating from './Rating';
import { PalaceBody } from './ReadingBlocks';

export type PalaceView = PalaceReading & { locked?: boolean };

const POS: Record<number, [number, number]> = {
  5: [1, 1], 6: [1, 2], 7: [1, 3], 8: [1, 4],
  4: [2, 1], 9: [2, 4],
  3: [3, 1], 10: [3, 4],
  2: [4, 1], 1: [4, 2], 0: [4, 3], 11: [4, 4],
};

function StarBtn({ s, cls }: { s: Star; cls: string }) {
  const b = s.brightness;
  return (
    <span>
      <button type="button" className={`star ${cls}`} data-term={s.name}>
        {s.name}
      </button>
      {b && (
        <button type="button" className="star bright" data-term={b.name} title={b.name}>
          ({b.code})
        </button>
      )}
      {s.hoa && (
        <button type="button" className={`star hoa${s.hoa === 'Kỵ' ? ' ky' : ''}`} data-term={`Hóa ${s.hoa}`}>
          {s.hoa}
        </button>
      )}
    </span>
  );
}

function Cell({
  p,
  chart,
  active,
  state,
  onSelect,
  currentAge,
}: {
  p: Palace;
  chart: Chart;
  active: boolean;
  state: 'related' | 'dim' | '';
  onSelect: () => void;
  currentAge?: number;
}) {
  const [row, col] = POS[p.branch];
  const nowDv = currentAge !== undefined && currentAge >= p.daiVan[0] && currentAge <= p.daiVan[1];
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label={`Cung ${p.name} tại ${p.branchName}${p.majors.length ? `, chính tinh ${p.majors.map((s) => s.name).join(', ')}` : ', vô chính diệu'}`}
      className={`cell ${active ? 'active' : ''} ${state}`}
      style={{ gridRow: row, gridColumn: col }}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <SealGroup seals={sealsFor(chart, p.branch)} />
      <div className="cell-head">
        <span className={`cell-name ${p.name === 'Mệnh' ? 'menh' : ''}`}>{p.name}</span>
        <span className="cell-branch">
          {p.stemName.slice(0, 1)}.{p.branchName}
        </span>
      </div>
      {p.isBody && <span className="cell-than">THÂN</span>}
      <div className="majors">
        {p.majors.length ? (
          p.majors.map((s) => <StarBtn key={s.key} s={s} cls="major" />)
        ) : (
          <button type="button" className="star phu" data-term="Vô Chính Diệu">
            Vô chính diệu
          </button>
        )}
      </div>
      <div className="minors">
        {p.goodStars.map((s) => (
          <StarBtn key={s.key} s={s} cls="cat" />
        ))}
        {p.badStars.map((s) => (
          <StarBtn key={s.key} s={s} cls="sat" />
        ))}
      </div>
      <div className="others">
        {p.others.map((s) => (
          <StarBtn key={s.key} s={s} cls="phu" />
        ))}
        <button type="button" className="star phu" data-term="Vòng Bác Sĩ" data-term-extra={`Ở cung này là sao ${p.bacSi}.`}>
          {p.bacSi}
        </button>
        <button type="button" className="star phu" data-term="Vòng Thái Tuế" data-term-extra={`Ở cung này là sao ${p.thaiTue}.`}>
          {p.thaiTue}
        </button>
      </div>
      <div className="cell-foot">
        <button type="button" className="star ts" data-term="Vòng Tràng Sinh" data-term-extra={`Cung này ở giai đoạn ${p.trangSinh}.`}>
          {p.trangSinh}
        </button>
        <button type="button" className="star daivan" data-term="Đại vận" style={nowDv ? { color: 'var(--tu)' } : undefined}>
          {p.daiVan[0]}–{p.daiVan[1]}
          {nowDv ? ' ●' : ''}
        </button>
      </div>
    </div>
  );
}

/**
 * Tuần/Triệt nằm trên cạnh chung giữa hai cung. Dấu được gắn vào ô "sau" (hàng dưới hoặc cột phải)
 * và đặt đúng trên cạnh chung, nên luôn khớp đường kẻ dù các hàng cao thấp khác nhau.
 */
function sealsFor(chart: Chart, branch: number): { label: string; edge: 'top' | 'left' }[] {
  const out: { label: string; edge: 'top' | 'left' }[] = [];
  for (const [label, pair] of [
    ['Tuần', chart.tuan],
    ['Triệt', chart.triet],
  ] as const) {
    if (!pair.includes(branch)) continue;
    const other = pair[0] === branch ? pair[1] : pair[0];
    const [r1, c1] = POS[branch];
    const [r2, c2] = POS[other];
    if (c1 === c2 && r1 > r2) out.push({ label, edge: 'top' });
    if (r1 === r2 && c1 > c2) out.push({ label, edge: 'left' });
  }
  return out;
}

function SealGroup({ seals }: { seals: { label: string; edge: 'top' | 'left' }[] }) {
  if (!seals.length) return null;
  const edge = seals[0].edge;
  return (
    <span className={`seals ${edge}`}>
      {seals.map((x) => (
        <button key={x.label} type="button" className="seal" data-term={x.label}>
          {x.label}
        </button>
      ))}
    </span>
  );
}

export default function ChartExplorer({
  chart,
  readings,
  currentAge,
  chartId,
  canRate,
  compact,
}: {
  chart: Chart;
  readings?: PalaceView[];
  currentAge?: number;
  chartId?: string;
  canRate?: boolean;
  compact?: boolean;
}) {
  const [sel, setSel] = useState<number>(chart.menhBranch);
  const related = new Set([sel, (sel + 6) % 12, (sel + 4) % 12, (sel + 8) % 12]);
  const r = readings?.find((x) => x.branch === sel);
  const p = chart.palaces[sel];

  const board = (
    <div className="board" role="group" aria-label="Lá số Tử Vi">
      {chart.palaces.map((pal) => (
        <Cell
          key={pal.branch}
          p={pal}
          chart={chart}
          active={pal.branch === sel}
          state={pal.branch === sel ? '' : related.has(pal.branch) ? 'related' : ''}
          onSelect={() => setSel(pal.branch)}
          currentAge={currentAge}
        />
      ))}
      <div className="center">
        <div className="center-title">{chart.name || 'Lá số Tử Vi'}</div>
        <dl>
          <dt>Âm lịch</dt>
          <dd>
            {chart.birth.lunar.day}/{chart.birth.lunar.month}
            {chart.birth.lunar.leap ? ' nhuận' : ''}/{chart.birth.lunar.year}
          </dd>
          <dt>Giờ</dt>
          <dd>
            <button type="button" className="term" data-term="Canh giờ">
              {CANH_GIO[chart.birth.branch].name}
            </button>{' '}
            ({CANH_GIO[chart.birth.branch].range})
          </dd>
          <dt>Năm</dt>
          <dd>
            {chart.canChi.year},{' '}
            <button type="button" className="term" data-term="Âm Dương Nam Nữ">
              {chart.amDuong}
            </button>
          </dd>
          <dt>Bản mệnh</dt>
          <dd>
            <button type="button" className="term" data-term="Nạp Âm">
              {chart.banMenh.name}
            </button>
          </dd>
          <dt>Cục</dt>
          <dd>
            <button type="button" className="term" data-term="Cục">
              {chart.cuc.name}
            </button>
          </dd>
          {!compact && (
            <>
              <dt className="opt">Tháng/Ngày/Giờ</dt>
              <dd className="opt">
                {chart.canChi.month} / {chart.canChi.day} / {chart.canChi.hour}
              </dd>
              <dt className="opt">Mệnh/Thân chủ</dt>
              <dd className="opt">
                {chart.menhChu} / {chart.thanChu}
              </dd>
            </>
          )}
        </dl>
        <p className="small muted opt" style={{ marginTop: 'auto', marginBottom: 0 }}>
          Chạm vào ô để đọc cung, chạm vào chữ để xem giải thích.
        </p>
      </div>
    </div>
  );

  if (!readings) return board;

  return (
    <div className="chart-layout">
      {board}
      <aside className="palace-panel panel" aria-live="polite">
        <h2 style={{ marginTop: 0 }}>
          <button type="button" className="term" data-term={`Cung ${p.name}`}>
            Cung {p.name}
          </button>{' '}
          <span className="muted small">({p.branchName})</span>
        </h2>
        {r && (
          <>
            <p className="eyebrow" style={{ margin: '0 0 4px' }}>
              {r.story.q}
            </p>
            <p className="lead">{r.story.lead}</p>
            {r.locked ? (
              <div className="locked">
                <p style={{ marginTop: 0 }}>{r.story.about}</p>
                <p className="small">
                  Bản Pro mở phần diễn giải đầy đủ cung {p.name}: sao chính nói gì về bạn, các sao đi kèm, kết luận, việc nên làm và lý do.
                </p>
                <a className="btn" href="#mo-khoa">
                  Mở khóa bản Pro
                </a>
              </div>
            ) : (
              <>
                <PalaceBody r={r} compact />
                <p className="small" style={{ marginTop: 12 }}>
                  <b>Tự kiểm chứng:</b> {r.questions.join(' ')}
                </p>
                {canRate && chartId && <Rating chartId={chartId} section={`cung:${p.name}`} />}
              </>
            )}
          </>
        )}
      </aside>
    </div>
  );
}
