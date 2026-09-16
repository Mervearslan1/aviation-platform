import { useState } from 'react'
import { useI18n } from '../shared/i18n'
import { phraseMatches } from '../shared/phrase'
import { Button } from '../shared/Button'

type RecCtor = new () => {
  lang: string
  start: () => void
  onresult: ((ev: { results: { 0: { 0: { transcript: string } } } }) => void) | null
  onerror: (() => void) | null
}

function recApi(): RecCtor | null {
  const w = window as unknown as { SpeechRecognition?: RecCtor; webkitSpeechRecognition?: RecCtor }
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

function speak(text: string, lang = 'en-US') {
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  speechSynthesis.cancel()
  speechSynthesis.speak(u)
}

export function SpeakDrill({
  prompt,
  line,
  reply,
  onPass,
}: {
  prompt?: string
  line: string
  reply?: string
  onPass: () => void
}) {
  const { t } = useI18n()
  const [heard, setHeard] = useState('')
  const [ok, setOk] = useState(false)
  const [busy, setBusy] = useState(false)
  const listen = () => {
    const Ctor = recApi()
    if (!Ctor) {
      setHeard(t.noMic)
      return
    }
    setBusy(true)
    const rec = new Ctor()
    rec.lang = 'en-US'
    rec.onresult = (ev) => {
      const text = ev.results[0][0].transcript
      setHeard(text)
      setBusy(false)
      if (phraseMatches(text, line)) {
        setOk(true)
        speak(reply || 'Roger.')
        onPass()
      } else {
        setOk(false)
      }
    }
    rec.onerror = () => {
      setBusy(false)
      setHeard(t.noMic)
    }
    rec.start()
  }
  return (
    <div className="mt-6 rounded-3xl border border-[var(--stroke)] bg-[var(--bg)] p-5">
      {prompt ? (
        <div className="mb-4">
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--amber)]">{t.otherParty}</p>
          <p className="mt-2 text-lg">{prompt}</p>
          <Button variant="secondary" className="mt-3" onClick={() => speak(prompt)}>
            {t.listenCall}
          </Button>
        </div>
      ) : null}
      <p className="font-mono text-xs tracking-[0.2em] text-[var(--amber)]">{t.speakThis}</p>
      <p className="mt-3 rounded-2xl bg-[var(--panel)] px-4 py-5 text-xl font-semibold leading-8">{line}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={listen} disabled={busy}>
          {busy ? '…' : t.tapMic}
        </Button>
      </div>
      {heard ? (
        <p className="mt-3 text-sm text-[var(--muted)]">
          {t.heard}: {heard}
        </p>
      ) : null}
      {ok ? <p className="mt-3 font-semibold text-[var(--good)]">{t.correct}</p> : null}
      {heard && !ok ? <p className="mt-3 text-[var(--warn)]">{t.tryAgain}</p> : null}
    </div>
  )
}
