const FILLER = new Set(['the', 'a', 'an', 'please', 'lutfen', 'ok', 'okay', 'uh', 'um'])
const PASS_PERCENT = 50

const FAMILIES: string[][] = [
  ['alpha', 'alfa', 'alfe', 'a'],
  ['bravo', 'brawo', 'bravoo', 'b'],
  ['charlie', 'charli', 'charley', 'carli', 'sharli', 'sarli', 'c'],
  ['delta', 'delte', 'd'],
  ['echo', 'eko', 'eco', 'ecko', 'e'],
  ['foxtrot', 'fox', 'fokstrot', 'f'],
  ['golf', 'golfu', 'g'],
  ['hotel', 'otel', 'h'],
  ['india', 'indya', 'indyaa', 'i'],
  ['juliet', 'juliett', 'julie', 'julyet', 'culiet', 'j'],
  ['kilo', 'killo', 'k'],
  ['lima', 'leema', 'lyma', 'l'],
  ['mike', 'mayk', 'maik', 'm'],
  ['november', 'novembr', 'novembe', 'n'],
  ['oscar', 'oskar', 'osker', 'o'],
  ['papa', 'pappa', 'p'],
  ['quebec', 'kebek', 'kubek', 'kebekq', 'q'],
  ['romeo', 'romyo', 'romio', 'r'],
  ['sierra', 'siera', 'siyera', 's'],
  ['tango', 'tengoo', 'tengo', 't'],
  ['uniform', 'unifom', 'yuniform', 'u'],
  ['victor', 'viktor', 'wiktor', 'v'],
  ['whiskey', 'whisky', 'viski', 'wiski', 'w'],
  ['xray', 'exray', 'eksray', 'eksrey', 'x'],
  ['yankee', 'yanki', 'yenki', 'y'],
  ['zulu', 'zoolu', 'zoulou', 'z'],
  ['turkish', 'thy', 'tk'],
  ['pegasus', 'pgt'],
  ['anadolu', 'ajet', 'anadolujet', 'ahi'],
  ['sunexpress', 'sxs'],
  ['approved', 'appow', 'aprove', 'approve', 'aproved'],
  ['runway', 'runwey', 'pist'],
  ['taxi', 'taksi'],
]

const NUM: Record<string, string> = {
  zero: '0', one: '1', two: '2', three: '3', tree: '3', four: '4', five: '5', fife: '5',
  six: '6', seven: '7', eight: '8', nine: '9', niner: '9',
}

function family(token: string) {
  const hit = FAMILIES.find((g) => g.includes(token))
  return hit ? hit[0] : NUM[token] || token
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replaceAll('ı', 'i')
    .replaceAll('ç', 'c')
    .replaceAll('ş', 's')
    .replaceAll('ğ', 'g')
    .replaceAll('ö', 'o')
    .replaceAll('ü', 'u')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\bsun express\b/g, 'sunexpress')
    .replace(/([a-z]+)(\d)/g, '$1 $2')
    .replace(/(\d)([a-z]+)/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
}

function levenshtein(a: string, b: string) {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, (_, i) => {
    const row = new Array<number>(n + 1)
    row[0] = i
    return row
  })
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

function close(spokenToken: string, expected: string) {
  const a = family(spokenToken)
  const b = family(expected)
  if (!a || !b) return false
  if (a === b) return true
  if ((a.includes(b) || b.includes(a)) && Math.min(a.length, b.length) >= 3) return true
  const allow = Math.max(2, Math.floor(b.length * 0.45))
  return levenshtein(a, b) <= allow
}

export function phraseMatches(spoken: string, expected: string) {
  const spokenTokens = normalize(spoken).split(' ').filter(Boolean)
  const tokens = normalize(expected).split(' ').filter((t) => t && !FILLER.has(t))
  if (spokenTokens.length === 0 || tokens.length === 0) return false
  const found = tokens.filter((t) => spokenTokens.some((s) => close(s, t))).length
  return (found * 100) / tokens.length >= PASS_PERCENT
}

export function phraseMatchesAny(spoken: string, expected: string, accepted: string[] = []) {
  if (phraseMatches(spoken, expected)) return true
  return accepted.some((variant) => variant && phraseMatches(spoken, variant))
}
