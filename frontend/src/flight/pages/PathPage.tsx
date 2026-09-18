import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, token, type CatalogPath, type CatalogStep } from '../../shared/api'
import { speakAtc } from '../../shared/atcSpeech'
import { levelLabel, useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'
import { SpeakDrill } from '../SpeakDrill'
import { TowerGame } from '../TowerGame'

/** 0 = open for testing. Set to 85 before publish. */
const RADAR_UNLOCK_POINTS = 0

function stageOf(step: CatalogStep) {
  const cfg = (step.configuration || {}) as Record<string, unknown>
  const n = Number(cfg.stage)
  return n >= 1 && n <= 5 ? n : 1
}

function displayTitle(step: CatalogStep, locale: string) {
  const en = (step.configuration || {}).titleEn
  if (locale === 'en' && typeof en === 'string' && en.trim()) return en
  return step.title
}

function sortedSteps(steps: CatalogStep[]) {
  return [...steps].sort((a, b) => {
    const ds = stageOf(a) - stageOf(b)
    if (ds !== 0) return ds
    return a.orderIndex - b.orderIndex
  })
}

export function PathPage({ track }: { track: 'tower' | 'pilot' }) {
  const { t, locale } = useI18n()
  const [path, setPath] = useState<CatalogPath | null>(null)
  const [current, setCurrent] = useState<CatalogStep | null>(null)
  const [stage, setStage] = useState(1)
  const [error, setError] = useState('')
  const [picked, setPicked] = useState<{ stepId: number; index: number } | null>(null)
  const [done, setDone] = useState<Set<number>>(new Set())
  const [lockMsg, setLockMsg] = useState('')
  const loggedIn = Boolean(token())
  const stages = [
    { id: 1, title: t.stage1, hint: t.stage1Hint },
    { id: 2, title: t.stage2, hint: t.stage2Hint },
    { id: 3, title: t.stage3, hint: t.stage3Hint },
    { id: 4, title: t.stage4, hint: t.stage4Hint },
    { id: 5, title: t.stage5, hint: t.stage5Hint },
  ]
  const load = () => {
    setError('')
    setPicked(null)
    api
      .catalog()
      .then(async (c) => {
        const item = (track === 'tower' ? c.tower : c.pilot)[0]
        if (!item) return
        let detail = await api.path(track, item.slug)
        if (token()) {
          try {
            detail = await api.enroll(track, detail.id)
          } catch {
            /* catalog path still usable */
          }
        }
        const ordered = sortedSteps(detail.steps)
        setPath({ ...detail, steps: ordered })
        const start = ordered.find((s) => s.progressStatus !== 'COMPLETED') || ordered[0] || null
        setCurrent(start)
        if (start) setStage(stageOf(start))
        const finished = new Set<number>()
        for (const s of detail.steps) {
          if (s.progressStatus === 'COMPLETED') finished.add(s.id)
        }
        setDone(finished)
      })
      .catch((e: Error) => setError(e.message))
  }
  useEffect(load, [track])
  useEffect(() => {
    setPicked(null)
  }, [current?.id])
  const persist = (answer?: string, transcript?: string) => {
    if (!path || !current) return
    setDone((prev) => new Set(prev).add(current.id))
    if (!token()) return
    api
      .completeStep(track, path.id, current.id, { answer, transcript })
      .then((next) => {
        setPath({ ...next, steps: sortedSteps(next.steps) })
        const finished = new Set<number>()
        for (const s of next.steps) {
          if (s.progressStatus === 'COMPLETED') finished.add(s.id)
        }
        setDone(finished)
      })
      .catch(() => undefined)
  }
  const goNext = () => {
    if (!path || !current) return
    if (current.stepType === 'CONTENT' && !done.has(current.id)) persist()
    const i = path.steps.findIndex((s) => s.id === current.id)
    const nxt = path.steps[i + 1]
    if (nxt) {
      const pts = path.steps.filter((s) => done.has(s.id) || s.progressStatus === 'COMPLETED').length
      if (stageOf(nxt) === 5 && track === 'tower' && RADAR_UNLOCK_POINTS > 0 && !(token() && pts >= RADAR_UNLOCK_POINTS)) {
        setLockMsg(t.stage5Locked)
        return
      }
      setPicked(null)
      setCurrent(nxt)
      setStage(stageOf(nxt))
    }
  }
  if (error) {
    return (
      <div className="track-page mx-auto max-w-6xl px-4 py-8">
        <div className="article-sheet rounded-3xl p-8">
          <p className="text-[var(--warn)]">{t.catalogFail}</p>
          <Button className="mt-4" onClick={load}>{t.retry}</Button>
        </div>
      </div>
    )
  }
  if (!path) return <p className="mx-auto max-w-6xl px-4 py-8 font-mono text-[var(--muted)]">…</p>
  const cfg = (current?.configuration || {}) as Record<string, unknown>
  const line = String(cfg.lineToSpeak || cfg.expectedPhrase || '')
  const prompt = String(cfg.promptText || cfg.situation || '')
  const reply = String(cfg.replyText || 'Roger.')
  const options = (Array.isArray(cfg.options) ? cfg.options : []) as string[]
  const accepted = (Array.isArray(cfg.acceptedPhrases) ? cfg.acceptedPhrases : []) as string[]
  const correct = String(cfg.correctOption || '')
  const correctIndex = typeof cfg.correctIndex === 'number' ? cfg.correctIndex : options.findIndex((o) => o.trim() === correct.trim())
  const isRightOpt = (i: number, o: string) =>
    (correctIndex >= 0 && i === correctIndex) || (correct !== '' && o.trim() === correct.trim())
  const pickIndex = current && picked?.stepId === current.id ? picked.index : null
  const pickedRight = pickIndex != null && isRightOpt(pickIndex, options[pickIndex] || '')
  const speakMode =
    current &&
    (current.stepType === 'SPEAK' || (current.stepType === 'SCENARIO' && pickedRight)) &&
    line
  const quizMode = current && (current.stepType === 'LISTEN' || current.stepType === 'SCENARIO') && options.length > 0
  const practiced =
    !current ||
    current.stepType === 'CONTENT' ||
    current.stepType === 'LIVE_PRACTICE' ||
    done.has(current.id) ||
    current.progressStatus === 'COMPLETED'
  const stageSteps = path.steps.filter((s) => stageOf(s) === stage)
  const score = path.steps.filter((s) => done.has(s.id) || s.progressStatus === 'COMPLETED').length
  const total = path.steps.length
  const finishedTrack = loggedIn && total > 0 && score >= total
  const radarOpen = track === 'tower' && (RADAR_UNLOCK_POINTS === 0 || (loggedIn && score >= RADAR_UNLOCK_POINTS))
  const gameOn = Boolean(cfg.game === 'radar')
  return (
    <div className="track-page flex-1">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link to="/" className="font-mono text-xs tracking-[0.2em] text-[var(--hud)]">← {t.back}</Link>
        <p className="mt-4 font-mono text-[11px] tracking-[0.35em] text-[var(--amber)]">
          {track === 'tower' ? 'TWR' : 'PIC'} · {levelLabel(t, path.difficulty)}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{path.title}</h1>
        <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">
          {track === 'tower' ? t.towerIntro : t.pilotIntro}
        </p>
        {loggedIn ? (
          <p className="mt-4 font-mono text-sm text-[var(--amber)]">
            {score} / {total} {t.points}
          </p>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted)]">{t.loginForPoints}</p>
        )}
        {finishedTrack ? (
          <p className="mt-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 font-semibold text-emerald-800 dark:text-emerald-200">
            {t.ivaoReady}
          </p>
        ) : null}
        {lockMsg ? <p className="mt-3 text-sm text-[var(--warn)]">{lockMsg}</p> : null}
        <div className={`mt-8 grid gap-3 sm:grid-cols-2 ${track === 'tower' ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
          {stages.filter((s) => track === 'tower' || s.id < 5).map((s) => {
            const n = path.steps.filter((st) => stageOf(st) === s.id).length
            const got = path.steps.filter((st) => stageOf(st) === s.id && (done.has(st.id) || st.progressStatus === 'COMPLETED')).length
            const on = stage === s.id
            const locked = s.id === 5 && !radarOpen
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (locked) {
                    setLockMsg(t.stage5Locked)
                    return
                  }
                  setLockMsg('')
                  setStage(s.id)
                  const first = path.steps.find((st) => stageOf(st) === s.id)
                  if (first) {
                    setPicked(null)
                    setCurrent(first)
                  }
                }}
                className={`article-sheet flex h-full flex-col rounded-3xl px-4 py-4 text-left transition ${on ? 'ring-2 ring-[var(--amber)]' : ''} ${locked ? 'opacity-60' : ''}`}
              >
                <span className="block font-extrabold">{s.title}</span>
                <span className="mt-1 block text-sm text-[var(--muted)]">{s.hint}</span>
                {loggedIn ? (
                  <span className="mt-2 block font-mono text-[11px] text-[var(--amber)]">{got}/{n}</span>
                ) : (
                  <span className="mt-2 block font-mono text-[11px] text-[var(--muted)]">{n}</span>
                )}
              </button>
            )
          })}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          <ol className="article-sheet overflow-hidden rounded-3xl p-3" aria-label={t.steps}>
            {stageSteps.map((step, i) => {
              const on = current?.id === step.id
              const ok = done.has(step.id) || step.progressStatus === 'COMPLETED'
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setPicked(null)
                      setCurrent(step)
                    }}
                    className={`grid min-h-11 w-full grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-3 rounded-2xl px-3 py-2 text-left ${on ? 'bg-[var(--bg-2)]' : ''}`}
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[11px] ${ok ? 'bg-emerald-500 text-white' : on ? 'bg-[var(--btn)] text-[var(--btn-ink)]' : 'border border-[var(--stroke)]'}`}>
                      {ok ? '✓' : i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{displayTitle(step, locale)}</span>
                      <span className="font-mono text-[10px] text-[var(--amber)]">
                        {step.stepType === 'SPEAK' ? t.stepSpeak
                          : step.stepType === 'LISTEN' ? t.stepListen
                            : step.stepType === 'SCENARIO' ? t.stepScenario
                              : step.stepType === 'LIVE_PRACTICE' ? t.stepLive
                                : t.stepContent}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
          <article className="article-sheet min-h-[360px] rounded-3xl p-6">
            {current ? (
              <>
                <h2 className="text-2xl font-extrabold">{displayTitle(current, locale)}</h2>
                <p className="mt-2 text-[var(--muted)]">{current.description}</p>
                <div
                  className="article-body mt-4 text-[15px] leading-7"
                  dangerouslySetInnerHTML={{ __html: current.contentHtml || '' }}
                />
                {current.stepType === 'LISTEN' && prompt ? (
                  <Button variant="secondary" className="mt-4" onClick={() => speakAtc(prompt)}>{t.listenCall}</Button>
                ) : null}
                {quizMode ? (
                  <div key={current.id} className="mt-4">
                    {cfg.question ? <p className="font-semibold">{String(cfg.question)}</p> : cfg.situation ? <p className="font-semibold">{String(cfg.situation)}</p> : <p className="font-semibold">{t.listenQ}</p>}
                    <div className="mt-3 flex flex-col gap-2">
                      {options.map((o, i) => {
                        const right = isRightOpt(i, o)
                        let tone = 'border-[var(--stroke)] bg-[var(--bg)]'
                        if (pickIndex != null) {
                          if (right) tone = 'border-emerald-500 bg-emerald-500/20 text-emerald-800 dark:text-emerald-200'
                          else if (i === pickIndex) tone = 'border-rose-500 bg-rose-500/15 text-rose-800 dark:text-rose-200'
                        }
                        return (
                          <button
                            key={`${current.id}-${i}`}
                            type="button"
                            className={`rounded-2xl border px-4 py-3 text-left ${tone}`}
                            onClick={() => {
                              setPicked({ stepId: current.id, index: i })
                              if (isRightOpt(i, o) && !(current.stepType === 'SCENARIO' && line)) {
                                persist(o)
                              }
                            }}
                          >
                            {o}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
                {speakMode ? (
                  <SpeakDrill
                    key={current.id}
                    prompt={current.stepType === 'SPEAK' ? prompt : undefined}
                    line={line}
                    reply={reply}
                    accepted={accepted}
                    onPass={(spoken) => persist(undefined, spoken)}
                  />
                ) : null}
                {gameOn ? <TowerGame /> : null}
                {current.stepType === 'LIVE_PRACTICE' && !gameOn ? (
                  <p className="mt-6">
                    <a
                      href={String(cfg.url || 'https://www.ivao.aero')}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                      onClick={() => persist()}
                    >
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
                {!practiced ? <p className="mt-4 text-sm text-[var(--warn)]">{t.doStepFirst}</p> : null}
                <Button className="mt-6" onClick={goNext} disabled={!practiced}>{t.continue}</Button>
              </>
            ) : null}
          </article>
        </div>
      </div>
    </div>
  )
}
