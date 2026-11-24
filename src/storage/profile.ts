import { ELEMENTS } from '../data/elements'
import { isPiece } from '../data/jewelry'
import type { Profile } from '../types'

const KEY = 'lunaria:profile'

/**
 * Lee el perfil. La versión 1 (joyero de casillas metal+piedra) se migra a la 2 conservando
 * el elemento y los datos de nacimiento; las joyas antiguas no se pueden convertir y se descartan.
 */
export const parseProfile = (raw: unknown): Profile | null => {
  const p = raw as any
  if (!p || typeof p.onboarded !== 'boolean' || !ELEMENTS.includes(p.element)) return null

  if (p.version === 1) return { ...p, version: 2, jewelry: [] }
  if (p.version !== 2 || !Array.isArray(p.jewelry)) return null
  return { ...p, jewelry: p.jewelry.filter(isPiece) }
}

export const loadProfile = (): Profile | null => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? parseProfile(JSON.parse(raw)) : null
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
