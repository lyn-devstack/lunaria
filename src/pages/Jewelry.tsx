import { JewelryBox } from '../components/jewelry/JewelryBox'
import type { Piece, Profile } from '../types'

interface Props {
  profile: Profile
  onChange: (pieces: Piece[]) => void
}

export function Jewelry({ profile, onChange }: Props) {
  return (
    <div>
      <h2 className="page-title">Mi joyero</h2>
      <p className="page-lead">
        Tus joyas con su tipo, metal y piedras. Es opcional: sirve para sugerirte cuáles llevar según tu look.
      </p>
      <JewelryBox owned={profile.jewelry} onChange={onChange} />
    </div>
  )
}
