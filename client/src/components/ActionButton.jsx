import { Link } from "react-router-dom"
export default function ActionButton({ children, variant = 'outline', onClick, href, type = 'button', ariaLabel, pressed }) {
  const className = `action-button action-button-${variant}`

  if (href) {
    return <Link aria-label={ariaLabel} className={className} to={href}>{children}</Link>
  }

  if (onClick || type !== 'button') {
    return (
      <button
        aria-label={ariaLabel}
        aria-pressed={pressed}
        className={className}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    )
  }

  return <span className={className}>{children}</span>
}
