import { useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Logo } from '../shared/Mark'
import { useI18n } from '../shared/i18n'
import { useTheme } from '../shared/theme'
import { token } from '../shared/api'
import { Button } from '../shared/Button'
import { Welcome } from './Welcome'
import { IconClose, IconFlagGb, IconFlagTr, IconMoon, IconSun, IconUser } from '../shared/Icons'

export function FlightShell() {
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useTheme()
  const signedIn = Boolean(token())
  const [open, setOpen] = useState(false)
  const [welcome, setWelcome] = useState(() => !localStorage.getItem('aviationWelcomed'))
  const dismissWelcome = () => {
    localStorage.setItem('aviationWelcomed', '1')
    setWelcome(false)
  }
  return (
    <div className="min-h-screen">
      {welcome ? <Welcome onDone={dismissWelcome} /> : null}
      <a href="#content" className="skip">Skip</a>
      <header className="site-header">
        <div className="flex w-full items-center px-3 py-2 md:px-5">
          <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
            <Logo compact />
          </Link>
          <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
            <LearnMenu />
            <NavLink className={link} to="/blog">{t.navBlog}</NavLink>
            <NavLink className={link} to="/blog/yaz">{t.create}</NavLink>
            <NavLink className={link} to="/sss">{t.navFaq}</NavLink>
            <NavLink className={link} to="/hakkinda">{t.navAbout}</NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <IconBtn label={locale === 'tr' ? 'English' : 'Türkçe'} onClick={() => setLocale(locale === 'tr' ? 'en' : 'tr')}>
              {locale === 'tr' ? <IconFlagTr /> : <IconFlagGb />}
            </IconBtn>
            <IconBtn label={theme === 'dark' ? t.themeLight : t.themeDark} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
            </IconBtn>
            <Link to="/login" className="grid h-10 w-10 place-items-center rounded-full text-[var(--ink)] hover:bg-[var(--bg-2)]" aria-label={signedIn ? t.logout : t.login}>
              <IconUser />
            </Link>
            <Button to="/katil" className="hidden min-h-10 px-4 text-sm sm:inline-flex">{t.navJoin}</Button>
            <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-[var(--bg-2)] md:hidden" onClick={() => setOpen((v) => !v)} aria-label={t.menu}>
              {open ? <IconClose /> : <span className="font-mono text-lg">≡</span>}
            </button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-[var(--stroke)] px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              <NavLink className={link} to="/tower" onClick={() => setOpen(false)}>{t.doorTower}</NavLink>
              <NavLink className={link} to="/pilot" onClick={() => setOpen(false)}>{t.doorPilot}</NavLink>
              <NavLink className={link} to="/cockpit" onClick={() => setOpen(false)}>{t.doorAc}</NavLink>
              <NavLink className={link} to="/blog" onClick={() => setOpen(false)}>{t.navBlog}</NavLink>
              <NavLink className={link} to="/blog/yaz" onClick={() => setOpen(false)}>{t.create}</NavLink>
              <NavLink className={link} to="/sss" onClick={() => setOpen(false)}>{t.navFaq}</NavLink>
              <NavLink className={link} to="/hakkinda" onClick={() => setOpen(false)}>{t.navAbout}</NavLink>
              <Button to="/katil">{t.navJoin}</Button>
            </div>
          </div>
        ) : null}
      </header>
      <main id="content">
        <Outlet />
      </main>
      <footer className="border-t border-[var(--stroke)]">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm text-[var(--muted)] md:px-5">
          <Logo compact className="h-8" />
          <div className="flex flex-wrap gap-4">
            <Link to="/blog">{t.navBlog}</Link>
            <Link to="/sss">{t.navFaq}</Link>
            <Link to="/katil">{t.navJoin}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="grid h-10 w-10 place-items-center rounded-full text-[var(--ink)] hover:bg-[var(--bg-2)]">
      {children}
    </button>
  )
}

function LearnMenu() {
  const { t } = useI18n()
  return (
    <div className="group relative">
      <button type="button" className="nav-link px-3 py-2">{t.navLearn}</button>
      <div className="invisible absolute left-0 top-full z-20 min-w-40 rounded-xl border border-[var(--stroke)] bg-[var(--panel)] p-2 opacity-0 shadow-lg group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <Link className="block rounded-lg px-3 py-2 hover:bg-[var(--bg)]" to="/tower">{t.doorTower}</Link>
        <Link className="block rounded-lg px-3 py-2 hover:bg-[var(--bg)]" to="/pilot">{t.doorPilot}</Link>
        <Link className="block rounded-lg px-3 py-2 hover:bg-[var(--bg)]" to="/cockpit">{t.doorAc}</Link>
      </div>
    </div>
  )
}

function link({ isActive }: { isActive: boolean }) {
  return `nav-link px-3 py-2 ${isActive ? 'text-[var(--ink)]' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`
}
