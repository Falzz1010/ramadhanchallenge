import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['chart.js', 'react-chartjs-2'],
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
})
