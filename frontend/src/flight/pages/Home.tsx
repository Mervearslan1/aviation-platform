import { Link } from 'react-router-dom'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { api, type Catalog } from '../../shared/api'
import { FIELD_POSTS } from '../../shared/posts'
import { levelLabel, useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'

export function Home() {
  const { t } = useI18n()
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [sent, setSent] = useState(false)
  const [hero, setHero] = useState(0)
  const [blogI, setBlogI] = useState(0)
  useEffect(() => {
    api.catalog().then(setCatalog).catch(() => setCatalog(null))
  }, [])
  const slides = [
    { kicker: t.heroKicker, title: t.heroTitle, lead: t.heroLead },
    { kicker: t.hero2Kicker, title: t.hero2Title, lead: t.hero2Lead },
    { kicker: t.hero3Kicker, title: t.hero3Title, lead: t.hero3Lead },
    { kicker: t.hero4Kicker, title: t.hero4Title, lead: t.hero4Lead },
    { kicker: t.hero5Kicker, title: t.hero5Title, lead: t.hero5Lead },
  ]
  useEffect(() => {
    const id = window.setInterval(() => setHero((n) => (n + 1) % slides.length), 5200)
    return () => window.clearInterval(id)
  }, [slides.length])
  const tower = catalog?.tower[0]
  const pilot = catalog?.pilot[0]
  const now = slides[hero]
  const carousel = FIELD_POSTS
  const blogPost = carousel[blogI] || carousel[0]
  const prevBlog = () => setBlogI((n) => (n - 1 + carousel.length) % carousel.length)
  const nextBlog = () => setBlogI((n) => (n + 1) % carousel.length)
  const faqs = [
    [t.faq1q, t.faq1a],
    [t.faq2q, t.faq2a],
    [t.faq3q, t.faq3a],
    [t.faq4q, t.faq4a],
    [t.faq5q, t.faq5a],
  ]
  return (
    <div>
      <section className="relative min-h-[42vh] overflow-hidden">
        <div className="welcome-motion absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'var(--hero-img)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="relative mx-auto flex min-h-[42vh] max-w-6xl flex-col justify-end px-4 py-8">
          <div key={hero} className="hero-copy">
            <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{now.kicker}</p>
            <h1 className="mt-2 max-w-2xl text-3xl font-extrabold text-white md:text-5xl">{now.title}</h1>
            <p className="mt-3 max-w-xl text-white/85">{now.lead}</p>
          </div>
          <div className="mt-5 flex gap-2" aria-hidden>
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`h-1.5 rounded-full transition-all ${i === hero ? 'w-8 bg-[var(--amber)]' : 'w-2 bg-white/40'}`}
                onClick={() => setHero(i)}
              />
            ))}
          </div>
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
          <div className="relative mt-10">
            <Link to={`/blog/${blogPost.slug}`} className="group relative block min-h-[420px] overflow-hidden rounded-3xl md:min-h-[520px]">
              <div className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.03]" style={{ backgroundImage: `url(${blogPost.cover})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
              <div className="relative flex min-h-[420px] flex-col justify-end p-8 text-white md:min-h-[520px] md:p-12">
                <p className="font-mono text-xs tracking-[0.2em] text-[var(--amber)]">
                  {String(blogI + 1).padStart(2, '0')} / {String(carousel.length).padStart(2, '0')} · {blogPost.author}
                </p>
                <h3 className="mt-3 max-w-3xl text-3xl font-extrabold md:text-5xl">{blogPost.title}</h3>
                <p className="mt-4 max-w-2xl text-lg text-white/85">{blogPost.summary}</p>
              </div>
            </Link>
            <div className="mt-6 flex items-center justify-center gap-4">
              <button type="button" className="blog-nav" onClick={prevBlog} aria-label="<">
                ‹
              </button>
              <button type="button" className="blog-nav" onClick={nextBlog} aria-label=">">
                ›
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="hakkinda" className="py-10 md:py-14">
        <Band img="/atmosphere/night.jpg" flip kicker={t.aboutKicker} title={t.whoTitle} body={`${t.whoLead} ${t.aboutLead}`} to="/hakkinda" cta={t.navAbout} />
      </section>

      <section className="py-10 md:py-14">
        <Band img="/atmosphere/faq.jpg" flip={false} kicker={t.faqHome} title={t.navFaq} body="">
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
