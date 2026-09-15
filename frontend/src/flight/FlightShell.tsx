import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Logo } from '../shared/Mark'
import { useI18n } from '../shared/i18n'
import { useTheme } from '../shared/theme'
import { token, setToken } from '../shared/api'
import { Button } from '../shared/Button'
import { Welcome } from './Welcome'

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
      <a href="#content" className="skip">
        Skip
      </a>
      <header className="site-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <Logo compact />
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            <LearnMenu />
            <NavLink className={link} to="/blog">
              {t.navBlog}
            </NavLink>
            <NavLink className={link} to="/sss">
              {t.navFaq}
            </NavLink>
            <NavLink className={link} to="/hakkinda">
              {t.navAbout}
            </NavLink>
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            <Button variant="ghost" onClick={() => setLocale(locale === 'tr' ? 'en' : 'tr')}>
              {locale === 'tr' ? 'EN' : 'TR'}
            </Button>
            <Button variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? t.themeLight : t.themeDark}
            </Button>
            {signedIn ? (
              <Button
                variant="ghost"
                onClick={() => {
                  setToken(null)
                  window.location.reload()
                }}
              >
                {t.logout}
              </Button>
            ) : (
              <Button variant="secondary" to="/login">
                {t.login}
              </Button>
            )}
            <Button to="/katil">{t.navJoin}</Button>
          </div>
          <button className="btn btn-secondary lg:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
            {open ? t.close : t.menu}
          </button>
        </div>
        {open ? (
          <div className="border-t border-[var(--stroke)] px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-2">
              <NavLink className={link} to="/tower" onClick={() => setOpen(false)}>
                {t.doorTower}
              </NavLink>
              <NavLink className={link} to="/pilot" onClick={() => setOpen(false)}>
                {t.doorPilot}
              </NavLink>
              <NavLink className={link} to="/cockpit" onClick={() => setOpen(false)}>
                {t.doorAc}
              </NavLink>
              <NavLink className={link} to="/blog" onClick={() => setOpen(false)}>
                {t.navBlog}
              </NavLink>
              <NavLink className={link} to="/sss" onClick={() => setOpen(false)}>
                {t.navFaq}
              </NavLink>
              <NavLink className={link} to="/hakkinda" onClick={() => setOpen(false)}>
                {t.navAbout}
              </NavLink>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button variant="ghost" onClick={() => setLocale(locale === 'tr' ? 'en' : 'tr')}>
                  {locale === 'tr' ? 'EN' : 'TR'}
                </Button>
                <Button variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                  {theme === 'dark' ? t.themeLight : t.themeDark}
                </Button>
                <Button variant="secondary" to="/login" onClick={() => setOpen(false)}>
                  {t.login}
                </Button>
                <Button to="/katil" onClick={() => setOpen(false)}>
                  {t.navJoin}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </header>
      <main id="content" className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <Outlet />
      </main>
      <footer className="mt-8 border-t border-[var(--stroke)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-[var(--muted)]">
          <Logo compact className="h-8" />
          <div className="flex flex-wrap gap-4">
            <Link to="/sss">{t.navFaq}</Link>
            <Link to="/hakkinda">{t.navAbout}</Link>
            <Link to="/katil">{t.navJoin}</Link>
            <Link to="/ops">{t.ops}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function LearnMenu() {
  const { t } = useI18n()
  return (
    <div className="group relative">
      <button type="button" className="rounded-full px-3 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]">
        {t.navLearn}
      </button>
      <div className="invisible absolute left-0 top-full z-20 min-w-44 rounded-xl border border-[var(--stroke)] bg-[var(--panel)] p-2 opacity-0 shadow-lg group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <Link className="block rounded-lg px-3 py-2 hover:bg-[var(--bg)]" to="/tower">
          {t.doorTower}
        </Link>
        <Link className="block rounded-lg px-3 py-2 hover:bg-[var(--bg)]" to="/pilot">
          {t.doorPilot}
        </Link>
        <Link className="block rounded-lg px-3 py-2 hover:bg-[var(--bg)]" to="/cockpit">
          {t.doorAc}
        </Link>
      </div>
    </div>
  )
}

function link({ isActive }: { isActive: boolean }) {
  return `rounded-full px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-[var(--bg-2)] text-[var(--ink)]' : 'text-[var(--muted)] hover:text-[var(--ink)]'
  }`
}
