export type CatalogStep = {
  id: number
  title: string
  slug: string
  description?: string
  stepType: string
  orderIndex: number
  knowledgeLevel?: string
  recommended?: boolean
  contentHtml?: string
}

export type CatalogPath = {
  id: number
  title: string
  slug: string
  description?: string
  difficulty?: string
  relatedAircraft?: string[]
  steps: CatalogStep[]
}

export type CatalogAircraft = {
  id: number
  code: string
  name: string
  philosophy?: string
  difficulty?: string
  partCount: number
}

export type Catalog = {
  tower: CatalogPath[]
  pilot: CatalogPath[]
  aircraft: CatalogAircraft[]
}

type Envelope<T> = { data: T; message?: string }

const TOKEN_KEY = 'aviationToken'

export function token() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(value: string | null) {
  if (value) localStorage.setItem(TOKEN_KEY, value)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const jwt = token()
  if (jwt) headers.set('Authorization', `Bearer ${jwt}`)
  const res = await fetch(url, { ...init, headers })
  const body = (await res.json().catch(() => ({}))) as Envelope<T> & { message?: string }
  if (!res.ok) throw new Error(body.message || res.statusText)
  return body.data
}

export const api = {
  catalog: () => request<Catalog>('/api/v1/catalog'),
  path: (track: 'tower' | 'pilot', slug: string) =>
    request<CatalogPath>(`/api/v1/${track}/paths/${slug}`),
  login: (email: string, password: string) =>
    request<{ accessToken: string }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
}
