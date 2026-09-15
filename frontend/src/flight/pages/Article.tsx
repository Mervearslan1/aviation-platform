import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../shared/api'
import { DEMO, asUser, demoAddChange, demoLike, demoLiked } from '../../shared/demo'
import { useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'
import { IconSearch } from '../../shared/Icons'

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
  const [liked, setLiked] = useState(false)
  const [pop, setPop] = useState(false)
  const [marking, setMarking] = useState(false)
  const [quote, setQuote] = useState('')
  const [note, setNote] = useState('')
  const [ok, setOk] = useState('')
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
    if (DEMO) setLiked(demoLiked(slug))
  }, [slug])
  if (!doc) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p>{t.retry}</p>
        <Link to="/blog">{t.navBlog}</Link>
      </div>
    )
  }
  const like = () => {
    setLiked(true)
    setPop(true)
    window.setTimeout(() => setPop(false), 700)
    if (DEMO) demoLike(doc.slug)
    else if (asUser()) api.voteFeedback(doc.slug, 'INTERESTED').catch(() => undefined)
  }
  const grabSelection = () => {
    const text = window.getSelection()?.toString().trim() || ''
    if (text) setQuote(text)
  }
  const sendChange = async () => {
    setErr('')
    if (!quote.trim() || !note.trim()) {
      setErr(t.changeHint)
      return
    }
    if (DEMO) {
      demoAddChange(doc.slug, quote.trim(), note.trim())
      setOk(t.changeOk)
      setMarking(false)
      setNote('')
      return
    }
    if (!asUser()) {
      setErr(t.loginFirst)
      return
    }
    try {
      await api.voteFeedback(doc.slug, 'NEEDS_REVIEW', quote.trim(), note.trim())
      setOk(t.changeOk)
      setMarking(false)
      setNote('')
    } catch (e) {
      setErr(e instanceof Error ? e.message : t.retry)
    }
  }
  return (
    <article className="blog-scene min-h-full">
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <img src={doc.cover} alt="" className="mb-8 w-full rounded-2xl object-cover" />
        <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.navBlog}</p>
        <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{doc.title}</h1>
        <p className="mt-3 text-lg text-[var(--muted)]">{doc.summary}</p>
        <div className="article-body mt-8" onMouseUp={marking ? grabSelection : undefined} dangerouslySetInnerHTML={{ __html: doc.html }} />
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button type="button" className={`like-btn ${liked ? 'liked' : ''} ${pop ? 'pop' : ''}`} onClick={like}>
            ♥ {t.interested}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setMarking(true)
              setOk('')
              grabSelection()
            }}
          >
            <IconSearch /> {t.needsReview}
          </button>
        </div>
        {marking ? (
          <div className="mt-4 rounded-2xl border border-[var(--stroke)] bg-[var(--panel)] p-4">
            <p className="text-sm text-[var(--muted)]">{t.changeHint}</p>
            <p className="mt-3 rounded-xl bg-[var(--bg)] p-3 text-sm">{quote || '—'}</p>
            <textarea
              className="mt-3 w-full rounded-xl border border-[var(--stroke)] bg-[var(--bg)] px-3 py-3"
              rows={3}
              placeholder={t.needsReview}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="mt-3 flex gap-2">
              <Button onClick={sendChange}>{t.changeSend}</Button>
              <Button variant="secondary" onClick={() => setMarking(false)}>{t.close}</Button>
            </div>
          </div>
        ) : null}
        {ok ? <p className="mt-3 text-sm text-[var(--good)]">{ok}</p> : null}
        {err ? <p className="mt-3 text-sm text-[var(--warn)]">{err}</p> : null}
      </div>
    </article>
  )
}
