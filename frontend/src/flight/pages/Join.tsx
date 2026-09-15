import { useState, type FormEvent } from 'react'
import { api } from '../../shared/api'
import { DEMO, demoSaveApp } from '../../shared/demo'
import { useI18n } from '../../shared/i18n'
import { Button } from '../../shared/Button'

export function Join() {
  const { t } = useI18n()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [profession, setProfession] = useState('PILOT')
  const [requestedRole, setRequestedRole] = useState('AUTHOR')
  const [experience, setExperience] = useState('')
  const [intro, setIntro] = useState('')
  const [message, setMessage] = useState('')
  const [privacy, setPrivacy] = useState(false)
  const [notice, setNotice] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!privacy || !notice) {
      setError(t.joinNeedConsent)
      return
    }
    try {
      if (DEMO) {
        demoSaveApp({
          id: Date.now(),
          fullName,
          email,
          profession,
          requestedRole,
          experience,
          intro,
          message,
          status: 'PENDING',
        })
        setOk(true)
        return
      }
      await api.joinTeam({ fullName, email, profession, requestedRole, experience, intro, message })
      setOk(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.retry)
    }
  }
  return (
    <div className="join-scene min-h-full">
      <section className="relative min-h-[280px] overflow-hidden md:min-h-[380px]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/atmosphere/join.jpg)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
        <div className="relative mx-auto flex min-h-[280px] max-w-6xl flex-col justify-end px-4 py-10 text-white md:min-h-[380px] md:py-14">
          <p className="font-mono text-xs tracking-[0.28em] text-[var(--amber)]">{t.joinKicker}</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-extrabold md:text-6xl">{t.joinTitle}</h1>
          <p className="mt-3 max-w-2xl text-white/85">{t.joinLead}</p>
        </div>
      </section>

      {ok ? (
        <div className="article-sheet mx-auto my-10 max-w-lg rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-semibold">{t.joinTitle}</h2>
          <p className="mt-4 text-lg text-[var(--muted)]">{t.joinOk}</p>
          <Button className="mt-6" to="/">
            {t.heroKicker}
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="article-sheet relative z-10 mx-auto -mt-10 mb-16 max-w-xl rounded-3xl p-8 md:p-10">
          <label className="block text-sm font-medium">
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
              <option value="MENTOR">{t.roleMentor}</option>
            </select>
          </label>
          <label className="mt-4 block text-sm font-medium">
            {t.joinExp}
            <textarea className={field} rows={2} value={experience} onChange={(e) => setExperience(e.target.value)} />
          </label>
          <label className="mt-4 block text-sm font-medium">
            {t.joinIntro}
            <textarea className={field} rows={2} value={intro} onChange={(e) => setIntro(e.target.value)} />
          </label>
          <label className="mt-4 block text-sm font-medium">
            {t.joinMsg}
            <textarea className={field} rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required />
          </label>

          <fieldset className="mt-6 space-y-4 rounded-2xl border border-[var(--stroke)] p-4">
            <legend className="px-1 text-sm font-semibold">{t.joinPrivacy}</legend>
            <p className="text-sm leading-6 text-[var(--muted)]">{t.joinPrivacyBody}</p>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[var(--navy)]"
                checked={privacy}
                onChange={(e) => setPrivacy(e.target.checked)}
              />
              <span>{t.joinAcceptPrivacy}</span>
            </label>
          </fieldset>
          <fieldset className="mt-4 space-y-4 rounded-2xl border border-[var(--stroke)] p-4">
            <legend className="px-1 text-sm font-semibold">{t.joinNotice}</legend>
            <p className="text-sm leading-6 text-[var(--muted)]">{t.joinNoticeBody}</p>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[var(--navy)]"
                checked={notice}
                onChange={(e) => setNotice(e.target.checked)}
              />
              <span>{t.joinAcceptNotice}</span>
            </label>
          </fieldset>

          {error ? <p className="mt-3 text-[var(--warn)]">{error}</p> : null}
          <Button className="mt-6 w-full" type="submit">
            {t.joinSend}
          </Button>
        </form>
      )}
    </div>
  )
}

const field =
  'mt-1 w-full rounded-xl border border-[var(--stroke)] bg-[var(--bg)] px-3 py-3 text-[var(--ink)]'
