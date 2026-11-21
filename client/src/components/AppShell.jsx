import Icon from './Icon.jsx'
import{Link} from 'react-router-dom'

const navigation = [
  { label: 'Overview', icon: 'home', href: '/' },
  { label: 'Passwords', icon: 'lock', href: '/passwords' },
  { label: 'Files', icon: 'folder', href: '/files' },
  { label: 'To-do list', icon: 'checkSquare', href: '/todo' },
  { label: 'Notes', icon: 'fileText', href: '/notes' },
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
            <Link className="hub-nav-item" data-active={activePage === item.label} to={item.href} key={item.label}>
              <span className="hub-nav-icon"><Icon name={item.icon} size={19} /></span>
              <span>{item.label}</span>
            </Link>
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
