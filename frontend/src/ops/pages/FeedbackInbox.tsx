import { useEffect, useState } from 'react'
import { api } from '../../shared/api'
import { DEMO, demoChanges } from '../../shared/demo'
import { useI18n } from '../../shared/i18n'

export function FeedbackInbox() {
  const { t } = useI18n()
  const [rows, setRows] = useState<Array<{ id: number; articleSlug: string; quote: string; note: string; userEmail: string }>>([])
  useEffect(() => {
    if (DEMO) setRows(demoChanges())
    else api.changeRequests().then(setRows).catch(() => setRows([]))
  }, [])
  return (
    <div>
      <h1 className="text-2xl font-semibold">{t.opsFeedback}</h1>
      <p className="mt-2 text-[var(--muted)]">Okur bir parçayı işaretledi. Buradan bakıp yazıyı düzelt.</p>
      <div className="mt-6 space-y-3">
        {rows.length === 0 ? <p className="text-[var(--muted)]">Henüz bildirim yok.</p> : null}
        {rows.map((row) => (
          <article key={row.id} className="rounded-xl border border-[var(--stroke)] p-4">
            <p className="font-mono text-xs text-[var(--amber)]">{row.articleSlug}</p>
            <p className="mt-2 rounded-lg bg-[var(--bg-2)] p-3 text-sm">“{row.quote}”</p>
            <p className="mt-2">{row.note}</p>
            <p className="mt-2 text-xs text-[var(--muted)]">{row.userEmail}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
