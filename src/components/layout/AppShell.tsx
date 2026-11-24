import type { ReactNode } from 'react'
import { TabBar, type Tab } from './TabBar'

export function Brand() {
  return (
    <header className="brand">
      <h1 className="brand__name">Lunaria</h1>
      <p className="brand__tagline">your lunar atelier · tu atelier lunar</p>
    </header>
  )
}

interface Props {
  tab: Tab
  onTab: (t: Tab) => void
  children: ReactNode
}

export function AppShell({ tab, onTab, children }: Props) {
  return (
    <>
      <main className="shell">
        <Brand />
        {children}
        <p className="footer-note">Hecho con luna y cariño · tus datos se quedan en este dispositivo</p>
      </main>
      <TabBar tab={tab} onChange={onTab} />
    </>
  )
}
