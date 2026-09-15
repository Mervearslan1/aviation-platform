import { useI18n } from '../../shared/i18n'
import { Logo } from '../../shared/Mark'

const desks = ['opsUsers', 'opsContent', 'opsCurriculum', 'opsAircraft', 'opsAudit', 'opsApps'] as const

export function OpsDashboard() {
  const { t } = useI18n()
  return (
    <div>
      <Logo compact />
      <h1 className="mt-4 text-2xl font-semibold">{t.opsTitle}</h1>
      <p className="mt-2 max-w-2xl text-[var(--muted)]">{t.opsLead}</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {desks.map((key) => (
          <article key={key} className="rounded-xl border border-[var(--stroke)] p-4">
            <h2 className="font-medium">{t[key]}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{t.opsSoon}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export function OpsDesk({ k }: { k: (typeof desks)[number] }) {
  const { t } = useI18n()
  return (
    <div>
      <h1 className="text-2xl font-semibold">{t[k]}</h1>
      <p className="mt-2 text-[var(--muted)]">{t.opsSoon}</p>
    </div>
  )
}
