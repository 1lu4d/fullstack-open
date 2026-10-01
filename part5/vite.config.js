import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js',
    include: ['src/**/*.test.{js,jsx}'],
    exclude: ['node_modules', 'tests/**'] // Ибо не пристало погани всякой в мои тесты великие нос свой совать
  }
})
