import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api, type Catalog, type Article } from '../../shared/api'
import { levelLabel, useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'

export function Home() {
  const { t } = useI18n()
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [posts, setPosts] = useState<Article[]>([])
  useEffect(() => {
    api.catalog().then(setCatalog).catch(() => setCatalog(null))
    api.articles(3).then(setPosts).catch(() => setPosts([]))
  }, [])
  const tower = catalog?.tower[0]
  const pilot = catalog?.pilot[0]
  const faqs = [
    [t.faq1q, t.faq1a],
    [t.faq2q, t.faq2a],
    [t.faq3q, t.faq3a],
    [t.faq4q, t.faq4a],
  ]
  return (
    <div className="space-y-16 md:space-y-24">
      <section className="grid overflow-hidden rounded-3xl border border-[var(--stroke)] lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-5 bg-[var(--panel)] p-8 md:p-12">
          <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.heroKicker}</p>
          <h1 className="text-3xl font-semibold leading-tight md:text-5xl">{t.heroTitle}</h1>
          <p className="max-w-xl text-lg text-[var(--muted)]">{t.heroLead}</p>
          <div className="flex flex-wrap gap-3">
            <Button to="/tower">{t.ctaLearn}</Button>
            <Button variant="secondary" to="/katil">
              {t.ctaJoin}
            </Button>
          </div>
        </div>
        <div
          className="min-h-[240px] bg-cover bg-center lg:min-h-[480px]"
          style={{ backgroundImage: 'var(--hero-img)' }}
          role="img"
          aria-hidden="true"
        />
      </section>

      <section id="egitim">
        <h2 className="text-2xl font-semibold md:text-3xl">{t.learnTitle}</h2>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">{t.learnLead}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Door to="/tower" code="TWR" title={t.doorTower} hint={t.doorTowerHint} meta={tower ? `${tower.steps.length} ${t.steps}` : '—'} level={levelLabel(t, tower?.difficulty)} />
          <Door to="/pilot" code="PIC" title={t.doorPilot} hint={t.doorPilotHint} meta={pilot ? `${pilot.steps.length} ${t.steps}` : '—'} level={levelLabel(t, pilot?.difficulty)} />
          <Door to="/cockpit" code="ACFT" title={t.doorAc} hint={t.doorAcHint} meta={catalog ? String(catalog.aircraft.length) : '—'} level={t.open} />
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">{t.blogTitle}</h2>
            <p className="mt-2 text-[var(--muted)]">{t.blogLead}</p>
          </div>
          <Button variant="secondary" to="/blog">
            {t.navBlog}
          </Button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {posts.length === 0 ? (
            <p className="text-[var(--muted)]">{t.blogEmpty}</p>
          ) : (
            posts.map((p) => (
              <Link key={p.id} to="/blog" className="surface rounded-2xl p-5 hover:border-[var(--amber)]">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">{p.summary}</p>
              </Link>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold md:text-3xl">{t.faqTitle}</h2>
        <div className="mt-6 space-y-3">
          {faqs.map(([q, a]) => (
            <details key={q} className="surface rounded-2xl px-5 py-4">
              <summary className="cursor-pointer list-none text-lg font-medium">{q}</summary>
              <p className="mt-2 text-[var(--muted)]">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] p-8 md:grid-cols-[1.4fr_0.6fr] md:p-10">
        <div>
          <h2 className="text-2xl font-semibold md:text-3xl">{t.aboutTitle}</h2>
          <p className="mt-3 text-lg text-[var(--muted)]">{t.aboutLead}</p>
          <Button className="mt-6" variant="secondary" to="/hakkinda">
            {t.navAbout}
          </Button>
        </div>
        <div className="flex flex-col justify-center gap-3 rounded-2xl bg-[var(--bg)] p-6">
          <p className="font-medium">{t.joinTitle}</p>
          <p className="text-sm text-[var(--muted)]">{t.joinLead}</p>
          <Button to="/katil">{t.navJoin}</Button>
        </div>
      </section>
    </div>
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
    <Link to={to} className="surface flex flex-col rounded-2xl p-6 hover:border-[var(--amber)]">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs tracking-[0.28em] text-[var(--hud)]">{code}</span>
        <span className="rounded-full bg-[var(--bg)] px-2 py-0.5 font-mono text-[11px] text-[var(--amber)]">{level}</span>
      </div>
      <h3 className="mt-4 text-2xl font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-[var(--muted)]">{hint}</p>
      <span className="mt-5 font-medium">{meta} →</span>
    </Link>
  )
}
