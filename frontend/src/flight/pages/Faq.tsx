import { useI18n } from '../../shared/i18n'

export function Faq() {
  const { t } = useI18n()
  const items = [
    [t.faq1q, t.faq1a],
    [t.faq2q, t.faq2a],
    [t.faq3q, t.faq3a],
    [t.faq4q, t.faq4a],
  ]
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold md:text-4xl">{t.faqTitle}</h1>
      <div className="mt-8 space-y-3">
        {items.map(([q, a]) => (
          <details key={q} className="surface rounded-2xl px-5 py-4" open>
            <summary className="cursor-pointer text-lg font-medium">{q}</summary>
            <p className="mt-2 text-[var(--muted)]">{a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
