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

/** Written ATC line → spoken ICAO (niner, fife, triple seven, Juliet). */
export function atcSpoken(text: string) {
  let s = text
    .replace(/\bAJet\b/gi, 'Anadolu')
    .replace(/\bTHY\b/gi, 'Turkish')
    .replace(/\bSXS\b/gi, 'SunExpress')
    .replace(/\bPGT\b/gi, 'Pegasus')
    .replace(/(\d)\.(\d)/g, '$1 decimal $2')
  s = s.replace(/\b(\d{2,})([A-Za-z])\b/g, (_, n: string, L: string) => `${speakDigits(n)} ${LETTER[L.toLowerCase()] || L}`)
  s = s.replace(/\b(\d{2,})\b/g, (_, n: string) => speakDigits(n))
  s = s.replace(/\b([A-Z])\b/g, (ch) => LETTER[ch.toLowerCase()] || ch)
  return s
}

export function speakAtc(text: string, lang = 'en-US') {
  const u = new SpeechSynthesisUtterance(atcSpoken(text))
  u.lang = lang
  u.rate = 0.92
  speechSynthesis.cancel()
  speechSynthesis.speak(u)
}

export function expandHeard(value: string) {
  return value
    .toLowerCase()
    .replace(/\btriple seven\b/g, '777')
    .replace(/\btriple 7\b/g, '777')
    .replace(/\bfife\b/g, '5')
    .replace(/\bniner\b/g, '9')
    .replace(/\btree\b/g, '3')
}
