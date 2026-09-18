const DIGIT: Record<string, string> = {
  '0': 'zero', '1': 'one', '2': 'two', '3': 'tree', '4': 'four',
  '5': 'fife', '6': 'six', '7': 'seven', '8': 'eight', '9': 'niner',
}

const LETTER: Record<string, string> = {
  a: 'Alpha', b: 'Bravo', c: 'Charlie', d: 'Delta', e: 'Echo', f: 'Foxtrot',
  g: 'Golf', h: 'Hotel', i: 'India', j: 'Juliet', k: 'Kilo', l: 'Lima',
  m: 'Mike', n: 'November', o: 'Oscar', p: 'Papa', q: 'Quebec', r: 'Romeo',
  s: 'Sierra', t: 'Tango', u: 'Uniform', v: 'Victor', w: 'Whiskey', x: 'X-ray',
  y: 'Yankee', z: 'Zulu',
}

function speakDigits(raw: string) {
  if (/^(\d)\1{2,}$/.test(raw)) return `triple ${DIGIT[raw[0]]}`
  return raw.split('').map((ch) => DIGIT[ch] || ch).join(' ')
}

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

function ctx() {
  if (!radioCtx) radioCtx = new AudioContext()
  return radioCtx
}

function click() {
  const c = ctx()
  void c.resume()
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'square'
  o.frequency.value = 780
  g.gain.setValueAtTime(0.06, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06)
  o.connect(g)
  g.connect(c.destination)
  o.start()
  o.stop(c.currentTime + 0.07)
}

function hissBurst(ms: number) {
  const c = ctx()
  const n = Math.floor(c.sampleRate * (ms / 1000))
  const buf = c.createBuffer(1, Math.max(n, 1), c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.22
  const src = c.createBufferSource()
  src.buffer = buf
  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 1400
  bp.Q.value = 0.8
  const g = c.createGain()
  g.gain.value = 0.04
  src.connect(bp)
  bp.connect(g)
  g.connect(c.destination)
  src.start()
  src.stop(c.currentTime + ms / 1000)
}

/** Radio tone only while a line is spoken. Stops everyone else first. */
export function speakAtc(text: string, lang = 'en-US', volume = 1) {
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(atcSpoken(text))
  u.lang = lang
  u.rate = 1.04
  u.pitch = 0.74
  u.volume = Math.max(0.2, Math.min(1, volume))
  click()
  hissBurst(Math.min(1800, 400 + text.length * 18))
  speechSynthesis.speak(u)
}

export function silenceRadio() {
  speechSynthesis.cancel()
}
