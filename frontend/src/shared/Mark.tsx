export function Logo({
  compact = false,
  className = '',
}: {
  compact?: boolean
  className?: string
}) {
  return (
    <img
      src="/brand/logo.png"
      alt="Aviation Platform"
      className={`${compact ? 'h-11 w-auto' : 'h-16 w-auto'} object-contain ${className}`}
    />
  )
}

export function Mark({ className = 'h-10 w-auto' }: { className?: string }) {
  return <Logo compact className={className} />
}
