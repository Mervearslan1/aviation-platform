import { Logo } from '../shared/Mark'
import { Button } from '../shared/Button'
import { useI18n } from '../shared/i18n'
import { useTheme } from '../shared/theme'
import { IconClose } from '../shared/Icons'
import { markGuest } from '../shared/demo'

export function Welcome({ onDone }: { onDone: () => void }) {
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useTheme()
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-hidden px-4">
      <div className="welcome-motion absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/atmosphere/night.jpg)' }} />
      <div className="absolute inset-0 bg-black/55" />
      <button
        type="button"
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
        aria-label={t.close}
        onClick={() => {
          setLocale('tr')
          setTheme('dark')
          markGuest()
          onDone()
        }}
      >
        <IconClose />
      </button>
      <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-black/45 p-8 text-center text-white backdrop-blur-md">
        <Logo />
        <h1 className="mt-5 text-3xl font-semibold">{t.welcomeTitle}</h1>
        <p className="mt-3 text-white/80">{t.welcomeLead}</p>
        <p className="mt-1 text-sm text-white/60">{t.welcomeSkip}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button className={`btn ${locale === 'tr' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setLocale('tr')}>
            Türkçe
          </button>
          <button className={`btn ${locale === 'en' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setLocale('en')}>
            English
          </button>
          <button className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTheme('light')}>
            {t.themeLight}
          </button>
          <button className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTheme('dark')}>
            {t.themeDark}
          </button>
        </div>
        <Button
          className="mt-6 w-full"
          onClick={() => {
            markGuest()
            onDone()
          }}
        >
          {t.welcomeGo}
        </Button>
      </div>
    </div>
  )
}
