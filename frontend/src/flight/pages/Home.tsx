import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api, type Catalog, type Article } from '../../shared/api'
import { levelLabel, useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'

const FALLBACK_POST: Article = {
  id: 0,
  title: 'Read-back: duyduğunu geri ver',
  slug: 'read-back',
  summary:
    'Kule bir talimat verir, pilot aynı anlamı kendi cümlesiyle doğrular. Bu yazı eğitim hattının omurgası; kapak ve içerik senin taslağınla değişecek.',
}

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
  const featured = posts[0] || FALLBACK_POST
  return (
    <div>
      <section className="relative min-h-[70vh] overflow-hidden">
        <div className="welcome-motion absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'var(--hero-img)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-4 py-10 md:py-16">
          <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.heroKicker}</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold text-white md:text-5xl">{t.heroTitle}</h1>
          <p className="mt-3 max-w-xl text-base text-white/85 md:text-lg">{t.heroLead}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button to="/tower">{t.ctaLearn}</Button>
            <Button variant="secondary" to="/katil">
              {t.ctaJoin}
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-3 px-4 py-6 md:grid-cols-3 md:py-8">
        <Door to="/tower" img="/atmosphere/tower.jpg" code="TWR" title={t.doorTower} hint={t.doorTowerHint} meta={tower ? `${tower.steps.length} ${t.steps}` : ''} level={levelLabel(t, tower?.difficulty)} />
        <Door to="/pilot" img="/atmosphere/pilot.jpg" code="PIC" title={t.doorPilot} hint={t.doorPilotHint} meta={pilot ? `${pilot.steps.length} ${t.steps}` : ''} level={levelLabel(t, pilot?.difficulty)} />
        <Door to="/cockpit" img="/atmosphere/cockpit.jpg" code="ACFT" title={t.doorAc} hint={t.doorAcHint} meta={catalog ? String(catalog.aircraft.length) : ''} level={t.open} />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <Link to="/blog" className="group grid overflow-hidden rounded-3xl border border-[var(--stroke)] md:grid-cols-2">
          <div className="min-h-[220px] bg-cover bg-center md:min-h-[320px]" style={{ backgroundImage: 'url(/atmosphere/blog.jpg)' }} />
          <div className="flex flex-col justify-center bg-[var(--panel)] p-6 md:p-10">
            <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.navBlog}</p>
            <h2 className="mt-2 text-2xl font-semibold md:text-3xl">{featured.title}</h2>
            <p className="mt-3 text-[var(--muted)]">{featured.summary}</p>
            <span className="mt-5 font-medium group-hover:text-[var(--amber)]">{t.navBlog} →</span>
          </div>
        </Link>
      </section>

      <section className="border-t border-[var(--stroke)] bg-[var(--panel)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6">
          <p className="max-w-xl text-[var(--muted)]">{t.joinLead}</p>
          <Button to="/katil">{t.navJoin}</Button>
        </div>
      </section>
    </div>
  )
}

function Door({
  to,
  img,
  code,
  title,
  hint,
  meta,
  level,
}: {
  to: string
  img: string
  code: string
  title: string
  hint: string
  meta: string
  level: string
}) {
  return (
    <Link to={to} className="group relative min-h-[240px] overflow-hidden rounded-2xl">
      <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
      <div className="relative flex h-full min-h-[240px] flex-col justify-end p-5 text-white">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono tracking-[0.28em] text-[var(--amber)]">{code}</span>
          <span className="rounded-full bg-black/40 px-2 py-0.5 font-mono">{level}</span>
        </div>
        <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-white/85">{hint}</p>
        {meta ? <p className="mt-2 text-sm font-medium">{meta} →</p> : null}
      </div>
    </Link>
  )
}
