import { Link, NavLink, Outlet } from 'react-router-dom'
import { Mark } from '../shared/Mark'
import { UtcClock } from '../shared/Clock'
import { useI18n } from '../shared/i18n'
import { useTheme } from '../shared/theme'
import { token, setToken } from '../shared/api'

export function FlightShell() {
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useTheme()
  const signedIn = Boolean(token())
  return (
    <div className="relative min-h-screen overflow-hidden hud-scan">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-2"
        style={{
          background: `linear-gradient(90deg, var(--horizon-sky) 0 50%, var(--horizon-ground) 50% 100%)`,
        }}
      />
      <header className="relative z-10 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <Link to="/" className="flex items-center gap-3 text-[var(--hud)]">
          <Mark className="h-9 w-9" />
          <span className="leading-none">
            <span className="block font-mono text-[11px] tracking-[0.35em]">{t.flight}</span>
            <span className="block text-lg font-semibold tracking-[0.18em] text-[var(--ink)]">
              {t.brand}
            </span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 font-mono text-xs">
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
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[var(--muted)]">
          <span className="hidden sm:inline">
            {t.utc} <UtcClock />
          </span>
          <button className={chip} onClick={() => setLocale(locale === 'tr' ? 'en' : 'tr')}>
            {locale === 'tr' ? 'EN' : 'TR'}
          </button>
          <button className={chip} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? t.themeLight : t.themeDark}
          </button>
          {signedIn ? (
            <button
              className={chip}
              onClick={() => {
                setToken(null)
                window.location.reload()
              }}
            >
              {t.logout}
            </button>
          ) : (
            <Link className={chip} to="/login">
              {t.login}
            </Link>
          )}
          <Link className={`${chip} text-[var(--amber)]`} to="/ops">
            {t.ops}
          </Link>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-6xl px-5 pb-16">
        <Outlet />
      </main>
    </div>
  )
}

function tab({ isActive }: { isActive: boolean }) {
  return `rounded-full px-3 py-1.5 tracking-[0.2em] ${
    isActive ? 'bg-[var(--hud)] text-[var(--bg)]' : 'text-[var(--muted)] hover:text-[var(--ink)]'
  }`
}

const chip = 'rounded-full border border-[var(--stroke)] px-3 py-1.5 hover:border-[var(--hud)]'
