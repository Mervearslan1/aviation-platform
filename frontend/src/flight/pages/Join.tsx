import { useState, type FormEvent } from 'react'
import { api } from '../../shared/api'
import { useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'

export function Join() {
  const { t } = useI18n()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [profession, setProfession] = useState('PILOT')
  const [requestedRole, setRequestedRole] = useState('AUTHOR')
  const [experience, setExperience] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await api.joinTeam({ fullName, email, profession, requestedRole, experience, message })
      setOk(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.retry)
    }
  }
  if (ok) {
    return (
      <div className="surface mx-auto max-w-lg rounded-3xl p-10 text-center">
        <h1 className="text-3xl font-semibold">{t.joinTitle}</h1>
        <p className="mt-4 text-lg text-[var(--muted)]">{t.joinOk}</p>
        <Button className="mt-6" to="/">
          {t.heroKicker}
        </Button>
      </div>
    )
  }
  return (
    <form onSubmit={submit} className="surface mx-auto max-w-xl rounded-3xl p-8 md:p-10">
      <h1 className="text-3xl font-semibold">{t.joinTitle}</h1>
      <p className="mt-3 text-[var(--muted)]">{t.joinLead}</p>
      <label className="mt-6 block text-sm font-medium">
        {t.joinName}
        <input className={field} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </label>
      <label className="mt-4 block text-sm font-medium">
        {t.email}
        <input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label className="mt-4 block text-sm font-medium">
        {t.joinProfession}
        <select className={field} value={profession} onChange={(e) => setProfession(e.target.value)}>
          <option value="PILOT">{t.profPilot}</option>
          <option value="ATC">{t.profAtc}</option>
          <option value="STUDENT">{t.profStudent}</option>
          <option value="OTHER">{t.profOther}</option>
        </select>
      </label>
      <label className="mt-4 block text-sm font-medium">
        {t.joinRole}
        <select className={field} value={requestedRole} onChange={(e) => setRequestedRole(e.target.value)}>
          <option value="AUTHOR">{t.roleAuthor}</option>
          <option value="EDITOR">{t.roleEditor}</option>
          <option value="CONTRIBUTOR">{t.roleContributor}</option>
        </select>
      </label>
      <label className="mt-4 block text-sm font-medium">
        {t.joinExp}
        <textarea className={field} rows={2} value={experience} onChange={(e) => setExperience(e.target.value)} />
      </label>
      <label className="mt-4 block text-sm font-medium">
        {t.joinMsg}
        <textarea className={field} rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required />
      </label>
      {error ? <p className="mt-3 text-[var(--warn)]">{error}</p> : null}
      <Button className="mt-6 w-full" type="submit">
        {t.joinSend}
      </Button>
    </form>
  )
}

const field =
  'mt-1 w-full rounded-xl border border-[var(--stroke)] bg-[var(--bg)] px-3 py-3 text-[var(--ink)]'
