import { useState } from 'react'
import ActionButton from '../components/ActionButton.jsx'
import AppShell from '../components/AppShell.jsx'
import Icon from '../components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SectionCard from '../components/SectionCard.jsx'
import useLocalStorageState from '../hooks/useLocalStorageState.js'
import '../css/shared.css'
import '../css/todo.css'

const filters = ['All', 'Today', 'Upcoming', 'Done']

function TodoRow({ task, onToggle }) {
  return (
    <div className={`todo-row${task.done ? ' is-done' : ''}`}>
      <button
        aria-label={`${task.done ? 'Mark incomplete' : 'Mark complete'}: ${task.title}`}
        aria-pressed={task.done}
        className="todo-checkbox"
        onClick={() => onToggle(task.id)}
        type="button"
      >
        {task.done && <Icon name="check" size={15} />}
      </button>
      <span className="todo-copy"><strong>{task.title}</strong><small>{task.done ? 'Completed' : task.due}</small></span>
      <span className={`todo-category category-${task.category.toLowerCase()}`}>{task.category}</span>
    </div>
  )
}

export default function TodoPage() {
  const [tasks, setTasks, storageError] = useLocalStorageState('my-hub.tasks')
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const completedCount = tasks.filter((task) => task.done).length
  const openCount = tasks.length - completedCount
  const completion = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0
  const nextTask = tasks.find((task) => !task.done)
  const visibleTasks = tasks.filter((task) => {
    const matchesSearch = `${task.title} ${task.category} ${task.due}`.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'All'
      || (filter === 'Done' && task.done)
      || (filter === 'Today' && !task.done && task.due.startsWith('Today'))
      || (filter === 'Upcoming' && !task.done && !task.due.startsWith('Today'))

    return matchesSearch && matchesFilter
  })

  function addTask(event) {
    event.preventDefault()
    const title = draft.trim()
    if (!title) {
      setError('Enter a task name to add it.')
      return
    }

    setTasks((currentTasks) => {
      const id = currentTasks.reduce((largestId, task) => Math.max(largestId, task.id), 0) + 1
      return [{ id, title, due: 'Today', category: 'Personal' }, ...currentTasks]
    })
    setDraft('')
    setFilter('All')
    setError('')
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === taskId ? { ...task, done: !task.done } : task
    )))
  }

  return (
    <AppShell activePage="To-do list">
      <div className="todo-content">
        <PageHeader
          title="To-do list"
          subtitle={`${openCount} open · ${completedCount} done`}
          searchPlaceholder="Search tasks"
          searchValue={search}
          onSearch={(event) => setSearch(event.currentTarget.value)}
          className="todo-page-header"
        />
        {storageError && <p className="todo-error" role="alert">{storageError}</p>}
        <div className="todo-layout">
          <SectionCard className="todo-list-panel">
            <form className="todo-add-row" onSubmit={addTask}>
              <input
                aria-label="Add a task or reminder"
                aria-invalid={Boolean(error)}
                onChange={(event) => setDraft(event.currentTarget.value)}
                onInput={() => setError('')}
                placeholder="Add a task or reminder"
                value={draft}
              />
              <ActionButton type="submit" variant="primary">Add</ActionButton>
              {error && <span className="todo-error" role="alert">{error}</span>}
            </form>
            <div className="todo-filters">
              {filters.map((filterLabel) => (
                <button
                  aria-pressed={filter === filterLabel}
                  className={`todo-filter${filter === filterLabel ? ' is-selected' : ''}`}
                  key={filterLabel}
                  onClick={() => setFilter(filterLabel)}
                  type="button"
                >
                  {filterLabel}
                </button>
              ))}
            </div>
            <div className="todo-rows">
              {visibleTasks.map((task) => <TodoRow key={task.id} onToggle={toggleTask} task={task} />)}
              {visibleTasks.length === 0 && <p className="todo-empty">No tasks match this view.</p>}
            </div>
          </SectionCard>

          <SectionCard title="Progress" className="progress-panel">
            <div className="progress-number"><strong>{completion}%</strong><span>of tasks done</span></div>
            <div className="progress-track"><span style={{ width: `${completion}%` }} /></div>
            <div className="next-reminder">
              <strong>Next reminder</strong>
              <b>{nextTask?.title || 'All tasks are complete'}</b>
              {nextTask && <span>{nextTask.due}</span>}
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  )
}
