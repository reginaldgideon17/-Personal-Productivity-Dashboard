import { useState } from 'react'
import ActionButton from '../components/ActionButton.jsx'
import AppShell from '../components/AppShell.jsx'
import Icon from '../components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SectionCard from '../components/SectionCard.jsx'
import useLocalStorageState from '../hooks/useLocalStorageState.js'
import '../css/shared.css'
import '../css/files.css'

function FolderCard({ folder, files }) {
  const fileCount = files.filter((file) => file.folderId === folder.id).length

  return (
    <article className="folder-card">
      <Icon className="large-folder-icon" name="folder" size={27} />
      <strong>{folder.name}</strong>
      <small>{fileCount} {fileCount === 1 ? 'file' : 'files'}</small>
    </article>
  )
}

function FileRow({ file, folderName, onDelete }) {
  return (
    <div className="file-row">
      <span className="file-type">{file.type}</span>
      <span className="file-name"><strong>{file.name}</strong><small>{folderName || 'Unfiled'}</small></span>
      <span className="file-detail">{file.sizeLabel}</span>
      <a className="action-button action-button-outline" download={file.name} href={file.content}>Download</a>
      <ActionButton ariaLabel={`Delete ${file.name}`} onClick={() => onDelete(file.id)}>
        <Icon name="trash" size={15} />
      </ActionButton>
    </div>
  )
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FilesPage() {
  const [folders, setFolders, folderStorageError] = useLocalStorageState('my-hub.folders')
  const [files, setFiles, fileStorageError] = useLocalStorageState('my-hub.files')
  const [search, setSearch] = useState('')
  const [newFolderName, setNewFolderName] = useState('')
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [uploadFolderId, setUploadFolderId] = useState('')
  const [uploadError, setUploadError] = useState('')
  const matchingFiles = files.filter((file) => `${file.name} ${file.folderName}`.toLowerCase().includes(search.toLowerCase()))
  const matchingFolders = folders.filter((folder) => folder.name.toLowerCase().includes(search.toLowerCase()))
  const storageError = folderStorageError || fileStorageError

  function addFolder(event) {
    event.preventDefault()
    const name = newFolderName.trim()
    if (!name) return

    setFolders((currentFolders) => [
      { id: Date.now(), name },
      ...currentFolders,
    ])
    setNewFolderName('')
    setShowNewFolder(false)
  }

  function uploadFile(event) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return

    if (file.size > 1024 * 1024) {
      setUploadError('Files must be 1 MB or smaller to fit in browser storage.')
      return
    }

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') {
        setUploadError('This file could not be read.')
        return
      }

      const folder = folders.find((item) => item.id === Number(uploadFolderId))
      setFiles((currentFiles) => [{
        id: Date.now(),
        name: file.name,
        type: file.name.split('.').pop()?.slice(0, 4).toUpperCase() || 'FILE',
        folderId: folder?.id ?? null,
        folderName: folder?.name ?? '',
        sizeLabel: formatSize(file.size),
        content: reader.result,
      }, ...currentFiles])
      setUploadError('')
    })
    reader.addEventListener('error', () => setUploadError('This file could not be read.'))
    reader.readAsDataURL(file)
  }

  function deleteFile(fileId) {
    setFiles((currentFiles) => currentFiles.filter((file) => file.id !== fileId))
  }

  return (
    <AppShell activePage="Files">
      <div className="files-content">
        <PageHeader
          title="Files"
          subtitle={`${files.length} ${files.length === 1 ? 'file' : 'files'} in ${folders.length} ${folders.length === 1 ? 'folder' : 'folders'}`}
          searchPlaceholder="Search files"
          searchValue={search}
          onSearch={(event) => setSearch(event.currentTarget.value)}
          action={
            <>
              <ActionButton onClick={() => setShowNewFolder((shown) => !shown)}>New folder</ActionButton>
              <label className="action-button action-button-primary file-upload-button">
                Upload
                <input accept="*/*" aria-label="Upload a file" onChange={uploadFile} type="file" />
              </label>
            </>
          }
        />
        {(storageError || uploadError) && <p className="files-error" role="alert">{storageError || uploadError}</p>}
        {showNewFolder && (
          <form className="file-create-form" onSubmit={addFolder}>
            <input
              aria-label="Folder name"
              onChange={(event) => setNewFolderName(event.currentTarget.value)}
              placeholder="Folder name"
              value={newFolderName}
            />
            <ActionButton type="submit" variant="primary">Create folder</ActionButton>
          </form>
        )}
        {folders.length > 0 && (
          <label className="file-folder-select">
            Upload to
            <select onChange={(event) => setUploadFolderId(event.currentTarget.value)} value={uploadFolderId}>
              <option value="">Unfiled</option>
              {folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
            </select>
          </label>
        )}
        <SectionCard title="Folders" className="folders-panel">
          <div className="folders-grid">
            {matchingFolders.map((folder) => <FolderCard files={files} folder={folder} key={folder.id} />)}
            {matchingFolders.length === 0 && <p className="files-empty">{search ? 'No folders match your search.' : 'No folders yet. Create one to organize your files.'}</p>}
          </div>
        </SectionCard>
        <SectionCard title="Recent files" className="recent-files-panel">
          <div className="recent-files-list">
            {matchingFiles.map((file) => (
              <FileRow
                file={file}
                folderName={file.folderName}
                key={file.id}
                onDelete={deleteFile}
              />
            ))}
            {matchingFiles.length === 0 && <p className="files-empty">{search ? 'No files match your search.' : 'No files yet. Upload a file to get started.'}</p>}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  )
}
