import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        overview: fileURLToPath(new URL('./index.html', import.meta.url)),
        passwords: fileURLToPath(new URL('./passwords.html', import.meta.url)),
        files: fileURLToPath(new URL('./files.html', import.meta.url)),
        todo: fileURLToPath(new URL('./todo.html', import.meta.url)),
        notes: fileURLToPath(new URL('./notes.html', import.meta.url)),
      },
    },
  },
})
