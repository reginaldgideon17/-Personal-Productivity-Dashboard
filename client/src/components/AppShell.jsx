import Icon from './Icon.jsx'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const navigation = [
  { label: 'Overview', icon: 'home', href: '/' },
  { label: 'Passwords', icon: 'lock', href: '/passwords' },
  { label: 'Files', icon: 'folder', href: '/files' },
  { label: 'To-do list', icon: 'checkSquare', href: '/todo' },
  { label: 'Notes', icon: 'fileText', href: '/notes' },
]

function getProfile() {
  try {
    const savedProfile = JSON.parse(
      window.localStorage.getItem('my-hub.session')
      || window.sessionStorage.getItem('my-hub.session')
      || 'null'
    )
    return {
      name: typeof savedProfile?.name === 'string' && savedProfile.name.trim()
        ? savedProfile.name.trim()
        : 'Reggie',
      email: typeof savedProfile?.email === 'string' ? savedProfile.email : '',
    }
  } catch {
    return { name: 'Reggie', email: '' }
  }
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function getStorageUsage() {
  let bytes = 0
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (!key?.startsWith('my-hub.')) continue
    bytes += key.length + (window.localStorage.getItem(key)?.length ?? 0)
  }

  const megabytes = bytes / (1024 * 1024)
  return {
    percent: Math.min(100, Math.round((bytes / (5 * 1024 * 1024)) * 100)),
    label: `${megabytes < 0.1 ? '<0.1' : megabytes.toFixed(1)} of 5 MB`,
  }
}

export default function AppShell({ activePage, children }) {
  const navigate = useNavigate()
  const profileRef = useRef(null)
  const [profile, setProfile] = useState(getProfile)
  const [profileOpen, setProfileOpen] = useState(false)
  const { percent: storagePercent, label: storageLabel } = getStorageUsage()

  useEffect(() => {
    if (!profileOpen) return undefined

    function closeOnOutsideClick(event) {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false)
    }

    function closeOnEscape(event) {
      if (event.key === 'Escape') setProfileOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [profileOpen])

  function handleLogout() {
    window.localStorage.removeItem('my-hub.session')
    window.sessionStorage.removeItem('my-hub.session')
    setProfileOpen(false)
    navigate('/login')
  }

  function toggleProfile() {
    setProfile(getProfile())
    setProfileOpen((open) => !open)
  }

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
            <div className="storage-card-label">
              <strong>Storage</strong>
              <small>{storageLabel}</small>
            </div>
            <div className="progress-track" aria-label={`${storagePercent}% of local storage used`}>
              <span style={{ width: `${storagePercent}%` }} />
            </div>
          </div>
          <div className="profile-control" ref={profileRef}>
            <button
              aria-controls="profile-menu"
              aria-expanded={profileOpen}
              aria-label={`Open profile menu for ${profile.name}`}
              className="profile-trigger"
              onClick={toggleProfile}
              type="button"
            >
              <span className="profile-avatar">{getInitials(profile.name)}</span>
              <span className="profile-trigger-copy">
                <strong>{profile.name}</strong>
                <small>{profile.email || 'Personal workspace'}</small>
              </span>
              <Icon className="profile-chevron" name="chevronDown" size={16} />
            </button>
            {profileOpen && (
              <div aria-label="Profile options" className="profile-menu" id="profile-menu">
                <div className="profile-menu-heading">
                  <span className="profile-avatar">{getInitials(profile.name)}</span>
                  <span>
                    <strong>{profile.name}</strong>
                    <small>{profile.email || 'Personal workspace'}</small>
                  </span>
                </div>
                <Link
                  className="profile-menu-item"
                  onClick={() => setProfileOpen(false)}
                  to="/settings"
                >
                  <Icon name="settings" size={17} />
                  <span>Settings</span>
                </Link>
                <button className="profile-menu-item profile-menu-logout" onClick={handleLogout} type="button">
                  <Icon name="logout" size={17} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
      <main className="hub-main">{children}</main>
    </div>
  )
}
