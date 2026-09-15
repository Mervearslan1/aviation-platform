import { Link } from 'react-router-dom'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
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
  const [sent, setSent] = useState(false)
  useEffect(() => {
    api.catalog().then(setCatalog).catch(() => setCatalog(null))
    api.articles(6).then(setPosts).catch(() => setPosts([]))
  }, [])
  const tower = catalog?.tower[0]
  const pilot = catalog?.pilot[0]
  const featured = posts[0] || FALLBACK_POST
  const rest = posts.filter((p) => p.slug !== featured.slug).slice(0, 3)
  const faqs = [
    [t.faq1q, t.faq1a],
    [t.faq2q, t.faq2a],
    [t.faq3q, t.faq3a],
  ]
  return (
    <div>
      <section className="relative min-h-[42vh] overflow-hidden">
        <div className="welcome-motion absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'var(--hero-img)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="relative mx-auto flex min-h-[42vh] max-w-6xl flex-col justify-end px-4 py-8">
          <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.heroKicker}</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-extrabold text-white md:text-5xl">{t.heroTitle}</h1>
          <p className="mt-3 max-w-xl text-white/85">{t.heroLead}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16" id="egitim">
        <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.whyKicker}</p>
        <h2 className="mt-2 max-w-3xl text-2xl font-extrabold md:text-4xl">{t.whyTitle}</h2>
        <p className="mt-4 max-w-3xl leading-7 text-[var(--muted)]">{t.whyLead}</p>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <Door to="/tower" img="/atmosphere/tower.jpg" code="TWR" title={t.doorTower} hint={t.doorTowerHint} meta={tower ? `${tower.steps.length} ${t.steps}` : ''} level={levelLabel(t, tower?.difficulty)} />
          <Door to="/pilot" img="/atmosphere/pilot.jpg" code="PIC" title={t.doorPilot} hint={t.doorPilotHint} meta={pilot ? `${pilot.steps.length} ${t.steps}` : ''} level={levelLabel(t, pilot?.difficulty)} />
          <Door to="/cockpit" img="/atmosphere/cockpit.jpg" code="ACFT" title={t.doorAc} hint={t.doorAcHint} meta={catalog ? String(catalog.aircraft.length) : ''} level={t.open} />
        </div>
      </section>

      <section id="blog" className="blog-scene border-y border-[var(--stroke)] py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.blogKicker}</p>
          <h2 className="mt-2 max-w-3xl text-3xl font-extrabold md:text-5xl">{t.blogTitle}</h2>
          <p className="mt-4 max-w-3xl leading-7 text-[var(--muted)]">{t.blogManifest}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button to="/blog">{t.blogAll}</Button>
            <Button variant="secondary" to="/blog/yaz">{t.blogWriteCta}</Button>
          </div>
          <Link to={`/blog/${featured.slug}`} className="article-sheet mt-8 grid overflow-hidden rounded-3xl md:grid-cols-[1.2fr_0.8fr]">
            <div className="min-h-[240px] bg-cover bg-center md:min-h-[360px]" style={{ backgroundImage: 'url(/blog/cover.jpg)' }} />
            <div className="flex flex-col justify-center p-6 md:p-10">
              <p className="font-mono text-xs tracking-[0.2em] text-[var(--amber)]">{t.blogKicker}</p>
              <h3 className="mt-2 text-2xl font-extrabold md:text-3xl">{featured.title}</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">{featured.summary}</p>
              <span className="mt-6 font-extrabold">{t.navBlog} →</span>
            </div>
          </Link>
          {rest.length > 0 ? (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {rest.map((p) => (
                <Link key={p.id} to={`/blog/${p.slug}`} className="surface rounded-2xl p-5 hover:border-[var(--amber)]">
                  <h3 className="font-extrabold">{p.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">{p.summary}</p>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section id="hakkinda" className="py-10 md:py-14">
        <Band img="/atmosphere/night.jpg" flip kicker={t.aboutKicker} title={t.whoTitle} body={`${t.whoLead} ${t.aboutLead}`} to="/hakkinda" cta={t.navAbout} />
      </section>

      <section className="py-10 md:py-14">
        <Band img="/atmosphere/day.jpg" flip={false} kicker={t.faqHome} title={t.navFaq} body="">
          <div className="space-y-2">
            {faqs.map(([q, a]) => (
              <details key={q} className="rounded-xl border border-[var(--stroke)] bg-[var(--bg)] px-4 py-3">
                <summary className="cursor-pointer font-semibold">{q}</summary>
                <p className="mt-2 text-sm text-[var(--muted)]">{a}</p>
              </details>
            ))}
            <Link to="/sss" className="inline-block pt-2 text-sm font-extrabold">{t.navFaq} →</Link>
          </div>
        </Band>
      </section>

      <section id="iletisim" className="py-10 md:py-14">
        <div className="mx-auto grid max-w-6xl items-stretch md:grid-cols-2">
          <div className="flex flex-col justify-center px-4 py-8 md:px-8">
            <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.navJoin}</p>
            <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">{t.contactTitle}</h2>
            <p className="mt-3 text-[var(--muted)]">{t.contactLead}</p>
            {sent ? (
              <p className="mt-6 text-[var(--good)]">{t.contactOk}</p>
            ) : (
              <form
                className="mt-5 space-y-3"
                onSubmit={(e: FormEvent) => {
                  e.preventDefault()
                  setSent(true)
                }}
              >
                <input required className={field} placeholder={t.displayName} />
                <input required type="email" className={field} placeholder={t.email} />
                <textarea required rows={4} className={field} placeholder={t.contactLead} />
                <div className="flex flex-wrap gap-3">
                  <Button type="submit">{t.contactSend}</Button>
                  <Button variant="secondary" to="/katil">{t.navJoin}</Button>
                </div>
              </form>
            )}
          </div>
          <div className="min-h-[240px] bg-cover bg-center" style={{ backgroundImage: 'url(/atmosphere/tower.jpg)' }} />
        </div>
      </section>
    </div>
  )
}

const field = 'w-full rounded-xl border border-[var(--stroke)] bg-[var(--bg)] px-3 py-3 text-[var(--ink)]'

function Band({
  img,
  flip,
  kicker,
  title,
  body,
  to,
  cta,
  children,
}: {
  img: string
  flip: boolean
  kicker: string
  title: string
  body: string
  to?: string
  cta?: string
  children?: ReactNode
}) {
  return (
    <div className={`mx-auto grid max-w-6xl items-stretch md:grid-cols-2 ${flip ? 'md:[&>*:first-child]:order-2' : ''}`}>
      <div className="min-h-[220px] bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
      <div className="flex flex-col justify-center px-4 py-8 md:px-8">
        <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{kicker}</p>
        <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">{title}</h2>
        {body ? <p className="mt-3 leading-7 text-[var(--muted)]">{body}</p> : null}
        {children}
        {to && cta ? (
          <Link to={to} className="mt-5 inline-block font-extrabold">
            {cta} →
          </Link>
        ) : null}
      </div>
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
    <Link to={to} className="group relative min-h-[200px] overflow-hidden rounded-2xl">
      <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
      <div className="relative flex h-full min-h-[200px] flex-col justify-end p-5 text-white">
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
