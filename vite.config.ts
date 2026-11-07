import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// The site is served under a path (wro.ralvarez.dev/fe/2027). Workers static assets look files up by
// the full request path, so the build is emitted under dist/<SITE_PATH> and Vite's base is the same path.
// Dev keeps base '/', so `pnpm dev` stays at http://localhost:5173/.
export const SITE_PATH = '/fe/2027'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? `${SITE_PATH}/` : '/',
  build: { outDir: `dist${SITE_PATH}`, emptyOutDir: true },
  plugins: [react()],
  test: { include: ['tests/**/*.test.ts'] },
}))
