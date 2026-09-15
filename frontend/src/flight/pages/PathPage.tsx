import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type CatalogPath, type CatalogStep } from '../../shared/api'
import { levelLabel, useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'

export function PathPage({ track }: { track: 'tower' | 'pilot' }) {
  const { t } = useI18n()
  const [path, setPath] = useState<CatalogPath | null>(null)
  const [current, setCurrent] = useState<CatalogStep | null>(null)
  const [error, setError] = useState('')
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
  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="glass rounded-3xl p-8">
          <p className="text-[var(--warn)]">{t.catalogFail}</p>
          <Button className="mt-4" onClick={load}>
            {t.retry}
          </Button>
        </div>
      </div>
    )
  }
  if (!path) return <p className="mx-auto max-w-6xl px-4 py-8 font-mono text-[var(--muted)]">…</p>
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/" className="font-mono text-xs tracking-[0.2em] text-[var(--hud)]">
        ← {t.back}
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] tracking-[0.35em] text-[var(--amber)]">
            {track === 'tower' ? 'TWR' : 'PIC'} · {levelLabel(t, path.difficulty)}
          </p>
          <h1 className="text-3xl font-semibold">{path.title}</h1>
          <p className="mt-1 max-w-2xl text-[var(--muted)]">{path.description}</p>
        </div>
        {path.relatedAircraft?.length ? (
          <Button variant="secondary" to="/cockpit">
            ACFT {path.relatedAircraft.join(' · ')}
          </Button>
        ) : null}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
        <ol className="glass relative overflow-hidden rounded-3xl p-3" aria-label={t.steps}>
          <div className="absolute bottom-3 left-7 top-3 w-px bg-[var(--stroke)]" />
          {path.steps.map((step, i) => {
            const on = current?.id === step.id
            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => setCurrent(step)}
                  className={`relative flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 py-2 text-left ${
                    on ? 'bg-[var(--bg-2)]' : ''
                  }`}
                >
                  <span
                    className={`z-10 grid h-7 w-7 place-items-center rounded-full font-mono text-[11px] ${
                      on ? 'bg-[var(--btn)] text-[var(--btn-ink)]' : 'border border-[var(--stroke)]'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{step.title}</span>
                    <span className="font-mono text-[10px] text-[var(--amber)]">
                      {levelLabel(t, step.knowledgeLevel)}
                      {step.recommended ? ` · ${t.recommended}` : ''}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
        <article className="glass min-h-[360px] rounded-3xl p-6">
          {current ? (
            <>
              <p className="font-mono text-[11px] tracking-[0.3em] text-[var(--hud)]">
                {current.stepType} · {t.open}
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{current.title}</h2>
              <div
                className="mt-4 max-w-none text-[15px] leading-7 text-[var(--ink)]"
                dangerouslySetInnerHTML={{ __html: current.contentHtml || current.description || '' }}
              />
              <Button className="mt-6" to="/login">
                {t.continue}
              </Button>
            </>
          ) : null}
        </article>
      </div>
    </div>
  )
}
