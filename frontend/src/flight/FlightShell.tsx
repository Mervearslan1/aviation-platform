import { Link, NavLink, Outlet } from 'react-router-dom'
import { Logo } from '../shared/Mark'
import { UtcClock } from '../shared/Clock'
import { useI18n } from '../shared/i18n'
import { useTheme } from '../shared/theme'
import { token, setToken } from '../shared/api'
import { Button } from '../shared/Button'

export function FlightShell() {
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useTheme()
  const signedIn = Boolean(token())
  return (
    <div className="relative min-h-screen overflow-hidden">
      <a href="#content" className="skip">
        Skip
      </a>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
        style={{
          background: `linear-gradient(90deg, var(--horizon-sky), var(--royal), var(--horizon-ground))`,
        }}
      />
      <header className="relative z-10 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
        <Link to="/" className="flex items-center gap-3">
          <Logo compact />
          <span className="font-mono text-[11px] tracking-[0.35em] text-[var(--muted)]">{t.flight}</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 font-mono text-xs" aria-label="Flight">
          <NavLink className={tab} to="/tower">
            TWR
          </NavLink>
          <NavLink className={tab} to="/pilot">
            PIC
          </NavLink>
          <NavLink className={tab} to="/cockpit">
            ACFT
          </NavLink>
        </nav>
        <div className="flex flex-wrap items-center gap-2 text-[var(--muted)]">
          <span className="hidden font-mono text-[11px] sm:inline">
            {t.utc} <UtcClock />
          </span>
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
            <Button variant="primary" to="/login" className="min-h-9 px-4 text-sm">
              {t.login}
            </Button>
          )}
          <Button variant="secondary" to="/ops" className="min-h-9 px-4 text-sm">
            {t.ops}
          </Button>
        </div>
      </header>
      <main id="content" className="relative z-10 mx-auto max-w-6xl px-5 pb-16">
        <Outlet />
      </main>
    </div>
  )
}

function tab({ isActive }: { isActive: boolean }) {
  return `rounded-full px-3 py-2 tracking-[0.2em] ${
    isActive
      ? 'bg-[var(--btn)] text-[var(--btn-ink)]'
      : 'text-[var(--muted)] hover:text-[var(--ink)]'
  }`
}
