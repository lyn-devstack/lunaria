import { moonPhase } from '../../logic/moon'

/** Disco lunar en SVG: la parte iluminada se calcula con la fracción iluminada y si crece o mengua. */
export function MoonPhase({ date, size = 40 }: { date: Date; size?: number }) {
  const m = moonPhase(date)
  const r = 20
  const k = m.illumination
  const rx = Math.abs(1 - 2 * k) * r
  const sweep = k > 0.5 ? 1 : 0
  const lit = `M 24 4 A ${r} ${r} 0 0 1 24 44 A ${rx.toFixed(2)} ${r} 0 0 ${sweep} 24 4 Z`

  return (
    <div className="moonline">
      <svg
        className="moon"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        role="img"
        aria-label={m.name}
      >
        <circle cx="24" cy="24" r={r} fill="#241733" stroke="#d4af6a" strokeOpacity="0.5" />
        <g transform={m.waxing ? undefined : 'translate(48 0) scale(-1 1)'}>
          <path d={lit} fill="#f0e7d8" />
        </g>
      </svg>
      <span>
        {m.name} · {Math.round(k * 100)}%
      </span>
    </div>
  )
}
