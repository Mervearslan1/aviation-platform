const DIGIT: Record<string, string> = {
  '0': 'zero',
  '1': 'one',
  '2': 'two',
  '3': 'tree',
  '4': 'four',
  '5': 'fife',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'niner',
}

const LETTER: Record<string, string> = {
  a: 'Alpha', b: 'Bravo', c: 'Charlie', d: 'Delta', e: 'Echo', f: 'Foxtrot',
  g: 'Golf', h: 'Hotel', i: 'India', j: 'Juliet', k: 'Kilo', l: 'Lima',
  m: 'Mike', n: 'November', o: 'Oscar', p: 'Papa', q: 'Quebec', r: 'Romeo',
  s: 'Sierra', t: 'Tango', u: 'Uniform', v: 'Victor', w: 'Whiskey', x: 'X-ray',
  y: 'Yankee', z: 'Zulu',
}

function speakDigits(raw: string) {
  if (/^(\d)\1{2,}$/.test(raw)) {
    return `triple ${DIGIT[raw[0]]}`
  }
  return raw.split('').map((ch) => DIGIT[ch] || ch).join(' ')
}

/** Written ATC line → spoken ICAO (niner, fife, Sunturk, Juliet). */
export function atcSpoken(text: string) {
  let s = text
    .replace(/\bPegasus\b/gi, 'Sunturk')
    .replace(/\bPGT\b/gi, 'Sunturk')
    .replace(/\bSunturk\b/gi, 'Sun Turk')
    .replace(/\bSunExpress\b/gi, 'Sun Express')
    .replace(/\bSXS\b/gi, 'Sun Express')
    .replace(/\bSNX\b/gi, 'Sun Express')
    .replace(/\bAJet\b/gi, 'Anadolu')
    .replace(/\bTHY\b/gi, 'Turkish')
    .replace(/\bTurkish Cargo\b/gi, 'Turkish')
    .replace(/\bFedEx\b/gi, 'FedEx')
    .replace(/\bFDX\b/gi, 'FedEx')
    .replace(/\bEmirates\b/gi, 'Emirates')
    .replace(/\bEMR\b/gi, 'Emirates')
    .replace(/\bKLM\b/g, 'KLM')
    .replace(/\bRyanair\b/gi, 'Ryanair')
    .replace(/\bTYN\b/gi, 'Ryanair')
    .replace(/(\d)\.(\d)/g, '$1 decimal $2')
  s = s.replace(/\b(\d{2,})([A-Za-z])\b/g, (_, n: string, L: string) => `${speakDigits(n)} ${LETTER[L.toLowerCase()] || L}`)
  s = s.replace(/\b(\d{2,})\b/g, (_, n: string) => speakDigits(n))
  s = s.replace(/\b([A-Z])\b/g, (ch) => LETTER[ch.toLowerCase()] || ch)
  return s
}

let radioCtx: AudioContext | null = null
let hissGain: GainNode | null = null

function ctx() {
  if (!radioCtx) radioCtx = new AudioContext()
  return radioCtx
}

function click() {
  const c = ctx()
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'square'
  o.frequency.value = 780
  g.gain.setValueAtTime(0.07, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.07)
  o.connect(g)
  g.connect(c.destination)
  o.start()
  o.stop(c.currentTime + 0.08)
}

export function startRadioBed() {
  const c = ctx()
  void c.resume()
  const n = c.sampleRate * 2
  const buf = c.createBuffer(1, n, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * 0.35
  const src = c.createBufferSource()
  src.buffer = buf
  src.loop = true
  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 1400
  bp.Q.value = 0.7
  const g = c.createGain()
  g.gain.value = 0.028
  src.connect(bp)
  bp.connect(g)
  g.connect(c.destination)
  src.start()
  hissGain = g
  return () => {
    try {
      src.stop()
    } catch {
      /* */
    }
  }
}

export function duckRadioBed(on: boolean) {
  if (!hissGain || !radioCtx) return
  hissGain.gain.setTargetAtTime(on ? 0.012 : 0.028, radioCtx.currentTime, 0.05)
}

export function speakAtc(text: string, lang = 'en-US', volume = 1) {
  const u = new SpeechSynthesisUtterance(atcSpoken(text))
  u.lang = lang
  u.rate = 1.06
  u.pitch = 0.72
  u.volume = Math.max(0.15, Math.min(1, volume))
  if (volume > 0.5) {
    speechSynthesis.cancel()
    click()
    duckRadioBed(true)
    u.onend = () => duckRadioBed(false)
  }
  speechSynthesis.speak(u)
}

export function expandHeard(value: string) {
  return value
    .toLowerCase()
    .replace(/\btriple seven\b/g, '777')
    .replace(/\bsun turk\b/g, 'sunturk')
    .replace(/\bsunturk\b/g, 'sunturk')
    .replace(/\bfife\b/g, '5')
    .replace(/\bniner\b/g, '9')
    .replace(/\btree\b/g, '3')
}
