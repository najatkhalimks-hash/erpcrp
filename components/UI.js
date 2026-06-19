import { getInterp } from '../lib/data';

// ── ScoreRing ─────────────────────────────────────────────────────────────────
export function ScoreRing({ score, size = 80, stroke = 7, label, sub }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const fill = circ * (1 - score);
  const interp = getInterp(score);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a2a3a" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke={interp.color} strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={fill}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="mono font-bold" style={{ fontSize: size * 0.22, color: interp.color }}>
            {score.toFixed(3)}
          </span>
        </div>
      </div>
      {label && <span className="text-xs font-semibold text-gray-300 text-center">{label}</span>}
      {sub && <span className="text-xs text-gray-500 text-center">{sub}</span>}
    </div>
  );
}

// ── KpiCard ───────────────────────────────────────────────────────────────────
export function KpiCard({ label, value, unit = '', sub, color = '#BF9000', alert = false }) {
  return (
    <div className={`rounded-xl p-4 card-glow flex flex-col gap-1 ${alert ? 'border border-red-800/40' : ''}`}
         style={{ background: 'rgba(255,255,255,0.03)' }}>
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</span>
      <span className="mono text-2xl font-bold" style={{ color }}>{value}{unit && <span className="text-sm ml-1 text-gray-400">{unit}</span>}</span>
      {sub && <span className="text-xs text-gray-500">{sub}</span>}
    </div>
  );
}

// ── SectionHeader ─────────────────────────────────────────────────────────────
export function SectionHeader({ icon, title, subtitle, color = '#BF9000' }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        {icon && <span className="text-2xl">{icon}</span>}
        <h2 className="text-xl font-bold tracking-tight" style={{ color }}>{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-gray-400 ml-9">{subtitle}</p>}
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────
export function Badge({ label, color, bg }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ color, background: bg || color + '22', border: `1px solid ${color}44` }}>
      {label}
    </span>
  );
}

// ── HorizonBadge ──────────────────────────────────────────────────────────────
export function HorizonBadge({ horizon }) {
  return horizon === 'CT'
    ? <Badge label="Court Terme" color="#005757" bg="#D9F0F040" />
    : <Badge label="Long Terme"  color="#4B0082" bg="#E8E0F040" />;
}

// ── ProgressBar ───────────────────────────────────────────────────────────────
export function ProgressBar({ value, max = 1, color = '#BF9000', height = 6 }) {
  const pct = Math.min(value / max, 1) * 100;
  const interp = max === 1 ? getInterp(value) : null;
  const c = interp ? interp.color : color;
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height, background: '#1a2a3a' }}>
      <div className="h-full rounded-full transition-all duration-700"
           style={{ width: `${pct}%`, background: c }} />
    </div>
  );
}

// ── StatusDot ─────────────────────────────────────────────────────────────────
export function StatusDot({ status }) {
  const map = { '✅': '#2E7D32', '✔': '#BF9000', '⚠️': '#843C0C', '🔴': '#C00000' };
  const c = map[status] || '#888';
  return (
    <span className="inline-block w-2 h-2 rounded-full pulse-dot" style={{ background: c }} />
  );
}

// ── MatrixCell ────────────────────────────────────────────────────────────────
export function MatrixCell({ val, isDiag, isHeader, hd }) {
  if (isHeader) return (
    <th className="text-xs font-semibold px-2 py-1 text-center text-white/80"
        style={{ background: hd, border: '1px solid rgba(255,255,255,0.1)' }}>{val}</th>
  );
  const bg = isDiag ? '#1a2a3a' : val > 1 ? '#E2EFDA18' : val < 1 ? '#FCE4D618' : 'transparent';
  const fc = isDiag ? '#888' : val > 1 ? '#2E7D32' : val < 1 ? '#C00000' : '#ccc';
  return (
    <td className="mono text-xs text-center px-2 py-1" style={{ background: bg, color: fc, border: '1px solid rgba(255,255,255,0.05)' }}>
      {typeof val === 'number' ? (val < 1 && val !== 0 ? `1/${Math.round(1/val)}` : val.toFixed(3)) : val}
    </td>
  );
}

// ── InfoBox ───────────────────────────────────────────────────────────────────
export function InfoBox({ children, color = '#BF9000', icon = 'ℹ️' }) {
  return (
    <div className="rounded-lg p-4 text-sm" style={{ background: color + '12', border: `1px solid ${color}33` }}>
      <span className="mr-2">{icon}</span>{children}
    </div>
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────
export function Table({ headers, rows, compact = false }) {
  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ background: '#1a2a3a' }}>
            {headers.map((h, i) => (
              <th key={i} className={`${compact ? 'px-2 py-1.5' : 'px-3 py-2'} text-left text-xs font-semibold text-gray-400 uppercase tracking-wider`}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              {row.map((cell, j) => (
                <td key={j} className={`${compact ? 'px-2 py-1.5' : 'px-3 py-2'} text-gray-300`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
