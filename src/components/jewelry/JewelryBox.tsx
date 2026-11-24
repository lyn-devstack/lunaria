import { ELEMENTS, ELEMENT_NAME } from '../../data/elements'
import { METALS, STONES } from '../../data/jewelry'
import { ElementGlyph } from '../ui/ElementGlyph'
import { TarotCard } from '../ui/TarotCard'
import { JewelItem } from './JewelItem'

interface Props {
  owned: string[]
  onChange: (ids: string[]) => void
}

export function JewelryBox({ owned, onChange }: Props) {
  const set = new Set(owned)
  const toggle = (id: string) => {
    const next = new Set(set)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onChange([...next])
  }

  return (
    <div className="stack">
      <TarotCard label="Solo metal">
        <JewelItem stone={null} metals={METALS} owned={set} onToggle={toggle} />
      </TarotCard>

      {ELEMENTS.map((el) => (
        <TarotCard key={el} label={`Piedras de ${ELEMENT_NAME[el]}`}>
          <p className="muted small" style={{ textAlign: 'center', marginTop: -4 }}>
            <ElementGlyph element={el} />
          </p>
          {STONES[el].map((stone) => (
            <JewelItem key={stone} stone={stone} metals={METALS} owned={set} onToggle={toggle} />
          ))}
        </TarotCard>
      ))}
    </div>
  )
}
