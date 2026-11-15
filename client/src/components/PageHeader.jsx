import Icon from './Icon.jsx'

export default function PageHeader({ title, subtitle, searchPlaceholder, searchValue, onSearch, action, className = '' }) {
  return (
    <header className={`page-header ${className}`}>
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="page-header-tools">
        {searchPlaceholder && (
          <label className="search-field">
            <Icon name="search" size={17} />
            <input
              aria-label={searchPlaceholder}
              onChange={onSearch}
              placeholder={searchPlaceholder}
              type="search"
              value={searchValue}
            />
          </label>
        )}
        {action}
      </div>
    </header>
  )
}
