import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api, type Catalog } from '../../shared/api'
import { levelLabel, useI18n } from '../../shared/i18n'
import { useTheme } from '../../shared/theme'
import { Button } from '../../shared/Button'
import { Logo } from '../../shared/Mark'

export function Home() {
  const { t } = useI18n()
  const { theme } = useTheme()
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    api.catalog().then(setCatalog).catch((e: Error) => setError(e.message || t.catalogFail))
  }, [t.catalogFail])
  const art = theme === 'dark' ? '/atmosphere/night.jpg' : '/atmosphere/day.jpg'
  const tower = catalog?.tower[0]
  const pilot = catalog?.pilot[0]
  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="relative min-h-[440px] overflow-hidden rounded-[28px] glass">
        <img src={art} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/20 to-transparent" />
        <div className="relative flex h-full flex-col justify-end gap-4 p-8">
          <Logo />
          <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--amber)]">{t.clearance}</p>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight md:text-5xl">{t.heroTitle}</h1>
          <p className="max-w-lg text-[var(--muted)]">{t.heroLead}</p>
          <div className="flex flex-wrap gap-3">
            <Button to="/tower">{t.doorTower}</Button>
            <Button variant="secondary" to="/pilot">
              {t.doorPilot}
            </Button>
          </div>
        </div>
      </div>
      <div className="grid gap-3">
        <Door to="/tower" code="TWR" title={t.doorTower} hint={t.doorTowerHint} meta={tower ? `${tower.steps.length} ${t.steps}` : '—'} level={levelLabel(t, tower?.difficulty)} />
        <Door to="/pilot" code="PIC" title={t.doorPilot} hint={t.doorPilotHint} meta={pilot ? `${pilot.steps.length} ${t.steps}` : '—'} level={levelLabel(t, pilot?.difficulty)} />
        <Door to="/cockpit" code="ACFT" title={t.doorAc} hint={t.doorAcHint} meta={catalog ? `${catalog.aircraft.length}` : '—'} level={t.open} />
        {error ? <p className="text-sm text-[var(--warn)]">{t.catalogFail}</p> : null}
      </div>
    </section>
  )
}

function Door({
  to,
  code,
  title,
  hint,
  meta,
  level,
}: {
  to: string
  code: string
  title: string
  hint: string
  meta: string
  level: string
}) {
  return (
    <Link
      to={to}
      className="card-lift glass group rounded-3xl p-5 transition hover:-translate-y-0.5 hover:border-[var(--amber)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[11px] tracking-[0.3em] text-[var(--hud)]">{code}</span>
        <span className="rounded-full bg-[var(--bg-2)] px-2 py-0.5 font-mono text-[10px] text-[var(--amber)]">
          {level}
        </span>
      </div>
      <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">{hint}</p>
      <p className="mt-4 font-mono text-[11px] tracking-widest text-[var(--muted)]">{meta} →</p>
    </Link>
  )
}
