import { useCallback, useState } from 'react'
import { clearProfile, loadProfile, saveProfile } from '../storage/profile'
import type { Profile } from '../types'

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(() => loadProfile())

  const save = useCallback((next: Profile) => {
    saveProfile(next)
    setProfile(next)
  }, [])

  const update = useCallback((patch: Partial<Profile>) => {
    setProfile((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      saveProfile(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    clearProfile()
    setProfile(null)
  }, [])

  return { profile, save, update, reset }
}
