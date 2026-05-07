import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/test_fenoll_m1_deploy/',
  plugins: [react()],
})
