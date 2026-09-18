import { useEffect, useMemo, useRef, useState } from 'react'
import { api, token } from '../shared/api'
import { phraseMatchesAny } from '../shared/phrase'
import { speakAtc, silenceRadio } from '../shared/atcSpeech'
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
  emerg?: 'pan' | 'mayday' | 'nordo'
  last: string
}

type Cmd = { id: string; label: string; line: (cs: string, ac: Ac) => string; roles: Role[] }

const LOC_KEY = 'tower5247done'
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
  { id: 'ahead', label: 'Go ahead', line: (cs) => `${cs} go ahead`, roles: ['APP', 'TWR', 'GND'] },
  { id: 'cont', label: 'Continue', line: (cs) => `${cs} continue`, roles: ['APP', 'TWR'] },
  { id: 'aff', label: 'Affirm', line: (cs) => `${cs} affirm`, roles: ['APP', 'TWR', 'GND'] },
  { id: 'unb', label: 'Unable', line: (cs) => `${cs} unable`, roles: ['APP', 'TWR', 'GND'] },
  { id: 'say', label: 'Say again', line: (cs) => `${cs} say again`, roles: ['APP', 'TWR', 'GND'] },
  { id: 'land', label: 'Cleared to land', line: (cs) => `${cs} runway 16 Left cleared to land`, roles: ['TWR'] },
  { id: 'to', label: 'Cleared take-off', line: (cs) => `${cs} runway 16 Left cleared for take-off`, roles: ['TWR'] },
  { id: 'luw', label: 'Line up and wait', line: (cs) => `${cs} line up and wait runway 16 Left`, roles: ['TWR'] },
  { id: 'ga', label: 'Go around', line: (cs) => `${cs} go around`, roles: ['TWR', 'APP'] },
  { id: 'hold', label: 'Hold short', line: (cs) => `${cs} hold short runway 16 Left`, roles: ['GND', 'TWR'] },
  { id: 'taxi', label: 'Taxi', line: (cs) => `${cs} taxi via Bravo hold short 16 Left`, roles: ['GND'] },
  { id: 'ils', label: 'Cleared ILS', line: (cs) => `${cs} cleared ILS runway 16 Left`, roles: ['APP'] },
  { id: 'twr', label: 'Contact tower', line: (cs) => `${cs} contact tower 118.8`, roles: ['APP'] },
  { id: 'gnd', label: 'Contact ground', line: (cs) => `${cs} contact ground 121.8`, roles: ['TWR'] },
  { id: 'hdg', label: 'Heading', line: (cs, ac) => `${cs} turn heading ${ac.hdg}`, roles: ['APP'] },
  { id: 'des', label: 'Descend', line: (cs, ac) => `${cs} descend ${ac.alt}`, roles: ['APP'] },
  { id: 'may', label: 'Roger MAYDAY', line: (cs) => `${cs} roger MAYDAY runway 16 Left is yours`, roles: ['TWR', 'APP'] },
  { id: 'pan', label: 'Roger PAN', line: (cs) => `${cs} roger PAN PAN number 1`, roles: ['TWR', 'APP'] },
]

const POOL: Ac[] = [
  { id: 'a', cs: 'Turkish 941', x: 230, y: 150, hdg: 160, spd: 180, alt: 4000, phase: 'app', squawk: '2201', last: '' },
  { id: 'b', cs: 'SunExpress 773', x: 390, y: 175, hdg: 170, spd: 160, alt: 2200, phase: 'final', squawk: '3344', last: '' },
  { id: 'c', cs: 'Anadolu 221', x: 318, y: 300, hdg: 160, spd: 50, alt: 0, phase: 'rw', squawk: '1200', last: '' },
  { id: 'd', cs: 'Sunturk 12', x: 270, y: 360, hdg: 90, spd: 18, alt: 0, phase: 'taxi', squawk: '4412', last: '' },
  { id: 'e', cs: 'Turkish 777', x: 470, y: 240, hdg: 250, spd: 190, alt: 5000, phase: 'hold', squawk: '7700', emerg: 'mayday', last: '' },
  { id: 'f', cs: 'Emirates 412', x: 200, y: 230, hdg: 155, spd: 170, alt: 3500, phase: 'app', squawk: '4521', last: '' },
  { id: 'g', cs: 'KLM 441', x: 430, y: 430, hdg: 340, spd: 160, alt: 6000, phase: 'hold', squawk: '2211', last: '' },
  { id: 'h', cs: 'Sunturk 88', x: 180, y: 390, hdg: 40, spd: 16, alt: 0, phase: 'taxi', squawk: '1200', emerg: 'pan', last: '' },
  { id: 'i', cs: 'FedEx 16', x: 340, y: 268, hdg: 160, spd: 70, alt: 0, phase: 'dep', squawk: '6016', last: '' },
  { id: 'j', cs: 'Ryanair 92', x: 360, y: 200, hdg: 160, spd: 150, alt: 1200, phase: 'final', squawk: '1192', last: '' },
  { id: 'k', cs: 'Turkish 632', x: 150, y: 280, hdg: 70, spd: 20, alt: 0, phase: 'taxi', squawk: '1632', last: '' },
]

const AC5247: Ac = {
  id: '5247', cs: '5247', x: 300, y: 210, hdg: 60, spd: 140, alt: 1800, phase: 'final', squawk: '5247', last: '',
}

const LOC_STEPS: { expect: string[]; say: string[] }[] = [
  {
    expect: ['günaydın iniş serbest rüzgar sakin', 'gunaydin inis serbest ruzgar sakin', 'cleared to land wind calm'],
    say: ['Serbest sakin.', 'Efendim sizin 06 nın localizerı yok.'],
  },
  {
    expect: ['anlaşıldı yaklaşmaya devam', 'anlasildi yaklasmaya devam', 'ilgili yerlere haber', 'continue approach'],
    say: [],
  },
  {
    expect: ['5247 ILS alıyor musunuz', 'ils aliyor musunuz', 'are you receiving ILS'],
    say: ['Efendim sinyal devamlı var ama localizer şu anda gip gip geliyor.'],
  },
  {
    expect: ['inecek misiniz', 'inecek misiniz', 'will you land'],
    say: ['İneceğiz tabi efendim ne olacak ki, gayet güzel iniyoruz.'],
  },
  {
    expect: ['tamam iyi inişler rüzgar hala sakin', 'iyi inisler ruzgar sakin'],
    say: ['Anladım sağol.'],
  },
  {
    expect: ['geçmeyin tabii efendim buyrun inin', 'gecmeyin buyrun inin', 'continue, cleared to land'],
    say: ['Biz eskiden inerken hiç localizer yoktu ki.'],
  },
  {
    expect: ['anlaşıldı', 'anlasildi', 'roger'],
    say: [],
  },
]

const WX_GOOD = {
  metar: 'LTFM 171250Z 04008KT 9999 FEW030 18/11 Q1016 NOSIG',
  atis: 'Istanbul information Kilo, landing 16 Left, departure 16 Right, wind 040 degrees 8 knots, visibility 10 kilometers, QNH 1016.',
  bad: false,
  news: '',
}
const WX_BAD = {
  metar: 'LTFM 171250Z 16022G35KT 2000 RA BKN008 11/10 Q1002',
  atis: 'Istanbul information Lima, landing ILS 16 Left, wind 160 degrees 22 gusting 35, visibility 2000 meters in rain, cloud broken 800 feet, QNH 1002. Expect ILS.',
  bad: true,
  news: 'Hava kötü: yağmur, 2000 m görüş, rüzgar 160/22G35. ILS 16L bekleyin.',
}

function forRole(a: Ac, role: Role) {
  if (role === 'APP') return a.phase === 'app' || a.phase === 'hold'
  if (role === 'TWR') return a.phase === 'final' || a.phase === 'rw' || a.phase === 'dep'
  return a.phase === 'taxi'
}

function startFleet(role: Role) {
  return POOL.filter((a) => forRole(a, role)).slice(0, 2)
}

function blipColor(a: Ac) {
  if (a.emerg === 'mayday') return '#ff8ad4'
  if (a.phase === 'dep' || (a.phase === 'rw' && a.spd >= 40)) return '#ffe566'
  return '#f4f7fb'
}

function isRealTalk(text: string) {
  const n = text.toLowerCase().replace(/[^a-z0-9çğıöşü ]/gi, ' ').replace(/\s+/g, ' ').trim()
  if (n.length < 5) return false
  const noise = new Set(['uh', 'um', 'ah', 'eh', 'hmm', 'mm', 'ı', 'e', 'a', 'aa', 'ee', 'ıı'])
  const words = n.split(' ').filter((w) => w.length > 1 && !noise.has(w))
  return words.length >= 1 && (n.length >= 6 || /\d/.test(n))
}

function has(text: string, bits: string[]) {
  const n = text.toLowerCase()
  return bits.some((b) => n.includes(b.toLowerCase()))
}

function findCs(text: string, pack: Ac[]) {
  const n = text.toLowerCase().replace(/ı/g, 'i')
  return pack.find((a) => {
    const cs = a.cs.toLowerCase()
    const num = cs.split(' ').pop() || cs
    return n.includes(cs) || n.includes(num)
  })
}

export function TowerGame() {
  const { t } = useI18n()
  const wx = useMemo(() => (Math.random() < 0.35 ? WX_BAD : WX_GOOD), [])
  const [role, setRole] = useState<Role>('APP')
  const [fleet, setFleet] = useState<Ac[]>(() => startFleet('APP'))
  const [sel, setSel] = useState<string | null>(null)
  const [cmd, setCmd] = useState<Cmd | null>(null)
  const [strip, setStrip] = useState<string>(t.gameIdle)
  const [who, setWho] = useState('')
  const [busy, setBusy] = useState(false)
  const [handled, setHandled] = useState(0)
  const [note, setNote] = useState('')
  const [sent, setSent] = useState('')
  const [bugOpen, setBugOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [locStep, setLocStep] = useState(-1)
  const recRef = useRef<{ stop: () => void } | null>(null)
  const listenRef = useRef<() => void>(() => undefined)
  const ac = fleet.find((a) => a.id === sel) || null
  const cmds = useMemo(() => CMDS.filter((c) => c.roles.includes(role)), [role])
  const shown = fleet.filter((a) => forRole(a, role) || a.id === '5247')

  useEffect(() => {
    const id = window.setInterval(() => {
      setFleet((prev) =>
        prev.map((a) => {
          if (a.phase === 'rw' || a.phase === 'taxi' || a.spd < 8) return a
          const rad = ((a.hdg - 90) * Math.PI) / 180
          const step = a.spd / 180
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
    }, 900)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setFleet((prev) => {
        const have = new Set(prev.map((a) => a.id))
        const next = POOL.find((a) => forRole(a, role) && !have.has(a.id))
        if (!next || prev.filter((a) => forRole(a, role)).length >= 5) return prev
        return [...prev, { ...next }]
      })
    }, 22000)
    return () => window.clearInterval(id)
  }, [role])

  useEffect(() => {
    if (role !== 'TWR' || localStorage.getItem(LOC_KEY) === '1') return
    const tmr = window.setTimeout(() => {
      setFleet((prev) => (prev.some((a) => a.id === '5247') ? prev : [...prev, AC5247]))
      setSel('5247')
      setLocStep(0)
      setWho('5247')
      setStrip('İstanbul günaydın 5247 pist 06 establish')
      speakAtc('İstanbul günaydın 5247 pist 06 establish', 'tr-TR')
      setFleet((prev) => prev.map((x) => (x.id === '5247' ? { ...x, last: 'called' } : x)))
    }, 5000)
    return () => window.clearTimeout(tmr)
  }, [role])

  const switchRole = (r: Role) => {
    silenceRadio()
    setRole(r)
    setSel(null)
    setCmd(null)
    const keep = fleet.filter((a) => forRole(a, r) || a.id === '5247')
    const add = startFleet(r).filter((a) => !keep.some((k) => k.id === a.id))
    setFleet([...keep, ...add])
  }

  const bump = (field: 'alt' | 'spd' | 'hdg', delta: number) => {
    if (!sel) return
    setFleet((prev) => prev.map((a) => (a.id === sel ? { ...a, [field]: Math.max(0, a[field] + delta) } : a)))
  }

  const replyFor = (id: string, a: Ac) => {
    if (id === 'ahead') return `${a.cs}, go ahead.`
    if (id === 'cont') return `${a.cs}, continuing.`
    if (id === 'aff') return `${a.cs}, affirm.`
    if (id === 'unb') return `${a.cs}, roger, unable.`
    if (id === 'say') return `${a.cs}, say again.`
    if (id === 'ils') return `${a.cs}, ILS 16 Left.`
    if (id === 'twr') {
      setFleet((prev) => prev.map((x) => (x.id === a.id ? { ...x, phase: 'final' as Phase } : x)))
      return `${a.cs}, contacting tower 118.8.`
    }
    if (id === 'gnd') {
      setFleet((prev) => prev.map((x) => (x.id === a.id ? { ...x, phase: 'taxi' as Phase } : x)))
      return `${a.cs}, ground 121.8.`
    }
    if (id === 'land') return `${a.cs}, cleared to land 16 Left.`
    if (id === 'to') return a.phase === 'rw' || a.phase === 'dep' ? `${a.cs}, rolling.` : `${a.cs}, unable, not on the runway.`
    if (id === 'luw') return `${a.cs}, lining up.`
    if (id === 'hold') return `${a.cs}, holding short.`
    if (id === 'ga') return `${a.cs}, going around.`
    if (id === 'taxi') return `${a.cs}, taxi via Bravo.`
    if (id === 'may') return `${a.cs}, runway in sight.`
    if (id === 'pan') return `${a.cs}, roger priority.`
    return `${a.cs}, roger.`
  }

  const advanceLoc = (text: string) => {
    if (locStep < 0 || locStep >= LOC_STEPS.length) return false
    const step = LOC_STEPS[locStep]
    if (!phraseMatchesAny(text, step.expect[0], step.expect)) return false
    const lines = step.say
    if (lines.length) {
      setWho('5247')
      setStrip(lines.join(' '))
      speakAtc(lines.join(' '), 'tr-TR')
    }
    const nxt = locStep + 1
    setLocStep(nxt)
    if (nxt >= LOC_STEPS.length) localStorage.setItem(LOC_KEY, '1')
    return true
  }

  const hear = (text: string) => {
    if (sel === '5247' || locStep >= 0) {
      if (advanceLoc(text)) return
      if (locStep >= 0 && locStep < LOC_STEPS.length) {
        setStrip('Say again.')
        speakAtc('Say again', 'en-US')
        return
      }
    }
    const pack = shown
    const named = findCs(text, pack) || ac
    if (!named) {
      setStrip('Say again.')
      speakAtc('Say again')
      return
    }
    setSel(named.id)
    const onlyName = phraseMatchesAny(text, named.cs, [named.cs.split(' ').pop() || named.cs])
      && !has(text, ['cleared', 'taxi', 'heading', 'descend', 'contact', 'go around', 'continue', 'affirm', 'unable', 'say again', 'go ahead', 'ils', 'land', 'take'])
    if (onlyName || has(text, ['go ahead'])) {
      setWho(named.cs)
      setStrip(`${named.cs}, go ahead.`)
      speakAtc(`${named.cs} go ahead`)
      return
    }
    const hit =
      CMDS.filter((c) => c.roles.includes(role)).find((c) => has(text, [c.label, c.id === 'cont' ? 'continue' : '', c.id === 'aff' ? 'affirm' : '', c.id === 'unb' ? 'unable' : '', c.id === 'ahead' ? 'go ahead' : ''].filter(Boolean)))
      || cmd
    if (!hit) {
      setWho(named.cs)
      setStrip(`${named.cs}, say again.`)
      speakAtc(`${named.cs} say again`)
      return
    }
    const ans = replyFor(hit.id, named)
    setWho(named.cs)
    setStrip(ans)
    speakAtc(ans)
    setHandled((n) => n + 1)
  }

  const listen = () => {
    if (recRef.current) return
    const Ctor = (window as unknown as { SpeechRecognition?: new () => MicRec; webkitSpeechRecognition?: new () => MicRec }).SpeechRecognition
      || (window as unknown as { webkitSpeechRecognition?: new () => MicRec }).webkitSpeechRecognition
    if (!Ctor) {
      setStrip(t.noMic)
      return
    }
    silenceRadio()
    setBusy(true)
    const rec = new Ctor()
    rec.lang = locStep >= 0 ? 'tr-TR' : 'en-US'
    rec.continuous = false
    rec.interimResults = false
    rec.onresult = (ev) => {
      const text = (ev.results[ev.results.length - 1][0].transcript || '').trim()
      rec.stop()
      setBusy(false)
      if (!isRealTalk(text)) return
      hear(text)
    }
    rec.onend = () => setBusy(false)
    rec.onerror = () => setBusy(false)
    recRef.current = rec
    rec.start()
    window.setTimeout(() => {
      try { rec.stop() } catch { /* */ }
      setBusy(false)
    }, 9000)
  }

  const report = () => {
    const body = note.trim() || t.gameBugEmpty
    if (DEMO || isGuest() || !token()) {
      demoAddChange('tower-game', who || 'radar', body)
      setSent(t.changeOk)
      setNote('')
      return
    }
    api.voteFeedback('tower-game', 'NEEDS_REVIEW', who || 'radar', body)
      .then(() => { setSent(t.changeOk); setNote('') })
      .catch(() => setSent(t.catalogFail))
  }

  listenRef.current = listen
  const stopListen = () => {
    try { recRef.current?.stop() } catch { /* */ }
    recRef.current = null
    setBusy(false)
  }
  const busyRef = useRef(false)
  busyRef.current = busy
  const selRef = useRef(sel)
  selRef.current = sel
  const roleRef = useRef(role)
  roleRef.current = role
  const fleetRef = useRef(fleet)
  fleetRef.current = fleet

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat) return
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      e.preventDefault()
      if (!busyRef.current) listenRef.current()
    }
    const up = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      e.preventDefault()
      stopListen()
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      if (busyRef.current) return
      const r = roleRef.current
      const wait = fleetRef.current.filter((a) => forRole(a, r) && a.id !== selRef.current)
      if (!wait.length) return
      const a = wait[Math.floor(Math.random() * wait.length)]
      silenceRadio()
      setWho(a.cs)
      setStrip(`${a.cs}`)
      speakAtc(`Istanbul Tower, ${a.cs}`)
    }, 18000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="radar-board rounded-3xl p-4 md:p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {(['APP', 'TWR', 'GND'] as Role[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => switchRole(r)}
            className={`rounded-full px-3 py-1 font-mono text-xs ${role === r ? 'bg-[var(--btn)] text-[var(--btn-ink)]' : 'border border-[#1f6b3a]'}`}
          >
            {r === 'APP' ? t.gameApp : r === 'TWR' ? t.gameTwr : t.gameGnd}
          </button>
        ))}
        <span className="font-mono text-xs text-[#7dffb0]">{handled} {t.gameHandled}</span>
        <button type="button" className="rounded-full border border-[#1f6b3a] px-2 py-1 font-mono text-xs" onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}>+</button>
        <button type="button" className="rounded-full border border-[#1f6b3a] px-2 py-1 font-mono text-xs" onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}>−</button>
        <button type="button" className="ml-auto text-xs text-[#8fb89a] underline" onClick={() => setBugOpen((v) => !v)}>{t.gameBug}</button>
      </div>
      {bugOpen ? (
        <div className="mb-3 rounded-2xl border border-[#1f6b3a] p-3">
          <textarea className="w-full rounded-xl bg-[#0c2416] p-2 text-sm" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t.gameBugHint} />
          <Button variant="secondary" className="mt-2" onClick={report}>{t.gameBugSend}</Button>
          {sent ? <p className="mt-1 text-xs">{sent}</p> : null}
        </div>
      ) : null}
      {wx.bad ? <p className="mb-3 rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-sm">{wx.news}</p> : null}
      <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(380px,34%)]">
        <div>
          <svg viewBox={`0 0 ${W} ${W}`} className="radar-scope">
            <defs>
              <radialGradient id="crt" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#0a3d1c" />
                <stop offset="100%" stopColor="#010805" />
              </radialGradient>
              <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#39ff88" stopOpacity="0" />
                <stop offset="100%" stopColor="#b6ffd0" stopOpacity="0.85" />
              </linearGradient>
              <clipPath id="scope"><circle cx={CX} cy={CY} r={RR} /></clipPath>
            </defs>
            <circle cx={CX} cy={CY} r={RR + 6} fill="#04140a" stroke="#145c32" strokeWidth="6" />
            <g clipPath="url(#scope)">
              <g transform={`translate(${CX} ${CY}) scale(${zoom}) translate(${-CX} ${-CY})`}>
                <circle cx={CX} cy={CY} r={RR} fill="url(#crt)" />
                {[70, 140, 210, 280].map((r) => (
                  <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="#1f8a4d" strokeWidth="1" opacity="0.45" />
                ))}
                <line x1={CX} y1={CY - RR} x2={CX} y2={CY + RR} stroke="#1f8a4d" strokeWidth="1" opacity="0.4" />
                <line x1={CX - RR} y1={CY} x2={CX + RR} y2={CY} stroke="#1f8a4d" strokeWidth="1" opacity="0.4" />
                <g transform={`rotate(-20 ${CX} ${CY})`}>
                  <rect x={CX - 12} y={CY - 108} width="7" height="216" fill="#3dff8a" opacity="0.9" />
                  <rect x={CX + 14} y={CY - 108} width="7" height="216" fill="#3dff8a" opacity="0.75" />
                  <text x={CX - 10} y={CY - 116} fill="#e8ffe8" fontSize="12">16L</text>
                  <text x={CX + 16} y={CY - 116} fill="#e8ffe8" fontSize="12">16R</text>
                  <text x={CX - 10} y={CY + 124} fill="#e8ffe8" fontSize="12">34R</text>
                  <text x={CX + 16} y={CY + 124} fill="#e8ffe8" fontSize="12">34L</text>
                  <text x={CX + 32} y={CY - 50} fill="#b8ffd0" fontSize="11">160°</text>
                  <text x={CX + 32} y={CY + 58} fill="#b8ffd0" fontSize="11">340°</text>
                  {role === 'GND' ? (
                    <>
                      <line x1={CX - 70} y1={CY + 50} x2={CX - 12} y2={CY + 50} stroke="#6fdd9a" strokeWidth="2" />
                      <text x={CX - 88} y={CY + 54} fill="#e8ffe8" fontSize="11">A</text>
                      <line x1={CX + 21} y1={CY - 10} x2={CX + 80} y2={CY - 10} stroke="#6fdd9a" strokeWidth="2" />
                      <text x={CX + 84} y={CY - 6} fill="#e8ffe8" fontSize="11">B</text>
                      <line x1={CX - 70} y1={CY - 30} x2={CX - 12} y2={CY - 30} stroke="#6fdd9a" strokeWidth="2" />
                      <text x={CX - 88} y={CY - 26} fill="#e8ffe8" fontSize="11">C</text>
                    </>
                  ) : null}
                  {role === 'APP' ? (
                    <path d={`M ${CX - 8} ${CY - 108} L ${CX - 40} ${CY - 200} M ${CX - 8} ${CY - 108} L ${CX + 24} ${CY - 200}`} stroke="#7dffb0" strokeWidth="1.5" fill="none" opacity="0.7" />
                  ) : null}
                </g>
                <g className="radar-sweep">
                  <path d={`M ${CX} ${CY} L ${CX} ${CY - RR} A ${RR} ${RR} 0 0 1 ${CX + RR * 0.35} ${CY - RR * 0.94} Z`} fill="url(#beam)" />
                  <line x1={CX} y1={CY} x2={CX} y2={CY - RR} stroke="#d8ffe8" strokeWidth="2" />
                </g>
                {shown.map((a) => {
                  const tone = blipColor(a)
                  return (
                    <g key={a.id} onClick={() => { setSel(a.id); setCmd(null) }} className="cursor-pointer">
                      <rect x={a.x - 4} y={a.y - 4} width="8" height="8" transform={`rotate(45 ${a.x} ${a.y})`} fill={tone} stroke={sel === a.id ? '#fff' : tone} strokeWidth={sel === a.id ? 2 : 0} />
                      <text x={a.x + 10} y={a.y - 8} fill={tone} fontSize="11">{a.cs}</text>
                      {a.emerg === 'mayday' ? (
                        <text x={a.x + 10} y={a.y + 6} fill="#ff8ad4" fontSize="10" fontWeight="700">EM</text>
                      ) : a.emerg === 'pan' ? (
                        <text x={a.x + 10} y={a.y + 6} fill="#ff3b3b" fontSize="10" fontWeight="700">PAN</text>
                      ) : (
                        <text x={a.x + 10} y={a.y + 6} fill="#9ad7b0" fontSize="9">{a.alt || 'GND'} {a.hdg}°</text>
                      )}
                    </g>
                  )
                })}
              </g>
            </g>
            <text x={CX} y="26" textAnchor="middle" fill="#7dffb0" fontSize="13">LTFM IGA · {role}</text>
          </svg>
          <div className="mt-2 flex min-h-12 items-center gap-3 rounded-xl border border-[#1f6b3a] px-3">
            <span className={`h-2 w-2 rounded-full ${busy ? 'bg-rose-400' : 'bg-[#3dff8a]'}`} />
            <span className="font-mono text-xs text-[#f5c542]">{who || role}</span>
            <span className="min-w-0 flex-1 truncate text-sm">{busy ? t.listening : strip}</span>
            <button
              type="button"
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${busy ? 'bg-rose-500 text-white' : 'bg-[#3dff8a] text-[#04140a]'}`}
              onMouseDown={(e) => { e.preventDefault(); listen() }}
              onMouseUp={stopListen}
              onMouseLeave={stopListen}
              onTouchStart={(e) => { e.preventDefault(); listen() }}
              onTouchEnd={stopListen}
            >
              {busy ? 'Konuş…' : 'Bas konuş'}
            </button>
          </div>
          <p className="mt-1 font-mono text-[10px] text-[#6fdd9a]">Space veya bas konuş. Nefes sayılmaz.</p>
        </div>
        <aside className="min-h-[520px] space-y-3">
          <div className="rounded-2xl border border-[#1f6b3a] p-3 text-xs">
            <button type="button" className="font-mono text-[11px] text-[#f5c542]" onClick={() => speakAtc(wx.atis)}>METAR</button>
            <p className="mt-1 font-mono leading-5">{wx.metar}</p>
          </div>
          <div className="rounded-2xl border border-[#1f6b3a] p-3">
            <p className="font-mono text-[11px] tracking-[0.2em] text-[#f5c542]">TRAFFIC</p>
            <div className="mt-2 max-h-40 space-y-1 overflow-auto">
              {shown.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => { setSel(a.id); setCmd(null) }}
                  className={`flex w-full items-center justify-between rounded-lg px-2 py-1 text-left text-xs ${sel === a.id ? 'bg-emerald-500/20' : ''}`}
                >
                  <span style={{ color: blipColor(a) }}>{a.cs}</span>
                  <span className="font-mono text-[#8fb89a]">{a.emerg === 'mayday' ? 'EM' : a.emerg === 'pan' ? 'PAN' : a.phase}</span>
                </button>
              ))}
            </div>
          </div>
          {ac ? (
            <div className="rounded-2xl border border-[#1f6b3a] p-3">
              <p className="font-extrabold">{ac.cs}</p>
              <div className="mt-2 grid grid-cols-3 gap-1 text-center text-xs">
                <Bar label={t.gameAlt} value={ac.alt} onMinus={() => bump('alt', -500)} onPlus={() => bump('alt', 500)} />
                <Bar label={t.gameHdg} value={ac.hdg} onMinus={() => bump('hdg', -10)} onPlus={() => bump('hdg', 10)} />
                <Bar label={t.gameSpd} value={ac.spd} onMinus={() => bump('spd', -10)} onPlus={() => bump('spd', 10)} />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1">
                {cmds.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCmd(c)}
                    className={`rounded-lg border px-2 py-2 text-left text-xs ${cmd?.id === c.id ? 'border-emerald-400 bg-emerald-500/15' : 'border-[#1f6b3a]'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-[#1f6b3a] p-3 text-sm">{t.gamePick}</p>
          )}
        </aside>
      </div>
    </div>
  )
}

function Bar({ label, value, onMinus, onPlus }: { label: string; value: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <div className="rounded-xl border border-[#1f6b3a] px-1 py-2">
      <p className="text-[10px] text-[#8fb89a]">{label}</p>
      <p className="font-mono">{value}</p>
      <div className="mt-1 flex justify-center gap-1">
        <button type="button" className="h-6 w-6 rounded border border-[#1f6b3a]" onClick={onMinus}>−</button>
        <button type="button" className="h-6 w-6 rounded border border-[#1f6b3a]" onClick={onPlus}>+</button>
      </div>
    </div>
  )
}
