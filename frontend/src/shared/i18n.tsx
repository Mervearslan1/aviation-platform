import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type Locale = 'tr' | 'en'

const dict = {
  tr: {
    brand: 'AVIATION',
    sub: 'PLATFORM',
    flight: 'UÇUŞ',
    ops: 'OPS',
    enterFlight: 'Kokpite gir',
    enterOps: 'Yer işletme',
    lang: 'Dil',
    themeLight: 'Gündüz',
    themeDark: 'Gece',
    login: 'Giriş',
    logout: 'Çıkış',
    email: 'E-posta',
    password: 'Şifre',
    start: 'Başlat',
    guest: 'Misafir bakış',
    utc: 'UTC',
    clearance: 'Kalkış izni alındı.',
    heroTitle: 'Uçağın içinde öğren.',
    heroLead:
      'Kule, pilot ve kokpit aynı uçuş hissiyle. Yeni başlayan sırayla gider; bilen istediği panele geçer.',
    doorTower: 'Kule',
    doorTowerHint: 'Dinle, konuş, senaryo. TWR gibi dur.',
    doorPilot: 'Pilot',
    doorPilotHint: 'Read-back, circuit, PIC gibi uç.',
    doorAc: 'Kokpit',
    doorAcHint: 'Her tuş, her faz, her hata.',
    recommended: 'Önerilen sıra',
    open: 'Açık',
    steps: 'adım',
    parts: 'tuş',
    beginner: 'Yeni',
    intermediate: 'Orta',
    advanced: 'İleri',
    back: 'Geri',
    phase: 'Faz',
    catalogFail: 'Katalog alınamadı. Backend 8080 açık mı?',
    opsTitle: 'Yer işletme',
    opsLead: 'Öğrenci kokpitte. Sen yerde: içerik, kullanıcı, müfredat.',
    opsUsers: 'Kullanıcılar',
    opsContent: 'İçerik',
    opsCurriculum: 'Müfredat',
    opsAircraft: 'Uçaklar',
    opsAudit: 'Kayıt',
    opsSoon: 'Bu panel sonraki dilimde bağlanır. Uçuş yüzeyi ayrı kalır.',
    loginNeed: 'İlerlemeyi kaydetmek için giriş yap.',
  },
  en: {
    brand: 'AVIATION',
    sub: 'PLATFORM',
    flight: 'FLIGHT',
    ops: 'OPS',
    enterFlight: 'Enter cockpit',
    enterOps: 'Ground ops',
    lang: 'Language',
    themeLight: 'Day',
    themeDark: 'Night',
    login: 'Sign in',
    logout: 'Sign out',
    email: 'Email',
    password: 'Password',
    start: 'Start',
    guest: 'Browse as guest',
    utc: 'UTC',
    clearance: 'Cleared for takeoff.',
    heroTitle: 'Learn from inside the airplane.',
    heroLead:
      'Tower, pilot and cockpit share one flight feeling. Beginners follow the line; experts jump to any panel.',
    doorTower: 'Tower',
    doorTowerHint: 'Listen, speak, scenario. Stand like TWR.',
    doorPilot: 'Pilot',
    doorPilotHint: 'Read-back, circuit, fly like PIC.',
    doorAc: 'Cockpit',
    doorAcHint: 'Every switch, every phase, every miss.',
    recommended: 'Suggested order',
    open: 'Open',
    steps: 'steps',
    parts: 'controls',
    beginner: 'New',
    intermediate: 'Mid',
    advanced: 'Advanced',
    back: 'Back',
    phase: 'Phase',
    catalogFail: 'Catalog failed. Is the backend on 8080?',
    opsTitle: 'Ground operations',
    opsLead: 'The student is in the flight deck. You stay on the ground: content, users, curriculum.',
    opsUsers: 'Users',
    opsContent: 'Content',
    opsCurriculum: 'Curriculum',
    opsAircraft: 'Aircraft',
    opsAudit: 'Audit',
    opsSoon: 'This desk wires in the next slice. The flight surface stays separate.',
    loginNeed: 'Sign in to keep progress.',
  },
} as const

type Dict = (typeof dict)[Locale]
type I18n = {
  locale: Locale
  t: Dict
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18n | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() =>
    localStorage.getItem('aviationLocale') === 'en' ? 'en' : 'tr',
  )
  const setLocale = (next: Locale) => {
    localStorage.setItem('aviationLocale', next)
    setLocaleState(next)
    document.documentElement.lang = next
  }
  const value = useMemo(() => ({ locale, t: dict[locale], setLocale }), [locale])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('I18nProvider missing')
  return ctx
}

export function levelLabel(t: Dict, level?: string) {
  if (level === 'INTERMEDIATE') return t.intermediate
  if (level === 'ADVANCED') return t.advanced
  return t.beginner
}
