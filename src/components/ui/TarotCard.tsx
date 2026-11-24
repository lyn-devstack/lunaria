import type { ReactNode } from 'react'

interface Props {
  label: string
  highlight?: boolean
  children: ReactNode
}

/** Tarjeta con marco dorado doble, estilo carta de tarot. */
export function TarotCard({ label, highlight, children }: Props) {
  return (
    <section className={`tarot${highlight ? ' tarot--highlight' : ''}`}>
      <h2 className="tarot__label">{label}</h2>
      {children}
    </section>
  )
}
