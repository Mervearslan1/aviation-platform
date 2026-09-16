import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type CatalogPath, type CatalogStep } from '../../shared/api'
import { levelLabel, useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'
import { SpeakDrill } from '../SpeakDrill'

export function PathPage({ track }: { track: 'tower' | 'pilot' }) {
  const { t } = useI18n()
  const [path, setPath] = useState<CatalogPath | null>(null)
  const [current, setCurrent] = useState<CatalogStep | null>(null)
  const [error, setError] = useState('')
  const [picked, setPicked] = useState<string | null>(null)
  const load = () => {
    setError('')
    api
      .catalog()
      .then((c) => {
        const item = (track === 'tower' ? c.tower : c.pilot)[0]
        if (!item) return
        return api.path(track, item.slug).then((detail) => {
          setPath(detail)
          setCurrent(detail.steps.find((s) => s.recommended) || detail.steps[0] || null)
        })
      })
      .catch((e: Error) => setError(e.message))
  }
  useEffect(load, [track])
  const goNext = () => {
    if (!path || !current) return
    const i = path.steps.findIndex((s) => s.id === current.id)
    const nxt = path.steps[i + 1]
    if (nxt) setCurrent(nxt)
  }
  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="glass rounded-3xl p-8">
          <p className="text-[var(--warn)]">{t.catalogFail}</p>
          <Button className="mt-4" onClick={load}>{t.retry}</Button>
        </div>
      </div>
    )
  }
  if (!path) return <p className="mx-auto max-w-6xl px-4 py-8 font-mono text-[var(--muted)]">…</p>
  const cfg = (current?.configuration || {}) as Record<string, unknown>
  const line = String(cfg.lineToSpeak || '')
  const prompt = String(cfg.promptText || cfg.situation || '')
  const reply = String(cfg.replyText || 'Roger.')
  const options = (Array.isArray(cfg.options) ? cfg.options : []) as string[]
  const correct = String(cfg.correctOption || '')
  const correctIndex = typeof cfg.correctIndex === 'number' ? cfg.correctIndex : options.findIndex((o) => o.trim() === correct.trim())
  const isRightOpt = (i: number, o: string) =>
    (correctIndex >= 0 && i === correctIndex) || (correct !== '' && o.trim() === correct.trim())
  const pickedRight = picked != null && options.some((o, i) => o === picked && isRightOpt(i, o))
  const speakMode =
    current &&
    (current.stepType === 'SPEAK' || (current.stepType === 'SCENARIO' && pickedRight)) &&
    line
  const quizMode = current && (current.stepType === 'LISTEN' || current.stepType === 'SCENARIO') && options.length > 0
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/" className="font-mono text-xs tracking-[0.2em] text-[var(--hud)]">← {t.back}</Link>
      <p className="mt-4 font-mono text-[11px] tracking-[0.35em] text-[var(--amber)]">
        {track === 'tower' ? 'TWR' : 'PIC'} · {levelLabel(t, path.difficulty)}
      </p>
      <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{path.title}</h1>
      <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">
        {track === 'tower' ? t.towerIntro : t.pilotIntro}
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
        <ol className="glass relative overflow-hidden rounded-3xl p-3" aria-label={t.steps}>
          <div className="absolute bottom-3 left-7 top-3 w-px bg-[var(--stroke)]" />
          {path.steps.map((step, i) => {
            const on = current?.id === step.id
            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => {
                    setPicked(null)
                    setCurrent(step)
                  }}
                  className={`relative flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 py-2 text-left ${on ? 'bg-[var(--bg-2)]' : ''}`}
                >
                  <span className={`z-10 grid h-7 w-7 place-items-center rounded-full font-mono text-[11px] ${on ? 'bg-[var(--btn)] text-[var(--btn-ink)]' : 'border border-[var(--stroke)]'}`}>
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{step.title}</span>
                    <span className="font-mono text-[10px] text-[var(--amber)]">{step.stepType}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
        <article className="glass min-h-[360px] rounded-3xl p-6">
          {current ? (
            <>
              <h2 className="text-2xl font-extrabold">{current.title}</h2>
              <p className="mt-2 text-[var(--muted)]">{current.description}</p>
              <div
                className="article-body mt-4 text-[15px] leading-7"
                dangerouslySetInnerHTML={{ __html: current.contentHtml || '' }}
              />
              {current.stepType === 'LISTEN' && prompt ? (
                <Button variant="secondary" className="mt-4" onClick={() => {
                  const u = new SpeechSynthesisUtterance(prompt)
                  u.lang = 'en-US'
                  speechSynthesis.cancel()
                  speechSynthesis.speak(u)
                }}>{t.listenCall}</Button>
              ) : null}
              {quizMode ? (
                <div className="mt-4">
                  {cfg.question ? <p className="font-semibold">{String(cfg.question)}</p> : cfg.situation ? <p className="font-semibold">{String(cfg.situation)}</p> : <p className="font-semibold">{t.listenQ}</p>}
                  <div className="mt-3 flex flex-col gap-2">
                    {options.map((o, i) => {
                      const right = isRightOpt(i, o)
                      let tone = 'border-[var(--stroke)] bg-[var(--bg)]'
                      if (picked) {
                        if (right) tone = 'border-emerald-500 bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                        else if (o === picked) tone = 'border-rose-500 bg-rose-500/15 text-rose-800 dark:text-rose-200'
                      }
                      return (
                        <button
                          key={o}
                          type="button"
                          className={`rounded-2xl border px-4 py-3 text-left ${tone}`}
                          onClick={() => setPicked(o)}
                        >
                          {o}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}
              {speakMode ? (
                <SpeakDrill prompt={current.stepType === 'SPEAK' ? prompt : undefined} line={line} reply={reply} onPass={() => undefined} />
              ) : null}
              {current.stepType === 'LIVE_PRACTICE' ? (
                <p className="mt-6">
                  <a href={String(cfg.url || 'https://www.ivao.aero')} target="_blank" rel="noreferrer" className="btn btn-secondary">
                    IVAO
                  </a>
                </p>
              ) : null}
              {current.glossary && current.glossary.length > 0 ? (
                <div className="mt-8">
                  <p className="font-mono text-xs tracking-[0.2em] text-[var(--amber)]">{t.termsHere}</p>
                  <dl className="mt-3 space-y-3">
                    {current.glossary.map((g) => (
                      <div key={g.term} className="rounded-2xl border border-[var(--stroke)] px-4 py-3">
                        <dt className="font-extrabold">{g.term}</dt>
                        <dd className="mt-1 text-[var(--muted)]">{g.meaning}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
              <Button className="mt-6" onClick={goNext}>{t.continue}</Button>
            </>
          ) : null}
        </article>
      </div>
    </div>
  )
}
