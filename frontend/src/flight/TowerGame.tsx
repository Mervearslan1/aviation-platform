import { useEffect, useMemo, useRef, useState } from 'react'
import { api, token } from '../shared/api'
import { phraseMatchesAny } from '../shared/phrase'
import { speakAtc } from '../shared/atcSpeech'
import { DEMO, demoAddChange, isGuest } from '../shared/demo'
import { useI18n } from '../shared/i18n'
import { Button } from '../shared/Button'

type Role = 'APP' | 'TWR' | 'GND'
type Phase = 'app' | 'final' | 'rw' | 'taxi' | 'hold' | 'dep'

type Ac = {
  id: string
  cs: string
  x: number
  y: number
  hdg: number
  spd: number
  alt: number
  phase: Phase
  squawk: string
  emerg?: 'pan' | 'mayday' | 'nordo' | 'tcas'
  last: string
}

type Cmd = { id: string; label: string; line: (cs: string, ac: Ac) => string; roles: Role[] }

const SAVE = 'towerGameV1'
const W = 640
const H = 520

type MicRec = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((ev: { results: { length: number; [i: number]: { 0: { transcript: string } } } }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}

const CMDS: Cmd[] = [
  { id: 'land', label: 'Cleared to land', line: (cs) => `${cs} runway 16 Left cleared to land`, roles: ['TWR'] },
  { id: 'to', label: 'Cleared take-off', line: (cs) => `${cs} runway 16 Left cleared for take-off`, roles: ['TWR'] },
  { id: 'luw', label: 'Line up and wait', line: (cs) => `${cs} line up and wait runway 16 Left`, roles: ['TWR'] },
  { id: 'ga', label: 'Go around', line: (cs) => `${cs} go around`, roles: ['TWR', 'APP'] },
  { id: 'hold', label: 'Hold short', line: (cs) => `${cs} hold short runway 16 Left`, roles: ['GND', 'TWR'] },
  { id: 'taxi', label: 'Taxi', line: (cs) => `${cs} taxi via Bravo hold short 16 Left`, roles: ['GND'] },
  { id: 'twr', label: 'Contact tower', line: (cs) => `${cs} contact tower 118.8`, roles: ['APP', 'GND'] },
  { id: 'gnd', label: 'Contact ground', line: (cs) => `${cs} contact ground 121.8`, roles: ['TWR'] },
  { id: 'hdg', label: 'Heading', line: (cs, ac) => `${cs} turn heading ${ac.hdg}`, roles: ['APP'] },
  { id: 'des', label: 'Descend', line: (cs, ac) => `${cs} descend ${ac.alt}`, roles: ['APP'] },
  { id: 'clb', label: 'Climb', line: (cs, ac) => `${cs} climb ${ac.alt}`, roles: ['APP', 'TWR'] },
  { id: 'spd', label: 'Speed', line: (cs, ac) => `${cs} reduce speed ${ac.spd}`, roles: ['APP'] },
  { id: 'orbit', label: 'Orbit left', line: (cs) => `${cs} orbit left`, roles: ['APP', 'TWR'] },
  { id: 'say', label: 'Say again', line: (cs) => `${cs} say again`, roles: ['APP', 'TWR', 'GND'] },
  { id: 'may', label: 'Roger MAYDAY', line: (cs) => `${cs} roger MAYDAY runway 16 Left is yours`, roles: ['TWR', 'APP'] },
  { id: 'pan', label: 'Roger PAN', line: (cs) => `${cs} roger PAN PAN number 1`, roles: ['TWR', 'APP'] },
  { id: 'rel', label: 'Relay', line: (cs) => `${cs} relay, squawk ident if you read`, roles: ['APP', 'TWR'] },
  { id: 'ident', label: 'Ident', line: (cs) => `${cs} squawk ident`, roles: ['APP', 'TWR'] },
]

function seed(): Ac[] {
  return [
    { id: 'a', cs: 'Turkish 941', x: 180, y: 90, hdg: 160, spd: 210, alt: 4000, phase: 'app', squawk: '2201', last: '' },
    { id: 'b', cs: 'SunExpress 773', x: 420, y: 70, hdg: 170, spd: 190, alt: 3000, phase: 'final', squawk: '3344', last: '' },
    { id: 'c', cs: 'AJet 221', x: 300, y: 250, hdg: 160, spd: 0, alt: 0, phase: 'rw', squawk: '1200', last: '' },
    { id: 'd', cs: 'Pegasus 12', x: 80, y: 320, hdg: 90, spd: 20, alt: 0, phase: 'taxi', squawk: '4412', last: '' },
    { id: 'e', cs: 'Turkish 777', x: 520, y: 200, hdg: 250, spd: 220, alt: 5000, phase: 'hold', squawk: '7700', emerg: 'mayday', last: '' },
    { id: 'f', cs: 'AJet 45C', x: 240, y: 140, hdg: 155, spd: 180, alt: 2500, phase: 'app', squawk: '4521', emerg: 'tcas', last: '' },
    { id: 'g', cs: 'SunExpress 58T', x: 560, y: 380, hdg: 340, spd: 200, alt: 6000, phase: 'hold', squawk: '7600', emerg: 'nordo', last: '' },
    { id: 'h', cs: 'Pegasus 88', x: 140, y: 400, hdg: 40, spd: 18, alt: 0, phase: 'taxi', squawk: '1200', emerg: 'pan', last: '' },
  ]
}

function loadSave(): { role: Role; handled: number; fleet: Ac[] } | null {
  try {
    return JSON.parse(localStorage.getItem(SAVE) || 'null')
  } catch {
    return null
  }
}

export function TowerGame() {
  const { t } = useI18n()
  const saved = loadSave()
  const [role, setRole] = useState<Role>(saved?.role || 'APP')
  const [fleet, setFleet] = useState<Ac[]>(saved?.fleet || seed())
  const [sel, setSel] = useState<string | null>(null)
  const [cmd, setCmd] = useState<Cmd | null>(null)
  const [strip, setStrip] = useState<string>(t.gameIdle)
  const [who, setWho] = useState('')
  const [busy, setBusy] = useState(false)
  const [handled, setHandled] = useState(saved?.handled || 0)
  const [note, setNote] = useState('')
  const [sent, setSent] = useState('')
  const recRef = useRef<{ stop: () => void } | null>(null)
  const ac = fleet.find((a) => a.id === sel) || null
  const cmds = useMemo(() => CMDS.filter((c) => c.roles.includes(role)), [role])

  useEffect(() => {
    const id = window.setInterval(() => {
      setFleet((prev) =>
        prev.map((a) => {
          if (a.phase === 'rw' || a.spd < 5) return a
          const rad = ((a.hdg - 90) * Math.PI) / 180
          const step = a.spd / 140
          let x = a.x + Math.cos(rad) * step
          let y = a.y + Math.sin(rad) * step
          if (x < 20 || x > W - 20) a = { ...a, hdg: (a.hdg + 180) % 360 }
          if (y < 20 || y > H - 20) a = { ...a, hdg: (a.hdg + 180) % 360 }
          x = Math.min(W - 20, Math.max(20, x))
          y = Math.min(H - 20, Math.max(20, y))
          return { ...a, x, y }
        }),
      )
    }, 800)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    localStorage.setItem(SAVE, JSON.stringify({ role, handled, fleet }))
  }, [role, handled, fleet])

  const bump = (field: 'alt' | 'spd' | 'hdg', delta: number) => {
    if (!sel) return
    setFleet((prev) => prev.map((a) => (a.id === sel ? { ...a, [field]: Math.max(0, a[field] + delta) } : a)))
  }

  const replyFor = (c: Cmd, a: Ac) => {
    if (c.id === 'say') return `${a.cs}, say again.`
    if (c.id === 'rel' && a.emerg === 'nordo') return `${a.cs}, wilco, relaying.`
    if (c.id === 'may' && a.emerg === 'mayday') return `${a.cs}, runway in sight.`
    if (c.id === 'pan' && a.emerg === 'pan') return `${a.cs}, roger priority.`
    if (c.id === 'land' && (a.phase === 'final' || a.phase === 'app')) return `${a.cs}, cleared to land, 16 Left.`
    if (c.id === 'to' && a.phase === 'rw') return `${a.cs}, rolling.`
    if (c.id === 'luw' && (a.phase === 'rw' || a.phase === 'taxi')) return `${a.cs}, lining up.`
    if (c.id === 'hold') return `${a.cs}, holding short.`
    if (c.id === 'ga') return `${a.cs}, going around.`
    if (c.id === 'taxi') return `${a.cs}, taxi via Bravo.`
    if (a.emerg === 'nordo' && c.id !== 'rel') return `${a.cs}, (no reply)`
    if (c.id === 'to' && a.phase !== 'rw') return `${a.cs}, unable, not on the runway.`
    if (c.id === 'land' && a.phase === 'rw') return `${a.cs}, unable, we are on the ground.`
    return `${a.cs}, roger.`
  }

  const positive = (c: Cmd, a: Ac) => {
    if (a.emerg === 'nordo' && c.id !== 'rel' && c.id !== 'say') return false
    if (c.id === 'to' && a.phase !== 'rw') return false
    if (c.id === 'land' && a.phase === 'rw') return false
    return true
  }

  const speakLine = () => {
    if (!ac || !cmd) return
    const line = cmd.line(ac.cs, ac)
    const w = window as unknown as { SpeechRecognition?: new () => MicRec; webkitSpeechRecognition?: new () => MicRec }
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!Ctor) {
      setStrip(t.noMic)
      return
    }
    setBusy(true)
    const rec = new Ctor()
    rec.lang = 'en-US'
    rec.continuous = false
    rec.interimResults = false
    rec.onresult = (ev) => {
      const text = ev.results[ev.results.length - 1][0].transcript
      rec.stop()
      setBusy(false)
      const ok = phraseMatchesAny(text, line, [ac.cs, cmd.label])
      const from = ac.cs
      if (ok) {
        const ans = replyFor(cmd, ac)
        const good = positive(cmd, ac)
        setWho(from)
        setStrip(ans)
        speakAtc(ans)
        setHandled((n) => n + (good ? 1 : 0))
        setFleet((prev) => prev.map((a) => (a.id === ac.id ? { ...a, last: ans } : a)))
      } else {
        setWho(from)
        setStrip(`${from}, say again.`)
        speakAtc(`${from} say again`)
      }
    }
    rec.onend = () => setBusy(false)
    rec.onerror = () => setBusy(false)
    recRef.current = rec
    rec.start()
    window.setTimeout(() => {
      try {
        rec.stop()
      } catch {
        /* */
      }
      setBusy(false)
    }, 8000)
  }

  const reset = () => {
    localStorage.removeItem(SAVE)
    setFleet(seed())
    setHandled(0)
    setSel(null)
    setCmd(null)
    setStrip(t.gameIdle)
    setWho('')
  }

  const report = () => {
    const body = note.trim() || t.gameBugEmpty
    if (DEMO || isGuest() || !token()) {
      demoAddChange('tower-game', who || 'radar', body)
      setSent(t.changeOk)
      setNote('')
      return
    }
    api
      .voteFeedback('tower-game', 'NEEDS_REVIEW', who || 'radar', body)
      .then(() => {
        setSent(t.changeOk)
        setNote('')
      })
      .catch(() => setSent(t.catalogFail))
  }

  const callPilot = (a: Ac) => {
    let line = `${a.cs}, ${role === 'APP' ? 'Istanbul Approach' : role === 'TWR' ? 'Istanbul Tower' : 'Istanbul Ground'}`
    if (a.emerg === 'mayday') line = `MAYDAY MAYDAY MAYDAY, ${a.cs}, engine failure, squawk 7700`
    if (a.emerg === 'pan') line = `PAN PAN PAN, ${a.cs}, medical, request priority`
    if (a.emerg === 'tcas') line = `${a.cs}, traffic alert, TCAS climb`
    if (a.emerg === 'nordo') line = `${a.cs} squawking 7600, no radio`
    if (a.phase === 'rw') line = `${a.cs}, ready for departure, runway 16 Left`
    if (a.phase === 'final') line = `${a.cs}, final 16 Left`
    setWho(a.cs)
    setStrip(line)
    speakAtc(line)
  }

  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_280px]">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          {(['APP', 'TWR', 'GND'] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-full px-3 py-1 font-mono text-xs ${role === r ? 'bg-[var(--btn)] text-[var(--btn-ink)]' : 'border border-[var(--stroke)]'}`}
            >
              {r === 'APP' ? t.gameApp : r === 'TWR' ? t.gameTwr : t.gameGnd}
            </button>
          ))}
          <span className="ml-auto font-mono text-sm text-[var(--amber)]">{handled} {t.gameHandled}</span>
          <Button variant="ghost" onClick={reset}>{t.gameReset}</Button>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full rounded-3xl border border-[var(--stroke)] bg-[#071018]">
          {[80, 160, 240].map((r) => (
            <circle key={r} cx={W / 2} cy={H / 2} r={r} fill="none" stroke="#1f6b4a" strokeWidth="1" opacity="0.5" />
          ))}
          <line x1={W / 2} y1="0" x2={W / 2} y2={H} stroke="#1f6b4a" strokeWidth="1" opacity="0.35" />
          <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="#1f6b4a" strokeWidth="1" opacity="0.35" />
          <g transform={`rotate(-20 ${W / 2} ${H / 2})`}>
            <rect x={W / 2 - 8} y={H / 2 - 110} width="10" height="220" rx="2" fill="#c9d4c0" />
            <rect x={W / 2 + 18} y={H / 2 - 110} width="10" height="220" rx="2" fill="#c9d4c0" />
            <text x={W / 2 - 6} y={H / 2 - 118} fill="#9ad7b0" fontSize="10">16L</text>
            <text x={W / 2 + 20} y={H / 2 - 118} fill="#9ad7b0" fontSize="10">16R</text>
          </g>
          <text x="16" y="22" fill="#9ad7b0" fontSize="12">LTFM IGA</text>
          {fleet.map((a) => (
            <g key={a.id} onClick={() => { setSel(a.id); setCmd(null) }} className="cursor-pointer">
              <circle cx={a.x} cy={a.y} r={sel === a.id ? 9 : 6} fill={a.emerg === 'mayday' ? '#ff6b6b' : a.emerg === 'pan' ? '#f5c542' : a.emerg === 'tcas' ? '#7eb8f0' : '#4ade80'} />
              <text x={a.x + 10} y={a.y - 6} fill="#e8f6ee" fontSize="11">{a.cs}</text>
              <text x={a.x + 10} y={a.y + 8} fill="#8fb89a" fontSize="9">{a.alt || 'GND'} {a.hdg}°</text>
            </g>
          ))}
        </svg>
        <div className="mt-3 rounded-2xl border border-[var(--stroke)] bg-[var(--panel)] px-4 py-3">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--amber)]">{who || 'TWR'}</p>
          <p className="mt-1 text-sm leading-6">{strip}</p>
        </div>
      </div>
      <aside className="space-y-3">
        <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--panel)] p-4 text-sm leading-6">
          <p className="font-mono text-[11px] tracking-[0.2em] text-[var(--amber)]">METAR LTFM</p>
          <p className="mt-1 font-mono text-xs">171250Z 04008KT 9999 FEW030 18/11 Q1016</p>
          <p className="mt-3 font-mono text-[11px] tracking-[0.2em] text-[var(--amber)]">ATIS K</p>
          <p className="mt-1">Landing 16L, departure 16R, wind 040/8, QNH 1016.</p>
          <p className="mt-3 font-mono text-[11px] tracking-[0.2em] text-[var(--amber)]">{t.gameFreq}</p>
          <p className="mt-1 font-mono text-xs">APP 120.5 · TWR 118.8 · GND 121.8</p>
        </div>
        {ac ? (
          <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--panel)] p-4">
            <p className="font-extrabold">{ac.cs}</p>
            <p className="mt-1 font-mono text-xs text-[var(--muted)]">
              SQ {ac.squawk} · {ac.phase} {ac.emerg ? `· ${ac.emerg}` : ''}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <Bar label={t.gameAlt} value={ac.alt} onMinus={() => bump('alt', -500)} onPlus={() => bump('alt', 500)} />
              <Bar label={t.gameHdg} value={ac.hdg} onMinus={() => bump('hdg', -10)} onPlus={() => bump('hdg', 10)} />
              <Bar label={t.gameSpd} value={ac.spd} onMinus={() => bump('spd', -10)} onPlus={() => bump('spd', 10)} />
            </div>
            <Button variant="secondary" className="mt-3 w-full" onClick={() => callPilot(ac)}>{t.gameHear}</Button>
            <p className="mt-3 font-mono text-[11px] tracking-[0.2em] text-[var(--amber)]">{t.gameCmds}</p>
            <div className="mt-2 flex max-h-40 flex-col gap-1 overflow-auto">
              {cmds.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCmd(c)}
                  className={`rounded-xl border px-3 py-2 text-left text-sm ${cmd?.id === c.id ? 'border-emerald-500 bg-emerald-500/15' : 'border-[var(--stroke)]'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {cmd ? (
              <p className="mt-3 rounded-xl bg-[var(--bg)] px-3 py-2 text-sm">{cmd.line(ac.cs, ac)}</p>
            ) : null}
            <Button className="mt-3 w-full" disabled={!cmd || busy} onClick={speakLine}>
              {busy ? t.listening : t.gameSay}
            </Button>
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-[var(--stroke)] p-4 text-sm text-[var(--muted)]">{t.gamePick}</p>
        )}
        <div className="rounded-2xl border border-[var(--stroke)] p-4">
          <p className="text-sm font-semibold">{t.gameBug}</p>
          <textarea
            className="mt-2 w-full rounded-xl border border-[var(--stroke)] bg-[var(--bg)] p-2 text-sm"
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t.gameBugHint}
          />
          <Button variant="secondary" className="mt-2" onClick={report}>{t.gameBugSend}</Button>
          {sent ? <p className="mt-2 text-xs text-[var(--muted)]">{sent}</p> : null}
        </div>
      </aside>
    </div>
  )
}

function Bar({ label, value, onMinus, onPlus }: { label: string; value: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <div className="rounded-xl border border-[var(--stroke)] px-1 py-2">
      <p className="text-[10px] text-[var(--muted)]">{label}</p>
      <p className="font-mono">{value}</p>
      <div className="mt-1 flex justify-center gap-1">
        <button type="button" className="h-6 w-6 rounded border border-[var(--stroke)]" onClick={onMinus}>−</button>
        <button type="button" className="h-6 w-6 rounded border border-[var(--stroke)]" onClick={onPlus}>+</button>
      </div>
    </div>
  )
}
