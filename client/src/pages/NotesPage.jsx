import { useState } from 'react'
import ActionButton from '../components/ActionButton.jsx'
import AppShell from '../components/AppShell.jsx'
import Icon from '../components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
import '../css/shared.css'
import '../css/notes.css'

const initialNotes = [
  { id: 1, title: 'Assignment ideas', date: 'Today', category: 'School', content: 'Outline the report first, then gather sources and draft the intro before Friday.\nCheck the marking scheme and keep to the word limit.\nAsk the lecturer about the referencing style.' },
  { id: 2, title: 'Project to-build list', date: 'Yesterday', category: 'Personal', content: 'Login page, notes section, file upload, then the password vault last.' },
  { id: 3, title: 'Exam revision plan', date: '12 Nov', category: 'School', content: 'One course per day, past questions in the evening, slides in the morning.' },
  { id: 4, title: 'Report writing summary', date: '10 Nov', category: 'School', content: 'Plan, draft, edit. Keep paragraphs short and open each one with its main point.' },
  { id: 5, title: 'Dashboard feature ideas', date: '8 Nov', category: 'Project', content: 'Email reminders, dark mode, search across everything, and a trash folder for deleted files.' },
  { id: 6, title: 'Weekend plans', date: '7 Nov', category: 'Personal', content: 'Laundry, call family, cook for the week, one hour of coding practice.' },
]

function NoteCard({ note, selected, onSelect }) {
  return (
    <article className={`note-card${selected ? ' is-selected' : ''}`}>
      <button className="note-card-select" onClick={onSelect} type="button">
        <span><strong>{note.title}</strong><span>{note.date}</span></span>
        <p>{note.content.split('\n')[0]}</p>
      </button>
    </article>
  )
}

export default function NotesPage() {
  const [notes, setNotes] = useState(initialNotes)
  const [selectedId, setSelectedId] = useState(initialNotes[0].id)
  const [search, setSearch] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const selectedNote = notes.find((note) => note.id === selectedId)
  const visibleNotes = notes.filter((note) => `${note.title} ${note.content} ${note.category}`.toLowerCase().includes(search.toLowerCase()))

  function updateSelectedNote(field, value) {
    setNotes((currentNotes) => currentNotes.map((note) => (
      note.id === selectedId ? { ...note, [field]: value } : note
    )))
    setSaveMessage('')
  }

  function createNote() {
    const id = notes.reduce((largestId, note) => Math.max(largestId, note.id), 0) + 1
    const newNote = { id, title: 'Untitled note', date: 'Today', category: 'Personal', content: '' }
    setNotes((currentNotes) => [newNote, ...currentNotes])
    setSelectedId(id)
    setSearch('')
    setSaveMessage('')
  }

  function saveNote() {
    if (!selectedNote) return

    setNotes((currentNotes) => currentNotes.map((note) => (
      note.id === selectedId
        ? { ...note, title: note.title.trim() || 'Untitled note', date: 'Just now' }
        : note
    )))
    setSaveMessage('Saved')
  }

  function deleteNote() {
    const remainingNotes = notes.filter((note) => note.id !== selectedId)
    setNotes(remainingNotes)
    setSelectedId(remainingNotes[0]?.id ?? null)
    setSaveMessage('')
  }

  return (
    <AppShell activePage="Notes">
      <div className="notes-content">
        <PageHeader
          title="Notes"
          subtitle={`${notes.length} notes`}
          searchPlaceholder="Search notes"
          searchValue={search}
          onSearch={(event) => setSearch(event.currentTarget.value)}
          action={<ActionButton onClick={createNote} variant="primary">New note</ActionButton>}
        />
        <div className="notes-layout">
          <div className="notes-list">
            {visibleNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onSelect={() => { setSelectedId(note.id); setSaveMessage('') }}
                selected={note.id === selectedId}
              />
            ))}
            {visibleNotes.length === 0 && <p className="notes-empty">No notes match your search.</p>}
          </div>
          {selectedNote ? (
            <section className="note-editor">
              <div className="editor-toolbar">
                <div>
                  <ActionButton ariaLabel="Bold"><strong>B</strong></ActionButton>
                  <ActionButton ariaLabel="Italic"><em>I</em></ActionButton>
                  <ActionButton ariaLabel="List"><Icon name="list" size={17} /></ActionButton>
                </div>
                <div>
                  <ActionButton ariaLabel="Delete note" onClick={deleteNote}><Icon name="trash" size={15} /></ActionButton>
                  <ActionButton onClick={saveNote} variant="primary"><Icon name="check" size={14} />&nbsp; Save</ActionButton>
                </div>
              </div>
              <article className="editor-content">
                <input
                  aria-label="Note title"
                  className="note-title-input"
                  onChange={(event) => updateSelectedNote('title', event.currentTarget.value)}
                  value={selectedNote.title}
                />
                <div className="note-metadata"><span>{selectedNote.category}</span><small>Edited {selectedNote.date}</small></div>
                <textarea
                  aria-label="Note content"
                  className="note-content-input"
                  onChange={(event) => updateSelectedNote('content', event.currentTarget.value)}
                  value={selectedNote.content}
                />
                <span aria-live="polite" className="save-message">{saveMessage}</span>
              </article>
            </section>
          ) : (
            <section className="note-editor note-editor-empty">Select a note or create a new one.</section>
          )}
        </div>
      </div>
    </AppShell>
  )
}
