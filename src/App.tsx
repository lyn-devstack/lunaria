import { useState } from 'react'
import { AppShell } from './components/layout/AppShell'
import type { Tab } from './components/layout/TabBar'
import { useProfile } from './hooks/useProfile'
import { useSelectedDate } from './hooks/useSelectedDate'
import { Jewelry } from './pages/Jewelry'
import { Onboarding } from './pages/Onboarding'
import { Settings } from './pages/Settings'
import { Today } from './pages/Today'
import { Week } from './pages/Week'

export default function App() {
  const { profile, save, update, reset } = useProfile()
  const picker = useSelectedDate()
  const [tab, setTab] = useState<Tab>('hoy')

  if (!profile?.onboarded) return <Onboarding onDone={save} />

  const changeTab = (t: Tab) => {
    setTab(t)
    window.scrollTo({ top: 0 })
  }

  return (
    <AppShell tab={tab} onTab={changeTab}>
      {tab === 'hoy' && <Today profile={profile} picker={picker} onOpenJewelry={() => changeTab('joyero')} />}
      {tab === 'semana' && (
        <Week
          profile={profile}
          anchor={picker.date}
          onSelect={(d) => {
            picker.setDate(d)
            changeTab('hoy')
          }}
        />
      )}
      {tab === 'joyero' && <Jewelry profile={profile} onChange={(ids) => update({ jewelry: ids })} />}
      {tab === 'ajustes' && (
        <Settings
          profile={profile}
          onUpdate={update}
          onReset={() => {
            reset()
            setTab('hoy')
          }}
        />
      )}
    </AppShell>
  )
}
