import { useState } from 'react'
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
    <article className="summary-card">
      <span className="summary-icon"><Icon name={item.icon} size={19} /></span>
      <span><strong>{item.value}</strong><small>{item.label}</small></span>
    </article>
  )
}

export default function OverviewPage() {
  const [tasks, , tasksError] = useLocalStorageState('my-hub.tasks')
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
    { icon: 'checkSquare', value: openTasks.length, label: 'Open tasks' },
    { icon: 'lock', value: passwords.length, label: 'Saved logins' },
    { icon: 'folder', value: files.length, label: 'Files stored' },
    { icon: 'fileText', value: notes.length, label: 'Notes' },
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
          <SectionCard title="To-do list" action={<a className="link-label" href="./todo.html">View all</a>} className="overview-tasks">
            <div className="overview-task-list">
              {visibleTasks.map((task) => (
                <div className={`overview-task${task.done ? ' is-done' : ''}`} key={task.id}>
                  <span className="task-check">{task.done && <Icon name="check" size={14} />}</span>
                  <span><strong>{task.title}</strong><small>{task.done ? 'Completed' : task.due}</small></span>
                </div>
              ))}
              {visibleTasks.length === 0 && <p className="overview-empty">{search ? 'No tasks match your search.' : 'No tasks yet.'}</p>}
            </div>
            <div className="add-task-row">
              <a href="./todo.html">Add a task or reminder</a>
              <ActionButton href="./todo.html" variant="primary">Add</ActionButton>
            </div>
          </SectionCard>

          <SectionCard title="Notes" action={<ActionButton href="./notes.html">New note</ActionButton>} className="overview-notes">
            <div className="overview-note-list">
              {visibleNotes.map((note) => (
                <article className="overview-note" key={note.id}>
                  <div><strong>{note.title}</strong><small>{note.date}</small></div>
                  <p>{note.content}</p>
                </article>
              ))}
              {visibleNotes.length === 0 && <p className="overview-empty">{search ? 'No notes match your search.' : 'No notes yet.'}</p>}
            </div>
          </SectionCard>

          <SectionCard
            title="Folders"
            action={<ActionButton href="./files.html">Manage files</ActionButton>}
            className="overview-folders"
          >
            <div className="overview-folder-grid">
              {visibleFolders.map((folder) => {
                const count = files.filter((file) => file.folderId === folder.id).length
                return (
                  <article className="overview-folder" key={folder.id}>
                    <Icon className="folder-icon" name="folder" size={20} />
                    <strong>{folder.name}</strong>
                    <small>{count} {count === 1 ? 'file' : 'files'}</small>
                  </article>
                )
              })}
              {visibleFolders.length === 0 && <p className="overview-empty">{search ? 'No folders match your search.' : 'No folders yet.'}</p>}
            </div>
          </SectionCard>

          <SectionCard title="Password vault" action={<ActionButton href="./passwords.html" variant="primary">Add login</ActionButton>} className="overview-passwords">
            <div className="overview-login-list">
              {visibleLogins.map((login) => (
                <div className="overview-login" key={login.id}>
                  <span className="login-letter">{login.name.charAt(0).toUpperCase()}</span>
                  <span><strong>{login.name}</strong><small>••••••••••••</small></span>
                </div>
              ))}
              {visibleLogins.length === 0 && <p className="overview-empty">{search ? 'No logins match your search.' : 'No saved logins yet.'}</p>}
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  )
}
