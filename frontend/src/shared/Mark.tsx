import { useTheme } from './theme'

export function Logo({
  compact = false,
  className = '',
}: {
  compact?: boolean
  className?: string
}) {
  const { theme } = useTheme()
  const plate = theme === 'dark' ? 'bg-white shadow-sm' : 'bg-transparent'
  return (
    <span
      className={`inline-flex items-center justify-center rounded-2xl ${plate} ${
        compact ? 'h-11 px-1.5' : 'h-14 px-2'
      } ${className}`}
    >
      <img
        src="/brand/logo.png"
        alt="Aviation Platform"
        className={compact ? 'h-9 w-auto' : 'h-12 w-auto'}
      />
    </span>
  )
}

export function Mark({ className = 'h-8 w-8' }: { className?: string }) {
  return <Logo compact className={className} />
}
