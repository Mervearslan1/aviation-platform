import { Link, NavLink, Outlet } from 'react-router-dom'
import { Mark } from '../shared/Mark'
import { useI18n } from '../shared/i18n'
import { useTheme } from '../shared/theme'

export function OpsShell() {
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useTheme()
  return (
    <div className="min-h-screen bg-[var(--bg-2)]">
      <header className="border-b border-[var(--stroke)] bg-[var(--bg)] px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link to="/ops" className="flex items-center gap-3">
            <Mark className="h-8 w-8 text-[var(--ink)]" />
            <span>
              <span className="block font-mono text-[10px] tracking-[0.35em] text-[var(--muted)]">{t.ops}</span>
              <span className="block text-sm font-semibold tracking-wide">{t.opsTitle}</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <button className={chip} onClick={() => setLocale(locale === 'tr' ? 'en' : 'tr')}>
              {locale === 'tr' ? 'EN' : 'TR'}
            </button>
            <button className={chip} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? t.themeLight : t.themeDark}
            </button>
            <Link className={`${chip} text-[var(--hud)]`} to="/">
              {t.flight}
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[200px_1fr]">
        <aside className="flex flex-col gap-1 text-sm">
          <NavLink to="/ops" end className={item}>
            {t.opsTitle}
          </NavLink>
          <NavLink to="/ops/users" className={item}>
            {t.opsUsers}
          </NavLink>
          <NavLink to="/ops/content" className={item}>
            {t.opsContent}
          </NavLink>
          <NavLink to="/ops/curriculum" className={item}>
            {t.opsCurriculum}
          </NavLink>
          <NavLink to="/ops/aircraft" className={item}>
            {t.opsAircraft}
          </NavLink>
          <NavLink to="/ops/audit" className={item}>
            {t.opsAudit}
          </NavLink>
        </aside>
        <section className="rounded-2xl border border-[var(--stroke)] bg-[var(--bg)] p-6">
          <Outlet />
        </section>
      </div>
    </div>
  )
}

function item({ isActive }: { isActive: boolean }) {
  return `rounded-lg px-3 py-2 ${isActive ? 'bg-[var(--bg-2)] font-medium' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`
}

const chip = 'rounded-md border border-[var(--stroke)] px-2.5 py-1'
