type IconProps = { className?: string }

export function IconSun({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6 6l1.5 1.5M16.5 16.5 18 18M18 6l-1.5 1.5M7.5 16.5 6 18" />
    </svg>
  )
}

export function IconMoon({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M20 14.5A7.5 7.5 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5Z" />
    </svg>
  )
}

export function IconFlagTr({ className = 'h-5 w-7' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 30 20" aria-hidden>
      <rect width="30" height="20" fill="#e30a17" />
      <circle cx="12" cy="10" r="5" fill="#fff" />
      <circle cx="13.2" cy="10" r="4" fill="#e30a17" />
      <polygon fill="#fff" points="16.2,10 19.6,11.1 17.4,8.2 17.4,11.8 19.6,8.9" />
    </svg>
  )
}

export function IconFlagGb({ className = 'h-5 w-7' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 60 30" aria-hidden>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  )
}

export function IconUser({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19c1.4-3 3.8-4.5 7-4.5s5.6 1.5 7 4.5" />
    </svg>
  )
}

export function IconClose({ className = 'h-5 w-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}
