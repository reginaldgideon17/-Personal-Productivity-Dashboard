import { useState } from 'react'
import AppShell from '../components/AppShell.jsx'
import Icon from '../components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
import '../css/shared.css'
import '../css/settings.css'

const themes = [
  {
    id: 'purple',
    name: 'Soft Purple',
    description: 'Lavender accents with a charcoal sidebar',
    colors: ['#6d5bd0', '#eeeafd', '#20202a'],
  },
  {
    id: 'green',
    name: 'Forest Green',
    description: 'Green accents on a warm, natural canvas',
    colors: ['#39765d', '#dfeee6', '#17372c'],
  },
  {
    id: 'orange',
    name: 'Black & Orange',
    description: 'Bright orange highlights with a black sidebar',
    colors: ['#e66a32', '#fde8dc', '#171719'],
  },
]

export default function SettingsPage() {
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem('my-hub.theme') || 'purple'
    } catch {
      return 'purple'
    }
  })
  const [message, setMessage] = useState('')

  function chooseTheme(themeId) {
    setTheme(themeId)
    document.documentElement.dataset.theme = themeId
    try {
      window.localStorage.setItem('my-hub.theme', themeId)
      setMessage('Theme saved')
    } catch {
      setMessage('Theme changed for this session, but could not be saved.')
    }
  }

  return (
    <AppShell activePage="Settings">
      <div className="settings-content">
        <PageHeader
          title="Settings"
          subtitle="Personalize your My Hub workspace"
        />

        <section className="settings-section">
          <div className="settings-section-heading">
            <span className="settings-section-icon"><Icon name="grid" size={18} /></span>
            <div>
              <h2>Appearance</h2>
              <p>Choose a theme for your dashboard.</p>
            </div>
          </div>

          <div className="theme-grid">
            {themes.map((item) => (
              <button
                aria-pressed={theme === item.id}
                className={`theme-card${theme === item.id ? ' is-selected' : ''}`}
                key={item.id}
                onClick={() => chooseTheme(item.id)}
                type="button"
              >
                <span className="theme-preview" aria-hidden="true">
                  <span style={{ background: item.colors[2] }} />
                  <span style={{ background: item.colors[1] }}>
                    <i style={{ background: item.colors[0] }} />
                    <b />
                    <b />
                  </span>
                </span>
                <span className="theme-card-copy">
                  <strong>{item.name}</strong>
                  <small>{item.description}</small>
                </span>
                <span className="theme-check">
                  {theme === item.id && <Icon name="check" size={14} />}
                </span>
              </button>
            ))}
          </div>
          {message && <p className="settings-message" role="status">{message}</p>}
        </section>
      </div>
    </AppShell>
  )
}
