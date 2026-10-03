import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Served from GitHub Pages at /crash-test-dummy-web/.
export default defineConfig({
  base: '/crash-test-dummy-web/',
  plugins: [react()],
})
