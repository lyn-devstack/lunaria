export type Tab = 'hoy' | 'semana' | 'joyero' | 'ajustes'

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'hoy', label: 'Hoy', icon: '☾' },
  { id: 'semana', label: 'Semana', icon: '✧' },
  { id: 'joyero', label: 'Joyero', icon: '◇' },
  { id: 'ajustes', label: 'Ajustes', icon: '⚙︎' },
]

export function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="tabbar" aria-label="Navegación principal">
      <div className="tabbar__inner">
        {TABS.map((t) => (
          <button
            key={t.id}
            className="tabbar__btn"
            aria-current={tab === t.id ? 'page' : undefined}
            onClick={() => onChange(t.id)}
          >
            <span aria-hidden="true">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
