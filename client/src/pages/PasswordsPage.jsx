import { useState } from 'react'
import ActionButton from '../components/ActionButton.jsx'
import AppShell from '../components/AppShell.jsx'
import Icon from '../components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
import useLocalStorageState from '../hooks/useLocalStorageState.js'
import '../css/shared.css'
import '../css/passwords.css'

const categoryNames = ['School', 'Social', 'Money', 'Other']
const emptyDraft = { name: '', account: '', category: 'Other', password: '' }

function PasswordRow({ item, visible, onToggle, onCopy, onEdit, onDelete }) {
  return (
    <div className="password-row">
      <span className="password-letter">{item.name.charAt(0).toUpperCase()}</span>
      <span className="password-account"><strong>{item.name}</strong><small>{item.account}</small></span>
      <span className="password-dots">{visible ? item.password : '••••••••••••'}</span>
      <div className="password-actions">
        <ActionButton
          ariaLabel={visible ? `Hide ${item.name} password` : `Reveal ${item.name} password`}
          onClick={() => onToggle(item.id)}
        >
          <Icon name={visible ? 'eyeOff' : 'eye'} size={15} />&nbsp;{visible ? 'Hide' : 'Reveal'}
        </ActionButton>
        <ActionButton onClick={() => onCopy(item.password)}>Copy</ActionButton>
        <ActionButton onClick={() => onEdit(item)}>Edit</ActionButton>
        <ActionButton ariaLabel={`Delete ${item.name}`} onClick={() => onDelete(item.id)}>
          <Icon name="trash" size={15} />
        </ActionButton>
      </div>
    </div>
  )
}

export default function PasswordsPage() {
  const [passwords, setPasswords, storageError] = useLocalStorageState('my-hub.passwords')
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [visiblePasswords, setVisiblePasswords] = useState({})
  const [draft, setDraft] = useState(emptyDraft)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const categories = [
    { name: 'All', label: `All ${passwords.length}` },
    ...categoryNames.map((name) => ({
      name,
      label: `${name} ${passwords.filter((item) => item.category === name).length}`,
    })),
  ]
  const visibleItems = passwords.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category
    const matchesSearch = `${item.name} ${item.account}`.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  function startNewLogin() {
    setDraft(emptyDraft)
    setEditingId(null)
    setFormError('')
    setActionMessage('')
    setShowForm(true)
  }

  function startEditing(item) {
    setDraft({ name: item.name, account: item.account, category: item.category, password: item.password })
    setEditingId(item.id)
    setFormError('')
    setActionMessage('')
    setShowForm(true)
  }

  function saveLogin(event) {
    event.preventDefault()
    const login = {
      ...draft,
      name: draft.name.trim(),
      account: draft.account.trim(),
      password: draft.password.trim(),
    }

    if (!login.name || !login.password) {
      setFormError('Enter a name and password.')
      return
    }

    if (editingId === null) {
      setPasswords((currentPasswords) => [{ ...login, id: Date.now() }, ...currentPasswords])
    } else {
      setPasswords((currentPasswords) => currentPasswords.map((item) => (
        item.id === editingId ? { ...item, ...login } : item
      )))
    }

    setShowForm(false)
    setFormError('')
  }

  function deleteLogin(id) {
    setPasswords((currentPasswords) => currentPasswords.filter((item) => item.id !== id))
    setVisiblePasswords((currentVisibility) => {
      const nextVisibility = { ...currentVisibility }
      delete nextVisibility[id]
      return nextVisibility
    })
  }

  function togglePassword(id) {
    setVisiblePasswords((currentVisibility) => ({
      ...currentVisibility,
      [id]: !currentVisibility[id],
    }))
  }

  async function copyPassword(password) {
    try {
      await navigator.clipboard.writeText(password)
      setActionMessage('Password copied to clipboard.')
    } catch {
      setActionMessage('Could not access the clipboard. Check your browser permissions.')
    }
  }

  return (
    <AppShell activePage="Passwords">
      <div className="passwords-content">
        <PageHeader
          title="Passwords"
          subtitle={`${passwords.length} saved ${passwords.length === 1 ? 'login' : 'logins'}`}
          searchPlaceholder="Search logins"
          searchValue={search}
          onSearch={(event) => setSearch(event.currentTarget.value)}
          action={<ActionButton onClick={startNewLogin} variant="primary">Add login</ActionButton>}
        />

        <div className="password-notice">
          <Icon name="shield" size={19} />
          <span>Logins are saved in this browser’s local storage and are not encrypted. Do not use this vault for sensitive passwords.</span>
        </div>
        {(storageError || actionMessage) && <p className="password-message" role="status">{storageError || actionMessage}</p>}

        {showForm && (
          <form className="password-form" onSubmit={saveLogin}>
            <label>
              Name
              <input autoComplete="off" onChange={(event) => setDraft({ ...draft, name: event.currentTarget.value })} required value={draft.name} />
            </label>
            <label>
              Account
              <input autoComplete="off" onChange={(event) => setDraft({ ...draft, account: event.currentTarget.value })} value={draft.account} />
            </label>
            <label>
              Category
              <select onChange={(event) => setDraft({ ...draft, category: event.currentTarget.value })} value={draft.category}>
                {categoryNames.map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
            <label>
              Password
              <input autoComplete="new-password" onChange={(event) => setDraft({ ...draft, password: event.currentTarget.value })} required type="password" value={draft.password} />
            </label>
            {formError && <p className="password-message" role="alert">{formError}</p>}
            <div className="password-form-actions">
              <ActionButton onClick={() => setShowForm(false)}>Cancel</ActionButton>
              <ActionButton type="submit" variant="primary">{editingId === null ? 'Save login' : 'Update login'}</ActionButton>
            </div>
          </form>
        )}

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
              onCopy={copyPassword}
              onDelete={deleteLogin}
              onEdit={startEditing}
              onToggle={togglePassword}
              visible={Boolean(visiblePasswords[item.id])}
            />
          ))}
          {visibleItems.length === 0 && <p className="passwords-empty">{search ? 'No logins match your search.' : 'No saved logins yet. Add one to get started.'}</p>}
        </section>
      </div>
    </AppShell>
  )
}
