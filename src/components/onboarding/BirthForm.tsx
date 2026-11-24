import { useState } from 'react'
import { birthElement } from '../../logic/birthElement'
import type { Element } from '../../types'
import { FebruaryQuestion } from './FebruaryQuestion'

export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export interface BirthData {
  month: number
  year: number
  beforeFeb4?: boolean
  element: Element
}

interface Props {
  initial?: { month?: number; year?: number; beforeFeb4?: boolean }
  submitLabel: string
  onSubmit: (data: BirthData) => void
}

export function BirthForm({ initial, submitLabel, onSubmit }: Props) {
  const maxYear = new Date().getFullYear()
  const [month, setMonth] = useState<number | ''>(initial?.month ?? '')
  const [year, setYear] = useState<string>(initial?.year ? String(initial.year) : '')
  const [before, setBefore] = useState<boolean | null>(initial?.beforeFeb4 ?? null)
  const [error, setError] = useState('')

  const submit = () => {
    const y = Number(year)
    if (month === '') return setError('Elige tu mes de nacimiento.')
    if (!Number.isInteger(y) || y < 1900 || y > maxYear) return setError(`Escribe un año entre 1900 y ${maxYear}.`)
    if (month === 2 && before === null) return setError('Cuéntame si naciste antes del 4 de febrero.')
    setError('')
    const beforeFeb4 = month === 2 ? Boolean(before) : undefined
    onSubmit({ month, year: y, beforeFeb4, element: birthElement(month, y, beforeFeb4) })
  }

  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <div className="form-row">
        <label className="field">
          <span className="field__label">Mes</span>
          <select
            className="input"
            value={month}
            onChange={(e) => setMonth(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">Elige…</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field__label">Año</span>
          <input
            className="input"
            inputMode="numeric"
            placeholder="1995"
            maxLength={4}
            value={year}
            onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))}
          />
        </label>
      </div>

      {month === 2 && <FebruaryQuestion value={before} onChange={setBefore} />}

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="btn btn--block">
        {submitLabel}
      </button>
    </form>
  )
}
