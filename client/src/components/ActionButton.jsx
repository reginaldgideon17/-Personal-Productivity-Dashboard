export default function ActionButton({ children, variant = 'outline', onClick, href, type = 'button', ariaLabel, pressed }) {
  const className = `action-button action-button-${variant}`

  if (href) {
    return <a aria-label={ariaLabel} className={className} href={href}>{children}</a>
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
