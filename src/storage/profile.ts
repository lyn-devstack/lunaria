import { ELEMENTS } from '../data/elements'
import { parseJewel } from '../data/jewelry'
import type { Profile } from '../types'

const KEY = 'lunaria:profile'

const isValid = (p: any): p is Profile =>
  p &&
  p.version === 1 &&
  typeof p.onboarded === 'boolean' &&
  ELEMENTS.includes(p.element) &&
  Array.isArray(p.jewelry)

export const loadProfile = (): Profile | null => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!isValid(parsed)) return null
    return { ...parsed, jewelry: parsed.jewelry.filter((id: string) => parseJewel(id)) }
  } catch {
    return null
  }
}

export const saveProfile = (profile: Profile): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile))
  } catch {
    // Almacenamiento no disponible (modo privado, cuota): la app sigue funcionando sin persistir.
  }
}

export const clearProfile = (): void => {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // nada que borrar
  }
}
