import { useEffect, useMemo, useRef, useState } from 'react'
import { api, token } from '../shared/api'
import { phraseMatchesAny } from '../shared/phrase'
import { speakAtc, startRadioBed } from '../shared/atcSpeech'
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

const SAVE = 'towerGameV3'
const W = 640
const CX = 320
const CY = 320
const RR = 292

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
    { id: 'a', cs: 'Turkish 941', x: 230, y: 150, hdg: 160, spd: 210, alt: 4000, phase: 'app', squawk: '2201', last: '' },
    { id: 'b', cs: 'SunExpress 773', x: 390, y: 175, hdg: 170, spd: 180, alt: 2200, phase: 'final', squawk: '3344', last: '' },
    { id: 'c', cs: 'Anadolu 221', x: 318, y: 300, hdg: 160, spd: 60, alt: 0, phase: 'rw', squawk: '1200', last: '' },
    { id: 'd', cs: 'Sunturk 12', x: 270, y: 360, hdg: 90, spd: 22, alt: 0, phase: 'taxi', squawk: '4412', last: '' },
    { id: 'e', cs: 'Turkish 777', x: 470, y: 240, hdg: 250, spd: 220, alt: 5000, phase: 'hold', squawk: '7700', emerg: 'mayday', last: '' },
    { id: 'f', cs: 'Emirates 412', x: 200, y: 230, hdg: 155, spd: 200, alt: 3500, phase: 'app', squawk: '4521', last: '' },
    { id: 'g', cs: 'KLM 441', x: 430, y: 430, hdg: 340, spd: 190, alt: 6000, phase: 'hold', squawk: '2211', last: '' },
    { id: 'h', cs: 'Sunturk 88', x: 180, y: 390, hdg: 40, spd: 18, alt: 0, phase: 'taxi', squawk: '1200', emerg: 'pan', last: '' },
    { id: 'i', cs: 'FedEx 16', x: 340, y: 268, hdg: 160, spd: 80, alt: 0, phase: 'dep', squawk: '6016', last: '' },
    { id: 'j', cs: 'Ryanair 92', x: 360, y: 200, hdg: 160, spd: 160, alt: 1200, phase: 'final', squawk: '1192', last: '' },
    { id: 'k', cs: 'Turkish 632', x: 150, y: 280, hdg: 70, spd: 25, alt: 0, phase: 'taxi', squawk: '1632', last: '' },
  ]
}

function blipColor(a: Ac) {
  if (a.emerg === 'mayday') return '#ff8ad4'
  if (a.phase === 'dep' || (a.phase === 'rw' && a.spd >= 40)) return '#ffe566'
  return '#f4f7fb'
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
  const fleetRef = useRef(fleet)
  const busyRef = useRef(false)
  const selRef = useRef(sel)
  const [cutIn, setCutIn] = useState('')
  const ac = fleet.find((a) => a.id === sel) || null
  const cmds = useMemo(() => CMDS.filter((c) => c.roles.includes(role)), [role])
  fleetRef.current = fleet
  busyRef.current = busy
  selRef.current = sel

  useEffect(() => {
    const id = window.setInterval(() => {
      setFleet((prev) =>
        prev.map((a) => {
          if (a.phase === 'rw' || a.spd < 5) return a
          const rad = ((a.hdg - 90) * Math.PI) / 180
          const step = a.spd / 160
          let x = a.x + Math.cos(rad) * step
          let y = a.y + Math.sin(rad) * step
          const dx = x - CX
          const dy = y - CY
          if (Math.hypot(dx, dy) > RR - 18) {
            a = { ...a, hdg: (a.hdg + 140) % 360 }
            x = CX + (dx / Math.hypot(dx, dy)) * (RR - 24)
            y = CY + (dy / Math.hypot(dx, dy)) * (RR - 24)
          }
          return { ...a, x, y }
        }),
      )
    }, 800)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    localStorage.setItem(SAVE, JSON.stringify({ role, handled, fleet }))
  }, [role, handled, fleet])

  useEffect(() => {
    const stopBed = startRadioBed()
    const chatter = [
      'Istanbul Ground, KLM 441, request push and start',
      'Ryanair 92, final runway 16 Left',
      'FedEx 16, ready for departure',
      'Emirates 412, request descent 3000',
      'SunExpress 773, holding short 16 Left',
      'Sunturk 12, taxi via Bravo',
      'Turkish 632, request taxi',
    ]
    const id = window.setInterval(() => {
      const pack = fleetRef.current
      if (!pack.length) return
      if (busyRef.current) {
        if (Math.random() > 0.4) return
        const other = pack.filter((a) => a.id !== selRef.current)
        const a = other[Math.floor(Math.random() * other.length)]
        if (!a) return
        const line = a.emerg === 'mayday'
          ? `BREAK BREAK, MAYDAY ${a.cs}`
          : `${a.cs}, Istanbul Tower, ${a.phase === 'final' ? 'final 16 Left' : 'requesting'}`
        setCutIn(line)
        setWho(a.cs)
        setStrip(line)
        speakAtc(line, 'en-US', 0.95)
        return
      }
      if (Math.random() > 0.5) return
      const line = chatter[Math.floor(Math.random() * chatter.length)]
      speakAtc(line, 'en-US', 0.32)
    }, 8000)
    return () => {
      stopBed()
      window.clearInterval(id)
    }
  }, [])

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
      const ok = phraseMatchesAny(text, line, [ac.cs, cmd.label, 'sunturk', 'turkish', 'sun express'])
      const from = ac.cs
      if (ok && Math.random() < 0.18) {
        setWho(from)
        setStrip(`${from}, say again from the start.`)
        speakAtc(`${from} say again`)
      } else if (ok) {
        let ans = replyFor(cmd, ac)
        const good = positive(cmd, ac)
        if (good && Math.random() < 0.2 && cmd.id !== 'may' && cmd.id !== 'pan') {
          ans = `${from}, unable due traffic.`
          setWho(from)
          setStrip(ans)
          speakAtc(ans)
        } else {
          setWho(from)
          setStrip(ans)
          speakAtc(ans)
          setHandled((n) => n + (good ? 1 : 0))
        }
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
    <div className="radar-board rounded-3xl p-4 md:p-6">
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_300px]">
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
        <svg viewBox={`0 0 ${W} ${W}`} className="radar-scope mt-3">
          <defs>
            <radialGradient id="crt" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#0a3d1c" />
              <stop offset="70%" stopColor="#03160a" />
              <stop offset="100%" stopColor="#010805" />
            </radialGradient>
            <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#39ff88" stopOpacity="0" />
              <stop offset="85%" stopColor="#39ff88" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#b6ffd0" stopOpacity="0.85" />
            </linearGradient>
            <clipPath id="scope">
              <circle cx={CX} cy={CY} r={RR} />
            </clipPath>
          </defs>
          <circle cx={CX} cy={CY} r={RR + 6} fill="#04140a" stroke="#145c32" strokeWidth="6" />
          <g clipPath="url(#scope)">
            <circle cx={CX} cy={CY} r={RR} fill="url(#crt)" />
            {[70, 140, 210, 280].map((r) => (
              <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="#1f8a4d" strokeWidth="1" opacity="0.45" />
            ))}
            <line x1={CX} y1={CY - RR} x2={CX} y2={CY + RR} stroke="#1f8a4d" strokeWidth="1" opacity="0.4" />
            <line x1={CX - RR} y1={CY} x2={CX + RR} y2={CY} stroke="#1f8a4d" strokeWidth="1" opacity="0.4" />
            <g transform={`rotate(-20 ${CX} ${CY})`}>
              <rect x={CX - 10} y={CY - 100} width="6" height="200" fill="#3dff8a" opacity="0.85" />
              <rect x={CX + 12} y={CY - 100} width="6" height="200" fill="#3dff8a" opacity="0.7" />
              <text x={CX - 7} y={CY - 108} fill="#b8ffd0" fontSize="11" fontFamily="IBM Plex Mono, monospace">16L</text>
              <text x={CX + 15} y={CY - 108} fill="#b8ffd0" fontSize="11" fontFamily="IBM Plex Mono, monospace">16R</text>
              <text x={CX - 7} y={CY + 116} fill="#b8ffd0" fontSize="11" fontFamily="IBM Plex Mono, monospace">34R</text>
              <text x={CX + 15} y={CY + 116} fill="#b8ffd0" fontSize="11" fontFamily="IBM Plex Mono, monospace">34L</text>
              <text x={CX + 28} y={CY - 40} fill="#6fdd9a" fontSize="9" fontFamily="IBM Plex Mono, monospace">160°</text>
              <text x={CX + 28} y={CY + 48} fill="#6fdd9a" fontSize="9" fontFamily="IBM Plex Mono, monospace">340°</text>
              <line x1={CX - 40} y1={CY + 40} x2={CX - 10} y2={CY + 40} stroke="#2fa05a" strokeWidth="1.5" />
              <text x={CX - 52} y={CY + 44} fill="#6fdd9a" fontSize="9" fontFamily="IBM Plex Mono, monospace">A</text>
              <line x1={CX + 18} y1={CY - 20} x2={CX + 48} y2={CY - 20} stroke="#2fa05a" strokeWidth="1.5" />
              <text x={CX + 52} y={CY - 16} fill="#6fdd9a" fontSize="9" fontFamily="IBM Plex Mono, monospace">B</text>
            </g>
            <text x={CX - 12} y={CY - RR + 18} fill="#7dffb0" fontSize="10" fontFamily="IBM Plex Mono, monospace">360</text>
            <text x={CX + RR - 28} y={CY + 4} fill="#7dffb0" fontSize="10" fontFamily="IBM Plex Mono, monospace">090</text>
            <text x={CX - 12} y={CY + RR - 8} fill="#7dffb0" fontSize="10" fontFamily="IBM Plex Mono, monospace">180</text>
            <text x={CX - RR + 8} y={CY + 4} fill="#7dffb0" fontSize="10" fontFamily="IBM Plex Mono, monospace">270</text>
            <g className="radar-sweep">
              <path d={`M ${CX} ${CY} L ${CX} ${CY - RR} A ${RR} ${RR} 0 0 1 ${CX + RR * 0.35} ${CY - RR * 0.94} Z`} fill="url(#beam)" />
              <line x1={CX} y1={CY} x2={CX} y2={CY - RR} stroke="#d8ffe8" strokeWidth="2" />
            </g>
            {fleet.map((a) => {
              const tone = blipColor(a)
              return (
                <g key={a.id} onClick={() => { setSel(a.id); setCmd(null) }} className="cursor-pointer">
                  <rect x={a.x - 4} y={a.y - 4} width="8" height="8" transform={`rotate(45 ${a.x} ${a.y})`} fill={tone} stroke={sel === a.id ? '#fff' : tone} strokeWidth={sel === a.id ? 2 : 0} />
                  <line x1={a.x} y1={a.y} x2={a.x + Math.cos(((a.hdg - 90) * Math.PI) / 180) * 14} y2={a.y + Math.sin(((a.hdg - 90) * Math.PI) / 180) * 14} stroke={tone} strokeWidth="1.5" />
                  <text x={a.x + 10} y={a.y - 8} fill={tone} fontSize="11" fontFamily="IBM Plex Mono, monospace">{a.cs}</text>
                  {a.emerg === 'mayday' ? (
                    <text x={a.x + 10} y={a.y + 6} fill="#ff8ad4" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="700">EM</text>
                  ) : a.emerg === 'pan' ? (
                    <text x={a.x + 10} y={a.y + 6} fill="#ff3b3b" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="700">PAN</text>
                  ) : (
                    <text x={a.x + 10} y={a.y + 6} fill="#9ad7b0" fontSize="9" fontFamily="IBM Plex Mono, monospace">{a.alt || 'GND'} {a.hdg}° {a.phase === 'rw' || a.phase === 'dep' ? '16L' : ''}</text>
                  )}
                </g>
              )
            })}
          </g>
          <text x={CX} y="28" textAnchor="middle" fill="#7dffb0" fontSize="13" fontFamily="IBM Plex Mono, monospace">LTFM IGA</text>
          <text x={CX} y="44" textAnchor="middle" fill="#3d9a62" fontSize="10" fontFamily="IBM Plex Mono, monospace">RWY 16L/34R · 16R/34L · HDG 160/340</text>
        </svg>
        <p className="mt-3 font-mono text-[11px] text-[#7dffb0]">
          beyaz: trafik · sarı: kalkış · pembe+EM: acil · kırmızı PAN
        </p>
        {cutIn ? <p className="mt-2 rounded-xl border border-amber-400/50 bg-amber-500/15 px-3 py-2 text-sm">{cutIn}</p> : null}
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
