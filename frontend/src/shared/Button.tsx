import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost'

type Props = {
  variant?: Variant
  to?: string
  children: ReactNode
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

function cls(variant: Variant, className: string) {
  const v = variant === 'secondary' ? 'btn-secondary' : variant === 'ghost' ? 'btn-ghost' : 'btn-primary'
  return `btn ${v} ${className}`
}

export function Button({ variant = 'primary', to, children, className = '', ...rest }: Props) {
  if (to) {
    return (
      <Link to={to} className={cls(variant, className)}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={cls(variant, className)} {...rest}>
      {children}
    </button>
  )
}
