import { jewelId } from '../../data/jewelry'
import type { MetalName } from '../../types'

interface Props {
  stone: string | null
  metals: MetalName[]
  owned: Set<string>
  onToggle: (id: string) => void
}

/** Una piedra (o "solo metal") con un chip por cada metal que se puede marcar. */
export function JewelItem({ stone, metals, owned, onToggle }: Props) {
  return (
    <div className="stone-row">
      <span className="stone-row__name">{stone ?? 'Solo metal (sin piedra)'}</span>
      <div className="chips" role="group" aria-label={stone ?? 'Solo metal'}>
        {metals.map((metal) => {
          const id = jewelId(metal, stone)
          return (
            <button
              key={id}
              className="chip chip--sm"
              aria-pressed={owned.has(id)}
              onClick={() => onToggle(id)}
            >
              {metal}
            </button>
          )
        })}
      </div>
    </div>
  )
}
