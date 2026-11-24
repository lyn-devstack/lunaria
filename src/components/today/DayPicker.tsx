interface Props {
  isToday: boolean
  isTomorrow: boolean
  date: Date
  onToday: () => void
  onTomorrow: () => void
  onPick: (d: Date) => void
}

const toInput = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function DayPicker({ isToday, isTomorrow, date, onToday, onTomorrow, onPick }: Props) {
  return (
    <div className="daypicker">
      <button className="chip" aria-pressed={isToday} onClick={onToday}>
        Hoy
      </button>
      <button className="chip" aria-pressed={isTomorrow} onClick={onTomorrow}>
        Mañana
      </button>
      <input
        className="input"
        type="date"
        aria-label="Elegir otra fecha"
        value={toInput(date)}
        onChange={(e) => {
          if (!e.target.value) return
          const [y, m, d] = e.target.value.split('-').map(Number)
          onPick(new Date(y, m - 1, d))
        }}
      />
    </div>
  )
}
