import { useState } from 'react'
import ActionButton from '../components/ActionButton.jsx'
import AppShell from '../components/AppShell.jsx'
import Icon from '../components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SectionCard from '../components/SectionCard.jsx'
import '../css/shared.css'
import '../css/overview.css'

const summary = [
  { icon: 'checkSquare', value: '3', label: 'Open tasks' },
  { icon: 'lock', value: '24', label: 'Saved logins' },
  { icon: 'folder', value: '58', label: 'Files stored' },
  { icon: 'fileText', value: '12', label: 'Notes' },
]

const tasks = [
  { title: 'Review Data Structures slides', due: 'Today, 9:00 PM' },
  { title: 'Submit Business Communication assignment', due: 'Tomorrow' },
  { title: 'Renew phone data bundle', due: 'Wednesday' },
  { title: 'Back up this week’s lecture slides', due: 'Completed', done: true },
]

const notes = [
  { title: 'Assignment ideas', date: 'Today', text: 'Outline the report first, then gather sources and draft the intro before Friday.' },
  { title: 'Project to-build list', date: 'Yesterday', text: 'Login page, notes section, file upload, then the password vault last.' },
  { title: 'Exam revision plan', date: '12 Nov', text: 'One course per day, past questions in the evening, slides in the morning.' },
]

const folders = [
  { title: 'Business Communication', count: '14 files' },
  { title: 'Data Structures', count: '21 files' },
  { title: 'Calculus II', count: '9 files' },
  { title: 'Physics Lab', count: '14 files' },
]

const logins = [
  { letter: 'G', name: 'Gmail' },
  { letter: 'G', name: 'GitHub' },
  { letter: 'S', name: 'School portal' },
  { letter: 'M', name: 'Mobile money' },
]

function SummaryCard({ item }) {
  return (
    <article className="summary-card">
      <span className="summary-icon"><Icon name={item.icon} size={19} /></span>
      <span><strong>{item.value}</strong><small>{item.label}</small></span>
    </article>
  )
}

export default function OverviewPage() {
  const [search, setSearch] = useState('')
  const matching = (value) => value.toLowerCase().includes(search.toLowerCase())
  const visibleTasks = tasks.filter((task) => matching(`${task.title} ${task.due}`))
  const visibleNotes = notes.filter((note) => matching(`${note.title} ${note.text}`))
  const visibleFolders = folders.filter((folder) => matching(`${folder.title} ${folder.count}`))
  const visibleLogins = logins.filter((login) => matching(login.name))

  return (
    <AppShell activePage="Overview">
      <div className="overview-content">
        <PageHeader
          title="Good evening, Reggie"
          subtitle="Sunday, 15 November 2026"
          searchPlaceholder="Search files, notes, tasks"
          searchValue={search}
          onSearch={(event) => setSearch(event.currentTarget.value)}
          action={<div className="profile-avatar">R</div>}
          className="overview-header"
        />

        <div className="summary-grid">
          {summary.map((item) => <SummaryCard item={item} key={item.label} />)}
        </div>

        <div className="overview-grid">
          <SectionCard title="To-do list" action={<a className="link-label" href="/todo.html">View all</a>} className="overview-tasks">
            <div className="overview-task-list">
              {visibleTasks.map((task) => (
                <div className={`overview-task${task.done ? ' is-done' : ''}`} key={task.title}>
                  <span className="task-check">{task.done && <Icon name="check" size={14} />}</span>
                  <span><strong>{task.title}</strong><small>{task.due}</small></span>
                </div>
              ))}
            </div>
            <div className="add-task-row">
              <a href="/todo.html">Add a task or reminder</a>
              <ActionButton href="/todo.html" variant="primary">Add</ActionButton>
            </div>
          </SectionCard>

          <SectionCard title="Notes" action={<ActionButton href="/notes.html">New note</ActionButton>} className="overview-notes">
            <div className="overview-note-list">
              {visibleNotes.map((note) => (
                <article className="overview-note" key={note.title}>
                  <div><strong>{note.title}</strong><small>{note.date}</small></div>
                  <p>{note.text}</p>
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="School slides"
            action={<><ActionButton href="/files.html">New folder</ActionButton><ActionButton href="/files.html" variant="primary">Upload</ActionButton></>}
            className="overview-folders"
          >
            <div className="overview-folder-grid">
              {visibleFolders.map((folder) => (
                <article className="overview-folder" key={folder.title}>
                  <Icon className="folder-icon" name="folder" size={20} />
                  <strong>{folder.title}</strong>
                  <small>{folder.count}</small>
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Password vault" action={<ActionButton href="/passwords.html" variant="primary">Add login</ActionButton>} className="overview-passwords">
            <div className="overview-login-list">
              {visibleLogins.map((login) => (
                <div className="overview-login" key={login.name}>
                  <span className="login-letter">{login.letter}</span>
                  <span><strong>{login.name}</strong><small>••••••••••••</small></span>
                  <div><ActionButton href="/passwords.html">Reveal</ActionButton><ActionButton href="/passwords.html">Copy</ActionButton></div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  )
}
