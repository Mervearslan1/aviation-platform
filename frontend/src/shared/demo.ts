/**
 * Sunum modu. Misafir, normal USER gibi görür; onay/geri bildirim gösterimlik çalışır.
 * İş bitince bunu false yap.
 */
export const DEMO = true

export function isDemoSession() {
  return DEMO && !localStorage.getItem('aviationToken')
}

/** Gerçek giriş veya sunum: okur yüzeyini aç. */
export function asUser() {
  return Boolean(localStorage.getItem('aviationToken')) || DEMO
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
