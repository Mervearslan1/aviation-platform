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
  g.gain.value = 0.035
  src.connect(bp)
  bp.connect(g)
  g.connect(c.destination)
  src.start()
  src.stop(c.currentTime + ms / 1000)
}

function cabinBurst(ms: number) {
  const c = ctx()
  const t0 = c.currentTime
  const t1 = t0 + ms / 1000
  const rumble = c.createOscillator()
  rumble.type = 'sawtooth'
  rumble.frequency.value = 92
  const rg = c.createGain()
  rg.gain.value = 0.018
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 280
  rumble.connect(lp)
  lp.connect(rg)
  rg.connect(c.destination)
  rumble.start()
  rumble.stop(t1)
  const n = Math.floor(c.sampleRate * (ms / 1000))
  const buf = c.createBuffer(1, Math.max(n, 1), c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.12
  const src = c.createBufferSource()
  src.buffer = buf
  const air = c.createBiquadFilter()
  air.type = 'highpass'
  air.frequency.value = 400
  const ag = c.createGain()
  ag.gain.value = 0.02
  src.connect(air)
  air.connect(ag)
  ag.connect(c.destination)
  src.start()
  src.stop(t1)
}

const TR_DIGIT: Record<string, string> = {
  '0': 'sıfır', '1': 'bir', '2': 'iki', '3': 'üç', '4': 'dört',
  '5': 'beş', '6': 'altı', '7': 'yedi', '8': 'sekiz', '9': 'dokuz',
}

function trSpeak(text: string) {
  return text
    .replace(/\b5247\b/g, 'beş iki dört yedi')
    .replace(/\b0\s*6\b/g, 'sıfır altı')
    .replace(/\b06\b/g, 'sıfır altı')
    .replace(/\d/g, (d) => `${TR_DIGIT[d] || d} `)
}

export type VoiceKind = 'f' | 'm' | '5247'

function pickVoice(lang: string, kind?: VoiceKind) {
  const all = speechSynthesis.getVoices()
  const prefix = lang.toLowerCase().startsWith('tr') ? 'tr' : 'en'
  const pool = all.filter((v) => v.lang.toLowerCase().startsWith(prefix))
  const src = pool.length ? pool : all
  const female = /female|zira|hazel|samantha|victoria|karen|moira|tessa|fiona|hedda|katja|anna|filiz|yelda|emel|susan|salli/i
  const male = /male|david|mark|daniel|george|thomas|fred|yavuz|tolga|ahmet|mehmet|emre/i
  if (kind === 'f') return src.find((v) => female.test(v.name)) || src[0]
  if (kind === '5247') return src.find((v) => male.test(v.name) && v.lang.toLowerCase().startsWith('tr')) || src.find((v) => male.test(v.name)) || src[0]
  return src.find((v) => male.test(v.name)) || src[Math.min(1, src.length - 1)] || src[0]
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  speechSynthesis.getVoices()
  speechSynthesis.addEventListener?.('voiceschanged', () => speechSynthesis.getVoices())
}

/** Radio + light cabin. Stops everyone else first. */
export function speakAtc(text: string, lang = 'en-US', volume = 1, kind?: VoiceKind) {
  speechSynthesis.cancel()
  const spoken = lang.toLowerCase().startsWith('tr') ? trSpeak(text) : atcSpoken(text)
  const u = new SpeechSynthesisUtterance(spoken)
  u.lang = lang.startsWith('tr') ? 'tr-TR' : lang
  const v = pickVoice(u.lang, kind)
  if (v) u.voice = v
  if (kind === '5247') {
    u.rate = 0.9
    u.pitch = 0.82
  } else if (kind === 'f') {
    u.rate = lang.startsWith('tr') ? 1 : 1.05
    u.pitch = 1.18
  } else {
    u.rate = lang.startsWith('tr') ? 0.98 : 1.04
    u.pitch = lang.startsWith('tr') ? 0.95 : 0.74
  }
  u.volume = Math.max(0.2, Math.min(1, volume))
  const ms = Math.min(2200, 500 + text.length * 20)
  click()
  hissBurst(ms)
  cabinBurst(ms)
  speechSynthesis.speak(u)
}

export function silenceRadio() {
  speechSynthesis.cancel()
}
