import { useState } from 'react'
import ActionButton from '../components/ActionButton.jsx'
import AppShell from '../components/AppShell.jsx'
import Icon from '../components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SectionCard from '../components/SectionCard.jsx'
import '../css/shared.css'
import '../css/files.css'

const folders = [
  { name: 'Business Communication', detail: '14 files · updated today' },
  { name: 'Data Structures', detail: '21 files · updated yesterday' },
  { name: 'Calculus II', detail: '9 files · updated 10 Nov' },
  { name: 'Physics Lab', detail: '14 files · updated 6 Nov' },
]

const files = [
  { type: 'PPT', name: 'Lecture 5 – Communication Barriers', folder: 'Business Communication', detail: '2.1 MB · Today' },
  { type: 'PDF', name: 'Linked Lists', folder: 'Data Structures', detail: '1.4 MB · Yesterday' },
  { type: 'PPT', name: 'Binary Trees', folder: 'Data Structures', detail: '3.8 MB · Yesterday' },
  { type: 'PDF', name: 'Integration Techniques', folder: 'Calculus II', detail: '900 KB · 10 Nov' },
  { type: 'PDF', name: 'Lab 3 Procedure', folder: 'Physics Lab', detail: '600 KB · 6 Nov' },
]

function FolderCard({ folder }) {
  return (
    <article className="folder-card">
      <Icon className="large-folder-icon" name="folder" size={27} />
      <strong>{folder.name}</strong>
      <small>{folder.detail}</small>
    </article>
  )
}

function FileRow({ file }) {
  return (
    <div className="file-row">
      <span className="file-type">{file.type}</span>
      <span className="file-name"><strong>{file.name}</strong><small>{file.folder}</small></span>
      <span className="file-detail">{file.detail}</span>
      <ActionButton>Download</ActionButton>
    </div>
  )
}

export default function FilesPage() {
  const [search, setSearch] = useState('')
  const matchingFiles = files.filter((file) => `${file.name} ${file.folder}`.toLowerCase().includes(search.toLowerCase()))
  const matchingFolders = folders.filter((folder) => folder.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <AppShell activePage="Files">
      <div className="files-content">
        <PageHeader
          title="Files"
          subtitle="58 files in 4 folders"
          searchPlaceholder="Search files"
          searchValue={search}
          onSearch={(event) => setSearch(event.currentTarget.value)}
          action={<><ActionButton>New folder</ActionButton><ActionButton variant="primary">Upload</ActionButton></>}
        />
        <SectionCard title="Folders" className="folders-panel">
          <div className="folders-grid">
            {matchingFolders.map((folder) => <FolderCard folder={folder} key={folder.name} />)}
            {search === '' && <div className="new-folder-card"><Icon name="plus" size={22} /><strong>New folder</strong></div>}
            {matchingFolders.length === 0 && search !== '' && <p className="files-empty">No folders match your search.</p>}
          </div>
        </SectionCard>
        <SectionCard title="Recent files" className="recent-files-panel">
          <div className="recent-files-list">
            {matchingFiles.map((file) => <FileRow file={file} key={file.name} />)}
            {matchingFiles.length === 0 && <p className="files-empty">No files match your search.</p>}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  )
}
