import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// base './' keeps the static build deployable under any sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
  test: { include: ['tests/**/*.test.ts'] },
})
