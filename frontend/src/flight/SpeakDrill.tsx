import { useRef, useState } from 'react'
import { useI18n } from '../shared/i18n'
import { phraseMatchesAny } from '../shared/phrase'
import { speakAtc } from '../shared/atcSpeech'
import { Button } from '../shared/Button'

type Rec = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((ev: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}

type RecCtor = new () => Rec

function recApi(): RecCtor | null {
  const w = window as unknown as { SpeechRecognition?: RecCtor; webkitSpeechRecognition?: RecCtor }
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
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
  const recRef = useRef<Rec | null>(null)
  const timerRef = useRef(0)
  const stopRec = () => {
    window.clearTimeout(timerRef.current)
    try {
      recRef.current?.stop()
    } catch {
      /* already ended */
    }
    recRef.current = null
    setBusy(false)
  }
  const listen = () => {
    const Ctor = recApi()
    if (!Ctor) {
      setHeard(t.noMic)
      return
    }
    stopRec()
    setBusy(true)
    const rec = new Ctor()
    rec.lang = 'en-US'
    rec.continuous = false
    rec.interimResults = false
    rec.onresult = (ev) => {
      const last = ev.results[ev.results.length - 1]
      const text = last[0].transcript
      setHeard(text)
      stopRec()
      if (phraseMatchesAny(text, line, accepted)) {
        setOk(true)
        speakAtc(reply || 'Roger.')
        onPass(text)
      } else {
        setOk(false)
      }
    }
    rec.onerror = () => {
      stopRec()
      setHeard(t.noMic)
    }
    rec.onend = () => {
      recRef.current = null
      setBusy(false)
    }
    recRef.current = rec
    rec.start()
    timerRef.current = window.setTimeout(stopRec, 8000)
  }
  return (
    <div className="mt-6 rounded-3xl border border-[var(--stroke)] bg-[var(--bg)] p-5">
      {prompt ? (
        <div className="mb-4">
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--amber)]">{t.otherParty}</p>
          <p className="mt-2 text-lg">{prompt}</p>
          <Button variant="secondary" className="mt-3" onClick={() => speakAtc(prompt)}>
            {t.listenCall}
          </Button>
        </div>
      ) : null}
      <p className="font-mono text-xs tracking-[0.2em] text-[var(--amber)]">{t.speakThis}</p>
      <p className="mt-3 rounded-2xl bg-[var(--panel)] px-4 py-5 text-xl font-semibold leading-8">{line}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={listen} disabled={busy}>
          {busy ? t.listening : t.tapMic}
        </Button>
        {busy ? (
          <Button variant="ghost" onClick={stopRec}>{t.stopMic}</Button>
        ) : null}
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
