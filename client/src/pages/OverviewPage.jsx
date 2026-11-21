import { useState } from 'react'
import { Link } from 'react-router-dom'
import ActionButton from '../components/ActionButton.jsx'
import AppShell from '../components/AppShell.jsx'
import Icon from '../components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SectionCard from '../components/SectionCard.jsx'
import useLocalStorageState from '../hooks/useLocalStorageState.js'
import '../css/shared.css'
import '../css/overview.css'

function SummaryCard({ item }) {
  return (
    <Link className="summary-card-link" to={item.href}>
      <article className="summary-card">
      <span className="summary-icon"><Icon name={item.icon} size={19} /></span>
      <span><strong>{item.value}</strong><small>{item.label}</small></span>
      </article>
    </Link>
  )
}

export default function OverviewPage() {
  const [tasks, ,tasksError] = useLocalStorageState('my-hub.tasks')
  const [notes, , notesError] = useLocalStorageState('my-hub.notes')
  const [folders, , foldersError] = useLocalStorageState('my-hub.folders')
  const [files, , filesError] = useLocalStorageState('my-hub.files')
  const [passwords, , passwordsError] = useLocalStorageState('my-hub.passwords')
  const [search, setSearch] = useState('')
  const matching = (value) => value.toLowerCase().includes(search.toLowerCase())
  const openTasks = tasks.filter((task) => !task.done)
  const visibleTasks = tasks.filter((task) => matching(`${task.title} ${task.due}`)).slice(0, 4)
  const visibleNotes = notes.filter((note) => matching(`${note.title} ${note.content}`)).slice(0, 3)
  const visibleFolders = folders.filter((folder) => matching(folder.name)).slice(0, 6)
  const visibleLogins = passwords.filter((login) => matching(`${login.name} ${login.account}`)).slice(0, 4)
  const summary = [
    { icon: 'checkSquare', value: openTasks.length, label: 'Open tasks', href: '/todo' },
    { icon: 'lock', value: passwords.length, label: 'Saved logins', href: '/passwords' },
    { icon: 'folder', value: files.length, label: 'Files stored', href: '/files' },
    { icon: 'fileText', value: notes.length, label: 'Notes', href: '/notes' },
  ]
  const [today] = useState(() => new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }))
  const storageError = tasksError || notesError || foldersError || filesError || passwordsError

  return (
    <AppShell activePage="Overview">
      <div className="overview-content">
        <PageHeader
          title="Welcome to My Hub"
          subtitle={today}
          searchPlaceholder="Search files, notes, tasks"
          searchValue={search}
          onSearch={(event) => setSearch(event.currentTarget.value)}
          className="overview-header"
        />
        {storageError && <p className="overview-storage-error" role="alert">{storageError}</p>}

        <div className="summary-grid">
          {summary.map((item) => <SummaryCard item={item} key={item.label} />)}
        </div>

        <div className="overview-grid">
          <SectionCard title="To-do list" action={<Link className="link-label" to="/todo">View all</Link>} className="overview-tasks">
            <div className="overview-task-list">
              {visibleTasks.map((task) => (
                <Link className="overview-item-link" key={task.id} to="/todo">
                  <div className={`overview-task${task.done ? ' is-done' : ''}`}>
                    <span className="task-check">{task.done && <Icon name="check" size={14} />}</span>
                    <span><strong>{task.title}</strong><small>{task.done ? 'Completed' : task.due}</small></span>
                  </div>
                </Link>
              ))}
              {visibleTasks.length === 0 && <p className="overview-empty">{search ? 'No tasks match your search.' : 'No tasks yet.'}</p>}
            </div>
            <div className="add-task-row">
              <Link to="/todo">Add a task or reminder</Link>
              <ActionButton href="/todo" variant="primary">Add</ActionButton>
            </div>
          </SectionCard>

          <SectionCard title="Notes" action={<ActionButton href="/notes">New note</ActionButton>} className="overview-notes">
            <div className="overview-note-list">
              {visibleNotes.map((note) => (
                <Link className="overview-item-link" key={note.id} to="/notes">
                  <article className="overview-note">
                    <div><strong>{note.title}</strong><small>{note.date}</small></div>
                    <p>{note.content}</p>
                  </article>
                </Link>
              ))}
              {visibleNotes.length === 0 && <p className="overview-empty">{search ? 'No notes match your search.' : 'No notes yet.'}</p>}
            </div>
          </SectionCard>

          <SectionCard
            title="Folders"
            action={<ActionButton href="/files">Manage files</ActionButton>}
            className="overview-folders"
          >
            <div className="overview-folder-grid">
              {visibleFolders.map((folder) => {
                const count = files.filter((file) => file.folderId === folder.id).length
                return (
                  <Link className="overview-item-link" key={folder.id} to="/files">
                    <article className="overview-folder">
                      <Icon className="folder-icon" name="folder" size={20} />
                      <strong>{folder.name}</strong>
                      <small>{count} {count === 1 ? 'file' : 'files'}</small>
                    </article>
                  </Link>
                )
              })}
              {visibleFolders.length === 0 && <p className="overview-empty">{search ? 'No folders match your search.' : 'No folders yet.'}</p>}
            </div>
          </SectionCard>

          <SectionCard title="Password vault" action={<ActionButton href="/passwords" variant="primary">Add login</ActionButton>} className="overview-passwords">
            <div className="overview-login-list">
              {visibleLogins.map((login) => (
                <Link className="overview-item-link" key={login.id} to="/passwords">
                  <div className="overview-login">
                    <span className="login-letter">{login.name.charAt(0).toUpperCase()}</span>
                    <span><strong>{login.name}</strong><small>••••••••••••</small></span>
                  </div>
                </Link>
              ))}
              {visibleLogins.length === 0 && <p className="overview-empty">{search ? 'No logins match your search.' : 'No saved logins yet.'}</p>}
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  )
}
