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

export type Article = {
  id: number
  title: string
  slug: string
  summary?: string
}

export type TeamApplication = {
  id: number
  fullName: string
  email: string
  profession: string
  requestedRole: string
  experience?: string
  intro?: string
  message: string
  status: string
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
  register: (body: { username: string; email: string; password: string; displayName: string }) =>
    request('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  articleBySlug: (slug: string) =>
    request<{ title: string; summary?: string; contentHtml?: string; coverImageUrl?: string }>(`/api/v1/articles/slug/${slug}`),
  articles: async (size = 6) => {
    const res = await fetch(`/api/v1/articles?size=${size}`)
    const body = (await res.json()) as { data?: Article[] }
    return body.data || []
  },
  joinTeam: (payload: Record<string, string>) =>
    request('/api/v1/team-applications', { method: 'POST', body: JSON.stringify(payload) }),
  teamApplications: async () => {
    const jwt = token()
    const res = await fetch('/api/v1/team-applications', {
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
    })
    const body = (await res.json()) as { data?: TeamApplication[]; message?: string }
    if (!res.ok) throw new Error(body.message || res.statusText)
    return body.data || []
  },
  reviewApplication: (id: number, status: 'APPROVED' | 'REJECTED') =>
    request(`/api/v1/team-applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  feedback: (slug: string) =>
    request<{ interested: number; needsReview: number; mine: string | null }>(`/api/v1/articles/slug/${slug}/feedback`),
  voteFeedback: (slug: string, kind: 'INTERESTED' | 'NEEDS_REVIEW', quote?: string, note?: string) =>
    request(`/api/v1/articles/slug/${slug}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ kind, quote, note }),
    }),
  changeRequests: () =>
    request<Array<{ id: number; articleSlug: string; quote: string; note: string; userEmail: string }>>('/api/v1/articles/change-requests'),
  createArticle: (body: {
    title: string
    summary: string
    contentHtml: string
    contentDocument?: Record<string, unknown>
  }) => request<{ id: number }>('/api/v1/articles', { method: 'POST', body: JSON.stringify(body) }),
  updateArticle: (
    id: number,
    body: { title: string; summary: string; contentHtml: string; contentDocument?: Record<string, unknown> },
  ) => request<{ id: number }>(`/api/v1/articles/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  submitArticle: (id: number) => request(`/api/v1/articles/${id}/submit`, { method: 'POST', body: '{}' }),
  uploadMedia: async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    const jwt = token()
    const res = await fetch('/api/v1/media', {
      method: 'POST',
      headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
      body: fd,
    })
    const body = (await res.json()) as { data?: { id: number }; message?: string }
    if (!res.ok) throw new Error(body.message || res.statusText)
    return body.data as { id: number }
  },
}
