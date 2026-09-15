import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, token } from '../../shared/api'
import { DEMO, asUser } from '../../shared/demo'
import { useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'

type Tiny = {
  init: (opts: Record<string, unknown>) => void
  get: (id: string) => { getContent: () => string } | undefined
}

export function Writer() {
  const { t } = useI18n()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [status, setStatus] = useState('')
  const [id, setId] = useState<number | null>(null)
  const ready = useRef(false)
  useEffect(() => {
    if (!asUser()) return
    const w = window as unknown as { tinymce?: Tiny }
    const boot = () => {
      if (ready.current || !w.tinymce) return
      ready.current = true
      w.tinymce.init({
        selector: '#blog-editor',
        height: 420,
        menubar: false,
        plugins: 'lists link image media',
        toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter | bullist numlist | link image media',
        images_upload_handler: async (blobInfo: { blob: () => Blob; filename: () => string }) => {
          if (DEMO && !token()) return URL.createObjectURL(blobInfo.blob())
          const file = new File([blobInfo.blob()], blobInfo.filename())
          const media = await api.uploadMedia(file)
          return `/api/v1/media/${media.id}`
        },
      })
    }
    if (w.tinymce) {
      boot()
      return
    }
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/tinymce@7/tinymce.min.js'
    s.onload = boot
    document.body.appendChild(s)
  }, [])
  if (!asUser()) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <p>{t.loginFirst}</p>
        <Button className="mt-4" to="/login?next=%2Fblog%2Fyaz">{t.login}</Button>
      </div>
    )
  }
  const html = () => (window as unknown as { tinymce?: Tiny }).tinymce?.get('blog-editor')?.getContent() || ''
  const save = async (submit: boolean) => {
    if (DEMO && !token()) {
      setId(id || 1)
      setStatus(submit ? t.sendReview : t.draftSave)
      return
    }
    const body = { title, summary, contentHtml: html() }
    const saved = id
      ? await api.updateArticle(id, body)
      : await api.createArticle(body)
    setId(saved.id)
    if (submit) {
      await api.submitArticle(saved.id)
      setStatus(t.sendReview)
    } else {
      setStatus(t.draftSave)
    }
  }
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-2xl font-extrabold">{t.create}</h1>
      <p className="mt-2 text-[var(--muted)]">{t.writerHint}</p>
      <input className="mt-6 w-full rounded-xl border border-[var(--stroke)] bg-[var(--panel)] px-3 py-3" placeholder={t.navBlog} value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="mt-3 w-full rounded-xl border border-[var(--stroke)] bg-[var(--panel)] px-3 py-3" placeholder="Özet" value={summary} onChange={(e) => setSummary(e.target.value)} />
      <textarea id="blog-editor" className="mt-4 min-h-[280px] w-full rounded-xl border border-[var(--stroke)] p-3" />
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={() => save(false)}>{t.draftSave}</Button>
        <Button variant="secondary" onClick={() => save(true)}>{t.sendReview}</Button>
        <Link className="self-center text-sm" to="/blog">{t.navBlog}</Link>
      </div>
      {status ? <p className="mt-3 text-sm text-[var(--good)]">{status}</p> : null}
    </div>
  )
}
