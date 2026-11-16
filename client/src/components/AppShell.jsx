import Icon from './Icon.jsx'

const navigation = [
  { label: 'Overview', icon: 'home', href: './index.html' },
  { label: 'Passwords', icon: 'lock', href: './passwords.html' },
  { label: 'Files', icon: 'folder', href: './files.html' },
  { label: 'To-do list', icon: 'checkSquare', href: './todo.html' },
  { label: 'Notes', icon: 'fileText', href: './notes.html' },
]

export default function AppShell({ activePage, children }) {
  return (
    <div className="hub-app">
      <aside className="hub-sidebar">
        <div className="hub-brand">
          <span className="hub-brand-icon"><Icon name="grid" size={20} /></span>
          <span>My Hub</span>
        </div>

        <nav className="hub-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <a className="hub-nav-item" data-active={activePage === item.label} href={item.href} key={item.label}>
              <span className="hub-nav-icon"><Icon name={item.icon} size={19} /></span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="hub-sidebar-bottom">
          <div className="storage-card">
            <strong>Local storage</strong>
            <small>Your data stays in this browser.</small>
          </div>
        </div>
      </aside>
      <main className="hub-main">{children}</main>
    </div>
  )
}
