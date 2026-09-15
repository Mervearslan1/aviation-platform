import { useTheme } from './theme'

export function Logo({
  compact = false,
  className = '',
}: {
  compact?: boolean
  className?: string
}) {
  const { theme } = useTheme()
  const src = theme === 'dark' ? '/brand/logo-dark.png' : '/brand/logo.png'
  return (
    <img
      src={src}
      alt="Aviation Platform"
      className={`${compact ? 'h-10 w-auto' : 'h-14 w-auto'} object-contain ${className}`}
    />
  )
}

export function Mark({ className = 'h-10 w-auto' }: { className?: string }) {
  return <Logo compact className={className} />
}
