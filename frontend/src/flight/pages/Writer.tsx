import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, token } from '../../shared/api'
import {
  DEMO,
  asUser,
  demoDrafts,
  demoSaveDraft,
  type DemoDraft,
  type DemoImage,
  type DemoLink,
  type DemoTerm,
} from '../../shared/demo'
import { FIELD_POSTS } from '../../shared/posts'
import { useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'
import { WordPad, type WordPadHandle } from '../WordPad'

function slugify(value: string) {
  return value
    .toLowerCase()
    .replaceAll('ı', 'i')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ş', 's')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function emptyDraft(id = Date.now()): DemoDraft {
  return {
    id,
    title: '',
    slug: '',
    summary: '',
    preface: '',
    contentHtml: '',
    glossary: [],
    images: [],
    sources: [{ title: '', url: '' }],
    related: [],
    status: 'DRAFT',
    updatedAt: new Date().toISOString(),
  }
}

export function Writer() {
  const { t } = useI18n()
  const [drafts, setDrafts] = useState<DemoDraft[]>(() => demoDrafts())
  const [id, setId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugLocked, setSlugLocked] = useState(false)
  const [summary, setSummary] = useState('')
  const [preface, setPreface] = useState('')
  const [glossary, setGlossary] = useState<DemoTerm[]>([])
  const [termIn, setTermIn] = useState('')
  const [defIn, setDefIn] = useState('')
  const [images, setImages] = useState<DemoImage[]>([])
  const [imageUrl, setImageUrl] = useState('')
  const [imageCaption, setImageCaption] = useState('')
  const [sources, setSources] = useState<DemoLink[]>([{ title: '', url: '' }])
  const [related, setRelated] = useState<{ slug: string; title: string }[]>([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'DRAFT' | 'SUBMITTED'>('DRAFT')
  const [flash, setFlash] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const pad = useRef<WordPadHandle>(null)

  const apply = (d: DemoDraft) => {
    setId(d.id)
    setTitle(d.title)
    setSlug(d.slug)
    setSlugLocked(Boolean(d.slug))
    setSummary(d.summary)
    setPreface(d.preface)
    setGlossary(d.glossary)
    setImages(d.images)
    setSources(d.sources.length ? d.sources : [{ title: '', url: '' }])
    setRelated(d.related)
    setStatus(d.status)
    pad.current?.setHtml(d.contentHtml || '')
  }

  const html = () => pad.current?.getHtml() || ''

  const snapshot = (nextStatus: 'DRAFT' | 'SUBMITTED'): DemoDraft => ({
    id: id || Date.now(),
    title: title.trim(),
    slug: (slug || slugify(title)).trim(),
    summary: summary.trim(),
    preface: preface.trim(),
    contentHtml: html(),
    glossary: glossary
      .filter((g) => g.term.trim() || g.def.trim())
      .map((g) => ({ term: g.term.trim(), def: g.def.trim().slice(0, 300) })),
    images,
    sources: sources.filter((s) => s.title.trim() || s.url.trim()),
    related,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  })

  if (!asUser()) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <p>{t.loginFirst}</p>
        <Button className="mt-4" to="/login?next=%2Fblog%2Fyaz">
          {t.login}
        </Button>
      </div>
    )
  }

  const save = async (submit: boolean) => {
    setError('')
    const next = snapshot(submit ? 'SUBMITTED' : 'DRAFT')
    if (submit && (!next.title || !next.contentHtml.replace(/<[^>]+>/g, '').trim())) {
      setError(t.writerNeedTitle)
      return
    }
    if (DEMO && !token()) {
      const list = demoSaveDraft(next)
      setDrafts(list)
      setId(next.id)
      setStatus(next.status)
      setFlash(submit ? t.writerSubmitted : t.writerSaved)
      return
    }
    const body = {
      title: next.title || t.writerUntitled,
      summary: next.summary,
      contentHtml: next.contentHtml,
      contentDocument: {
        slug: next.slug,
        preface: next.preface,
        glossary: next.glossary,
        images: next.images,
        sources: next.sources,
        related: next.related,
      },
    }
    const saved = id ? await api.updateArticle(id, body) : await api.createArticle(body)
    setId(saved.id)
    if (submit) await api.submitArticle(saved.id)
    const local = { ...next, id: saved.id }
    setDrafts(demoSaveDraft(local))
    setStatus(local.status)
    setFlash(submit ? t.writerSubmitted : t.writerSaved)
  }

  const insertImage = (url: string, caption: string) => {
    const cap = caption.trim()
    setImages((prev) => [...prev, { url, caption: cap }])
    const fig = `<figure><img src="${url}" alt="${cap}" />${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>`
    pad.current?.insertHtml(fig)
  }

  const q = query.trim().toLowerCase()
  const hits = q.length < 2 ? [] : FIELD_POSTS.filter((p) => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)).slice(0, 6)

  const locked = status === 'SUBMITTED'

  return (
    <div className="writer-scene min-h-full">
      <div className="w-full px-5 py-6 lg:px-20 lg:py-8">
        <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.writerDesk}</p>
        <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{t.blogWriteCta}</h1>
        <p className="mt-2 max-w-3xl text-[var(--muted)]">{t.writerHint}</p>

        <div className="mt-6 grid items-start gap-6 md:gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:gap-10">
          <div className="article-sheet min-w-0 rounded-3xl p-5 md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <label className={label}>
                {t.writerTitleField}
                <input
                  className={field}
                  value={title}
                  disabled={locked}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    if (!slugLocked) setSlug(slugify(e.target.value))
                  }}
                  placeholder={t.writerTitleField}
                />
              </label>
              <label className={label}>
                {t.writerSlug}
                <input
                  className={`${field} font-mono text-sm`}
                  value={slug}
                  disabled={locked}
                  onChange={(e) => {
                    setSlugLocked(true)
                    setSlug(slugify(e.target.value))
                  }}
                  placeholder="inis-safhasi"
                />
                <span className="mt-1 block text-xs font-normal text-[var(--muted)]">{t.writerSlugHint}</span>
              </label>
            </div>
            <label className={`${label} mt-5`}>
              {t.writerSummary}
              <input className={field} value={summary} disabled={locked} onChange={(e) => setSummary(e.target.value)} />
            </label>
            <label className={`${label} mt-5`}>
              {t.writerPreface}
              <textarea className={field} rows={3} value={preface} disabled={locked} onChange={(e) => setPreface(e.target.value)} />
              <span className="mt-1 block text-xs font-normal text-[var(--muted)]">{t.writerPrefaceHint}</span>
            </label>

            <div className="mt-8">
              <p className="text-sm font-medium">{t.writerBody}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{t.writerBodyHint}</p>
              <div className="mt-3">
                <WordPad ref={pad} disabled={locked} placeholder={t.writerBodyPlaceholder} />
              </div>
            </div>

            <section className="mt-10 border-t border-[var(--stroke)] pt-8">
              <h2 className="text-lg font-extrabold">{t.writerImages}</h2>
              <ul className="mt-3 space-y-2">
                {images.map((img, i) => (
                  <li key={`${img.url}-${i}`} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--stroke)] px-3 py-2 text-sm">
                    <a className="truncate text-[var(--sky)] underline" href={img.url} target="_blank" rel="noreferrer">
                      {img.caption || img.url}
                    </a>
                    {locked ? null : (
                      <button type="button" onClick={() => setImages(images.filter((_, n) => n !== i))}>
                        ×
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {locked ? null : (
                <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <input className={field} placeholder={t.writerImageUrl} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                  <input className={field} placeholder={t.writerImageCaption} value={imageCaption} onChange={(e) => setImageCaption(e.target.value)} />
                  <Button
                    variant="secondary"
                    className="min-h-11"
                    onClick={() => {
                      if (!imageUrl.trim()) return
                      insertImage(imageUrl.trim(), imageCaption)
                      setImageUrl('')
                      setImageCaption('')
                    }}
                  >
                    {t.writerAddImage}
                  </Button>
                </div>
              )}
              {locked ? null : (
                <div className="mt-3">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      let url = URL.createObjectURL(file)
                      if (!(DEMO && !token())) {
                        const media = await api.uploadMedia(file)
                        url = `/api/v1/media/${media.id}`
                      }
                      insertImage(url, file.name)
                      e.target.value = ''
                    }}
                  />
                  <Button variant="ghost" onClick={() => fileRef.current?.click()}>
                    {t.writerAddImageFile}
                  </Button>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    id="writer-audio"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      let url = URL.createObjectURL(file)
                      if (!(DEMO && !token())) {
                        const media = await api.uploadMedia(file)
                        url = `/api/v1/media/${media.id}`
                      }
                      pad.current?.insertHtml(`<p><audio controls src="${url}"></audio></p>`)
                      e.target.value = ''
                    }}
                  />
                  <Button variant="ghost" onClick={() => document.getElementById('writer-audio')?.click()}>
                    {t.writerAddAudio}
                  </Button>
                </div>
              )}
            </section>

            <section className="mt-8 border-t border-[var(--stroke)] pt-6">
              <h2 className="text-lg font-extrabold">{t.writerSources}</h2>
              <div className="mt-3 space-y-2">
                {sources.map((row, i) => (
                  <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                    <input
                      className={field}
                      placeholder={t.writerSourceTitle}
                      value={row.title}
                      disabled={locked}
                      onChange={(e) => setSources(sources.map((s, n) => (n === i ? { ...s, title: e.target.value } : s)))}
                    />
                    <input
                      className={field}
                      placeholder={t.writerSourceUrl}
                      value={row.url}
                      disabled={locked}
                      onChange={(e) => setSources(sources.map((s, n) => (n === i ? { ...s, url: e.target.value } : s)))}
                    />
                    {row.url ? (
                      <a className="self-center text-sm text-[var(--sky)] underline" href={row.url} target="_blank" rel="noreferrer">
                        ↗
                      </a>
                    ) : (
                      <span />
                    )}
                  </div>
                ))}
              </div>
              {locked ? null : (
                <button type="button" className="mt-3 text-sm font-medium text-[var(--sky)]" onClick={() => setSources([...sources, { title: '', url: '' }])}>
                  {t.writerAddSource}
                </button>
              )}
            </section>

            <div className="mt-8 flex flex-wrap gap-3">
              {locked ? null : (
                <>
                  <Button onClick={() => save(false)}>{t.draftSave}</Button>
                  <Button variant="secondary" onClick={() => save(true)}>
                    {t.sendReview}
                  </Button>
                </>
              )}
              <Link className="self-center text-sm" to="/blog">
                {t.navBlog}
              </Link>
            </div>
            {flash ? <p className="mt-3 text-sm text-[var(--good)]">{flash}</p> : null}
            {error ? <p className="mt-3 text-sm text-[var(--warn)]">{error}</p> : null}
          </div>

          <aside className="w-full space-y-6 lg:sticky lg:top-16">
            <div className="article-sheet rounded-3xl p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-extrabold">{t.writerDrafts}</h2>
                <button
                  type="button"
                  className="text-sm text-[var(--sky)]"
                  onClick={() => {
                    apply(emptyDraft())
                    setId(null)
                    setFlash('')
                    setError('')
                  }}
                >
                  {t.writerNew}
                </button>
              </div>
              {drafts.length === 0 ? (
                <p className="mt-3 text-sm text-[var(--muted)]">{t.writerDraftsEmpty}</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {drafts.map((d) => (
                    <li key={d.id}>
                      <button
                        type="button"
                        className={`w-full rounded-xl border px-3 py-3 text-left ${d.id === id ? 'border-[var(--sky)] bg-[var(--bg)]' : 'border-[var(--stroke)]'}`}
                        onClick={() => apply(d)}
                      >
                        <span className="block font-semibold">{d.title || t.writerUntitled}</span>
                        <span className="mt-1 block text-xs text-[var(--muted)]">
                          {d.id === id ? t.writerDraftOpen : d.status === 'SUBMITTED' ? t.writerStatusSubmitted : t.writerStatusDraft}
                          {' · '}
                          {new Date(d.updatedAt).toLocaleString()}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="article-sheet overflow-visible rounded-3xl p-5">
              <h2 className="font-extrabold">{t.writerGlossary}</h2>
              {locked ? null : (
                <div className="mt-3 space-y-2">
                  <input className={field} placeholder={t.writerTerm} value={termIn} onChange={(e) => setTermIn(e.target.value)} />
                  <textarea
                    className={`${field} min-h-[4.5rem] resize-y`}
                    rows={3}
                    maxLength={300}
                    placeholder={t.writerDef}
                    value={defIn}
                    onChange={(e) => setDefIn(e.target.value.slice(0, 300))}
                  />
                  <span className="block text-xs font-normal text-[var(--muted)]">
                    {t.writerDefLimit} {defIn.length}/300
                  </span>
                  <button
                    type="button"
                    className="text-sm font-medium text-[var(--sky)]"
                    onClick={() => {
                      if (!termIn.trim()) return
                      setGlossary([...glossary, { term: termIn.trim(), def: defIn.trim().slice(0, 300) }])
                      setTermIn('')
                      setDefIn('')
                    }}
                  >
                    {t.writerAddTerm}
                  </button>
                </div>
              )}
              {glossary.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {glossary.map((row, i) => (
                    <span key={`${row.term}-${i}`} className="term-chip inline-flex max-w-full items-center gap-1 rounded-full border border-[var(--stroke)] bg-[var(--bg)] px-3 py-1 text-sm">
                      <span className="max-w-[10rem] truncate">{row.term || t.writerTerm}</span>
                      {row.def ? <span className="term-tip">{row.def}</span> : null}
                      {locked ? null : (
                        <button type="button" className="text-[var(--muted)]" onClick={() => setGlossary(glossary.filter((_, n) => n !== i))} aria-label="×">
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="article-sheet rounded-3xl p-5">
              <h2 className="font-extrabold">{t.writerRelated}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{t.writerRelatedHint}</p>
              <input className={`${field} mt-3`} placeholder={t.writerRelatedSearch} value={query} onChange={(e) => setQuery(e.target.value)} />
              {related.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {related.map((r) => (
                    <button
                      key={r.slug + r.title}
                      type="button"
                      className="rounded-full border border-[var(--stroke)] px-3 py-1 text-xs"
                      onClick={() => setRelated(related.filter((x) => x.title !== r.title))}
                    >
                      {r.title} ×
                    </button>
                  ))}
                </div>
              ) : null}
              {q.length >= 2 ? (
                <ul className="mt-3 space-y-2">
                  {hits.length === 0 ? (
                    <li className="text-sm text-[var(--muted)]">{t.writerRelatedEmpty}</li>
                  ) : (
                    hits.map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          className="w-full rounded-xl border border-[var(--stroke)] px-3 py-2 text-left text-sm hover:bg-[var(--bg)]"
                          onClick={() => {
                            if (related.some((r) => r.title === p.title)) return
                            setRelated([...related, { slug: p.slug, title: p.title }])
                            setQuery('')
                          }}
                        >
                          <span className="block font-medium">{p.title}</span>
                          <span className="block text-xs text-[var(--muted)]">{p.summary}</span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

const field = 'mt-1 w-full rounded-xl border border-[var(--stroke)] bg-[var(--bg)] px-3 py-3 text-[var(--ink)]'
const label = 'block text-sm font-medium'
