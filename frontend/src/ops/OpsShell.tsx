import { Link, NavLink, Outlet } from 'react-router-dom'
import { Logo } from '../shared/Mark'
import { useI18n } from '../shared/i18n'
import { useTheme } from '../shared/theme'
import { Button } from '../shared/Button'

export function OpsShell() {
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useTheme()
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--bg-2)]">
      <header className="border-b border-[var(--stroke)] bg-[var(--bg)] px-6 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link to="/ops" className="flex items-center gap-3">
            <Logo compact />
            <span>
              <span className="block font-mono text-[10px] tracking-[0.35em] text-[var(--muted)]">{t.ops}</span>
              <span className="block text-sm font-semibold tracking-wide">{t.opsTitle}</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setLocale(locale === 'tr' ? 'en' : 'tr')}>
              {locale === 'tr' ? 'EN' : 'TR'}
            </Button>
            <Button variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? t.themeLight : t.themeDark}
            </Button>
            <Button to="/">{t.flight}</Button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-6 py-8 lg:grid-cols-[200px_1fr]">
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
          <NavLink to="/ops/applications" className={item}>
            {t.opsApps}
          </NavLink>
          <NavLink to="/ops/feedback" className={item}>
            {t.opsFeedback}
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
