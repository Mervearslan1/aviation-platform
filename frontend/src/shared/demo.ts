/**
 * Sunum modu. Misafir, normal USER gibi görür; onay/geri bildirim gösterimlik çalışır.
 * İş bitince bunu false yap.
 */
export const DEMO = true

export function isDemoSession() {
  return DEMO && !localStorage.getItem('aviationToken')
}

const GUEST_KEY = 'aviationGuest'

export function markGuest() {
  localStorage.setItem(GUEST_KEY, '1')
}

export function isGuest() {
  return localStorage.getItem(GUEST_KEY) === '1' && !localStorage.getItem('aviationToken')
}

/** Gerçek giriş, misafir tercihi veya sunum: okur yüzeyini aç. */
export function asUser() {
  return Boolean(localStorage.getItem('aviationToken')) || isGuest() || DEMO
}

const FB = 'aviationDemoFeedback'
const APPS = 'aviationDemoApps'

export function demoFeedback(slug: string) {
  const all = JSON.parse(localStorage.getItem(FB) || '{}') as Record<
    string,
    { interested: number; needsReview: number; mine: string | null }
  >
  return all[slug] || { interested: 12, needsReview: 3, mine: null }
}

export function demoLiked(slug: string) {
  return localStorage.getItem(`aviationLike:${slug}`) === '1'
}

export function demoLike(slug: string) {
  localStorage.setItem(`aviationLike:${slug}`, '1')
}

export type DemoChange = {
  id: number
  articleSlug: string
  quote: string
  note: string
  userEmail: string
  createdAt: string
}

const CH = 'aviationDemoChanges'

export function demoChanges(): DemoChange[] {
  return JSON.parse(localStorage.getItem(CH) || '[]') as DemoChange[]
}

export function demoAddChange(slug: string, quote: string, note: string) {
  const list = demoChanges()
  list.unshift({
    id: Date.now(),
    articleSlug: slug,
    quote,
    note,
    userEmail: 'misafir@local',
    createdAt: new Date().toISOString(),
  })
  localStorage.setItem(CH, JSON.stringify(list))
  return list
}

export function demoVote(slug: string, kind: 'INTERESTED' | 'NEEDS_REVIEW') {
  const all = JSON.parse(localStorage.getItem(FB) || '{}') as Record<
    string,
    { interested: number; needsReview: number; mine: string | null }
  >
  const cur = all[slug] || { interested: 12, needsReview: 3, mine: null }
  if (cur.mine === kind) return cur
  if (cur.mine === 'INTERESTED') cur.interested -= 1
  if (cur.mine === 'NEEDS_REVIEW') cur.needsReview -= 1
  if (kind === 'INTERESTED') cur.interested += 1
  else cur.needsReview += 1
  cur.mine = kind
  all[slug] = cur
  localStorage.setItem(FB, JSON.stringify(all))
  return cur
}

export type DemoApp = {
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

function seedApps(): DemoApp[] {
  return [
    {
      id: 101,
      fullName: 'Ayşe Kaya',
      email: 'ayse.pilot@example.com',
      profession: 'PILOT',
      requestedRole: 'MENTOR',
      intro: 'THY’de F/O, eğitim uçuşu veriyorum.',
      message: 'Kokpit adımlarına saha notu eklemek istiyorum.',
      status: 'PENDING',
    },
    {
      id: 102,
      fullName: 'Can Demir',
      email: 'can.atc@example.com',
      profession: 'ATC',
      requestedRole: 'AUTHOR',
      intro: 'TWR/APP, 6 yıl.',
      message: 'Kule senaryolarını yazmak istiyorum.',
      status: 'PENDING',
    },
  ]
}

export function demoApps(): DemoApp[] {
  const raw = localStorage.getItem(APPS)
  if (!raw) {
    localStorage.setItem(APPS, JSON.stringify(seedApps()))
    return seedApps()
  }
  return JSON.parse(raw) as DemoApp[]
}

export function demoSaveApp(app: DemoApp) {
  const list = demoApps()
  list.unshift(app)
  localStorage.setItem(APPS, JSON.stringify(list))
}

export function demoReviewApp(id: number, status: 'APPROVED' | 'REJECTED') {
  const list = demoApps().map((a) => (a.id === id ? { ...a, status } : a))
  localStorage.setItem(APPS, JSON.stringify(list))
  return list
}

const DRAFTS = 'aviationDemoDrafts'

export type DemoTerm = { term: string; def: string }
export type DemoLink = { title: string; url: string }
export type DemoImage = { url: string; caption: string }

export type DemoDraft = {
  id: number
  title: string
  slug: string
  summary: string
  preface: string
  contentHtml: string
  glossary: DemoTerm[]
  images: DemoImage[]
  sources: DemoLink[]
  related: { slug: string; title: string }[]
  status: 'DRAFT' | 'SUBMITTED'
  updatedAt: string
}

export function demoDrafts(): DemoDraft[] {
  return JSON.parse(localStorage.getItem(DRAFTS) || '[]') as DemoDraft[]
}

export function demoSaveDraft(draft: DemoDraft): DemoDraft[] {
  const list = demoDrafts()
  const next = { ...draft, updatedAt: new Date().toISOString() }
  const i = list.findIndex((d) => d.id === next.id)
  if (i >= 0) list[i] = next
  else list.unshift(next)
  list.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
  localStorage.setItem(DRAFTS, JSON.stringify(list))
  return list
}
