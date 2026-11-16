import { useState } from 'react'
import ActionButton from '../components/ActionButton.jsx'
import AppShell from '../components/AppShell.jsx'
import Icon from '../components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
import useLocalStorageState from '../hooks/useLocalStorageState.js'
import '../css/shared.css'
import '../css/notes.css'

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
  const [notes, setNotes, storageError] = useLocalStorageState('my-hub.notes')
  const [selectedId, setSelectedId] = useState(null)
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
    const id = Date.now()
    const newNote = { id, title: 'Untitled note', date: 'Just now', category: 'Personal', content: '' }
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
        {storageError && <p className="notes-empty" role="alert">{storageError}</p>}
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
