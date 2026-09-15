import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, setToken } from '../../shared/api'
import { useI18n } from '../../shared/i18n'

export function Login({ next = '/' }: { next?: string }) {
  const { t } = useI18n()
  const nav = useNavigate()
  const [email, setEmail] = useState('admin@aviation-platform.local')
  const [password, setPassword] = useState('Admin123!')
  const [error, setError] = useState('')
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const tokens = await api.login(email, password)
      setToken(tokens.accessToken)
      nav(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.loginNeed)
    }
  }
  return (
    <form onSubmit={submit} className="glass mx-auto mt-10 max-w-md rounded-3xl p-8">
      <p className="font-mono text-[11px] tracking-[0.35em] text-[var(--hud)]">{t.login}</p>
      <h1 className="mt-2 text-2xl font-semibold">{t.enterFlight}</h1>
      <label className="mt-6 block text-sm text-[var(--muted)]">
        {t.email}
        <input
          className="mt-1 w-full rounded-xl border border-[var(--stroke)] bg-transparent px-3 py-2 text-[var(--ink)]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="mt-4 block text-sm text-[var(--muted)]">
        {t.password}
        <input
          type="password"
          className="mt-1 w-full rounded-xl border border-[var(--stroke)] bg-transparent px-3 py-2 text-[var(--ink)]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error ? <p className="mt-3 text-sm text-[var(--warn)]">{error}</p> : null}
      <button className="mt-6 w-full rounded-full bg-[var(--hud)] py-3 font-semibold text-[var(--bg)]">
        {t.start}
      </button>
      <Link to="/" className="mt-4 block text-center font-mono text-xs text-[var(--muted)]">
        {t.guest}
      </Link>
    </form>
  )
}
