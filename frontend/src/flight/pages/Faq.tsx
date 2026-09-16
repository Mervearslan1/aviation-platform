import { useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'

export function Faq() {
  const { t } = useI18n()
  const items = [
    [t.faq1q, t.faq1a],
    [t.faq2q, t.faq2a],
    [t.faq3q, t.faq3a],
    [t.faq4q, t.faq4a],
    [t.faq5q, t.faq5a],
  ]
  return (
    <div>
      <section className="relative min-h-[36vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/atmosphere/faq.jpg)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="relative mx-auto flex min-h-[36vh] max-w-6xl flex-col justify-end px-4 py-10">
          <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">05</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-extrabold text-white md:text-6xl">{t.faqTitle}</h1>
          <p className="mt-3 max-w-xl text-lg text-white/85">{t.faqLead}</p>
        </div>
      </section>
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <ol className="space-y-4">
          {items.map(([q, a], i) => (
            <li key={q}>
              <details className="group overflow-hidden rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] open:border-[var(--amber)]">
                <summary className="flex cursor-pointer list-none items-start gap-4 px-5 py-5 md:px-8 md:py-6">
                  <span className="font-mono text-sm tracking-[0.2em] text-[var(--amber)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-xl font-extrabold md:text-2xl">{q}</span>
                  <span className="mt-1 text-2xl leading-none text-[var(--muted)] transition group-open:rotate-45">+</span>
                </summary>
                <p className="border-t border-[var(--stroke)] px-5 py-5 text-lg leading-7 text-[var(--muted)] md:px-8 md:pl-[4.5rem]">
                  {a}
                </p>
              </details>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[var(--stroke)] px-6 py-6">
          <p className="max-w-md text-[var(--muted)]">{t.contactLead}</p>
          <div className="flex flex-wrap gap-3">
            <Button to="/#iletisim">{t.contactTitle}</Button>
            <Button variant="secondary" to="/katil">{t.navJoin}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
