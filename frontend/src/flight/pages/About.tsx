import { useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'
import { Logo } from '../../shared/Mark'

export function About() {
  const { t } = useI18n()
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Logo />
      <h1 className="mt-6 text-3xl font-semibold md:text-4xl">{t.aboutTitle}</h1>
      <p className="mt-4 text-lg text-[var(--muted)]">{t.aboutLead}</p>
      <p className="mt-4 text-[var(--muted)]">{t.aboutBody}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button to="/tower">{t.ctaLearn}</Button>
        <Button variant="secondary" to="/katil">
          {t.ctaJoin}
        </Button>
      </div>
    </div>
  )
}
