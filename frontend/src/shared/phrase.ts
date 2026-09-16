const FILLER = new Set(['the', 'a', 'an', 'please', 'lutfen', 'ok', 'okay', 'uh', 'um'])

function normalize(value: string) {
  return value
    .toLowerCase()
    .replaceAll('ı', 'i')
    .replace(/[^a-z0-9 ]/g, ' ')
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
  if (!spokenToken || !expected) return false
  if (spokenToken === expected) return true
  if (spokenToken.includes(expected) || expected.includes(spokenToken)) {
    return Math.min(spokenToken.length, expected.length) >= 3
  }
  const dist = levenshtein(spokenToken, expected)
  const allow = Math.max(2, Math.floor(expected.length * 0.45))
  return dist <= allow
}

export function phraseMatches(spoken: string, expected: string) {
  const spokenTokens = normalize(spoken).split(' ').filter(Boolean)
  const tokens = normalize(expected).split(' ').filter((t) => t && !FILLER.has(t))
  if (spokenTokens.length === 0 || tokens.length === 0) return false
  const found = tokens.filter((t) => spokenTokens.some((s) => close(s, t))).length
  return (found * 100) / tokens.length >= 50
}
