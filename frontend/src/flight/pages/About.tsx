import { Link } from 'react-router-dom'
import { useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'

export function About() {
  const { t } = useI18n()
  const pillars = [
    { img: '/atmosphere/tower.jpg', title: t.aboutP1, hint: t.aboutP1h, to: '/tower' },
    { img: '/blog/cover.jpg', title: t.aboutP2, hint: t.aboutP2h, to: '/blog' },
    { img: '/atmosphere/cockpit.jpg', title: t.aboutP3, hint: t.aboutP3h, to: '/katil' },
  ]
  return (
    <div>
      <section className="relative min-h-[52vh] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/atmosphere/night.jpg)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />
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
          <div className="min-h-[280px] overflow-hidden rounded-3xl bg-cover bg-center md:min-h-[360px]" style={{ backgroundImage: 'url(/atmosphere/faq.jpg)' }} />
        </div>
      </section>

      <section className="border-y border-[var(--stroke)] bg-[var(--panel)] py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">03</p>
          <h2 className="mt-2 text-3xl font-extrabold">{t.aboutLine}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {pillars.map((p) => (
              <Link key={p.to} to={p.to} className="group relative min-h-[280px] overflow-hidden rounded-3xl">
                <img src={p.img} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="relative flex h-full min-h-[280px] flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-extrabold">{p.title}</h3>
                  <p className="mt-2 text-white/85">{p.hint}</p>
                </div>
              </Link>
            ))}
          </div>
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
