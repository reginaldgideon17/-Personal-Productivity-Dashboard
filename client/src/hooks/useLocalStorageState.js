import { useCallback, useEffect, useRef, useState } from 'react'

export const EMPTY_LIST = []

export default function useLocalStorageState(key, initialValue = EMPTY_LIST) {
  const [snapshot, setSnapshot] = useState(() => {
    try {
      const savedValue = window.localStorage.getItem(key)
      if (savedValue === null) return { value: initialValue, ready: true, error: '' }

      const value = JSON.parse(savedValue)
      if (!Array.isArray(value)) throw new TypeError('Saved data is not a list.')

      return { value, ready: true, error: '' }
    } catch {
      return { value: initialValue, ready: false, error: 'Saved data could not be read. Your next change will replace it.' }
    }
  })
  const snapshotRef = useRef(snapshot)

  const setValue = useCallback((update) => {
    const current = snapshotRef.current
    const value = typeof update === 'function' ? update(current.value) : update
    let error = ''
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      error = 'Changes could not be saved. This browser’s storage may be full or unavailable.'
    }

    const next = { value, ready: true, error }
    snapshotRef.current = next
    setSnapshot(next)
  }, [key])

  useEffect(() => {
    function syncFromStorage(event) {
      if (event.key !== key) return
      if (event.newValue === null) {
        const next = { value: initialValue, ready: true, error: '' }
        snapshotRef.current = next
        setSnapshot(next)
        return
      }

      try {
        const value = JSON.parse(event.newValue)
        if (!Array.isArray(value)) throw new TypeError('Saved data is not a list.')
        const next = { value, ready: true, error: '' }
        snapshotRef.current = next
        setSnapshot(next)
      } catch {
        const next = { value: initialValue, ready: false, error: 'Saved data could not be read. Your next change will replace it.' }
        snapshotRef.current = next
        setSnapshot(next)
      }
    }

    window.addEventListener('storage', syncFromStorage)
    return () => window.removeEventListener('storage', syncFromStorage)
  }, [initialValue, key])

  return [snapshot.value, setValue, snapshot.error]
}
