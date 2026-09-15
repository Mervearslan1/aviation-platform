import { useI18n } from './i18n'
import { useTheme } from './theme'

export function Logo({
  compact = false,
  className = '',
}: {
  compact?: boolean
  className?: string
}) {
  const { theme } = useTheme()
  const { t } = useI18n()
  if (compact) {
    const src = theme === 'dark' ? '/brand/logo-mark-dark.png' : '/brand/logo-mark.png'
    return (
      <img
        src={src}
        alt={t.brand}
        className={`h-7 w-auto object-contain ${className}`}
      />
    )
  }
  const src = theme === 'dark' ? '/brand/logo-dark.png' : '/brand/logo.png'
  return <img src={src} alt={t.brand} className={`h-14 w-auto object-contain ${className}`} />
}

export function Mark({ className = '' }: { className?: string }) {
  return <Logo compact className={className} />
}
