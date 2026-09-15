import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type CatalogAircraft } from '../../shared/api'
import { levelLabel, useI18n } from '../../shared/i18n'

export function Cockpit() {
  const { t } = useI18n()
  const [aircraft, setAircraft] = useState<CatalogAircraft[]>([])
  const [error, setError] = useState('')
  useEffect(() => {
    api
      .catalog()
      .then((c) => setAircraft(c.aircraft))
      .catch((e: Error) => setError(e.message))
  }, [])
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/" className="font-mono text-xs tracking-[0.2em] text-[var(--hud)]">
        ← {t.back}
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">{t.doorAc}</h1>
      <p className="mt-2 max-w-xl text-[var(--muted)]">{t.doorAcHint}</p>
      {error ? <p className="mt-4 text-[var(--warn)]">{t.catalogFail}</p> : null}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {aircraft.map((ac) => (
          <article key={ac.code} className="glass card-lift flex flex-col rounded-3xl p-5 transition hover:-translate-y-0.5">
            <p className="font-mono text-[11px] tracking-[0.3em] text-[var(--hud)]">{ac.code}</p>
            <h2 className="mt-3 text-xl font-semibold">{ac.name}</h2>
            <p className="mt-2 flex-1 line-clamp-3 text-sm text-[var(--muted)]">{ac.philosophy}</p>
            <p className="mt-4 font-mono text-[11px] text-[var(--amber)]">
              {levelLabel(t, ac.difficulty)} · {ac.partCount} {t.parts}
            </p>
            <a
              href="http://127.0.0.1:8080/cockpit/index.html"
              className="btn btn-primary mt-5 w-full"
            >
              {t.start}
            </a>
          </article>
        ))}
      </div>
    </div>
  )
}
