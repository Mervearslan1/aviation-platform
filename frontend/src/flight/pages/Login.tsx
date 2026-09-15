import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, setToken } from '../../shared/api'
import { useI18n } from '../../shared/i18n'
import { Logo } from '../../shared/Mark'
import { Button } from '../../shared/Button'

export function Login() {
  const { t } = useI18n()
  const nav = useNavigate()
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    try {
      if (mode === 'up') {
        await api.register({ username, email, password, displayName })
        setMode('in')
        setInfo(t.loginLead)
        return
      }
      const tokens = await api.login(email, password)
      setToken(tokens.accessToken)
      nav('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : t.loginNeed)
    }
  }
  return (
    <div className="mx-auto my-6 grid max-w-6xl overflow-hidden rounded-3xl border border-[var(--stroke)] lg:grid-cols-2">
      <div
        className="hidden min-h-[420px] bg-cover bg-center lg:block"
        style={{ backgroundImage: 'var(--hero-img)' }}
      />
      <form onSubmit={submit} className="bg-[var(--panel)] p-8 md:p-12">
        <Logo />
        <h1 className="mt-6 text-3xl font-semibold">{t.loginTitle}</h1>
        <p className="mt-2 text-[var(--muted)]">{t.loginLead}</p>
        <div className="mt-6 flex gap-2">
          <button type="button" className={`btn ${mode === 'in' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('in')}>
            {t.login}
          </button>
          <button type="button" className={`btn ${mode === 'up' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('up')}>
            {t.register}
          </button>
        </div>
        {mode === 'up' ? (
          <>
            <Field label={t.username} value={username} onChange={setUsername} />
            <Field label={t.displayName} value={displayName} onChange={setDisplayName} />
          </>
        ) : null}
        <Field label={t.email} value={email} onChange={setEmail} autoComplete="username" />
        <Field label={t.password} value={password} onChange={setPassword} type="password" autoComplete="current-password" />
        {error ? <p className="mt-3 text-[var(--warn)]">{error}</p> : null}
        {info ? <p className="mt-3 text-[var(--good)]">{info}</p> : null}
        <Button className="mt-6 w-full" type="submit">
          {mode === 'in' ? t.login : t.register}
        </Button>
        <Link to="/" className="mt-4 block text-center text-sm text-[var(--muted)]">
          {t.guest}
        </Link>
      </form>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  autoComplete?: string
}) {
  return (
    <label className="mt-4 block text-sm font-medium">
      {label}
      <input
        className="mt-1 w-full rounded-xl border border-[var(--stroke)] bg-[var(--bg)] px-3 py-3 text-[var(--ink)]"
        value={value}
        type={type}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
