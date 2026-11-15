import { useState } from 'react'
import ActionButton from '../components/ActionButton.jsx'
import AppShell from '../components/AppShell.jsx'
import Icon from '../components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
import '../css/shared.css'
import '../css/passwords.css'

const categories = [
  { name: 'All', label: 'All 24' },
  { name: 'School', label: 'School 6' },
  { name: 'Social', label: 'Social 8' },
  { name: 'Money', label: 'Money 4' },
  { name: 'Other', label: 'Other 6' },
]

const passwords = [
  { id: 1, letter: 'G', name: 'Gmail', account: 'reggie@example.com', category: 'Other', password: 'demo-gmail-pass' },
  { id: 2, letter: 'G', name: 'GitHub', account: 'reggie-dev', category: 'Social', password: 'demo-github-pass' },
  { id: 3, letter: 'S', name: 'School portal', account: 'student ID 0000000', category: 'School', password: 'demo-school-pass' },
  { id: 4, letter: 'M', name: 'Mobile money', account: '0XX XXX XXXX', category: 'Money', password: 'demo-money-pass' },
  { id: 5, letter: 'I', name: 'Instagram', account: 'reggie.codes', category: 'Social', password: 'demo-instagram-pass' },
  { id: 6, letter: 'L', name: 'LinkedIn', account: 'reggie@example.com', category: 'Social', password: 'demo-linkedin-pass' },
  { id: 7, letter: 'S', name: 'Student email', account: 'reggie@school.example', category: 'School', password: 'demo-student-pass' },
  { id: 8, letter: 'N', name: 'Netflix', account: 'reggie@example.com', category: 'Other', password: 'demo-netflix-pass' },
]

function PasswordRow({ item, visible, onToggle }) {
  return (
    <div className="password-row">
      <span className="password-letter">{item.letter}</span>
      <span className="password-account"><strong>{item.name}</strong><small>{item.account}</small></span>
      <span className="password-dots">{visible ? item.password : '••••••••••••'}</span>
      <div className="password-actions">
        <ActionButton
          ariaLabel={visible ? `Hide ${item.name} password` : `Reveal ${item.name} password`}
          onClick={() => onToggle(item.id)}
        >
          <Icon name={visible ? 'eyeOff' : 'eye'} size={15} />&nbsp;{visible ? 'Hide' : 'Reveal'}
        </ActionButton>
        <ActionButton>Copy</ActionButton>
        <ActionButton>Edit</ActionButton>
      </div>
    </div>
  )
}

export default function PasswordsPage() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [visiblePasswords, setVisiblePasswords] = useState({})
  const visibleItems = passwords.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category
    const matchesSearch = `${item.name} ${item.account}`.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  function togglePassword(id) {
    setVisiblePasswords((currentVisibility) => ({
      ...currentVisibility,
      [id]: !currentVisibility[id],
    }))
  }

  return (
    <AppShell activePage="Passwords">
      <div className="passwords-content">
        <PageHeader
          title="Passwords"
          subtitle="24 saved logins"
          searchPlaceholder="Search logins"
          searchValue={search}
          onSearch={(event) => setSearch(event.currentTarget.value)}
          action={<ActionButton variant="primary">Add login</ActionButton>}
        />

        <div className="password-notice">
          <Icon name="shield" size={19} />
          <span>Preview data only. Passwords shown here are sample values and are not stored or encrypted.</span>
        </div>

        <div className="password-categories">
          {categories.map((item) => (
            <button
              aria-pressed={category === item.name}
              className={`category-chip${category === item.name ? ' is-selected' : ''}`}
              key={item.name}
              onClick={() => setCategory(item.name)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>

        <section className="password-list">
          {visibleItems.map((item) => (
            <PasswordRow
              item={item}
              key={item.id}
              onToggle={togglePassword}
              visible={Boolean(visiblePasswords[item.id])}
            />
          ))}
          {visibleItems.length === 0 && <p className="passwords-empty">No logins match your search.</p>}
        </section>
      </div>
    </AppShell>
  )
}
