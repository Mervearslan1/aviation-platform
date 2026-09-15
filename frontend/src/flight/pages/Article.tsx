import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../shared/api'
import { DEMO, asUser, demoFeedback, demoVote } from '../../shared/demo'
import { useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'

type Packed = {
  slug: string
  title: string
  summary: string
  cover: string
  background: string
  html: string
  terms: Record<string, string>
}

export function Article() {
  const { slug } = useParams()
  const { t } = useI18n()
  const [doc, setDoc] = useState<Packed | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const [counts, setCounts] = useState({ interested: 0, needsReview: 0, mine: '' as string | null })
  const [err, setErr] = useState('')
  useEffect(() => {
    if (!slug) return
    fetch('/blog/landing-accidents.json')
      .then((r) => r.json())
      .then((d: Packed) => {
        if (d.slug === slug) setDoc(d)
        else {
          return api.articleBySlug(slug).then((a) => {
            setDoc({
              slug,
              title: a.title,
              summary: a.summary || '',
              cover: a.coverImageUrl || '/blog/cover.jpg',
              background: '/blog/bg.jpg',
              html: a.contentHtml || '',
              terms: {},
            })
          })
        }
      })
      .catch(() => setDoc(null))
    if (DEMO) setCounts(demoFeedback(slug))
    else api.feedback(slug).then(setCounts).catch(() => undefined)
  }, [slug])
  if (!doc) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p>{t.retry}</p>
        <Link to="/blog">{t.navBlog}</Link>
      </div>
    )
  }
  const vote = async (kind: 'INTERESTED' | 'NEEDS_REVIEW') => {
    if (DEMO) {
      setCounts(demoVote(doc.slug, kind))
      return
    }
    if (!asUser()) {
      setErr(t.loginFirst)
      return
    }
    try {
      setCounts(await api.voteFeedback(doc.slug, kind))
    } catch (e) {
      setErr(e instanceof Error ? e.message : t.retry)
    }
  }
  return (
    <article className="relative">
      <div className="absolute inset-0 -z-10 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${doc.background})` }} />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <img src={doc.cover} alt="" className="mb-6 w-full rounded-2xl object-cover" />
        <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.navBlog}</p>
        <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{doc.title}</h1>
        <p className="mt-3 text-lg text-[var(--muted)]">{doc.summary}</p>
        <div
          className="article-body mt-8"
          onClick={(e) => {
            const btn = (e.target as HTMLElement).closest('button.term') as HTMLButtonElement | null
            if (!btn) return
            const key = btn.dataset.term || ''
            setOpen((cur) => (cur === key ? null : key))
          }}
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />
        {open && doc.terms[open] ? (
          <aside className="mt-4 rounded-2xl border border-[var(--amber)] bg-[var(--panel)] p-4">
            <p className="font-extrabold">{open}</p>
            <p className="mt-1 text-[var(--muted)]">{doc.terms[open]}</p>
          </aside>
        ) : null}
        <div className="mt-10 flex flex-wrap gap-3">
          <Button onClick={() => vote('INTERESTED')}>
            {t.interested} · {counts.interested}
          </Button>
          <Button variant="secondary" onClick={() => vote('NEEDS_REVIEW')}>
            {t.needsReview} · {counts.needsReview}
          </Button>
        </div>
        {err ? <p className="mt-3 text-sm text-[var(--warn)]">{err}</p> : null}
      </div>
    </article>
  )
}
