interface Props {
  value: boolean | null
  onChange: (v: boolean) => void
}

export function FebruaryQuestion({ value, onChange }: Props) {
  return (
    <div className="field" role="radiogroup" aria-label="¿Naciste antes del 4 de febrero?">
      <span className="field__label">¿Naciste antes del 4 de febrero?</span>
      <div className="chips">
        <button role="radio" aria-checked={value === true} className="chip" onClick={() => onChange(true)}>
          Sí
        </button>
        <button role="radio" aria-checked={value === false} className="chip" onClick={() => onChange(false)}>
          No
        </button>
      </div>
    </div>
  )
}
