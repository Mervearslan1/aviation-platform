export function Mark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
      <path d="M8 28 L24 10 L40 28 L24 22 Z" fill="currentColor" />
      <rect x="22.5" y="22" width="3" height="14" fill="var(--amber)" />
    </svg>
  )
}
