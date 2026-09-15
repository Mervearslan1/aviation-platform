import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api, type Catalog, type Article } from '../../shared/api'
import { levelLabel, useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'

const FALLBACK_POST: Article = {
  id: 0,
  title: 'Havacılıkta iniş safhasının kritik / operasyonel önemi',
  slug: 'inis-safhasinin-kritik-onemi',
  summary: '2025–2026’daki iki ölümcül pist kazası üzerinden iniş operasyonunun aşamaları ve emniyet dersleri.',
}

export function Home() {
  const { t } = useI18n()
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [posts, setPosts] = useState<Article[]>([])
  const [focus, setFocus] = useState<'learn' | 'try' | 'read'>('learn')
  useEffect(() => {
    api.catalog().then(setCatalog).catch(() => setCatalog(null))
    api.articles(3).then(setPosts).catch(() => setPosts([]))
  }, [])
  const tower = catalog?.tower[0]
  const pilot = catalog?.pilot[0]
  const featured = posts[0] || FALLBACK_POST
  const faqs = [
    [t.faq1q, t.faq1a],
    [t.faq2q, t.faq2a],
    [t.faq3q, t.faq3a],
  ]
  return (
    <div>
      <section className="relative min-h-[48vh] overflow-hidden">
        <div className="welcome-motion absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'var(--hero-img)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="relative mx-auto flex min-h-[48vh] max-w-6xl flex-col justify-end px-4 py-8 md:py-10">
          <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.heroKicker}</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-extrabold text-white md:text-5xl">{t.heroTitle}</h1>
          <p className="mt-3 max-w-xl text-white/85">{t.heroLead}</p>
        </div>
      </section>

      <section className="border-b border-[var(--stroke)] bg-[var(--panel)]">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
          <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.whyKicker}</p>
          <h2 className="mt-2 max-w-3xl text-2xl font-extrabold md:text-4xl">{t.whyTitle}</h2>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">{t.whyLead}</p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <WhyCard active={focus === 'learn'} onClick={() => { setFocus('learn'); document.getElementById('egitim')?.scrollIntoView({ behavior: 'smooth' }) }} kicker="01" title={t.whyLearn} hint={t.whyLearnHint} />
            <WhyCard active={focus === 'try'} onClick={() => { setFocus('try'); document.getElementById('egitim')?.scrollIntoView({ behavior: 'smooth' }) }} kicker="02" title={t.whyTry} hint={t.whyTryHint} />
            <WhyCard active={focus === 'read'} onClick={() => { setFocus('read'); document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' }) }} kicker="03" title={t.whyRead} hint={t.whyReadHint} />
          </div>
        </div>
      </section>

      <section id="egitim" className="mx-auto max-w-6xl px-4 py-8">
        <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.pathKicker}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Door to="/tower" img="/atmosphere/tower.jpg" code="TWR" title={t.doorTower} hint={t.doorTowerHint} meta={tower ? `${tower.steps.length} ${t.steps}` : ''} level={levelLabel(t, tower?.difficulty)} />
          <Door to="/pilot" img="/atmosphere/pilot.jpg" code="PIC" title={t.doorPilot} hint={t.doorPilotHint} meta={pilot ? `${pilot.steps.length} ${t.steps}` : ''} level={levelLabel(t, pilot?.difficulty)} />
          <Door to="/cockpit" img="/atmosphere/cockpit.jpg" code="ACFT" title={t.doorAc} hint={t.doorAcHint} meta={catalog ? String(catalog.aircraft.length) : ''} level={t.open} />
        </div>
      </section>

      <section id="blog" className="relative overflow-hidden border-y border-[var(--stroke)]">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url(/blog/bg.jpg)' }} />
        <div className="relative mx-auto max-w-6xl px-4 py-10">
          <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.blogKicker}</p>
          <Link to={`/blog/${featured.slug}`} className="mt-4 grid overflow-hidden rounded-3xl border border-[var(--stroke)] bg-[var(--panel)] md:grid-cols-2">
            <div className="min-h-[200px] bg-cover bg-center md:min-h-[300px]" style={{ backgroundImage: 'url(/blog/cover.jpg)' }} />
            <div className="flex flex-col justify-center p-6 md:p-10">
              <h2 className="text-2xl font-extrabold md:text-3xl">{featured.title}</h2>
              <p className="mt-3 text-[var(--muted)]">{featured.summary}</p>
              <span className="mt-6 font-extrabold">{t.navBlog} →</span>
            </div>
          </Link>
        </div>
      </section>

      <section id="hakkinda" className="mx-auto max-w-6xl px-4 py-10">
        <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.aboutKicker}</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold">{t.whoTitle}</h2>
            <p className="mt-3 text-[var(--muted)]">{t.whoLead}</p>
            <p className="mt-3 text-[var(--muted)]">{t.aboutLead}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button to="/hakkinda">{t.navAbout}</Button>
              <Button variant="secondary" to="/katil">{t.navJoin}</Button>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold">{t.faqHome}</h2>
            <div className="mt-4 space-y-2">
              {faqs.map(([q, a]) => (
                <details key={q} className="surface rounded-2xl px-4 py-3">
                  <summary className="cursor-pointer font-semibold">{q}</summary>
                  <p className="mt-2 text-sm text-[var(--muted)]">{a}</p>
                </details>
              ))}
            </div>
            <Link to="/sss" className="mt-3 inline-block text-sm font-semibold">{t.navFaq} →</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function WhyCard({
  active,
  onClick,
  kicker,
  title,
  hint,
}: {
  active: boolean
  onClick: () => void
  kicker: string
  title: string
  hint: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition ${
        active ? 'border-[var(--amber)] bg-[var(--bg)]' : 'border-[var(--stroke)] bg-[var(--bg)]/40 hover:border-[var(--amber)]'
      }`}
    >
      <span className="font-mono text-xs text-[var(--amber)]">{kicker}</span>
      <h3 className="mt-2 text-xl font-extrabold">{title}</h3>
      <p className="mt-1 text-sm text-[var(--muted)]">{hint}</p>
    </button>
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
    <Link to={to} className="group relative min-h-[220px] overflow-hidden rounded-2xl">
      <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
      <div className="relative flex h-full min-h-[220px] flex-col justify-end p-5 text-white">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono tracking-[0.28em] text-[var(--amber)]">{code}</span>
          <span className="rounded-full bg-black/40 px-2 py-0.5 font-mono">{level}</span>
        </div>
        <h3 className="mt-2 text-2xl font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-white/85">{hint}</p>
        {meta ? <p className="mt-2 text-sm font-medium">{meta} →</p> : null}
      </div>
    </Link>
  )
}
