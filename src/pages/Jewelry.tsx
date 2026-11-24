import { JewelryBox } from '../components/jewelry/JewelryBox'
import type { Profile } from '../types'

interface Props {
  profile: Profile
  onChange: (ids: string[]) => void
}

export function Jewelry({ profile, onChange }: Props) {
  return (
    <div>
      <h2 className="page-title">Mi joyero</h2>
      <p className="page-lead">
        Marca las joyas que tienes ({profile.jewelry.length}). Es opcional: sirve para sugerirte cuáles
        llevar según tu look.
      </p>
      <JewelryBox owned={profile.jewelry} onChange={onChange} />
    </div>
  )
}
