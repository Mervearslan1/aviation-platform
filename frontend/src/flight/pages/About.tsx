import { useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'

export function About() {
  const { t } = useI18n()
  return (
    <div>
      <section className="relative min-h-[52vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/atmosphere/about-hero.jpg)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        <div className="relative mx-auto flex min-h-[52vh] max-w-6xl flex-col justify-end px-4 py-12">
          <img src="/brand/logo-dark.png" alt="Aviation Platform" className="h-14 w-auto object-contain" />
          <p className="mt-6 font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.aboutKicker}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold text-white md:text-6xl">{t.aboutTitle}</h1>
          <p className="mt-4 max-w-2xl text-xl text-white/90 md:text-2xl">{t.aboutLine}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold md:text-4xl">{t.whoTitle}</h2>
            <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{t.aboutLead}</p>
            <p className="mt-4 leading-8 text-[var(--muted)]">{t.whoLead}</p>
            <p className="mt-4 leading-8 text-[var(--muted)]">{t.aboutBody}</p>
          </div>
          <div className="min-h-[280px] overflow-hidden rounded-3xl bg-cover bg-center md:min-h-[360px]" style={{ backgroundImage: 'url(/atmosphere/about-side.jpg)' }} />
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col items-start gap-5 px-4 py-12 md:flex-row md:items-center md:justify-between md:py-16">
        <p className="max-w-xl text-xl font-semibold md:text-2xl">{t.joinLead}</p>
        <div className="flex flex-wrap gap-3">
          <Button to="/tower">{t.ctaLearn}</Button>
          <Button variant="secondary" to="/katil">{t.ctaJoin}</Button>
        </div>
      </section>
    </div>
  )
}
