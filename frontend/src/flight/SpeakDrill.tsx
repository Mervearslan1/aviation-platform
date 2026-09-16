import { useState } from 'react'
import { useI18n } from '../shared/i18n'
import { phraseMatchesAny } from '../shared/phrase'
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
  accepted,
  onPass,
}: {
  prompt?: string
  line: string
  reply?: string
  accepted?: string[]
  onPass: (spoken: string) => void
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
      if (phraseMatchesAny(text, line, accepted)) {
        setOk(true)
        speak(reply || 'Roger.')
        onPass(text)
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
      {heard || ok ? (
        <p
          className={`mt-4 rounded-2xl px-4 py-4 text-lg font-semibold leading-7 ${
            ok
              ? 'border border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
              : 'border border-rose-400 bg-rose-500/10 text-[var(--ink)]'
          }`}
        >
          {ok ? line : heard}
        </p>
      ) : null}
      {heard && !ok ? <p className="mt-2 text-sm text-[var(--warn)]">{t.tryAgain}</p> : null}
    </div>
  )
}
