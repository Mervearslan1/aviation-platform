import { Logo } from '../shared/Mark'
import { Button } from '../shared/Button'
import { useI18n } from '../shared/i18n'
import { useTheme } from '../shared/theme'

export function Welcome({ onDone }: { onDone: () => void }) {
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useTheme()
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--bg)] px-4">
      <div className="surface w-full max-w-lg rounded-3xl p-8 text-center">
        <Logo />
        <h1 className="mt-6 text-3xl font-semibold">{t.welcomeTitle}</h1>
        <p className="mt-3 text-[var(--muted)]">{t.welcomeLead}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            className={`btn ${locale === 'tr' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setLocale('tr')}
          >
            Türkçe
          </button>
          <button
            className={`btn ${locale === 'en' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setLocale('en')}
          >
            English
          </button>
          <button
            className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTheme('light')}
          >
            {t.themeLight}
          </button>
          <button
            className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTheme('dark')}
          >
            {t.themeDark}
          </button>
        </div>
        <Button className="mt-6 w-full" onClick={onDone}>
          {t.welcomeGo}
        </Button>
      </div>
    </div>
  )
}
