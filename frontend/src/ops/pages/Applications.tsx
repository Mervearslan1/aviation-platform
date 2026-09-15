import { useEffect, useState } from 'react'
import { api, type TeamApplication } from '../../shared/api'
import { useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'

export function Applications() {
  const { t } = useI18n()
  const [rows, setRows] = useState<TeamApplication[]>([])
  const [error, setError] = useState('')
  const load = () => {
    api
      .teamApplications()
      .then(setRows)
      .catch((e: Error) => setError(e.message))
  }
  useEffect(load, [])
  const review = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    await api.reviewApplication(id, status)
    load()
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold">{t.opsApps}</h1>
      {error ? <p className="mt-3 text-[var(--warn)]">{error}</p> : null}
      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <article key={row.id} className="rounded-xl border border-[var(--stroke)] p-4">
            <p className="font-medium">
              {row.fullName} · {row.email}
            </p>
            <p className="text-sm text-[var(--muted)]">
              {row.profession} → {row.requestedRole} · {row.status}
            </p>
            {row.intro ? <p className="mt-2 text-sm italic">{row.intro}</p> : null}
            <p className="mt-2 text-sm">{row.message}</p>
            {row.status === 'PENDING' ? (
              <div className="mt-3 flex gap-2">
                <Button onClick={() => review(row.id, 'APPROVED')}>{t.approve}</Button>
                <Button variant="secondary" onClick={() => review(row.id, 'REJECTED')}>
                  {t.reject}
                </Button>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  )
}
