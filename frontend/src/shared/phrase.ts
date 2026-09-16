const FILLER = new Set(['the', 'a', 'an', 'please', 'lutfen'])

function normalize(value: string) {
  return value
    .toLowerCase()
    .replaceAll('ı', 'i')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function phraseMatches(spoken: string, expected: string) {
  const s = normalize(spoken)
  const tokens = normalize(expected).split(' ').filter((t) => t && !FILLER.has(t))
  if (!s || tokens.length === 0) return false
  const found = tokens.filter((t) => s.includes(t)).length
  return (found * 100) / tokens.length >= 70
}
