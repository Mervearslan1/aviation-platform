import type { ReactNode } from 'react'
import { useI18n } from './i18n'

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="site-footer">
      <div className="mx-auto grid max-w-6xl gap-3 px-4 py-4 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8 md:px-5 md:py-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] text-[var(--amber)]">{t.footerProgress}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">{t.footerProgressHint}</p>
        </div>
        <p className="text-center text-sm text-[var(--muted)]">{t.copyright}</p>
        <div className="flex items-center gap-3 md:justify-end">
          <Social label="X" href="#">
            <path d="M4 4l7.2 8.8L4.6 20h2.5l5.2-6 4.6 6H20l-7.4-9.4L19.2 4h-2.5l-4.8 5.6L7.6 4Z" />
          </Social>
          <Social label="LinkedIn" href="#">
            <path d="M6.5 9.5H4V20h2.5V9.5ZM5.2 4A1.6 1.6 0 1 0 5.2 7.2 1.6 1.6 0 0 0 5.2 4ZM20 20h-2.5v-5.6c0-1.8-.8-2.4-1.8-2.4s-2 .8-2 2.5V20H11.2V9.5h2.4v1.4c.6-1 1.8-1.7 3.2-1.7 2.4 0 4.2 1.6 4.2 5V20Z" />
          </Social>
          <Social label="Instagram" href="#">
            <rect x="4" y="4" width="16" height="16" rx="4" />
            <circle cx="12" cy="12" r="3.5" />
            <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
          </Social>
          <Social label="YouTube" href="#">
            <path d="M21 8.2a2.6 2.6 0 0 0-1.8-1.9C17.4 6 12 6 12 6s-5.4 0-7.2.3A2.6 2.6 0 0 0 3 8.2 27 27 0 0 0 2.7 12a27 27 0 0 0 .3 3.8 2.6 2.6 0 0 0 1.8 1.9C6.6 18 12 18 12 18s5.4 0 7.2-.3a2.6 2.6 0 0 0 1.8-1.9A27 27 0 0 0 21.3 12 27 27 0 0 0 21 8.2Z" />
            <path d="M10.5 14.5v-5l4.5 2.5Z" fill="currentColor" stroke="none" />
          </Social>
        </div>
      </div>
    </footer>
  )
}

function Social({ label, href, children }: { label: string; href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-[var(--stroke)] text-[var(--ink)] hover:bg-[var(--bg-2)]"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        {children}
      </svg>
    </a>
  )
}
