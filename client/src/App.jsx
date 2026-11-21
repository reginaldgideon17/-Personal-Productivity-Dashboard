import { Routes, Route, Navigate } from 'react-router-dom'
import OverviewPage from './pages/OverviewPage.jsx'
import PasswordsPage from './pages/PasswordsPage.jsx'
import FilesPage from './pages/FilesPage.jsx'
import TodoPage from './pages/TodoPage.jsx'
import NotesPage from './pages/NotesPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<OverviewPage/>}/>
      <Route path="/login" element={<AuthPage mode="login" />}/>
      <Route path="/signup" element={<AuthPage mode="signup" />}/>
      <Route path="/passwords" element={<PasswordsPage />}/>
      <Route path="/password" element={<Navigate to="/passwords" replace />}/>
      <Route path='/todo' element={<TodoPage/>}/>
      <Route path='/files' element={<FilesPage/>}/>
      <Route path='/notes' element={<NotesPage/>}/>
      <Route path='*' element={<Navigate to='/' replace/>}/>


    </Routes>
  )
}
